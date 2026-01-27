"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricCard, AreaChartComponent, LineChartComponent } from "./chart-components"
import { DollarSign, CreditCard, PieChart, Calculator, Target } from "lucide-react"

interface FinancialData {
  totalRevenue: number
  monthlyGrowth: number
  averageOrderValue: number
  profitMargin: number
  outstandingPayments: number
  cashFlow: number
  revenueByService: Array<{
    service: string
    revenue: number
    orders: number
    margin: number
  }>
  monthlyTrends: Array<{
    month: string
    revenue: number
    costs: number
    profit: number
  }>
  paymentMethods: Array<{
    method: string
    amount: number
    percentage: number
  }>
  profitabilityAnalysis: Array<{
    category: string
    revenue: number
    cost: number
    profit: number
    margin: number
  }>
}

interface FinancialAnalyticsProps {
  data: FinancialData
}

export function FinancialAnalytics({ data }: FinancialAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* KPIs Financieros */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ingresos Totales"
          value={formatCurrency(data.totalRevenue)}
          description="Facturación acumulada del período"
          trend="up"
          trendValue={`${data.monthlyGrowth}% vs mes anterior`}
          icon={<DollarSign className="h-4 w-4" />}
          tooltip="Suma total de ingresos por servicios completados y facturados en el período seleccionado."
        />
        <MetricCard
          title="Valor Promedio por Orden"
          value={formatCurrency(data.averageOrderValue)}
          description="Ticket promedio por servicio"
          trend="up"
          trendValue="3% vs mes anterior"
          icon={<Calculator className="h-4 w-4" />}
          tooltip="Valor medio de facturación por orden de servicio. Indicador clave para estrategias de pricing."
        />
        <MetricCard
          title="Margen de Beneficio"
          value={`${data.profitMargin}%`}
          description="Rentabilidad operacional"
          trend="up"
          trendValue="2.1% vs mes anterior"
          icon={<Target className="h-4 w-4" />}
          tooltip="Porcentaje de beneficio después de descontar costos operacionales directos."
        />
        <MetricCard
          title="Pagos Pendientes"
          value={formatCurrency(data.outstandingPayments)}
          description="Cuentas por cobrar"
          trend="down"
          trendValue="15% vs mes anterior"
          icon={<CreditCard className="h-4 w-4" />}
          tooltip="Monto total de servicios facturados pendientes de cobro. Impacta el flujo de caja."
        />
      </div>

      {/* Análisis de Tendencias */}
      <div className="grid gap-6 md:grid-cols-2">
        <AreaChartComponent
          data={data.monthlyTrends}
          xKey="month"
          yKey="revenue"
          title="Evolución de Ingresos Mensuales"
          description="Tendencia de facturación y crecimiento mensual"
          color="#10b981"
        />
        <LineChartComponent
          data={data.monthlyTrends}
          xKey="month"
          yKey="profit"
          title="Análisis de Rentabilidad"
          description="Evolución del margen de beneficio mensual"
          color="#3b82f6"
        />
      </div>

      {/* Análisis por Tipo de Servicio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Rentabilidad por Tipo de Servicio
          </CardTitle>
          <CardDescription>Análisis de ingresos y márgenes por categoría de reparación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.revenueByService.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{service.service}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Ingresos: {formatCurrency(service.revenue)}</span>
                    <span>Órdenes: {service.orders}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={service.margin >= 30 ? "default" : service.margin >= 20 ? "secondary" : "destructive"}
                  >
                    {service.margin}% Margen
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Métodos de Pago */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Métodos de Pago</CardTitle>
            <CardDescription>Preferencias de pago de los clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{method.method}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{method.percentage}%</span>
                    <span className="text-sm font-medium">{formatCurrency(method.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análisis de Flujo de Caja</CardTitle>
            <CardDescription>Liquidez y proyecciones financieras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Flujo de Caja Actual</span>
                <span className={`text-lg font-bold ${data.cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(data.cashFlow)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Proyección 30 días</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(data.cashFlow * 1.15)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cuentas por Cobrar</span>
                <span className="text-lg font-bold text-orange-600">{formatCurrency(data.outstandingPayments)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
