-- =====================================================
-- FIXTEC - ENUM TYPES
-- =====================================================

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'technician', 'receptionist', 'client');

-- Create enum for service status
CREATE TYPE service_status AS ENUM ('received', 'diagnosis', 'waiting_parts', 'repair', 'testing', 'completed', 'delivered', 'cancelled');

-- Create enum for service priority
CREATE TYPE service_priority AS ENUM ('low', 'medium', 'high', 'urgent');
