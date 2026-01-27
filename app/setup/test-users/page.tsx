"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

const testUsers = [
  {
    email: "admin@serviciotecnico.com",
    password: "Admin123!",
    role: "admin",
    fullName: "Administrador Sistema",
    phone: "+1234567890",
  },
  {
    email: "tecnico@serviciotecnico.com",
    password: "Tecnico123!",
    role: "technician",
    fullName: "Juan Técnico",
    phone: "+1234567891",
  },
  {
    email: "recepcion@serviciotecnico.com",
    password: "Recepcion123!",
    role: "receptionist",
    fullName: "María Recepcionista",
    phone: "+1234567892",
  },
  {
    email: "cliente@serviciotecnico.com",
    password: "Cliente123!",
    role: "client",
    fullName: "Pedro Cliente",
    phone: "+1234567893",
  },
]

export default function TestUsersSetup() {
  const [isCreating, setIsCreating] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const createTestUsers = async () => {
    setIsCreating(true)
    setResults([])
    const supabase = createClient()

    console.log("[v0] Starting test user creation process")

    for (const user of testUsers) {
      try {
        console.log(`[v0] Creating user: ${user.email}`)

        // Check if user already exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", user.email)
          .single()

        if (existingProfile) {
          setResults((prev) => [...prev, `⚠️ Usuario ${user.role} ya existe: ${user.email}`])
          continue
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
            data: {
              full_name: user.fullName,
              role: user.role,
              phone: user.phone,
            },
          },
        })

        console.log(`[v0] Auth response for ${user.email}:`, { authData, authError })

        if (authError) {
          setResults((prev) => [...prev, `❌ Error creando ${user.role}: ${authError.message}`])
          continue
        }

        if (authData.user) {
          // Wait a bit for the trigger to process
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const { error: profileError } = await supabase.from("profiles").upsert({
            id: authData.user.id,
            email: user.email,
            full_name: user.fullName,
            role: user.role,
            phone: user.phone,
            updated_at: new Date().toISOString(),
          })

          if (profileError) {
            console.log(`[v0] Profile error for ${user.email}:`, profileError)
            setResults((prev) => [
              ...prev,
              `⚠️ Usuario ${user.role} creado pero error en perfil: ${profileError.message}`,
            ])
          } else {
            setResults((prev) => [...prev, `✅ Usuario ${user.role} creado exitosamente`])
          }
        }
      } catch (error) {
        console.log(`[v0] Unexpected error for ${user.email}:`, error)
        setResults((prev) => [...prev, `❌ Error inesperado creando ${user.role}: ${error}`])
      }
    }

    setIsCreating(false)
    console.log("[v0] Test user creation process completed")
  }

  const clearTestUsers = async () => {
    setIsCreating(true)
    setResults([])
    const supabase = createClient()

    console.log("[v0] Starting test user cleanup process")

    for (const user of testUsers) {
      try {
        const { error } = await supabase.from("profiles").delete().eq("email", user.email)

        if (error) {
          setResults((prev) => [...prev, `❌ Error eliminando ${user.role}: ${error.message}`])
        } else {
          setResults((prev) => [...prev, `🗑️ Usuario ${user.role} eliminado`])
        }
      } catch (error) {
        setResults((prev) => [...prev, `❌ Error inesperado eliminando ${user.role}: ${error}`])
      }
    }

    setIsCreating(false)
    console.log("[v0] Test user cleanup process completed")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Configuración de Usuarios de Prueba</CardTitle>
            <CardDescription className="text-gray-600">
              Crea usuarios de prueba para probar el sistema Servicio Técnico Pro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testUsers.map((user) => (
                <div key={user.email} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 capitalize">{user.role}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.password}</p>
                  <p className="text-sm text-gray-500">{user.fullName}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={createTestUsers}
                disabled={isCreating}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isCreating ? "Procesando..." : "Crear Usuarios de Prueba"}
              </Button>

              <Button
                onClick={clearTestUsers}
                disabled={isCreating}
                variant="outline"
                className="flex-1 h-12 border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
              >
                {isCreating ? "Procesando..." : "Limpiar Usuarios"}
              </Button>
            </div>

            {results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Resultados:</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-1 max-h-60 overflow-y-auto">
                  {results.map((result, index) => (
                    <p key={index} className="text-sm font-mono">
                      {result}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante:</h4>
              <p className="text-sm text-yellow-700">
                Si Supabase tiene habilitada la confirmación de email, los usuarios necesitarán confirmar su email antes
                de poder hacer login. Revisa tu bandeja de entrada o deshabilita la confirmación de email en la
                configuración de Supabase.
              </p>
            </div>

            <div className="text-center">
              <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Volver al Login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
