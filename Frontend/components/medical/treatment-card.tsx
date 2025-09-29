import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Calendar, Star, CheckCircle, Users } from "lucide-react"

interface TreatmentCardProps {
  title: string
  description: string
  duration: string
  status: "active" | "completed" | "pending" | "cancelled"
  progress?: number
  nextAppointment?: Date
  className?: string
}

const statusConfig = {
  active: {
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Calendar,
    label: "Em Andamento"
  },
  completed: {
    badge: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    label: "Concluído"
  },
  pending: {
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Star,
    label: "Pendente"
  },
  cancelled: {
    badge: "bg-red-100 text-red-800 border-red-200",
    icon: Star,
    label: "Cancelado"
  }
}

export function TreatmentCard({
  title,
  description,
  duration,
  status,
  progress,
  nextAppointment,
  className
}: TreatmentCardProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  // Inject styles safely in useEffect
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('medical-card-styles')
      if (!existingStyle) {
        const style = document.createElement('style')
        style.id = 'medical-card-styles'
        style.textContent = medicalStyles
        document.head.appendChild(style)
      }
    }
  }, [])

  return (
    <Card className={cn("medical-card touch-target focus-enhanced", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medical-heading">
            {title}
          </CardTitle>
          <Badge className={config.badge}>
            <StatusIcon className="w-3 h-3 mr-1" aria-hidden="true" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-medical text-muted-foreground">
          {description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>{duration}</span>
          </div>

          {nextAppointment && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>{nextAppointment.toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>

        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso do tratamento: ${progress}%`}
            >
              <div
                className="bg-gradient-to-r from-color-medical-primary to-color-medical-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Medical-specific styling
const medicalStyles = `
  .medical-card {
    border: 1px solid var(--border);
    background: var(--card);
    transition: all 0.3s ease;
  }

  .medical-card:hover {
    border-color: var(--color-medical-primary);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);
  }

  .font-medical-heading {
    font-family: var(--font-heading);
    font-weight: 600;
    letter-spacing: -0.025em;
  }
`

