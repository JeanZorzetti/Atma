"use client"

/**
 * Progressive Disclosure Component
 * FASE 2.3 - UX Cognitivo Avançado
 *
 * Reduz carga cognitiva apresentando informação em camadas progressivas
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Info, GraduationCap, Microscope } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DetailLevel = 'basic' | 'detailed' | 'technical'

interface ProgressiveDisclosureProps {
  title: string
  basicContent: React.ReactNode
  detailedContent?: React.ReactNode
  technicalContent?: React.ReactNode
  defaultLevel?: DetailLevel
  className?: string
  showLevelSelector?: boolean
}

const levelConfig = {
  basic: {
    label: 'Simples',
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Informação essencial em linguagem simples'
  },
  detailed: {
    label: 'Detalhado',
    icon: GraduationCap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Explicação mais completa'
  },
  technical: {
    label: 'Técnico',
    icon: Microscope,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    description: 'Informação profissional detalhada'
  }
}

export function ProgressiveDisclosure({
  title,
  basicContent,
  detailedContent,
  technicalContent,
  defaultLevel = 'basic',
  className,
  showLevelSelector = true
}: ProgressiveDisclosureProps) {
  const [detailLevel, setDetailLevel] = useState<DetailLevel>(defaultLevel)

  const availableLevels: DetailLevel[] = ['basic']
  if (detailedContent) availableLevels.push('detailed')
  if (technicalContent) availableLevels.push('technical')

  const currentContent = {
    basic: basicContent,
    detailed: detailedContent || basicContent,
    technical: technicalContent || detailedContent || basicContent
  }[detailLevel]

  const CurrentIcon = levelConfig[detailLevel].icon

  return (
    <div className={cn('w-full', className)}>
      {/* Header com título e nível atual */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            'p-2 rounded-lg',
            levelConfig[detailLevel].bgColor
          )}>
            <CurrentIcon className={cn('h-5 w-5', levelConfig[detailLevel].color)} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">{levelConfig[detailLevel].description}</p>
          </div>
        </div>

        {/* Level Selector */}
        {showLevelSelector && availableLevels.length > 1 && (
          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
            {availableLevels.map((level) => {
              const Icon = levelConfig[level].icon
              return (
                <motion.button
                  key={level}
                  onClick={() => setDetailLevel(level)}
                  className={cn(
                    'relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    detailLevel === level
                      ? 'text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Mudar para nível ${levelConfig[level].label}`}
                >
                  {detailLevel === level && (
                    <motion.div
                      layoutId="activeLevel"
                      className="absolute inset-0 bg-blue-600 rounded-md"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center space-x-1">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{levelConfig[level].label}</span>
                  </span>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>

      {/* Content com animação de transição */}
      <AnimatePresence mode="wait">
        <motion.div
          key={detailLevel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="prose prose-slate max-w-none"
        >
          {currentContent}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/**
 * Variação para informações de tratamento
 */
export function TreatmentInfoDisclosure({
  treatmentName,
  className
}: {
  treatmentName: string
  className?: string
}) {
  return (
    <ProgressiveDisclosure
      title={`Tratamento: ${treatmentName}`}
      className={className}
      basicContent={
        <div className="space-y-3">
          <p className="text-base leading-relaxed">
            Os alinhadores invisíveis são aparelhos transparentes que movem seus dentes
            gradualmente para a posição correta, sem a necessidade de brackets metálicos.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-900">
              <strong>Benefício principal:</strong> Tratamento discreto e confortável que
              você pode remover para comer e escovar os dentes.
            </p>
          </div>
        </div>
      }
      detailedContent={
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Os alinhadores Atma utilizam tecnologia de impressão 3D de alta precisão
            para criar aparelhos personalizados que aplicam forças controladas em seus dentes.
          </p>

          <h4 className="font-semibold text-slate-900 mt-4">Como funciona:</h4>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Escaneamento digital 3D dos seus dentes</li>
            <li>Planejamento computadorizado do movimento dentário</li>
            <li>Fabricação de série de alinhadores personalizados</li>
            <li>Troca quinzenal progressiva até resultado final</li>
          </ol>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mt-4">
            <p className="text-sm text-green-900">
              <strong>Tempo médio de tratamento:</strong> 6 a 18 meses, dependendo da
              complexidade do caso.
            </p>
          </div>
        </div>
      }
      technicalContent={
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">Especificações Técnicas:</h4>

          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div>
              <strong className="text-slate-700">Material:</strong>
              <p className="text-sm text-slate-600 mt-1">
                Polímero termoplástico multicamadas de grau médico (PET-G ou similar),
                livre de BPA e certificado FDA/ANVISA.
              </p>
            </div>

            <div>
              <strong className="text-slate-700">Força aplicada:</strong>
              <p className="text-sm text-slate-600 mt-1">
                0.5-1.0 N (Newtons) por dente, com movimento programado de 0.25-0.33mm
                por alinhador. Forças ortodônticas leves e contínuas.
              </p>
            </div>

            <div>
              <strong className="text-slate-700">Tecnologia de fabricação:</strong>
              <p className="text-sm text-slate-600 mt-1">
                Impressão 3D com resolução de camada de 25-50 microns. Thermoforming
                em múltiplas camadas com controle de pressão e temperatura.
              </p>
            </div>

            <div>
              <strong className="text-slate-700">Protocolo de uso:</strong>
              <p className="text-sm text-slate-600 mt-1">
                22 horas/dia, com troca a cada 7-14 dias conforme planejamento.
                Acompanhamento clínico a cada 4-8 semanas.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <p className="text-sm text-amber-900">
              <strong>Indicações clínicas:</strong> Casos leves a moderados de
              má oclusão Classe I, apinhamento leve a moderado, diastemas,
              pequenas correções de mordida.
            </p>
          </div>
        </div>
      }
    />
  )
}

/**
 * Variação compacta para uso inline
 */
export function ExpandableInfo({
  trigger,
  content,
  className
}: {
  trigger: string
  content: React.ReactNode
  className?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn('inline-block', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700
                   text-sm font-medium transition-colors group"
        aria-expanded={isExpanded}
      >
        <span className="underline decoration-dotted">{trigger}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
