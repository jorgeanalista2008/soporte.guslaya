import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"

interface ClientDetailsProps {
  client: {
    id: string
    user_id: string
    full_name: string
    email: string
    phone?: string
    company_name?: string
    address?: string
    city?: string
    postal_code?: string
    tax_id?: string
    notes?: string
    is_active: boolean
    created_at: string
  }
  orders?: Array<{
    id: string
    order_number: string
    device_type: string
    status: string
    received_date: string
    final_cost?: number
  }>
}

export function ClientDetails({ client, orders = [] }: ClientDetailsProps) {
  const activeOrders = orders.filter((order) => !["completed", "delivered", "cancelled"].includes(order.status))
  const completedOrders = orders.filter((order) => ["completed", "delivered"].includes(order.status))
  const totalSpent = orders.reduce((sum, order) => sum + (order.final_cost || 0), 0)

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-blue-700">{client.full_name.charAt(0).toUpperCase()}</span>
              </div>
              {client.full_name}
            </CardTitle>
            <Badge variant={client.is_active ? "default" : "secondary"}>
              {client.is_active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Información de Contacto</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-900">{client.email}</p>
                  <p className="text-sm text-gray-900">{client.phone || "No registrado"}</p>
                </div>
              </div>

              {client.company_name && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Empresa</h4>
                  <p className="mt-1 text-sm text-gray-900">{client.company_name}</p>
                </div>
              )}

              {client.address && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Dirección</h4>
                  <div className="mt-1 text-sm text-gray-900">
                    <p>{client.address}</p>
                    <p>
                      {client.city} {client.postal_code}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Estadísticas</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    <p className="text-xs text-gray-500">Órdenes Totales</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
                    <p className="text-xs text-gray-500">Órdenes Activas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
                    <p className="text-xs text-gray-500">Completadas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Total Gastado</p>
                  </div>
                </div>
              </div>

              {client.tax_id && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">RFC/NIT</h4>
                  <p className="mt-1 text-sm text-gray-900">{client.tax_id}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500">Cliente desde</h4>
                <p className="mt-1 text-sm text-gray-900">{new Date(client.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {client.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500">Notas</h4>
              <p className="mt-1 text-sm text-gray-900">{client.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{order.order_number}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.device_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{new Date(order.received_date).toLocaleDateString()}</p>
                    {order.final_cost && <p className="text-sm text-gray-600">${order.final_cost.toFixed(2)}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Este cliente no tiene órdenes registradas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
