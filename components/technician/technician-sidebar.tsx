"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { LayoutDashboard, ClipboardList, Package, History } from "lucide-react"

const technicianSidebarItems = [
  {
    title: "Dashboard",
    href: "/technician/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Mis Órdenes",
    href: "/technician/orders",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    title: "Inventario",
    href: "/technician/inventory",
    icon: <Package className="w-5 h-5" />,
  },
  {
    title: "Historial",
    href: "/technician/history",
    icon: <History className="w-5 h-5" />,
  },
]

interface TechnicianSidebarProps {
  userInfo: {
    name: string
    email: string
    role: string
  }
}

export function TechnicianSidebar({ userInfo }: TechnicianSidebarProps) {
  return <Sidebar items={technicianSidebarItems} userInfo={userInfo} />
}
