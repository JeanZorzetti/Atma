/**
 * Touch Gestures Hook - Mobile Optimization
 * FASE 2.2 - Mobile-First Optimization
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

interface PinchGesture {
  scale: number;
  center: { x: number; y: number };
}

interface TouchGestureState {
  isTouch: boolean;
  isDragging: boolean;
  isPinching: boolean;
  isSwiping: boolean;
  touchCount: number;
  swipe?: SwipeGesture;
  pinch?: PinchGesture;
}

interface TouchGestureCallbacks {
  onSwipe?: (gesture: SwipeGesture) => void;
  onPinch?: (gesture: PinchGesture) => void;
  onTap?: (point: TouchPoint) => void;
  onDoubleTap?: (point: TouchPoint) => void;
  onLongPress?: (point: TouchPoint) => void;
  onDragStart?: (point: TouchPoint) => void;
  onDrag?: (point: TouchPoint) => void;
  onDragEnd?: (point: TouchPoint) => void;
}

export function useTouchGestures(
  callbacks: TouchGestureCallbacks = {},
  options: {
    swipeThreshold?: number;
    longPressDelay?: number;
    doubleTapDelay?: number;
    preventDefault?: boolean;
  } = {}
) {
  const {
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    preventDefault = false,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<TouchPoint[]>([]);
  const touchCurrentRef = useRef<TouchPoint[]>([]);
  const longPressTimerRef = useRef<NodeJS.Timeout>();
  const lastTapRef = useRef<TouchPoint | null>(null);
  const doubleTapTimerRef = useRef<NodeJS.Timeout>();

  const [state, setState] = useState<TouchGestureState>({
    isTouch: false,
    isDragging: false,
    isPinching: false,
    isSwiping: false,
    touchCount: 0,
  });

  // Helper function to get touch point
  const getTouchPoint = useCallback((touch: Touch): TouchPoint => ({
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now(),
  }), []);

  // Calculate distance between two points
  const getDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }, []);

  // Calculate velocity
  const getVelocity = useCallback((start: TouchPoint, end: TouchPoint): number => {
    const distance = getDistance(start, end);
    const time = end.timestamp - start.timestamp;
    return time > 0 ? distance / time : 0;
  }, [getDistance]);

  // Determine swipe direction
  const getSwipeDirection = useCallback((start: TouchPoint, end: TouchPoint): SwipeGesture['direction'] => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (preventDefault) {
      event.preventDefault();
    }

    const touches = Array.from(event.touches).map(getTouchPoint);
    touchStartRef.current = touches;
    touchCurrentRef.current = touches;

    setState(prev => ({
      ...prev,
      isTouch: true,
      touchCount: touches.length,
      isPinching: touches.length > 1,
    }));

    // Start long press timer for single touch
    if (touches.length === 1) {
      longPressTimerRef.current = setTimeout(() => {
        callbacks.onLongPress?.(touches[0]);
      }, longPressDelay);

      callbacks.onDragStart?.(touches[0]);
    }
  }, [callbacks, getTouchPoint, longPressDelay, preventDefault]);

  // Handle touch move
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (preventDefault) {
      event.preventDefault();
    }

    const touches = Array.from(event.touches).map(getTouchPoint);
    touchCurrentRef.current = touches;

    setState(prev => ({
      ...prev,
      isDragging: true,
      isSwiping: touches.length === 1,
    }));

    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = undefined;
    }

    // Handle single touch drag
    if (touches.length === 1) {
      callbacks.onDrag?.(touches[0]);
    }

    // Handle pinch gesture
    if (touches.length === 2 && touchStartRef.current.length === 2) {
      const currentDistance = getDistance(touches[0], touches[1]);
      const startDistance = getDistance(touchStartRef.current[0], touchStartRef.current[1]);

      if (startDistance > 0) {
        const scale = currentDistance / startDistance;
        const center = {
          x: (touches[0].x + touches[1].x) / 2,
          y: (touches[0].y + touches[1].y) / 2,
        };

        callbacks.onPinch?.({ scale, center });
      }
    }
  }, [callbacks, getDistance, preventDefault]);

  // Handle touch end
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (preventDefault) {
      event.preventDefault();
    }

    const touches = Array.from(event.touches).map(getTouchPoint);
    const endTouch = touchCurrentRef.current[0];

    setState(prev => ({
      ...prev,
      isTouch: touches.length > 0,
      isDragging: false,
      isSwiping: false,
      isPinching: touches.length > 1,
      touchCount: touches.length,
    }));

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = undefined;
    }

    // Handle single touch gestures
    if (touchStartRef.current.length === 1 && endTouch) {
      const startTouch = touchStartRef.current[0];
      const distance = getDistance(startTouch, endTouch);
      const duration = endTouch.timestamp - startTouch.timestamp;

      callbacks.onDragEnd?.(endTouch);

      // Detect swipe
      if (distance > swipeThreshold && duration < 1000) {
        const direction = getSwipeDirection(startTouch, endTouch);
        const velocity = getVelocity(startTouch, endTouch);

        const swipeGesture: SwipeGesture = {
          direction,
          distance,
          velocity,
          duration,
        };

        callbacks.onSwipe?.(swipeGesture);
        setState(prev => ({ ...prev, swipe: swipeGesture }));
      }
      // Detect tap
      else if (distance < 10 && duration < 300) {
        // Check for double tap
        if (lastTapRef.current) {
          const timeSinceLastTap = endTouch.timestamp - lastTapRef.current.timestamp;
          const distanceFromLastTap = getDistance(lastTapRef.current, endTouch);

          if (timeSinceLastTap < doubleTapDelay && distanceFromLastTap < 50) {
            callbacks.onDoubleTap?.(endTouch);
            lastTapRef.current = null;

            if (doubleTapTimerRef.current) {
              clearTimeout(doubleTapTimerRef.current);
              doubleTapTimerRef.current = undefined;
            }
            return;
          }
        }

        // Set up single tap with delay to detect double tap
        lastTapRef.current = endTouch;
        doubleTapTimerRef.current = setTimeout(() => {
          callbacks.onTap?.(endTouch);
          lastTapRef.current = null;
        }, doubleTapDelay);
      }
    }

    // Reset touch references
    if (touches.length === 0) {
      touchStartRef.current = [];
      touchCurrentRef.current = [];
    }
  }, [
    callbacks,
    getDistance,
    getSwipeDirection,
    getVelocity,
    swipeThreshold,
    doubleTapDelay,
    preventDefault,
  ]);

  // Attach event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);

      // Clean up timers
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (doubleTapTimerRef.current) {
        clearTimeout(doubleTapTimerRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault]);

  return {
    ref: elementRef,
    state,
    // Utility functions
    isTouch: state.isTouch,
    isMobile: typeof window !== 'undefined' && 'ontouchstart' in window,
  };
}

// Hook for swipe navigation
export function useSwipeNavigation(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  enabled: boolean = true
) {
  const { ref, state } = useTouchGestures(
    {
      onSwipe: (gesture) => {
        if (!enabled) return;

        if (gesture.direction === 'left' && gesture.velocity > 0.3) {
          onSwipeLeft?.();
        } else if (gesture.direction === 'right' && gesture.velocity > 0.3) {
          onSwipeRight?.();
        }
      },
    },
    {
      swipeThreshold: 100,
      preventDefault: false,
    }
  );

  return { ref, isNavigating: state.isSwiping };
}

// Hook for touch-friendly scrolling
export function useTouchScroll(
  onScrollStart?: () => void,
  onScrollEnd?: () => void
) {
  const scrollTimerRef = useRef<NodeJS.Timeout>();
  const [isScrolling, setIsScrolling] = useState(false);

  const { ref } = useTouchGestures(
    {
      onDragStart: () => {
        setIsScrolling(true);
        onScrollStart?.();
      },
      onDragEnd: () => {
        // Debounce scroll end
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
        }

        scrollTimerRef.current = setTimeout(() => {
          setIsScrolling(false);
          onScrollEnd?.();
        }, 150);
      },
    },
    {
      preventDefault: false,
    }
  );

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  return { ref, isScrolling };
}