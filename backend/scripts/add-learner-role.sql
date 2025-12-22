-- ============================================
-- Update profiles table to support 'learner' role
-- ============================================

-- Drop existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new constraint with 'learner' role
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('owner', 'admin', 'pending', 'learner'));

-- Verify the change
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'profiles_role_check';
