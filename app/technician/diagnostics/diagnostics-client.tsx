"use client"

import { useState } from "react"
import { TechnicianLayout } from "@/components/technician/technician-layout"

export default function TechnicianDiagnosticsClient() {
  const [profile, setProfile] = useState<any>(null)

  return (
    <TechnicianLayout
      userInfo={{
        name: profile?.full_name || "",
        email: profile?.email || "",
        role: profile?.role || "",
      }}
    >
      <div className="space-y-6"></div>
    </TechnicianLayout>
  )
}
