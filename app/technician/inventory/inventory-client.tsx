"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { TechnicianLayout } from "@/components/technician/technician-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, AlertTriangle, Plus, Clock, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { InventoryPart, Profile } from "@/types"

interface InventoryRequest {
  id: string
  part_id: string
  status: "pending" | "approved" | "rejected" | "fulfilled" | "cancelled"
  quantity: number
  priority: string
  requested_at: string
}

export default function TechnicianInventoryClient() {
  const [parts, setParts] = useState<InventoryPart[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userRequests, setUserRequests] = useState<InventoryRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState<InventoryPart | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [requestForm, setRequestForm] = useState({
    quantity: 1,
    priority: "normal" as const,
    reason: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (profileError) {
            console.error("Error fetching profile:", profileError)
            toast({
              title: "Error",
              description: "No se pudo cargar el perfil del usuario",
              variant: "destructive",
            })
          } else {
            setProfile(profileData)

            const { data: requestsData, error: requestsError } = await supabase
              .from("inventory_requests")
              .select("id, part_id, status, quantity, priority, requested_at")
              .eq("requested_by", user.id)
              .in("status", ["pending", "approved"])

            if (requestsError) {
              console.error("Error fetching requests:", requestsError)
            } else {
              setUserRequests(requestsData || [])
            }
          }
        }

        const { data: partsData, error: partsError } = await supabase
          .from("inventory_parts")
          .select(`
            *,
            category:inventory_categories(name)
          `)
          .eq("status", "active")
          .order("name")

        if (partsError) {
          console.error("Error fetching parts:", partsError)
          toast({
            title: "Error",
            description: "No se pudo cargar el inventario",
            variant: "destructive",
          })
        } else {
          setParts(partsData || [])
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error inesperado",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleRequestPart = async () => {
    if (!selectedPart || !profile || submitting) return

    setSubmitting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("inventory_requests").insert({
        part_id: selectedPart.id,
        requested_by: profile.id,
        quantity: requestForm.quantity,
        priority: requestForm.priority,
        reason: requestForm.reason,
        status: "pending",
      })

      if (error) {
        console.error("Error creating request:", error)
        toast({
          title: "Error",
          description: "No se pudo enviar la solicitud. Intenta nuevamente.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Solicitud enviada",
          description: `Se ha solicitado ${requestForm.quantity} unidad(es) de ${selectedPart.name}`,
        })
        setRequestDialogOpen(false)
        setRequestForm({ quantity: 1, priority: "normal", reason: "" })
        setSelectedPart(null)

        const { data: updatedRequests } = await supabase
          .from("inventory_requests")
          .select("id, part_id, status, quantity, priority, requested_at")
          .eq("requested_by", profile.id)
          .in("status", ["pending", "approved"])

        if (updatedRequests) {
          setUserRequests(updatedRequests)
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getPartRequestStatus = (partId: string) => {
    const requests = userRequests.filter((req) => req.part_id === partId)
    const hasRequested = requests.length > 0
    const hasApproved = requests.some((req) => req.status === "approved")
    const hasPending = requests.some((req) => req.status === "pending")

    return { hasRequested, hasApproved, hasPending }
  }

  const filteredParts = parts.filter(
    (part) =>
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <TechnicianLayout
        userInfo={{
          name: profile?.full_name || "",
          email: profile?.email || "",
          role: profile?.role || "",
        }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Cargando inventario...</div>
        </div>
      </TechnicianLayout>
    )
  }

  return (
    <TechnicianLayout
      userInfo={{
        name: profile?.full_name || "",
        email: profile?.email || "",
        role: profile?.role || "",
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventario de Partes</h1>
            <p className="text-muted-foreground">Consulta disponibilidad y solicita partes necesarias</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, código o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {searchTerm && (
          <div className="text-sm text-muted-foreground">
            {filteredParts.length} parte(s) encontrada(s) para "{searchTerm}"
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParts.map((part) => {
            const { hasRequested, hasApproved, hasPending } = getPartRequestStatus(part.id)

            return (
              <Card key={part.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{part.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {part.part_number} • {part.brand}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={part.stock_quantity <= part.min_stock_level ? "destructive" : "secondary"}>
                        {part.category?.name}
                      </Badge>
                      {hasPending && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Solicitado
                        </Badge>
                      )}
                      {hasApproved && (
                        <Badge variant="default" className="text-xs flex items-center gap-1 bg-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Aprobado
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Stock: {part.stock_quantity}</span>
                    </div>
                    {part.stock_quantity <= part.min_stock_level && (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs">Stock bajo</span>
                      </div>
                    )}
                  </div>

                  {part.description && <p className="text-sm text-muted-foreground">{part.description}</p>}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ubicación: {part.location || "No especificada"}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPart(part)
                        setRequestDialogOpen(true)
                      }}
                      disabled={part.stock_quantity === 0}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Solicitar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredParts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No se encontraron partes que coincidan con tu búsqueda" : "No hay partes disponibles"}
              </p>
            </CardContent>
          </Card>
        )}

        <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Parte</DialogTitle>
              <DialogDescription>Solicita {selectedPart?.name} del inventario</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedPart?.stock_quantity || 1}
                  value={requestForm.quantity}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))
                  }
                />
                <p className="text-xs text-muted-foreground">Stock disponible: {selectedPart?.stock_quantity || 0}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={requestForm.priority}
                  onValueChange={(value: any) => setRequestForm((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo de la solicitud *</Label>
                <Textarea
                  id="reason"
                  placeholder="Describe para qué necesitas esta parte..."
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm((prev) => ({ ...prev, reason: e.target.value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestDialogOpen(false)} disabled={submitting}>
                Cancelar
              </Button>
              <Button onClick={handleRequestPart} disabled={!requestForm.reason.trim() || submitting}>
                {submitting ? "Enviando..." : "Enviar Solicitud"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TechnicianLayout>
  )
}
