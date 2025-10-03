"use client"

/**
 * Teeth Movement 3D Visualization
 * FASE 3.1 - Motion Design Médico
 *
 * Visualização 3D interativa do movimento dentário com alinhadores
 */

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Zap } from 'lucide-react'
import * as THREE from 'three'

interface ToothProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  isMoving?: boolean
  targetPosition?: [number, number, number]
  animationProgress?: number
}

// Componente de dente individual
function Tooth({
  position,
  rotation = [0, 0, 0],
  color = '#f5f5dc',
  isMoving = false,
  targetPosition,
  animationProgress = 0
}: ToothProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current && isMoving && targetPosition) {
      // Animar movimento suave do dente
      meshRef.current.position.x = THREE.MathUtils.lerp(
        position[0],
        targetPosition[0],
        animationProgress
      )
      meshRef.current.position.y = THREE.MathUtils.lerp(
        position[1],
        targetPosition[1],
        animationProgress
      )
      meshRef.current.position.z = THREE.MathUtils.lerp(
        position[2],
        targetPosition[2],
        animationProgress
      )
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      {/* Corpo do dente - formato simplificado */}
      <group>
        {/* Coroa */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.3, 0.6, 0.25]} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>

        {/* Raiz */}
        <mesh position={[0, -0.3, 0]} scale={[0.8, 1, 0.8]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Brilho especular */}
      <pointLight position={[0, 0.5, 0.5]} intensity={0.3} color="#ffffff" />
    </mesh>
  )
}

// Alinhador transparente
function Aligner({ visible = true, opacity = 0.3 }) {
  if (!visible) return null

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[5, 1.2, 1.5]} />
      <meshPhysicalMaterial
        color="#4dabf7"
        transparent
        opacity={opacity}
        transmission={0.9}
        thickness={0.5}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  )
}

// Arcada dentária completa
function TeethArch({ animationProgress = 0, showMovement = false }) {
  // Posições iniciais dos dentes superiores (simplificado - 6 dentes frontais)
  const initialPositions: [number, number, number][] = [
    [-1.5, 0, 0],  // Esquerda
    [-0.9, 0, 0.1],
    [-0.3, 0, 0.15],
    [0.3, 0, 0.15],
    [0.9, 0, 0.1],
    [1.5, 0, 0]    // Direita
  ]

  // Posições finais após tratamento (mais alinhadas)
  const targetPositions: [number, number, number][] = [
    [-1.5, 0, 0],
    [-0.9, 0, 0.05],  // Menos projetado
    [-0.3, 0, 0.05],  // Alinhado
    [0.3, 0, 0.05],   // Alinhado
    [0.9, 0, 0.05],   // Menos projetado
    [1.5, 0, 0]
  ]

  return (
    <group>
      {initialPositions.map((pos, index) => (
        <Tooth
          key={index}
          position={pos}
          isMoving={showMovement}
          targetPosition={targetPositions[index]}
          animationProgress={animationProgress}
          color={index === 1 || index === 4 ? '#ffe4b5' : '#f5f5dc'} // Destaca dentes que movem mais
        />
      ))}
    </group>
  )
}

// Setas de movimento
function MovementArrows({ visible = false }) {
  if (!visible) return null

  return (
    <group>
      <arrowHelper args={[
        new THREE.Vector3(-1, 0, -1).normalize(),
        new THREE.Vector3(-0.9, 0, 0.1),
        0.3,
        0xff6b6b,
        0.1,
        0.05
      ]} />
      <arrowHelper args={[
        new THREE.Vector3(1, 0, -1).normalize(),
        new THREE.Vector3(0.9, 0, 0.1),
        0.3,
        0xff6b6b,
        0.1,
        0.05
      ]} />
    </group>
  )
}

// Componente interno que controla a animação (precisa estar dentro do Canvas)
function AnimationController({
  isPlaying,
  progress,
  onProgressChange,
  onPlayingChange
}: {
  isPlaying: boolean
  progress: number
  onProgressChange: (progress: number) => void
  onPlayingChange: (isPlaying: boolean) => void
}) {
  useFrame(() => {
    if (isPlaying && progress < 1) {
      onProgressChange(Math.min(progress + 0.01, 1))
    } else if (progress >= 1) {
      onPlayingChange(false)
    }
  })

  return null // Este componente não renderiza nada, apenas executa a animação
}

export function TeethMovementVisualization() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showAligner, setShowAligner] = useState(true)
  const [showArrows, setShowArrows] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handlePlayPause = () => {
    if (progress >= 1) {
      setProgress(0)
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setProgress(0)
    setIsPlaying(false)
  }

  if (!isMounted) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-100">Carregando visualização 3D...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl overflow-hidden">
      {/* Canvas 3D */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} />

        {/* Iluminação */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4dabf7" />

        {/* Controlador de animação */}
        <AnimationController
          isPlaying={isPlaying}
          progress={progress}
          onProgressChange={setProgress}
          onPlayingChange={setIsPlaying}
        />

        {/* Cena */}
        <TeethArch animationProgress={progress} showMovement={isPlaying || progress > 0} />
        <Aligner visible={showAligner} opacity={0.3 + (progress * 0.2)} />
        <MovementArrows visible={showArrows} />

        {/* Sombras de contato */}
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
        />

        {/* Ambiente */}
        <Environment preset="city" />

        {/* Controles de órbita */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-medium">
              Progresso do Tratamento
            </span>
            <span className="text-blue-400 text-sm font-mono">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
              style={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={handlePlayPause}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600
                         text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Iniciar</span>
                </>
              )}
            </motion.button>

            <motion.button
              onClick={handleReset}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Reiniciar"
            >
              <RotateCcw className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAligner(!showAligner)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                showAligner
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Alinhador
            </button>

            <button
              onClick={() => setShowArrows(!showArrows)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                showArrows
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Zap className="h-4 w-4 inline mr-1" />
              Forças
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-white/70 text-xs">
          <p>🖱️ Arraste para rotacionar • 🔍 Scroll para zoom • 📱 Touch para interagir</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-4 rounded-lg">
        <h4 className="text-white font-semibold mb-2 text-sm">Legenda</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400/50 rounded"></div>
            <span className="text-white/80">Alinhador transparente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-200 rounded"></div>
            <span className="text-white/80">Dentes em movimento</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className="text-white/80">Direção da força</span>
          </div>
        </div>
      </div>
    </div>
  )
}
