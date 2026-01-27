-- =====================================================
-- FIXTEC - SERVICE ORDER HISTORY TABLE
-- =====================================================

-- Create service order status history
CREATE TABLE IF NOT EXISTS public.service_order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
  status service_status NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on service_order_history
-- ALTER TABLE public.service_order_history ENABLE ROW LEVEL SECURITY;
