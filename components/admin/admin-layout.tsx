"use client"

import type React from "react"
import { AdminSidebar } from "./admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  userInfo: {
    name: string
    email: string
    role: string
  }
}

export function AdminLayout({ children, userInfo }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar userInfo={userInfo} />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto max-w-full p-4 md:p-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
