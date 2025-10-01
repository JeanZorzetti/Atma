"use client"

import { useEffect, useState } from 'react'
import { QuickContactFAB, VoiceSearchButton } from '@/components/ui/voice-search-dynamic'

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