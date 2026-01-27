"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { CreateEquipmentData, UpdateEquipmentData } from "@/types/equipment"

export async function createEquipment(data: CreateEquipmentData) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  )

  try {
    // Create the equipment
    const { data: equipment, error: equipmentError } = await supabase
      .from("equipments")
      .insert({
        equipment_type: data.equipment_type,
        brand: data.brand,
        model: data.model,
        equipment_subtype: data.equipment_subtype,
        serial_number: data.serial_number,
        purchase_date: data.purchase_date,
        warranty_expiry: data.warranty_expiry,
        status: data.status || "active",
        location: data.location,
        assigned_to: data.assigned_to,
        notes: data.notes,
      })
      .select()
      .single()

    if (equipmentError) {
      throw equipmentError
    }

    // Create components if provided
    if (data.components && data.components.length > 0) {
      const componentsToInsert = data.components.map((component) => ({
        equipment_id: equipment.id,
        component_type: component.component_type,
        component_name: component.component_name,
        specifications: component.specifications,
        quantity: component.quantity,
      }))

      const { error: componentsError } = await supabase.from("equipment_components").insert(componentsToInsert)

      if (componentsError) {
        throw componentsError
      }
    }

    return equipment
  } catch (error) {
    console.error("Error creating equipment:", error)
    throw error
  }
}

export async function updateEquipment(equipmentId: number, data: UpdateEquipmentData) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  )

  try {
    // Update the equipment
    const { data: equipment, error: equipmentError } = await supabase
      .from("equipments")
      .update({
        equipment_type: data.equipment_type,
        brand: data.brand,
        model: data.model,
        equipment_subtype: data.equipment_subtype,
        serial_number: data.serial_number,
        purchase_date: data.purchase_date,
        warranty_expiry: data.warranty_expiry,
        status: data.status,
        location: data.location,
        assigned_to: data.assigned_to,
        notes: data.notes,
      })
      .eq("id", equipmentId)
      .select()
      .single()

    if (equipmentError) {
      throw equipmentError
    }

    // Handle components update
    if (data.components !== undefined) {
      // Delete existing components
      const { error: deleteError } = await supabase
        .from("equipment_components")
        .delete()
        .eq("equipment_id", equipmentId)

      if (deleteError) {
        throw deleteError
      }

      // Insert new components if provided
      if (data.components.length > 0) {
        const componentsToInsert = data.components.map((component) => ({
          equipment_id: equipmentId,
          component_type: component.component_type,
          component_name: component.component_name,
          specifications: component.specifications,
          quantity: component.quantity,
        }))

        const { error: componentsError } = await supabase.from("equipment_components").insert(componentsToInsert)

        if (componentsError) {
          throw componentsError
        }
      }
    }

    return equipment
  } catch (error) {
    console.error("Error updating equipment:", error)
    throw error
  }
}

export async function deleteEquipment(equipmentId: number) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  )

  try {
    // Delete components first (due to foreign key constraint)
    const { error: componentsError } = await supabase
      .from("equipment_components")
      .delete()
      .eq("equipment_id", equipmentId)

    if (componentsError) {
      throw componentsError
    }

    // Delete the equipment
    const { error: equipmentError } = await supabase.from("equipments").delete().eq("id", equipmentId)

    if (equipmentError) {
      throw equipmentError
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting equipment:", error)
    throw error
  }
}
