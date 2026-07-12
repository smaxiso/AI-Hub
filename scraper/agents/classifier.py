"""
Classification Agent — uses Gemini Flash + Instructor to extract taxonomy and use cases.
"""
import os
import json
import logging
import time
from typing import List, Dict, Any

from pydantic import ValidationError
import instructor
from google import genai
from google.genai import types

from .schemas import ToolClassification, EnrichedTool

logger = logging.getLogger(__name__)

class ClassificationAgent:
    def __init__(self, batch_size=10, rpm_limit=15):
        self.batch_size = batch_size
        self.rpm_limit = rpm_limit
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found. Classification Agent will fall back to heuristic categorization.")
            self.client = None
        else:
            # Initialize Gemini client and patch with Instructor
            raw_client = genai.Client(api_key=self.api_key)
            self.client = instructor.from_gemini(
                raw_client,
                mode=instructor.Mode.GEMINI_JSON,
            )

    def _heuristic_fallback(self, candidate: Dict[str, Any]) -> ToolClassification:
        """Fallback if LLM fails or is disabled."""
        return ToolClassification(
            primary_category=candidate.get('category', 'Chat') or 'Chat',
            secondary_categories=[],
            tags=candidate.get('tags', [])[:5],
            pricing=candidate.get('pricing', 'Freemium') or 'Freemium',
            business_use_case=candidate.get('description', '')[:100] + "...",
            quality_score=5
        )

    def classify_tool(self, candidate: Dict[str, Any]) -> ToolClassification:
        if not self.client:
            return self._heuristic_fallback(candidate)

        prompt = f"""
        Analyze the following AI tool candidate and extract its classification data.
        
        Name: {candidate.get('name')}
        URL: {candidate.get('url')}
        Description: {candidate.get('description')}
        Source Tags: {', '.join(candidate.get('tags', []))}
        
        Provide the primary category, secondary categories, tags, pricing model, a business use case summary (1-2 sentences), and a quality score (1-10).
        """

        try:
            resp = self.client.chat.completions.create(
                model="gemini-2.5-flash",
                messages=[{"role": "user", "content": prompt}],
                response_model=ToolClassification,
                max_retries=2
            )
            return resp
        except Exception as e:
            logger.error(f"Classification failed for {candidate.get('name')}: {e}")
            return self._heuristic_fallback(candidate)

    def run(self, input_path: str, output_path: str) -> List[dict]:
        logger.info("=== Starting Classification Agent ===")
        
        if not os.path.exists(input_path):
            logger.error(f"Input file not found: {input_path}")
            return []

        with open(input_path, 'r') as f:
            data = json.load(f)
            candidates = data.get('candidates', [])

        enriched_tools = []
        delay = 60.0 / self.rpm_limit if self.rpm_limit else 0

        for i, candidate in enumerate(candidates):
            logger.info(f"Classifying ({i+1}/{len(candidates)}): {candidate.get('name')}")
            
            classification = self.classify_tool(candidate)
            
            # Merge categories and deduplicate
            all_cats = [classification.primary_category] + classification.secondary_categories
            unique_cats = list(dict.fromkeys(all_cats))

            # Generate Semantic Vector Embedding
            embedding = None
            if self.client:
                try:
                    embed_context = f"{candidate.get('name')} {candidate.get('description')} {' '.join(unique_cats)} {' '.join(classification.tags)} {classification.business_use_case}"
                    # Gemini text-embedding-004 defaults to 768 dimensions
                    resp = self.client.client.models.embed_content(
                        model="text-embedding-004",
                        contents=embed_context
                    )
                    embedding = resp.embeddings[0].values
                except Exception as e:
                    logger.warning(f"Failed to generate embedding for {candidate.get('name')}: {e}")

            enriched = EnrichedTool(
                name=candidate.get('name', ''),
                url=candidate.get('url', ''),
                detail_url=candidate.get('detail_url', ''),
                description=candidate.get('description', ''),
                source=candidate.get('source', ''),
                icon=candidate.get('icon', ''),
                category=classification.primary_category,
                categories=unique_cats,
                tags=classification.tags,
                pricing=classification.pricing,
                use_cases=[classification.business_use_case] if classification.business_use_case else [],
                quality_score=classification.quality_score,
                embedding=embedding
            )
            
            enriched_tools.append(enriched.model_dump())
            
            if self.client and delay > 0:
                time.sleep(delay) # Respect rate limits

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump({'classified_tools': enriched_tools}, f, indent=2)

        logger.info(f"Classification Complete. Saved {len(enriched_tools)} tools to {output_path}")
        return enriched_tools
