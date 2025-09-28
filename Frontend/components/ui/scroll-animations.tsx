/**
 * Scroll Animations System - FASE 2 Micro-Interações
 * Sistema avançado de animações baseadas em scroll com parallax sutil
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-motion';
import { revealVariants } from '@/lib/motion';

// Parallax Background Component
const ParallaxBackground: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y: springY }}
        className="absolute inset-0 scale-110"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Medical Progress Reveal
const MedicalProgressReveal: React.FC<{
  steps: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
    progress: number;
  }>;
}> = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-8">
      {steps.map((step, index) => {
        const isActive = index <= activeStep;
        const isCompleted = index < activeStep;

        return (
          <motion.div
            key={index}
            className="flex items-start space-x-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                delay: index * 0.2,
                duration: 0.6,
              },
            }}
            viewport={{ once: true }}
            onViewportEnter={() => {
              setTimeout(() => setActiveStep(index), index * 200);
            }}
          >
            {/* Step Icon */}
            <motion.div
              className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : isActive
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-white border-slate-300 text-slate-400'
              }`}
              animate={{
                scale: isActive ? [1, 1.1, 1] : 1,
                backgroundColor: isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#ffffff',
              }}
              transition={{ duration: 0.3 }}
            >
              {step.icon || (
                <span className="font-bold">{index + 1}</span>
              )}

              {/* Progress Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-200"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isActive ? 1 : 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Step Content */}
            <div className="flex-1 space-y-2">
              <motion.h3
                className={`text-lg font-semibold ${
                  isActive ? 'text-blue-600' : 'text-slate-700'
                }`}
                animate={{ color: isActive ? '#2563eb' : '#374151' }}
              >
                {step.title}
              </motion.h3>

              <motion.p
                className="text-slate-600"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  height: 'auto',
                }}
                transition={{ delay: 0.2 }}
              >
                {step.description}
              </motion.p>

              {/* Progress Bar */}
              {isActive && (
                <motion.div
                  className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    initial={{ width: '0%' }}
                    animate={{ width: `${step.progress}%` }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Staggered Cards Animation
const StaggeredCards: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.9 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.6,
                ease: 'easeOut',
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Text Reveal Animation
const TextReveal: React.FC<{
  children: string;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const words = children.split(' ');

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: 'easeOut',
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Number Counter Animation
const AnimatedCounter: React.FC<{
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}> = ({
  from,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref);
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (endTime - startTime), 1);
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(from + (to - from) * easeOutProgress);

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      updateCount();
    }
  }, [isInView, from, to, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
};

// Scroll Progress Indicator
const ScrollProgress: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#3b82f6' }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 z-50 transform-gpu ${className}`}
      style={{
        scaleX,
        backgroundColor: color,
        originX: 0,
      }}
    />
  );
};

// Medical Timeline Component
const MedicalTimeline: React.FC<{
  events: Array<{
    date: string;
    title: string;
    description: string;
    type: 'consultation' | 'treatment' | 'checkup' | 'completion';
  }>;
}> = ({ events }) => {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <motion.div
        className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-blue-200 to-blue-400"
        initial={{ height: 0 }}
        whileInView={{ height: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      <div className="space-y-8">
        {events.map((event, index) => (
          <motion.div
            key={index}
            className="relative flex items-start space-x-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            {/* Timeline Dot */}
            <motion.div
              className={`relative z-10 w-3 h-3 rounded-full ${
                event.type === 'completion'
                  ? 'bg-green-500'
                  : event.type === 'treatment'
                  ? 'bg-blue-500'
                  : event.type === 'checkup'
                  ? 'bg-yellow-500'
                  : 'bg-slate-400'
              }`}
              whileInView={{
                scale: [1, 1.5, 1],
                boxShadow: [
                  '0 0 0 0 rgba(59, 130, 246, 0.4)',
                  '0 0 0 10px rgba(59, 130, 246, 0)',
                ],
              }}
              transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
            />

            {/* Event Content */}
            <div className="flex-1 bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900">{event.title}</h4>
                <span className="text-sm text-slate-500">{event.date}</span>
              </div>
              <p className="text-slate-600">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export {
  ParallaxBackground,
  MedicalProgressReveal,
  StaggeredCards,
  TextReveal,
  AnimatedCounter,
  ScrollProgress,
  MedicalTimeline,
};