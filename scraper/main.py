#!/usr/bin/env python3
"""
TheAIHubX — AI Tool Scraper
Scrapes AI tool directories and syncs new discoveries into Supabase.

Usage:
    python main.py                  # Full scrape + sync
    python main.py --dry-run        # Scrape only, don't insert into DB
    python main.py --source futurepedia  # Scrape specific source only
    python main.py --enrich         # Also visit detail pages for richer data
"""

import sys
import argparse
import logging
from datetime import datetime, timezone

from scrapers import scrape_futurepedia, scrape_toolify, enrich_tool_details
from sync import sync_tools, save_scrape_report

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger(__name__)

SCRAPER_MAP = {
    'futurepedia': scrape_futurepedia,
    'toolify': scrape_toolify,
}


def main():
    parser = argparse.ArgumentParser(description='TheAIHubX AI Tool Scraper')
    parser.add_argument('--dry-run', action='store_true', help='Scrape but do not insert into DB')
    parser.add_argument('--source', type=str, choices=list(SCRAPER_MAP.keys()), help='Scrape a specific source only')
    parser.add_argument('--enrich', action='store_true', help='Visit detail pages for richer data (slower)')
    args = parser.parse_args()

    start = datetime.now(timezone.utc)
    logger.info(f'=== TheAIHubX Scraper — {start.strftime("%Y-%m-%d %H:%M UTC")} ===')

    # Determine which scrapers to run
    if args.source:
        sources = {args.source: SCRAPER_MAP[args.source]}
    else:
        sources = SCRAPER_MAP

    # Run scrapers
    all_tools = []
    for name, scraper_fn in sources.items():
        logger.info(f'\n── Scraping: {name} ──')
        try:
            tools = scraper_fn()
            logger.info(f'  {name}: {len(tools)} tools found')
            all_tools.extend(tools)
        except Exception as e:
            logger.error(f'  {name} failed: {e}')

    logger.info(f'\nTotal scraped across all sources: {len(all_tools)}')

    # Optional enrichment pass
    if args.enrich and all_tools:
        logger.info('\n── Enriching tool details ──')
        for i, tool in enumerate(all_tools):
            if i % 10 == 0:
                logger.info(f'  Enriching {i + 1}/{len(all_tools)}...')
            try:
                enrich_tool_details(tool)
            except Exception as e:
                logger.warning(f'  Enrich failed for {tool.get("name")}: {e}')

    # Sync to Supabase
    if all_tools:
        logger.info('\n── Syncing to Supabase ──')
        inserted, skipped, errors = sync_tools(all_tools, dry_run=args.dry_run)

        elapsed = (datetime.now(timezone.utc) - start).total_seconds()
        logger.info(f'\n=== Summary ===')
        logger.info(f'  Scraped:  {len(all_tools)}')
        logger.info(f'  Inserted: {inserted}')
        logger.info(f'  Skipped:  {skipped}')
        logger.info(f'  Errors:   {len(errors)}')
        logger.info(f'  Time:     {elapsed:.1f}s')

        # Save report next to this script
        import os
        report_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'last_scrape_report.json')
        save_scrape_report(all_tools, inserted, skipped, errors, filename=report_path)

        if errors:
            for err in errors:
                logger.error(f'  ✗ {err}')
    else:
        logger.info('No tools scraped. Nothing to sync.')

    return 0 if not all_tools or inserted >= 0 else 1


if __name__ == '__main__':
    sys.exit(main())
