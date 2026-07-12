-- ============================================
-- TheAIHubX Learning Platform - Database Schema
-- Phase 1: Foundation Tables
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: learning_modules
-- Stores learning modules for different expertise levels
-- ============================================
CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  learning_objectives TEXT[], -- Array of learning goals
  tool_ids UUID[], -- Related tools from existing tools table
  prerequisites UUID[], -- Module IDs that must be completed first
  estimated_duration_minutes INTEGER DEFAULT 30,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(level, order_index)
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_learning_modules_level ON learning_modules(level);
CREATE INDEX IF NOT EXISTS idx_learning_modules_published ON learning_modules(is_published);

-- ============================================
-- Table: quiz_questions
-- Large pool of questions for each module
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- [{text: "Option A", is_correct: false}, {...}]
  explanation TEXT, -- Shown after answering
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic_tag TEXT, -- For categorization and recommendations
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  CONSTRAINT valid_options CHECK (jsonb_array_length(options) >= 2)
);

-- Index for efficient random selection
CREATE INDEX IF NOT EXISTS idx_quiz_questions_module ON quiz_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_active ON quiz_questions(is_active);

-- ============================================
-- Table: user_progress
-- Overall learning progress for each user
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_level TEXT DEFAULT 'beginner' CHECK (current_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  completed_modules UUID[] DEFAULT '{}',
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);

-- ============================================
-- Table: module_completions
-- Track individual module completions and quiz scores
-- ============================================
CREATE TABLE IF NOT EXISTS module_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_type TEXT CHECK (completion_type IN ('quiz', 'self_reported')),
  quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100),
  quiz_attempts INTEGER DEFAULT 1,
  time_spent_minutes INTEGER,
  failed_topics TEXT[], -- Topics to review if quiz failed
  UNIQUE(user_id, module_id)
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_module_completions_user ON module_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_module_completions_module ON module_completions(module_id);

-- ============================================
-- Table: quiz_attempts
-- Track all quiz attempts for analytics
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER,
  correct_answers INTEGER,
  answers JSONB, -- [{question_id, selected_option, is_correct, time_spent}]
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  passed BOOLEAN
);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_module ON quiz_attempts(module_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- learning_modules: Public can read published, admins can do everything
CREATE POLICY "Public can view published modules" ON learning_modules
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage modules" ON learning_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- quiz_questions: Accessible through API only (no direct public access)
CREATE POLICY "Admins can manage quiz questions" ON quiz_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- user_progress: Users can only see their own
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- module_completions: Users can only see their own
CREATE POLICY "Users can view own completions" ON module_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON module_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- quiz_attempts: Users can only see their own
CREATE POLICY "Users can view own attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Triggers for updated_at timestamps
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_learning_modules_updated_at
  BEFORE UPDATE ON learning_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert a sample beginner module
INSERT INTO learning_modules (level, order_index, title, description, learning_objectives, estimated_duration_minutes, is_published)
VALUES (
  'beginner',
  1,
  'Introduction to AI Chat Tools',
  'Learn the basics of AI-powered chatbots and how to use them effectively for various tasks.',
  ARRAY[
    'Understand what AI chat tools are and how they work',
    'Learn to craft effective prompts',
    'Discover practical use cases for daily tasks',
    'Compare different chat AI tools'
  ],
  45,
  true
);

COMMENT ON TABLE learning_modules IS 'Learning modules organized by expertise level';
COMMENT ON TABLE quiz_questions IS 'Pool of quiz questions for module assessments';
COMMENT ON TABLE user_progress IS 'Overall learning progress tracking for users';
COMMENT ON TABLE module_completions IS 'Individual module completion records';
COMMENT ON TABLE quiz_attempts IS 'Detailed quiz attempt history for analytics';
