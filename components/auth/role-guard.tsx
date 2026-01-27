import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

interface RoleGuardProps {
  allowedRoles: string[]
  children: React.ReactNode
  redirectTo?: string
}

export async function RoleGuard({ allowedRoles, children, redirectTo = "/auth/login" }: RoleGuardProps) {
  const supabase = await createClient()

  if (!supabase) {
    console.error("[v0] Supabase client not available")
    redirect(redirectTo)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(redirectTo)
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/unauthorized")
  }

  return <>{children}</>
}
