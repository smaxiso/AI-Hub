"""
Scraper configuration — category mapping, sources, and constants.
"""

# Our 14 categories
CATEGORIES = [
    'Chat', 'Image', 'Video', 'Audio', 'Coding', 'Agent',
    'Writing', 'Design', 'Productivity', 'Research',
    '3D', 'Business', 'Education', 'Social Media'
]

# Map external category names (from scraped sites) → our categories
CATEGORY_MAP = {
    # Futurepedia mappings
    'ai chatbots': 'Chat',
    'chatbots': 'Chat',
    'text to image': 'Image',
    'image editing': 'Image',
    'image generators': 'Image',
    'image': 'Image',
    'video generators': 'Video',
    'video': 'Video',
    'video editing': 'Video',
    'audio generators': 'Audio',
    'audio': 'Audio',
    'text to speech': 'Audio',
    'voice generators': 'Audio',
    'music generators': 'Audio',
    'code assistant': 'Coding',
    'code': 'Coding',
    'coding': 'Coding',
    'programming': 'Coding',
    'ai agents': 'Agent',
    'agents': 'Agent',
    'automation': 'Agent',
    'automations': 'Agent',
    'writing generators': 'Writing',
    'writing': 'Writing',
    'copywriting': 'Writing',
    'text generators': 'Writing',
    'content creation': 'Writing',
    'paraphraser': 'Writing',
    'summarizer': 'Writing',
    'grammar': 'Writing',
    'design generators': 'Design',
    'design': 'Design',
    'logo generator': 'Design',
    'art': 'Design',
    'art generators': 'Design',
    'productivity': 'Productivity',
    'project management': 'Productivity',
    'spreadsheet': 'Productivity',
    'email assistant': 'Productivity',
    'scheduling': 'Productivity',
    'research': 'Research',
    'research assistant': 'Research',
    'search engine': 'Research',
    'seo': 'Research',
    '3d': '3D',
    '3d generator': '3D',
    '3d-generator': '3D',
    'business': 'Business',
    'sales': 'Business',
    'marketing': 'Business',
    'customer service': 'Business',
    'customer support': 'Business',
    'finance': 'Business',
    'education': 'Education',
    'learning': 'Education',
    'social media': 'Social Media',
    'social media assistant': 'Social Media',
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

# Sources to scrape
SOURCES = {
    'futurepedia': {
        'base_url': 'https://www.futurepedia.io',
        'tool_list_urls': [
            'https://www.futurepedia.io/ai-tools',
            'https://www.futurepedia.io/ai-tools/chatbots',
            'https://www.futurepedia.io/ai-tools/text-to-image',
            'https://www.futurepedia.io/ai-tools/video-generators',
            'https://www.futurepedia.io/ai-tools/audio-generators',
            'https://www.futurepedia.io/ai-tools/code-assistant',
            'https://www.futurepedia.io/ai-tools/productivity',
            'https://www.futurepedia.io/ai-tools/design-generators',
            'https://www.futurepedia.io/ai-tools/research-assistant',
            'https://www.futurepedia.io/ai-tools/3D-generator',
        ],
    },
    'toolify': {
        'base_url': 'https://www.toolify.ai',
        'tool_list_urls': [
            'https://www.toolify.ai/best-ai-tools',
        ],
    },
}
