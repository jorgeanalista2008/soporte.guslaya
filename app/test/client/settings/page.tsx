import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, Phone } from "lucide-react"

const clientSidebarItems = [
  {
    title: "Dashboard",
    href: "/test/client",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Mis Órdenes...",
    href: "/test/client/orders",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Nueva Solicitud",
    href: "/test/client/new-request",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Historial",
    href: "/test/client/history",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Perfil",
    href: "/test/client/profile",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
]

export default function TestClientSettings() {
  return (
    <DashboardLayout
      sidebarItems={clientSidebarItems}
      userInfo={{
        name: "Cliente Demo",
        email: "cliente@example.com",
        role: "client",
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>
            <p className="text-gray-600 dark:text-gray-400">Personaliza tu experiencia y preferencias</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
            Modo Demo
          </div>
        </div>

        {/* Account Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="h-5 w-5" />
              Configuración de Cuenta
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Gestiona tu información personal y preferencias de cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="display-name" className="text-gray-900 dark:text-white">
                  Nombre para mostrar
                </Label>
                <Input
                  id="display-name"
                  defaultValue="Cliente Demo"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="text-gray-900 dark:text-white">
                  Idioma
                </Label>
                <Select defaultValue="es">
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem
                      value="es"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Español
                    </SelectItem>
                    <SelectItem
                      value="en"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      English
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-gray-900 dark:text-white">
                Zona Horaria
              </Label>
              <Select defaultValue="america/mexico_city">
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem
                    value="america/mexico_city"
                    className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    (GMT-6) Ciudad de México
                  </SelectItem>
                  <SelectItem
                    value="america/new_york"
                    className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    (GMT-5) Nueva York
                  </SelectItem>
                  <SelectItem
                    value="america/los_angeles"
                    className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    (GMT-8) Los Ángeles
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Configura cómo y cuándo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-white">Notificaciones por Email</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recibe actualizaciones sobre tus órdenes por correo electrónico
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-white">Notificaciones SMS</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recibe mensajes de texto para actualizaciones urgentes
                  </p>
                </div>
                <Switch />
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-white">Recordatorios de Citas</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recibe recordatorios antes de tus citas programadas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-white">Promociones y Ofertas</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recibe información sobre descuentos y ofertas especiales
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Shield className="h-5 w-5" />
              Privacidad y Seguridad
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Controla tu privacidad y configuraciones de seguridad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-white">Perfil Público</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permite que otros usuarios vean tu perfil básico
                  </p>
                </div>
                <Switch />
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-white">Compartir Datos de Uso</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ayuda a mejorar el servicio compartiendo datos anónimos de uso
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Cambiar Contraseña</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="password"
                    placeholder="Contraseña actual"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  <Input
                    type="password"
                    placeholder="Nueva contraseña"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                >
                  Actualizar Contraseña
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Palette className="h-5 w-5" />
              Apariencia
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Personaliza la apariencia de la interfaz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Tema</Label>
                <Select defaultValue="system">
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem
                      value="light"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Claro
                    </SelectItem>
                    <SelectItem
                      value="dark"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Oscuro
                    </SelectItem>
                    <SelectItem
                      value="system"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Sistema
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 dark:text-white">Animaciones</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Habilita animaciones y transiciones en la interfaz
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Preferences */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Phone className="h-5 w-5" />
              Preferencias de Contacto
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Configura cómo prefieres que te contactemos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Método de Contacto Preferido</Label>
                <Select defaultValue="email">
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem
                      value="email"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Email
                    </SelectItem>
                    <SelectItem
                      value="phone"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Teléfono
                    </SelectItem>
                    <SelectItem
                      value="sms"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      SMS
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">Horario de Contacto Preferido</Label>
                <Select defaultValue="business">
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem
                      value="morning"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Mañana (8:00 - 12:00)
                    </SelectItem>
                    <SelectItem
                      value="afternoon"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Tarde (12:00 - 18:00)
                    </SelectItem>
                    <SelectItem
                      value="business"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Horario comercial (8:00 - 18:00)
                    </SelectItem>
                    <SelectItem
                      value="anytime"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cualquier momento
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            variant="outline"
            className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
          >
            Restablecer
          </Button>
          <Button>Guardar Configuración</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
