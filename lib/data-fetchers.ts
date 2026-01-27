import { createClient } from "@/lib/supabase/client"

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
}

export interface UserProfile {
  id: string
  full_name: string
  email: string
  role: string
}

export interface Equipment {
  id: string
  equipment_type: string
  brand: string
  model: string
  serial_number?: string
  status: string
}

export async function fetchClients(): Promise<Client[]> {
  const supabase = createClient()

  console.log("[v0] Fetching clients...")

  const { data, error } = await supabase
    .from("clients")
    .select(`
      id,
      user_id,
      company_name,
      profiles!inner(
        full_name,
        email,
        phone
      )
    `)
    .order("company_name")

  if (error) {
    console.error("[v0] Error fetching clients:", error)
    return []
  }

  const transformedData =
    data?.map((client) => ({
      id: client.user_id, // Use user_id which references profiles table
      name: client.profiles?.full_name || client.company_name || "Unknown",
      email: client.profiles?.email || "",
      phone: client.profiles?.phone,
      company: client.company_name,
    })) || []

  const uniqueClients = transformedData.filter((client, index, self) => {
    const firstIndex = self.findIndex((c) => c.id === client.id)
    if (firstIndex !== index) {
      console.warn("[v0] Duplicate client found:", client.id, client.name)
    }
    return firstIndex === index
  })

  console.log("[v0] Clients fetched:", uniqueClients.length, "(filtered from", transformedData.length, ")")
  return uniqueClients
}

export async function fetchTechnicians(): Promise<UserProfile[]> {
  const supabase = createClient()

  console.log("[v0] Fetching technicians...")

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("role", "technician")
    .order("full_name")

  if (error) {
    console.error("[v0] Error fetching technicians:", error)
    return []
  }

  const uniqueTechnicians = (data || []).filter((tech, index, self) => {
    const firstIndex = self.findIndex((t) => t.id === tech.id)
    if (firstIndex !== index) {
      console.warn("[v0] Duplicate technician found:", tech.id, tech.full_name)
    }
    return firstIndex === index
  })

  console.log("[v0] Technicians fetched:", uniqueTechnicians.length, "(filtered from", data?.length || 0, ")")
  return uniqueTechnicians
}

export async function fetchReceptionists(): Promise<UserProfile[]> {
  const supabase = createClient()

  console.log("[v0] Fetching receptionists...")

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("role", "receptionist")
    .order("full_name")

  if (error) {
    console.error("[v0] Error fetching receptionists:", error)
    return []
  }

  const uniqueReceptionists = (data || []).filter((recep, index, self) => {
    const firstIndex = self.findIndex((r) => r.id === recep.id)
    if (firstIndex !== index) {
      console.warn("[v0] Duplicate receptionist found:", recep.id, recep.full_name)
    }
    return firstIndex === index
  })

  console.log("[v0] Receptionists fetched:", uniqueReceptionists.length, "(filtered from", data?.length || 0, ")")
  return uniqueReceptionists
}

export async function fetchEquipments(): Promise<Equipment[]> {
  const supabase = createClient()

  console.log("[v0] Fetching equipments...")

  const { data, error } = await supabase
    .from("equipments")
    .select("id, equipment_type, brand, model, serial_number, status")
    .eq("status", "active")
    .order("brand")

  if (error) {
    console.error("[v0] Error fetching equipments:", error)
    return []
  }

  const uniqueEquipments = (data || []).filter((equip, index, self) => {
    const firstIndex = self.findIndex((e) => e.id === equip.id)
    if (firstIndex !== index) {
      console.warn("[v0] Duplicate equipment found:", equip.id, equip.brand, equip.model)
    }
    return firstIndex === index
  })

  console.log("[v0] Equipments fetched:", uniqueEquipments.length, "(filtered from", data?.length || 0, ")")
  return uniqueEquipments
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const supabase = createClient()

  console.log("[v0] Fetching all users...")

  const { data, error } = await supabase.from("profiles").select("id, full_name, email, role").order("full_name")

  if (error) {
    console.error("[v0] Error fetching all users:", error)
    return []
  }

  console.log("[v0] All users fetched:", data?.length || 0)
  return data || []
}
