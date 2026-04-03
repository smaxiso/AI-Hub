import json
import os
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from scrapers import enrich_tool_details
from scrapling.fetchers import Fetcher

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def main():
    report_path = 'last_scrape_report.json'
    if not os.path.exists(report_path):
        logger.error(f"Report not found: {report_path}")
        return

    with open(report_path, 'r') as f:
        report = json.load(f)

    candidates = report.get('new_tools', [])
    if not candidates:
        logger.info("No new tools to enrich.")
        return

    logger.info(f"Enriching {len(candidates)} candidates...")

    enriched = []
    with ThreadPoolExecutor(max_workers=5) as pool:
        # Use simple Fetcher for enrichment as it's faster and usually enough for detail pages
        futures = {pool.submit(enrich_tool_details, tool): tool for tool in candidates}
        done = 0
        for future in as_completed(futures):
            done += 1
            if done % 10 == 0:
                logger.info(f"  Progress: {done}/{len(candidates)}...")
            try:
                enriched.append(future.result())
            except Exception as e:
                tool = futures[future]
                logger.warning(f"  Failed: {tool['name']} - {e}")
                enriched.append(tool)

    # Save to a new file for manual review
    output_path = 'vetted_candidates.json'
    with open(output_path, 'w') as f:
        json.dump({
            'candidates': enriched,
            'blocked': report.get('skipped_tools', [])
        }, f, indent=2)

    logger.info(f"Vetted list saved to {output_path}")

if __name__ == '__main__':
    main()
