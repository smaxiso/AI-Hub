"""
Quality Guard Agent — final validation, DB duplicate check, and syncing.
"""
import os
import json
import logging
from datetime import datetime, timezone
import requests

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import QUALITY_THRESHOLD, is_blocked, is_junk_name
from sync import sync_tools, get_supabase

logger = logging.getLogger(__name__)

class QualityGuardAgent:
    def __init__(self, quality_threshold=None):
        self.quality_threshold = quality_threshold or getattr(QUALITY_THRESHOLD, 'value', 4) if hasattr(QUALITY_THRESHOLD, 'value') else 4
        self.supabase = get_supabase()

    def check_db_duplicate(self, url: str) -> bool:
        """Directly query Supabase for duplicate URLs to optimize speed."""
        if not url:
            return False
        try:
            result = self.supabase.table('tools').select('id').eq('url', url).maybe_single().execute()
            return result.data is not None
        except Exception as e:
            logger.warning(f"DB duplicate check failed for {url}: {e}")
            return False

    def validate_url(self, url: str) -> bool:
        """Check if URL is reachable."""
        if not url: return False
        try:
            headers = {'User-Agent': 'TheAIHubX-Scraper/1.0'}
            resp = requests.head(url, headers=headers, allow_redirects=True, timeout=5)
            return resp.status_code < 400
        except Exception:
            return False

    def run(self, input_path: str, output_dir: str, dry_run: bool = False):
        logger.info("=== Starting Quality Guard Agent ===")
        
        if not os.path.exists(input_path):
            logger.error(f"Input file not found: {input_path}")
            return None

        with open(input_path, 'r') as f:
            data = json.load(f)
            candidates = data.get('classified_tools', [])

        vetted = []
        rejected = []

        for c in candidates:
            name = c.get('name', '')
            url = c.get('url', '')
            score = c.get('quality_score', 0)

            # 1. Quality Score Gate
            if score < self.quality_threshold:
                c['rejection_reason'] = f"Low quality score ({score})"
                rejected.append(c)
                continue

            # 2. Re-verify Blocklist/Junk
            if is_blocked(name, url) or is_junk_name(name):
                c['rejection_reason'] = "Blocked or Junk Name"
                rejected.append(c)
                continue

            # 3. Direct DB Duplicate Check
            if self.check_db_duplicate(url):
                c['rejection_reason'] = "Duplicate URL in DB"
                rejected.append(c)
                continue

            # 4. (Optional) URL validation could go here, skipping for speed unless strict mode is needed
            
            vetted.append(c)

        logger.info(f"Quality Guard complete. Vetted: {len(vetted)}, Rejected: {len(rejected)}")

        # Save vetted list
        os.makedirs(output_dir, exist_ok=True)
        vetted_path = os.path.join(output_dir, 'vetted_tools.json')
        with open(vetted_path, 'w') as f:
            json.dump({'vetted': vetted, 'rejected': rejected}, f, indent=2)

        # Sync to DB
        logger.info(f"Starting DB Sync (Dry Run: {dry_run})")
        audit_results = sync_tools(vetted, dry_run=dry_run)

        # Generate Report
        report = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'total_scraped': len(candidates),
            'total_classified': len(candidates),
            'total_inserted': audit_results['inserted'],
            'total_updated': audit_results['updated'],
            'total_skipped': audit_results['skipped'] + len(rejected),
            'total_errors': len(audit_results['errors']),
            'new_tools': audit_results['details'].get('new_tools', []),
            'updated_tools': audit_results['details'].get('updated_tools', []),
            'rejected_tools': rejected,
            'errors': audit_results['errors']
        }

        report_path = os.path.join(output_dir, 'pipeline_report.json')
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
            
        logger.info(f"Report saved to {report_path}")

        # Write to pipeline_runs table
        if not dry_run:
            try:
                self.supabase.table('pipeline_runs').insert({
                    'started_at': report['timestamp'],
                    'completed_at': datetime.now(timezone.utc).isoformat(),
                    'status': 'completed',
                    'total_scraped': report['total_scraped'],
                    'total_classified': report['total_classified'],
                    'total_inserted': report['total_inserted'],
                    'total_updated': report['total_updated'],
                    'total_skipped': report['total_skipped'],
                    'total_errors': report['total_errors'],
                    'report': report
                }).execute()
                logger.info("Audit trail written to pipeline_runs table.")
            except Exception as e:
                logger.error(f"Failed to write to pipeline_runs: {e}")

        return report
