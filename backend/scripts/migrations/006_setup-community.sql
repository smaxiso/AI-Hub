-- Create community_suggestions table
CREATE TABLE IF NOT EXISTS public.community_suggestions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('tool', 'quiz_question', 'feedback')),
    content JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.community_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow users to create suggestions
CREATE POLICY "Users can create suggestions" 
ON public.community_suggestions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can view their own suggestions
CREATE POLICY "Users can view own suggestions" 
ON public.community_suggestions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all suggestions
CREATE POLICY "Admins can view all suggestions" 
ON public.community_suggestions 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'owner'
    )
);

-- Admins can update status
CREATE POLICY "Admins can update suggestions" 
ON public.community_suggestions 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'owner'
    )
);
