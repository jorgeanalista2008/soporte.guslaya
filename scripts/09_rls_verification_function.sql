-- =====================================================
-- FIXTEC - RLS VERIFICATION FUNCTION
-- =====================================================

-- Create a function to check RLS policies for a table
CREATE OR REPLACE FUNCTION get_policies_for_table(table_name TEXT)
RETURNS TABLE(
    policy_name TEXT,
    table_name_out TEXT,
    policy_cmd TEXT,
    policy_permissive TEXT,
    policy_roles TEXT[],
    policy_qual TEXT,
    policy_with_check TEXT
) 
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pol.policyname::TEXT as policy_name,
        pol.tablename::TEXT as table_name_out,
        pol.cmd::TEXT as policy_cmd,
        pol.permissive::TEXT as policy_permissive,
        pol.roles as policy_roles,
        pol.qual::TEXT as policy_qual,
        pol.with_check::TEXT as policy_with_check
    FROM pg_policies pol
    WHERE pol.tablename = table_name
    AND pol.schemaname = 'public';
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_policies_for_table(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_policies_for_table(TEXT) TO anon;

-- Create a function to check RLS status for tables
CREATE OR REPLACE FUNCTION get_rls_status()
RETURNS TABLE(
    table_name TEXT,
    rls_enabled BOOLEAN,
    policies_count BIGINT
) 
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.tablename::TEXT as table_name,
        t.rowsecurity as rls_enabled,
        COALESCE(p.policy_count, 0) as policies_count
    FROM pg_tables t
    LEFT JOIN (
        SELECT 
            tablename,
            COUNT(*) as policy_count
        FROM pg_policies 
        WHERE schemaname = 'public'
        GROUP BY tablename
    ) p ON t.tablename = p.tablename
    WHERE t.schemaname = 'public'
    AND t.tablename IN ('profiles', 'clients', 'service_orders', 'service_order_history')
    ORDER BY t.tablename;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_rls_status() TO authenticated;
GRANT EXECUTE ON FUNCTION get_rls_status() TO anon;
