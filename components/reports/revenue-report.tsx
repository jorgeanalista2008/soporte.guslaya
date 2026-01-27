"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { formatCurrency, getCurrencySymbol } from "@/lib/utils/currency"

interface RevenueReportProps {
  data: {
    monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>
    revenueByTechnician: Array<{ technician: string; revenue: number; orders: number }>
    averageOrderValue: number
    totalRevenue: number
    projectedRevenue: number
  }
}

export function RevenueReport({ data }: RevenueReportProps) {
  const currencySymbol = getCurrencySymbol()

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(data.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Acumulado este año</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Valor Promedio por Orden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Promedio por servicio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Proyección Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.projectedRevenue)}</div>
            <p className="text-xs text-muted-foreground">Basado en tendencia actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${currencySymbol === "USD" ? "$" : ""}${value}`, "Ingresos"]} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Technician */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos por Técnico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.revenueByTechnician.map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{tech.technician}</p>
                  <p className="text-sm text-gray-600">{tech.orders} órdenes completadas</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(tech.revenue)}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(tech.revenue / tech.orders)} promedio</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
