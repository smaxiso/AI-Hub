import os
import sys
import json
import logging
import requests
from dotenv import load_dotenv
load_dotenv()
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from sync import get_supabase, sync_tools
from config import CATEGORIES
from agents.classifier import ClassificationAgent

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger(__name__)

KNOWN_BAD_LOGOS = [
    'https://aitoptools.com/wp-content/uploads/2024/01/aitoptool-logo-black.png'
]

def check_url(url):
    """Check if URL is reachable (returns < 400)."""
    if not url:
        return False
    try:
        headers = {'User-Agent': 'TheAIHubX-Scraper/1.0'}
        # Try HEAD first
        resp = requests.head(url, headers=headers, allow_redirects=True, timeout=2)
        if resp.status_code >= 400:
            # Fallback to GET for sites that block HEAD
            resp = requests.get(url, headers=headers, allow_redirects=True, timeout=2)
        return resp.status_code < 400
    except requests.exceptions.RequestException:
        return False

def check_tool(tool):
    """Worker function to check tool link and icon."""
    dead_link = False
    bad_icon = False
    
    # 1. Link Rot Check
    if not check_url(tool.get('url')):
        dead_link = True
        
    # 2. Logo Purge
    icon = tool.get('icon')
    if icon:
        if icon in KNOWN_BAD_LOGOS:
            bad_icon = True
        elif not check_url(icon):
            bad_icon = True
            
    return tool, dead_link, bad_icon

def main():
    logger.info("=== Starting Database Deep Audit ===")
    supabase = get_supabase()
    
    logger.info("Fetching all tools from database...")
    result = supabase.table('tools').select('*').execute()
    tools = result.data or []
    logger.info(f"Fetched {len(tools)} tools.")
    
    deleted_count = 0
    nullified_count = 0
    reclassified_count = 0
    
    to_delete = []
    to_nullify_icon = []
    to_reclassify = []
    
    # Process link rot and bad icons concurrently
    logger.info("Checking links and icons (this may take a minute)...")
    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = {executor.submit(check_tool, t): t for t in tools}
        for future in as_completed(futures):
            tool, dead_link, bad_icon = future.result()
            
            if dead_link:
                to_delete.append(tool['id'])
                continue # Skip icon/taxonomy checks if we are deleting it
                
            if bad_icon:
                to_nullify_icon.append(tool['id'])
                
            # 3. Taxonomy Validation
            category = tool.get('category')
            categories = tool.get('categories') or []
            if not categories or category not in CATEGORIES:
                to_reclassify.append(tool)

    # Execute Deletions
    if to_delete:
        logger.info(f"Deleting {len(to_delete)} tools with dead links...")
        for tool_id in to_delete:
            try:
                supabase.table('tools').delete().eq('id', tool_id).execute()
                deleted_count += 1
            except Exception as e:
                logger.error(f"Failed to delete {tool_id}: {e}")
                
    # Execute Icon Nullifications
    if to_nullify_icon:
        logger.info(f"Nullifying {len(to_nullify_icon)} bad logos...")
        for tool_id in to_nullify_icon:
            try:
                supabase.table('tools').update({'icon': None}).eq('id', tool_id).execute()
                nullified_count += 1
            except Exception as e:
                logger.error(f"Failed to nullify icon for {tool_id}: {e}")

    # Execute Reclassification
    if to_reclassify:
        logger.info(f"Queueing {len(to_reclassify)} tools for Gemini Classification Agent...")
        temp_input = os.path.join(os.path.dirname(__file__), 'temp_reclassify_input.json')
        temp_output = os.path.join(os.path.dirname(__file__), 'temp_reclassify_output.json')
        
        with open(temp_input, 'w') as f:
            json.dump({'candidates': to_reclassify}, f)
            
        agent = ClassificationAgent()
        agent.run(input_path=temp_input, output_path=temp_output)
        
        if os.path.exists(temp_output):
            with open(temp_output, 'r') as f:
                data = json.load(f)
                classified_tools = data.get('classified_tools', data) if isinstance(data, dict) else data
                
            logger.info("Syncing reclassified tools back to DB...")
            sync_results = sync_tools(classified_tools, dry_run=False)
            reclassified_count = sync_results.get('updated', 0)
            
            os.remove(temp_input)
            os.remove(temp_output)

    logger.info("=== Audit Complete ===")
    logger.info(f"Deleted {deleted_count} dead tools")
    logger.info(f"Nullified {nullified_count} bad logos")
    logger.info(f"Re-classified {reclassified_count} tools")

if __name__ == '__main__':
    main()
