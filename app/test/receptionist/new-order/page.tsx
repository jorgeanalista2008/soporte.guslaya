"use client"

import type React from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const receptionistSidebarItems = [
  {
    title: "Dashboard",
    href: "/test/receptionist/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Nueva Orden",
    href: "/test/receptionist/new-order",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    title: "Órdenes",
    href: "/test/receptionist/orders",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Entregas",
    href: "/test/receptionist/deliveries",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
  {
    title: "Notificaciones",
    href: "/test/receptionist/notifications",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-5 5v-5zM11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
      </svg>
    ),
  },
  {
    title: "Clientes",
    href: "/test/receptionist/clients",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
]

export default function TestNewOrderPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Orden creada exitosamente (Demo)")
  }

  return (
    <DashboardLayout
      sidebarItems={receptionistSidebarItems}
      userInfo={{
        name: "Recepcionista Demo",
        email: "recepcion@techservice.com",
        role: "receptionist",
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nueva Orden de Servicio</h1>
            <p className="text-gray-600">Registra un nuevo equipo para servicio técnico</p>
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Modo Demo</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información del Cliente</h3>

                <div>
                  <Label htmlFor="clientName">Nombre Completo</Label>
                  <Input id="clientName" placeholder="Ej: Juan Pérez" defaultValue="María González" />
                </div>

                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="cliente@email.com"
                    defaultValue="maria.gonzalez@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="clientPhone">Teléfono</Label>
                  <Input id="clientPhone" placeholder="Ej: +1234567890" defaultValue="+1234567890" />
                </div>
              </div>

              {/* Device Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información del Equipo</h3>

                <div>
                  <Label htmlFor="deviceType">Tipo de Equipo</Label>
                  <Select defaultValue="laptop">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="desktop">PC de Escritorio</SelectItem>
                      <SelectItem value="phone">Teléfono</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" placeholder="Ej: HP, Dell, Apple" defaultValue="HP" />
                </div>

                <div>
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" placeholder="Ej: Pavilion 15" defaultValue="Pavilion 15-dk1000" />
                </div>

                <div>
                  <Label htmlFor="serialNumber">Número de Serie</Label>
                  <Input id="serialNumber" placeholder="Número de serie del equipo" defaultValue="HP123456789" />
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Descripción del Problema</h3>

              <div>
                <Label htmlFor="problemDescription">Descripción Detallada</Label>
                <Textarea
                  id="problemDescription"
                  placeholder="Describe el problema reportado por el cliente..."
                  rows={4}
                  defaultValue="La laptop no enciende. El cliente reporta que dejó de funcionar después de una actualización de Windows."
                />
              </div>

              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>

              <div>
                <Label htmlFor="accessories">Accesorios Incluidos</Label>
                <Textarea
                  id="accessories"
                  placeholder="Lista de accesorios entregados con el equipo..."
                  rows={2}
                  defaultValue="Cargador original, mouse inalámbrico"
                />
              </div>

              <div>
                <Label htmlFor="estimatedCost">Costo Estimado</Label>
                <Input id="estimatedCost" type="number" placeholder="0.00" defaultValue="150.00" />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit">Crear Orden</Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
