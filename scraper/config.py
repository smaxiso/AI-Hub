"""
Scraper configuration — category mapping, pricing mapping, and source loader.
"""

import json
import os
import logging

logger = logging.getLogger(__name__)

# Our 14 categories
CATEGORIES = [
    'Chat', 'Image', 'Video', 'Audio', 'Coding', 'Agent',
    'Writing', 'Design', 'Productivity', 'Research',
    '3D', 'Business', 'Education', 'Social Media'
]

# Map external category names (from scraped sites) → our categories
CATEGORY_MAP = {
    'ai chatbots': 'Chat', 'chatbots': 'Chat', 'chatbot': 'Chat',
    'text to image': 'Image', 'image editing': 'Image',
    'image generators': 'Image', 'image': 'Image',
    'video generators': 'Video', 'video': 'Video', 'video editing': 'Video',
    'audio generators': 'Audio', 'audio': 'Audio',
    'text to speech': 'Audio', 'voice generators': 'Audio', 'music generators': 'Audio',
    'code assistant': 'Coding', 'code': 'Coding', 'coding': 'Coding', 'programming': 'Coding',
    'ai agents': 'Agent', 'agents': 'Agent', 'automation': 'Agent', 'automations': 'Agent',
    'writing generators': 'Writing', 'writing': 'Writing', 'copywriting': 'Writing',
    'text generators': 'Writing', 'content creation': 'Writing',
    'paraphraser': 'Writing', 'summarizer': 'Writing', 'grammar': 'Writing',
    'design generators': 'Design', 'design': 'Design',
    'logo generator': 'Design', 'art': 'Design', 'art generators': 'Design',
    'productivity': 'Productivity', 'project management': 'Productivity',
    'spreadsheet': 'Productivity', 'email assistant': 'Productivity', 'scheduling': 'Productivity',
    'research': 'Research', 'research assistant': 'Research',
    'search engine': 'Research', 'seo': 'Research',
    '3d': '3D', '3d generator': '3D', '3d-generator': '3D',
    'business': 'Business', 'sales': 'Business', 'marketing': 'Business',
    'customer service': 'Business', 'customer support': 'Business', 'finance': 'Business',
    'education': 'Education', 'learning': 'Education',
    'social media': 'Social Media', 'social media assistant': 'Social Media',
    'social media management': 'Social Media',
    # AITopTools mappings
    'video generator': 'Video', 'video editor': 'Video', 'video enhancer': 'Video',
    'animation generator': 'Video', 'dubbing': 'Video',
    'voice generator': 'Audio', 'audio editor': 'Audio', 'music generator': 'Audio',
    'text-to-speech': 'Audio', 'speech to text': 'Audio', 'transcription': 'Audio',
    'image generator': 'Image', 'image enhancer': 'Image', 'image recognition': 'Image',
    'art generator': 'Image', 'icon generator': 'Image',
    'code generator': 'Coding', 'coding assistant': 'Coding', 'developer': 'Coding',
    'sql': 'Coding', 'no code': 'Coding',
    'writing assistant': 'Writing', 'content generator': 'Writing',
    'content creator': 'Writing', 'story generator': 'Writing',
    'email writing': 'Writing', 'summarizer': 'Writing', 'seo generator': 'Research',
    'design tool': 'Design', 'logo generator': 'Design', 'interior design': 'Design',
    'font generator': 'Design',
    'chatbot': 'Chat', 'companionship': 'Chat',
    'task automation': 'Agent', 'assistant': 'Agent',
    '3d model generators': '3D',
    'analytics': 'Research', 'data analytics': 'Research', 'data extraction': 'Research',
    'lead generation': 'Business', 'email marketing': 'Business',
    'ecommerce': 'Business', 'investing': 'Business', 'real estate': 'Business',
    'human resources': 'Business', 'legal': 'Business', 'customer service': 'Business',
    'presentation maker': 'Productivity', 'collaboration': 'Productivity',
    'file management system': 'Productivity', 'form generator': 'Productivity',
    'website builder': 'Productivity', 'converter': 'Productivity',
    'translations': 'Productivity',
    'healthcare': 'Education', 'quizzes': 'Education',
    'social media': 'Social Media',
}

# Pricing keyword mapping
PRICING_MAP = {
    'free': 'Free',
    'freemium': 'Freemium',
    'paid': 'Paid',
    'free trial': 'Freemium',
    'open source': 'Free',
    'contact for pricing': 'Paid',
}


def load_sources(config_path=None):
    """Load source configurations from sources.json."""
    if config_path is None:
        config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sources.json')

    if not os.path.exists(config_path):
        raise FileNotFoundError(f'Sources config not found: {config_path}')

    with open(config_path, 'r') as f:
        data = json.load(f)

    sources = data.get('sources', [])
    enabled = [s for s in sources if s.get('enabled', True)]
    logger.info(f'Loaded {len(enabled)}/{len(sources)} enabled sources from {config_path}')
    return enabled


# ─── Blocklist ───

_blocklist = None


def _load_blocklist():
    """Load blocklist.json once and cache it."""
    global _blocklist
    if _blocklist is not None:
        return _blocklist

    bl_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'blocklist.json')
    if not os.path.exists(bl_path):
        logger.warning(f'Blocklist not found at {bl_path} — no filtering applied')
        _blocklist = {'blocked_names': [], 'blocked_domains': [], 'blocked_url_patterns': []}
        return _blocklist

    with open(bl_path, 'r') as f:
        _blocklist = json.load(f)
    logger.info(f'Loaded blocklist: {len(_blocklist.get("blocked_names", []))} names, '
                f'{len(_blocklist.get("blocked_domains", []))} domains, '
                f'{len(_blocklist.get("blocked_url_patterns", []))} URL patterns')
    return _blocklist


def is_blocked(name, url=''):
    """
    Check if a tool should be blocked based on name, URL domain, or URL patterns.
    Returns True if the tool should be skipped.
    """
    bl = _load_blocklist()

    # Check name
    name_lower = (name or '').lower().strip()
    if name_lower in bl.get('blocked_names', []):
        return True

    # Check URL against blocked domains
    url_lower = (url or '').lower()
    for domain in bl.get('blocked_domains', []):
        if domain in url_lower:
            return True

    # Check URL against blocked path patterns
    for pattern in bl.get('blocked_url_patterns', []):
        if pattern in url_lower:
            return True

    return False


# ─── Quality heuristics for API-sourced tools ───

# Names that are too generic or clearly not tool names
JUNK_NAME_PATTERNS = [
    # Too short or generic
    lambda n: len(n) < 3,
    lambda n: len(n) > 50,
    # All lowercase single word under 5 chars
    lambda n: len(n) < 5 and n.islower() and ' ' not in n,
    # Starts with common non-tool words
    lambda n: n.lower().split()[0] in {
        'the', 'a', 'an', 'my', 'our', 'your', 'this', 'that', 'how', 'why',
        'what', 'new', 'best', 'top', 'free', 'just', 'some', 'here',
    } if n.strip() else True,
]


def is_junk_name(name):
    """Check if a name looks like junk (too generic, too short, etc.)."""
    if not name:
        return True
    for check in JUNK_NAME_PATTERNS:
        if check(name.strip()):
            return True
    return False
