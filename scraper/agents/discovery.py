"""
Discovery Agent — wraps existing scraping logic into an agent interface.
"""
import os
import json
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

# Imports from existing scraper files (assuming they are in the parent directory)
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import load_sources, is_blocked, is_junk_name
from scrapers import scrape_site
from api_sources import API_SOURCES
from sync import get_supabase, fetch_existing_tools, slugify

logger = logging.getLogger(__name__)

class DiscoveryAgent:
    def __init__(self, config_path=None, workers=3, skip_apis=False):
        self.config_path = config_path
        self.workers = workers
        self.skip_apis = skip_apis
        
        # Load known DB state to pre-filter
        self.supabase = get_supabase()
        self.by_id, self.by_name, self.by_url = fetch_existing_tools(self.supabase)
        logger.info(f"Loaded existing tools from DB: {len(self.by_id)}")

    def _run_site_scraper(self, site_config):
        name = site_config['name']
        try:
            tools = scrape_site(site_config)
            logger.info(f'  ✓ {name}: {len(tools)} tools')
            return name, tools, None
        except Exception as e:
            logger.error(f'  ✗ {name} failed: {e}')
            return name, [], str(e)

    def _run_api_scraper(self, api_name, scraper_fn):
        try:
            tools = scraper_fn()
            logger.info(f'  ✓ {api_name}: {len(tools)} tools')
            return api_name, tools, None
        except Exception as e:
            logger.error(f'  ✗ {api_name} failed: {e}')
            return api_name, [], str(e)

    def is_known(self, candidate: dict) -> bool:
        """Check if candidate is already in DB."""
        name = candidate.get('name', '').lower().strip()
        url = candidate.get('url', '').lower().rstrip('/')
        tool_id = slugify(candidate.get('name', ''))

        if tool_id in self.by_id: return True
        if name and name in self.by_name: return True
        if url and url in self.by_url: return True
        return False

    def run(self, output_path: str):
        logger.info(f"=== Starting Discovery Agent (Workers: {self.workers}) ===")
        
        try:
            site_sources = load_sources(self.config_path)
        except Exception as e:
            logger.error(f"Failed to load sources: {e}")
            return []

        api_names = [] if self.skip_apis else list(API_SOURCES.keys())
        
        all_candidates = []
        source_stats = {}

        with ThreadPoolExecutor(max_workers=self.workers) as pool:
            futures = {}

            for site_config in site_sources:
                f = pool.submit(self._run_site_scraper, site_config)
                futures[f] = site_config['name']

            for api_name in api_names:
                f = pool.submit(self._run_api_scraper, api_name, API_SOURCES[api_name])
                futures[f] = api_name

            for future in as_completed(futures):
                source_name = futures[future]
                try:
                    name, tools, error = future.result()
                    source_stats[name] = {'count': len(tools), 'error': error}
                    all_candidates.extend(tools)
                except Exception as e:
                    logger.error(f'  ✗ {source_name} crashed: {e}')
                    source_stats[source_name] = {'count': 0, 'error': str(e)}

        # Filter out junk, blocked, and known tools
        filtered_candidates = []
        skipped_count = 0
        
        for c in all_candidates:
            if not c.get('name') or is_junk_name(c['name']):
                skipped_count += 1
                continue
            if is_blocked(c['name'], c.get('url', '')):
                skipped_count += 1
                continue
            if self.is_known(c):
                skipped_count += 1
                continue
                
            filtered_candidates.append(c)

        logger.info(f"Discovery Complete. Raw: {len(all_candidates)}, Skipped: {skipped_count}, New Candidates: {len(filtered_candidates)}")

        # Deduplicate within the current run
        unique_candidates = {c['url'] or c['name']: c for c in filtered_candidates}.values()
        unique_list = list(unique_candidates)

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump({'candidates': unique_list, 'stats': source_stats}, f, indent=2)
            
        logger.info(f"Saved {len(unique_list)} candidates to {output_path}")
        return unique_list
