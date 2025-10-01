"use client"

/**
 * Treatment Process Animations
 * FASE 3.1 - Motion Design Médico
 *
 * Animações educativas do processo de tratamento ortodôntico
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Scan, Printer, Package, Smile } from 'lucide-react'

interface ProcessStep {
  id: string
  title: string
  description: string
  icon: any
  color: string
  duration: string
  details: string[]
}

const treatmentSteps: ProcessStep[] = [
  {
    id: 'scan',
    title: 'Escaneamento 3D',
    description: 'Captura digital precisa da sua dentição',
    icon: Scan,
    color: 'from-blue-500 to-cyan-500',
    duration: '15 minutos',
    details: [
      'Scanner intraoral sem desconforto',
      'Precisão de 20 microns',
      'Modelo digital completo',
      'Sem moldagens físicas'
    ]
  },
  {
    id: 'plan',
    title: 'Planejamento Digital',
    description: 'IA cria o plano de tratamento personalizado',
    icon: Printer,
    color: 'from-purple-500 to-pink-500',
    duration: '2-3 dias',
    details: [
      'Simulação 3D do resultado',
      'Cálculo de movimentos',
      'Aprovação do paciente',
      'Número exato de alinhadores'
    ]
  },
  {
    id: 'production',
    title: 'Fabricação',
    description: 'Produção dos alinhadores personalizados',
    icon: Package,
    color: 'from-orange-500 to-red-500',
    duration: '7-10 dias',
    details: [
      'Impressão 3D de precisão',
      'Material biocompatível',
      'Controle de qualidade',
      'Embalagem individualizada'
    ]
  },
  {
    id: 'treatment',
    title: 'Tratamento',
    description: 'Uso dos alinhadores e acompanhamento',
    icon: Smile,
    color: 'from-green-500 to-emerald-500',
    duration: '6-18 meses',
    details: [
      'Troca quinzenal',
      '22h por dia de uso',
      'Acompanhamento remoto',
      'Ajustes quando necessário'
    ]
  }
]

export function TreatmentProcessAnimation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextStep = () => {
    if (currentStep < treatmentSteps.length - 1) {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  const step = treatmentSteps[currentStep]
  const StepIcon = step.icon

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-12">
        {treatmentSteps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => {
                setDirection(index > currentStep ? 1 : -1)
                setCurrentStep(index)
              }}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full
                         transition-all duration-300 ${
                index <= currentStep
                  ? 'bg-gradient-to-br ' + s.color + ' text-white shadow-lg scale-110'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              <s.icon className="h-6 w-6" />
              {index <= currentStep && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white"
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </button>

            {index < treatmentSteps.length - 1 && (
              <div className="w-24 h-1 mx-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${s.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: index < currentStep ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative min-h-[400px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-start space-x-6">
                {/* Icon */}
                <motion.div
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color}
                             flex items-center justify-center shadow-lg`}
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <StepIcon className="h-10 w-10 text-white" />
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-lg text-slate-600">{step.description}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold
                                     bg-gradient-to-r ${step.color} text-white`}>
                      {step.duration}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {step.details.map((detail, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                        className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${step.color} mt-2`} />
                        <span className="text-slate-700 text-sm">{detail}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Animated visual representation */}
                  <div className="mt-8">
                    <ProcessVisual stepId={step.id} color={step.color} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <motion.button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200
                     disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
          whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Anterior</span>
        </motion.button>

        <div className="text-sm text-slate-600">
          Passo {currentStep + 1} de {treatmentSteps.length}
        </div>

        <motion.button
          onClick={nextStep}
          disabled={currentStep === treatmentSteps.length - 1}
          className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${step.color}
                     text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors`}
          whileHover={{ scale: currentStep === treatmentSteps.length - 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentStep === treatmentSteps.length - 1 ? 1 : 0.95 }}
        >
          <span>Próximo</span>
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  )
}

// Visual representation for each step
function ProcessVisual({ stepId, color }: { stepId: string; color: string }) {
  switch (stepId) {
    case 'scan':
      return (
        <div className="relative h-32 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/50 to-transparent"
            animate={{ x: [-200, 400] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative z-10 flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              📷
            </motion.div>
          </div>
        </div>
      )

    case 'plan':
      return (
        <div className="relative h-32 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg p-4">
          <div className="grid grid-cols-5 gap-2">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className={`h-10 rounded bg-gradient-to-br ${color} opacity-30`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0.3, 0.7, 0.3], y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      )

    case 'production':
      return (
        <div className="relative h-32 bg-gradient-to-br from-slate-50 to-orange-50 rounded-lg overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
            <motion.div
              className={`h-full bg-gradient-to-r ${color}`}
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex items-center justify-center h-full space-x-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-16 h-20 rounded-lg bg-gradient-to-br ${color} opacity-50`}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  delay: i * 0.3,
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      )

    case 'treatment':
      return (
        <div className="relative h-32 bg-gradient-to-br from-slate-50 to-green-50 rounded-lg">
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl"
            >
              😁
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/30 to-transparent"
              animate={{ x: [-200, 400] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      )

    default:
      return null
  }
}
