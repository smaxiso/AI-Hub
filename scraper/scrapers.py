"""
Generic config-driven AI tool scraper using Scrapling.
Reads selectors from sources.json to scrape any configured site.
"""

import re
import time
import logging
from urllib.parse import urljoin

from scrapling.fetchers import Fetcher, StealthyFetcher
from config import CATEGORY_MAP, PRICING_MAP

logger = logging.getLogger(__name__)

FETCHERS = {
    'stealthy': StealthyFetcher,
    'basic': Fetcher,
}


def _first(elements):
    """Safely get first element from a css() result list."""
    return elements[0] if elements else None


def normalize_category(raw_category):
    """Map an external category string to one of our 14 categories."""
    if not raw_category:
        return None
    key = raw_category.lower().strip().lstrip('#')
    return CATEGORY_MAP.get(key)


def normalize_pricing(raw_pricing):
    """Map pricing text to Free/Freemium/Paid."""
    if not raw_pricing:
        return 'Freemium'
    key = raw_pricing.lower().strip()
    return PRICING_MAP.get(key, 'Freemium')


def slugify(name):
    """Generate a URL-safe ID from a tool name."""
    slug = name.lower().strip()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')


def scrape_site(site_config):
    """
    Generic scraper that reads selectors from a site config dict.
    Returns a list of tool dicts.
    """
    name = site_config['name']
    base_url = site_config['base_url']
    pages = site_config.get('pages', [])
    sel = site_config.get('selectors', {})
    delay = site_config.get('delay_seconds', 2)
    fetcher_name = site_config.get('fetcher', 'stealthy')
    fetcher_cls = FETCHERS.get(fetcher_name, StealthyFetcher)

    tools = []
    seen_slugs = set()

    for page_info in pages:
        page_url = page_info['url']
        default_category = page_info.get('default_category', 'Chat')

        logger.info(f'[{name}] Scraping: {page_url}')
        try:
            page = fetcher_cls.fetch(page_url, headless=True, network_idle=True)
        except Exception as e:
            logger.error(f'[{name}] Failed to fetch {page_url}: {e}')
            continue

        card_selector = sel.get('card', '[class*="card"]')
        cards = page.css(card_selector)
        logger.info(f'[{name}]   Found {len(cards)} cards')

        for card in cards:
            try:
                tool = _parse_card(card, sel, base_url, default_category, seen_slugs, tools, name)
                if tool:
                    tools.append(tool)
            except Exception as e:
                logger.warning(f'[{name}]   Card parse error: {e}')

        if delay > 0 and page_info != pages[-1]:
            time.sleep(delay)

    # Clean internal fields
    for t in tools:
        t.pop('_slug', None)

    logger.info(f'[{name}] Total: {len(tools)} unique tools scraped')
    return tools


def _parse_card(card, sel, base_url, default_category, seen_slugs, tools, source_name):
    """
    Parse a single tool card using the selector config.
    Returns a tool dict or None if duplicate/invalid.
    """
    slug_split = sel.get('detail_slug_split', '/tool/')

    # --- Determine slug and detail URL ---
    detail_link_sel = sel.get('detail_link')
    if detail_link_sel:
        # Card contains a separate detail link element
        detail_links = card.css(detail_link_sel)
        detail_link = _first(detail_links)
        if not detail_link:
            return None
        href = detail_link.attrib.get('href', '')
    else:
        # The card itself is the link (e.g. toolify)
        href = card.attrib.get('href', '')

    if not href:
        return None

    slug = href.split(slug_split)[-1].strip('/') if slug_split in href else ''
    if not slug:
        return None

    # Dedup: if already seen, just merge category
    if slug in seen_slugs:
        for t in tools:
            if t.get('_slug') == slug and default_category not in t['categories']:
                t['categories'].append(default_category)
        return None
    seen_slugs.add(slug)

    detail_url = href if href.startswith('http') else urljoin(base_url, href)

    # --- Extract name ---
    name_sel = sel.get('name', 'p')
    name_max = sel.get('name_max_length', 60)
    name = ''
    for el in card.css(name_sel):
        text = (el.text or '').strip()
        if text and len(text) < name_max and not text.startswith('Rated'):
            name = text
            break
    if not name:
        name = slug.replace('-', ' ').title()
    if not name or len(name) < 2:
        return None

    # --- Extract description ---
    desc_sel = sel.get('description', 'p')
    desc_min = sel.get('description_min_length', 20)
    description = ''
    for el in card.css(desc_sel):
        text = (el.text or '').strip()
        if text and len(text) > desc_min and text != name:
            description = text
            break

    # --- Extract pricing ---
    pricing = 'Freemium'
    pricing_sel = sel.get('pricing')
    pricing_keywords = sel.get('pricing_keywords', [])
    if pricing_sel and pricing_keywords:
        for el in card.css(pricing_sel):
            text = (el.text or '').strip().lower()
            if text in pricing_keywords:
                pricing = normalize_pricing(text)
                break

    # --- Extract category tags ---
    tags = []
    categories = set()
    categories.add(default_category)
    cat_tag_sel = sel.get('category_tags')
    if cat_tag_sel:
        for el in card.css(cat_tag_sel):
            text = (el.text or '').strip().lstrip('#')
            if text and len(text) < 40:
                tags.append(text.lower())
                mapped = normalize_category(text)
                if mapped:
                    categories.add(mapped)

    # --- Extract icon ---
    icon = ''
    icon_sel = sel.get('icon')
    if icon_sel:
        imgs = card.css(icon_sel)
        if imgs:
            src = imgs[0].attrib.get('src', '')
            if src and ('http' in src or src.startswith('/')):
                icon = src if src.startswith('http') else urljoin(base_url, src)

    # --- Extract external URL ---
    ext_url = ''
    ext_indicator = sel.get('external_link_indicator')
    ext_exclude = sel.get('external_link_exclude')
    if ext_indicator:
        for a in card.css('a'):
            a_href = a.attrib.get('href', '')
            if ext_indicator in a_href:
                if ext_exclude and ext_exclude in a_href:
                    continue
                ext_url = a_href.split('?')[0]
                break

    return {
        '_slug': slug,
        'name': name,
        'url': ext_url or detail_url,
        'detail_url': detail_url,
        'category': default_category,
        'categories': list(categories),
        'tags': tags[:10],
        'pricing': pricing,
        'description': description[:500],
        'icon': icon,
        'source': source_name,
    }


def enrich_tool_details(tool, fetcher_class=Fetcher):
    """Visit a tool's detail page to get richer data."""
    detail_url = tool.get('detail_url', '')
    if not detail_url:
        return tool

    try:
        page = fetcher_class.get(detail_url)

        # External website link
        visit_links = page.css('a[href*="utm_source"], a[rel="nofollow"][target="_blank"]')
        visit_link = _first(visit_links)
        if visit_link:
            ext_url = visit_link.attrib.get('href', '')
            if ext_url and 'http' in ext_url:
                tool['url'] = ext_url.split('?')[0]

        # Fuller description from meta
        desc_els = page.css('meta[name="description"]')
        desc_el = _first(desc_els)
        if desc_el:
            meta_desc = desc_el.attrib.get('content', '').strip()
            if meta_desc and len(meta_desc) > len(tool.get('description', '')):
                tool['description'] = meta_desc[:500]

        # Icon/logo
        if not tool.get('icon'):
            icon_els = page.css('img[alt*="logo"], img[class*="logo"]')
            icon_el = _first(icon_els)
            if icon_el:
                icon_src = icon_el.attrib.get('src', '')
                if icon_src and icon_src.startswith('http'):
                    tool['icon'] = icon_src

    except Exception as e:
        logger.warning(f'Could not enrich {detail_url}: {e}')

    return tool
