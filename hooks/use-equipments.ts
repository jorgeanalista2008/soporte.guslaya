"use client"

import { useState, useEffect } from "react"
import type { Equipment } from "@/types/equipment"
import { createBrowserClient } from "@supabase/ssr"

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchEquipments = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("equipments")
        .select(`
          *,
          profiles:assigned_to (
            full_name,
            email
          ),
          equipment_components (
            id,
            component_type,
            component_name,
            specifications,
            quantity,
            created_at
          )
        `)
        .order("created_at", { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setEquipments(data || [])
    } catch (err) {
      console.error("Error fetching equipments:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipments()
  }, [])

  return {
    equipments,
    loading,
    error,
    refetch: fetchEquipments,
  }
}
