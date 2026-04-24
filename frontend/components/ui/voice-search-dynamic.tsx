"use client"

import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled to prevent window/document errors
export const VoiceSearchIcon = dynamic(
  () => import('./voice-search-button').then(mod => ({ default: mod.VoiceSearchIcon })),
  {
    ssr: false,
    loading: () => null
  }
)

export const VoiceSearchButton = dynamic(
  () => import('./voice-search-button').then(mod => ({ default: mod.VoiceSearchButton })),
  {
    ssr: false,
    loading: () => null
  }
)

export const QuickContactFAB = dynamic(
  () => import('../ui/floating-action-button').then(mod => ({ default: mod.QuickContactFAB })),
  {
    ssr: false,
    loading: () => null
  }
)
