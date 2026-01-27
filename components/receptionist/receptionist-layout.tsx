"use client"

import type React from "react"
import { ReceptionistSidebar } from "./receptionist-sidebar"

interface ReceptionistLayoutProps {
  children: React.ReactNode
  userInfo: {
    name: string
    email: string
    role: string
  }
}

export function ReceptionistLayout({ children, userInfo }: ReceptionistLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <ReceptionistSidebar userInfo={userInfo} />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto max-w-full p-4 md:p-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
