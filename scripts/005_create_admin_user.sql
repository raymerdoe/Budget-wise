-- Create admin user directly in database
-- This script creates a default admin account

-- First, we need to insert into auth.users (this is handled by Supabase Auth)
-- But we can create a profile with admin role for an existing user

-- Method 1: Create admin profile for existing user
-- Replace 'your-email@example.com' with your actual email
-- You must first sign up normally, then run this script

-- Update user role to admin (replace email with your actual email)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@budgetwise.com';

-- If the profile doesn't exist yet, you can insert it manually
-- (This assumes you already have a user in auth.users)
-- Replace the UUID and email with actual values

-- Method 2: Insert admin profile directly (use this if Method 1 doesn't work)
-- First get your user ID from auth.users table, then insert:

INSERT INTO profiles (id, email, full_name, role) 
VALUES (
  -- You need to replace this UUID with your actual auth.users.id
  '00000000-0000-0000-0000-000000000000',
  'admin@budgetwise.com',
  'System Administrator',
  'admin'
) ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Method 3: Simple role update by email (recommended)
-- This will work if you already have a user account
DO $$
BEGIN
  -- Update existing user to admin
  UPDATE profiles SET role = 'admin' WHERE email = 'admin@budgetwise.com';
  
  -- If no rows were updated, it means the user doesn't exist
  IF NOT FOUND THEN
    RAISE NOTICE 'User with email admin@budgetwise.com not found. Please sign up first, then run this script again.';
  ELSE
    RAISE NOTICE 'Successfully promoted admin@budgetwise.com to admin role!';
  END IF;
END $$;

-- Log the admin creation
INSERT INTO admin_actions (admin_id, action_type, details)
SELECT 
  id,
  'admin_created',
  jsonb_build_object('email', email, 'created_by', 'system')
FROM profiles 
WHERE email = 'admin@budgetwise.com' AND role = 'admin';
