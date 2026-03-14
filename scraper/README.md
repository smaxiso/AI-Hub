# TheAIHubX — AI Tool Scraper

Config-driven scraper that discovers new AI tools from popular directories and syncs them into Supabase. Supports both inserting new tools and updating existing ones with richer data.

## Sources (configured in `sources.json`)

| Source | URL | Method |
|---|---|---|
| Futurepedia | futurepedia.io | StealthyFetcher (JS-rendered) |
| Toolify | toolify.ai | StealthyFetcher (JS-rendered) |

## Setup

```bash
cd scraper
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
patchright install chromium
```

Copy `.env` with your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Usage

```bash
# Full scrape + sync (insert new + update existing)
python main.py

# Dry run — scrape and audit, no DB writes
python main.py --dry-run

# Scrape specific source only
python main.py --source futurepedia

# Enrich with detail page visits (slower but richer data)
python main.py --enrich

# Use a custom config file
python main.py --config /path/to/my-sources.json
```

## Configuration — `sources.json`

All scrape sources are defined in `sources.json`. You can add, remove, or update sites without touching any Python code.

### Structure

```json
{
  "sources": [
    {
      "name": "my-source",
      "enabled": true,
      "base_url": "https://example.com",
      "fetcher": "stealthy",
      "delay_seconds": 2,
      "pages": [
        { "url": "https://example.com/ai-tools/chat", "default_category": "Chat" },
        { "url": "https://example.com/ai-tools/image", "default_category": "Image" }
      ],
      "selectors": {
        "card": ".tool-card",
        "detail_link": "a[href*='/tool/']",
        "detail_slug_split": "/tool/",
        "name": "h3",
        "name_max_length": 60,
        "description": "p",
        "description_min_length": 20,
        "pricing": "span.price",
        "pricing_keywords": ["free", "freemium", "paid"],
        "category_tags": ".tag",
        "icon": "img.logo",
        "external_link_indicator": "utm_source",
        "external_link_exclude": "example.com/tool"
      }
    }
  ]
}
```

### Field Reference

| Field | Type | Description |
|---|---|---|
| `name` | string | Unique source identifier |
| `enabled` | bool | Set `false` to skip this source |
| `base_url` | string | Used to resolve relative URLs |
| `fetcher` | string | `"stealthy"` (JS-rendered) or `"basic"` (HTTP only) |
| `delay_seconds` | number | Pause between page fetches |
| `pages` | array | List of `{url, default_category}` to scrape |
| `selectors.card` | CSS | Selector for each tool card container |
| `selectors.detail_link` | CSS/null | Link element inside card (null if card itself is the link) |
| `selectors.detail_slug_split` | string | URL segment to extract slug from |
| `selectors.name` | CSS | Element(s) containing tool name |
| `selectors.description` | CSS | Element(s) containing description |
| `selectors.pricing` | CSS/null | Element containing pricing text |
| `selectors.pricing_keywords` | array | Recognized pricing strings |
| `selectors.category_tags` | CSS/null | Elements with category/tag text |
| `selectors.icon` | CSS/null | Image element for tool icon |
| `selectors.external_link_indicator` | string/null | URL substring identifying external links |
| `selectors.external_link_exclude` | string/null | URL substring to exclude from external links |

### Adding a New Source

1. Open `sources.json`
2. Add a new entry to the `sources` array with the site's selectors
3. Run `python main.py --source your-source --dry-run` to test
4. Run `python main.py --source your-source` to sync

### Disabling a Source

Set `"enabled": false` in the source entry. It will be skipped during scraping.

## How It Works

1. Loads enabled sources from `sources.json`
2. For each source, fetches all configured pages using Scrapling
3. Parses tool cards using the configured CSS selectors
4. Maps external categories to our 14 categories
5. Audits against existing DB tools:
   - **New tools** → inserted
   - **Existing tools with richer scraped data** → updated (description, categories, tags, icon, pricing)
   - **Existing tools with no changes** → unchanged (skipped)
6. Saves a JSON audit report (`last_scrape_report.json`)

## Audit Report

After each run, `last_scrape_report.json` contains:
- Counts: inserted, updated, unchanged, skipped, errors
- List of new tools added
- List of updated tools with which fields changed

## Automated Weekly Runs

GitHub Actions workflow runs every Sunday at 06:00 UTC. Set these repository secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Trigger manually from the Actions tab anytime.
