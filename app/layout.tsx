import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "GusLaya Servicio Técnico - Sistema de Gestión Técnica",
  description: "Sistema profesional de gestión de servicios técnicos para GusLaya",
  generator: "v0.app",
  icons: {
    icon: "/gusLayaLogo.jpg",
    apple: "/gusLayaLogo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="fixtec-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
