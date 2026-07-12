-- Database Migration: Setup pipeline_runs table for scraper observability

-- Create pipeline_runs table
CREATE TABLE IF NOT EXISTS public.pipeline_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
    total_scraped INTEGER DEFAULT 0,
    total_classified INTEGER DEFAULT 0,
    total_inserted INTEGER DEFAULT 0,
    total_updated INTEGER DEFAULT 0,
    total_skipped INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    report JSONB,
    error_message TEXT
);

-- Secure it with RLS (only service_role or owner should be able to view/edit)
ALTER TABLE public.pipeline_runs ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (for the pipeline to write)
CREATE POLICY "Service role full access to pipeline_runs" 
    ON public.pipeline_runs FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow owner to view runs via API/Dashboard
CREATE POLICY "Owners can view pipeline runs"
    ON public.pipeline_runs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'owner'
        )
    );
