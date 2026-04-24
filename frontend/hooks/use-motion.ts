/**
 * Custom Hooks para Motion Design System
 * Otimizações de performance e controle de animações
 */

import { useRef, useEffect, useState } from 'react';
import { useInView, useAnimation, AnimationControls } from 'framer-motion';

// Hook para animações de entrada com scroll
export function useScrollReveal(threshold = 0.1, margin = '0px') {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
    margin
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
}

// Hook para animações de hover otimizadas
export function useHoverAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const handleHoverStart = () => {
    setIsHovered(true);
    controls.start('hover');
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    controls.start('idle');
  };

  return {
    isHovered,
    controls,
    hoverProps: {
      onHoverStart: handleHoverStart,
      onHoverEnd: handleHoverEnd,
    },
  };
}

// Hook para controle de formulários com validação visual
export function useFormAnimation() {
  const controls = useAnimation();
  const [state, setState] = useState<'initial' | 'focus' | 'valid' | 'invalid'>('initial');

  const setFocus = () => {
    setState('focus');
    controls.start('focus');
  };

  const setValid = () => {
    setState('valid');
    controls.start('valid');
  };

  const setInvalid = () => {
    setState('invalid');
    controls.start('invalid');
  };

  const reset = () => {
    setState('initial');
    controls.start('initial');
  };

  return {
    state,
    controls,
    setFocus,
    setValid,
    setInvalid,
    reset,
  };
}

// Hook para loading states
export function useLoadingAnimation() {
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimation();

  const startLoading = () => {
    setIsLoading(true);
    controls.start('loading');
  };

  const stopLoading = (success = true) => {
    setIsLoading(false);
    if (success) {
      controls.start('success').then(() => {
        setTimeout(() => controls.start('idle'), 1000);
      });
    } else {
      controls.start('idle');
    }
  };

  return {
    isLoading,
    controls,
    startLoading,
    stopLoading,
  };
}

// Hook para controle de progresso médico
export function useMedicalProgress(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0);
  const controls = useAnimation();

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      controls.start('animate');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step <= totalSteps) {
      setCurrentStep(step);
      controls.start('animate');
    }
  };

  const complete = () => {
    setCurrentStep(totalSteps);
    controls.start('complete');
  };

  const progress = (currentStep / totalSteps) * 100;

  return {
    currentStep,
    totalSteps,
    progress,
    controls,
    nextStep,
    prevStep,
    goToStep,
    complete,
    isComplete: currentStep === totalSteps,
  };
}

// Hook para skeleton loading
export function useSkeletonLoader(isLoading: boolean) {
  const controls = useAnimation();

  useEffect(() => {
    if (isLoading) {
      controls.start('loading');
    } else {
      controls.start('loaded');
    }
  }, [isLoading, controls]);

  return controls;
}

// Hook para controle de página com transições
export function usePageTransition() {
  const controls = useAnimation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = async () => {
    setIsTransitioning(true);
    await controls.start('exit');
  };

  const completeTransition = async () => {
    await controls.start('enter');
    setIsTransitioning(false);
  };

  const resetPage = () => {
    controls.set('initial');
  };

  return {
    controls,
    isTransitioning,
    startTransition,
    completeTransition,
    resetPage,
  };
}

// Hook para performance monitoring
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const framesRef = useRef(0);

  useEffect(() => {
    const measureFPS = (currentTime: number) => {
      if (lastTimeRef.current) {
        framesRef.current++;
        const delta = currentTime - lastTimeRef.current;

        if (delta >= 1000) {
          setFps(Math.round((framesRef.current * 1000) / delta));
          framesRef.current = 0;
          lastTimeRef.current = currentTime;
        }
      } else {
        lastTimeRef.current = currentTime;
      }

      frameRef.current = requestAnimationFrame(measureFPS);
    };

    frameRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const shouldReduceMotion = fps < 30;

  return {
    fps,
    shouldReduceMotion,
    performance: fps >= 50 ? 'excellent' : fps >= 30 ? 'good' : 'poor',
  };
}