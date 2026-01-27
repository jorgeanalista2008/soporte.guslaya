"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, MapPin, Calendar, AlertTriangle } from "lucide-react"

interface InventoryPart {
  id: string
  part_number: string
  name: string
  description?: string
  category?: { name: string }
  category_id?: number
  brand?: string
  model?: string
  unit_price?: number
  stock_quantity: number
  min_stock_level: number
  max_stock_level?: number
  location?: string
  supplier?: string
  status: string
  created_at: string
  updated_at: string
}

interface Category {
  id: number
  name: string
  description?: string
}

interface CreateEditPartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  part?: InventoryPart | null
  categories: Category[]
  onSave: (partData: any) => void
}

export function CreateEditPartDialog({ open, onOpenChange, part, categories, onSave }: CreateEditPartDialogProps) {
  const [formData, setFormData] = useState({
    part_number: "",
    name: "",
    description: "",
    category_id: "",
    brand: "",
    model: "",
    unit_price: "",
    stock_quantity: "0",
    min_stock_level: "0",
    max_stock_level: "",
    location: "",
    supplier: "",
    status: "active",
  })

  useEffect(() => {
    if (part) {
      setFormData({
        part_number: part.part_number || "",
        name: part.name || "",
        description: part.description || "",
        category_id: part.category_id ? part.category_id.toString() : "", // Fixed: use category_id directly
        brand: part.brand || "",
        model: part.model || "",
        unit_price: part.unit_price?.toString() || "",
        stock_quantity: part.stock_quantity?.toString() || "0",
        min_stock_level: part.min_stock_level?.toString() || "0",
        max_stock_level: part.max_stock_level?.toString() || "",
        location: part.location || "",
        supplier: part.supplier || "",
        status: part.status || "active",
      })
    } else {
      setFormData({
        part_number: "",
        name: "",
        description: "",
        category_id: "",
        brand: "",
        model: "",
        unit_price: "",
        stock_quantity: "0",
        min_stock_level: "0",
        max_stock_level: "",
        location: "",
        supplier: "",
        status: "active",
      })
    }
  }, [part, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedData = {
      part_number: formData.part_number.trim(),
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      category_id: formData.category_id ? Number.parseInt(formData.category_id) : null,
      brand: formData.brand.trim() || null,
      model: formData.model.trim() || null,
      unit_price: formData.unit_price ? Number.parseFloat(formData.unit_price) : null,
      stock_quantity: Number.parseInt(formData.stock_quantity) || 0,
      min_stock_level: Number.parseInt(formData.min_stock_level) || 0,
      max_stock_level: formData.max_stock_level ? Number.parseInt(formData.max_stock_level) : null,
      location: formData.location.trim() || null,
      supplier: formData.supplier.trim() || null,
      status: formData.status || "active",
    }

    // Validate required fields
    if (!cleanedData.part_number) {
      console.error("[v0] part_number is required")
      return
    }

    if (!cleanedData.name) {
      console.error("[v0] name is required")
      return
    }

    onSave(cleanedData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full mx-2 sm:mx-4 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{part ? "Editar Repuesto" : "Crear Nuevo Repuesto"}</DialogTitle>
          <DialogDescription>
            {part
              ? "Modifica los datos del repuesto seleccionado"
              : "Completa la información para agregar un nuevo repuesto al inventario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part_number">Código de Parte *</Label>
              <Input
                id="part_number"
                value={formData.part_number}
                onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                placeholder="Ej: PSU-500W-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Fuente de Poder 500W"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada del repuesto..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Ej: Corsair, Samsung, HP"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Modelo específico"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_price">Precio Unitario</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Actual *</Label>
              <Input
                id="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock_level">Stock Mínimo *</Label>
              <Input
                id="min_stock_level"
                type="number"
                min="0"
                value={formData.min_stock_level}
                onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_stock_level">Stock Máximo</Label>
              <Input
                id="max_stock_level"
                type="number"
                min="0"
                value={formData.max_stock_level}
                onChange={(e) => setFormData({ ...formData, max_stock_level: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej: Estante A-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Nombre del proveedor"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="discontinued">Descontinuado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {part ? "Actualizar" : "Crear"} Repuesto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface PartDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  part: InventoryPart | null
}

export function PartDetailsDialog({ open, onOpenChange, part }: PartDetailsDialogProps) {
  if (!part) return null

  const stockStatus =
    part.stock_quantity === 0 ? "Agotado" : part.stock_quantity <= part.min_stock_level ? "Stock Bajo" : "Disponible"

  const stockColor =
    part.stock_quantity === 0
      ? "text-red-600"
      : part.stock_quantity <= part.min_stock_level
        ? "text-yellow-600"
        : "text-green-600"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full mx-2 sm:mx-4 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {part.name}
          </DialogTitle>
          <DialogDescription>Código: {part.part_number}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant={part.status === "active" ? "default" : "secondary"} className="text-sm">
              {part.status === "active" ? "Activo" : part.status === "inactive" ? "Inactivo" : "Descontinuado"}
            </Badge>
            <Badge
              variant={
                stockStatus === "Disponible" ? "default" : stockStatus === "Stock Bajo" ? "secondary" : "destructive"
              }
            >
              {stockStatus}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Categoría</Label>
                  <p className="text-sm font-medium">{part.category?.name || "Sin categoría"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Marca</Label>
                  <p className="text-sm font-medium">{part.brand || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Modelo</Label>
                  <p className="text-sm font-medium">{part.model || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Información Financiera
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Precio Unitario</Label>
                  <p className="text-sm font-medium">${(part.unit_price || 0).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Valor Total</Label>
                  <p className="text-sm font-medium">${((part.unit_price || 0) * part.stock_quantity).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Proveedor</Label>
                  <p className="text-sm font-medium">{part.supplier || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Control de Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Label className="text-xs text-muted-foreground">Stock Actual</Label>
                  <p className={`text-lg font-bold ${stockColor}`}>{part.stock_quantity}</p>
                </div>
                <div className="text-center">
                  <Label className="text-xs text-muted-foreground">Stock Mínimo</Label>
                  <p className="text-lg font-medium">{part.min_stock_level}</p>
                </div>
                <div className="text-center">
                  <Label className="text-xs text-muted-foreground">Stock Máximo</Label>
                  <p className="text-lg font-medium">{part.max_stock_level || "N/A"}</p>
                </div>
                <div className="text-center">
                  <Label className="text-xs text-muted-foreground">Ubicación</Label>
                  <p className="text-sm font-medium flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {part.location || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {part.description && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{part.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-muted-foreground pt-4 border-t gap-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Creado: {new Date(part.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Actualizado: {new Date(part.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface UpdateStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  part: InventoryPart | null
  onUpdate: (partId: string, newQuantity: number, transactionType: string, notes: string) => void
}

export function UpdateStockDialog({ open, onOpenChange, part, onUpdate }: UpdateStockDialogProps) {
  const [transactionType, setTransactionType] = useState<string>("adjustment")
  const [quantity, setQuantity] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!part || !quantity) return

    const quantityNum = Number.parseInt(quantity)
    let newStock = part.stock_quantity

    if (transactionType === "in") {
      newStock += quantityNum
    } else if (transactionType === "out") {
      newStock = Math.max(0, newStock - quantityNum)
    } else if (transactionType === "adjustment") {
      newStock = quantityNum
    }

    onUpdate(part.id, newStock, transactionType, notes)
    onOpenChange(false)
    setQuantity("")
    setNotes("")
  }

  if (!part) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full mx-2 sm:mx-4">
        <DialogHeader>
          <DialogTitle>Actualizar Stock</DialogTitle>
          <DialogDescription>
            {part.name} - Stock actual: {part.stock_quantity} unidades
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transaction_type">Tipo de Movimiento</Label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Entrada (+)</SelectItem>
                <SelectItem value="out">Salida (-)</SelectItem>
                <SelectItem value="adjustment">Ajuste (=)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">{transactionType === "adjustment" ? "Nueva Cantidad" : "Cantidad"}</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={transactionType === "adjustment" ? "Cantidad final" : "Cantidad a mover"}
              required
            />
            {transactionType !== "adjustment" && quantity && (
              <p className="text-sm text-muted-foreground">
                Nuevo stock:{" "}
                {transactionType === "in"
                  ? part.stock_quantity + Number.parseInt(quantity)
                  : Math.max(0, part.stock_quantity - Number.parseInt(quantity))}{" "}
                unidades
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Motivo del movimiento..."
              rows={3}
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Actualizar Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSave: (categoryData: { name: string; description: string }) => void
  title: string
  description: string
}

export function CategoryDialog({ open, onOpenChange, category, onSave, title, description }: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
      })
    }
  }, [category, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedData = {
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
    }

    if (!cleanedData.name) {
      return
    }

    onSave(cleanedData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_name">Nombre de la Categoría *</Label>
            <Input
              id="category_name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Componentes Electrónicos"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_description">Descripción</Label>
            <Textarea
              id="category_description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción de la categoría..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{category ? "Actualizar" : "Crear"} Categoría</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
