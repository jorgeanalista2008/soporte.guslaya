import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AdminIndex() {
  const adminItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      description: "Vista general del sistema con métricas y estadísticas",
    },
    {
      title: "Gestión de Clientes",
      href: "/admin/clients",
      description: "Administrar información completa de todos los clientes",
    },
    {
      title: "Gestión de Equipos",
      href: "/admin/equipments",
      description: "Administrar equipos de cómputo",
    },
    {
      title: "Inventario",
      href: "/admin/inventory",
      description: "Gestionar repuestos, stock y movimientos de inventario",
    },
    {
      title: "Todas las Órdenes",
      href: "/admin/orders",
      description: "Ver y gestionar todas las órdenes de servicio",
    },
    {
      title: "Reportes",
      href: "/admin/reports",
      description: "Análisis de ingresos, rendimiento y estadísticas del negocio",
    },
    {
      title: "Gestión de Usuarios",
      href: "/admin/users",
      description: "Administrar usuarios del sistema y sus roles",
    },
  ]

  const mockUser = {
    name: "Admin Usuario",
    email: "admin@techservice.com",
    role: "administrador",
  }

  return (
    <AdminLayout userInfo={mockUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Administrador</h1>
          <p className="text-muted-foreground">Selecciona una funcionalidad para explorar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-border"
            >
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">{item.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
              <div className="flex items-center text-primary text-sm font-medium">
                <span>Explorar</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Funcionalidades del Administrador
          </h2>
          <ul className="text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Acceso completo a todas las funcionalidades del sistema</li>
            <li>• Gestión de usuarios y asignación de roles</li>
            <li>• Reportes detallados de ingresos y rendimiento</li>
            <li>• Supervisión de todas las órdenes de servicio</li>
            <li>• Administración completa de la base de datos de clientes</li>
            <li>• Gestión completa del inventario y stock de repuestos</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
