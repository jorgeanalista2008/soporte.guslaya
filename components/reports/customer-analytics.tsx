"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricCard, LineChartComponent, PieChartComponent } from "./chart-components"
import { Users, Star, Repeat, TrendingUp, UserCheck, Clock } from "lucide-react"

interface CustomerData {
  totalCustomers: number
  activeCustomers: number
  customerSatisfaction: number
  retentionRate: number
  averageLifetimeValue: number
  newCustomersThisMonth: number
  satisfactionTrends: Array<{
    month: string
    satisfaction: number
    responses: number
  }>
  customerSegments: Array<{
    segment: string
    count: number
    avgValue: number
    retention: number
  }>
  serviceFrequency: Array<{
    frequency: string
    customers: number
    percentage: number
  }>
  topCustomers: Array<{
    name: string
    totalOrders: number
    totalSpent: number
    lastService: string
    satisfaction: number
  }>
}

interface CustomerAnalyticsProps {
  data: CustomerData
}

export function CustomerAnalytics({ data }: CustomerAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getSatisfactionColor = (score: number) => {
    if (score >= 4.5) return "default"
    if (score >= 4.0) return "secondary"
    if (score >= 3.5) return "outline"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      {/* KPIs de Clientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Base de Clientes Activos"
          value={data.activeCustomers.toLocaleString()}
          description={`Total: ${data.totalCustomers.toLocaleString()} clientes`}
          trend="up"
          trendValue={`${data.newCustomersThisMonth} nuevos este mes`}
          icon={<Users className="h-4 w-4" />}
          tooltip="Clientes que han utilizado nuestros servicios en los últimos 12 meses."
        />
        <MetricCard
          title="Satisfacción del Cliente"
          value={`${data.customerSatisfaction}/5.0`}
          description="Puntuación promedio de satisfacción"
          trend="up"
          trendValue="0.2 puntos vs mes anterior"
          icon={<Star className="h-4 w-4" />}
          tooltip="Promedio ponderado de calificaciones de satisfacción post-servicio en escala de 1-5."
        />
        <MetricCard
          title="Tasa de Retención"
          value={`${data.retentionRate}%`}
          description="Clientes que repiten servicios"
          trend="up"
          trendValue="5% vs año anterior"
          icon={<Repeat className="h-4 w-4" />}
          tooltip="Porcentaje de clientes que han utilizado nuestros servicios más de una vez en el período."
        />
        <MetricCard
          title="Valor de Vida del Cliente"
          value={formatCurrency(data.averageLifetimeValue)}
          description="Valor promedio por cliente"
          trend="up"
          trendValue="12% vs año anterior"
          icon={<TrendingUp className="h-4 w-4" />}
          tooltip="Valor monetario promedio que genera un cliente durante toda su relación con la empresa."
        />
      </div>

      {/* Análisis de Tendencias */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChartComponent
          data={data.satisfactionTrends}
          xKey="month"
          yKey="satisfaction"
          title="Evolución de Satisfacción del Cliente"
          description="Tendencia mensual de calificaciones de satisfacción"
          color="#10b981"
        />
        <PieChartComponent
          data={data.serviceFrequency}
          dataKey="customers"
          nameKey="frequency"
          title="Frecuencia de Uso del Servicio"
          description="Distribución de clientes por frecuencia de uso"
          colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
        />
      </div>

      {/* Segmentación de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Segmentación de Clientes
          </CardTitle>
          <CardDescription>Análisis de valor y comportamiento por segmento de cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{segment.segment}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Clientes: {segment.count}</span>
                    <span>Valor Promedio: {formatCurrency(segment.avgValue)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      segment.retention >= 80 ? "default" : segment.retention >= 60 ? "secondary" : "destructive"
                    }
                  >
                    {segment.retention}% Retención
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Clientes de Mayor Valor
          </CardTitle>
          <CardDescription>Análisis de los clientes más importantes por volumen y frecuencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{customer.name}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Órdenes: {customer.totalOrders}</span>
                    <span>Total Gastado: {formatCurrency(customer.totalSpent)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Último servicio: {customer.lastService}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getSatisfactionColor(customer.satisfaction)}>{customer.satisfaction}/5.0 ★</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
