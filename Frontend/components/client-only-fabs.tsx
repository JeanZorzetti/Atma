"use client"

import { useEffect, useState } from 'react'
import { QuickContactFAB } from '@/components/ui/floating-action-button'
import { VoiceSearchButton } from '@/components/ui/voice-search-button'

export function ClientOnlyFABs() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <QuickContactFAB />
      <VoiceSearchButton variant="fab" />
    </>
  )
}