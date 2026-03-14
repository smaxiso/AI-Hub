"""
Sync scraped tools into Supabase.
Handles deduplication by URL and name matching.
"""

import os
import re
import json
import logging
from datetime import datetime, timezone

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')


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


def fetch_existing_tools(supabase):
    """Fetch all existing tools from DB for dedup."""
    result = supabase.table('tools').select('id, name, url').execute()
    tools = result.data or []

    # Build lookup sets
    existing_urls = set()
    existing_names = set()
    existing_ids = set()

    for t in tools:
        if t.get('url'):
            # Normalize URL for comparison
            url = t['url'].lower().rstrip('/')
            existing_urls.add(url)
        if t.get('name'):
            existing_names.add(t['name'].lower().strip())
        if t.get('id'):
            existing_ids.add(t['id'])

    return existing_urls, existing_names, existing_ids


def is_duplicate(tool, existing_urls, existing_names, existing_ids):
    """Check if a tool already exists by URL, name, or ID."""
    tool_id = slugify(tool.get('name', ''))
    if tool_id in existing_ids:
        return True

    url = (tool.get('url') or '').lower().rstrip('/')
    if url and url in existing_urls:
        return True

    name = (tool.get('name') or '').lower().strip()
    if name and name in existing_names:
        return True

    return False


def sync_tools(scraped_tools, dry_run=False):
    """
    Sync scraped tools into Supabase.
    Returns (inserted_count, skipped_count, errors).
    """
    supabase = get_supabase()
    existing_urls, existing_names, existing_ids = fetch_existing_tools(supabase)

    logger.info(f'Existing tools in DB: {len(existing_ids)}')
    logger.info(f'Scraped tools to process: {len(scraped_tools)}')

    inserted = 0
    skipped = 0
    errors = []
    new_tools = []

    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    for tool in scraped_tools:
        name = (tool.get('name') or '').strip()
        if not name or len(name) < 2:
            skipped += 1
            continue

        if is_duplicate(tool, existing_urls, existing_names, existing_ids):
            skipped += 1
            continue

        tool_id = slugify(name)
        # Ensure unique ID
        base_id = tool_id
        counter = 2
        while tool_id in existing_ids:
            tool_id = f'{base_id}-{counter}'
            counter += 1

        # Build the record
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
        existing_ids.add(tool_id)
        existing_names.add(name.lower().strip())
        if record['url']:
            existing_urls.add(record['url'].lower().rstrip('/'))

    logger.info(f'New tools to insert: {len(new_tools)}')
    logger.info(f'Skipped (duplicates/invalid): {skipped}')

    if dry_run:
        logger.info('DRY RUN — not inserting into database')
        for t in new_tools:
            logger.info(f'  Would insert: {t["name"]} [{t["category"]}] — {t["url"]}')
        return len(new_tools), skipped, errors

    # Insert in batches of 20
    batch_size = 20
    for i in range(0, len(new_tools), batch_size):
        batch = new_tools[i:i + batch_size]
        try:
            result = supabase.table('tools').insert(batch).execute()
            inserted += len(batch)
            logger.info(f'  Inserted batch {i // batch_size + 1}: {len(batch)} tools')
        except Exception as e:
            error_msg = f'Batch insert error at index {i}: {e}'
            logger.error(error_msg)
            errors.append(error_msg)
            # Try one-by-one for this batch
            for record in batch:
                try:
                    supabase.table('tools').insert(record).execute()
                    inserted += 1
                except Exception as e2:
                    err = f'Failed to insert {record["name"]}: {e2}'
                    logger.error(err)
                    errors.append(err)

    return inserted, skipped, errors


def _extract_domain(url):
    """Extract domain from URL for clearbit logo fallback."""
    if not url:
        return ''
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        return parsed.netloc or ''
    except Exception:
        return ''


def save_scrape_report(scraped, inserted, skipped, errors, filename='last_scrape_report.json'):
    """Save a JSON report of the last scrape run."""
    report = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'total_scraped': len(scraped),
        'inserted': inserted,
        'skipped': skipped,
        'errors': errors,
        'new_tools': [
            {'name': t.get('name'), 'category': t.get('category'), 'url': t.get('url', t.get('detail_url', ''))}
            for t in scraped
        ][:50],  # Cap report size
    }
    with open(filename, 'w') as f:
        json.dump(report, f, indent=2)
    logger.info(f'Report saved to {filename}')
