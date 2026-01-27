-- Diagnóstico corregido del sistema de triggers para registro
-- Este script verifica el trigger sin llamar directamente a la función

-- 1. Verificar que el trigger existe y está activo
SELECT 
    'Trigger Status' as test_name,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verificar que la función existe
SELECT 
    'Function Status' as test_name,
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. Verificar permisos en la tabla profiles
SELECT 
    'Profiles Table Permissions' as test_name,
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles';

-- 4. Verificar estructura de la tabla profiles
SELECT 
    'Profiles Table Structure' as test_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 5. Verificar configuración de auth en Supabase
SELECT 
    'Auth Configuration' as test_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'auth' AND table_name = 'users'
        ) THEN 'Auth schema exists'
        ELSE 'Auth schema missing'
    END as status;

-- 6. Contar usuarios recientes para ver si el trigger está funcionando
SELECT 
    'Recent Activity' as test_name,
    COUNT(*) as profiles_created_today
FROM profiles 
WHERE created_at >= CURRENT_DATE;

-- 7. Verificar si hay usuarios en auth.users sin perfil correspondiente
SELECT 
    'Orphaned Users' as test_name,
    COUNT(*) as users_without_profiles
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;
