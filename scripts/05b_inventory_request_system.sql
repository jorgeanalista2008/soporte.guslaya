-- =====================================================
-- INVENTORY REQUEST SYSTEM - Enhanced Request Management
-- =====================================================

-- Create inventory_requests table for better request tracking
CREATE TABLE IF NOT EXISTS inventory_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES inventory_parts(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES profiles(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'fulfilled', 'cancelled')),
  reason TEXT,
  notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_requests_status ON inventory_requests(status);
CREATE INDEX IF NOT EXISTS idx_inventory_requests_requested_by ON inventory_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_inventory_requests_part ON inventory_requests(part_id);
CREATE INDEX IF NOT EXISTS idx_inventory_requests_priority ON inventory_requests(priority);

-- Enable RLS
ALTER TABLE inventory_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory_requests
CREATE POLICY "inventory_requests_read_own" ON inventory_requests
  FOR SELECT USING (
    requested_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'receptionist')
    )
  );

CREATE POLICY "inventory_requests_create_technician" ON inventory_requests
  FOR INSERT WITH CHECK (
    requested_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'technician'
    )
  );

CREATE POLICY "inventory_requests_admin_manage" ON inventory_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create trigger for updating inventory_requests updated_at
CREATE OR REPLACE FUNCTION update_inventory_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_requests_updated_at
  BEFORE UPDATE ON inventory_requests
  FOR EACH ROW EXECUTE FUNCTION update_inventory_requests_updated_at();

-- Insert sample requests for testing
INSERT INTO inventory_requests (part_id, requested_by, quantity, priority, reason, status) 
SELECT 
  ip.id,
  p.id,
  2,
  'normal',
  'Necesario para reparación urgente',
  'pending'
FROM inventory_parts ip
CROSS JOIN profiles p
WHERE ip.part_number = 'RAM-DDR4-8GB-001' 
  AND p.role = 'technician'
  AND p.email LIKE '%technician%'
LIMIT 1
ON CONFLICT DO NOTHING;
