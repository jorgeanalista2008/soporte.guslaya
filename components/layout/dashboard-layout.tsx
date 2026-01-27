import type React from "react"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  sidebarItems: Array<{
    title: string
    href: string
    icon: React.ReactNode
  }>
  userInfo: {
    name: string
    email: string
    role: string
  }
}

export function DashboardLayout({ children, sidebarItems, userInfo }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background font-sans">
      <Sidebar items={sidebarItems} userInfo={userInfo} />
      <main className="flex-1 overflow-hidden bg-background">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto max-w-full p-4 md:p-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
