"use client"

import { useState, useEffect, useMemo } from "react"
import { createBrowserClient } from "@supabase/ssr"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  phone?: string
  lastLogin?: string
  createdAt: string
  commission_percentage?: number
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  technicians: number
  receptionists: number
}

export function useUsersData() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    technicians: 0,
    receptionists: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log("[v0] Missing Supabase environment variables")
      return null
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      if (!supabase) {
        throw new Error("Supabase client is not configured. Please check environment variables.")
      }

      console.log("[v0] Fetching users from profiles table...")

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          role,
          phone,
          is_active,
          created_at,
          updated_at,
          commission_percentage
        `)
        .order("created_at", { ascending: false })

      console.log("[v0] Profiles query result:", { profiles, profilesError })
      console.log("[v0] Number of profiles found:", profiles?.length || 0)

      if (profilesError) {
        console.log("[v0] Profiles query error:", profilesError)
        throw profilesError
      }

      const transformedUsers: User[] =
        profiles?.map((profile) => ({
          id: profile.id,
          name: profile.full_name || "Sin nombre",
          email: profile.email || "",
          role: profile.role || "client",
          status: profile.is_active ? "active" : "inactive",
          phone: profile.phone || undefined,
          lastLogin: profile.updated_at || undefined,
          createdAt: profile.created_at,
          commission_percentage: profile.commission_percentage || 0,
        })) || []

      console.log("[v0] Transformed users:", transformedUsers)

      setUsers(transformedUsers)

      const totalUsers = transformedUsers.length
      const activeUsers = transformedUsers.filter((user) => user.status === "active").length
      const technicians = transformedUsers.filter((user) => user.role === "technician").length
      const receptionists = transformedUsers.filter((user) => user.role === "receptionist").length

      setStats({
        totalUsers,
        activeUsers,
        technicians,
        receptionists,
      })

      setError(null)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (supabase) {
      fetchUsers()
    } else {
      setLoading(false)
      setError("Supabase client is not configured. Please check environment variables.")
    }
  }, [supabase])

  const refreshUsers = () => {
    if (supabase) {
      fetchUsers()
    }
  }

  return {
    users,
    stats,
    loading,
    error,
    refreshUsers,
  }
}
