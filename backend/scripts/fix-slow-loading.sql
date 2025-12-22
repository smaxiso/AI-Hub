-- ========================================================
-- NUCLEAR OPTION: FIX PROFILE LOADING DELAY
-- ========================================================

-- 1. Disable RLS temporarily to clear any weird state (optional, but good for reset)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies on profiles to ensure no "recursive" or "blocking" policies remain
DROP POLICY IF EXISTS "Public can view published modules" ON profiles; -- (Wrong table, but just in case)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- 3. Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create a SIMPLE, NON-BLOCKING READ POLICY
-- "Anyone who is logged in can view ANY profile"
-- This removes individual checks and recursion risks entirely.
CREATE POLICY "Authenticated can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- 5. Create Update policy (Users can only update their own)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 6. Grant basic permissions (just to be safe)
GRANT SELECT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon; -- Optional: if you want completely public profiles later
