import { Sidebar } from "@/components/layout/sidebar"
import { OrdersTable } from "@/components/orders/orders-table"

const adminItems = [
  {
    title: "Dashboard",
    href: "/test/admin/dashboard",
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
    title: "Gestión de Clientes",
    href: "/test/admin/clients",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
  },
  {
    title: "Todas las Órdenes",
    href: "/test/admin/orders",
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
    title: "Reportes",
    href: "/test/admin/reports",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Gestión de Usuarios",
    href: "/test/admin/users",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
  },
]

export default function TestAdminOrders() {
  const mockUser = {
    name: "Admin Usuario",
    email: "admin@techservice.com",
    role: "administrador",
  }

  const mockOrders = [
    {
      id: "TS-2024-001",
      client_name: "Juan Pérez",
      client_email: "juan.perez@email.com",
      device_type: "Laptop",
      device_brand: "Dell",
      device_model: "Inspiron 15",
      issue_description: "No enciende, posible problema con la fuente de poder",
      status: "received",
      priority: "high",
      assigned_technician: "María González",
      estimated_cost: 150.0,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    },
    {
      id: "TS-2024-002",
      client_name: "María González",
      client_email: "maria.gonzalez@email.com",
      device_type: "Desktop",
      device_brand: "HP",
      device_model: "Pavilion",
      issue_description: "Pantalla azul frecuente, posible problema de RAM",
      status: "in_progress",
      priority: "medium",
      assigned_technician: "Carlos Rodríguez",
      estimated_cost: 200.0,
      created_at: "2024-01-14T14:20:00Z",
      updated_at: "2024-01-15T09:15:00Z",
    },
    {
      id: "TS-2024-003",
      client_name: "Carlos Rodríguez",
      client_email: "carlos.rodriguez@email.com",
      device_type: "Smartphone",
      device_brand: "Samsung",
      device_model: "Galaxy S21",
      issue_description: "Pantalla rota, necesita reemplazo",
      status: "completed",
      priority: "low",
      assigned_technician: "Ana López",
      estimated_cost: 120.0,
      created_at: "2024-01-13T16:45:00Z",
      updated_at: "2024-01-14T11:30:00Z",
    },
    {
      id: "TS-2024-004",
      client_name: "Ana López",
      client_email: "ana.lopez@email.com",
      device_type: "Tablet",
      device_brand: "iPad",
      device_model: "Air 4",
      issue_description: "No carga, problema con el puerto de carga",
      status: "waiting_parts",
      priority: "medium",
      assigned_technician: "Luis Martínez",
      estimated_cost: 80.0,
      created_at: "2024-01-12T11:15:00Z",
      updated_at: "2024-01-13T08:20:00Z",
    },
    {
      id: "TS-2024-005",
      client_name: "Luis Martínez",
      client_email: "luis.martinez@email.com",
      device_type: "Laptop",
      device_brand: "MacBook",
      device_model: "Pro 13",
      issue_description: "Teclado no responde, algunas teclas no funcionan",
      status: "ready_for_pickup",
      priority: "high",
      assigned_technician: "María González",
      estimated_cost: 250.0,
      created_at: "2024-01-11T09:30:00Z",
      updated_at: "2024-01-14T16:45:00Z",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar items={adminItems} userInfo={mockUser} />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Todas las Órdenes</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ver y gestionar todas las órdenes de servicio del sistema
            </p>
          </div>

          <OrdersTable orders={mockOrders} showClientInfo={true} />
        </div>
      </div>
    </div>
  )
}
