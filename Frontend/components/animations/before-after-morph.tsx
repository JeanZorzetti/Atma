"use client"

/**
 * Before/After Morphing + Progress Tracking + Educational Videos
 * FASE 3.1 - Motion Design Médico (Consolidado)
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Pause, RotateCcw, TrendingUp, Award, Clock } from 'lucide-react'

// Before/After Comparison with Slider
export function BeforeAfterMorph() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isAnimating, setIsAnimating] = useState(false)

  const startAnimation = () => {
    setIsAnimating(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += 2
      setSliderPosition(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 30)
  }

  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-xl overflow-hidden group">
      {/* Before Image */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">😬</div>
          <p className="text-white font-medium">ANTES</p>
          <p className="text-slate-400 text-sm mt-2">Dentes desalinhados</p>
        </div>
      </div>

      {/* After Image (revealed by slider) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">😁</div>
          <p className="text-white font-medium">DEPOIS</p>
          <p className="text-blue-100 text-sm mt-2">Sorriso perfeito</p>
        </div>
      </motion.div>

      {/* Slider Handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={(e, info) => {
          const newPos = Math.max(0, Math.min(100, sliderPosition + (info.delta.x / 4)))
          setSliderPosition(newPos)
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
          <ArrowRight className="h-6 w-6 text-slate-900" />
        </div>
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          onClick={startAnimation}
          disabled={isAnimating}
          className="px-4 py-2 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-sm font-medium flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{isAnimating ? 'Pausar' : 'Animar'}</span>
        </motion.button>
        <motion.button
          onClick={() => setSliderPosition(50)}
          className="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  )
}

// Visual Progress Tracker
export function VisualProgressTracker({ currentWeek = 8, totalWeeks = 24 }) {
  const progress = (currentWeek / totalWeeks) * 100
  const milestones = [
    { week: 0, label: 'Início', icon: '🚀' },
    { week: 8, label: '1º Mês', icon: '📅' },
    { week: 16, label: '4 Meses', icon: '⭐' },
    { week: 24, label: 'Completo', icon: '🏆' }
  ]

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-900">Seu Progresso</h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{Math.round(progress)}%</div>
          <div className="text-sm text-slate-600">Semana {currentWeek}/{totalWeeks}</div>
        </div>
      </div>

      {/* Visual Progress */}
      <div className="relative mb-8">
        <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Milestones */}
        <div className="absolute -top-2 left-0 right-0">
          {milestones.map((milestone) => {
            const position = (milestone.week / totalWeeks) * 100
            const isReached = currentWeek >= milestone.week

            return (
              <motion.div
                key={milestone.week}
                className="absolute -translate-x-1/2"
                style={{ left: `${position}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: milestone.week * 0.1 }}
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-lg
                            ${isReached ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-white'}
                            shadow-lg border-2 ${isReached ? 'border-white' : 'border-slate-200'}`}
                  whileHover={{ scale: 1.2 }}
                >
                  {milestone.icon}
                </motion.div>
                <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p className={`text-xs font-medium ${isReached ? 'text-blue-600' : 'text-slate-400'}`}>
                    {milestone.label}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-12">
        <div className="text-center p-3 bg-white rounded-lg">
          <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-slate-900">85%</div>
          <div className="text-xs text-slate-600">Alinhamento</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg">
          <Award className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-slate-900">95%</div>
          <div className="text-xs text-slate-600">Compliance</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg">
          <Clock className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-slate-900">16</div>
          <div className="text-xs text-slate-600">Sem. restantes</div>
        </div>
      </div>
    </div>
  )
}

// Educational Video Player
export function EducationalVideoPlayer() {
  const [currentVideo, setCurrentVideo] = useState(0)
  const videos = [
    { id: 1, title: 'Como usar os alinhadores', duration: '2:30', thumbnail: '📺' },
    { id: 2, title: 'Higienização correta', duration: '1:45', thumbnail: '🦷' },
    { id: 3, title: 'O que esperar', duration: '3:15', thumbnail: '💡' },
    { id: 4, title: 'Dicas de conforto', duration: '2:00', thumbnail: '😊' }
  ]

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Video Player */}
      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
        <motion.div
          key={currentVideo}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">{videos[currentVideo].thumbnail}</div>
          <h3 className="text-white text-xl font-semibold mb-2">{videos[currentVideo].title}</h3>
          <motion.button
            className="px-6 py-3 bg-white text-slate-900 rounded-full font-medium flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="h-5 w-5" />
            <span>Assistir ({videos[currentVideo].duration})</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Playlist */}
      <div className="p-4 bg-slate-800">
        <h4 className="text-white font-semibold mb-3">Próximos vídeos</h4>
        <div className="space-y-2">
          {videos.map((video, idx) => (
            <motion.button
              key={video.id}
              onClick={() => setCurrentVideo(idx)}
              className={`w-full p-3 rounded-lg flex items-center space-x-3 text-left transition-colors
                        ${idx === currentVideo ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl">{video.thumbnail}</div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{video.title}</div>
                <div className="text-slate-400 text-xs">{video.duration}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
