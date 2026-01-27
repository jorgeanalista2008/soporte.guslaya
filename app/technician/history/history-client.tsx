"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { TechnicianLayout } from "@/components/technician/technician-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, CheckCircle, Package, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { OrderWithDetails, Profile, InventoryRequest } from "@/types"

export default function TechnicianHistoryClient() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [completedOrders, setCompletedOrders] = useState<OrderWithDetails[]>([])
  const [inventoryRequests, setInventoryRequests] = useState<InventoryRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchData = async (showRefreshMessage = false) => {
    const supabase = createClient()

    if (!supabase) {
      toast({
        title: "Error de configuración",
        description: "No se pudo conectar con la base de datos",
        variant: "destructive",
      })
      return
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error("Auth error:", authError)
        if (authError.message.includes("session_not_found") || authError.message.includes("JWT")) {
          // Sesión expirada, redirigir al login
          window.location.href = "/auth/login"
          return
        }
        throw authError
      }

      if (!user) {
        window.location.href = "/auth/login"
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del usuario",
          variant: "destructive",
        })
        return
      }

      setProfile(profileData)

      const { data: ordersData, error: ordersError } = await supabase
        .from("service_orders")
        .select(`
          *,
          client:profiles!service_orders_client_id_fkey(*),
          equipment:equipments(*),
          technician:profiles!service_orders_technician_id_fkey(*)
        `)
        .eq("technician_id", user.id)
        .eq("status", "completed")
        .order("completed_date", { ascending: false })
        .limit(50)

      if (ordersError) {
        console.error("Error fetching orders:", ordersError)
        toast({
          title: "Error",
          description: "No se pudieron cargar las órdenes completadas",
          variant: "destructive",
        })
      } else {
        setCompletedOrders(ordersData || [])
      }

      const { data: requestsData, error: requestsError } = await supabase
        .from("inventory_requests")
        .select(`
          *,
          part:inventory_parts(*),
          requester:profiles!inventory_requests_requested_by_fkey(*)
        `)
        .eq("requested_by", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (requestsError) {
        console.error("Error fetching requests:", requestsError)
        toast({
          title: "Error",
          description: "No se pudieron cargar las solicitudes de partes",
          variant: "destructive",
        })
      } else {
        setInventoryRequests(requestsData || [])
      }

      if (showRefreshMessage) {
        toast({
          title: "Actualizado",
          description: "El historial se ha actualizado correctamente",
        })
      }
    } catch (error: any) {
      console.error("Unexpected error:", error)

      if (
        error?.message?.includes("session_not_found") ||
        error?.message?.includes("JWT") ||
        error?.message?.includes("Failed to fetch")
      ) {
        toast({
          title: "Sesión expirada",
          description: "Tu sesión ha expirado. Redirigiendo al login...",
          variant: "destructive",
        })
        setTimeout(() => {
          window.location.href = "/auth/login"
        }, 2000)
        return
      }

      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData(true)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { label: "Completada", variant: "default" as const },
      pending: { label: "Pendiente", variant: "secondary" as const },
      approved: { label: "Aprobada", variant: "default" as const },
      rejected: { label: "Rechazada", variant: "destructive" as const },
      fulfilled: { label: "Entregada", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      low: { label: "Baja", variant: "secondary" as const },
      normal: { label: "Normal", variant: "outline" as const },
      high: { label: "Alta", variant: "default" as const },
      urgent: { label: "Urgente", variant: "destructive" as const },
    }
    return priorityMap[priority as keyof typeof priorityMap] || { label: priority, variant: "secondary" as const }
  }

  const filterOrders = (orders: OrderWithDetails[]) => {
    if (!searchTerm) return orders
    const term = searchTerm.toLowerCase()
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.client?.full_name?.toLowerCase().includes(term) ||
        order.service_type?.toLowerCase().includes(term) ||
        order.description?.toLowerCase().includes(term) ||
        order.solution?.toLowerCase().includes(term),
    )
  }

  const filterRequests = (requests: InventoryRequest[]) => {
    if (!searchTerm) return requests
    const term = searchTerm.toLowerCase()
    return requests.filter(
      (request) =>
        request.part?.name?.toLowerCase().includes(term) ||
        request.part?.part_number?.toLowerCase().includes(term) ||
        request.reason?.toLowerCase().includes(term) ||
        request.notes?.toLowerCase().includes(term),
    )
  }

  if (loading) {
    return (
      <TechnicianLayout
        userInfo={{
          name: profile?.full_name || "",
          email: profile?.email || "",
          role: profile?.role || "",
        }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Cargando historial...</div>
        </div>
      </TechnicianLayout>
    )
  }

  return (
    <TechnicianLayout
      userInfo={{
        name: profile?.full_name || "",
        email: profile?.email || "",
        role: profile?.role || "",
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Historial de Actividades</h1>
            <p className="text-muted-foreground">Revisa tu historial de órdenes y solicitudes</p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar en historial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-auto">
            <TabsTrigger value="orders" className="flex items-center gap-2 text-xs sm:text-sm p-2 sm:p-3">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Órdenes Completadas</span>
                <span className="sm:hidden">Órdenes</span>
                <span className="ml-1">({completedOrders.length})</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2 text-xs sm:text-sm p-2 sm:p-3">
              <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Solicitudes de Partes</span>
                <span className="sm:hidden">Solicitudes</span>
                <span className="ml-1">({inventoryRequests.length})</span>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {filterOrders(completedOrders).length > 0 ? (
              <div className="grid gap-4">
                {filterOrders(completedOrders).map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg truncate">Orden #{order.id.slice(-8)}</CardTitle>
                          <CardDescription className="text-sm break-words">
                            <span className="block sm:inline">Cliente: {order.client?.full_name}</span>
                            <span className="hidden sm:inline"> • </span>
                            <span className="block sm:inline">{order.service_type}</span>
                          </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                          <Badge {...getStatusBadge(order.status)} className="text-xs">
                            {getStatusBadge(order.status).label}
                          </Badge>
                          <Badge {...getPriorityBadge(order.priority)} className="text-xs">
                            {getPriorityBadge(order.priority).label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <p className="text-sm break-words">{order.description}</p>
                        {order.solution && (
                          <p className="text-sm text-muted-foreground break-words">
                            <strong>Solución:</strong> {order.solution}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">
                              Completada:{" "}
                              {order.completed_date
                                ? format(new Date(order.completed_date), "dd/MM/yyyy", { locale: es })
                                : "N/A"}
                            </span>
                          </span>
                          {order.final_cost && (
                            <span className="truncate">Costo: ${order.final_cost.toLocaleString()}</span>
                          )}
                          {order.commission_total && (
                            <span className="truncate">Comisión: ${order.commission_total.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No se encontraron órdenes que coincidan con tu búsqueda"
                      : "No tienes órdenes completadas aún"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {filterRequests(inventoryRequests).length > 0 ? (
              <div className="grid gap-4">
                {filterRequests(inventoryRequests).map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg truncate">{request.part?.name}</CardTitle>
                          <CardDescription className="text-sm break-words">
                            <span className="block sm:inline">Código: {request.part?.part_number}</span>
                            <span className="hidden sm:inline"> • </span>
                            <span className="block sm:inline">Cantidad: {request.quantity}</span>
                          </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                          <Badge {...getStatusBadge(request.status)} className="text-xs">
                            {getStatusBadge(request.status).label}
                          </Badge>
                          <Badge {...getPriorityBadge(request.priority)} className="text-xs">
                            {getPriorityBadge(request.priority).label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <p className="text-sm break-words">{request.reason}</p>
                        {request.notes && (
                          <p className="text-sm text-muted-foreground break-words">
                            <strong>Notas:</strong> {request.notes}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">
                              Solicitada: {format(new Date(request.created_at), "dd/MM/yyyy", { locale: es })}
                            </span>
                          </span>
                          {request.approved_at && (
                            <span className="truncate">
                              Aprobada: {format(new Date(request.approved_at), "dd/MM/yyyy", { locale: es })}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No se encontraron solicitudes que coincidan con tu búsqueda"
                      : "No has realizado solicitudes de partes"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TechnicianLayout>
  )
}
