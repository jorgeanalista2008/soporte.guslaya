-- Create equipments table for managing computer equipment
CREATE TABLE IF NOT EXISTS equipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_type VARCHAR(20) NOT NULL CHECK (equipment_type IN ('Laptop', 'PC', 'Server')),
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  equipment_subtype VARCHAR(100), -- ej. "clon híbrido"
  serial_number VARCHAR(100) UNIQUE,
  purchase_date DATE,
  warranty_expiry DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'retired')),
  location VARCHAR(200),
  assigned_to UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create equipment_components table for additional components
CREATE TABLE IF NOT EXISTS equipment_components (
  id SERIAL PRIMARY KEY,
  equipment_id UUID REFERENCES equipments(id) ON DELETE CASCADE,
  component_type VARCHAR(50) NOT NULL, -- 'hard_drive', 'ram', 'graphics_card', 'processor', etc.
  component_name VARCHAR(100) NOT NULL,
  specifications TEXT,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
