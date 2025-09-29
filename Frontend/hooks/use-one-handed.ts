/**
 * One-Handed Use Optimization Hook
 * FASE 2.2 - Mobile-First Optimization
 */

import { useEffect, useState, useRef } from 'react'

interface OneHandedConfig {
  thumbZoneHeight: number // Height of easily reachable area (usually bottom ~75% of screen)
  reachableWidth: number  // Width that thumb can comfortably reach
  preferredHand: 'left' | 'right' | 'either'
}

interface OneHandedState {
  isOneHanded: boolean
  thumbZone: {
    top: number
    bottom: number
    left: number
    right: number
  }
  deviceMetrics: {
    screenHeight: number
    screenWidth: number
    isSmallDevice: boolean
    isTallDevice: boolean
  }
}

interface OneHandedGesture {
  type: 'edge-swipe' | 'bottom-tap' | 'corner-tap'
  position: { x: number; y: number }
  hand: 'left' | 'right'
}

export function useOneHanded(config?: Partial<OneHandedConfig>) {
  const defaultConfig: OneHandedConfig = {
    thumbZoneHeight: 0.75, // 75% of screen height from bottom
    reachableWidth: 0.7,   // 70% of screen width
    preferredHand: 'right',
    ...config
  }

  const [state, setState] = useState<OneHandedState>({
    isOneHanded: false,
    thumbZone: { top: 0, bottom: 0, left: 0, right: 0 },
    deviceMetrics: {
      screenHeight: 0,
      screenWidth: 0,
      isSmallDevice: false,
      isTallDevice: false
    }
  })

  const gestureRef = useRef<HTMLElement>(null)

  // Calculate thumb-reachable zones
  const calculateThumbZone = (width: number, height: number, hand: 'left' | 'right') => {
    const reachableHeight = height * defaultConfig.thumbZoneHeight
    const reachableWidth = width * defaultConfig.reachableWidth

    if (hand === 'right') {
      return {
        top: height - reachableHeight,
        bottom: height,
        left: width - reachableWidth,
        right: width
      }
    } else {
      return {
        top: height - reachableHeight,
        bottom: height,
        left: 0,
        right: reachableWidth
      }
    }
  }

  // Detect device characteristics
  useEffect(() => {
    const updateDeviceMetrics = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      // Detect one-handed usage patterns
      const isSmallDevice = width <= 375 // iPhone SE size
      const isTallDevice = height / width > 2 // Very tall screens
      const isLikelyOneHanded = isSmallDevice || (width <= 414 && height > 736)

      const thumbZone = calculateThumbZone(width, height, defaultConfig.preferredHand)

      setState(prev => ({
        ...prev,
        isOneHanded: isLikelyOneHanded,
        thumbZone,
        deviceMetrics: {
          screenHeight: height,
          screenWidth: width,
          isSmallDevice,
          isTallDevice
        }
      }))
    }

    updateDeviceMetrics()

    // Update on orientation change
    window.addEventListener('resize', updateDeviceMetrics)
    window.addEventListener('orientationchange', updateDeviceMetrics)

    return () => {
      window.removeEventListener('resize', updateDeviceMetrics)
      window.removeEventListener('orientationchange', updateDeviceMetrics)
    }
  }, [defaultConfig.preferredHand])

  // Detect edge swipes for hand switching
  useEffect(() => {
    if (!gestureRef.current) return

    let startX = 0
    let startY = 0
    let startTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startTime = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const endX = touch.clientX
      const endY = touch.clientY
      const endTime = Date.now()

      const deltaX = endX - startX
      const deltaY = endY - startY
      const deltaTime = endTime - startTime

      // Detect edge swipes (from screen edge)
      const isEdgeSwipe = startX < 20 || startX > window.innerWidth - 20
      const isFastSwipe = Math.abs(deltaX) > 50 && deltaTime < 300
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)

      if (isEdgeSwipe && isFastSwipe && isHorizontalSwipe) {
        const detectedHand = startX < window.innerWidth / 2 ? 'left' : 'right'

        // Update thumb zone based on detected hand preference
        const newThumbZone = calculateThumbZone(
          window.innerWidth,
          window.innerHeight,
          detectedHand
        )

        setState(prev => ({
          ...prev,
          thumbZone: newThumbZone
        }))
      }
    }

    const element = gestureRef.current
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  // Helper functions for components
  const isInThumbZone = (x: number, y: number): boolean => {
    const { thumbZone } = state
    return (
      x >= thumbZone.left &&
      x <= thumbZone.right &&
      y >= thumbZone.top &&
      y <= thumbZone.bottom
    )
  }

  const getOptimalPosition = (preferBottom = true) => {
    const { thumbZone, deviceMetrics } = state

    if (preferBottom) {
      return {
        x: thumbZone.right - 80, // 80px from right edge of thumb zone
        y: thumbZone.bottom - 80 // 80px from bottom
      }
    }

    return {
      x: thumbZone.left + 40,
      y: thumbZone.top + 40
    }
  }

  return {
    ...state,
    ref: gestureRef,
    isInThumbZone,
    getOptimalPosition,

    // CSS utility classes
    getThumbZoneClasses: () => ({
      '--thumb-zone-top': `${state.thumbZone.top}px`,
      '--thumb-zone-bottom': `${state.thumbZone.bottom}px`,
      '--thumb-zone-left': `${state.thumbZone.left}px`,
      '--thumb-zone-right': `${state.thumbZone.right}px`
    }),

    // Responsive utilities
    shouldUseFloatingButton: state.isOneHanded && state.deviceMetrics.isTallDevice,
    shouldMoveNavToBottom: state.isOneHanded,
    shouldUseTabBar: state.deviceMetrics.isSmallDevice,
    shouldStackContent: state.deviceMetrics.isSmallDevice && state.deviceMetrics.isTallDevice
  }
}

// Hook specifically for form optimization
export function useOneHandedForm() {
  const oneHanded = useOneHanded()

  const getFormFieldPosition = (fieldIndex: number, totalFields: number) => {
    if (!oneHanded.isOneHanded) return {}

    // Position fields in thumb-reachable area
    const { thumbZone } = oneHanded
    const availableHeight = thumbZone.bottom - thumbZone.top
    const fieldHeight = 60 // Approximate form field height
    const spacing = 16

    const totalFormHeight = (fieldHeight + spacing) * totalFields

    if (totalFormHeight > availableHeight) {
      // Stack fields with scroll if needed
      return {
        marginBottom: spacing,
        position: 'relative' as const
      }
    }

    // Position within thumb zone
    return {
      marginBottom: spacing,
      transform: `translateY(${thumbZone.top}px)`
    }
  }

  return {
    ...oneHanded,
    getFormFieldPosition,
    shouldUseFloatingLabels: oneHanded.isOneHanded,
    shouldUseBottomSheet: oneHanded.deviceMetrics.isTallDevice
  }
}

// Hook for navigation optimization
export function useOneHandedNavigation() {
  const oneHanded = useOneHanded()

  return {
    ...oneHanded,
    shouldUseBottomNavigation: oneHanded.isOneHanded,
    shouldCollapseToHamburger: !oneHanded.isOneHanded,
    getNavItemPosition: (index: number, total: number) => {
      const { thumbZone } = oneHanded
      const itemWidth = thumbZone.right - thumbZone.left
      const spacing = itemWidth / total

      return {
        left: thumbZone.left + (spacing * index),
        bottom: 20 // Fixed bottom position
      }
    }
  }
}