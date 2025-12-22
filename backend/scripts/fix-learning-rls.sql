-- Enable RLS on learning tables if not already enabled
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- DROP existing policies to avoid conflicts (and ensure we have the correct ones)
DROP POLICY IF EXISTS "Public can view published modules" ON learning_modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON learning_modules;
DROP POLICY IF EXISTS "Admins can manage quiz questions" ON quiz_questions;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;

DROP POLICY IF EXISTS "Users can view own completions" ON module_completions;
DROP POLICY IF EXISTS "Users can insert own completions" ON module_completions;

DROP POLICY IF EXISTS "Users can view own attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON quiz_attempts;

-- ==========================================
-- RE-APPLY POLICIES
-- ==========================================

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

-- quiz_questions: Accessible through API only (no direct public access usually needed, but admins need access)
CREATE POLICY "Admins can manage quiz questions" ON quiz_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- We need a policy for users to READ quiz questions? 
-- The API fetches them with service role usually? No, `GET /api/learning/quiz/:moduleId` does `supabase.from('quiz_questions')`.
-- Wait, the backend uses `authenticateUser` middleware which gets the user.
-- The backend uses the `supabase` client which is initialized... wait.
-- If `backend/index.js` initializes `supabase` with `SUPABASE_SERVICE_ROLE_KEY`, then RLS IS BYPASSED for backend calls!
-- Let's check `backend/index.js`.

-- user_progress: Users can only see/init their own
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- module_completions
CREATE POLICY "Users can view own completions" ON module_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON module_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- quiz_attempts
CREATE POLICY "Users can view own attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
