import { StatsCard } from "@/components/dashboard/stats-card"
import { Clock, Users, Truck, TrendingUp, FileText, CheckCircle, AlertCircle, Package } from "lucide-react"

interface ReceptionistDashboardStatsProps {
  stats: {
    todayOrders: number
    clientsServed: number
    pendingDeliveries: number
    satisfactionIndex: number
    totalOrders: number
    activeOrders: number
    completedOrders: number
    deliveredOrders: number
  }
}

export function ReceptionistDashboardStats({ stats }: ReceptionistDashboardStatsProps) {
  const mainStats = [
    {
      title: "Órdenes del Día",
      value: stats.todayOrders,
      icon: <Clock className="w-6 h-6" />,
      change: "+12% vs ayer",
      changeType: "positive" as const,
    },
    {
      title: "Clientes Atendidos",
      value: stats.clientsServed,
      icon: <Users className="w-6 h-6" />,
      change: `${stats.clientsServed} únicos`,
      changeType: "neutral" as const,
    },
    {
      title: "Entregas Pendientes",
      value: stats.pendingDeliveries,
      icon: <Truck className="w-6 h-6" />,
      change: stats.pendingDeliveries > 0 ? "Requiere atención" : "Al día",
      changeType: stats.pendingDeliveries > 5 ? ("negative" as const) : ("positive" as const),
    },
    {
      title: "Satisfacción",
      value: `${stats.satisfactionIndex}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      change: "+2% este mes",
      changeType: "positive" as const,
    },
  ]

  const secondaryStats = [
    {
      title: "Total Órdenes",
      value: stats.totalOrders,
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "Órdenes Activas",
      value: stats.activeOrders,
      icon: <AlertCircle className="w-6 h-6" />,
    },
    {
      title: "Completadas",
      value: stats.completedOrders,
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: "Entregadas",
      value: stats.deliveredOrders,
      icon: <Package className="w-6 h-6" />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats - Highlighted */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Estadísticas del Día</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainStats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              changeType={stat.changeType}
            />
          ))}
        </div>
      </div>

      {/* Secondary Stats - Overview */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Resumen General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryStats.map((stat) => (
            <StatsCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>
      </div>
    </div>
  )
}
