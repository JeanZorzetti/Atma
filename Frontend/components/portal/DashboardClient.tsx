'use client'

import { ProgressTracker } from './ProgressTracker'
import { usePortalTracking } from '@/hooks/usePortalTracking'

export function DashboardClient() {
  // Hook de tracking automático
  usePortalTracking()

  return <ProgressTracker />
}
