"use client"

import { useEffect } from 'react'
import Clarity from '@microsoft/clarity'

export default function ClarityScript() {
  useEffect(() => {
    // Verificar se está em produção e se há um Clarity ID configurado
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID

    if (!clarityId) {
      console.warn('Microsoft Clarity ID not configured. Add NEXT_PUBLIC_CLARITY_ID to .env')
      return
    }

    // Inicializar Clarity
    Clarity.init(clarityId)

    console.log('Microsoft Clarity initialized with ID:', clarityId)
  }, [])

  return null
}
