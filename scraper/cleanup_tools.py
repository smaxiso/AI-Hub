#!/usr/bin/env python3
"""Delete non-AI junk tools from the database."""

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

# Tools to delete — identified in audit as non-AI, blog posts, GitHub repos, duplicates, etc.
DELETE_IDS = [
    # Chat category — Reddit/GitHub noise
    "agent-skills",
    "ai-hedge-fund",
    "aibyshinde",
    "aitoearn",
    "anthropic",
    "apxml",
    "areal",
    "atlassian-mcp-server",
    "bettafish",
    "claude-code-ultimate-guide",
    "dnhkng",
    "grape-root",
    "hermes-agent",
    "learn-claude-code",
    "letters",
    "marktext",
    "minebench",
    "nanochat",
    "nanonets",
    "notebooklm-py",
    "one-api",
    "promptfoo",
    "register",
    "ttanv",
    "ukc-pink",
    "unsloth",
    "vane",
    "webnovel-writer",
    # Coding category — noise
    "awesome-copilot",
    "codegraphcontext",
    "copy",
    "deer-flow",
    "easy-vibe",
    "gsstk",
    "news",
    "react-grab",
    # Audio category — not AI audio tools
    "airi",
    "fellow",
    # Agent category — duplicate / niche
    "meshy",       # duplicate of "meshy-ai" in 3D
    "myluca",
    # Productivity — not a separate tool
    "comet",
]

def main():
    # First verify which IDs actually exist
    result = supabase.table('tools').select('id, name').execute()
    existing = {t['id']: t['name'] for t in result.data}

    found = []
    not_found = []
    for tid in DELETE_IDS:
        if tid in existing:
            found.append((tid, existing[tid]))
        else:
            not_found.append(tid)

    print(f"Found {len(found)} tools to delete:")
    for tid, name in found:
        print(f"  ✗ {tid:45s} ({name})")

    if not_found:
        print(f"\n{len(not_found)} IDs not found in DB (already deleted or different slug):")
        for tid in not_found:
            print(f"  ? {tid}")

    if not found:
        print("\nNothing to delete.")
        return

    confirm = input(f"\nDelete {len(found)} tools? (yes/no): ")
    if confirm.strip().lower() != 'yes':
        print("Aborted.")
        return

    deleted = 0
    errors = 0
    for tid, name in found:
        try:
            supabase.table('tools').delete().eq('id', tid).execute()
            print(f"  ✓ Deleted: {name}")
            deleted += 1
        except Exception as e:
            print(f"  ✗ Failed to delete {name}: {e}")
            errors += 1

    print(f"\nDone. Deleted: {deleted}, Errors: {errors}")
    print(f"Remaining tools: {len(existing) - deleted}")

if __name__ == '__main__':
    main()
