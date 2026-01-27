import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import { ReceptionistLayout } from "@/components/receptionist/receptionist-layout"
import { ReceptionistInventoryClient } from "./inventory-client"

export default async function ReceptionistInventory() {
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

  // Get inventory parts with categories (read-only for receptionist)
  const { data: inventoryParts } = await supabase
    .from("inventory_parts")
    .select(`
      *,
      category:inventory_categories(name)
    `)
    .eq("status", "active")
    .order("name")

  // Get categories
  const { data: categories } = await supabase.from("inventory_categories").select("*").order("name")

  // Get receptionist's own requests
  const { data: inventoryRequests } = await supabase
    .from("inventory_requests")
    .select(`
      *,
      part:inventory_parts(name, part_number, stock_quantity),
      requested_by:profiles!inventory_requests_requested_by_fkey(full_name, email),
      reviewed_by:profiles!inventory_requests_reviewed_by_fkey(full_name)
    `)
    .eq("requested_by", user.id)
    .order("created_at", { ascending: false })

  return (
    <RoleGuard allowedRoles={["receptionist"]}>
      <ReceptionistLayout
        userInfo={{
          name: profile.full_name,
          email: profile.email,
          role: profile.role,
        }}
      >
        <ReceptionistInventoryClient
          inventoryParts={inventoryParts || []}
          categories={categories || []}
          inventoryRequests={inventoryRequests || []}
          userId={user.id}
        />
      </ReceptionistLayout>
    </RoleGuard>
  )
}
