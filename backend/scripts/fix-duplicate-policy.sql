-- ========================================================
-- CLEAN SLATE FIX: REMOVE AND RE-ADD
-- ========================================================

-- 1. DROP EVERYTHING FIRST (To prevent "already exists" errors)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Authenticated can view all profiles" ON profiles; -- Drop the one causing error

-- 2. NOW Re-Create the Single, Fast Policy
CREATE POLICY "Authenticated can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- 3. Restore Update Policy
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 4. Enable RLS (Just in case)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
