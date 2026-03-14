#!/usr/bin/env python3
"""
TheAIHubX — AI Tool Scraper (Config-Driven)

Reads site definitions from sources.json and scrapes all enabled sources.

Usage:
    python main.py                          # Full scrape + sync
    python main.py --dry-run                # Scrape only, don't write to DB
    python main.py --source futurepedia     # Scrape specific source only
    python main.py --enrich                 # Visit detail pages for richer data
    python main.py --config path/to.json    # Use custom config file
"""

import sys
import os
import argparse
import logging
from datetime import datetime, timezone

from config import load_sources
from scrapers import scrape_site, enrich_tool_details
from sync import sync_tools, save_scrape_report

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description='TheAIHubX AI Tool Scraper')
    parser.add_argument('--dry-run', action='store_true', help='Scrape but do not write to DB')
    parser.add_argument('--source', type=str, help='Scrape a specific source by name')
    parser.add_argument('--enrich', action='store_true', help='Visit detail pages for richer data (slower)')
    parser.add_argument('--config', type=str, default=None, help='Path to sources.json config file')
    args = parser.parse_args()

    start = datetime.now(timezone.utc)
    logger.info(f'=== TheAIHubX Scraper — {start.strftime("%Y-%m-%d %H:%M UTC")} ===')

    # Load sources from JSON config
    try:
        sources = load_sources(args.config)
    except FileNotFoundError as e:
        logger.error(str(e))
        return 1

    # Filter to specific source if requested
    if args.source:
        sources = [s for s in sources if s['name'] == args.source]
        if not sources:
            logger.error(f'Source "{args.source}" not found in config. Available: check sources.json')
            return 1

    logger.info(f'Sources to scrape: {[s["name"] for s in sources]}')

    # Run scrapers
    all_tools = []
    for site_config in sources:
        name = site_config['name']
        logger.info(f'\n── Scraping: {name} ──')
        try:
            tools = scrape_site(site_config)
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
        audit = sync_tools(all_tools, dry_run=args.dry_run)

        elapsed = (datetime.now(timezone.utc) - start).total_seconds()
        logger.info(f'\n=== Audit Summary ===')
        logger.info(f'  Scraped:    {len(all_tools)}')
        logger.info(f'  Inserted:   {audit["inserted"]}')
        logger.info(f'  Updated:    {audit["updated"]}')
        logger.info(f'  Unchanged:  {audit["unchanged"]}')
        logger.info(f'  Skipped:    {audit["skipped"]}')
        logger.info(f'  Errors:     {len(audit["errors"])}')
        logger.info(f'  Time:       {elapsed:.1f}s')

        # Save report
        report_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'last_scrape_report.json')
        save_scrape_report(audit, len(all_tools), filename=report_path)

        if audit['errors']:
            for err in audit['errors']:
                logger.error(f'  ✗ {err}')
    else:
        logger.info('No tools scraped. Nothing to sync.')

    return 0


if __name__ == '__main__':
    sys.exit(main())
