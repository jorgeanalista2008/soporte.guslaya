// Re-export equipment types
import type { Equipment } from "./equipment" // Import Equipment type
export * from "./equipment"

// User and Profile types
export interface Profile {
  id: string
  full_name: string
  email: string
  role: "admin" | "technician" | "receptionist"
  phone?: string
  commission_percentage?: number
  created_at: string
  updated_at: string
}

export interface UserProfile extends Profile {}

// Client types
export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  created_at: string
  updated_at: string
}

// Inventory types
export interface InventoryPart {
  id: string
  part_number: string
  name: string
  description?: string
  category_id: number
  brand?: string
  unit_price?: number
  stock_quantity: number
  min_stock_level: number
  location?: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
  category?: { name: string }
}

export interface InventoryCategory {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface InventoryTransaction {
  id: string
  part_id: string
  transaction_type: "purchase" | "used" | "adjustment" | "reserved"
  quantity: number
  reference_type?: string
  reference_id?: string
  notes?: string
  performed_by: string
  created_at: string
  part?: InventoryPart
}

export interface InventoryRequest {
  id: string
  part_id: string
  requested_by: string
  quantity: number
  priority: "low" | "normal" | "high" | "urgent"
  reason: string
  status: "pending" | "approved" | "rejected" | "fulfilled"
  approved_by?: string
  approved_at?: string
  notes?: string
  created_at: string
  updated_at: string
  part?: InventoryPart
  requester?: Profile
}

// Order types
export interface Order {
  id: string
  client_id: string
  equipment_id?: number
  technician_id?: string
  receptionist_id?: string
  service_type: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "normal" | "high" | "urgent"
  estimated_cost?: number
  final_cost?: number
  commission_total?: number
  diagnosis?: string
  solution?: string
  parts_used?: string
  labor_hours?: number
  scheduled_date?: string
  completed_date?: string
  created_at: string
  updated_at: string
}

export interface OrderWithDetails extends Order {
  client?: Client
  equipment?: Equipment
  technician?: Profile
  receptionist?: Profile
}

// Service History types
export interface ServiceHistory {
  id: string
  equipment_id: number
  service_date: string
  service_type: string
  description: string
  technician_id?: string
  cost?: number
  parts_used?: string
  labor_hours?: number
  notes?: string
  created_at: string
  equipment?: Equipment
  technician?: Profile
}
