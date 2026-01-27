-- =====================================================
-- FIXTEC - ADD COMMISSION TOTAL FIELD TO SERVICE ORDERS
-- =====================================================

-- Add commission_total field to service_orders table
-- This field will store the calculated commission amount (final_cost * commission_percentage / 100)
ALTER TABLE public.service_orders 
ADD COLUMN IF NOT EXISTS commission_total DECIMAL(10,2) DEFAULT 0.00;

-- Add comment to explain the field
COMMENT ON COLUMN public.service_orders.commission_total IS 'Total commission amount calculated from final_cost * technician commission_percentage';

-- Create function to calculate and update commission_total
CREATE OR REPLACE FUNCTION calculate_commission_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Only calculate commission if order is completed and has final_cost and technician
  IF NEW.status = 'completed' AND NEW.final_cost IS NOT NULL AND NEW.technician_id IS NOT NULL THEN
    -- Get technician commission percentage
    SELECT COALESCE(commission_percentage, 0) INTO NEW.commission_total
    FROM profiles 
    WHERE id = NEW.technician_id;
    
    -- Calculate commission total
    NEW.commission_total := (NEW.final_cost * NEW.commission_total / 100);
  ELSE
    -- Reset commission if order is not completed
    NEW.commission_total := 0.00;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate commission_total
DROP TRIGGER IF EXISTS trigger_calculate_commission_total ON public.service_orders;
CREATE TRIGGER trigger_calculate_commission_total
  BEFORE INSERT OR UPDATE ON public.service_orders
  FOR EACH ROW
  EXECUTE FUNCTION calculate_commission_total();

-- Update existing completed orders with commission_total
UPDATE public.service_orders 
SET commission_total = (
  CASE 
    WHEN status = 'completed' AND final_cost IS NOT NULL AND technician_id IS NOT NULL THEN
      (final_cost * COALESCE((SELECT commission_percentage FROM profiles WHERE id = technician_id), 0) / 100)
    ELSE 0.00
  END
);
