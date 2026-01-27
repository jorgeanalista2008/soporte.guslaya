export interface Equipment {
  id: number
  equipment_type: "Laptop" | "PC" | "Server"
  brand: string
  model: string
  equipment_subtype?: string
  serial_number?: string
  purchase_date?: string
  warranty_expiry?: string
  status: "active" | "inactive" | "maintenance" | "retired"
  location?: string
  assigned_to?: string
  notes?: string
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string
    email: string
  }
  equipment_components?: EquipmentComponent[]
}

export interface EquipmentComponent {
  id: number
  equipment_id: number
  component_type: string
  component_name: string
  specifications?: string
  quantity: number
  created_at: string
}

export interface CreateEquipmentData {
  equipment_type: "Laptop" | "PC" | "Server"
  brand: string
  model: string
  equipment_subtype?: string
  serial_number?: string
  purchase_date?: string
  warranty_expiry?: string
  status?: "active" | "inactive" | "maintenance" | "retired"
  location?: string
  assigned_to?: string
  notes?: string
  components?: Omit<EquipmentComponent, "id" | "equipment_id" | "created_at">[]
}
