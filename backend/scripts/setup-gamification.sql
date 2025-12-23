-- Gamification Tables

-- 1. Achievements (Badges)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon_key TEXT NOT NULL, -- e.g. 'fire', 'star', 'trophy', 'rocket', 'brain'
  requirement_type TEXT NOT NULL, -- 'module_completion', 'level_completion', 'streak', 'quiz_perfect'
  requirement_value JSONB, -- e.g. { "count": 1 } or { "level": "beginner" }
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Achievements (Earned Badges)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 3. Learning Streaks
CREATE TABLE IF NOT EXISTS learning_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS Policies

-- Achievements: Public Read, Admin Write
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view achievements" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON achievements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- User Achievements: Users view own
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Serve can insert user achievements" ON user_achievements
  FOR INSERT WITH CHECK (true); -- Usually inserted by backend triggers/logic, but we allow insert for now if using service key

-- Streaks: Users view own
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON learning_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON learning_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_streaks_user ON learning_streaks(user_id);
