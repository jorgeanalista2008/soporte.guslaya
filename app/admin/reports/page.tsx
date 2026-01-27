import { AdminLayout } from "@/components/admin/admin-layout"
import { OperationalAnalytics } from "@/components/reports/operational-analytics"
import { FinancialAnalytics } from "@/components/reports/financial-analytics"
import { CustomerAnalytics } from "@/components/reports/customer-analytics"
import { PerformanceAnalytics } from "@/components/reports/performance-analytics"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Users, Activity, Clock } from "lucide-react"

export default async function AdminReportsPage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase.from("service_orders").select("*")
  const { data: clients } = await supabase.from("profiles").select("*").eq("role", "client")
  const { data: technicians } = await supabase.from("profiles").select("*").eq("role", "technician")

  const totalOrders = orders?.length || 0
  const completedOrders = orders?.filter((o) => ["completed", "delivered"].includes(o.status)).length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.final_cost || 0), 0) || 0

  const operationalData = {
    avgResolutionTime: 24.5,
    slaCompliance: 87,
    firstCallResolution: 73,
    technicianUtilization: 82,
    workloadDistribution: [
      { technician: "Carlos Rodríguez", activeOrders: 8, completedToday: 3, efficiency: 92 },
      { technician: "Ana García", activeOrders: 6, completedToday: 4, efficiency: 88 },
      { technician: "Luis Martínez", activeOrders: 10, completedToday: 2, efficiency: 85 },
      { technician: "María López", activeOrders: 7, completedToday: 3, efficiency: 90 },
    ],
    resolutionTrends: [
      { week: "S1", avgHours: 26, slaTarget: 24 },
      { week: "S2", avgHours: 25, slaTarget: 24 },
      { week: "S3", avgHours: 23, slaTarget: 24 },
      { week: "S4", avgHours: 24, slaTarget: 24 },
    ],
    priorityDistribution: [
      { priority: "Crítica", count: Math.floor(totalOrders * 0.15), avgResolution: 8 },
      { priority: "Alta", count: Math.floor(totalOrders * 0.25), avgResolution: 16 },
      { priority: "Media", count: Math.floor(totalOrders * 0.45), avgResolution: 24 },
      { priority: "Baja", count: Math.floor(totalOrders * 0.15), avgResolution: 48 },
    ],
    statusFlow: [
      { status: "Recibido", count: Math.floor(totalOrders * 0.2), avgDuration: 2 },
      { status: "Diagnóstico", count: Math.floor(totalOrders * 0.3), avgDuration: 6 },
      { status: "Reparación", count: Math.floor(totalOrders * 0.25), avgDuration: 12 },
      { status: "Pruebas", count: Math.floor(totalOrders * 0.25), avgDuration: 4 },
    ],
  }

  const financialData = {
    totalRevenue,
    monthlyGrowth: 12.5,
    averageOrderValue: totalRevenue / totalOrders || 0,
    profitMargin: 34.2,
    outstandingPayments: totalRevenue * 0.15,
    cashFlow: totalRevenue * 0.25,
    revenueByService: [
      {
        service: "Reparación Hardware",
        revenue: totalRevenue * 0.4,
        orders: Math.floor(totalOrders * 0.35),
        margin: 38,
      },
      {
        service: "Mantenimiento Software",
        revenue: totalRevenue * 0.25,
        orders: Math.floor(totalOrders * 0.3),
        margin: 45,
      },
      {
        service: "Instalación Sistemas",
        revenue: totalRevenue * 0.2,
        orders: Math.floor(totalOrders * 0.2),
        margin: 28,
      },
      { service: "Soporte Técnico", revenue: totalRevenue * 0.15, orders: Math.floor(totalOrders * 0.15), margin: 52 },
    ],
    monthlyTrends: [
      { month: "Ene", revenue: totalRevenue * 0.15, costs: totalRevenue * 0.1, profit: totalRevenue * 0.05 },
      { month: "Feb", revenue: totalRevenue * 0.18, costs: totalRevenue * 0.12, profit: totalRevenue * 0.06 },
      { month: "Mar", revenue: totalRevenue * 0.16, costs: totalRevenue * 0.11, profit: totalRevenue * 0.05 },
      { month: "Abr", revenue: totalRevenue * 0.2, costs: totalRevenue * 0.13, profit: totalRevenue * 0.07 },
      { month: "May", revenue: totalRevenue * 0.17, costs: totalRevenue * 0.11, profit: totalRevenue * 0.06 },
      { month: "Jun", revenue: totalRevenue * 0.14, costs: totalRevenue * 0.09, profit: totalRevenue * 0.05 },
    ],
    paymentMethods: [
      { method: "Transferencia Bancaria", amount: totalRevenue * 0.45, percentage: 45 },
      { method: "Tarjeta de Crédito", amount: totalRevenue * 0.35, percentage: 35 },
      { method: "Efectivo", amount: totalRevenue * 0.15, percentage: 15 },
      { method: "Cheque", amount: totalRevenue * 0.05, percentage: 5 },
    ],
    profitabilityAnalysis: [
      {
        category: "Hardware",
        revenue: totalRevenue * 0.4,
        cost: totalRevenue * 0.25,
        profit: totalRevenue * 0.15,
        margin: 37.5,
      },
      {
        category: "Software",
        revenue: totalRevenue * 0.3,
        cost: totalRevenue * 0.18,
        profit: totalRevenue * 0.12,
        margin: 40,
      },
      {
        category: "Servicios",
        revenue: totalRevenue * 0.3,
        cost: totalRevenue * 0.15,
        profit: totalRevenue * 0.15,
        margin: 50,
      },
    ],
  }

  const customerData = {
    totalCustomers: clients?.length || 0,
    activeCustomers: Math.floor((clients?.length || 0) * 0.75),
    customerSatisfaction: 4.3,
    retentionRate: 78,
    averageLifetimeValue: 1250,
    newCustomersThisMonth: 12,
    satisfactionTrends: [
      { month: "Ene", satisfaction: 4.1, responses: 45 },
      { month: "Feb", satisfaction: 4.2, responses: 52 },
      { month: "Mar", satisfaction: 4.0, responses: 48 },
      { month: "Abr", satisfaction: 4.3, responses: 55 },
      { month: "May", satisfaction: 4.4, responses: 49 },
      { month: "Jun", satisfaction: 4.3, responses: 51 },
    ],
    customerSegments: [
      { segment: "Empresas Premium", count: Math.floor((clients?.length || 0) * 0.15), avgValue: 2500, retention: 92 },
      { segment: "PYMES", count: Math.floor((clients?.length || 0) * 0.35), avgValue: 850, retention: 78 },
      {
        segment: "Particulares Frecuentes",
        count: Math.floor((clients?.length || 0) * 0.25),
        avgValue: 450,
        retention: 65,
      },
      { segment: "Ocasionales", count: Math.floor((clients?.length || 0) * 0.25), avgValue: 180, retention: 45 },
    ],
    serviceFrequency: [
      { frequency: "Mensual", customers: Math.floor((clients?.length || 0) * 0.2), percentage: 20 },
      { frequency: "Trimestral", customers: Math.floor((clients?.length || 0) * 0.35), percentage: 35 },
      { frequency: "Semestral", customers: Math.floor((clients?.length || 0) * 0.25), percentage: 25 },
      { frequency: "Anual", customers: Math.floor((clients?.length || 0) * 0.2), percentage: 20 },
    ],
    topCustomers: [
      { name: "TechCorp Solutions", totalOrders: 24, totalSpent: 12500, lastService: "2024-01-15", satisfaction: 4.8 },
      { name: "Innovate Systems", totalOrders: 18, totalSpent: 9800, lastService: "2024-01-12", satisfaction: 4.6 },
      { name: "Digital Dynamics", totalOrders: 15, totalSpent: 7500, lastService: "2024-01-10", satisfaction: 4.7 },
      { name: "Future Tech Ltd", totalOrders: 12, totalSpent: 6200, lastService: "2024-01-08", satisfaction: 4.5 },
    ],
  }

  const performanceData = {
    overallEfficiency: 84,
    qualityScore: 87,
    productivityIndex: 3.2,
    resourceUtilization: 78,
    technicianPerformance: [
      { name: "Carlos Rodríguez", ordersCompleted: 45, avgResolutionTime: 22, qualityRating: 4.6, efficiency: 92 },
      { name: "Ana García", ordersCompleted: 38, avgResolutionTime: 26, qualityRating: 4.4, efficiency: 88 },
      { name: "Luis Martínez", ordersCompleted: 42, avgResolutionTime: 24, qualityRating: 4.5, efficiency: 85 },
      { name: "María López", ordersCompleted: 40, avgResolutionTime: 23, qualityRating: 4.7, efficiency: 90 },
    ],
    departmentMetrics: [
      { department: "Reparaciones", productivity: 85, quality: 88, efficiency: 82 },
      { department: "Soporte", productivity: 92, quality: 85, efficiency: 89 },
      { department: "Instalaciones", productivity: 78, quality: 90, efficiency: 84 },
    ],
    performanceTrends: [
      { week: "S1", efficiency: 82, quality: 85, productivity: 3.1 },
      { week: "S2", efficiency: 84, quality: 87, productivity: 3.2 },
      { week: "S3", efficiency: 83, quality: 86, productivity: 3.0 },
      { week: "S4", efficiency: 85, quality: 88, productivity: 3.3 },
    ],
    benchmarkComparison: [
      { metric: "Tiempo de Resolución", current: 87, target: 90, industry: 82 },
      { metric: "Satisfacción del Cliente", current: 86, target: 88, industry: 81 },
      { metric: "Eficiencia Operacional", current: 84, target: 85, industry: 79 },
      { metric: "Calidad del Servicio", current: 87, target: 90, industry: 83 },
    ],
  }

  return (
    <AdminLayout
      userInfo={{
        name: profile.full_name,
        email: profile.email,
        role: profile.role,
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Centro de Inteligencia de Negocio</h1>
          <p className="text-muted-foreground">
            Análisis avanzado de métricas operacionales, financieras y de rendimiento
          </p>
        </div>

        <Tabs defaultValue="operational" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="operational" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Análisis Operacional
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Inteligencia Financiera
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Analytics de Clientes
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Métricas de Rendimiento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="operational" className="space-y-6">
            <OperationalAnalytics data={operationalData} />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialAnalytics data={financialData} />
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <CustomerAnalytics data={customerData} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceAnalytics data={performanceData} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
