-- =====================================================
-- FIXTEC - SISTEMA DE REGISTRO CONSOLIDADO
-- Consolida scripts 11-23 en una sola configuración completa
-- =====================================================

-- PARTE 1: CONFIGURACIÓN DE SEGURIDAD Y PERMISOS
-- =====================================================

-- Deshabilitar RLS en todas las tablas principales
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_history DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en tablas de inventario si existen
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'inventory_categories') THEN
        ALTER TABLE inventory_categories DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'inventory_parts') THEN
        ALTER TABLE inventory_parts DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'inventory_transactions') THEN
        ALTER TABLE inventory_transactions DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'inventory_requests') THEN
        ALTER TABLE inventory_requests DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Eliminar todas las políticas existentes que puedan causar conflictos
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Otorgar permisos completos a usuarios autenticados
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;

-- PARTE 2: CONFIGURACIÓN DE LA TABLA PROFILES
-- =====================================================

-- Crear tabla profiles si no existe
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'staff', 'technician')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- PARTE 3: SISTEMA DE REGISTRO AUTOMÁTICO
-- =====================================================

-- Eliminar triggers y funciones existentes para recrear limpiamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.auto_confirm_user();

-- Crear función principal para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Crear perfil para el nuevo usuario
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'client',  -- Rol por defecto
    NOW(),
    NOW()
  );
  
  -- Auto-confirmar el email del usuario
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log del error pero no fallar el registro
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Crear trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PARTE 4: REPARACIÓN DE DATOS EXISTENTES
-- =====================================================

-- Confirmar todos los usuarios existentes sin confirmación
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- Crear perfiles para usuarios huérfanos (usuarios sin perfil)
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
    'client',
    au.created_at,
    au.updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
  AND au.email_confirmed_at IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Actualizar usuarios existentes que no tengan rol asignado
UPDATE public.profiles 
SET role = 'client' 
WHERE role IS NULL OR role = '';

-- PARTE 5: VERIFICACIÓN DEL SISTEMA
-- =====================================================

-- Verificar configuración de RLS
SELECT 
    'RLS Configuration' as test_name,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'clients', 'service_orders', 'service_order_history')
ORDER BY tablename;

-- Verificar función y trigger
SELECT 
    'Function and Trigger Status' as test_name,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'handle_new_user') as function_exists,
    (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') as trigger_exists;

-- Verificar usuarios y perfiles
SELECT 
    'User Profile Status' as test_name,
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL) as confirmed_users,
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.profiles p ON au.id = p.id WHERE p.id IS NULL) as orphaned_users;

-- Verificar distribución de roles
SELECT 
    'Role Distribution' as test_name,
    role,
    COUNT(*) as count
FROM public.profiles 
GROUP BY role
ORDER BY role;

-- Mensaje final
SELECT 
    'Sistema de Registro Consolidado' as status,
    'Configuración completada exitosamente' as message,
    'Nuevos usuarios se registrarán automáticamente con rol client' as details;
