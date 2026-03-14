#!/usr/bin/env python3
"""
TheAIHubX — AI Tool Scraper (Config-Driven, Parallel)

Scrapes website directories + API sources (Reddit, GitHub, Google Trends)
in parallel using ThreadPoolExecutor.

Usage:
    python main.py                          # Full scrape + sync
    python main.py --dry-run                # Scrape only, don't write to DB
    python main.py --source futurepedia     # Scrape specific source only
    python main.py --workers 4              # Use 4 parallel threads (default: 3)
    python main.py --enrich                 # Visit detail pages for richer data
    python main.py --config path/to.json    # Use custom config file
    python main.py --no-apis               # Skip API sources (Reddit, GitHub, Trends)
"""

import sys
import os
import argparse
import logging
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed

from config import load_sources
from scrapers import scrape_site, enrich_tool_details
from api_sources import API_SOURCES
from sync import sync_tools, save_scrape_report

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger(__name__)

DEFAULT_WORKERS = 3


def _run_site_scraper(site_config):
    """Wrapper for thread pool — scrapes one website source."""
    name = site_config['name']
    try:
        tools = scrape_site(site_config)
        logger.info(f'  ✓ {name}: {len(tools)} tools')
        return name, tools, None
    except Exception as e:
        logger.error(f'  ✗ {name} failed: {e}')
        return name, [], str(e)


def _run_api_scraper(api_name, scraper_fn):
    """Wrapper for thread pool — runs one API source."""
    try:
        tools = scraper_fn()
        logger.info(f'  ✓ {api_name}: {len(tools)} tools')
        return api_name, tools, None
    except Exception as e:
        logger.error(f'  ✗ {api_name} failed: {e}')
        return api_name, [], str(e)


def main():
    parser = argparse.ArgumentParser(description='TheAIHubX AI Tool Scraper')
    parser.add_argument('--dry-run', action='store_true', help='Scrape but do not write to DB')
    parser.add_argument('--source', type=str, help='Scrape a specific source by name')
    parser.add_argument('--enrich', action='store_true', help='Visit detail pages for richer data (slower)')
    parser.add_argument('--config', type=str, default=None, help='Path to sources.json config file')
    parser.add_argument('--workers', type=int, default=DEFAULT_WORKERS, help=f'Parallel threads (default: {DEFAULT_WORKERS})')
    parser.add_argument('--no-apis', action='store_true', help='Skip API sources (Reddit, GitHub, Trends)')
    args = parser.parse_args()

    start = datetime.now(timezone.utc)
    logger.info(f'=== TheAIHubX Scraper — {start.strftime("%Y-%m-%d %H:%M UTC")} ===')
    logger.info(f'Workers: {args.workers} threads')

    # ── Load website sources from JSON config ──
    try:
        site_sources = load_sources(args.config)
    except FileNotFoundError as e:
        logger.error(str(e))
        return 1

    # ── Determine what to scrape ──
    if args.source:
        # Check both site sources and API sources
        site_sources = [s for s in site_sources if s['name'] == args.source]
        api_names = [args.source] if args.source in API_SOURCES else []
        if not site_sources and not api_names:
            all_names = [s['name'] for s in load_sources(args.config)] + list(API_SOURCES.keys())
            logger.error(f'Source "{args.source}" not found. Available: {all_names}')
            return 1
    else:
        api_names = [] if args.no_apis else list(API_SOURCES.keys())

    site_names = [s['name'] for s in site_sources]
    logger.info(f'Website sources: {site_names}')
    logger.info(f'API sources: {api_names}')

    # ── Parallel scraping ──
    all_tools = []
    source_stats = {}

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {}

        # Submit website scrapers
        for site_config in site_sources:
            f = pool.submit(_run_site_scraper, site_config)
            futures[f] = site_config['name']

        # Submit API scrapers
        for api_name in api_names:
            f = pool.submit(_run_api_scraper, api_name, API_SOURCES[api_name])
            futures[f] = api_name

        logger.info(f'\n── Scraping {len(futures)} sources in parallel ──')

        for future in as_completed(futures):
            source_name = futures[future]
            try:
                name, tools, error = future.result()
                source_stats[name] = {'count': len(tools), 'error': error}
                all_tools.extend(tools)
            except Exception as e:
                logger.error(f'  ✗ {source_name} crashed: {e}')
                source_stats[source_name] = {'count': 0, 'error': str(e)}

    # ── Source summary ──
    logger.info(f'\n── Source Results ──')
    for name, stats in source_stats.items():
        status = '✓' if not stats['error'] else '✗'
        logger.info(f'  {status} {name}: {stats["count"]} tools' + (f' (error: {stats["error"]})' if stats['error'] else ''))

    logger.info(f'\nTotal scraped across all sources: {len(all_tools)}')

    # ── Optional enrichment pass (parallel too) ──
    if args.enrich and all_tools:
        logger.info('\n── Enriching tool details ──')
        enrichable = [t for t in all_tools if t.get('detail_url')]
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {pool.submit(enrich_tool_details, tool): tool for tool in enrichable}
            done = 0
            for future in as_completed(futures):
                done += 1
                if done % 20 == 0:
                    logger.info(f'  Enriched {done}/{len(enrichable)}...')
                try:
                    future.result()
                except Exception as e:
                    tool = futures[future]
                    logger.warning(f'  Enrich failed for {tool.get("name")}: {e}')

    # ── Sync to Supabase ──
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
