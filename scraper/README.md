# TheAIHubX — AI Tool Scraper

Automated scraper that discovers new AI tools from popular directories and syncs them into the Supabase database.

## Sources

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
# Full scrape + sync to Supabase
python main.py

# Dry run (scrape only, no DB writes)
python main.py --dry-run

# Scrape specific source
python main.py --source futurepedia

# Enrich with detail page visits (slower but richer data)
python main.py --enrich
```

## Automated Weekly Runs

A GitHub Actions workflow runs every Sunday at 06:00 UTC. Set these repository secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

You can also trigger it manually from the Actions tab.

## How It Works

1. Scrapers visit AI tool directory pages using Scrapling's StealthyFetcher
2. Tool cards are parsed for name, category, description, pricing, tags
3. External categories are mapped to our 14 categories
4. Deduplication checks against existing tools (by URL, name, and ID)
5. New tools are batch-inserted into Supabase
6. A JSON report is saved after each run

## Adding a New Source

1. Add a `scrape_newsource()` function in `scrapers.py`
2. Register it in `SCRAPER_MAP` in `main.py`
3. Add any new category mappings to `config.py`
