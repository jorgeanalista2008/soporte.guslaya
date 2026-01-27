-- =====================================================
-- FIXTEC - SERVICE ORDERS TABLE
-- =====================================================

-- Create service orders table
CREATE TABLE IF NOT EXISTS public.service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  technician_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  receptionist_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Device information
  -- Changed equipment_id from INTEGER to UUID to match equipments table id type
  equipment_id UUID REFERENCES public.equipments(id) ON DELETE RESTRICT,
  device_condition TEXT,
  accessories TEXT,
  
  -- Service details
  problem_description TEXT NOT NULL,
  diagnosis TEXT,
  solution TEXT,
  status service_status DEFAULT 'received',
  priority service_priority DEFAULT 'medium',
  
  -- Dates
  received_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estimated_completion TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  delivered_date TIMESTAMP WITH TIME ZONE,
  
  -- Financial
  estimated_cost DECIMAL(10,2),
  final_cost DECIMAL(10,2),
  advance_payment DECIMAL(10,2) DEFAULT 0,
  
  -- Additional info
  internal_notes TEXT,
  client_notes TEXT,
  warranty_days INTEGER DEFAULT 30,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on service_orders
-- ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
