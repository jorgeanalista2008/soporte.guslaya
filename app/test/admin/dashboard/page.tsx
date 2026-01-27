import { AdminDashboardLayout } from "@/components/dashboard/admin-dashboard-layout"
import { mockAdminData, testAdminSidebarItems } from "@/lib/data/mock-admin-data"

export default function TestAdminDashboard() {
  return (
    <AdminDashboardLayout
      userInfo={mockAdminData.user}
      sidebarItems={testAdminSidebarItems}
      stats={mockAdminData.stats}
      recentActivity={mockAdminData.recentActivity}
    />
  )
}
