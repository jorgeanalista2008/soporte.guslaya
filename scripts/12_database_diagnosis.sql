-- Script de diagnóstico para identificar problemas en la base de datos
-- Ejecuta este script en el SQL Editor de Supabase para diagnosticar el problema

-- 1. Verificar si la tabla profiles existe
SELECT 
    table_name, 
    table_schema 
FROM information_schema.tables 
WHERE table_name = 'profiles';

-- 2. Verificar si la función handle_new_user existe
SELECT 
    routine_name, 
    routine_type, 
    routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. Verificar si el trigger existe
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 4. Verificar la estructura de la tabla profiles (si existe)
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 5. Verificar permisos en la tabla profiles
SELECT 
    grantee, 
    privilege_type, 
    is_grantable 
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles';
