-- Script corregido para deshabilitar confirmación de email
-- Este script usa el método correcto para manejar la confirmación en Supabase

-- 1. Confirmar todos los usuarios existentes usando email_confirmed_at
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- 2. Crear función para auto-confirmar nuevos usuarios
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirmar el email del usuario recién creado
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear trigger para auto-confirmar usuarios nuevos
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
CREATE TRIGGER auto_confirm_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();

-- 4. Verificar el estado actual
SELECT 
  'Usuarios confirmados' as status,
  COUNT(*) as total
FROM auth.users 
WHERE email_confirmed_at IS NOT NULL

UNION ALL

SELECT 
  'Usuarios sin confirmar' as status,
  COUNT(*) as total
FROM auth.users 
WHERE email_confirmed_at IS NULL;

-- 5. Mostrar información sobre la configuración
SELECT 
  'Configuración completada' as message,
  'Los nuevos usuarios se confirmarán automáticamente' as details;
