'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

interface ScoreCardProps {
  score: number
  nomeCompleto: string
}

export function ScoreCard({ score, nomeCompleto }: ScoreCardProps) {
  // Determinar mensagem e cor baseado no score
  const getScoreInfo = (score: number) => {
    if (score >= 9) {
      return {
        nivel: 'Excelente',
        mensagem: 'Candidato ideal para alinhadores invisíveis! Seu caso tem alta viabilidade.',
        cor: 'text-green-600',
        bgCor: 'bg-green-50',
        borderCor: 'border-green-200',
        icon: CheckCircle,
        badgeVariant: 'default' as const,
      }
    } else if (score >= 7) {
      return {
        nivel: 'Muito Bom',
        mensagem: 'Ótimo candidato! Tratamento com alinhadores é totalmente viável.',
        cor: 'text-blue-600',
        bgCor: 'bg-blue-50',
        borderCor: 'border-blue-200',
        icon: TrendingUp,
        badgeVariant: 'default' as const,
      }
    } else if (score >= 5) {
      return {
        nivel: 'Moderado',
        mensagem: 'Viável com acompanhamento adequado. Recomendamos consulta presencial.',
        cor: 'text-amber-600',
        bgCor: 'bg-amber-50',
        borderCor: 'border-amber-200',
        icon: AlertCircle,
        badgeVariant: 'outline' as const,
      }
    } else {
      return {
        nivel: 'Necessita Avaliação',
        mensagem: 'Recomendamos fortemente uma avaliação presencial detalhada.',
        cor: 'text-orange-600',
        bgCor: 'bg-orange-50',
        borderCor: 'border-orange-200',
        icon: AlertCircle,
        badgeVariant: 'outline' as const,
      }
    }
  }

  const info = getScoreInfo(score)
  const Icon = info.icon

  // Calcular porcentagem para animação
  const percentage = (score / 10) * 100

  return (
    <Card className={`border-2 ${info.borderCor} ${info.bgCor} overflow-hidden`}>
      <CardContent className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Coluna Esquerda - Score Visual */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              {/* Circle Progress */}
              <svg className="w-48 h-48 md:w-56 md:h-56 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 100}`}
                  strokeDashoffset={`${2 * Math.PI * 100 * (1 - percentage / 100)}`}
                  className={info.cor}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 1s ease-in-out'
                  }}
                />
              </svg>

              {/* Score Number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl md:text-7xl font-bold text-gray-900">
                  {score.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 mt-1">de 10.0</div>
              </div>
            </div>

            <Badge
              variant={info.badgeVariant}
              className={`mt-4 px-4 py-1 text-base ${info.cor} ${info.bgCor}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {info.nivel}
            </Badge>
          </div>

          {/* Coluna Direita - Informações */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Score de Viabilidade
              </h2>
              <p className="text-gray-600">
                Olá, <strong>{nomeCompleto.split(' ')[0]}</strong>!
              </p>
            </div>

            <div className={`p-4 rounded-lg ${info.bgCor} border ${info.borderCor}`}>
              <p className={`text-base ${info.cor} font-medium`}>
                {info.mensagem}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">O que isso significa?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Score baseado em 5 fatores principais de viabilidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Análise personalizada do seu caso específico</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Recomendações customizadas de tratamento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
