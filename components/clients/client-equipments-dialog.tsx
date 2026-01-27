"use client"

import { useState } from "react"
import { Plus, Monitor, Edit, Trash2, CheckCircle, Wrench, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NewEquipmentDialog } from "@/components/equipments/new-equipment-dialog"
import { EditEquipmentDialog } from "@/components/equipments/edit-equipment-dialog"
import { DeleteEquipmentDialog } from "@/components/equipments/delete-equipment-dialog"
import { useClientEquipments } from "@/hooks/use-client-equipments"

interface Equipment {
  id: string
  equipment_type: string
  brand: string
  model: string
  serial_number?: string
  status: string
  location?: string
  created_at: string
  equipment_components?: Array<{
    id: number
    component_type: string
    component_name: string
    specifications?: string
    quantity: number
  }>
}

interface Client {
  id: string
  full_name: string
  email: string
  company_name?: string
}

interface ClientEquipmentsDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ClientEquipmentsDialog({ client, open, onOpenChange, onSuccess }: ClientEquipmentsDialogProps) {
  const [showNewEquipmentDialog, setShowNewEquipmentDialog] = useState(false)
  const [showEditEquipmentDialog, setShowEditEquipmentDialog] = useState(false)
  const [showDeleteEquipmentDialog, setShowDeleteEquipmentDialog] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  const { equipments, loading, error, refetch } = useClientEquipments(client?.id)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: "Activo",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200",
      },
      maintenance: {
        label: "Mantenimiento",
        icon: Wrench,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      retired: {
        label: "Retirado",
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-200",
      },
      inactive: {
        label: "Inactivo",
        icon: XCircle,
        className: "bg-gray-100 text-gray-800 border-gray-200",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const handleEditEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setShowEditEquipmentDialog(true)
  }

  const handleDeleteEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setShowDeleteEquipmentDialog(true)
  }

  const handleEquipmentSuccess = () => {
    refetch()
    setShowNewEquipmentDialog(false)
    setShowEditEquipmentDialog(false)
    setShowDeleteEquipmentDialog(false)
    setSelectedEquipment(null)
  }

  if (!client) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Equipos de {client.full_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                    <p className="font-medium">{client.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  {client.company_name && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                      <p className="font-medium">{client.company_name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Equipos</p>
                    <p className="font-medium">{equipments?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{equipments?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Activos</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {equipments?.filter((e) => e.status === "active").length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mantenimiento</CardTitle>
                  <Wrench className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {equipments?.filter((e) => e.status === "maintenance").length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Retirados</CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {equipments?.filter((e) => e.status === "retired").length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Equipment List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lista de Equipos</CardTitle>
                  <Button onClick={() => setShowNewEquipmentDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Equipo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Cargando equipos...</div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-red-600">Error al cargar equipos: {error}</div>
                  </div>
                ) : equipments && equipments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Marca/Modelo</TableHead>
                        <TableHead>Serie</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Componentes</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipments.map((equipment) => (
                        <TableRow key={equipment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4 text-muted-foreground" />
                              {equipment.equipment_type}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{equipment.brand}</p>
                              <p className="text-sm text-muted-foreground">{equipment.model}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{equipment.serial_number || "N/A"}</span>
                          </TableCell>
                          <TableCell>{getStatusBadge(equipment.status)}</TableCell>
                          <TableCell>{equipment.location || "No especificada"}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {equipment.equipment_components?.length || 0} componentes
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditEquipment(equipment)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteEquipment(equipment)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Este cliente no tiene equipos registrados</p>
                    <Button onClick={() => setShowNewEquipmentDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Primer Equipo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Equipment Dialogs */}
      <NewEquipmentDialog
        open={showNewEquipmentDialog}
        onOpenChange={setShowNewEquipmentDialog}
        onSuccess={handleEquipmentSuccess}
        preselectedClient={client}
      />

      <EditEquipmentDialog
        equipment={selectedEquipment}
        open={showEditEquipmentDialog}
        onOpenChange={setShowEditEquipmentDialog}
        onSuccess={handleEquipmentSuccess}
      />

      <DeleteEquipmentDialog
        equipment={selectedEquipment}
        open={showDeleteEquipmentDialog}
        onOpenChange={setShowDeleteEquipmentDialog}
        onSuccess={handleEquipmentSuccess}
      />
    </>
  )
}
