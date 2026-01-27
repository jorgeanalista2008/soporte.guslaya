"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  isCollapsed?: boolean
}

export function ThemeToggle({ isCollapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-9 w-9 px-0", isCollapsed ? "w-9" : "w-full justify-start gap-2")}
      >
        <div className="h-4 w-4" />
        {!isCollapsed && <span>Tema</span>}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "h-9 px-0 hover:bg-accent hover:text-accent-foreground",
        isCollapsed ? "w-9" : "w-full justify-start gap-2",
      )}
      title={isCollapsed ? (theme === "light" ? "Modo oscuro" : "Modo claro") : undefined}
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      {!isCollapsed && <span>{theme === "light" ? "Modo oscuro" : "Modo claro"}</span>}
    </Button>
  )
}
