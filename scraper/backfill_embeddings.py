import os
import json
import time
import logging
from dotenv import load_dotenv
from supabase import create_client
from google import genai

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing SUPABASE credentials.")
    exit(1)
if not GEMINI_API_KEY:
    logger.error("Missing GEMINI_API_KEY.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
client = genai.Client(api_key=GEMINI_API_KEY)

def generate_embedding(tool):
    """Generate 768-dim semantic embedding using Gemini."""
    name = tool.get('name', '')
    desc = tool.get('description', '')
    cats = ' '.join(tool.get('categories', []))
    tags = ' '.join(tool.get('tags', []))
    use_cases = ' '.join(tool.get('use_cases', []))
    
    text = f"{name} {desc} {cats} {tags} {use_cases}"
    
    try:
        resp = client.models.embed_content(
            model="text-embedding-004",
            contents=text
        )
        return resp.embeddings[0].values
    except Exception as e:
        logger.error(f"Failed to generate embedding for {name}: {e}")
        return None

def backfill():
    # 1. Fetch tools without embeddings
    # Note: pgvector adds an IS NULL check capability, but Supabase python client might be tricky
    # Let's fetch all and filter client-side if needed, or try is_("embedding", "null")
    try:
        result = supabase.table('tools').select('*').is_('embedding', 'null').execute()
        tools = result.data
    except Exception as e:
        logger.error(f"Failed to fetch tools: {e}")
        return

    if not tools:
        logger.info("No tools found that need embeddings. Backfill complete.")
        return

    logger.info(f"Found {len(tools)} tools requiring embeddings.")

    batch_size = 10
    updated_count = 0

    for i in range(0, len(tools), batch_size):
        batch = tools[i:i+batch_size]
        for tool in batch:
            emb = generate_embedding(tool)
            if emb:
                try:
                    supabase.table('tools').update({'embedding': emb}).eq('id', tool['id']).execute()
                    updated_count += 1
                    logger.info(f"Updated: {tool['name']}")
                except Exception as e:
                    logger.error(f"DB update failed for {tool['name']}: {e}")
            
            # Rate limit protection (Gemini API)
            time.sleep(4)  # ~15 RPM
            
    logger.info(f"Backfill complete! Updated {updated_count}/{len(tools)} tools.")

if __name__ == '__main__':
    backfill()
