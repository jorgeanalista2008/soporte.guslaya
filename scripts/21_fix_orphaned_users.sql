-- Reparar usuarios huérfanos y recrear el trigger
-- Este script crea perfiles para usuarios que no los tienen y asegura que el trigger funcione

-- 1. Crear perfiles para usuarios huérfanos
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'Usuario'),
    au.created_at,
    au.updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
AND au.email_confirmed_at IS NOT NULL;

-- 2. Verificar que el trigger existe y está activo
DO $$
BEGIN
    -- Eliminar trigger existente si existe
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    
    -- Recrear el trigger
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        
    RAISE NOTICE 'Trigger recreado exitosamente';
END $$;

-- 3. Verificar que la función handle_new_user existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'handle_new_user' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
        -- Recrear la función si no existe
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger AS $$
        BEGIN
            INSERT INTO public.profiles (id, email, full_name)
            VALUES (
                new.id,
                new.email,
                COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario')
            );
            RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        RAISE NOTICE 'Función handle_new_user recreada';
    ELSE
        RAISE NOTICE 'Función handle_new_user ya existe';
    END IF;
END $$;

-- 4. Verificar el resultado
SELECT 
    'Reparación completada' as message,
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.profiles p ON au.id = p.id WHERE p.id IS NULL) as remaining_orphans;
