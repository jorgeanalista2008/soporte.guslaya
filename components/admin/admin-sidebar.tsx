"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { LayoutDashboard, Users, FileText, BarChart3, UserCog, Monitor, Package } from "lucide-react"

const adminSidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Gestión de Clientes",
    href: "/admin/clients",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Gestión de Equipos",
    href: "/admin/equipments",
    icon: <Monitor className="w-5 h-5" />,
  },
  {
    title: "Inventario",
    href: "/admin/inventory",
    icon: <Package className="w-5 h-5" />,
  },
  {
    title: "Todas las Órdenes",
    href: "/admin/orders",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Reportes",
    href: "/admin/reports",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    title: "Gestión de Usuarios",
    href: "/admin/users",
    icon: <UserCog className="w-5 h-5" />,
  },
]

interface AdminSidebarProps {
  userInfo: {
    name: string
    email: string
    role: string
  }
}

export function AdminSidebar({ userInfo }: AdminSidebarProps) {
  return <Sidebar items={adminSidebarItems} userInfo={userInfo} />
}
