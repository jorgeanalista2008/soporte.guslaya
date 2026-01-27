-- Test completo del proceso de registro
-- Este script simula todo el proceso de registro paso a paso

-- 1. Verificar configuración de autenticación
SELECT 
    'Auth Configuration Check' as test_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN 'Auth system is working'
        ELSE 'Auth system may have issues'
    END as result;

-- 2. Verificar que podemos crear usuarios de prueba
DO $$
DECLARE
    test_user_id uuid;
    test_email text := 'test_' || extract(epoch from now()) || '@example.com';
BEGIN
    -- Intentar crear un usuario de prueba directamente en auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change_token_new,
        recovery_token
    ) VALUES (
        gen_random_uuid(),
        test_email,
        crypt('testpassword123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '',
        '',
        ''
    ) RETURNING id INTO test_user_id;
    
    RAISE NOTICE 'Test user created successfully with ID: %', test_user_id;
    
    -- Verificar si el trigger creó el perfil automáticamente
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = test_user_id) THEN
        RAISE NOTICE 'Profile created automatically by trigger for user: %', test_user_id;
    ELSE
        RAISE NOTICE 'WARNING: Profile was NOT created by trigger for user: %', test_user_id;
    END IF;
    
    -- Limpiar el usuario de prueba
    DELETE FROM auth.users WHERE id = test_user_id;
    DELETE FROM public.profiles WHERE id = test_user_id;
    
    RAISE NOTICE 'Test user cleaned up successfully';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating test user: %', SQLERRM;
END $$;

-- 3. Verificar configuración de email en Supabase
SELECT 
    'Email Configuration' as test_name,
    CASE 
        WHEN current_setting('app.settings.auth.enable_signup', true) = 'true' THEN 'Signup enabled'
        ELSE 'Signup may be disabled'
    END as signup_status;

-- 4. Verificar permisos en auth.users
SELECT 
    'Auth Users Permissions' as test_name,
    has_table_privilege('auth.users', 'INSERT') as can_insert,
    has_table_privilege('auth.users', 'SELECT') as can_select;

-- 5. Verificar si hay restricciones de dominio de email
SELECT 
    'Email Domain Check' as test_name,
    'Check if there are email domain restrictions in Supabase dashboard' as note;

-- 6. Mostrar últimos usuarios creados para ver patrones
SELECT 
    'Recent Users Analysis' as test_name,
    COUNT(*) as total_users,
    MAX(created_at) as last_user_created,
    MIN(created_at) as first_user_created
FROM auth.users;

-- 7. Verificar si hay usuarios sin confirmar
SELECT 
    'Unconfirmed Users' as test_name,
    COUNT(*) as unconfirmed_users
FROM auth.users 
WHERE email_confirmed_at IS NULL;
