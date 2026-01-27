interface OrderStatusBadgeProps {
  status: string
}

const statusConfig = {
  received: { label: "Recibido", color: "bg-blue-100 text-blue-800" },
  in_diagnosis: { label: "En Diagnóstico", color: "bg-yellow-100 text-yellow-800" },
  waiting_parts: { label: "Esperando Repuestos", color: "bg-orange-100 text-orange-800" },
  in_repair: { label: "En Reparación", color: "bg-purple-100 text-purple-800" },
  testing: { label: "En Pruebas", color: "bg-indigo-100 text-indigo-800" },
  completed: { label: "Completado", color: "bg-green-100 text-green-800" },
  delivered: { label: "Entregado", color: "bg-gray-100 text-gray-800" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.received

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
