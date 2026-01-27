"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        if (error.message.includes("Database error saving new user")) {
          setError(
            "Error de configuración de la base de datos. Los usuarios huérfanos han sido reparados. Intenta registrarte de nuevo.",
          )
        } else if (error.message.includes("User already registered")) {
          setError("Este correo electrónico ya está registrado. Intenta iniciar sesión.")
        } else if (error.message.includes("Password should be at least")) {
          setError("La contraseña debe tener al menos 6 caracteres.")
        } else if (error.message.includes("Invalid email")) {
          setError("El formato del correo electrónico no es válido.")
        } else {
          setError(`Error de registro: ${error.message}`)
        }
        setIsLoading(false)
        return
      }

      if (data?.user) {
        let { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError && profileError.code === "PGRST116") {
          // El perfil no existe, crearlo manualmente
          const { data: newProfile, error: createProfileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              role: "client", // Asignar explícitamente rol 'client'
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select("role")
            .single()

          if (createProfileError) {
            setError("Usuario creado pero hubo un problema al crear el perfil. Contacta al administrador.")
            setIsLoading(false)
            return
          }

          profile = newProfile
        }

        if (profile) {
          switch (profile.role) {
            case "admin":
              router.push("/admin/dashboard")
              break
            case "technician":
              router.push("/technician/dashboard")
              break
            case "receptionist":
              router.push("/receptionist/dashboard")
              break
            case "client":
              router.push("/client")
              break
            default:
              router.push("/client") // Por defecto, redirigir a cliente
          }
        } else {
          setError("Error inesperado: No se pudo determinar el rol del usuario.")
        }
      } else {
        setError("Error inesperado durante el registro. Intenta de nuevo.")
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido"
      setError(`Error inesperado: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Registrarse</CardTitle>
              <CardDescription>Crear una nueva cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Nombre Completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Juan Pérez"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Repetir Contraseña</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando cuenta..." : "Registrarse"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Iniciar sesión
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
