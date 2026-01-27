"use client"

import type React from "react"
import { TechnicianSidebar } from "./technician-sidebar"

interface TechnicianLayoutProps {
  children: React.ReactNode
  userInfo: {
    name: string
    email: string
    role: string
  }
}

export function TechnicianLayout({ children, userInfo }: TechnicianLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <TechnicianSidebar userInfo={userInfo} />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto max-w-full p-4 md:p-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
