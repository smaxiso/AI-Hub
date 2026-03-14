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
