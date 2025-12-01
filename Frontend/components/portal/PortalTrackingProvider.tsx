'use client'

import { usePortalTracking } from '@/hooks/usePortalTracking'

export function PortalTrackingProvider({ children }: { children: React.ReactNode }) {
  usePortalTracking()
  return <>{children}</>
}
