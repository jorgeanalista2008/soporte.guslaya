-- Corregir la función handle_new_user para asignar siempre rol 'client'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'client'  -- Siempre asignar rol 'client' por defecto
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log del error pero no fallar el registro
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar que el trigger esté activo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Actualizar cualquier usuario existente que no tenga rol asignado
UPDATE public.profiles 
SET role = 'client' 
WHERE role IS NULL OR role = '';

-- Verificar la configuración
SELECT 
  'Configuración completada' as message,
  'Todos los nuevos usuarios tendrán rol client por defecto' as details;
