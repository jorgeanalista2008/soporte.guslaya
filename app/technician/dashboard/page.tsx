import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import TechnicianDashboardClient from "./dashboard-client"

export default async function TechnicianDashboard() {
  const supabase = await createClient()

  if (!supabase) {
    console.log("[v0] Supabase client creation failed")
    redirect("/auth/login")
    return
  }

  let user
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.log("[v0] Auth error:", userError.message)
      redirect("/auth/login")
      return
    }
    user = userData.user
  } catch (error) {
    console.log("[v0] Auth fetch failed:", error)
    redirect("/auth/login")
    return
  }

  if (!user) {
    console.log("[v0] No user found")
    redirect("/auth/login")
    return
  }

  let profile
  try {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.log("[v0] Profile fetch error:", profileError.message)
      // Try to create profile if it doesn't exist
      if (profileError.code === "PGRST116") {
        console.log("[v0] Profile not found, creating...")
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || user.email || "Usuario",
            role: "technician",
          })
          .select()
          .single()

        if (createError) {
          console.log("[v0] Profile creation failed:", createError.message)
          redirect("/auth/login")
          return
        }
        profile = newProfile
      } else {
        redirect("/auth/login")
        return
      }
    } else {
      profile = profileData
    }
  } catch (error) {
    console.log("[v0] Profile fetch failed:", error)
    redirect("/auth/login")
    return
  }

  if (!profile) {
    console.log("[v0] No profile found")
    redirect("/auth/login")
    return
  }

  let allMyOrders = []
  let activeOrders = []

  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from("service_orders")
      .select("*")
      .eq("technician_id", user.id)

    if (ordersError) {
      console.log("[v0] Orders fetch error:", ordersError.message)
    } else {
      allMyOrders = ordersData || []
    }

    const { data: activeOrdersData, error: activeError } = await supabase
      .from("service_orders")
      .select(`
        *,
        client:profiles!service_orders_client_id_fkey(full_name, email),
        equipment:equipments(equipment_type, brand, model),
        technician:profiles!service_orders_technician_id_fkey(id, full_name, email)
      `)
      .eq("technician_id", user.id)
      .in("status", ["received", "diagnosis", "repair", "testing", "waiting_parts"])
      .order("received_date", { ascending: false })
      .limit(5)

    if (activeError) {
      console.log("[v0] Active orders fetch error:", activeError.message)
    } else {
      activeOrders = activeOrdersData || []
    }
  } catch (error) {
    console.log("[v0] Orders fetch failed:", error)
    // Continue with empty arrays as fallback
  }

  console.log("[v0] User ID:", user.id)
  console.log("[v0] Profile found:", profile)
  console.log("[v0] Orders found:", allMyOrders?.length || 0)
  console.log("[v0] Active orders found:", activeOrders?.length || 0)

  const totalAssigned = allMyOrders?.length || 0
  const inProgress = allMyOrders?.filter((o) => ["diagnosis", "repair", "testing"].includes(o.status)).length || 0
  const completed = allMyOrders?.filter((o) => o.status === "completed").length || 0
  const pending = allMyOrders?.filter((o) => o.status === "received").length || 0

  const today = new Date().toISOString().split("T")[0]
  const completedToday =
    allMyOrders?.filter((o) => o.status === "completed" && o.completed_date && o.completed_date.startsWith(today))
      .length || 0

  const recentOrders = activeOrders || []

  return (
    <RoleGuard allowedRoles={["technician"]}>
      <TechnicianDashboardClient
        profile={profile}
        allMyOrders={allMyOrders}
        activeOrders={activeOrders}
        stats={{
          totalAssigned,
          completedToday,
          inProgress,
          pending,
        }}
      />
    </RoleGuard>
  )
}
