"""
Sync scraped tools into Supabase.
Handles deduplication, INSERT new tools, and UPDATE existing tools with richer data.
Produces an audit report of all changes.
"""

import os
import re
import json
import logging
from datetime import datetime, timezone
from urllib.parse import urlparse

from dotenv import load_dotenv
from supabase import create_client
from config import is_blocked, is_junk_name

load_dotenv()

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

# Fields we compare for updates — if scraped data is richer, we update
UPDATABLE_FIELDS = ['description', 'pricing', 'categories', 'tags', 'icon']


def get_supabase():
    """Create Supabase client."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env')
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def slugify(name):
    """Generate a URL-safe ID from a tool name."""
    slug = name.lower().strip()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')


def _extract_domain(url):
    """Extract domain from URL for clearbit logo fallback."""
    if not url:
        return ''
    try:
        parsed = urlparse(url)
        return parsed.netloc or ''
    except Exception:
        return ''


def fetch_existing_tools(supabase):
    """
    Fetch all existing tools from DB with full data for update comparison.
    Returns (tools_by_id, tools_by_name, tools_by_url) lookup dicts.
    """
    result = supabase.table('tools').select('*').execute()
    all_tools = result.data or []

    by_id = {}
    by_name = {}
    by_url = {}

    for t in all_tools:
        tid = t.get('id', '')
        if tid:
            by_id[tid] = t
        name = (t.get('name') or '').lower().strip()
        if name:
            by_name[name] = t
        url = (t.get('url') or '').lower().rstrip('/')
        if url:
            by_url[url] = t

    return by_id, by_name, by_url


def find_existing(tool, by_id, by_name, by_url):
    """
    Find an existing DB record matching this scraped tool.
    Returns the existing record dict or None.
    """
    tool_id = slugify(tool.get('name', ''))
    if tool_id in by_id:
        return by_id[tool_id]

    url = (tool.get('url') or '').lower().rstrip('/')
    if url and url in by_url:
        return by_url[url]

    name = (tool.get('name') or '').lower().strip()
    if name and name in by_name:
        return by_name[name]

    return None


def compute_updates(existing, scraped):
    """
    Compare existing DB record with scraped data.
    Returns a dict of fields to update (only where scraped data is richer/newer).
    """
    updates = {}

    # Description: update if scraped is longer and non-empty
    scraped_desc = (scraped.get('description') or '').strip()
    existing_desc = (existing.get('description') or '').strip()
    if scraped_desc and len(scraped_desc) > len(existing_desc) + 20:
        updates['description'] = scraped_desc[:500]

    # Categories: merge — add any new categories from scrape
    existing_cats = existing.get('categories') or [existing.get('category', 'Chat')]
    scraped_cats = scraped.get('categories') or []
    merged_cats = list(existing_cats)
    for cat in scraped_cats:
        if cat and cat not in merged_cats:
            merged_cats.append(cat)
    if len(merged_cats) > len(existing_cats):
        updates['categories'] = merged_cats

    # Tags: merge — add new tags
    existing_tags = existing.get('tags') or []
    scraped_tags = scraped.get('tags') or []
    merged_tags = list(existing_tags)
    for tag in scraped_tags:
        if tag and tag not in merged_tags:
            merged_tags.append(tag)
    merged_tags = merged_tags[:15]
    if len(merged_tags) > len(existing_tags):
        updates['tags'] = merged_tags

    # Icon: update if existing has no icon or uses clearbit fallback
    scraped_icon = (scraped.get('icon') or '').strip()
    existing_icon = (existing.get('icon') or '').strip()
    if scraped_icon and (not existing_icon or 'clearbit.com' in existing_icon):
        updates['icon'] = scraped_icon

    # Pricing: update if existing is generic 'Freemium' and scraped is specific
    scraped_pricing = (scraped.get('pricing') or '').strip()
    existing_pricing = (existing.get('pricing') or '').strip()
    if scraped_pricing and scraped_pricing != 'Freemium' and existing_pricing == 'Freemium':
        updates['pricing'] = scraped_pricing

    return updates


def sync_tools(scraped_tools, dry_run=False):
    """
    Sync scraped tools into Supabase.
    - INSERT new tools
    - UPDATE existing tools where scraped data is richer
    Returns an audit dict: {inserted, updated, unchanged, skipped, errors, details}
    """
    supabase = get_supabase()
    by_id, by_name, by_url = fetch_existing_tools(supabase)

    logger.info(f'Existing tools in DB: {len(by_id)}')
    logger.info(f'Scraped tools to process: {len(scraped_tools)}')

    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    audit = {
        'inserted': 0,
        'updated': 0,
        'unchanged': 0,
        'skipped': 0,
        'errors': [],
        'details': {
            'new_tools': [],
            'updated_tools': [],
            'skipped_tools': [],
        },
    }

    new_tools = []

    for tool in scraped_tools:
        name = (tool.get('name') or '').strip()
        if not name or len(name) < 2:
            audit['skipped'] += 1
            continue

        url = tool.get('url', tool.get('detail_url', ''))

        # Blocklist + quality check
        if is_blocked(name, url):
            audit['skipped'] += 1
            audit['details']['skipped_tools'].append({'name': name, 'reason': 'blocklist'})
            logger.debug(f'  Blocked: {name}')
            continue

        if is_junk_name(name):
            audit['skipped'] += 1
            audit['details']['skipped_tools'].append({'name': name, 'reason': 'junk_name'})
            logger.debug(f'  Junk name: {name}')
            continue

        existing = find_existing(tool, by_id, by_name, by_url)

        if existing:
            # Check if we should update
            updates = compute_updates(existing, tool)
            if updates:
                if dry_run:
                    logger.info(f'  Would update: {name} — fields: {list(updates.keys())}')
                    audit['updated'] += 1
                    audit['details']['updated_tools'].append({
                        'name': name,
                        'id': existing['id'],
                        'fields': list(updates.keys()),
                    })
                else:
                    try:
                        supabase.table('tools').update(updates).eq('id', existing['id']).execute()
                        audit['updated'] += 1
                        audit['details']['updated_tools'].append({
                            'name': name,
                            'id': existing['id'],
                            'fields': list(updates.keys()),
                        })
                        logger.info(f'  Updated: {name} — {list(updates.keys())}')
                    except Exception as e:
                        err = f'Update failed for {name}: {e}'
                        logger.error(err)
                        audit['errors'].append(err)
            else:
                audit['unchanged'] += 1
            continue

        # New tool — prepare for insert
        tool_id = slugify(name)
        base_id = tool_id
        counter = 2
        while tool_id in by_id:
            tool_id = f'{base_id}-{counter}'
            counter += 1

        category = tool.get('category', 'Chat')
        categories = tool.get('categories', [category])
        if category not in categories:
            categories.insert(0, category)

        record = {
            'id': tool_id,
            'name': name,
            'url': tool.get('url', tool.get('detail_url', '')),
            'category': category,
            'categories': categories,
            'description': (tool.get('description') or '')[:500],
            'tags': tool.get('tags', [])[:10],
            'pricing': tool.get('pricing', 'Freemium'),
            'icon': tool.get('icon', f'https://logo.clearbit.com/{_extract_domain(tool.get("url", ""))}'),
            'use_cases': tool.get('use_cases', []),
            'added_date': today,
        }

        new_tools.append(record)
        by_id[tool_id] = record
        by_name[name.lower().strip()] = record
        if record['url']:
            by_url[record['url'].lower().rstrip('/')] = record

    logger.info(f'New tools to insert: {len(new_tools)}')
    logger.info(f'Tools to update: {audit["updated"]}')
    logger.info(f'Unchanged: {audit["unchanged"]}')
    logger.info(f'Skipped: {audit["skipped"]}')

    if dry_run:
        for t in new_tools:
            logger.info(f'  Would insert: {t["name"]} [{t["category"]}] — {t["url"]}')
            audit['details']['new_tools'].append({
                'name': t['name'], 'category': t['category'], 'url': t['url'],
            })
        audit['inserted'] = len(new_tools)
        return audit

    # Batch insert new tools
    batch_size = 20
    for i in range(0, len(new_tools), batch_size):
        batch = new_tools[i:i + batch_size]
        try:
            supabase.table('tools').insert(batch).execute()
            audit['inserted'] += len(batch)
            logger.info(f'  Inserted batch {i // batch_size + 1}: {len(batch)} tools')
            for t in batch:
                audit['details']['new_tools'].append({
                    'name': t['name'], 'category': t['category'], 'url': t['url'],
                })
        except Exception as e:
            logger.error(f'Batch insert error at index {i}: {e}')
            for record in batch:
                try:
                    supabase.table('tools').insert(record).execute()
                    audit['inserted'] += 1
                    audit['details']['new_tools'].append({
                        'name': record['name'], 'category': record['category'], 'url': record['url'],
                    })
                except Exception as e2:
                    err = f'Failed to insert {record["name"]}: {e2}'
                    logger.error(err)
                    audit['errors'].append(err)

    return audit


def save_scrape_report(audit, scraped_count, filename='last_scrape_report.json'):
    """Save a JSON audit report of the last scrape run."""
    report = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'total_scraped': scraped_count,
        'inserted': audit['inserted'],
        'updated': audit['updated'],
        'unchanged': audit['unchanged'],
        'skipped': audit['skipped'],
        'errors': audit['errors'],
        'new_tools': audit['details']['new_tools'][:100],
        'updated_tools': audit['details']['updated_tools'][:100],
    }
    with open(filename, 'w') as f:
        json.dump(report, f, indent=2)
    logger.info(f'Report saved to {filename}')
