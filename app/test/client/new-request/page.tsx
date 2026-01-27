import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    title: "Mis Órdenes",
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

export default function TestClientNewRequest() {
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Solicitud de Servicio</h1>
            <p className="text-gray-600 dark:text-gray-400">Describe tu problema y te ayudaremos a solucionarlo</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
            Modo Demo
          </div>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Información del Dispositivo</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Proporciona los detalles de tu dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="device-type" className="text-gray-900 dark:text-white">
                  Tipo de Dispositivo
                </Label>
                <Select>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecciona el tipo de dispositivo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem
                      value="laptop"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Laptop
                    </SelectItem>
                    <SelectItem
                      value="desktop"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      PC de Escritorio
                    </SelectItem>
                    <SelectItem
                      value="smartphone"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Smartphone
                    </SelectItem>
                    <SelectItem
                      value="tablet"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Tablet
                    </SelectItem>
                    <SelectItem
                      value="printer"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Impresora
                    </SelectItem>
                    <SelectItem
                      value="other"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Otro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-gray-900 dark:text-white">
                  Marca
                </Label>
                <Input
                  id="brand"
                  placeholder="Ej: Dell, Apple, Samsung"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="text-gray-900 dark:text-white">
                  Modelo
                </Label>
                <Input
                  id="model"
                  placeholder="Ej: Inspiron 15, iPhone 12, Galaxy S21"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-gray-900 dark:text-white">
                  Prioridad
                </Label>
                <Select>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem
                      value="low"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Baja
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Media
                    </SelectItem>
                    <SelectItem
                      value="high"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Alta
                    </SelectItem>
                    <SelectItem
                      value="urgent"
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Urgente
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue" className="text-gray-900 dark:text-white">
                Descripción del Problema
              </Label>
              <Textarea
                id="issue"
                placeholder="Describe detalladamente el problema que estás experimentando..."
                rows={4}
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-info" className="text-gray-900 dark:text-white">
                Información Adicional
              </Label>
              <Textarea
                id="additional-info"
                placeholder="Cualquier información adicional que pueda ser útil (cuándo comenzó el problema, qué estabas haciendo, etc.)"
                rows={3}
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button
                variant="outline"
                className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
              >
                Cancelar
              </Button>
              <Button>Enviar Solicitud</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
