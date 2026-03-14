/**
 * Setup certifications tables and seed 4 level certifications.
 *
 * Tables created:
 *   - certifications: defines available certs (one per level)
 *   - user_certifications: tracks earned certs per user
 *
 * Run: cd backend && node scripts/setup-certifications.js
 */

const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function tryConnect() {
  const connectionStrings = [
    process.env.DATABASE_URL_IPV4_SESSION_POOLER,
    process.env.DATABASE_URL_IPV6,
    process.env.DATABASE_URL_IPV4_TRANSACTION_POOLER
  ].filter(s => s && s.length > 10);

  for (const cs of connectionStrings) {
    try {
      // Parse manually because # in password breaks URL parser
      const match = cs.match(/^postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+)$/);
      if (!match) continue;
      const [, user, password, host, port, database] = match;
      const client = new Client({ host, port: parseInt(port), database, user, password, ssl: { rejectUnauthorized: false } });
      await client.connect();
      return client;
    } catch (e) {
      // try next
    }
  }
  return null;
}

const DDL = `
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
`;

const CERTIFICATIONS = [
  {
    name: 'AI Foundations Certificate',
    description: 'Demonstrated foundational knowledge of AI tools, prompt engineering, and practical AI applications. Completed all 5 beginner modules with passing quiz scores.',
    level: 'beginner',
    icon_key: 'foundation',
    requirements: { level: 'beginner', modules_required: 5, min_quiz_score: 90 },
    points_awarded: 500
  },
  {
    name: 'AI Practitioner Certificate',
    description: 'Proven proficiency in advanced prompting, AI workflows, business applications, and research techniques. Completed all 5 intermediate modules with passing quiz scores.',
    level: 'intermediate',
    icon_key: 'practitioner',
    requirements: { level: 'intermediate', modules_required: 5, min_quiz_score: 90 },
    points_awarded: 1000
  },
  {
    name: 'AI Specialist Certificate',
    description: 'Expert-level knowledge in fine-tuning, AI security, multi-agent systems, product design, and infrastructure. Completed all 5 advanced modules with passing quiz scores.',
    level: 'advanced',
    icon_key: 'specialist',
    requirements: { level: 'advanced', modules_required: 5, min_quiz_score: 90 },
    points_awarded: 2000
  },
  {
    name: 'AI Expert Certificate',
    description: 'Mastery of production AI applications, organizational strategy, frontier models, evaluation systems, and AI\'s societal impact. Completed all 5 expert modules with passing quiz scores.',
    level: 'expert',
    icon_key: 'expert',
    requirements: { level: 'expert', modules_required: 5, min_quiz_score: 90 },
    points_awarded: 5000
  }
];

async function main() {
  console.log('\n🎓 Setting up Certifications...\n');

  // Create tables via pg
  const pg = await tryConnect();
  if (!pg) {
    console.error('❌ Could not connect to PostgreSQL. Check DATABASE_URL_* env vars in backend/.env');
    console.log('\nAlternatively, run this DDL manually in Supabase SQL Editor:\n');
    console.log(DDL);
    process.exit(1);
  }

  console.log('📦 Creating tables...');
  await pg.query(DDL);
  await pg.end();
  console.log('   ✅ Tables created\n');

  // Seed certifications
  console.log('🏅 Seeding 4 certifications...');
  for (const cert of CERTIFICATIONS) {
    const { data, error } = await supabase
      .from('certifications')
      .upsert(cert, { onConflict: 'name' })
      .select();

    if (error) {
      console.error(`   ❌ ${cert.name}: ${error.message}`);
    } else {
      console.log(`   ✅ ${cert.name} (${cert.level}, ${cert.points_awarded} pts)`);
    }
  }

  // Verify
  const { data: all, error: vErr } = await supabase
    .from('certifications')
    .select('name, level, points_awarded')
    .order('points_awarded');

  if (vErr) {
    console.error('\n❌ Verification failed:', vErr.message);
  } else {
    console.log(`\n🔍 Verified: ${all.length} certifications in database`);
    all.forEach(c => console.log(`   ${c.level}: ${c.name} (${c.points_awarded} pts)`));
  }

  console.log('\n✅ Certifications setup complete!\n');
}

main();
