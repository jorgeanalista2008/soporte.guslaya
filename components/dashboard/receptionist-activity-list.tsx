import { Clock, Plus, CheckCircle, Truck, Bell, User } from "lucide-react"

export interface ReceptionistActivityItem {
  id: string
  type: "new_order" | "delivery_ready" | "client_inquiry" | "order_completed" | "payment_received" | "client_registered"
  message: string
  time: string
  priority?: "high" | "medium" | "low"
  orderId?: string
  clientId?: string
}

interface ReceptionistActivityListProps {
  activities: ReceptionistActivityItem[]
}

export function ReceptionistActivityList({ activities }: ReceptionistActivityListProps) {
  const getActivityIcon = (type: string) => {
    const icons = {
      new_order: <Plus className="w-4 h-4" />,
      delivery_ready: <Truck className="w-4 h-4" />,
      client_inquiry: <Bell className="w-4 h-4" />,
      order_completed: <CheckCircle className="w-4 h-4" />,
      payment_received: <CheckCircle className="w-4 h-4" />,
      client_registered: <User className="w-4 h-4" />,
    }
    return icons[type as keyof typeof icons] || <Clock className="w-4 h-4" />
  }

  const getActivityColor = (type: string, priority?: string) => {
    if (priority === "high") return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
    if (priority === "medium") return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"

    const colors = {
      new_order: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      delivery_ready: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      client_inquiry: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      order_completed: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      payment_received: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      client_registered: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
  }

  const getPriorityIndicator = (priority?: string) => {
    if (!priority || priority === "low") return null

    return <div className={`w-2 h-2 rounded-full ${priority === "high" ? "bg-red-500" : "bg-yellow-500"}`} />
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">Actividad Reciente</h2>
          <span className="text-sm text-muted-foreground">{activities.length} eventos</span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No hay actividad reciente</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type, activity.priority)}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-card-foreground">{activity.message}</p>
                    {getPriorityIndicator(activity.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
