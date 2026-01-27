-- Diagnóstico profundo del sistema de registro
-- Este script verifica todos los componentes necesarios para el registro

-- 1. Verificar configuración de autenticación
SELECT 
    'auth_config' as test_name,
    (SELECT setting FROM pg_settings WHERE name = 'log_statement') as log_level,
    (SELECT count(*) FROM auth.users) as total_auth_users,
    (SELECT count(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL) as confirmed_users,
    (SELECT count(*) FROM auth.users WHERE email_confirmed_at IS NULL) as unconfirmed_users;

-- 2. Verificar tabla profiles y permisos
SELECT 
    'profiles_table' as test_name,
    (SELECT count(*) FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') as table_exists,
    (SELECT count(*) FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public') as column_count,
    (SELECT count(*) FROM public.profiles) as total_profiles;

-- 3. Verificar función handle_new_user
SELECT 
    'handle_new_user_function' as test_name,
    (SELECT count(*) FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public') as function_exists,
    (SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user' LIMIT 1) as function_body;

-- 4. Verificar trigger on_auth_user_created
SELECT 
    'trigger_verification' as test_name,
    (SELECT count(*) FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') as trigger_exists,
    (SELECT event_manipulation FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created' LIMIT 1) as trigger_event,
    (SELECT action_statement FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created' LIMIT 1) as trigger_action;

-- 5. Verificar permisos en tabla auth.users
SELECT 
    'auth_permissions' as test_name,
    has_table_privilege('anon', 'auth.users', 'SELECT') as anon_can_select,
    has_table_privilege('authenticated', 'auth.users', 'SELECT') as auth_can_select,
    has_table_privilege('service_role', 'auth.users', 'INSERT') as service_can_insert;

-- 6. Verificar permisos en tabla profiles
SELECT 
    'profiles_permissions' as test_name,
    has_table_privilege('anon', 'public.profiles', 'SELECT') as anon_can_select,
    has_table_privilege('authenticated', 'public.profiles', 'SELECT') as auth_can_select,
    has_table_privilege('authenticated', 'public.profiles', 'INSERT') as auth_can_insert,
    has_table_privilege('service_role', 'public.profiles', 'INSERT') as service_can_insert;

-- 7. Probar la función handle_new_user manualmente
DO $$
DECLARE
    test_user_id uuid := gen_random_uuid();
    test_email text := 'test_' || extract(epoch from now()) || '@test.com';
    result_count integer;
BEGIN
    -- Simular la creación de un usuario
    INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, aud, role)
    VALUES (test_user_id, test_email, now(), now(), now(), 'authenticated', 'authenticated');
    
    -- Ejecutar la función manualmente
    PERFORM public.handle_new_user();
    
    -- Verificar si se creó el perfil
    SELECT count(*) INTO result_count FROM public.profiles WHERE id = test_user_id;
    
    -- Limpiar datos de prueba
    DELETE FROM public.profiles WHERE id = test_user_id;
    DELETE FROM auth.users WHERE id = test_user_id;
    
    -- Mostrar resultado
    RAISE NOTICE 'Test function result: profiles created = %', result_count;
END $$;

-- 8. Verificar logs de errores recientes
SELECT 
    'recent_errors' as test_name,
    'Check Supabase logs for detailed error messages' as message;
