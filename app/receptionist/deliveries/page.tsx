import { RoleGuard } from "@/components/auth/role-guard"
import { ReceptionistLayout } from "@/components/receptionist/receptionist-layout"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getReadyForDelivery, getDeliveredOrders } from "@/lib/services/receptionist-service"
import { Suspense } from "react"
import { Package, CheckCircle, TrendingUp } from "lucide-react"
import { DeliveriesClient } from "./deliveries-client"

function DeliveryStats({
  readyCount,
  deliveredToday,
  totalDelivered,
}: {
  readyCount: number
  deliveredToday: number
  totalDelivered: number
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Listos para Entrega</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{readyCount}</div>
          <p className="text-xs text-muted-foreground">Equipos completados</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entregados Hoy</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deliveredToday}</div>
          <p className="text-xs text-muted-foreground">Entregas completadas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Entregados</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDelivered}</div>
          <p className="text-xs text-muted-foreground">Este mes</p>
        </CardContent>
      </Card>
    </div>
  )
}

async function DeliveriesContent({ supabase }: { supabase: any }) {
  const readyForDelivery = await getReadyForDelivery(supabase)
  const deliveredOrders = await getDeliveredOrders(supabase)

  const deliveredToday = deliveredOrders.filter((order) => {
    const today = new Date().toDateString()
    return order.delivered_date && new Date(order.delivered_date).toDateString() === today
  }).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Entregas</h1>
        <p className="text-muted-foreground">Administra la entrega de equipos reparados</p>
      </div>

      <DeliveryStats
        readyCount={readyForDelivery.length}
        deliveredToday={deliveredToday}
        totalDelivered={deliveredOrders.length}
      />

      <DeliveriesClient readyForDelivery={readyForDelivery} deliveredOrders={deliveredOrders} />
    </div>
  )
}

export default async function DeliveriesPage() {
  const supabase = await createClient()

  if (!supabase) {
    console.error("[v0] Supabase client not available")
    redirect("/auth/login")
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

  return (
    <RoleGuard allowedRoles={["receptionist", "admin"]}>
      <ReceptionistLayout
        userInfo={{
          name: profile.full_name || "Recepcionista",
          email: profile.email || "",
          role: profile.role,
        }}
      >
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <DeliveriesContent supabase={supabase} />
        </Suspense>
      </ReceptionistLayout>
    </RoleGuard>
  )
}
