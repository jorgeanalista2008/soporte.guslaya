"use client"

import type React from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!supabase) {
      setError("Error de configuración: Supabase no está configurado correctamente.")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Attempting login with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      console.log("[v0] Login successful, getting user profile...")

      const user = data.user
      console.log("[v0] User data:", user)

      if (user) {
        let { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        console.log("[v0] Profile data:", profile)
        console.log("[v0] Profile error:", profileError)

        // If profile doesn't exist, try to create it
        if (!profile && profileError) {
          console.log("[v0] Profile not found, attempting to create...")

          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email || email,
              full_name: user.user_metadata?.full_name || user.email || email,
              role: "admin", // Default to admin for manual creation
            })
            .select("role")
            .single()

          if (createError) {
            console.log("[v0] Failed to create profile:", createError)
            throw new Error("No se pudo crear el perfil del usuario. Contacte al administrador.")
          }

          profile = newProfile
          console.log("[v0] Profile created successfully:", profile)
        }

        if (profile) {
          switch (profile.role) {
            case "admin":
              console.log("[v0] Redirecting to admin dashboard")
              router.push("/admin/dashboard")
              break
            case "technician":
              console.log("[v0] Redirecting to technician dashboard")
              router.push("/technician/dashboard")
              break
            case "receptionist":
              console.log("[v0] Redirecting to receptionist dashboard")
              router.push("/receptionist/dashboard")
              break
            case "client":
              console.log("[v0] Redirecting to client dashboard")
              router.push("/client")
              break
            default:
              console.log("[v0] Unknown role, redirecting to client dashboard")
              router.push("/client")
          }
        } else {
          throw new Error("No se encontró el perfil del usuario. Contacte al administrador.")
        }
      }
    } catch (error: unknown) {
      console.log("[v0] Login error:", error)
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 mb-4 relative">
              <Image
                src="/gusLayaLogo.jpg"
                alt="GusLaya Logo"
                fill
                className="object-contain rounded-lg filter brightness-110 contrast-90 grayscale-[0.2]"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">GusLaya Servicio Técnico</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sistema de Gestión de Servicio Técnico
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Iniciando sesión...</p>
                </div>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
              ¿Eres cliente nuevo?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Regístrate aquí
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
              <Button
                variant="outline"
                asChild
                className="w-full h-11 border-blue-200 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 bg-transparent"
                disabled={isLoading}
              >
                <Link href="/manuals">📚 Ver Manuales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
