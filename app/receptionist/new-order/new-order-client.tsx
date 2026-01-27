"use client"

import { useState, useEffect } from "react"
import { ClientRoleGuard } from "@/components/auth/client-role-guard"
import { ReceptionistLayout } from "@/components/receptionist/receptionist-layout"
import { NewOrderForm } from "@/components/orders/new-order-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function NewOrderClient() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      loadUserProfile()
    }
  }, [isMounted])

  const loadUserProfile = async () => {
    try {
      const supabase = createClient()
      if (!supabase) {
        console.error("Supabase client not available")
        setIsLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error || !profile) {
        console.error("Error loading user profile:", error)
        setIsLoading(false)
        return
      }

      setUserProfile(profile)
      setUserInfo({
        name: profile.full_name || profile.email || "Usuario",
        email: profile.email || user.email || "",
        role: profile.role || "receptionist",
      })
    } catch (error) {
      console.error("Error loading user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrderCreated = () => {
    toast.success("Orden creada exitosamente")
  }

  if (!isMounted) {
    return null
  }

  return (
    <ClientRoleGuard allowedRoles={["receptionist", "admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Orden de Servicio</h1>
          <p className="text-gray-600">Registra un nuevo equipo para servicio técnico</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Cargando formulario...</p>
            </div>
          </div>
        ) : userProfile && userInfo ? (
          <ReceptionistLayout userInfo={userInfo}>
            <div className="w-full space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nueva Orden de Servicio</CardTitle>
                </CardHeader>
                <CardContent>
                  <NewOrderForm currentUserId={userProfile.id} onSuccess={handleOrderCreated} />
                </CardContent>
              </Card>
            </div>
          </ReceptionistLayout>
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-gray-600">Cargando datos del usuario...</p>
            </div>
          </div>
        )}
      </div>
    </ClientRoleGuard>
  )
}
