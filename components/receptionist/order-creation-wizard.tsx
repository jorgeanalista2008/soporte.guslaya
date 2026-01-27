"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  UserPlus,
  Wrench,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Search,
  Monitor,
  Plus,
  Users,
  Info,
  Lightbulb,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { createUser, type CreateUserData } from "@/app/actions/create-user"

interface Client {
  id: string
  full_name: string
  email: string
  phone?: string
  company_name?: string
}

interface Equipment {
  id: string
  equipment_type: string
  brand: string
  model: string
  serial_number?: string
  status: string
  equipment_subtype?: string
}

interface Technician {
  id: string
  full_name: string
  email: string
}

interface OrderCreationWizardProps {
  isOpen: boolean
  onClose: () => void
  onOrderCreated?: (orderId: string) => void
}

type Step =
  | "client-type"
  | "client-selection"
  | "new-client"
  | "equipment-type"
  | "equipment-selection"
  | "new-equipment"
  | "order-details"
  | "technician-assignment"
  | "confirmation"

export function OrderCreationWizard({ isOpen, onClose, onOrderCreated }: OrderCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>("client-type")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Client data
  const [clientType, setClientType] = useState<"existing" | "new" | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [existingClients, setExistingClients] = useState<Client[]>([])
  const [clientSearch, setClientSearch] = useState("")

  // Equipment data
  const [equipmentType, setEquipmentType] = useState<"existing" | "new" | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [existingEquipments, setExistingEquipments] = useState<Equipment[]>([])

  const [selectedTechnician, setSelectedTechnician] = useState<string>("none")
  const [availableTechnicians, setAvailableTechnicians] = useState<Technician[]>([])

  // New client data
  const [newClientData, setNewClientData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    address: "",
    city: "",
  })

  // New equipment data
  const [newEquipmentData, setNewEquipmentData] = useState({
    equipment_type: "",
    brand: "",
    model: "",
    serial_number: "",
    equipment_subtype: "",
    device_condition: "",
    accessories: "",
  })

  // Order data
  const [orderData, setOrderData] = useState({
    problem_description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    estimated_cost: "",
    advance_payment: "",
    client_notes: "",
  })

  const loadTechnicians = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "technician")
        .eq("is_active", true)
        .order("full_name")

      if (error) throw error
      setAvailableTechnicians(data || [])
    } catch (error) {
      console.error("Error loading technicians:", error)
      toast.error("Error al cargar la lista de técnicos")
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadTechnicians()
    }
  }, [isOpen])

  const resetWizard = () => {
    setCurrentStep("client-type")
    setClientType(null)
    setSelectedClient(null)
    setEquipmentType(null)
    setSelectedEquipment(null)
    setSelectedTechnician("none") // Reset technician selection
    setErrors({})
    setNewClientData({
      full_name: "",
      email: "",
      phone: "",
      company_name: "",
      address: "",
      city: "",
    })
    setNewEquipmentData({
      equipment_type: "",
      brand: "",
      model: "",
      serial_number: "",
      equipment_subtype: "",
      device_condition: "",
      accessories: "",
    })
    setOrderData({
      problem_description: "",
      priority: "medium",
      estimated_cost: "",
      advance_payment: "",
      client_notes: "",
    })
  }

  const handleClose = () => {
    resetWizard()
    onClose()
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    if (!phone) return true // Phone is optional
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    switch (currentStep) {
      case "client-type":
        if (clientType === null) {
          newErrors.client_type = "Debes seleccionar un tipo de cliente para continuar"
        }
        break
      case "client-selection":
        if (!selectedClient) {
          newErrors.client_selection = "Debes seleccionar un cliente para continuar"
        }
        break
      case "new-client":
        if (!newClientData.full_name.trim()) {
          newErrors.full_name = "El nombre completo es obligatorio"
        } else if (newClientData.full_name.trim().length < 2) {
          newErrors.full_name = "El nombre debe tener al menos 2 caracteres"
        }
        if (!newClientData.email.trim()) {
          newErrors.email = "El correo electrónico es obligatorio"
        } else if (!validateEmail(newClientData.email)) {
          newErrors.email = "Por favor ingresa un correo electrónico válido (ejemplo: usuario@dominio.com)"
        }
        if (newClientData.phone && !validatePhone(newClientData.phone)) {
          newErrors.phone = "El teléfono debe tener un formato válido (ejemplo: +1234567890 o 1234567890)"
        }
        break
      case "equipment-type":
        if (equipmentType === null) {
          newErrors.equipment_type = "Debes seleccionar un tipo de equipo para continuar"
        }
        break
      case "equipment-selection":
        if (!selectedEquipment) {
          newErrors.equipment_selection = "Debes seleccionar un equipo para continuar"
        }
        break
      case "new-equipment":
        if (!newEquipmentData.equipment_type) {
          newErrors.equipment_type = "Debes seleccionar el tipo de equipo"
        }
        if (!newEquipmentData.brand.trim()) {
          newErrors.brand = "La marca del equipo es obligatoria"
        } else if (newEquipmentData.brand.trim().length < 2) {
          newErrors.brand = "La marca debe tener al menos 2 caracteres"
        }
        if (!newEquipmentData.model.trim()) {
          newErrors.model = "El modelo del equipo es obligatorio"
        } else if (newEquipmentData.model.trim().length < 2) {
          newErrors.model = "El modelo debe tener al menos 2 caracteres"
        }
        break
      case "order-details":
        if (!orderData.problem_description.trim()) {
          newErrors.problem_description = "La descripción del problema es obligatoria"
        } else if (orderData.problem_description.trim().length < 10) {
          newErrors.problem_description = "La descripción debe ser más detallada (mínimo 10 caracteres)"
        }
        if (orderData.estimated_cost && isNaN(Number(orderData.estimated_cost))) {
          newErrors.estimated_cost = "El costo estimado debe ser un número válido"
        } else if (orderData.estimated_cost && Number(orderData.estimated_cost) < 0) {
          newErrors.estimated_cost = "El costo estimado no puede ser negativo"
        }
        if (orderData.advance_payment && isNaN(Number(orderData.advance_payment))) {
          newErrors.advance_payment = "El anticipo debe ser un número válido"
        } else if (orderData.advance_payment && Number(orderData.advance_payment) < 0) {
          newErrors.advance_payment = "El anticipo no puede ser negativo"
        } else if (
          orderData.advance_payment &&
          orderData.estimated_cost &&
          Number(orderData.advance_payment) > Number(orderData.estimated_cost)
        ) {
          newErrors.advance_payment = "El anticipo no puede ser mayor al costo estimado"
        }
        break
      case "technician-assignment": // Validation for technician assignment step
        if (selectedTechnician === null) {
          newErrors.technician_assignment = "Debes seleccionar un técnico o elegir 'Sin asignar'"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const searchClients = async (query: string) => {
    if (!query.trim()) {
      setExistingClients([])
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          phone,
          clients(company_name)
        `)
        .eq("role", "client")
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(10)

      if (error) throw error

      const clients =
        data?.map((client) => ({
          id: client.id,
          full_name: client.full_name || "",
          email: client.email || "",
          phone: client.phone,
          company_name: client.clients?.[0]?.company_name,
        })) || []

      setExistingClients(clients)
    } catch (error) {
      console.error("Error searching clients:", error)
      toast.error("Error al buscar clientes")
    } finally {
      setIsLoading(false)
    }
  }

  const loadClientEquipments = async (clientId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("equipments")
        .select("*")
        .eq("assigned_to", clientId)
        .eq("status", "active")

      if (error) throw error

      setExistingEquipments(data || [])
    } catch (error) {
      console.error("Error loading client equipments:", error)
      toast.error("Error al cargar equipos del cliente")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedClient && currentStep === "equipment-type") {
      loadClientEquipments(selectedClient.id)
    }
  }, [selectedClient, currentStep])

  const createNewClient = async () => {
    if (!validateStep()) return

    setIsLoading(true)
    try {
      console.log("[v0] Creating new client using server action")

      const result = await createUser({
        fullName: newClientData.full_name,
        email: newClientData.email,
        phone: newClientData.phone || "",
        role: "client",
        password: Math.random().toString(36).slice(-8), // Generate random password
        isActive: true,
      } as CreateUserData)

      if (!result.success) {
        throw new Error(result.error || "Error al crear el cliente")
      }

      console.log("[v0] Client created successfully via server action:", result.userId)

      const supabase = createClient()
      if (newClientData.company_name || newClientData.address || newClientData.city) {
        const { error: clientError } = await supabase.from("clients").insert([
          {
            user_id: result.userId,
            company_name: newClientData.company_name,
            address: newClientData.address,
            city: newClientData.city,
          },
        ])

        if (clientError) {
          console.error("Error creating client details:", clientError)
          // Don't fail the entire process for client details error
        }
      }

      // Set the created client as selected
      setSelectedClient({
        id: result.userId || "",
        full_name: newClientData.full_name,
        email: newClientData.email,
        phone: newClientData.phone,
        company_name: newClientData.company_name,
      })

      toast.success("Cliente creado exitosamente")
      setCurrentStep("equipment-type")
    } catch (error: any) {
      console.error("Error creating client:", error)
      toast.error(error.message || "Error al crear el cliente")
    } finally {
      setIsLoading(false)
    }
  }

  const createOrder = async () => {
    if (!validateStep()) return
    if (!selectedClient) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      let equipmentId = selectedEquipment?.id

      // Create new equipment if needed
      if (equipmentType === "new") {
        console.log("[v0] Creating new equipment with data:", {
          equipment_type: newEquipmentData.equipment_type,
          brand: newEquipmentData.brand,
          model: newEquipmentData.model,
          serial_number: newEquipmentData.serial_number,
          equipment_subtype: newEquipmentData.equipment_subtype,
          assigned_to: selectedClient.id,
          status: "active",
        })

        const validTypes = ["Laptop", "PC", "Server"]
        if (!validTypes.includes(newEquipmentData.equipment_type)) {
          throw new Error(
            `Tipo de equipo inválido: ${newEquipmentData.equipment_type}. Debe ser uno de: ${validTypes.join(", ")}`,
          )
        }

        const { data: equipment, error: equipmentError } = await supabase
          .from("equipments")
          .insert([
            {
              equipment_type: newEquipmentData.equipment_type,
              brand: newEquipmentData.brand,
              model: newEquipmentData.model,
              serial_number: newEquipmentData.serial_number || null,
              equipment_subtype: newEquipmentData.equipment_subtype || null,
              assigned_to: selectedClient.id,
              status: "active",
            },
          ])
          .select()
          .single()

        if (equipmentError) {
          console.error("[v0] Equipment creation error:", equipmentError)
          throw equipmentError
        }

        console.log("[v0] Equipment created successfully:", equipment)
        equipmentId = equipment.id
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

      console.log("[v0] Creating order with data:", {
        order_number: orderNumber,
        client_id: selectedClient.id,
        equipment_id: equipmentId,
        technician_id: selectedTechnician === "none" ? null : selectedTechnician,
        device_condition: equipmentType === "new" ? newEquipmentData.device_condition : "",
        accessories: equipmentType === "new" ? newEquipmentData.accessories : "",
        problem_description: orderData.problem_description,
        priority: orderData.priority,
        estimated_cost: orderData.estimated_cost ? Number.parseFloat(orderData.estimated_cost) : null,
        advance_payment: orderData.advance_payment ? Number.parseFloat(orderData.advance_payment) : 0,
        client_notes: orderData.client_notes,
        status: "received",
      })

      // Create the service order
      const { data: order, error: orderError } = await supabase
        .from("service_orders")
        .insert([
          {
            order_number: orderNumber,
            client_id: selectedClient.id,
            equipment_id: equipmentId,
            technician_id: selectedTechnician === "none" ? null : selectedTechnician,
            device_condition: equipmentType === "new" ? newEquipmentData.device_condition : "",
            accessories: equipmentType === "new" ? newEquipmentData.accessories : "",
            problem_description: orderData.problem_description,
            priority: orderData.priority,
            estimated_cost: orderData.estimated_cost ? Number.parseFloat(orderData.estimated_cost) : null,
            advance_payment: orderData.advance_payment ? Number.parseFloat(orderData.advance_payment) : 0,
            client_notes: orderData.client_notes,
            status: "received",
          },
        ])
        .select()
        .single()

      if (orderError) {
        console.error("[v0] Order creation error:", orderError)
        throw orderError
      }

      console.log("[v0] Order created successfully:", order)
      toast.success(`¡Orden ${orderNumber} creada exitosamente!`)
      setCurrentStep("confirmation")

      if (onOrderCreated) {
        console.log("[v0] Triggering dashboard update callback")
        onOrderCreated(order.id)
      }
    } catch (error: any) {
      console.error("Error creating order:", error)
      toast.error(error.message || "Error al crear la orden. Por favor intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (!validateStep()) return

    switch (currentStep) {
      case "client-type":
        if (clientType === "existing") {
          setCurrentStep("client-selection")
        } else if (clientType === "new") {
          setCurrentStep("new-client")
        }
        break
      case "client-selection":
        if (selectedClient) {
          setCurrentStep("equipment-type")
        }
        break
      case "new-client":
        createNewClient()
        break
      case "equipment-type":
        if (equipmentType === "existing") {
          setCurrentStep("equipment-selection")
        } else if (equipmentType === "new") {
          setCurrentStep("new-equipment")
        }
        break
      case "equipment-selection":
        if (selectedEquipment) {
          setCurrentStep("order-details")
        }
        break
      case "new-equipment":
        setCurrentStep("order-details")
        break
      case "order-details":
        setCurrentStep("technician-assignment") // Go to technician assignment step
        break
      case "technician-assignment": // New step for technician assignment
        createOrder()
        break
    }
  }

  const prevStep = () => {
    switch (currentStep) {
      case "client-selection":
        setCurrentStep("client-type")
        break
      case "new-client":
        setCurrentStep("client-type")
        break
      case "equipment-type":
        setCurrentStep(clientType === "existing" ? "client-selection" : "new-client")
        break
      case "equipment-selection":
        setCurrentStep("equipment-type")
        break
      case "new-equipment":
        setCurrentStep("equipment-type")
        break
      case "order-details":
        if (equipmentType === "existing") {
          setCurrentStep("equipment-selection")
        } else if (equipmentType === "new") {
          setCurrentStep("new-equipment")
        } else {
          setCurrentStep("equipment-type")
        }
        break
      case "technician-assignment": // Handle previous step for technician assignment
        setCurrentStep("order-details")
        break
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "client-type":
        return clientType !== null
      case "client-selection":
        return selectedClient !== null
      case "new-client":
        return newClientData.full_name && newClientData.email && validateEmail(newClientData.email)
      case "equipment-type":
        return equipmentType !== null
      case "equipment-selection":
        return selectedEquipment !== null
      case "new-equipment":
        return newEquipmentData.equipment_type && newEquipmentData.brand && newEquipmentData.model
      case "order-details":
        return orderData.problem_description.trim() !== ""
      case "technician-assignment": // Technician assignment is optional
        return true
      default:
        return false
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case "client-type":
        return "Tipo de Cliente"
      case "client-selection":
        return "Seleccionar Cliente"
      case "new-client":
        return "Nuevo Cliente"
      case "equipment-type":
        return "Tipo de Equipo"
      case "equipment-selection":
        return "Seleccionar Equipo"
      case "new-equipment":
        return "Nuevo Equipo"
      case "order-details":
        return "Detalles de la Orden"
      case "technician-assignment": // New step title
        return "Asignar Técnico"
      case "confirmation":
        return "Orden Creada"
      default:
        return ""
    }
  }

  const getStepTips = () => {
    switch (currentStep) {
      case "client-type":
        return {
          icon: <Info className="w-4 h-4" />,
          title: "💡 Consejo",
          content:
            "Si el cliente ya está registrado, podrás ver su historial de órdenes y equipos. Si es nuevo, se creará automáticamente su perfil.",
        }
      case "client-selection":
        return {
          icon: <Search className="w-4 h-4" />,
          title: "🔍 Búsqueda",
          content:
            "Puedes buscar por nombre completo, email o número de teléfono. La búsqueda es instantánea y no distingue mayúsculas.",
        }
      case "new-client":
        return {
          icon: <UserPlus className="w-4 h-4" />,
          title: "📝 Datos del Cliente",
          content:
            "Solo el nombre y email son obligatorios. El teléfono y empresa son opcionales pero útiles para contacto futuro.",
        }
      case "equipment-type":
        return {
          icon: <Monitor className="w-4 h-4" />,
          title: "⚙️ Equipos",
          content:
            "Si el cliente tiene equipos registrados, aparecerán aquí. Los equipos nuevos se asociarán automáticamente al cliente.",
        }
      case "equipment-selection":
        return {
          icon: <Monitor className="w-4 h-4" />,
          title: "📋 Historial",
          content:
            "Selecciona el equipo específico para esta orden. Podrás ver el historial de reparaciones previas de este equipo.",
        }
      case "new-equipment":
        return {
          icon: <Plus className="w-4 h-4" />,
          title: "🔧 Registro de Equipo",
          content:
            "Usa el campo 'Subtipo' para especificar equipos como impresoras, monitores o tablets. Esto ayuda en la organización del inventario.",
        }
      case "order-details":
        return {
          icon: <Wrench className="w-4 h-4" />,
          title: "📋 Detalles Importantes",
          content:
            "Una descripción detallada del problema ayuda al técnico a prepararse mejor. El costo estimado es opcional pero útil para el cliente.",
        }
      case "technician-assignment":
        return {
          icon: <Users className="w-4 h-4" />,
          title: "👨‍🔧 Asignación",
          content:
            "Puedes asignar un técnico ahora o dejarlo sin asignar para que el administrador lo haga después. Los técnicos ven solo sus órdenes asignadas.",
        }
      default:
        return null
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "client-type":
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground text-center">¿El cliente ya está registrado en el sistema?</p>
            <RadioGroup
              value={clientType || ""}
              onValueChange={(value) => setClientType(value as "existing" | "new")}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="existing" id="existing" />
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label htmlFor="existing" className="font-medium cursor-pointer">
                      Cliente Existente
                    </Label>
                    <p className="text-sm text-muted-foreground">Buscar y seleccionar un cliente ya registrado</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="new" id="new" />
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  <div>
                    <Label htmlFor="new" className="font-medium cursor-pointer">
                      Cliente Nuevo
                    </Label>
                    <p className="text-sm text-muted-foreground">Registrar un nuevo cliente en el sistema</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case "client-selection":
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value)
                  searchClients(e.target.value)
                }}
                className="pl-10"
              />
            </div>

            {errors.client_selection && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                {errors.client_selection}
              </p>
            )}

            {existingClients.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {existingClients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedClient?.id === client.id ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{client.full_name}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                        {client.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
                      </div>
                      {client.company_name && (
                        <Badge variant="outline" className="text-xs">
                          {client.company_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {clientSearch && existingClients.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground py-8 bg-muted/30 rounded-lg">
                <p className="mb-2">No se encontraron clientes con ese criterio</p>
                <p className="text-sm">Intenta con otro término de búsqueda o crea un cliente nuevo</p>
              </div>
            )}

            {!clientSearch && (
              <div className="text-center text-muted-foreground py-8 bg-muted/30 rounded-lg">
                <p className="mb-2">Escribe para buscar clientes existentes</p>
                <p className="text-sm">Puedes buscar por nombre, email o teléfono</p>
              </div>
            )}
          </div>
        )

      case "new-client":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Nombre Completo *</Label>
                <Input
                  id="full_name"
                  value={newClientData.full_name}
                  onChange={(e) => setNewClientData((prev) => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Juan Pérez"
                  className={errors.full_name ? "border-red-500" : ""}
                />
                {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="juan@ejemplo.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={newClientData.phone}
                  onChange={(e) => setNewClientData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1234567890"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="company_name">Empresa</Label>
                <Input
                  id="company_name"
                  value={newClientData.company_name}
                  onChange={(e) => setNewClientData((prev) => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Empresa S.A."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={newClientData.address}
                onChange={(e) => setNewClientData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Calle Principal 123"
              />
            </div>

            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={newClientData.city}
                onChange={(e) => setNewClientData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Ciudad"
              />
            </div>
          </div>
        )

      case "equipment-type":
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground text-center">
              ¿Deseas usar un equipo ya registrado del cliente o registrar uno nuevo?
            </p>
            <RadioGroup
              value={equipmentType || ""}
              onValueChange={(value) => setEquipmentType(value as "existing" | "new")}
              className="space-y-4"
            >
              {existingEquipments.length > 0 && (
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="existing" id="existing-equipment" />
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-blue-600" />
                    <div>
                      <Label htmlFor="existing-equipment" className="font-medium cursor-pointer">
                        Equipo Existente
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Seleccionar de {existingEquipments.length} equipo(s) registrado(s)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="new" id="new-equipment" />
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-green-600" />
                  <div>
                    <Label htmlFor="new-equipment" className="font-medium cursor-pointer">
                      Equipo Nuevo
                    </Label>
                    <p className="text-sm text-muted-foreground">Registrar un nuevo equipo para este cliente</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
            {existingEquipments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center bg-muted/50 p-3 rounded-lg">
                Este cliente no tiene equipos registrados. Deberás crear uno nuevo.
              </p>
            )}
          </div>
        )

      case "equipment-selection":
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">Selecciona el equipo para esta orden:</p>

            {errors.equipment_selection && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                {errors.equipment_selection}
              </p>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {existingEquipments.map((equipment) => (
                <div
                  key={equipment.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedEquipment?.id === equipment.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedEquipment(equipment)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {equipment.brand} {equipment.model}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">{equipment.equipment_type}</p>
                      {equipment.serial_number && (
                        <p className="text-sm text-muted-foreground">S/N: {equipment.serial_number}</p>
                      )}
                    </div>
                    <Badge variant={equipment.status === "active" ? "default" : "secondary"}>
                      {equipment.status === "active" ? "Activo" : equipment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "new-equipment":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipment_type">Tipo de Equipo *</Label>
                <Select
                  value={newEquipmentData.equipment_type}
                  onValueChange={(value) => {
                    console.log("[v0] Equipment type selected:", value)
                    setNewEquipmentData((prev) => ({ ...prev, equipment_type: value }))
                  }}
                >
                  <SelectTrigger className={errors.equipment_type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="PC">PC de Escritorio</SelectItem>
                    <SelectItem value="Server">Servidor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.equipment_type && <p className="text-sm text-red-500 mt-1">{errors.equipment_type}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Solo se permiten estos tipos principales. Usa el campo "Subtipo" para especificar el tipo exacto.
                </p>
              </div>
              <div>
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={newEquipmentData.brand}
                  onChange={(e) => setNewEquipmentData((prev) => ({ ...prev, brand: e.target.value }))}
                  placeholder="HP, Dell, Lenovo, Apple..."
                  className={errors.brand ? "border-red-500" : ""}
                />
                {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={newEquipmentData.model}
                  onChange={(e) => setNewEquipmentData((prev) => ({ ...prev, model: e.target.value }))}
                  placeholder="Modelo específico del equipo"
                  className={errors.model ? "border-red-500" : ""}
                />
                {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
              </div>
              <div>
                <Label htmlFor="serial_number">Número de Serie</Label>
                <Input
                  id="serial_number"
                  value={newEquipmentData.serial_number}
                  onChange={(e) => setNewEquipmentData((prev) => ({ ...prev, serial_number: e.target.value }))}
                  placeholder="S/N del equipo (opcional)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="equipment_subtype">Subtipo de Equipo</Label>
              <Input
                id="equipment_subtype"
                value={newEquipmentData.equipment_subtype || ""}
                onChange={(e) => setNewEquipmentData((prev) => ({ ...prev, equipment_subtype: e.target.value }))}
                placeholder="Especifica si es impresora, monitor, tablet, etc."
              />
              <p className="text-xs text-muted-foreground mt-1">
                <strong>Ejemplos:</strong> Si es una impresora, selecciona "PC" arriba y escribe "Impresora" aquí. Si es
                un monitor, selecciona "PC" y escribe "Monitor". Para tablets, selecciona "Laptop" y escribe "Tablet".
              </p>
            </div>

            <div>
              <Label htmlFor="device_condition">Estado del Equipo</Label>
              <Textarea
                id="device_condition"
                value={newEquipmentData.device_condition}
                onChange={(e) => setNewEquipmentData((prev) => ({ ...prev, device_condition: e.target.value }))}
                placeholder="Describe el estado físico del equipo (rayones, golpes, etc.)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="accessories">Accesorios Incluidos</Label>
              <Textarea
                id="accessories"
                value={newEquipmentData.accessories}
                onChange={(e) => setNewEquipmentData((prev) => ({ ...prev, accessories: e.target.value }))}
                placeholder="Cargador, mouse, cables, manuales, etc."
                rows={2}
              />
            </div>
          </div>
        )

      case "order-details":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="problem_description">Descripción del Problema *</Label>
              <Textarea
                id="problem_description"
                value={orderData.problem_description}
                onChange={(e) => setOrderData((prev) => ({ ...prev, problem_description: e.target.value }))}
                placeholder="Describe detalladamente el problema reportado por el cliente..."
                rows={4}
                className={errors.problem_description ? "border-red-500" : ""}
              />
              {errors.problem_description && <p className="text-sm text-red-500 mt-1">{errors.problem_description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={orderData.priority}
                  onValueChange={(value) => setOrderData((prev) => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estimated_cost">Costo Estimado</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  step="0.01"
                  value={orderData.estimated_cost}
                  onChange={(e) => setOrderData((prev) => ({ ...prev, estimated_cost: e.target.value }))}
                  placeholder="0.00"
                  className={errors.estimated_cost ? "border-red-500" : ""}
                />
                {errors.estimated_cost && <p className="text-sm text-red-500 mt-1">{errors.estimated_cost}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="advance_payment">Anticipo</Label>
              <Input
                id="advance_payment"
                type="number"
                step="0.01"
                value={orderData.advance_payment}
                onChange={(e) => setOrderData((prev) => ({ ...prev, advance_payment: e.target.value }))}
                placeholder="0.00"
                className={errors.advance_payment ? "border-red-500" : ""}
              />
              {errors.advance_payment && <p className="text-sm text-red-500 mt-1">{errors.advance_payment}</p>}
            </div>

            <div>
              <Label htmlFor="client_notes">Notas del Cliente</Label>
              <Textarea
                id="client_notes"
                value={orderData.client_notes}
                onChange={(e) => setOrderData((prev) => ({ ...prev, client_notes: e.target.value }))}
                placeholder="Comentarios adicionales del cliente..."
                rows={3}
              />
            </div>
          </div>
        )

      case "technician-assignment":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="w-12 h-12 text-blue-600 mx-auto" />
              <p className="text-muted-foreground">
                Asigna un técnico a esta orden o déjala sin asignar para que el administrador la asigne después.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="technician">Técnico Asignado</Label>
                <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>Sin asignar</span>
                      </div>
                    </SelectItem>
                    {availableTechnicians.map((technician) => (
                      <SelectItem key={technician.id} value={technician.id}>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{technician.full_name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedTechnician === "none"
                    ? "La orden quedará en estado 'Sin asignar' hasta que un administrador la asigne."
                    : "El técnico seleccionado recibirá una notificación de la nueva orden asignada."}
                </p>
              </div>

              {availableTechnicians.length === 0 && (
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    No hay técnicos disponibles en este momento. La orden se creará sin asignar.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Técnicos Disponibles ({availableTechnicians.length})
                </h4>
                <div className="space-y-2">
                  {availableTechnicians.slice(0, 3).map((technician) => (
                    <div key={technician.id} className="flex items-center justify-between text-sm">
                      <span className="text-blue-800 dark:text-blue-200">{technician.full_name}</span>
                      <Badge variant="outline" className="text-xs">
                        Disponible
                      </Badge>
                    </div>
                  ))}
                  {availableTechnicians.length > 3 && (
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      +{availableTechnicians.length - 3} técnicos más disponibles
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case "confirmation":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">¡Orden Creada Exitosamente!</h3>
              <p className="text-muted-foreground mt-2">
                La orden ha sido registrada y está lista para ser procesada por el equipo técnico.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="font-medium">{selectedClient?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Equipo:</span>
                  <span className="font-medium">
                    {selectedEquipment
                      ? `${selectedEquipment.brand} ${selectedEquipment.model}`
                      : `${newEquipmentData.brand} ${newEquipmentData.model}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Técnico:</span>
                  <span className="font-medium">
                    {selectedTechnician === "none"
                      ? "Sin asignar"
                      : availableTechnicians.find((t) => t.id === selectedTechnician)?.full_name || "Sin asignar"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prioridad:</span>
                  <Badge variant={orderData.priority === "urgent" ? "destructive" : "secondary"}>
                    {orderData.priority === "low"
                      ? "Baja"
                      : orderData.priority === "medium"
                        ? "Media"
                        : orderData.priority === "high"
                          ? "Alta"
                          : "Urgente"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Asistente para Crear Orden - {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2">
            {["client-type", "equipment-type", "order-details", "technician-assignment", "confirmation"].map(
              (step, index) => {
                const stepMap = {
                  "client-type": ["client-type", "client-selection", "new-client"],
                  "equipment-type": ["equipment-type", "equipment-selection", "new-equipment"],
                  "order-details": ["order-details"],
                  "technician-assignment": ["technician-assignment"],
                  confirmation: ["confirmation"],
                }

                const isActive = stepMap[step as keyof typeof stepMap].includes(currentStep)
                const isCompleted =
                  (step === "client-type" && selectedClient) ||
                  (step === "equipment-type" && (selectedEquipment || equipmentType === "new")) ||
                  (step === "order-details" && currentStep === "technician-assignment") ||
                  (step === "technician-assignment" && currentStep === "confirmation")

                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    {index < 4 && <div className={`w-8 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : "bg-muted"}`} />}
                  </div>
                )
              },
            )}
          </div>

          {getStepTips() && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>{getStepTips()?.title}:</strong> {getStepTips()?.content}
              </AlertDescription>
            </Alert>
          )}

          {/* Step content */}
          <Card>
            <CardContent className="p-6">{renderStepContent()}</CardContent>
          </Card>

          {/* Navigation buttons */}
          {currentStep !== "confirmation" && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === "client-type"}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <Button onClick={nextStep} disabled={!canProceed() || isLoading}>
                {isLoading ? "Procesando..." : currentStep === "technician-assignment" ? "Crear Orden" : "Siguiente"}
                {!isLoading && currentStep !== "technician-assignment" && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          )}

          {currentStep === "confirmation" && (
            <div className="flex justify-center">
              <Button onClick={handleClose}>Finalizar</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
