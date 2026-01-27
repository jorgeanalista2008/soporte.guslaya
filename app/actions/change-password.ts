"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface ChangePasswordData {
  userId: string
  newPassword: string
}

export async function changeUserPassword(data: ChangePasswordData) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      console.error("[v0] Supabase client not available - check environment variables")
      return { success: false, error: "Database connection not available" }
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("[v0] User not authenticated:", userError)
      return { success: false, error: "Usuario no autenticado" }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !profile || profile.role !== "admin") {
      console.error("[v0] User not admin:", profile?.role)
      return { success: false, error: "No tienes permisos de administrador" }
    }

    console.log("[v0] Changing password for user:", data.userId)

    const { data: targetUser, error: targetUserError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.userId)
      .single()

    if (targetUserError || !targetUser) {
      console.error("[v0] Target user not found:", targetUserError)
      return { success: false, error: "Usuario no encontrado en la base de datos" }
    }

    const adminSupabase = await createClient(true)

    if (!adminSupabase) {
      return { success: false, error: "No se pudo crear cliente de administrador" }
    }

    const { data: authUser, error: authUserError } = await adminSupabase.auth.admin.getUserById(data.userId)

    if (authUserError || !authUser.user) {
      console.error("[v0] User not found in auth.users:", authUserError)
      return { success: false, error: "Usuario no encontrado en el sistema de autenticación" }
    }

    // Update the user's password in auth.users
    const { data: updateData, error } = await adminSupabase.auth.admin.updateUserById(data.userId, {
      password: data.newPassword,
    })

    if (error) {
      console.error("[v0] Error changing user password:", error)
      return { success: false, error: `Error al cambiar contraseña: ${error.message}` }
    }

    console.log("[v0] Password changed successfully for user:", data.userId)
    revalidatePath("/admin/users")

    return { success: true, data: updateData }
  } catch (error) {
    console.error("[v0] Unexpected error changing password:", error)
    return { success: false, error: "Error inesperado al cambiar contraseña" }
  }
}
