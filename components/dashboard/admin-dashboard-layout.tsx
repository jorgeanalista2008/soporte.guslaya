import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { AdminDashboardStats } from "./admin-dashboard-stats"
import { RecentActivityList, type ActivityItem } from "./recent-activity-list"

interface AdminDashboardLayoutProps {
  userInfo: {
    name: string
    email: string
    role: string
  }
  sidebarItems: Array<{
    title: string
    href: string
    icon: React.ReactNode
  }>
  stats: Array<{
    label: string
    value: number
  }>
  recentActivity: ActivityItem[]
}

export function AdminDashboardLayout({ userInfo, sidebarItems, stats, recentActivity }: AdminDashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar items={sidebarItems} userInfo={userInfo} />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
              <p className="text-muted-foreground">Vista general del sistema de servicio técnico</p>
            </div>

            <AdminDashboardStats stats={stats} />

            <RecentActivityList activities={recentActivity} />
          </div>
        </div>
      </div>
    </div>
  )
}
