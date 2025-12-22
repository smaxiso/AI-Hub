-- Fix Infinite Recursion by removing the self-referencing policy
-- Ideally, use a SECURITY DEFINER function for admin checks, or rely on Service Role key for admin ops.

-- 1. Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 2. Ensure the "View Own Profile" policy exists (safely drop and recreate to be sure)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 3. Ensure Update policy is present
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 4. Create a SAFE Admin Policy using a SECURITY DEFINER function (Best Practice)
-- This function runs with owner privileges, bypassing RLS to check the role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now use this function in the policy (No recursion because function bypasses RLS)
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (public.is_admin());
