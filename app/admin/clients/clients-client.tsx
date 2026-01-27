"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ClientsTable } from "@/components/clients/clients-table"
import { ClientDetailsDialog } from "@/components/clients/client-details-dialog"
import { EditClientDialog } from "@/components/clients/edit-client-dialog"
import { DeleteClientDialog } from "@/components/clients/delete-client-dialog"
import { NewClientDialog } from "@/components/clients/new-client-dialog"

interface Client {
  id: string
  user_id: string
  full_name: string
  email: string
  phone?: string
  company_name?: string
  address?: string
  city?: string
  is_active: boolean
  created_at: string
  _count?: {
    service_orders: number
  }
}

interface ClientsPageClientProps {
  clients: Client[]
  stats: {
    total: number
    active: number
    inactive: number
    withOrders: number
    newThisMonth: number
  }
}

export function ClientsPageClient({ clients: initialClients, stats }: ClientsPageClientProps) {
  const [clients, setClients] = useState(initialClients)

  // Dialog states
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [selectedStatsCard, setSelectedStatsCard] = useState<number | null>(null)

  const handleClientClick = (client: Client) => {
    setSelectedClient(client)
    setShowDetailsDialog(true)
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setShowEditDialog(true)
  }

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client)
    setShowDeleteDialog(true)
  }

  const handleClientUpdated = (updatedClient: Client) => {
    setClients((prev) => prev.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
    setShowEditDialog(false)
    setSelectedClient(null)
  }

  const handleClientDeleted = (deletedClientId: string) => {
    setClients((prev) => prev.filter((client) => client.id !== deletedClientId))
    setShowDeleteDialog(false)
    setSelectedClient(null)
  }

  const handleClientCreated = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev])
    setShowNewDialog(false)
  }

  const statsIcons = [
    <svg key="total" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>,
    <svg key="active" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>,
    <svg key="inactive" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>,
    <svg key="orders" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m0 0v6m0-6h6m-6 0H6" />
    </svg>,
    <svg key="new" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H-6" />
    </svg>,
  ]

  const getRecentClientsByCategory = (category: string) => {
    const sortedClients = [...clients].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    switch (category) {
      case "total":
        return sortedClients.slice(0, 5)
      case "active":
        return sortedClients.filter((client) => client.is_active).slice(0, 5)
      case "inactive":
        return sortedClients.filter((client) => !client.is_active).slice(0, 5)
      case "withOrders":
        return sortedClients.filter((client) => (client._count?.service_orders || 0) > 0).slice(0, 5)
      case "newThisMonth":
        const now = new Date()
        return sortedClients
          .filter((client) => {
            const clientDate = new Date(client.created_at)
            return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear()
          })
          .slice(0, 5)
      default:
        return []
    }
  }

  const getStatsDialogContent = (index: number) => {
    const categories = ["total", "active", "inactive", "withOrders", "newThisMonth"]
    const titles = [
      "Total Clientes",
      "Clientes Activos",
      "Clientes Inactivos",
      "Clientes con Órdenes",
      "Nuevos Clientes (Este Mes)",
    ]
    const values = [stats.total, stats.active, stats.inactive, stats.withOrders, stats.newThisMonth]
    const colors = ["text-blue-600", "text-green-600", "text-red-600", "text-blue-600", "text-purple-600"]

    const recentClients = getRecentClientsByCategory(categories[index])

    return {
      title: titles[index],
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
              {statsIcons[index]}
            </div>
            <div>
              <p className={`text-2xl font-bold ${colors[index]}`}>{values[index]}</p>
              <p className="text-sm text-muted-foreground">{titles[index]}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Últimos 5 registros</h4>
            <div className="space-y-2">
              {recentClients.length > 0 ? (
                recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div>
                      <p className="font-medium">{client.full_name}</p>
                      <p className="text-muted-foreground">{client.email}</p>
                      {client.company_name && <p className="text-xs text-muted-foreground">{client.company_name}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(client.created_at).toLocaleDateString()}
                      </p>
                      {client._count?.service_orders !== undefined && (
                        <p className="text-xs text-muted-foreground">{client._count.service_orders} órdenes</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No hay registros disponibles</p>
              )}
            </div>
          </div>
        </div>
      ),
    }
  }

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gestión de Clientes</h1>
          <p className="text-muted-foreground">Administra información completa de todos los clientes</p>
        </div>
        <Button onClick={() => setShowNewDialog(true)} className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatsCard(0)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            {statsIcons[0]}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatsCard(1)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            {statsIcons[1]}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatsCard(2)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            {statsIcons[2]}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatsCard(3)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Órdenes</CardTitle>
            {statsIcons[3]}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.withOrders}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatsCard(4)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos (Este Mes)</CardTitle>
            {statsIcons[4]}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.newThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table with integrated filters */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full">
            <ClientsTable
              clients={clients}
              onClientClick={handleClientClick}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ClientDetailsDialog client={selectedClient} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />

      <EditClientDialog
        client={selectedClient}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleClientUpdated}
      />

      <DeleteClientDialog
        client={selectedClient}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={handleClientDeleted}
      />

      <NewClientDialog open={showNewDialog} onOpenChange={setShowNewDialog} onSuccess={handleClientCreated} />

      {/* Stats card dialog */}
      <Dialog open={selectedStatsCard !== null} onOpenChange={() => setSelectedStatsCard(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStatsCard !== null ? getStatsDialogContent(selectedStatsCard).title : ""}
            </DialogTitle>
          </DialogHeader>
          {selectedStatsCard !== null && getStatsDialogContent(selectedStatsCard).content}
        </DialogContent>
      </Dialog>
    </div>
  )
}
