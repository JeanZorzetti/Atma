"use client"

/**
 * Página de Visualização 3D - Motion Design Médico
 * FASE 3.1 - Exemplo Completo
 */

import dynamic from 'next/dynamic'
import {
  TreatmentProcessAnimation,
  TreatmentTimeline,
  BeforeAfterMorph,
  VisualProgressTracker,
  EducationalVideoPlayer
} from '@/components/animations'
import { motion } from 'framer-motion'
import { Eye, Zap, Film } from 'lucide-react'

// Import Three.js component with SSR disabled
const TeethMovementVisualization = dynamic(
  () => import('@/components/3d').then(mod => ({ default: mod.TeethMovementVisualization })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando visualização 3D...</p>
        </div>
      </div>
    )
  }
)

export default function Visualizacao3DPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Visualize Seu Sorriso Perfeito
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Tecnologia 3D interativa para você entender cada etapa do seu tratamento ortodôntico
          </p>
        </motion.div>

        {/* 3D Visualization */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Eye className="h-6 w-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900">Movimento Dentário 3D</h2>
          </div>
          <TeethMovementVisualization />
          <p className="mt-4 text-slate-600 text-center">
            🖱️ Interaja com o modelo 3D • Arraste para rotacionar • Scroll para zoom
          </p>
        </motion.section>

        {/* Before/After */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Antes & Depois</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <BeforeAfterMorph />
            <VisualProgressTracker currentWeek={12} totalWeeks={24} />
          </div>
        </motion.section>

        {/* Treatment Process */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="h-6 w-6 text-purple-600" />
            <h2 className="text-3xl font-bold text-slate-900">Como Funciona</h2>
          </div>
          <TreatmentProcessAnimation />
        </motion.section>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Linha do Tempo</h2>
          <TreatmentTimeline />
        </motion.section>

        {/* Educational Videos */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Film className="h-6 w-6 text-red-600" />
            <h2 className="text-3xl font-bold text-slate-900">Vídeos Educativos</h2>
          </div>
          <EducationalVideoPlayer />
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Pronto para começar?</h3>
          <p className="text-xl mb-8 opacity-90">
            Agende sua avaliação e veja seu plano de tratamento em 3D
          </p>
          <motion.button
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Agendar Avaliação Gratuita
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
