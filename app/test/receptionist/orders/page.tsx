import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const receptionistSidebarItems = [
  {
    title: "Dashboard",
    href: "/test/receptionist/dashboard",
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
    title: "Nueva Orden",
    href: "/test/receptionist/new-order",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    title: "Órdenes",
    href: "/test/receptionist/orders",
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
    title: "Entregas",
    href: "/test/receptionist/deliveries",
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
    title: "Notificaciones",
    href: "/test/receptionist/notifications",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-5 5v-5zM11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
      </svg>
    ),
  },
  {
    title: "Clientes",
    href: "/test/receptionist/clients",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
]

export default function TestOrdersPage() {
  const mockOrders = [
    {
      id: "ORD-001",
      client: "María González",
      device: "HP Pavilion 15",
      issue: "No enciende",
      status: "received" as const,
      receivedDate: "2024-01-15",
      priority: "Alta",
    },
    {
      id: "ORD-002",
      client: "Carlos Rodríguez",
      device: "iPhone 12",
      issue: "Pantalla rota",
      status: "in_diagnosis" as const,
      receivedDate: "2024-01-14",
      priority: "Media",
    },
    {
      id: "ORD-003",
      client: "Ana Martínez",
      device: "Dell XPS 13",
      issue: "Teclado no funciona",
      status: "in_repair" as const,
      receivedDate: "2024-01-13",
      priority: "Baja",
    },
    {
      id: "ORD-004",
      client: "Pedro Sánchez",
      device: "MacBook Pro",
      issue: "Sobrecalentamiento",
      status: "testing" as const,
      receivedDate: "2024-01-12",
      priority: "Alta",
    },
    {
      id: "ORD-005",
      client: "Laura Gómez",
      device: "Samsung Galaxy S21",
      issue: "No carga",
      status: "completed" as const,
      receivedDate: "2024-01-11",
      priority: "Media",
    },
    {
      id: "ORD-006",
      client: "Miguel Torres",
      device: "Lenovo ThinkPad",
      issue: "Pantalla azul",
      status: "delivered" as const,
      receivedDate: "2024-01-10",
      priority: "Alta",
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={receptionistSidebarItems}
      userInfo={{
        name: "Recepcionista Demo",
        email: "recepcion@techservice.com",
        role: "receptionist",
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Órdenes de Servicio</h1>
            <p className="text-gray-600">Gestiona todas las órdenes de servicio</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Modo Demo</div>
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Orden
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input placeholder="Buscar por cliente, orden o dispositivo..." />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Todos los estados</option>
              <option value="received">Recibido</option>
              <option value="in_diagnosis">En Diagnóstico</option>
              <option value="in_repair">En Reparación</option>
              <option value="testing">Pruebas</option>
              <option value="completed">Completado</option>
              <option value="delivered">Entregado</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.device}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.issue}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.priority === "Alta"
                            ? "bg-red-100 text-red-800"
                            : order.priority === "Media"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.receivedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Ver</button>
                      <button className="text-green-600 hover:text-green-900">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
