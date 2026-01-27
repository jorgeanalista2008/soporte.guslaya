"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface UpdateUserData {
  id: string
  full_name: string
  email: string
  phone?: string
  role: string
  is_active?: boolean // Added is_active field to support status updates
}

export async function updateUser(userData: UpdateUserData) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      console.error("[v0] Supabase client not available - check environment variables")
      return { success: false, error: "Database connection not available" }
    }

    console.log("[v0] Updating user:", userData)

    const updateFields: any = {
      full_name: userData.full_name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      updated_at: new Date().toISOString(),
    }

    // Only include is_active if it's provided
    if (userData.is_active !== undefined) {
      updateFields.is_active = userData.is_active
    }

    const { data, error } = await supabase.from("profiles").update(updateFields).eq("id", userData.id).select()

    if (error) {
      console.error("[v0] Error updating user:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] User updated successfully:", data)
    revalidatePath("/admin/users")

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Unexpected error updating user:", error)
    return { success: false, error: "Error inesperado al actualizar usuario" }
  }
}

export async function toggleUserStatus(userId: string, currentStatus: string) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      console.error("[v0] Supabase client not available - check environment variables")
      return { success: false, error: "Database connection not available" }
    }

    const newStatus = currentStatus === "active" ? false : true

    console.log("[v0] Toggling user status:", { userId, currentStatus, newStatus })

    // Update the user's is_active status
    const { data, error } = await supabase
      .from("profiles")
      .update({
        is_active: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()

    if (error) {
      console.error("[v0] Error toggling user status:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] User status toggled successfully:", data)
    revalidatePath("/admin/users")

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Unexpected error toggling user status:", error)
    return { success: false, error: "Error inesperado al cambiar estado del usuario" }
  }
}
