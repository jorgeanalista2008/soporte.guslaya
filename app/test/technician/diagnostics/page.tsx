import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function TechnicianDiagnosticsTest() {
  const diagnosticTools = [
    {
      name: "Test de Hardware",
      description: "Diagnóstico completo de componentes",
      status: "Disponible",
      lastUsed: "Hace 2 horas",
    },
    {
      name: "Análisis de Memoria",
      description: "Verificación de RAM y almacenamiento",
      status: "En Uso",
      lastUsed: "Actualmente",
    },
    {
      name: "Test de Red",
      description: "Diagnóstico de conectividad",
      status: "Disponible",
      lastUsed: "Ayer",
    },
    {
      name: "Análisis de Virus",
      description: "Escaneo completo de malware",
      status: "Disponible",
      lastUsed: "Hace 3 días",
    },
  ]

  const recentDiagnostics = [
    {
      orderId: "TS-2024-001",
      device: "HP Pavilion 15",
      issue: "No enciende",
      result: "Fuente de poder defectuosa",
      status: "Completado",
      date: "2024-01-15",
    },
    {
      orderId: "TS-2024-002",
      device: "Dell OptiPlex",
      issue: "Sistema lento",
      result: "Disco duro fragmentado, 8 virus detectados",
      status: "En Progreso",
      date: "2024-01-14",
    },
    {
      orderId: "TS-2024-004",
      device: "Samsung Galaxy Tab",
      issue: "No carga",
      result: "Puerto USB dañado, necesita reemplazo",
      status: "Completado",
      date: "2024-01-12",
    },
  ]

  const technicianItems = [
    {
      title: "Dashboard",
      href: "/test/technician/dashboard",
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
      title: "Órdenes Asignadas",
      href: "/test/technician/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "Herramientas de Diagnóstico",
      href: "/test/technician/diagnostics",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31 2.37 2.37a1.724 1.724 0 002.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Inventario",
      href: "/test/technician/inventory",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      title: "Historial",
      href: "/test/technician/history",
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
  ]

  const mockUser = {
    name: "Carlos Técnico",
    email: "carlos@techservice.com",
    role: "técnico",
  }

  return (
    <DashboardLayout sidebarItems={technicianItems} userInfo={mockUser}>
      <div className="p-8">
        <div className="mb-8">
          <Link
            href="/test/technician"
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium mb-4 inline-block"
          >
            ← Volver a Técnico
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Herramientas de Diagnóstico</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Utiliza estas herramientas para diagnosticar problemas técnicos
          </p>
        </div>

        {/* Diagnostic Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {diagnosticTools.map((tool, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">{tool.name}</CardTitle>
                <CardDescription className="dark:text-gray-300">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={tool.status === "Disponible" ? "default" : "secondary"}>{tool.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Último uso: {tool.lastUsed}</p>
                <Button size="sm" className="w-full" disabled={tool.status === "En Uso"}>
                  {tool.status === "En Uso" ? "En Uso" : "Ejecutar"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Diagnostics */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Diagnósticos Recientes</CardTitle>
            <CardDescription className="dark:text-gray-300">Historial de diagnósticos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDiagnostics.map((diagnostic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{diagnostic.orderId}</span>
                      <Badge variant={diagnostic.status === "Completado" ? "default" : "secondary"}>
                        {diagnostic.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <strong>Dispositivo:</strong> {diagnostic.device}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <strong>Problema:</strong> {diagnostic.issue}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Resultado:</strong> {diagnostic.result}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{diagnostic.date}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Ver Reporte
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
