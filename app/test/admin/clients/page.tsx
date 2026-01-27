import { Sidebar } from "@/components/layout/sidebar"
import { ClientsTable } from "@/components/clients/clients-table"

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

export default function TestAdminClients() {
  const mockUser = {
    name: "Admin Usuario",
    email: "admin@techservice.com",
    role: "administrador",
  }

  const mockClients = [
    {
      id: "1",
      full_name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "+1 234-567-8901",
      company: "Tech Solutions Inc.",
      address: "123 Main St, Ciudad",
      status: "active",
      created_at: "2023-06-15",
      orders_count: 5,
      total_spent: 750.0,
    },
    {
      id: "2",
      full_name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+1 234-567-8902",
      company: "Digital Marketing Co.",
      address: "456 Oak Ave, Ciudad",
      status: "active",
      created_at: "2023-07-20",
      orders_count: 3,
      total_spent: 450.0,
    },
    {
      id: "3",
      full_name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      phone: "+1 234-567-8903",
      company: "StartUp Innovations",
      address: "789 Pine St, Ciudad",
      status: "active",
      created_at: "2023-08-10",
      orders_count: 8,
      total_spent: 1200.0,
    },
    {
      id: "4",
      full_name: "Ana López",
      email: "ana.lopez@email.com",
      phone: "+1 234-567-8904",
      company: "Freelance",
      address: "321 Elm St, Ciudad",
      status: "inactive",
      created_at: "2023-09-05",
      orders_count: 2,
      total_spent: 300.0,
    },
    {
      id: "5",
      full_name: "Luis Martínez",
      email: "luis.martinez@email.com",
      phone: "+1 234-567-8905",
      company: "E-commerce Plus",
      address: "654 Maple Ave, Ciudad",
      status: "active",
      created_at: "2023-10-12",
      orders_count: 6,
      total_spent: 900.0,
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      {" "}
      {/* Updated background to match dashboard dark mode styling */}
      <Sidebar items={adminItems} userInfo={mockUser} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestión de Clientes</h1>
            <p className="text-gray-600 dark:text-gray-300">Administrar información completa de todos los clientes</p>
          </div>

          <ClientsTable clients={mockClients} showActions={true} />
        </div>
      </div>
    </div>
  )
}
