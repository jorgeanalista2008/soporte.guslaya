import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import { ReceptionistLayout } from "@/components/receptionist/receptionist-layout"
import Link from "next/link"

export default async function ReceptionistIndex() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "receptionist") {
    redirect("/unauthorized")
  }

  const receptionistItems = [
    {
      title: "Dashboard",
      href: "/receptionist/dashboard",
      description: "Vista general con estadísticas y actividad reciente del día",
    },
    {
      title: "Nueva Orden",
      href: "/receptionist/new-order",
      description: "Crear nueva orden de servicio para un cliente",
    },
    {
      title: "Gestión de Órdenes",
      href: "/receptionist/orders",
      description: "Ver y gestionar todas las órdenes de servicio",
    },
    {
      title: "Gestión de Clientes",
      href: "/receptionist/clients",
      description: "Administrar información de clientes y su historial",
    },
    {
      title: "Entregas",
      href: "/receptionist/deliveries",
      description: "Controlar equipos listos para entrega y gestionar entregas",
    },
    {
      title: "Notificaciones",
      href: "/receptionist/notifications",
      description: "Centro de notificaciones y alertas del sistema",
    },
  ]

  return (
    <RoleGuard allowedRoles={["receptionist"]}>
      <ReceptionistLayout
        userInfo={{
          name: profile.full_name || "Recepcionista",
          email: profile.email || "",
          role: profile.role,
        }}
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel de Recepcionista</h1>
            <p className="text-muted-foreground">Selecciona una funcionalidad para comenzar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receptionistItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-border"
              >
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>Acceder</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Funcionalidades del Recepcionista
            </h2>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Recepción y creación de nuevas órdenes de servicio</li>
              <li>• Gestión completa del ciclo de vida de las órdenes</li>
              <li>• Administración de la base de datos de clientes</li>
              <li>• Control de entregas y notificaciones a clientes</li>
              <li>• Seguimiento de estadísticas y métricas diarias</li>
              <li>• Centro de notificaciones y alertas del sistema</li>
            </ul>
          </div>
        </div>
      </ReceptionistLayout>
    </RoleGuard>
  )
}
