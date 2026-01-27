"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { PriorityBadge } from "@/components/orders/priority-badge"
import { Package, Phone, CheckCircle, Users, Calendar, Wrench, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

function DeliveryCard({
  delivery,
  onMarkDelivered,
  onNotifyClient,
  isDelivered = false,
}: {
  delivery: any
  onMarkDelivered: (id: string) => void
  onNotifyClient: (id: string) => void
  isDelivered?: boolean
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-semibold text-lg">{delivery.order_number}</h3>
            <PriorityBadge priority={delivery.priority} />
            <OrderStatusBadge status={delivery.status} />
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {isDelivered && delivery.delivered_date
              ? formatDate(delivery.delivered_date)
              : delivery.completed_date
                ? formatDate(delivery.completed_date)
                : "N/A"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium">{delivery.client_name}</p>
                {delivery.client_phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {delivery.client_phone}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium">
                  {delivery.equipment?.equipment_type || delivery.equipment_type || "Equipo"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {delivery.equipment_brand} {delivery.equipment_model}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium">Costo Total</p>
                <p className="text-lg font-bold text-primary">
                  {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "€"}
                  {(delivery.final_cost || delivery.estimated_cost || 0).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium mb-1">Reparación:</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{delivery.repair_description}</p>
              </div>
            </div>
          </div>
        </div>

        {isDelivered && delivery.delivered_date && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Entregado el {formatDate(delivery.delivered_date)}</span>
            </div>
          </div>
        )}

        {delivery.status === "completed" && !isDelivered && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNotifyClient(delivery.id)}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Notificar Cliente
            </Button>
            <Button size="sm" onClick={() => onMarkDelivered(delivery.id)} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Marcar como Entregado
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DeliveriesClient({
  readyForDelivery,
  deliveredOrders,
}: {
  readyForDelivery: any[]
  deliveredOrders: any[]
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const handleMarkDelivered = async (orderId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("service_orders")
        .update({
          status: "delivered",
          delivered_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (error) throw error

      toast.success("Orden marcada como entregada exitosamente")
      router.refresh()
    } catch (error) {
      console.error("Error marking as delivered:", error)
      toast.error("Error al marcar como entregado")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotifyClient = async (orderId: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would send an email/SMS notification
      toast.success("Cliente notificado exitosamente")
    } catch (error) {
      console.error("Error notifying client:", error)
      toast.error("Error al notificar al cliente")
    } finally {
      setIsLoading(false)
    }
  }

  const filterDeliveries = (deliveries: any[]) => {
    return deliveries.filter((delivery) => {
      const matchesSearch =
        searchTerm === "" ||
        delivery.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.client_name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPriority = priorityFilter === "all" || delivery.priority === priorityFilter

      return matchesSearch && matchesPriority
    })
  }

  const filteredReadyForDelivery = filterDeliveries(readyForDelivery)
  const filteredDeliveredOrders = filterDeliveries(deliveredOrders)

  return (
    <Tabs defaultValue="ready" className="space-y-4">
      <TabsList>
        <TabsTrigger value="ready">Listos para Entrega ({readyForDelivery.length})</TabsTrigger>
        <TabsTrigger value="delivered">Entregados ({deliveredOrders.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="ready" className="space-y-4">
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Buscar por cliente o número de orden..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredReadyForDelivery.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || priorityFilter !== "all"
                  ? "No se encontraron resultados"
                  : "No hay equipos listos para entrega"}
              </h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || priorityFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Los equipos aparecerán aquí cuando estén completados y listos para ser entregados a los clientes."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredReadyForDelivery.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onMarkDelivered={handleMarkDelivered}
                onNotifyClient={handleNotifyClient}
                isDelivered={false}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="delivered" className="space-y-4">
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Buscar por cliente o número de orden..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredDeliveredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || priorityFilter !== "all"
                  ? "No se encontraron resultados"
                  : "No hay entregas registradas"}
              </h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || priorityFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Las entregas completadas aparecerán aquí para su seguimiento."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredDeliveredOrders.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onMarkDelivered={handleMarkDelivered}
                onNotifyClient={handleNotifyClient}
                isDelivered={true}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
