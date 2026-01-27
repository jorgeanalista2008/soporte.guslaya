import { Sidebar } from "@/components/layout/sidebar"
import { StatsOverview } from "@/components/reports/stats-overview"
import { RevenueReport } from "@/components/reports/revenue-report"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function TestAdminReports() {
  const mockUser = {
    name: "Admin Usuario",
    email: "admin@techservice.com",
    role: "administrador",
  }

  const mockStatsData = {
    totalOrders: 1247,
    activeOrders: 89,
    completedOrders: 1158,
    totalRevenue: 245680,
    averageRepairTime: 3.2,
    customerSatisfaction: 94,
    monthlyOrders: [
      { month: "Ene", orders: 98, revenue: 18500 },
      { month: "Feb", orders: 112, revenue: 21200 },
      { month: "Mar", orders: 105, revenue: 19800 },
      { month: "Abr", orders: 128, revenue: 24100 },
      { month: "May", orders: 134, revenue: 25300 },
      { month: "Jun", orders: 142, revenue: 26800 },
    ],
    statusDistribution: [
      { status: "Pendiente", count: 25, color: "#f59e0b" },
      { status: "En Proceso", count: 34, color: "#3b82f6" },
      { status: "Esperando Piezas", count: 18, color: "#ef4444" },
      { status: "Listo", count: 12, color: "#10b981" },
    ],
    topDeviceTypes: [
      { device: "Laptop", count: 342 },
      { device: "Desktop", count: 298 },
      { device: "Smartphone", count: 256 },
      { device: "Tablet", count: 189 },
      { device: "Impresora", count: 162 },
    ],
  }

  const mockRevenueData = {
    totalRevenue: mockStatsData.totalRevenue,
    averageOrderValue: mockStatsData.totalRevenue / mockStatsData.totalOrders,
    projectedRevenue: 28500,
    monthlyRevenue: mockStatsData.monthlyOrders.map((item) => ({
      month: item.month,
      revenue: item.revenue,
      orders: item.orders,
    })),
    revenueByTechnician: [
      { technician: "Carlos Rodríguez", revenue: 45200, orders: 89 },
      { technician: "Ana García", revenue: 38900, orders: 76 },
      { technician: "Luis Martínez", revenue: 42100, orders: 82 },
      { technician: "María López", revenue: 39800, orders: 78 },
    ],
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar items={adminItems} userInfo={mockUser} />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reportes y Análisis</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Análisis de ingresos, rendimiento y estadísticas del negocio
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="revenue">Ingresos</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <StatsOverview data={mockStatsData} />
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <RevenueReport data={mockRevenueData} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationCenter />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
