"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUserCommission(userId: string, commissionPercentage: number) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      console.error("[v0] Supabase client not available - check environment variables")
      return { success: false, error: "Database connection not available" }
    }

    console.log("[v0] Updating user commission:", { userId, commissionPercentage })

    // Validate commission percentage
    if (commissionPercentage < 0 || commissionPercentage > 100) {
      return { success: false, error: "El porcentaje de comisión debe estar entre 0 y 100" }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        commission_percentage: commissionPercentage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()

    if (error) {
      console.error("[v0] Error updating user commission:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] User commission updated successfully:", data)
    revalidatePath("/admin/users")

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Unexpected error updating user commission:", error)
    return { success: false, error: "Error inesperado al actualizar la comisión del usuario" }
  }
}
