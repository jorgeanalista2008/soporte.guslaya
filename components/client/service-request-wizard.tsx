"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { createServiceRequest } from "@/lib/services/client-service"

interface Equipment {
  id: string
  equipment_type: string
  brand: string
  model: string
  serial_number?: string
}

interface ServiceRequestWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingEquipments: Equipment[]
}

type Step = 1 | 2 | 3 | 4

export function ServiceRequestWizard({ open, onOpenChange, existingEquipments }: ServiceRequestWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1: Equipment selection type
  const [equipmentSource, setEquipmentSource] = useState<"existing" | "new" | "">("")
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("")

  // Step 2: Equipment details (for new equipment)
  const [equipmentType, setEquipmentType] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [serialNumber, setSerialNumber] = useState("")

  // Step 3: Problem details
  const [problemDescription, setProblemDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [deviceCondition, setDeviceCondition] = useState("")

  // Step 4: Additional information
  const [accessories, setAccessories] = useState("")
  const [clientNotes, setClientNotes] = useState("")

  const totalSteps = equipmentSource === "existing" ? 3 : 4
  const progress = (currentStep / totalSteps) * 100

  const equipmentTypes = [
    { value: "Laptop", label: "Laptop", icon: "💻" },
    { value: "PC", label: "PC de Escritorio", icon: "🖥️" },
    { value: "Server", label: "Servidor", icon: "🖧" },
  ]

  const deviceConditions = [
    { value: "excellent", label: "Excelente", description: "Funciona perfectamente, solo mantenimiento" },
    { value: "good", label: "Bueno", description: "Funciona con problemas menores" },
    { value: "fair", label: "Regular", description: "Funciona pero con problemas notables" },
    { value: "poor", label: "Malo", description: "Apenas funciona" },
    { value: "not_working", label: "No enciende", description: "Completamente inoperativo" },
  ]

  const priorityOptions = [
    { value: "low", label: "Baja", description: "No es urgente, puede esperar", color: "bg-gray-100 text-gray-800" },
    { value: "medium", label: "Media", description: "Necesario en unos días", color: "bg-blue-100 text-blue-800" },
    { value: "high", label: "Alta", description: "Necesario pronto", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgente", description: "Necesario inmediatamente", color: "bg-red-100 text-red-800" },
  ]

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!equipmentSource) {
        toast.error("Por favor selecciona una opción")
        return
      }
      if (equipmentSource === "existing" && !selectedEquipmentId) {
        toast.error("Por favor selecciona un equipo")
        return
      }
      // Skip step 2 if using existing equipment
      if (equipmentSource === "existing") {
        setCurrentStep(3 as Step)
      } else {
        setCurrentStep(2 as Step)
      }
    } else if (currentStep === 2) {
      if (!equipmentType) {
        toast.error("Por favor selecciona el tipo de equipo")
        return
      }
      setCurrentStep(3 as Step)
    } else if (currentStep === 3) {
      if (!problemDescription.trim()) {
        toast.error("Por favor describe el problema")
        return
      }
      setCurrentStep(4 as Step)
    }
  }

  const handleBack = () => {
    if (currentStep === 3 && equipmentSource === "existing") {
      setCurrentStep(1 as Step)
    } else if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      let formData: any = {
        problem_description: problemDescription,
        priority,
        device_condition: deviceCondition,
        accessories,
        client_notes: clientNotes,
      }

      if (equipmentSource === "existing") {
        const equipment = existingEquipments.find((eq) => eq.id === selectedEquipmentId)
        if (equipment) {
          formData = {
            ...formData,
            equipment_id: equipment.id,
            equipment_type: equipment.equipment_type,
            brand: equipment.brand,
            model: equipment.model,
            serial_number: equipment.serial_number,
          }
        }
      } else {
        formData = {
          ...formData,
          equipment_type: equipmentType,
          brand,
          model,
          serial_number: serialNumber,
        }
      }

      const result = await createServiceRequest(supabase, formData)

      if (result.success) {
        toast.success("¡Solicitud creada exitosamente!")
        onOpenChange(false)
        router.push("/client/orders")
        router.refresh()
      } else {
        toast.error(result.error || "Error al crear la solicitud")
      }
    } catch (error) {
      console.error("Error creating service request:", error)
      toast.error("Error inesperado al crear la solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  const resetWizard = () => {
    setCurrentStep(1)
    setEquipmentSource("")
    setSelectedEquipmentId("")
    setEquipmentType("")
    setBrand("")
    setModel("")
    setSerialNumber("")
    setProblemDescription("")
    setPriority("medium")
    setDeviceCondition("")
    setAccessories("")
    setClientNotes("")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetWizard()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[90%] md:w-[60%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Asistente de Nueva Solicitud</DialogTitle>
          <DialogDescription>Te guiaremos paso a paso para crear tu solicitud de servicio</DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Paso {currentStep} de {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="space-y-6 py-4">
          {/* Step 1: Equipment Source Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">¿El equipo ya está registrado?</h3>
                <p className="text-sm text-muted-foreground">
                  Selecciona si deseas usar un equipo que ya registraste anteriormente o registrar uno nuevo
                </p>
              </div>

              <Alert>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <AlertDescription>
                  <strong>Tip:</strong> Si ya registraste este equipo antes, selecciónalo de la lista para ahorrar
                  tiempo.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {existingEquipments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setEquipmentSource("existing")}
                    className={`p-6 border-2 rounded-lg text-left transition-all hover:border-primary ${
                      equipmentSource === "existing" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                        📋
                      </div>
                      <div>
                        <h4 className="font-semibold">Equipo Registrado</h4>
                        <Badge variant="secondary" className="mt-1">
                          {existingEquipments.length} disponibles
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Selecciona un equipo que ya registraste anteriormente
                    </p>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setEquipmentSource("new")}
                  className={`p-6 border-2 rounded-lg text-left transition-all hover:border-primary ${
                    equipmentSource === "new" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      ➕
                    </div>
                    <div>
                      <h4 className="font-semibold">Equipo Nuevo</h4>
                      <Badge variant="secondary" className="mt-1">
                        Registrar ahora
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Registra un equipo que no has ingresado antes</p>
                </button>
              </div>

              {equipmentSource === "existing" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label>Selecciona tu equipo</Label>
                  <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
                    <SelectTrigger className="h-auto min-h-[44px]">
                      <SelectValue placeholder="Elige un equipo de la lista" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingEquipments.map((equipment) => (
                        <SelectItem key={equipment.id} value={equipment.id} className="h-auto py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {equipment.equipment_type} {equipment.brand} {equipment.model}
                            </span>
                            {equipment.serial_number && (
                              <span className="text-xs text-muted-foreground">S/N: {equipment.serial_number}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Step 2: New Equipment Details */}
          {currentStep === 2 && equipmentSource === "new" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Información del Equipo</h3>
                <p className="text-sm text-muted-foreground">
                  Proporciona los detalles de tu equipo para un mejor diagnóstico
                </p>
              </div>

              <Alert>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <AlertDescription>
                  <strong>Tip:</strong> El número de serie suele estar en una etiqueta en la parte inferior o trasera
                  del equipo.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Tipo de Equipo *</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {equipmentTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setEquipmentType(type.value)}
                        className={`p-4 border-2 rounded-lg text-center transition-all hover:border-primary ${
                          equipmentType === type.value ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ej: Dell, HP, Apple"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ej: Inspiron 15, MacBook Pro"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="serial">Número de Serie (Opcional)</Label>
                  <Input
                    id="serial"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Número de serie del equipo"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Ayuda a identificar tu equipo de manera única</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Problem Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Describe el Problema</h3>
                <p className="text-sm text-muted-foreground">Cuéntanos qué está pasando con tu equipo</p>
              </div>

              <Alert>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <AlertDescription>
                  <strong>Buena práctica:</strong> Describe cuándo comenzó el problema, qué estabas haciendo y cualquier
                  mensaje de error que hayas visto.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="problem">Descripción del Problema *</Label>
                  <Textarea
                    id="problem"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Ejemplo: La laptop no enciende después de que se cayó. La pantalla permanece negra y no emite ningún sonido al presionar el botón de encendido..."
                    rows={5}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Mínimo 20 caracteres. Sé lo más específico posible.
                  </p>
                </div>

                <div>
                  <Label>Prioridad del Servicio *</Label>
                  <RadioGroup
                    value={priority}
                    onValueChange={(value: any) => setPriority(value)}
                    className="mt-2 space-y-3"
                  >
                    {priorityOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all ${
                          priority === option.value ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={option.value} className="cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{option.label}</span>
                              <Badge className={`${option.color} border-0`}>{option.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="condition">Estado Actual del Equipo</Label>
                  <Select value={deviceCondition} onValueChange={setDeviceCondition}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceConditions.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{condition.label}</span>
                            <span className="text-xs text-muted-foreground">{condition.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Información Adicional</h3>
                <p className="text-sm text-muted-foreground">Últimos detalles para completar tu solicitud</p>
              </div>

              <Alert>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <AlertDescription>
                  <strong>Tip:</strong> Menciona todos los accesorios que entregas. Esto evita confusiones al momento de
                  la devolución.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="accessories">Accesorios Incluidos</Label>
                  <Input
                    id="accessories"
                    value={accessories}
                    onChange={(e) => setAccessories(e.target.value)}
                    placeholder="Ej: Cargador original, mouse inalámbrico, funda protectora"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lista los accesorios que entregas junto con el equipo
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Textarea
                    id="notes"
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Cualquier información adicional que consideres importante..."
                    rows={4}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Opcional: Horarios preferidos de contacto, instrucciones especiales, etc.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm">Resumen de tu solicitud:</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Equipo:</span>{" "}
                      <span className="font-medium">
                        {equipmentSource === "existing"
                          ? existingEquipments.find((eq) => eq.id === selectedEquipmentId)?.equipment_type
                          : equipmentType}{" "}
                        {equipmentSource === "existing"
                          ? `${existingEquipments.find((eq) => eq.id === selectedEquipmentId)?.brand} ${existingEquipments.find((eq) => eq.id === selectedEquipmentId)?.model}`
                          : `${brand} ${model}`}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Prioridad:</span>{" "}
                      <Badge className={`${priorityOptions.find((p) => p.value === priority)?.color} border-0 ml-1`}>
                        {priorityOptions.find((p) => p.value === priority)?.label}
                      </Badge>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Problema:</span>{" "}
                      <span className="font-medium line-clamp-2">{problemDescription}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1 || isLoading}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Atrás
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={isLoading}>
              Siguiente
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Crear Solicitud
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
