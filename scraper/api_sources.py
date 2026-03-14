"""
API-based sources for discovering trending AI tools.
Reddit (public JSON), GitHub Trending, Google Trends.
No API keys required for any of these.
"""

import re
import json
import time
import logging
from urllib.parse import urljoin
from datetime import datetime, timezone

import requests

from config import CATEGORY_MAP, CATEGORIES

logger = logging.getLogger(__name__)

# Common headers to avoid 429s
HEADERS = {
    'User-Agent': 'TheAIHubX-Scraper/1.0 (AI tool discovery bot)',
    'Accept': 'application/json',
}

# ─── AI tool name patterns ───
# Strategy 1: "I built/launched/created ToolName" — name right after action verb
TOOL_PATTERN = re.compile(
    r'(?:check out|try out|launched|built|introducing|announcing|released|called|named|created|presenting)\s+'
    r'[\"\']?([A-Z][A-Za-z0-9.]+(?:[\s-][A-Z][A-Za-z0-9.]*){0,2}(?:\s(?:AI|Pro|Plus|Studio|Labs?))?)',
)
# Strategy 2: extract full URL and derive tool name from domain
URL_PATTERN = re.compile(r'(https?://(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})[^\s)\]]*)')

# Words that are NOT tool names (common false positives from regex)
NOISE_WORDS = {
    'the', 'this', 'that', 'what', 'how', 'why', 'just', 'new', 'best', 'free',
    'open', 'here', 'some', 'post', 'built', 'made', 'engine', 'meta', 'like',
    'anyone', 'does', 'will', 'been', 'have', 'from', 'with', 'about', 'into',
    'they', 'their', 'there', 'these', 'those', 'your', 'would', 'could',
    'should', 'after', 'before', 'since', 'while', 'where', 'which', 'every',
    'still', 'also', 'even', 'much', 'many', 'most', 'more', 'very', 'really',
    'actually', 'basically', 'literally', 'honestly', 'apparently', 'currently',
    'today', 'yesterday', 'tomorrow', 'people', 'everyone', 'someone', 'nobody',
    'something', 'nothing', 'everything', 'anything', 'first', 'last', 'next',
}

# Keywords that signal an AI tool post (not just discussion)
AI_TOOL_SIGNALS = [
    'ai tool', 'ai app', 'ai platform', 'ai assistant', 'ai agent',
    'ai generator', 'ai model', 'llm', 'gpt', 'chatbot', 'text-to',
    'image generator', 'voice ai', 'ai writing', 'ai coding',
    'open source ai', 'ai saas', 'ai startup', 'launched',
]

# Domains to skip (not tools)
SKIP_DOMAINS = {
    'reddit.com', 'imgur.com', 'youtube.com', 'twitter.com', 'x.com',
    'github.com', 'medium.com', 'arxiv.org', 'wikipedia.org',
    'google.com', 'amazon.com', 'apple.com', 'microsoft.com',
    'i.redd.it', 'v.redd.it', 'preview.redd.it', 'old.reddit.com',
    # News/media sites (not tools)
    'bbc.com', 'bbc.co.uk', 'cnn.com', 'nytimes.com', 'theguardian.com',
    'techcrunch.com', 'theverge.com', 'wired.com', 'arstechnica.com',
    'technologyreview.com', 'venturebeat.com', 'zdnet.com', 'cnet.com',
    'engadget.com', 'mashable.com', 'gizmodo.com', 'interestingengineering.com',
    'news.ycombinator.com', 'substack.com', 'linkedin.com', 'facebook.com',
    'instagram.com', 'tiktok.com', 'discord.com', 'discord.gg',
    'docs.google.com', 'drive.google.com', 'youtu.be',
    'news.future-shock.ai', 'future-shock.ai',
    # Utility/hosting sites (not tools themselves)
    'pypi.org', 'npmjs.com', 'buymeacoffee.com', 'patreon.com',
    'ko-fi.com', 'gumroad.com', 'producthunt.com', 'time.com',
    'vercel.app', 'netlify.app', 'herokuapp.com', 'fly.dev',
    'notion.so', 'notion.site', 'airtable.com', 'typeform.com',
    'stripe.com', 'paypal.com', 'gist.github.com', 'raw.githubusercontent.com',
    'hub.docker.com', 'kaggle.com', 'colab.research.google.com',
    'huggingface.co', 'spaces.huggingface.co',
    'yourdomain.com', 'example.com', 'localhost',
    # Blog/newsletter platforms
    'substack.com', 'ghost.io', 'beehiiv.com', 'buttondown.email',
    'lossfunk.com', 'letters.lossfunk.com',
    # Code hosting / paste
    'pastebin.com', 'codepen.io', 'jsfiddle.net', 'replit.com',
    'github.io',  # GitHub Pages (blogs, not tools)
    'githubusercontent.com',
    # News/magazine sites
    'shiftmag.dev', 'bushaicave.com', 'identitytxt.org',
    'tesslate.com', 'firethering.com', 'artcompute.org',
    'openai.com',  # OpenAI itself is not a "tool" to add
}


def _guess_category(text):
    """Guess our category from post text."""
    text_lower = text.lower()
    keyword_map = {
        'Chat': ['chatbot', 'chat bot', 'conversational', 'llm', 'gpt', 'claude', 'gemini'],
        'Image': ['image generat', 'text-to-image', 'text to image', 'midjourney', 'stable diffusion', 'dall-e', 'flux'],
        'Video': ['video generat', 'text-to-video', 'video edit', 'sora', 'runway', 'pika'],
        'Audio': ['text-to-speech', 'voice', 'audio', 'music generat', 'tts', 'speech'],
        'Coding': ['code', 'coding', 'programming', 'developer', 'copilot', 'cursor', 'ide'],
        'Agent': ['ai agent', 'autonomous', 'automation', 'workflow', 'automate'],
        'Writing': ['writing', 'copywriting', 'content creat', 'blog', 'essay', 'grammar'],
        'Design': ['design', 'logo', 'ui/ux', 'graphic', 'canva'],
        'Productivity': ['productivity', 'note', 'calendar', 'email', 'spreadsheet', 'notion'],
        'Research': ['research', 'search engine', 'perplexity', 'academic', 'paper'],
        '3D': ['3d', 'three-d', 'blender', 'mesh'],
        'Business': ['marketing', 'sales', 'crm', 'business', 'analytics', 'seo'],
        'Education': ['education', 'learning', 'tutor', 'course', 'study'],
        'Social Media': ['social media', 'instagram', 'tiktok', 'twitter', 'linkedin'],
    }
    for cat, keywords in keyword_map.items():
        for kw in keywords:
            if kw in text_lower:
                return cat
    return 'Chat'  # default


def _has_ai_signal(text):
    """Check if text mentions AI tools (not just general AI discussion)."""
    text_lower = text.lower()
    return any(signal in text_lower for signal in AI_TOOL_SIGNALS)


def _extract_tool_url_and_domain(text):
    """Extract the most likely tool URL and its domain from text."""
    for full_url, domain in URL_PATTERN.findall(text):
        base = domain.lower()
        # Check against skip list (including parent domains)
        skip = False
        for sd in SKIP_DOMAINS:
            if base == sd or base.endswith('.' + sd):
                skip = True
                break
        if skip:
            continue
        if '.' in base:
            clean_url = full_url.split('?')[0].rstrip('.,;:!?)')
            # Domain name = first part before TLD
            domain_name = base.split('.')[0]
            if len(domain_name) >= 3:  # Skip very short domains
                return clean_url, domain_name
    return '', ''


# ─────────────────────────────────────────────
# Reddit Public JSON API
# ─────────────────────────────────────────────

REDDIT_SUBREDDITS = [
    ('r/artificial', 'hot'),
    ('r/artificial', 'new'),
    ('r/ArtificialInteligence', 'hot'),
    ('r/singularity', 'hot'),
    ('r/ChatGPT', 'hot'),
    ('r/LocalLLaMA', 'hot'),
    ('r/StableDiffusion', 'hot'),
    ('r/machinelearning', 'hot'),
]


def scrape_reddit():
    """
    Scrape Reddit for AI tool mentions using public JSON endpoints.
    No API key needed — just append .json to any Reddit URL.
    
    Strategy: prioritize posts with external tool URLs, derive name from
    domain or explicit "I built X" patterns. Skip posts without clear tool references.
    """
    tools = []
    seen_names = set()

    for subreddit, sort in REDDIT_SUBREDDITS:
        url = f'https://www.reddit.com/{subreddit}/{sort}.json?limit=50'
        logger.info(f'[reddit] Fetching {subreddit}/{sort}')

        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code == 429:
                logger.warning(f'[reddit] Rate limited on {subreddit}, waiting 10s...')
                time.sleep(10)
                resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                logger.warning(f'[reddit] {subreddit} returned {resp.status_code}')
                continue
            data = resp.json()
        except Exception as e:
            logger.error(f'[reddit] Failed to fetch {subreddit}: {e}')
            continue

        posts = data.get('data', {}).get('children', [])
        logger.info(f'[reddit]   {len(posts)} posts')

        for post in posts:
            pd = post.get('data', {})
            title = pd.get('title', '')
            selftext = pd.get('selftext', '')
            post_url = pd.get('url', '')
            full_text = f'{title} {selftext}'

            if not _has_ai_signal(full_text):
                continue

            # Strategy 1: Try regex pattern "I built/launched X"
            name = ''
            name_match = TOOL_PATTERN.search(title)
            if name_match:
                candidate = name_match.group(1).strip().rstrip('.,!?-')
                if candidate.lower() not in NOISE_WORDS and 3 <= len(candidate) <= 40:
                    name = candidate

            # Strategy 2: Extract URL from post, derive name from domain
            tool_url, domain_name = _extract_tool_url_and_domain(full_text)
            if not tool_url and post_url:
                # Check if the post URL itself points to a tool
                for skip in SKIP_DOMAINS:
                    if skip in post_url:
                        break
                else:
                    tool_url = post_url.split('?')[0]
                    domain_match = re.search(r'https?://(?:www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]+)', post_url)
                    if domain_match:
                        domain_name = domain_match.group(1)
                        tld = domain_match.group(2)

            # If no name from regex, use domain name — but only for product-like TLDs
            if not name and domain_name and tool_url:
                # Only trust domain-as-name for product-like TLDs
                tld_match = re.search(r'\.([a-z]+)(?:/|$)', tool_url)
                tld = tld_match.group(1) if tld_match else ''
                product_tlds = {'ai', 'app', 'io', 'dev', 'co', 'tools', 'so', 'tech'}
                if tld in product_tlds and len(domain_name) >= 3:
                    name = domain_name.replace('-', ' ').title()
                # For .com, only use if domain looks like a product name (not news/blog)
                elif tld == 'com' and len(domain_name) >= 4:
                    blog_words = {'news', 'blog', 'fortune', 'reuters', 'time', 'post',
                                  'daily', 'review', 'magazine', 'journal', 'press',
                                  'wire', 'report', 'digest', 'herald', 'tribune',
                                  'verify', 'preview', 'demo', 'api', 'docs', 'cdn'}
                    if domain_name.lower() not in blog_words:
                        name = domain_name.replace('-', ' ').title()

            # Must have a name AND a URL (no URL = too speculative for DB)
            if not name or len(name) < 3 or name.lower() in NOISE_WORDS:
                continue
            if not tool_url:
                continue

            name_key = name.lower()
            if name_key in seen_names:
                continue
            seen_names.add(name_key)

            category = _guess_category(full_text)

            # Build description from title
            desc = title[:300]
            if selftext:
                sentences = selftext.split('.')
                for s in sentences[:3]:
                    s = s.strip()
                    if len(s) > 30:
                        desc = s[:500]
                        break

            tools.append({
                'name': name,
                'url': tool_url or '',
                'detail_url': f'https://www.reddit.com{pd.get("permalink", "")}',
                'category': category,
                'categories': [category],
                'tags': ['reddit', 'trending'],
                'pricing': 'Freemium',
                'description': desc,
                'icon': '',
                'source': 'reddit',
            })

        time.sleep(2)  # Be nice to Reddit

    logger.info(f'[reddit] Total: {len(tools)} AI tools discovered')
    return tools


# ─────────────────────────────────────────────
# GitHub Trending
# ─────────────────────────────────────────────

GITHUB_TRENDING_URLS = [
    'https://github.com/trending?since=weekly&spoken_language_code=en',
    'https://github.com/trending/python?since=weekly',
    'https://github.com/trending/typescript?since=weekly',
    'https://github.com/trending/javascript?since=weekly',
]

# Keywords in repo name/description that signal an AI tool
GITHUB_AI_KEYWORDS = [
    'ai', 'llm', 'gpt', 'chatbot', 'diffusion', 'generative',
    'text-to', 'image-gen', 'voice', 'tts', 'agent', 'copilot',
    'machine-learning', 'deep-learning', 'neural', 'transformer',
    'rag', 'langchain', 'openai', 'anthropic', 'ollama', 'huggingface',
]


def scrape_github_trending():
    """
    Scrape GitHub trending repos and filter for AI-related tools.
    Uses the HTML trending page (no API key needed).
    """
    from scrapling.fetchers import StealthyFetcher

    tools = []
    seen_repos = set()

    for url in GITHUB_TRENDING_URLS:
        logger.info(f'[github] Fetching: {url}')
        try:
            page = StealthyFetcher.fetch(url, headless=True, network_idle=True)
        except Exception as e:
            logger.error(f'[github] Failed to fetch {url}: {e}')
            continue

        # Each trending repo is in an <article> with class "Box-row"
        rows = page.css('article.Box-row')
        if not rows:
            rows = page.css('[class*="Box-row"]')
        logger.info(f'[github]   Found {len(rows)} repos')

        for row in rows:
            try:
                # Repo link: h2 > a
                link_els = row.css('h2 a')
                if not link_els:
                    continue
                link = link_els[0]
                href = link.attrib.get('href', '').strip()
                if not href:
                    continue

                repo_full = href.strip('/')  # e.g. "owner/repo-name"
                if repo_full in seen_repos:
                    continue

                # Get repo name (last part)
                repo_name = repo_full.split('/')[-1] if '/' in repo_full else repo_full

                # Get description
                desc = ''
                desc_els = row.css('p')
                if desc_els:
                    desc = (desc_els[0].text or '').strip()

                full_text = f'{repo_name} {desc}'.lower()

                # Filter: must have AI-related keywords
                if not any(kw in full_text for kw in GITHUB_AI_KEYWORDS):
                    continue

                seen_repos.add(repo_full)

                # Build a nice display name from repo name
                display_name = repo_name.replace('-', ' ').replace('_', ' ').title()
                if len(display_name) < 2:
                    continue

                repo_url = f'https://github.com/{repo_full}'
                category = _guess_category(full_text)

                # Get stars text if available
                star_els = row.css('a[href*="/stargazers"]')
                stars = ''
                if star_els:
                    stars = (star_els[0].text or '').strip().replace(',', '')

                tags = ['github', 'trending', 'open-source']
                if stars:
                    tags.append(f'{stars}-stars')

                tools.append({
                    'name': display_name,
                    'url': repo_url,
                    'detail_url': repo_url,
                    'category': category,
                    'categories': [category],
                    'tags': tags[:10],
                    'pricing': 'Free',
                    'description': desc[:500] if desc else f'Trending GitHub AI project: {display_name}',
                    'icon': f'https://github.com/{repo_full.split("/")[0]}.png' if '/' in repo_full else '',
                    'source': 'github',
                })

            except Exception as e:
                logger.warning(f'[github]   Row parse error: {e}')

        time.sleep(2)

    logger.info(f'[github] Total: {len(tools)} AI tools from trending repos')
    return tools


# ─────────────────────────────────────────────
# Google Trends (via pytrends)
# ─────────────────────────────────────────────

TRENDS_SEED_KEYWORDS = [
    'AI tool', 'AI app', 'AI generator', 'AI assistant', 'AI agent',
]


def scrape_google_trends():
    """
    Use pytrends to find rising AI-related search queries.
    These become tool name candidates we can cross-reference.
    """
    try:
        from pytrends.request import TrendReq
    except ImportError:
        logger.warning('[trends] pytrends not installed — skipping Google Trends. pip install pytrends')
        return []

    tools = []
    seen_names = set()

    try:
        pytrends = TrendReq(hl='en-US', tz=360, timeout=(10, 25))
    except Exception as e:
        logger.error(f'[trends] Failed to init pytrends: {e}')
        return []

    for keyword in TRENDS_SEED_KEYWORDS:
        logger.info(f'[trends] Querying related queries for: "{keyword}"')
        try:
            pytrends.build_payload([keyword], timeframe='now 7-d', geo='US')
            related = pytrends.related_queries()

            for kw_data in related.values():
                # "rising" queries are the most interesting
                rising = kw_data.get('rising')
                if rising is not None and not rising.empty:
                    for _, row in rising.iterrows():
                        query = row.get('query', '').strip()
                        if not query or len(query) < 3:
                            continue

                        # Filter: must look like a tool name (not generic)
                        query_lower = query.lower()
                        if not _has_ai_signal(query_lower) and not any(
                            kw in query_lower for kw in ['ai', 'gpt', 'bot', 'gen']
                        ):
                            continue

                        # Clean up the name
                        name = query.title()
                        name_key = name.lower()
                        if name_key in seen_names or len(name) > 50:
                            continue
                        seen_names.add(name_key)

                        category = _guess_category(query)

                        tools.append({
                            'name': name,
                            'url': '',
                            'detail_url': f'https://www.google.com/search?q={query.replace(" ", "+")}',
                            'category': category,
                            'categories': [category],
                            'tags': ['google-trends', 'rising'],
                            'pricing': 'Freemium',
                            'description': f'Rising search trend: "{query}" — trending AI tool or service.',
                            'icon': '',
                            'source': 'google-trends',
                        })

                # Also check "top" queries
                top = kw_data.get('top')
                if top is not None and not top.empty:
                    for _, row in top.head(10).iterrows():
                        query = row.get('query', '').strip()
                        if not query or len(query) < 3:
                            continue
                        query_lower = query.lower()
                        if not any(kw in query_lower for kw in ['ai', 'gpt', 'bot', 'gen', 'tool']):
                            continue
                        name = query.title()
                        name_key = name.lower()
                        if name_key in seen_names:
                            continue
                        seen_names.add(name_key)
                        category = _guess_category(query)
                        tools.append({
                            'name': name,
                            'url': '',
                            'detail_url': f'https://www.google.com/search?q={query.replace(" ", "+")}',
                            'category': category,
                            'categories': [category],
                            'tags': ['google-trends', 'top'],
                            'pricing': 'Freemium',
                            'description': f'Top search trend: "{query}" — popular AI tool or service.',
                            'icon': '',
                            'source': 'google-trends',
                        })

        except Exception as e:
            logger.warning(f'[trends] Failed for "{keyword}": {e}')

        time.sleep(2)

    logger.info(f'[trends] Total: {len(tools)} AI tool candidates from Google Trends')
    return tools


# ─────────────────────────────────────────────
# Registry of all API sources
# ─────────────────────────────────────────────

API_SOURCES = {
    'reddit': scrape_reddit,
    'github': scrape_github_trending,
    'google-trends': scrape_google_trends,
}
