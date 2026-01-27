import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TechnicianTestPage() {
  const technicianFeatures = [
    {
      title: "Dashboard",
      description: "Vista general de órdenes asignadas y métricas personales",
      href: "/test/technician/dashboard",
      icon: "📊",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
    },
    {
      title: "Mis Órdenes",
      description: "Órdenes de servicio asignadas al técnico",
      href: "/test/technician/orders",
      icon: "🔧",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      title: "Diagnósticos",
      description: "Herramientas de diagnóstico y evaluación técnica",
      href: "/test/technician/diagnostics",
      icon: "🔍",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    },
    {
      title: "Inventario",
      description: "Gestión de repuestos y componentes disponibles",
      href: "/test/technician/inventory",
      icon: "📦",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    },
    {
      title: "Historial de Trabajo",
      description: "Registro de trabajos completados y estadísticas",
      href: "/test/technician/history",
      icon: "📋",
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/test"
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium mb-4 inline-block"
          >
            ← Volver a Pruebas
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Funcionalidades del Técnico</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explora todas las herramientas y funcionalidades disponibles para el rol de técnico
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicianFeatures.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card
                className={`transition-all duration-200 cursor-pointer ${feature.color} dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <CardTitle className="text-lg dark:text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
