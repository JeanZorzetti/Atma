/**
 * Voice Search Hook - Browser Native Speech Recognition
 * FASE 2.2 - Mobile-First Optimization
 */

import { useState, useEffect, useRef, useCallback } from 'react'

interface VoiceSearchConfig {
  language: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  timeout: number
}

interface VoiceSearchState {
  isSupported: boolean
  isListening: boolean
  isProcessing: boolean
  transcript: string
  interimTranscript: string
  confidence: number
  error: string | null
}

interface VoiceCommand {
  patterns: string[]
  action: (matches: string[]) => void
  description: string
}

interface VoiceSearchResult {
  query: string
  confidence: number
  alternatives: string[]
  timestamp: Date
}

// Default medical/orthodontic voice commands
const defaultCommands: VoiceCommand[] = [
  {
    patterns: ['encontrar ortodontista', 'buscar doutor', 'achar dentista'],
    action: () => window.location.href = '/pacientes/encontre-doutor',
    description: 'Encontrar ortodontista'
  },
  {
    patterns: ['ver preços', 'quanto custa', 'valores', 'preço'],
    action: () => window.location.href = '/pacientes/precos',
    description: 'Ver preços e financiamento'
  },
  {
    patterns: ['agendar consulta', 'marcar consulta', 'contato'],
    action: () => window.location.href = '/contato',
    description: 'Agendar consulta'
  },
  {
    patterns: ['página inicial', 'home', 'início'],
    action: () => window.location.href = '/',
    description: 'Ir para página inicial'
  },
  {
    patterns: ['sobre atma', 'sobre nós', 'quem somos'],
    action: () => window.location.href = '/sobre',
    description: 'Sobre a Atma Aligner'
  },
  {
    patterns: ['antes e depois', 'resultados', 'transformações'],
    action: () => window.location.href = '/pacientes/antes-depois',
    description: 'Ver resultados'
  }
]

export function useVoiceSearch(
  config?: Partial<VoiceSearchConfig>,
  onResult?: (result: VoiceSearchResult) => void,
  commands: VoiceCommand[] = defaultCommands
) {
  const defaultConfig: VoiceSearchConfig = {
    language: 'pt-BR',
    continuous: false,
    interimResults: true,
    maxAlternatives: 3,
    timeout: 10000,
    ...config
  }

  const [state, setState] = useState<VoiceSearchState>({
    isSupported: false,
    isListening: false,
    isProcessing: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    error: null
  })

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Check for browser support
  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const isSupported = !!SpeechRecognition

    setState(prev => ({
      ...prev,
      isSupported
    }))

    if (isSupported) {
      const recognition = new SpeechRecognition()
      recognition.lang = defaultConfig.language
      recognition.continuous = defaultConfig.continuous
      recognition.interimResults = defaultConfig.interimResults
      recognition.maxAlternatives = defaultConfig.maxAlternatives

      recognitionRef.current = recognition
    }
  }, [])

  // Process voice commands
  const processCommand = useCallback((transcript: string) => {
    const normalizedTranscript = transcript.toLowerCase().trim()

    for (const command of commands) {
      for (const pattern of command.patterns) {
        if (normalizedTranscript.includes(pattern.toLowerCase())) {
          console.log('[Voice Search] Command matched:', pattern)
          command.action([normalizedTranscript])
          return true
        }
      }
    }
    return false
  }, [commands])

  // Start voice recognition
  const startListening = useCallback(() => {
    if (!recognitionRef.current || state.isListening) return

    setState(prev => ({
      ...prev,
      isListening: true,
      isProcessing: false,
      transcript: '',
      interimTranscript: '',
      error: null
    }))

    const recognition = recognitionRef.current

    recognition.onstart = () => {
      console.log('[Voice Search] Started listening')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript

        if (result.isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setState(prev => ({
        ...prev,
        transcript: finalTranscript,
        interimTranscript: interimTranscript,
        confidence: event.results[0] ? event.results[0][0].confidence : 0
      }))

      // Process final results
      if (finalTranscript) {
        const alternatives = []
        if (event.results[0]) {
          for (let i = 0; i < event.results[0].length; i++) {
            alternatives.push(event.results[0][i].transcript)
          }
        }

        const result: VoiceSearchResult = {
          query: finalTranscript,
          confidence: event.results[0] ? event.results[0][0].confidence : 0,
          alternatives,
          timestamp: new Date()
        }

        onResult?.(result)

        // Try to process as command
        const commandProcessed = processCommand(finalTranscript)

        if (!commandProcessed) {
          // If no command matched, treat as search query
          console.log('[Voice Search] No command matched, treating as search:', finalTranscript)
        }
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[Voice Search] Error:', event.error)

      let errorMessage = 'Erro no reconhecimento de voz'
      switch (event.error) {
        case 'network':
          errorMessage = 'Erro de conexão. Verifique sua internet.'
          break
        case 'not-allowed':
          errorMessage = 'Permissão para microfone negada'
          break
        case 'no-speech':
          errorMessage = 'Nenhuma fala detectada'
          break
        case 'aborted':
          errorMessage = 'Reconhecimento interrompido'
          break
      }

      setState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false,
        error: errorMessage
      }))
    }

    recognition.onend = () => {
      console.log('[Voice Search] Stopped listening')
      setState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false
      }))

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    // Set timeout for automatic stop
    timeoutRef.current = setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }, defaultConfig.timeout)

    try {
      recognition.start()
    } catch (error) {
      console.error('[Voice Search] Failed to start:', error)
      setState(prev => ({
        ...prev,
        isListening: false,
        error: 'Falha ao iniciar reconhecimento de voz'
      }))
    }
  }, [state.isListening, onResult, processCommand, defaultConfig.timeout])

  // Stop voice recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop()
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setState(prev => ({
      ...prev,
      isListening: false,
      isProcessing: false
    }))
  }, [state.isListening])

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [state.isListening, startListening, stopListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,

    // Helper methods
    clearTranscript: () => setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      error: null
    })),

    // Get available commands for UI display
    getAvailableCommands: () => commands.map(cmd => ({
      patterns: cmd.patterns,
      description: cmd.description
    }))
  }
}

// Specialized hook for medical search
export function useVoiceMedicalSearch() {
  const medicalCommands: VoiceCommand[] = [
    ...defaultCommands,
    {
      patterns: ['alinhador invisível', 'aparelho transparente', 'invisalign'],
      action: () => window.location.href = '/pacientes/tratamento',
      description: 'Informações sobre alinhadores'
    },
    {
      patterns: ['dor de dente', 'dor dental', 'urgência'],
      action: () => window.open('tel:+551199999999'),
      description: 'Contato de emergência'
    },
    {
      patterns: ['whatsapp', 'mensagem', 'conversar'],
      action: () => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os alinhadores Atma.'),
      description: 'Abrir WhatsApp'
    }
  ]

  return useVoiceSearch(
    {
      language: 'pt-BR',
      continuous: false,
      interimResults: true,
      timeout: 8000
    },
    (result) => {
      // Log medical search for analytics
      console.log('[Medical Voice Search]', result)

      // Could send to analytics service
      if (typeof gtag !== 'undefined') {
        gtag('event', 'voice_search', {
          search_term: result.query,
          confidence: result.confidence
        })
      }
    },
    medicalCommands
  )
}

// Hook for accessibility enhancement
export function useVoiceAccessibility() {
  const accessibilityCommands: VoiceCommand[] = [
    {
      patterns: ['aumentar fonte', 'fonte maior', 'texto grande'],
      action: () => {
        document.documentElement.style.fontSize = '120%'
      },
      description: 'Aumentar tamanho da fonte'
    },
    {
      patterns: ['diminuir fonte', 'fonte menor', 'texto pequeno'],
      action: () => {
        document.documentElement.style.fontSize = '100%'
      },
      description: 'Diminuir tamanho da fonte'
    },
    {
      patterns: ['alto contraste', 'contraste alto'],
      action: () => {
        document.documentElement.classList.toggle('high-contrast')
      },
      description: 'Alternar alto contraste'
    },
    {
      patterns: ['ler página', 'leitura'],
      action: () => {
        // Implement text-to-speech for page content
        const content = document.querySelector('main')?.textContent || ''
        if ('speechSynthesis' in window && content) {
          const utterance = new SpeechSynthesisUtterance(content.slice(0, 500))
          utterance.lang = 'pt-BR'
          speechSynthesis.speak(utterance)
        }
      },
      description: 'Ler conteúdo da página'
    }
  ]

  return useVoiceSearch(
    {
      language: 'pt-BR',
      continuous: true,
      interimResults: false,
      timeout: 15000
    },
    undefined,
    accessibilityCommands
  )
}