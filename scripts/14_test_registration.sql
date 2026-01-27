-- Script para probar que el sistema de registro funciona
-- Ejecuta este script para verificar que todo está configurado correctamente

-- 1. Verificar que la función existe y es válida
SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user';

-- 2. Verificar que el trigger está activo
SELECT 
    tgname as trigger_name,
    tgenabled as is_enabled,
    tgrelid::regclass as table_name
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 3. Contar registros actuales en profiles
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- 4. Verificar últimos usuarios creados
SELECT 
    u.id,
    u.email,
    u.created_at as user_created,
    p.id as profile_id,
    p.created_at as profile_created
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 5;
