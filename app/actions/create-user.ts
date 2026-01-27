"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface CreateUserData {
  fullName: string
  email: string
  role: string
  phone: string
  password: string
}

export interface CreateUserResult {
  success: boolean
  error?: string
  userId?: string
}

export async function createUser(userData: CreateUserData): Promise<CreateUserResult> {
  try {
    console.log("[v0] Server action: Creating user with data:", userData)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("[v0] Server action: Missing Supabase environment variables")
      return {
        success: false,
        error: "Supabase is not configured. Please check environment variables.",
      }
    }

    // Create server client with service role for admin operations
    const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookies().set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookies().set({ name, value: "", ...options })
        },
      },
    })

    // Create user in Supabase Auth using admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.fullName,
        role: userData.role,
        phone: userData.phone,
      },
    })

    if (authError) {
      console.log("[v0] Server action: Auth error:", authError.message)
      return {
        success: false,
        error: authError.message,
      }
    }

    if (!authData.user) {
      console.log("[v0] Server action: No user returned from auth")
      return {
        success: false,
        error: "No se pudo crear el usuario",
      }
    }

    console.log("[v0] Server action: User created in auth:", authData.user.id)

    // Give the trigger a moment to execute
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verify that the profile was created by the trigger
    const { data: profile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    if (profileCheckError || !profile) {
      console.log("[v0] Server action: Profile not created by trigger, creating manually")

      // If trigger didn't work, create profile manually
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: userData.email,
        full_name: userData.fullName,
        role: userData.role,
        phone: userData.phone,
        is_active: true,
      })

      if (profileError) {
        console.log("[v0] Server action: Manual profile creation error:", profileError.message)
        // If profile creation fails, delete the auth user to maintain consistency
        await supabase.auth.admin.deleteUser(authData.user.id)
        return {
          success: false,
          error: `Error creando perfil: ${profileError.message}`,
        }
      }
    } else {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: userData.fullName,
          role: userData.role,
          phone: userData.phone,
        })
        .eq("id", authData.user.id)

      if (updateError) {
        console.log("[v0] Server action: Profile update error:", updateError.message)
      }
    }

    console.log("[v0] Server action: Profile created/updated successfully")

    return {
      success: true,
      userId: authData.user.id,
    }
  } catch (error) {
    console.log("[v0] Server action: Unexpected error:", error)
    return {
      success: false,
      error: "Error inesperado al crear usuario",
    }
  }
}
