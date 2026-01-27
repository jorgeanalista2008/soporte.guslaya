import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Get user profile to determine role-based redirect
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile) {
      switch (profile.role) {
        case "admin":
          redirect("/admin/dashboard")
        case "technician":
          redirect("/technician/dashboard")
        case "receptionist":
          redirect("/receptionist/dashboard")
        case "client":
          redirect("/client/dashboard")
        default:
          redirect("/auth/login")
      }
    }
  }

  redirect("/auth/login")
}
