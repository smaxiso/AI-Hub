#!/usr/bin/env python3
"""Fetch all tools from DB and print them grouped by category for audit."""

import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

result = supabase.table('tools').select('id, name, url, category, categories, description, pricing').execute()
tools = result.data or []

print(f"Total tools in DB: {len(tools)}\n")

# Group by primary category
by_cat = {}
for t in tools:
    cat = t.get('category', 'Unknown')
    by_cat.setdefault(cat, []).append(t)

for cat in sorted(by_cat.keys()):
    items = sorted(by_cat[cat], key=lambda x: x['name'].lower())
    print(f"\n{'='*60}")
    print(f"  {cat} ({len(items)} tools)")
    print(f"{'='*60}")
    for t in items:
        desc = (t.get('description') or '')[:80].replace('\n', ' ')
        print(f"  {t['name']:40s} | {t.get('url', '')[:50]}")
        if desc:
            print(f"  {'':40s} | {desc}")
