"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/auth/logout-button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Image from "next/image"
import { UserProfileDialog } from "@/components/client/user-profile-dialog"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
}

interface SidebarProps {
  items: SidebarItem[]
  userInfo: {
    name: string
    email: string
    role: string
  }
}

export function Sidebar({ items, userInfo }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState))
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-background border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border relative">
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center hover:bg-accent z-10"
        >
          <svg
            className={cn("w-3 h-3 text-muted-foreground transition-transform", isCollapsed && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="w-10 h-10 relative flex-shrink-0">
          <Image
            src="/gusLayaLogo.jpg"
            alt="GusLaya Logo"
            fill
            className="object-contain rounded-lg filter brightness-110 contrast-90 grayscale-[0.2]"
          />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="font-bold text-foreground">GusLaya</h1>
            <p className="text-xs text-muted-foreground capitalize">{userInfo.role}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground border border-border"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isCollapsed && "justify-center",
            )}
            title={isCollapsed ? item.title : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!isCollapsed && item.title}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <ThemeToggle isCollapsed={isCollapsed} />
      </div>

      <div className="border-t border-border p-4">
        <div className={cn("flex items-center gap-3 mb-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-muted-foreground">{userInfo.name.charAt(0).toUpperCase()}</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => setShowProfileDialog(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Perfil
            </Button>
            <LogoutButton variant="outline" size="sm" className="flex-1" />
          </div>
        )}
      </div>

      <UserProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        userInfo={userInfo}
        onUpdate={() => {
          window.location.reload()
        }}
      />
    </div>
  )
}
