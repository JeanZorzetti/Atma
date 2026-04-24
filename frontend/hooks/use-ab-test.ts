/**
 * A/B Testing Hook para Clarity
 * FASE 2.3 - UX Cognitivo Avançado
 *
 * Sistema de testes A/B focado em clareza e simplicidade da informação
 */

import { useState, useEffect, useCallback } from 'react'

export type ABVariant = 'A' | 'B'

interface ABTest {
  id: string
  name: string
  description: string
  variants: {
    A: { name: string; description: string }
    B: { name: string; description: string }
  }
  metrics: {
    conversionGoal?: string
    secondaryMetrics?: string[]
  }
}

interface ABTestResult {
  testId: string
  variant: ABVariant
  userId: string
  startTime: number
  events: {
    type: string
    timestamp: number
    data?: any
  }[]
  converted: boolean
}

// Client-side AB test configuration
const abTests: Record<string, ABTest> = {
  'terminology-simplicity': {
    id: 'terminology-simplicity',
    name: 'Simplicidade de Terminologia',
    description: 'Compara linguagem técnica vs. simplificada',
    variants: {
      A: {
        name: 'Técnico',
        description: 'Usa terminologia médica tradicional'
      },
      B: {
        name: 'Simplificado',
        description: 'Usa linguagem simplificada para leigos'
      }
    },
    metrics: {
      conversionGoal: 'form_completion',
      secondaryMetrics: ['help_clicks', 'time_on_page', 'error_rate']
    }
  },
  'information-density': {
    id: 'information-density',
    name: 'Densidade de Informação',
    description: 'Testa quantidade de informação apresentada',
    variants: {
      A: {
        name: 'Completa',
        description: 'Mostra todas as informações de uma vez'
      },
      B: {
        name: 'Progressive',
        description: 'Usa progressive disclosure'
      }
    },
    metrics: {
      conversionGoal: 'cta_click',
      secondaryMetrics: ['scroll_depth', 'engagement_time']
    }
  },
  'help-visibility': {
    id: 'help-visibility',
    name: 'Visibilidade de Ajuda',
    description: 'Compara ajuda sempre visível vs. contextual',
    variants: {
      A: {
        name: 'Sempre Visível',
        description: 'Ícones de ajuda sempre visíveis'
      },
      B: {
        name: 'Contextual',
        description: 'Ajuda aparece apenas quando relevante'
      }
    },
    metrics: {
      conversionGoal: 'task_completion',
      secondaryMetrics: ['help_usage', 'task_time', 'abandonment_rate']
    }
  }
}

export function useABTest(testId: string) {
  const [variant, setVariant] = useState<ABVariant>('A')
  const [isLoading, setIsLoading] = useState(true)
  const test = abTests[testId]

  useEffect(() => {
    if (!test) {
      console.warn(`AB test "${testId}" not found`)
      setIsLoading(false)
      return
    }

    // Check if user already has a variant assigned
    const storedVariant = localStorage.getItem(`ab-test-${testId}`)

    if (storedVariant === 'A' || storedVariant === 'B') {
      setVariant(storedVariant)
    } else {
      // Assign random variant (50/50 split)
      const newVariant: ABVariant = Math.random() < 0.5 ? 'A' : 'B'
      setVariant(newVariant)
      localStorage.setItem(`ab-test-${testId}`, newVariant)

      // Track assignment
      trackABEvent(testId, 'assigned', { variant: newVariant })
    }

    setIsLoading(false)
  }, [testId, test])

  const trackABEvent = useCallback((
    testId: string,
    eventType: string,
    data?: any
  ) => {
    const userId = getUserId()
    const event = {
      testId,
      variant,
      userId,
      eventType,
      timestamp: Date.now(),
      data
    }

    // Store event locally
    const events = JSON.parse(localStorage.getItem(`ab-events-${testId}`) || '[]')
    events.push(event)
    localStorage.setItem(`ab-events-${testId}`, JSON.stringify(events))

    // Send to analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'ab_test', {
        test_id: testId,
        variant,
        event_type: eventType,
        ...data
      })
    }
  }, [variant])

  const trackConversion = useCallback(() => {
    trackABEvent(testId, 'conversion')
  }, [testId, trackABEvent])

  const trackMetric = useCallback((metricName: string, value: any) => {
    trackABEvent(testId, 'metric', { metric: metricName, value })
  }, [testId, trackABEvent])

  return {
    variant,
    isVariantA: variant === 'A',
    isVariantB: variant === 'B',
    isLoading,
    test,
    trackConversion,
    trackMetric,
    trackEvent: (eventType: string, data?: any) => trackABEvent(testId, eventType, data)
  }
}

/**
 * Hook para comparação de clareza de conteúdo
 */
export function useClarityTest(testId: string = 'terminology-simplicity') {
  const { variant, trackConversion, trackMetric, trackEvent } = useABTest(testId)

  const getTerm = useCallback((technical: string, simple: string) => {
    return variant === 'A' ? technical : simple
  }, [variant])

  const trackComprehension = useCallback((understood: boolean) => {
    trackMetric('comprehension', understood ? 1 : 0)
  }, [trackMetric])

  const trackHelpRequest = useCallback((term: string) => {
    trackEvent('help_request', { term })
  }, [trackEvent])

  return {
    variant,
    useTechnicalTerms: variant === 'A',
    useSimpleTerms: variant === 'B',
    getTerm,
    trackConversion,
    trackComprehension,
    trackHelpRequest
  }
}

/**
 * Hook para testar progressive disclosure
 */
export function useProgressiveDisclosureTest(testId: string = 'information-density') {
  const { variant, trackConversion, trackMetric } = useABTest(testId)

  const showAllInfo = variant === 'A'
  const showProgressive = variant === 'B'

  const trackExpansion = useCallback((section: string) => {
    if (showProgressive) {
      trackMetric('section_expanded', section)
    }
  }, [showProgressive, trackMetric])

  return {
    variant,
    showAllInfo,
    showProgressive,
    trackConversion,
    trackExpansion
  }
}

// Helper: Get or create user ID
function getUserId(): string {
  let userId = localStorage.getItem('ab-user-id')

  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('ab-user-id', userId)
  }

  return userId
}

/**
 * Admin: Get AB test results (for analysis)
 */
export function getABTestResults(testId: string): ABTestResult[] {
  const events = JSON.parse(localStorage.getItem(`ab-events-${testId}`) || '[]')

  // Group events by user
  const userSessions: Record<string, ABTestResult> = {}

  events.forEach((event: any) => {
    if (!userSessions[event.userId]) {
      userSessions[event.userId] = {
        testId: event.testId,
        variant: event.variant,
        userId: event.userId,
        startTime: event.timestamp,
        events: [],
        converted: false
      }
    }

    userSessions[event.userId].events.push({
      type: event.eventType,
      timestamp: event.timestamp,
      data: event.data
    })

    if (event.eventType === 'conversion') {
      userSessions[event.userId].converted = true
    }
  })

  return Object.values(userSessions)
}

/**
 * Admin: Calculate AB test statistics
 */
export function calculateABStats(testId: string) {
  const results = getABTestResults(testId)

  const variantA = results.filter(r => r.variant === 'A')
  const variantB = results.filter(r => r.variant === 'B')

  const stats = {
    total: results.length,
    variantA: {
      count: variantA.length,
      conversions: variantA.filter(r => r.converted).length,
      conversionRate: variantA.length > 0
        ? (variantA.filter(r => r.converted).length / variantA.length) * 100
        : 0
    },
    variantB: {
      count: variantB.length,
      conversions: variantB.filter(r => r.converted).length,
      conversionRate: variantB.length > 0
        ? (variantB.filter(r => r.converted).length / variantB.length) * 100
        : 0
    }
  }

  return stats
}
