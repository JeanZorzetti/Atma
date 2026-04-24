/**
 * Motion Design System - Micro-Interações Avançadas
 * Baseado no roadmap FASE 2 - Sistema unificado de animações
 */

import { Variants } from 'framer-motion';

// EASING CURVES MÉDICAS - Inspiradas em movimentos naturais
export const medicalEasing = {
  gentle: [0.25, 0.1, 0.25, 1],
  smooth: [0.4, 0, 0.2, 1],
  precise: [0.2, 0, 0.1, 1],
  elastic: [0.68, -0.55, 0.265, 1.55],
} as const;

// DURATIONS BASEADAS EM RESEARCH UX MÉDICO
export const durations = {
  micro: 0.15,     // Feedback imediato
  quick: 0.3,      // Transições rápidas
  smooth: 0.6,     // Animações principais
  elaborate: 1.2,  // Animações educativas
} as const;

// VARIANTES PARA CARDS E COMPONENTES
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: durations.smooth,
      ease: medicalEasing.smooth,
      staggerChildren: 0.1,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: durations.quick,
      ease: medicalEasing.gentle,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: durations.micro,
      ease: medicalEasing.precise,
    },
  },
};

// VARIANTES PARA FORMULÁRIOS
export const formVariants: Variants = {
  initial: {
    borderColor: 'rgb(209, 213, 219)', // gray-300
    backgroundColor: 'rgb(255, 255, 255)',
  },
  focus: {
    borderColor: 'rgb(59, 130, 246)', // blue-500
    backgroundColor: 'rgb(248, 250, 252)', // slate-50
    scale: 1.01,
    transition: {
      duration: durations.quick,
      ease: medicalEasing.gentle,
    },
  },
  invalid: {
    borderColor: 'rgb(239, 68, 68)', // red-500
    backgroundColor: 'rgb(254, 242, 242)', // red-50
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: durations.quick,
      ease: medicalEasing.elastic,
    },
  },
  valid: {
    borderColor: 'rgb(34, 197, 94)', // green-500
    backgroundColor: 'rgb(240, 253, 244)', // green-50
    transition: {
      duration: durations.quick,
      ease: medicalEasing.smooth,
    },
  },
};

// VARIANTES PARA NAVEGAÇÃO
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    filter: 'blur(4px)',
  },
  enter: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: durations.smooth,
      ease: medicalEasing.smooth,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    filter: 'blur(4px)',
    transition: {
      duration: durations.quick,
      ease: medicalEasing.precise,
    },
  },
};

// VARIANTES PARA BOTÕES MÉDICOS
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
    background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))',
  },
  hover: {
    scale: 1.05,
    background: 'linear-gradient(135deg, rgb(37, 99, 235), rgb(29, 78, 216))',
    boxShadow: '0 10px 25px -3px rgba(59, 130, 246, 0.3)',
    transition: {
      duration: durations.quick,
      ease: medicalEasing.gentle,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: durations.micro,
      ease: medicalEasing.precise,
    },
  },
  success: {
    background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(21, 128, 61))',
    scale: [1, 1.1, 1],
    transition: {
      duration: durations.elaborate,
      ease: medicalEasing.elastic,
    },
  },
  loading: {
    opacity: 0.7,
    scale: 0.98,
    transition: {
      duration: durations.quick,
      ease: medicalEasing.smooth,
    },
  },
};

// VARIANTES PARA PROGRESSO MÉDICO
export const progressVariants: Variants = {
  initial: {
    width: '0%',
    opacity: 0,
  },
  animate: {
    width: '100%',
    opacity: 1,
    transition: {
      duration: durations.elaborate,
      ease: medicalEasing.smooth,
    },
  },
  complete: {
    background: 'linear-gradient(90deg, rgb(34, 197, 94), rgb(21, 128, 61))',
    transition: {
      duration: durations.smooth,
      ease: medicalEasing.gentle,
    },
  },
};

// VARIANTES PARA REVEAL ANIMATIONS
export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: {
      duration: durations.smooth,
      ease: medicalEasing.smooth,
      staggerChildren: 0.1,
    },
  },
};

// SKELETON LOADING VARIANTS
export const skeletonVariants: Variants = {
  loading: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
  loaded: {
    opacity: 0,
    transition: {
      duration: durations.quick,
      ease: medicalEasing.smooth,
    },
  },
};

// UTILITIES
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.smooth,
      ease: medicalEasing.smooth,
    },
  },
};