import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { InventoryClient } from "./inventory-client"

export default async function AdminInventory() {
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

  // Get inventory parts with categories and recent transactions
  const { data: inventoryParts } = await supabase
    .from("inventory_parts")
    .select(`
      *,
      category:inventory_categories(name)
    `)
    .order("name")

  // Get categories
  const { data: categories } = await supabase.from("inventory_categories").select("*").order("name")

  const { data: inventoryRequests } = await supabase
    .from("inventory_requests")
    .select(`
      *,
      part:inventory_parts(name, part_number, stock_quantity),
      requested_by:profiles!inventory_requests_requested_by_fkey(full_name, email),
      reviewed_by:profiles!inventory_requests_reviewed_by_fkey(full_name)
    `)
    .order("created_at", { ascending: false })

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from("inventory_transactions")
    .select(`
      *,
      part:inventory_parts(name, part_number),
      performed_by:profiles(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminLayout
        userInfo={{
          name: profile.full_name,
          email: profile.email,
          role: profile.role,
        }}
      >
        <InventoryClient
          inventoryParts={inventoryParts || []}
          categories={categories || []}
          inventoryRequests={inventoryRequests || []}
          recentTransactions={recentTransactions || []}
        />
      </AdminLayout>
    </RoleGuard>
  )
}
