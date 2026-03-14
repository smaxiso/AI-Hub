"""
AI tool scrapers using Scrapling.
Each scraper function returns a list of dicts with tool data.
"""

import re
import time
import logging
from urllib.parse import urljoin

from scrapling.fetchers import Fetcher, StealthyFetcher
from config import CATEGORY_MAP, PRICING_MAP

logger = logging.getLogger(__name__)


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


def scrape_futurepedia():
    """
    Scrape AI tools from Futurepedia using StealthyFetcher.
    
    Card structure (March 2026):
    - [class*="card"] wraps each tool
    - First <p> = tool name, second <p> = description
    - <span> with pricing text = pricing
    - a[href*="/ai-tools/"] = category tags
    - img = icon/logo
    - a[href*="/tool/"] = detail page link
    - a with utm_source = external website URL
    """
    tools = []
    seen_slugs = set()

    category_pages = [
        ('https://www.futurepedia.io/ai-tools/chatbots', 'Chat'),
        ('https://www.futurepedia.io/ai-tools/text-to-image', 'Image'),
        ('https://www.futurepedia.io/ai-tools/image-editing', 'Image'),
        ('https://www.futurepedia.io/ai-tools/video-generators', 'Video'),
        ('https://www.futurepedia.io/ai-tools/video', 'Video'),
        ('https://www.futurepedia.io/ai-tools/audio-generators', 'Audio'),
        ('https://www.futurepedia.io/ai-tools/code-assistant', 'Coding'),
        ('https://www.futurepedia.io/ai-tools/ai-agents', 'Agent'),
        ('https://www.futurepedia.io/ai-tools/writing-generators', 'Writing'),
        ('https://www.futurepedia.io/ai-tools/design-generators', 'Design'),
        ('https://www.futurepedia.io/ai-tools/productivity', 'Productivity'),
        ('https://www.futurepedia.io/ai-tools/research-assistant', 'Research'),
        ('https://www.futurepedia.io/ai-tools/3D-generator', '3D'),
        ('https://www.futurepedia.io/ai-tools/marketing', 'Business'),
        ('https://www.futurepedia.io/ai-tools/email-assistant', 'Productivity'),
    ]

    for page_url, default_category in category_pages:
        logger.info(f'Scraping Futurepedia: {page_url}')
        try:
            page = StealthyFetcher.fetch(
                page_url,
                headless=True,
                network_idle=True,
            )
        except Exception as e:
            logger.error(f'Failed to fetch {page_url}: {e}')
            continue

        cards = page.css('[class*="card"]')
        logger.info(f'  Found {len(cards)} tool cards')

        for card in cards:
            try:
                _parse_futurepedia_card(card, default_category, tools, seen_slugs)
            except Exception as e:
                logger.warning(f'  Card parse error: {e}')
                continue

        time.sleep(2)

    # Clean up internal fields
    for t in tools:
        t.pop('_slug', None)

    logger.info(f'Futurepedia total: {len(tools)} unique tools scraped')
    return tools


def _parse_futurepedia_card(card, default_category, tools, seen_slugs):
    """Parse a single Futurepedia tool card."""
    # Get detail page link and slug
    detail_links = card.css('a[href*="/tool/"]')
    detail_link = _first(detail_links)
    if not detail_link:
        return

    href = detail_link.attrib.get('href', '')
    slug = href.split('/tool/')[-1].strip('/')
    if not slug:
        return

    # If already seen, just add category
    if slug in seen_slugs:
        for t in tools:
            if t.get('_slug') == slug and default_category not in t['categories']:
                t['categories'].append(default_category)
        return
    seen_slugs.add(slug)

    detail_url = urljoin('https://www.futurepedia.io', href)

    # Extract name: first <p> with short text
    name = ''
    for p in card.css('p'):
        text = (p.text or '').strip()
        if text and len(text) < 60 and not text.startswith('Rated'):
            name = text
            break

    if not name:
        name = slug.replace('-', ' ').title()

    # Extract description: second <p> with longer text
    description = ''
    for p in card.css('p'):
        text = (p.text or '').strip()
        if text and len(text) > 20 and text != name:
            description = text
            break

    # Extract pricing from <span>
    pricing = 'Freemium'
    for span in card.css('span'):
        text = (span.text or '').strip().lower()
        if text in ('free', 'freemium', 'paid', 'free trial'):
            pricing = normalize_pricing(text)
            break

    # Extract category tags
    tags = []
    categories = set()
    categories.add(default_category)
    for tag_link in card.css('a[href*="/ai-tools/"]'):
        tag_text = (tag_link.text or '').strip().lstrip('#')
        if tag_text and len(tag_text) < 40:
            tags.append(tag_text.lower())
            mapped = normalize_category(tag_text)
            if mapped:
                categories.add(mapped)

    # Extract icon URL
    icon = ''
    imgs = card.css('img')
    if imgs:
        src = imgs[0].attrib.get('src', '')
        if src and ('http' in src or src.startswith('/')):
            icon = src if src.startswith('http') else urljoin('https://www.futurepedia.io', src)

    # Extract external website URL (link with utm_source)
    ext_url = ''
    for a in card.css('a'):
        a_href = a.attrib.get('href', '')
        if 'utm_source' in a_href and 'futurepedia.io/tool' not in a_href:
            ext_url = a_href.split('?')[0]
            break

    tool_data = {
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
        'source': 'futurepedia',
    }
    tools.append(tool_data)


def scrape_toolify():
    """
    Scrape AI tools from Toolify.ai best tools page.
    """
    tools = []
    seen_names = set()
    url = 'https://www.toolify.ai/best-ai-tools'

    logger.info(f'Scraping Toolify: {url}')
    try:
        page = StealthyFetcher.fetch(
            url,
            headless=True,
            network_idle=True,
        )
    except Exception as e:
        logger.error(f'Failed to fetch {url}: {e}')
        return tools

    cards = page.css('a[href*="/tool/"]')
    logger.info(f'  Found {len(cards)} tool links')

    processed_hrefs = set()
    for card in cards:
        href = card.attrib.get('href', '')
        if not href or href in processed_hrefs:
            continue
        processed_hrefs.add(href)

        tool_url = href if href.startswith('http') else urljoin('https://www.toolify.ai', href)

        # Extract name
        name = ''
        for el in card.css('h3, h4, strong, span, p'):
            t = (el.text or '').strip()
            if t and 2 < len(t) < 60:
                name = t
                break

        if not name:
            slug_part = href.split('/tool/')[-1].strip('/')
            name = slug_part.replace('-', ' ').title()

        if not name or len(name) < 2:
            continue

        name_key = name.lower().strip()
        if name_key in seen_names:
            continue
        seen_names.add(name_key)

        # Extract description
        desc = ''
        for el in card.css('p'):
            t = (el.text or '').strip()
            if t and len(t) > 15 and t.lower() != name.lower():
                desc = t
                break

        # Extract tags/categories
        tags = []
        categories = set()
        for el in card.css('[class*="tag"], [class*="category"], [class*="label"], span'):
            t = (el.text or '').strip()
            if t and len(t) < 40 and t.lower() != name.lower():
                mapped = normalize_category(t)
                if mapped:
                    categories.add(mapped)
                    tags.append(t.lower())

        if not categories:
            categories.add('Chat')

        primary = list(categories)[0]

        tool_data = {
            'name': name,
            'url': tool_url,
            'detail_url': tool_url,
            'category': primary,
            'categories': list(categories),
            'tags': tags[:10],
            'pricing': 'Freemium',
            'description': desc[:500],
            'source': 'toolify',
        }
        tools.append(tool_data)

    logger.info(f'Toolify total: {len(tools)} tools scraped')
    return tools


def enrich_tool_details(tool, fetcher_class=Fetcher):
    """
    Visit a tool's detail page to get richer data (description, website URL, pricing).
    """
    detail_url = tool.get('detail_url', '')
    if not detail_url:
        return tool

    try:
        page = fetcher_class.get(detail_url)

        # Try to find the external website link
        visit_links = page.css('a[href*="utm_source"], a[rel="nofollow"][target="_blank"]')
        visit_link = _first(visit_links)
        if visit_link:
            ext_url = visit_link.attrib.get('href', '')
            if ext_url and 'http' in ext_url:
                tool['url'] = ext_url.split('?')[0]

        # Get fuller description from meta
        desc_els = page.css('meta[name="description"]')
        desc_el = _first(desc_els)
        if desc_el:
            meta_desc = desc_el.attrib.get('content', '').strip()
            if meta_desc and len(meta_desc) > len(tool.get('description', '')):
                tool['description'] = meta_desc[:500]

        # Try to find icon/logo
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
