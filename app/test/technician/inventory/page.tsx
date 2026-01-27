import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TechnicianInventoryTest() {
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/test/technician/dashboard",
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
      title: "Mis Órdenes",
      href: "/test/technician/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "Diagnósticos",
      href: "/test/technician/diagnostics",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      title: "Inventario",
      href: "/test/technician/inventory",
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
      title: "Historial",
      href: "/test/technician/history",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ]

  const userInfo = {
    name: "Carlos Mendoza",
    email: "tecnico@techservice.com",
    role: "técnico",
  }

  const inventoryItems = [
    {
      id: "INV-001",
      name: "Fuente de Poder 500W",
      category: "Componentes",
      stock: 5,
      minStock: 2,
      location: "Estante A-1",
      price: 45.99,
      status: "Disponible",
    },
    {
      id: "INV-002",
      name: "Memoria RAM DDR4 8GB",
      category: "Memoria",
      stock: 12,
      minStock: 5,
      location: "Estante B-2",
      price: 89.99,
      status: "Disponible",
    },
    {
      id: "INV-003",
      name: "Disco SSD 256GB",
      category: "Almacenamiento",
      stock: 8,
      minStock: 3,
      location: "Estante C-1",
      price: 129.99,
      status: "Disponible",
    },
    {
      id: "INV-004",
      name: 'Pantalla LCD 15.6"',
      category: "Pantallas",
      stock: 1,
      minStock: 2,
      location: "Estante D-3",
      price: 199.99,
      status: "Stock Bajo",
    },
    {
      id: "INV-005",
      name: "Teclado Laptop HP",
      category: "Periféricos",
      stock: 0,
      minStock: 3,
      location: "Estante E-1",
      price: 35.99,
      status: "Agotado",
    },
    {
      id: "INV-006",
      name: "Batería Laptop Dell",
      category: "Baterías",
      stock: 6,
      minStock: 2,
      location: "Estante F-2",
      price: 79.99,
      status: "Disponible",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={sidebarItems} userInfo={userInfo} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventario de Repuestos</h1>
            <p className="text-gray-600">Gestiona el inventario de componentes y repuestos disponibles</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Input placeholder="Buscar repuestos..." className="max-w-sm" />
                <Button variant="outline">Filtrar por Categoría</Button>
                <Button variant="outline">Stock Bajo</Button>
                <Button>Solicitar Repuesto</Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventoryItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge
                      variant={
                        item.status === "Disponible"
                          ? "default"
                          : item.status === "Stock Bajo"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <CardDescription>{item.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <span
                        className={`text-sm font-medium ${
                          item.stock <= item.minStock ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {item.stock} unidades
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ubicación:</span>
                      <span className="text-sm">{item.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Precio:</span>
                      <span className="text-sm font-medium">${item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mín. Stock:</span>
                      <span className="text-sm">{item.minStock}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" disabled={item.stock === 0}>
                      Usar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Solicitar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
