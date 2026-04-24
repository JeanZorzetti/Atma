/**
 * Cognitive Load Measurement Hook
 * FASE 2.3 - UX Cognitivo Avançado
 *
 * Mede e rastreia a carga cognitiva do usuário baseado em interações
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export interface CognitiveMetrics {
  taskComplexity: number // 0-100
  userConfidence: number // 0-100
  errorRate: number // 0-100
  timeOnTask: number // seconds
  helpRequestsCount: number
  interactionDensity: number // actions per minute
  cognitiveLoad: 'low' | 'medium' | 'high' | 'critical'
}

interface CognitiveEvent {
  type: 'error' | 'help' | 'completion' | 'abandon' | 'hesitation'
  timestamp: number
  context: string
  metadata?: Record<string, any>
}

export function useCognitiveLoad(taskId: string) {
  const [metrics, setMetrics] = useState<CognitiveMetrics>({
    taskComplexity: 50,
    userConfidence: 100,
    errorRate: 0,
    timeOnTask: 0,
    helpRequestsCount: 0,
    interactionDensity: 0,
    cognitiveLoad: 'low'
  })

  const events = useRef<CognitiveEvent[]>([])
  const startTime = useRef<number>(Date.now())
  const interactions = useRef<number>(0)

  // Track time on task
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        timeOnTask: Math.floor((Date.now() - startTime.current) / 1000)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Record cognitive event
  const recordEvent = useCallback((
    type: CognitiveEvent['type'],
    context: string,
    metadata?: Record<string, any>
  ) => {
    const event: CognitiveEvent = {
      type,
      timestamp: Date.now(),
      context,
      metadata
    }

    events.current.push(event)
    interactions.current++

    // Update metrics based on event
    setMetrics(prev => {
      const timeElapsed = (Date.now() - startTime.current) / 1000 / 60 // minutes
      const interactionDensity = interactions.current / Math.max(timeElapsed, 1)

      let newMetrics = { ...prev, interactionDensity }

      switch (type) {
        case 'error':
          const totalAttempts = events.current.filter(e =>
            e.type === 'error' || e.type === 'completion'
          ).length
          newMetrics.errorRate = (events.current.filter(e => e.type === 'error').length / totalAttempts) * 100
          newMetrics.userConfidence = Math.max(0, prev.userConfidence - 10)
          break

        case 'help':
          newMetrics.helpRequestsCount = prev.helpRequestsCount + 1
          newMetrics.userConfidence = Math.max(0, prev.userConfidence - 5)
          break

        case 'completion':
          newMetrics.userConfidence = Math.min(100, prev.userConfidence + 15)
          break

        case 'abandon':
          newMetrics.userConfidence = Math.max(0, prev.userConfidence - 20)
          break

        case 'hesitation':
          newMetrics.userConfidence = Math.max(0, prev.userConfidence - 3)
          break
      }

      // Calculate overall cognitive load
      newMetrics.cognitiveLoad = calculateCognitiveLoad(newMetrics)

      return newMetrics
    })

    // Send to analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'cognitive_event', {
        task_id: taskId,
        event_type: type,
        context,
        ...metadata
      })
    }
  }, [taskId])

  // Calculate cognitive load level
  const calculateCognitiveLoad = (m: CognitiveMetrics): CognitiveMetrics['cognitiveLoad'] => {
    const loadScore =
      (m.errorRate * 0.3) +
      ((100 - m.userConfidence) * 0.3) +
      (m.helpRequestsCount * 5) +
      (Math.min(m.interactionDensity, 10) * 2)

    if (loadScore < 25) return 'low'
    if (loadScore < 50) return 'medium'
    if (loadScore < 75) return 'high'
    return 'critical'
  }

  // Track form field focus time (hesitation indicator)
  const trackFieldFocus = useCallback((fieldName: string) => {
    const focusStart = Date.now()

    return () => {
      const focusTime = (Date.now() - focusStart) / 1000
      if (focusTime > 5) {
        recordEvent('hesitation', `field-${fieldName}`, { focusTime })
      }
    }
  }, [recordEvent])

  // Get recommendations based on cognitive load
  const getRecommendations = useCallback((): string[] => {
    const recommendations: string[] = []

    if (metrics.cognitiveLoad === 'critical' || metrics.cognitiveLoad === 'high') {
      recommendations.push('Considere usar o modo simplificado')
      if (metrics.errorRate > 30) {
        recommendations.push('Há muitos erros. Que tal ver exemplos?')
      }
      if (metrics.helpRequestsCount > 3) {
        recommendations.push('Precisa de ajuda? Entre em contato conosco')
      }
    }

    if (metrics.timeOnTask > 300) { // 5 minutes
      recommendations.push('Salve seu progresso para continuar depois')
    }

    if (metrics.interactionDensity > 8) {
      recommendations.push('Vá com calma, não há pressa')
    }

    return recommendations
  }, [metrics])

  return {
    metrics,
    recordEvent,
    trackFieldFocus,
    getRecommendations,

    // Convenience methods
    trackError: (context: string) => recordEvent('error', context),
    trackHelp: (context: string) => recordEvent('help', context),
    trackCompletion: (context: string) => recordEvent('completion', context),
    trackAbandon: (context: string) => recordEvent('abandon', context)
  }
}

/**
 * Hook para simplificação automática baseada em carga cognitiva
 */
export function useAdaptiveComplexity(taskId: string) {
  const { metrics, ...cognitive } = useCognitiveLoad(taskId)
  const [simplificationLevel, setSimplificationLevel] = useState<'full' | 'simplified' | 'minimal'>('full')

  useEffect(() => {
    // Auto-simplify based on cognitive load
    if (metrics.cognitiveLoad === 'critical') {
      setSimplificationLevel('minimal')
    } else if (metrics.cognitiveLoad === 'high') {
      setSimplificationLevel('simplified')
    } else if (metrics.cognitiveLoad === 'medium' && metrics.errorRate > 40) {
      setSimplificationLevel('simplified')
    } else {
      setSimplificationLevel('full')
    }
  }, [metrics.cognitiveLoad, metrics.errorRate])

  return {
    ...cognitive,
    metrics,
    simplificationLevel,
    setSimplificationLevel,
    shouldShowSimplified: simplificationLevel !== 'full',
    shouldShowMinimal: simplificationLevel === 'minimal'
  }
}

/**
 * Hook para rastreamento de performance de formulários
 */
export function useFormCognitiveTracking(formId: string) {
  const cognitive = useCognitiveLoad(formId)
  const fieldMetrics = useRef<Record<string, {
    focusCount: number
    totalFocusTime: number
    errors: number
    changes: number
  }>>({})

  const trackField = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change' | 'error') => {
    if (!fieldMetrics.current[fieldName]) {
      fieldMetrics.current[fieldName] = {
        focusCount: 0,
        totalFocusTime: 0,
        errors: 0,
        changes: 0
      }
    }

    const field = fieldMetrics.current[fieldName]

    switch (action) {
      case 'focus':
        field.focusCount++
        break
      case 'change':
        field.changes++
        break
      case 'error':
        field.errors++
        cognitive.trackError(`form-field-${fieldName}`)
        break
    }
  }, [cognitive])

  const getFieldDifficulty = useCallback((fieldName: string) => {
    const field = fieldMetrics.current[fieldName]
    if (!field) return 'easy'

    const difficultyScore =
      (field.errors * 10) +
      (field.focusCount * 2) +
      (field.changes > 5 ? 5 : 0)

    if (difficultyScore < 10) return 'easy'
    if (difficultyScore < 25) return 'medium'
    return 'hard'
  }, [])

  const getProblematicFields = useCallback(() => {
    return Object.entries(fieldMetrics.current)
      .filter(([_, metrics]) => metrics.errors > 2 || metrics.focusCount > 3)
      .map(([fieldName]) => fieldName)
  }, [])

  return {
    ...cognitive,
    trackField,
    getFieldDifficulty,
    getProblematicFields
  }
}
