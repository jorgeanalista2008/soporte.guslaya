"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface ClientRoleGuardProps {
  allowedRoles: string[]
  children: React.ReactNode
  redirectTo?: string
}

export function ClientRoleGuard({ allowedRoles, children, redirectTo = "/auth/login" }: ClientRoleGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()

      if (!supabase) {
        console.error("Supabase client is not configured")
        router.push(redirectTo)
        return
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push(redirectTo)
          return
        }

        const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          router.push(redirectTo)
          return
        }

        if (!profile || !allowedRoles.includes(profile.role)) {
          router.push("/unauthorized")
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Error checking authorization:", error)
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [allowedRoles, redirectTo, router])

  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null
}
