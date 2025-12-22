-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1. Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 2. Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 3. Allow admins/owners to view all profiles (for user management)
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles AS p 
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'owner')
  )
);

-- 4. Allow unauthenticated read (optional - usually not needed unless public profiles)
-- CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
