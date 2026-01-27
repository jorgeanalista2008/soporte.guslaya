-- Script de limpieza para preparar el sistema para producción
-- Este script elimina todos los datos de prueba y deja solo los usuarios esenciales

-- IMPORTANTE: Este script debe ejecutarse con cuidado ya que eliminará datos permanentemente

BEGIN;

-- 1. Deshabilitar temporalmente las políticas RLS para permitir la limpieza
ALTER TABLE public.service_order_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_components DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_parts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar datos de las tablas especificadas (en orden de dependencias)

-- Eliminar historial de órdenes de servicio
DELETE FROM public.service_order_history;

-- Eliminar órdenes de servicio
DELETE FROM public.service_orders;

-- Eliminar componentes de equipos
DELETE FROM public.equipment_components;

-- Eliminar equipos
DELETE FROM public.equipments;

-- Eliminar solicitudes de inventario
DELETE FROM public.inventory_requests;

-- Eliminar transacciones de inventario (opcional, mantener para historial)
DELETE FROM public.inventory_transactions;

-- Eliminar partes de inventario
DELETE FROM public.inventory_parts;

-- Eliminar clientes (esto también eliminará sus perfiles asociados)
DELETE FROM public.clients;

-- 3. Eliminar usuarios y perfiles que no sean los esenciales
-- Primero eliminamos perfiles que no sean los usuarios esenciales
DELETE FROM public.profiles 
WHERE email NOT IN (
    'admin@techservice.com',
    'tecnico@techservice.com', 
    'recepcion@techservice.com',
    'cliente@techservice.com'
);

-- Eliminamos usuarios de auth.users de forma segura
-- Solo eliminamos si no son los usuarios esenciales
DELETE FROM auth.users 
WHERE email NOT IN (
    'admin@techservice.com',
    'tecnico@techservice.com',
    'recepcion@techservice.com', 
    'cliente@techservice.com'
);

-- Actualizar usuarios existentes en lugar de insertar
-- Esto evita problemas con ON CONFLICT en auth.users

-- Actualizar contraseñas de usuarios existentes
UPDATE auth.users 
SET 
    encrypted_password = crypt('Admin123!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'admin@techservice.com';

UPDATE auth.users 
SET 
    encrypted_password = crypt('Tecnico123!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'tecnico@techservice.com';

UPDATE auth.users 
SET 
    encrypted_password = crypt('Recepcion123!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'recepcion@techservice.com';

UPDATE auth.users 
SET 
    encrypted_password = crypt('Cliente123!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'cliente@techservice.com';

-- 5. Asegurar que los perfiles correspondientes existan
-- ADMIN PROFILE
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    commission_percentage
) 
SELECT 
    u.id,
    u.email,
    'Administrador del Sistema',
    'admin'::user_role,
    true,
    0.00
FROM auth.users u 
WHERE u.email = 'admin@techservice.com'
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    commission_percentage = EXCLUDED.commission_percentage,
    updated_at = now();

-- TECHNICIAN PROFILE
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    commission_percentage
) 
SELECT 
    u.id,
    u.email,
    'Técnico Principal',
    'technician'::user_role,
    true,
    15.00
FROM auth.users u 
WHERE u.email = 'tecnico@techservice.com'
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    commission_percentage = EXCLUDED.commission_percentage,
    updated_at = now();

-- RECEPTIONIST PROFILE
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    commission_percentage
) 
SELECT 
    u.id,
    u.email,
    'Recepcionista Principal',
    'receptionist'::user_role,
    true,
    0.00
FROM auth.users u 
WHERE u.email = 'recepcion@techservice.com'
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    commission_percentage = EXCLUDED.commission_percentage,
    updated_at = now();

-- CLIENT PROFILE
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    commission_percentage
) 
SELECT 
    u.id,
    u.email,
    'Cliente de Prueba',
    'client'::user_role,
    true,
    0.00
FROM auth.users u 
WHERE u.email = 'cliente@techservice.com'
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    commission_percentage = EXCLUDED.commission_percentage,
    updated_at = now();

-- 6. Deshabilitar las políticas RLS
ALTER TABLE public.service_order_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_components DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_parts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 7. Reiniciar secuencias si es necesario
-- Esto asegura que los nuevos registros empiecen desde 1
SELECT setval('equipment_components_id_seq', 1, false);
SELECT setval('inventory_categories_id_seq', 1, false);

-- 8. Mostrar resumen de la limpieza
SELECT 
    'Limpieza completada exitosamente' as status,
    (SELECT COUNT(*) FROM public.profiles) as usuarios_restantes,
    (SELECT COUNT(*) FROM public.clients) as clientes_restantes,
    (SELECT COUNT(*) FROM public.equipments) as equipos_restantes,
    (SELECT COUNT(*) FROM public.service_orders) as ordenes_restantes,
    (SELECT COUNT(*) FROM public.inventory_parts) as partes_inventario_restantes;

COMMIT;

-- Verificación final: Mostrar los usuarios que quedaron
SELECT 
    p.email,
    p.full_name,
    p.role,
    p.is_active,
    u.email_confirmed_at IS NOT NULL as email_confirmado
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.role, p.email;
