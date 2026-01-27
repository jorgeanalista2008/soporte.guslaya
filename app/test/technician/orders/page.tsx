import Link from "next/link"
import { OrdersTable } from "@/components/orders/orders-table"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function TechnicianOrdersTest() {
  const sidebarItems = [
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
      title: "Órdenes",
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
      title: "Diagnósticos",
      href: "/test/technician/diagnostics",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
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

  const userInfo = {
    name: "Carlos Mendoza",
    email: "carlos.mendoza@techservice.com",
    role: "technician",
  }

  // Mock data for technician's assigned orders
  const technicianOrders = [
    {
      id: "TS-2024-001",
      clientName: "María García",
      clientEmail: "maria.garcia@email.com",
      deviceType: "Laptop",
      deviceBrand: "HP",
      deviceModel: "Pavilion 15",
      issue: "No enciende, posible problema de fuente",
      status: "En Progreso",
      priority: "Alta",
      createdAt: "2024-01-15",
      assignedTechnician: "Carlos Mendoza",
    },
    {
      id: "TS-2024-002",
      clientName: "Juan Pérez",
      clientEmail: "juan.perez@email.com",
      deviceType: "PC Desktop",
      deviceBrand: "Dell",
      deviceModel: "OptiPlex 3070",
      issue: "Sistema muy lento, posible virus",
      status: "Diagnóstico",
      priority: "Media",
      createdAt: "2024-01-14",
      assignedTechnician: "Carlos Mendoza",
    },
    {
      id: "TS-2024-003",
      clientName: "Ana López",
      clientEmail: "ana.lopez@email.com",
      deviceType: "MacBook",
      deviceBrand: "Apple",
      deviceModel: "MacBook Pro 13",
      issue: "Pantalla rota, necesita reemplazo",
      status: "Esperando Repuesto",
      priority: "Alta",
      createdAt: "2024-01-13",
      assignedTechnician: "Carlos Mendoza",
    },
    {
      id: "TS-2024-004",
      clientName: "Luis Torres",
      clientEmail: "luis.torres@email.com",
      deviceType: "Tablet",
      deviceBrand: "Samsung",
      deviceModel: "Galaxy Tab S7",
      issue: "No carga, puerto USB dañado",
      status: "En Progreso",
      priority: "Baja",
      createdAt: "2024-01-12",
      assignedTechnician: "Carlos Mendoza",
    },
  ]

  return (
    <DashboardLayout sidebarItems={sidebarItems} userInfo={userInfo}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href="/test/technician"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium mb-4 inline-block"
            >
              ← Volver a Técnico
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Órdenes de Servicio</h1>
            <p className="text-gray-600 dark:text-gray-300">Órdenes asignadas a ti como técnico</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <OrdersTable orders={technicianOrders} showClientInfo={true} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
