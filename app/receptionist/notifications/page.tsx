import { RoleGuard } from "@/components/auth/role-guard"
import { ReceptionistLayout } from "@/components/receptionist/receptionist-layout"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { NotificationsClient } from "./notifications-client"

export default async function NotificationsPage() {
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

  if (!profile) {
    redirect("/auth/login")
  }

  const userInfo = {
    id: user.id,
    email: user.email || "",
    role: profile.role,
    name: profile.full_name || user.email || "",
  }

  return (
    <RoleGuard allowedRoles={["receptionist", "admin"]}>
      <ReceptionistLayout userInfo={userInfo}>
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
          <NotificationsClient userInfo={userInfo} />
        </Suspense>
      </ReceptionistLayout>
    </RoleGuard>
  )
}
