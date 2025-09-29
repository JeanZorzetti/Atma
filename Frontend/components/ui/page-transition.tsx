/**
 * Page Transition System - FASE 2 Micro-Interações
 * Sistema de transições fluidas entre páginas com preload inteligente
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { pageVariants, staggerContainer } from '@/lib/motion';
import { usePageTransition } from '@/hooks/use-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
}) => {
  const pathname = usePathname();
  const { controls, resetPage, completeTransition } = usePageTransition();

  useEffect(() => {
    resetPage();
    completeTransition();
  }, [pathname, resetPage, completeTransition]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className={className}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        onAnimationComplete={() => {
          // Scroll to top after page transition
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Staggered Container for page sections
const StaggeredContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Layout with transition support
const TransitionLayout: React.FC<{
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}> = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header will be injected here */}
        </motion.header>
      )}

      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <PageTransition>
          {children}
        </PageTransition>
      </motion.main>

      {showFooter && (
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Footer will be injected here */}
        </motion.footer>
      )}
    </div>
  );
};

// Preloader Component
const PagePreloader: React.FC<{
  isLoading: boolean;
  progress?: number;
}> = ({ isLoading, progress = 0 }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center space-y-4">
            {/* Atma Logo Animation */}
            <motion.div
              className="w-16 h-16 mx-auto bg-blue-600 rounded-lg"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Loading Text */}
            <motion.p
              className="text-slate-600"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Carregando experiência Atma...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Route Change Indicator
const RouteChangeIndicator: React.FC<{
  isChanging: boolean;
}> = ({ isChanging }) => {
  return (
    <AnimatePresence>
      {isChanging && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0, originX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  );
};

// Medical Section Transition
const MedicalSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}> = ({ children, title, subtitle, className = '' }) => {
  return (
    <motion.section
      className={`py-16 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

// Reveal on Scroll Component
const RevealOnScroll: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}> = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
};

export {
  PageTransition,
  StaggeredContainer,
  TransitionLayout,
  PagePreloader,
  RouteChangeIndicator,
  MedicalSection,
  RevealOnScroll,
};