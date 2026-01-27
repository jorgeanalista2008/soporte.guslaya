-- =====================================================
-- FIXTEC - ADD TECHNICIAN COMMISSION PERCENTAGE
-- =====================================================

-- Add commission_percentage field to profiles table
-- This field will contain the percentage of the final_cost that will be assigned to the technician
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS commission_percentage DECIMAL(5,2) DEFAULT 0.00 
CHECK (commission_percentage >= 0 AND commission_percentage <= 100);

-- Add comment to explain the field
COMMENT ON COLUMN public.profiles.commission_percentage IS 'Percentage of order final_cost assigned to technician (0-100)';
