"use client"

import { useEffect } from 'react'
import Clarity from '@microsoft/clarity'

export default function ClarityScript() {
  useEffect(() => {
    console.log('🔍 [Clarity] Component mounted')

    // Verificar se está em produção e se há um Clarity ID configurado
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID

    console.log('🔍 [Clarity] ID encontrado:', clarityId || 'NENHUM')
    console.log('🔍 [Clarity] Todas as env vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')))

    if (!clarityId || clarityId === 'your-clarity-project-id-here') {
      console.warn('⚠️ [Clarity] ID not configured. Add NEXT_PUBLIC_CLARITY_ID to environment variables')
      console.warn('⚠️ [Clarity] Current value:', clarityId)
      return
    }

    try {
      // Inicializar Clarity
      console.log('🚀 [Clarity] Initializing with ID:', clarityId)
      Clarity.init(clarityId)
      console.log('✅ [Clarity] Successfully initialized!')
    } catch (error) {
      console.error('❌ [Clarity] Initialization error:', error)
    }
  }, [])

  return null
}
