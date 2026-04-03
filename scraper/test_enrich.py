from scrapers import enrich_tool_details
from scrapling.fetchers import StealthyFetcher, Fetcher
import json
import logging

logging.basicConfig(level=logging.INFO)

test_tool = {
    "name": "Wp Chat Ai",
    "detail_url": "https://aitoptools.com/tool/wp-chat-ai/",
    "url": "https://aitoptools.com/tool/wp-chat-ai/"
}

print("Testing with StealthyFetcher...")
result = enrich_tool_details(test_tool.copy(), fetcher_class=StealthyFetcher)
print(f"Result URL: {result['url']}")

print("\nTesting with Fetcher...")
result = enrich_tool_details(test_tool.copy(), fetcher_class=Fetcher)
print(f"Result URL: {result['url']}")
