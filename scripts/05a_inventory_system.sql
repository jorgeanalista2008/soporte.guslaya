-- =====================================================
-- INVENTORY SYSTEM - Parts and Stock Management
-- =====================================================

-- Create inventory_categories table
CREATE TABLE IF NOT EXISTS inventory_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory_parts table
CREATE TABLE IF NOT EXISTS inventory_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES inventory_categories(id),
  brand VARCHAR(100),
  model VARCHAR(100),
  specifications TEXT,
  unit_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  location VARCHAR(100),
  supplier VARCHAR(200),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory_transactions table for stock movements
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES inventory_parts(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('in', 'out', 'adjustment', 'reserved', 'used')),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2),
  reference_type VARCHAR(50), -- 'service_order', 'purchase_order', 'adjustment', etc.
  reference_id UUID, -- ID of the related record
  notes TEXT,
  performed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO inventory_categories (name, description) VALUES
  ('Componentes', 'Componentes principales de computadoras'),
  ('Memoria', 'Módulos de memoria RAM'),
  ('Almacenamiento', 'Discos duros, SSDs y dispositivos de almacenamiento'),
  ('Pantallas', 'Pantallas LCD, LED y monitores'),
  ('Periféricos', 'Teclados, ratones y otros periféricos'),
  ('Baterías', 'Baterías para laptops y dispositivos móviles'),
  ('Cables', 'Cables de datos, alimentación y conectores'),
  ('Herramientas', 'Herramientas de reparación y diagnóstico')
ON CONFLICT (name) DO NOTHING;

-- Insert sample inventory parts
INSERT INTO inventory_parts (part_number, name, description, category_id, brand, unit_price, stock_quantity, min_stock_level, location) VALUES
  ('PSU-500W-001', 'Fuente de Poder 500W', 'Fuente de poder ATX 500W 80+ Bronze', 1, 'Corsair', 45.99, 5, 2, 'Estante A-1'),
  ('RAM-DDR4-8GB-001', 'Memoria RAM DDR4 8GB', 'Módulo DDR4 8GB 2400MHz', 2, 'Kingston', 89.99, 12, 5, 'Estante B-2'),
  ('SSD-256GB-001', 'Disco SSD 256GB', 'SSD SATA 256GB 2.5"', 3, 'Samsung', 129.99, 8, 3, 'Estante C-1'),
  ('LCD-15.6-001', 'Pantalla LCD 15.6"', 'Panel LCD 15.6" 1366x768', 4, 'LG', 199.99, 1, 2, 'Estante D-3'),
  ('KB-HP-001', 'Teclado Laptop HP', 'Teclado en español para HP Pavilion', 5, 'HP', 35.99, 0, 3, 'Estante E-1'),
  ('BAT-DELL-001', 'Batería Laptop Dell', 'Batería Li-ion 6 celdas Dell Inspiron', 6, 'Dell', 79.99, 6, 2, 'Estante F-2')
ON CONFLICT (part_number) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_parts_category ON inventory_parts(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_parts_status ON inventory_parts(status);
CREATE INDEX IF NOT EXISTS idx_inventory_parts_stock ON inventory_parts(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_part ON inventory_transactions(part_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type ON inventory_transactions(transaction_type);

-- Enable RLS
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory_categories
CREATE POLICY "inventory_categories_read_all" ON inventory_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'technician', 'receptionist')
    )
  );

CREATE POLICY "inventory_categories_admin_manage" ON inventory_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for inventory_parts
CREATE POLICY "inventory_parts_read_all" ON inventory_parts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'technician', 'receptionist')
    )
  );

CREATE POLICY "inventory_parts_admin_manage" ON inventory_parts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "inventory_parts_technician_update" ON inventory_parts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'technician')
    )
  );

-- RLS Policies for inventory_transactions
CREATE POLICY "inventory_transactions_read_all" ON inventory_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'technician', 'receptionist')
    )
  );

CREATE POLICY "inventory_transactions_create" ON inventory_transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'technician')
    )
  );

-- Create trigger for updating inventory_parts updated_at
CREATE OR REPLACE FUNCTION update_inventory_parts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_parts_updated_at
  BEFORE UPDATE ON inventory_parts
  FOR EACH ROW EXECUTE FUNCTION update_inventory_parts_updated_at();
