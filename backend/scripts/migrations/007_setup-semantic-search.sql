-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add embedding column to tools table
-- We use 768 dimensions for Gemini text-embedding-004
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS embedding vector(768);

-- 3. Create HNSW index for fast similarity search
-- Using cosine distance (vector_cosine_ops)
CREATE INDEX IF NOT EXISTS tools_embedding_idx ON public.tools 
USING hnsw (embedding vector_cosine_ops);

-- 4. Create the match_related_tools RPC function
CREATE OR REPLACE FUNCTION match_related_tools (
  target_tool_id text,
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id text,
  name text,
  url text,
  category text,
  description text,
  pricing text,
  icon text,
  similarity float
)
LANGUAGE plpgsql
AS $$
DECLARE
  target_embedding vector(768);
BEGIN
  -- Fetch the embedding for the target tool
  SELECT embedding INTO target_embedding
  FROM public.tools
  WHERE tools.id = target_tool_id;

  -- If the target tool has no embedding, return nothing
  IF target_embedding IS NULL THEN
    RETURN;
  END IF;

  -- Return tools ranked by cosine similarity, excluding the target tool itself
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.url,
    t.category,
    t.description,
    t.pricing,
    t.icon,
    1 - (t.embedding <=> target_embedding) AS similarity
  FROM public.tools t
  WHERE t.id != target_tool_id
    AND t.embedding IS NOT NULL
    AND 1 - (t.embedding <=> target_embedding) > match_threshold
  ORDER BY t.embedding <=> target_embedding
  LIMIT match_count;
END;
$$;
