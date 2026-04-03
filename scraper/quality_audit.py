import json
import os
import sys

# Add current dir to path to import config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config import is_blocked, is_junk_name

def audit():
    report_path = 'last_scrape_report.json'
    if not os.path.exists(report_path):
        print(f"Error: {report_path} not found.")
        return

    with open(report_path, 'r') as f:
        data = json.load(f)

    # Note: the report only has some tools now, but let's check what we have
    new_tools = data.get('new_tools', [])
    vetted_tools = []
    rejected_tools = []

    for tool in new_tools:
        name = tool.get('name', '')
        url = tool.get('url', '')
        
        if is_blocked(name, url):
            tool['rejection_reason'] = "Blocked by blocklist.json"
            rejected_tools.append(tool)
        elif is_junk_name(name):
            tool['rejection_reason'] = "Blocked by junk name rules"
            rejected_tools.append(tool)
        else:
            vetted_tools.append(tool)

    print(f"Initial in report: {len(new_tools)}")
    print(f"Vetted:           {len(vetted_tools)}")
    print(f"Rejected:         {len(rejected_tools)}")

    output = {
        'vetted': vetted_tools,
        'rejected': rejected_tools
    }

    with open('vetted_tools_report.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("\n--- SAMPLE VETTED ---")
    for t in vetted_tools[:15]:
        print(f"  [OK] {t['name']:25} | {t['url']}")

    print("\n--- SAMPLE REJECTED ---")
    for t in rejected_tools[:15]:
        print(f"  [REJECT] {t['name']:25} | {t['rejection_reason']} | {t['url']}")

if __name__ == "__main__":
    audit()
