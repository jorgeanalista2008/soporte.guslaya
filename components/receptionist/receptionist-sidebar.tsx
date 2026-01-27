"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { LayoutDashboard, Users, FileText, Truck, Plus, Package } from "lucide-react"

const receptionistSidebarItems = [
  {
    title: "Dashboard",
    href: "/receptionist/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Nueva Orden",
    href: "/receptionist/new-order",
    icon: <Plus className="w-5 h-5" />,
  },
  {
    title: "Gestión de Órdenes",
    href: "/receptionist/orders",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Gestión de Clientes",
    href: "/receptionist/clients",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Inventario",
    href: "/receptionist/inventory",
    icon: <Package className="w-5 h-5" />,
  },
  {
    title: "Entregas",
    href: "/receptionist/deliveries",
    icon: <Truck className="w-5 h-5" />,
  },
  // {
  //   title: "Notificaciones",
  //   href: "/receptionist/notifications",
  //   icon: <Bell className="w-5 h-5" />,
  // },
]

interface ReceptionistSidebarProps {
  userInfo: {
    name: string
    email: string
    role: string
  }
}

export function ReceptionistSidebar({ userInfo }: ReceptionistSidebarProps) {
  return <Sidebar items={receptionistSidebarItems} userInfo={userInfo} />
}
