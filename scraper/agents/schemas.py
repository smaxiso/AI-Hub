import os
import json
from pydantic import BaseModel, Field, field_validator
from typing import List, Literal, Optional

# Load categories from config (we do it lazily or just hardcode if simple)
# For Pydantic Literal, we need the actual strings.
CATEGORIES = [
    'Chat', 'Image', 'Video', 'Audio', 'Coding', 'Agent',
    'Writing', 'Design', 'Productivity', 'Research',
    '3D', 'Business', 'Education', 'Social Media'
]

CategoryLiteral = Literal[
    'Chat', 'Image', 'Video', 'Audio', 'Coding', 'Agent',
    'Writing', 'Design', 'Productivity', 'Research',
    '3D', 'Business', 'Education', 'Social Media'
]

PricingLiteral = Literal["Free", "Freemium", "Paid"]

class RawCandidate(BaseModel):
    name: str
    url: str
    detail_url: str
    description: str
    source: str
    icon: Optional[str] = ""
    category: Optional[str] = "Chat"  # Default heuristic category
    categories: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    pricing: Optional[str] = "Freemium"

class ToolClassification(BaseModel):
    primary_category: CategoryLiteral = Field(..., description="The main category that best describes this tool.")
    secondary_categories: List[CategoryLiteral] = Field(default_factory=list, description="Up to 2 additional relevant categories.", max_length=2)
    tags: List[str] = Field(default_factory=list, description="Up to 5 descriptive tags.", max_length=5)
    pricing: PricingLiteral = Field(..., description="Inferred pricing model based on description or common knowledge.")
    business_use_case: str = Field(..., description="A 1-2 sentence summary of how a business or professional would use this tool.")
    quality_score: int = Field(..., description="1-10 score of how likely this is a real, useful AI tool and not spam/junk.", ge=1, le=10)

class EnrichedTool(BaseModel):
    name: str
    url: str
    detail_url: str
    description: str
    source: str
    icon: str
    category: str
    categories: List[str]
    tags: List[str]
    pricing: str
    use_cases: List[str]
    quality_score: int
    embedding: Optional[List[float]] = None

class PipelineReport(BaseModel):
    timestamp: str
    total_scraped: int
    total_classified: int
    total_inserted: int
    total_updated: int
    total_skipped: int
    total_errors: int
    new_tools: List[dict]
    updated_tools: List[dict]
    skipped_tools: List[dict]
    errors: List[str]
