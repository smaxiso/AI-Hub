-- 005_setup-certifications.sql
-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  level TEXT NOT NULL,
  icon_key TEXT DEFAULT 'certificate',
  requirements JSONB DEFAULT '{}',
  points_awarded INTEGER DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User certifications table
CREATE TABLE IF NOT EXISTS user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  score_average NUMERIC(5,2),
  certificate_number TEXT UNIQUE,
  UNIQUE(user_id, certification_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_certifications_user ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_cert ON user_certifications(certification_id);
CREATE INDEX IF NOT EXISTS idx_certifications_level ON certifications(level);

-- RLS policies
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;

-- Everyone can read certifications
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'certifications_read_all') THEN
    CREATE POLICY certifications_read_all ON certifications FOR SELECT USING (true);
  END IF;
END $$;

-- Service role can insert/update certifications
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'certifications_service_write') THEN
    CREATE POLICY certifications_service_write ON certifications FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Users can read their own certifications
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_certs_read_own') THEN
    CREATE POLICY user_certs_read_own ON user_certifications FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Service role can manage user certifications
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_certs_service_write') THEN
    CREATE POLICY user_certs_service_write ON user_certifications FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
