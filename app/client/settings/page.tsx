import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { clientSidebarItems } from "@/lib/config/sidebar-items"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default async function ClientSettingsPage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  return (
    <RoleGuard allowedRoles={["client"]}>
      <DashboardLayout
        sidebarItems={clientSidebarItems}
        userInfo={{
          name: profile.full_name,
          email: profile.email,
          role: profile.role,
        }}
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground">Personaliza tu experiencia y preferencias de la aplicación</p>
          </div>

          {/* Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground">Notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir actualizaciones sobre el estado de tus órdenes por email
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">Notificaciones SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones importantes por mensaje de texto
                  </p>
                </div>
                <Switch id="sms-notifications" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Notificaciones Push</Label>
                  <p className="text-sm text-muted-foreground">Recibir notificaciones en tiempo real en el navegador</p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Preferencias de Visualización */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Preferencias de Visualización
              </CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select defaultValue="dark">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="es">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacidad y Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground">Privacidad y Seguridad</CardTitle>
              <CardDescription>Gestiona tu privacidad y configuración de seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing">Compartir Datos de Uso</Label>
                  <p className="text-sm text-muted-foreground">
                    Ayúdanos a mejorar el servicio compartiendo datos anónimos de uso
                  </p>
                </div>
                <Switch id="data-sharing" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-transparent">
                  Cambiar Contraseña
                </Button>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-transparent">
                  Descargar Mis Datos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Acciones de Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-destructive">Zona de Peligro</CardTitle>
              <CardDescription>Acciones irreversibles relacionadas con tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full">
                Eliminar Cuenta
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
