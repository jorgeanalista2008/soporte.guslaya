-- Fix RLS policy for inventory_categories to allow INSERT operations
-- The issue is that the policy needs a WITH CHECK clause for INSERT operations

-- Drop the existing policy
DROP POLICY IF EXISTS "inventory_categories_admin_manage" ON inventory_categories;

-- Recreate the policy with both USING and WITH CHECK clauses
CREATE POLICY "inventory_categories_admin_manage" ON inventory_categories
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'inventory_categories';
