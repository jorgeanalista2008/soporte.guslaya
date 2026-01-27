-- Diagnóstico específico para el proceso de registro
-- Este script verifica todos los componentes necesarios para el registro

-- 1. Verificar que la función handle_new_user existe y está correcta
SELECT 
    p.proname as function_name,
    p.prosrc as function_body,
    p.prorettype::regtype as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user' AND n.nspname = 'public';

-- 2. Verificar que el trigger existe y está activo
SELECT 
    t.tgname as trigger_name,
    t.tgenabled as is_enabled,
    c.relname as table_name,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgname = 'on_auth_user_created';

-- 3. Verificar la estructura de auth.users (tabla de Supabase)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'auth' AND table_name = 'users'
ORDER BY ordinal_position;

-- 4. Verificar que no hay conflictos en la tabla profiles
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN email IS NULL THEN 1 END) as profiles_without_email,
    COUNT(CASE WHEN id IS NULL THEN 1 END) as profiles_without_id
FROM public.profiles;

-- 5. Probar la función handle_new_user manualmente
-- (Esto simula lo que debería pasar cuando se registra un usuario)
DO $$
DECLARE
    test_user_id uuid := gen_random_uuid();
    test_email text := 'test_' || extract(epoch from now()) || '@example.com';
BEGIN
    -- Simular la inserción en auth.users (esto normalmente lo hace Supabase)
    RAISE NOTICE 'Testing handle_new_user function with user_id: % and email: %', test_user_id, test_email;
    
    -- Intentar ejecutar la función directamente
    BEGIN
        PERFORM handle_new_user();
        RAISE NOTICE 'Function handle_new_user executed successfully';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error executing handle_new_user: %', SQLERRM;
    END;
END $$;
