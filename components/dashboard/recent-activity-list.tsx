"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardList, Users, Wrench, Package, UserCheck, User, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export interface ActivityItem {
  id: string
  type: string
  message: string
  time: string
  icon: string
}

interface RecentActivityListProps {
  activities: ActivityItem[]
  equipments?: any[]
  inventoryRequests?: any[]
  users?: any[]
}

export function RecentActivityList({
  activities,
  equipments = [],
  inventoryRequests = [],
  users = [],
}: RecentActivityListProps) {
  const [activeTab, setActiveTab] = useState("service_orders")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Hace menos de 1 minuto"
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`
  }

  const getActivityIcon = (type: string) => {
    const icons = {
      plus: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      check: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      "user-plus": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
          />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
      "dollar-sign": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      "log-in": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
      ),
      truck: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17a2 2 0 11-4 0 2 2 0 014 0 2 2 0 014 0m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    }
    return icons[type as keyof typeof icons] || icons.plus
  }

  const filterActivitiesByType = (type: string) => {
    switch (type) {
      case "service_orders":
        return activities.filter(
          (activity) => activity.type === "order" || activity.type === "payment" || activity.type === "delivery",
        )
      case "clients":
        return activities.filter((activity) => activity.type === "user" && activity.message.includes("cliente"))
      case "equipments":
        return activities.filter(
          (activity) => activity.type === "equipment" || activity.message.toLowerCase().includes("equipo"),
        )
      case "inventory":
        return activities.filter(
          (activity) =>
            activity.type === "inventory" ||
            activity.message.toLowerCase().includes("inventario") ||
            activity.message.toLowerCase().includes("repuesto"),
        )
      case "users":
        return activities.filter(
          (activity) =>
            activity.type === "login" || (activity.type === "user" && !activity.message.includes("cliente")),
        )
      default:
        return activities
    }
  }

  const renderActivityList = (filteredActivities: ActivityItem[]) => {
    if (filteredActivities.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay actividad reciente para mostrar</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.slice(0, 6).map((activity) => (
          <div key={activity.id} className="bg-muted/50 rounded-lg p-4 border hover:shadow-sm transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                {getActivityIcon(activity.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium leading-tight">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderEquipmentsList = () => {
    if (equipments.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay equipos registrados recientemente</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipments.map((equipment) => (
          <div key={equipment.id} className="bg-muted/50 rounded-lg p-4 border hover:shadow-sm transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-semibold leading-tight">{equipment.equipment_type}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {equipment.brand} {equipment.model}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{equipment.serial_number}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">
                    {equipment.client?.full_name || "No asignado"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(equipment.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderInventoryRequestsList = () => {
    if (inventoryRequests.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay requisiciones de inventario recientes</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventoryRequests.map((request) => (
          <div key={request.id} className="bg-muted/50 rounded-lg p-4 border hover:shadow-sm transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-semibold leading-tight">
                  {request.inventory_item?.name || "Artículo desconocido"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">Cant: {request.quantity}</span>
                  <Badge
                    variant={
                      request.status === "approved"
                        ? "default"
                        : request.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {request.status === "pending"
                      ? "Pendiente"
                      : request.status === "approved"
                        ? "Aprobada"
                        : request.status === "rejected"
                          ? "Rechazada"
                          : request.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">
                    {request.requested_by?.full_name || "Usuario desconocido"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(request.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderUsersList = () => {
    if (users.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay usuarios registrados recientemente</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-muted/50 rounded-lg p-4 border hover:shadow-sm transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-semibold leading-tight">{user.full_name}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {user.role === "admin"
                      ? "Administrador"
                      : user.role === "technician"
                        ? "Técnico"
                        : user.role === "receptionist"
                          ? "Recepcionista"
                          : user.role === "client"
                            ? "Cliente"
                            : user.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-foreground">Actividad Reciente</h2>
      </div>
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="service_orders" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Órdenes</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="equipments" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Equipos</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Inventario</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Usuarios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="service_orders" className="mt-6">
            {renderActivityList(filterActivitiesByType("service_orders"))}
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            {renderActivityList(filterActivitiesByType("clients"))}
          </TabsContent>

          <TabsContent value="equipments" className="mt-6">
            {renderEquipmentsList()}
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            {renderInventoryRequestsList()}
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            {renderUsersList()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
