interface PriorityBadgeProps {
  priority: string
}

const priorityConfig = {
  low: { label: "Baja", color: "bg-gray-100 text-gray-800" },
  medium: { label: "Media", color: "bg-blue-100 text-blue-800" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-800" },
  urgent: { label: "Urgente", color: "bg-red-100 text-red-800" },
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
