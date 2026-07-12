"""
Orchestrator for the 3-stage Autonomous AI Tool Ingestion Pipeline.
"""
import os
import argparse
import logging
import sys
from dotenv import load_dotenv
load_dotenv()

from agents.discovery import DiscoveryAgent
from agents.classifier import ClassificationAgent
from agents.quality_guard import QualityGuardAgent

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger(__name__)

def run_pipeline(dry_run=False, skip_apis=False, skip_classify=False, workers=3):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(base_dir, 'pipeline_output')
    
    # File paths
    discovery_out = os.path.join(output_dir, 'discovery_candidates.json')
    classifier_out = os.path.join(output_dir, 'classified_tools.json')
    
    # 1. Discovery Agent
    discovery = DiscoveryAgent(workers=workers, skip_apis=skip_apis)
    candidates = discovery.run(output_path=discovery_out)
    
    if not candidates:
        logger.info("No new candidates discovered. Pipeline stopping.")
        return

    # 2. Classification Agent
    classifier = ClassificationAgent()
    if skip_classify:
        logger.info("Skipping LLM classification, falling back to heuristics...")
        # Override client to force heuristic fallback
        classifier.client = None
        
    classifier.run(input_path=discovery_out, output_path=classifier_out)

    # 3. Quality Guard & Sync
    guard = QualityGuardAgent()
    report = guard.run(input_path=classifier_out, output_dir=output_dir, dry_run=dry_run)
    
    if report:
        logger.info("=== Pipeline Run Complete ===")
        logger.info(f"Inserted: {report['total_inserted']}")
        logger.info(f"Updated:  {report['total_updated']}")
        logger.info(f"Skipped:  {report['total_skipped']}")
        logger.info(f"Errors:   {report['total_errors']}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='AI-Hub Autonomous Ingestion Pipeline')
    parser.add_argument('--dry-run', action='store_true', help='Scrape and classify, but do not write to DB')
    parser.add_argument('--skip-apis', action='store_true', help='Skip API sources (Reddit, GitHub, Trends)')
    parser.add_argument('--skip-classify', action='store_true', help='Skip LLM classification (use heuristic defaults)')
    parser.add_argument('--workers', type=int, default=3, help='Parallel threads for discovery')
    
    args = parser.parse_args()
    
    try:
        run_pipeline(
            dry_run=args.dry_run,
            skip_apis=args.skip_apis,
            skip_classify=args.skip_classify,
            workers=args.workers
        )
    except KeyboardInterrupt:
        logger.info("Pipeline interrupted by user.")
        sys.exit(1)
    except Exception as e:
        logger.exception(f"Pipeline crashed: {e}")
        sys.exit(1)
