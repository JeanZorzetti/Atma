import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, Circle, Clock, Trophy } from "lucide-react"

interface ProgressStep {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "pending"
  date?: Date
}

interface ProgressTrackerProps {
  title: string
  steps: ProgressStep[]
  overallProgress: number
  className?: string
}

export function ProgressTracker({
  title,
  steps,
  overallProgress,
  className
}: ProgressTrackerProps) {
  const completedSteps = steps.filter(step => step.status === "completed").length
  const currentStep = steps.find(step => step.status === "current")

  return (
    <Card className={cn("medical-progress-card", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" aria-hidden="true" />
            {title}
          </CardTitle>
          <Badge variant="medical">
            {completedSteps}/{steps.length} Concluído
          </Badge>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progresso Geral</span>
            <span>{overallProgress}%</span>
          </div>
          <div
            className="w-full bg-muted rounded-full h-3"
            role="progressbar"
            aria-valuenow={overallProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso geral do tratamento: ${overallProgress}%`}
          >
            <div
              className="bg-gradient-to-r from-primary via-secondary to-accent h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            const StepIcon = step.status === "completed" ? CheckCircle :
                           step.status === "current" ? Clock : Circle

            return (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-6 top-12 w-0.5 h-8 transition-colors",
                      step.status === "completed" ? "bg-primary" : "bg-muted"
                    )}
                    aria-hidden="true"
                  />
                )}

                <div className="flex gap-4">
                  {/* Step Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                      step.status === "completed" && "bg-primary text-white",
                      step.status === "current" && "bg-secondary text-white animate-pulse-gentle",
                      step.status === "pending" && "bg-muted text-muted-foreground"
                    )}
                    aria-label={`Etapa ${index + 1}: ${step.status === "completed" ? "concluída" :
                                 step.status === "current" ? "em andamento" : "pendente"}`}
                  >
                    <StepIcon className="w-6 h-6" />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-semibold text-sm",
                        step.status === "completed" && "text-primary",
                        step.status === "current" && "text-secondary",
                        step.status === "pending" && "text-muted-foreground"
                      )}>
                        {step.title}
                      </h4>

                      {step.status === "current" && (
                        <Badge variant="secondary" className="text-xs">
                          Atual
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>

                    {step.date && (
                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={step.date.toISOString()}
                      >
                        {step.status === "completed" ? "Concluído em: " : "Previsto para: "}
                        {step.date.toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </time>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Current Step Highlight */}
        {currentStep && (
          <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-secondary" aria-hidden="true" />
              <span className="text-sm font-medium text-secondary">
                Etapa Atual
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentStep.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Medical Progress Styling
const progressStyles = `
  .medical-progress-card {
    background: linear-gradient(145deg, var(--card) 0%, rgba(30, 64, 175, 0.02) 100%);
    border: 1px solid var(--border);
    transition: all 0.3s ease;
  }

  .medical-progress-card:hover {
    border-color: var(--primary);
    box-shadow: 0 8px 25px rgba(30, 64, 175, 0.08);
  }

  @media (prefers-reduced-motion: reduce) {
    .medical-progress-card {
      transition: none;
    }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = progressStyles
  document.head.appendChild(style)
}