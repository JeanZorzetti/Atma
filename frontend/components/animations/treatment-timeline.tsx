"use client"

/**
 * Interactive Treatment Timeline
 * FASE 3.1 - Motion Design Médico
 *
 * Timeline interativa mostrando evolução do tratamento ortodôntico
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Check, Clock, TrendingUp, Star } from 'lucide-react'

interface TimelineEvent {
  id: string
  week: number
  title: string
  description: string
  type: 'milestone' | 'aligner' | 'checkup' | 'complete'
  status: 'completed' | 'current' | 'upcoming'
  image?: string
  metrics?: {
    alignment: number
    comfort: number
  }
}

const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    week: 0,
    title: 'Início do Tratamento',
    description: 'Primeiro conjunto de alinhadores instalado',
    type: 'milestone',
    status: 'completed',
    metrics: { alignment: 0, comfort: 85 }
  },
  {
    id: '2',
    week: 2,
    title: 'Alinhador #2',
    description: 'Progresso inicial visível',
    type: 'aligner',
    status: 'completed',
    metrics: { alignment: 15, comfort: 90 }
  },
  {
    id: '3',
    week: 4,
    title: 'Primeira Consulta',
    description: 'Acompanhamento e ajustes',
    type: 'checkup',
    status: 'completed',
    metrics: { alignment: 25, comfort: 88 }
  },
  {
    id: '4',
    week: 6,
    title: 'Alinhador #4',
    description: 'Metade do primeiro estágio',
    type: 'aligner',
    status: 'completed',
    metrics: { alignment: 40, comfort: 92 }
  },
  {
    id: '5',
    week: 8,
    title: 'Alinhador #5',
    description: 'Movimentos mais significativos',
    type: 'aligner',
    status: 'current',
    metrics: { alignment: 55, comfort: 90 }
  },
  {
    id: '6',
    week: 10,
    title: 'Segunda Consulta',
    description: 'Avaliação de progresso',
    type: 'checkup',
    status: 'upcoming'
  },
  {
    id: '7',
    week: 12,
    title: 'Alinhador #7',
    description: 'Refinamentos finais',
    type: 'aligner',
    status: 'upcoming'
  },
  {
    id: '8',
    week: 14,
    title: 'Finalização',
    description: 'Tratamento completo - contenção',
    type: 'complete',
    status: 'upcoming'
  }
]

export function TreatmentTimeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    mockTimeline.find(e => e.status === 'current') || null
  )

  const getEventColor = (type: TimelineEvent['type'], status: TimelineEvent['status']) => {
    if (status === 'completed') return 'from-green-500 to-emerald-500'
    if (status === 'current') return 'from-blue-500 to-cyan-500'
    return 'from-slate-300 to-slate-400'
  }

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone':
        return Star
      case 'aligner':
        return TrendingUp
      case 'checkup':
        return Calendar
      case 'complete':
        return Check
    }
  }

  const currentWeek = mockTimeline.find(e => e.status === 'current')?.week || 0
  const totalWeeks = mockTimeline[mockTimeline.length - 1].week

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-3xl font-bold text-slate-900">
            Sua Jornada do Sorriso
          </h2>
          <span className="text-sm text-slate-600">
            Semana {currentWeek} de {totalWeeks}
          </span>
        </div>

        {/* Overall Progress Bar */}
        <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/50 to-transparent rounded-full"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="md:col-span-2 relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-8">
            {mockTimeline.map((event, index) => {
              const EventIcon = getEventIcon(event.type)
              const isSelected = selectedEvent?.id === event.id

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <motion.div
                    className={`absolute left-6 w-5 h-5 rounded-full bg-gradient-to-br ${getEventColor(
                      event.type,
                      event.status
                    )} border-4 border-white shadow-lg z-10`}
                    whileHover={{ scale: 1.2 }}
                  />

                  {/* Event Card */}
                  <motion.button
                    onClick={() => setSelectedEvent(event)}
                    className={`ml-16 w-full text-left p-4 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
                        : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-br ${getEventColor(
                            event.type,
                            event.status
                          )}`}
                        >
                          <EventIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-slate-900">
                              {event.title}
                            </h4>
                            {event.status === 'completed' && (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{event.week}sem</span>
                      </div>
                    </div>

                    {/* Mini Progress */}
                    {event.metrics && (
                      <div className="mt-3 flex space-x-4">
                        <div className="flex-1">
                          <div className="text-xs text-slate-600 mb-1">
                            Alinhamento: {event.metrics.alignment}%
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${event.metrics.alignment}%` }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="md:col-span-1">
          <div className="sticky top-4">
            <AnimatePresence mode="wait">
              {selectedEvent ? (
                <motion.div
                  key={selectedEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl p-6 shadow-xl border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">
                      Detalhes
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white
                                 bg-gradient-to-r ${getEventColor(
                                   selectedEvent.type,
                                   selectedEvent.status
                                 )}`}
                    >
                      {selectedEvent.status === 'completed'
                        ? 'Concluído'
                        : selectedEvent.status === 'current'
                        ? 'Em andamento'
                        : 'Próximo'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-700">{selectedEvent.description}</p>
                    </div>

                    {selectedEvent.metrics && (
                      <>
                        <div className="pt-4 border-t border-slate-200">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">
                            Métricas de Progresso
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">
                                  Alinhamento
                                </span>
                                <span className="font-semibold text-blue-600">
                                  {selectedEvent.metrics.alignment}%
                                </span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${selectedEvent.metrics.alignment}%`
                                  }}
                                  transition={{ duration: 0.8 }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Conforto</span>
                                <span className="font-semibold text-green-600">
                                  {selectedEvent.metrics.comfort}%
                                </span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${selectedEvent.metrics.comfort}%`
                                  }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Visual Representation */}
                        <div className="pt-4 border-t border-slate-200">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">
                            Evolução Visual
                          </h4>
                          <div className="relative h-24 bg-gradient-to-r from-slate-100 to-blue-100 rounded-lg overflow-hidden">
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center text-4xl"
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0, -5, 0]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              {selectedEvent.status === 'completed'
                                ? '✨'
                                : selectedEvent.status === 'current'
                                ? '🦷'
                                : '⏳'}
                            </motion.div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Next Steps */}
                    {selectedEvent.status === 'current' && (
                      <div className="pt-4 border-t border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">
                          Próximos Passos
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span>Usar 22h por dia</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span>Trocar alinhador em 2 semanas</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span>Higienizar após refeições</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-100 rounded-xl p-8 text-center"
                >
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">
                    Selecione um evento na timeline
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
