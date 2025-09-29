/**
 * Animated Button Component - FASE 2 Micro-Interações
 * Sistema avançado de feedback visual e estados de interação
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/lib/motion';
import { useLoadingAnimation } from '@/hooks/use-motion';
import { Calendar, CheckCircle, Star, Users } from 'lucide-react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ripple?: boolean;
  medical?: boolean;
  className?: string;
  children: React.ReactNode;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    success = false,
    error = false,
    loadingText,
    successText,
    errorText,
    icon,
    iconPosition = 'left',
    ripple = true,
    medical = false,
    className,
    children,
    onClick,
    disabled,
    ...props
  }, ref) => {
    const { controls, isLoading, startLoading, stopLoading } = useLoadingAnimation();

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;

      if (onClick) {
        startLoading();
        try {
          await onClick(e);
          stopLoading(true);
        } catch (error) {
          stopLoading(false);
        }
      }
    };

    const baseClasses = cn(
      'relative overflow-hidden rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'touch-target', // WCAG 2.2 compliance
      {
        // Sizes
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-3 text-base': size === 'md',
        'px-6 py-4 text-lg': size === 'lg',
        'px-8 py-5 text-xl': size === 'xl',

        // Variants
        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg':
          variant === 'primary',
        'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500':
          variant === 'secondary',
        'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md':
          variant === 'success',
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md':
          variant === 'danger',
        'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500':
          variant === 'ghost',
        'border-2 border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-500':
          variant === 'outline',

        // Medical styling
        'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl':
          medical && variant === 'primary',
        'border-2 border-blue-600 text-blue-600 hover:bg-blue-50':
          medical && variant === 'outline',
      },
      className
    );

    const getCurrentContent = () => {
      if (loading || isLoading) {
        return (
          <motion.div
            className="flex items-center justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Calendar className="h-4 w-4 animate-spin" />
            <span>{loadingText || 'Carregando...'}</span>
          </motion.div>
        );
      }

      if (success) {
        return (
          <motion.div
            className="flex items-center justify-center space-x-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <CheckCircle className="h-4 w-4" />
            <span>{successText || 'Sucesso!'}</span>
          </motion.div>
        );
      }

      if (error) {
        return (
          <motion.div
            className="flex items-center justify-center space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <Star className="h-4 w-4" />
            <span>{errorText || 'Erro'}</span>
          </motion.div>
        );
      }

      return (
        <div className="flex items-center justify-center space-x-2">
          {icon && iconPosition === 'left' && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {icon}
            </motion.div>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {icon}
            </motion.div>
          )}
          {!icon && medical && (
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="h-4 w-4" />
            </motion.div>
          )}
        </div>
      );
    };

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        variants={buttonVariants}
        initial="idle"
        animate={controls}
        whileHover={!disabled && !loading ? 'hover' : undefined}
        whileTap={!disabled && !loading ? 'tap' : undefined}
        onClick={handleClick}
        disabled={disabled || loading || isLoading}
        {...props}
      >
        {/* Ripple Effect */}
        {ripple && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-lg opacity-0"
            whileTap={{
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 1],
            }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${loading}-${success}-${error}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {getCurrentContent()}
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar for Loading */}
        {(loading || isLoading) && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-white/40 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        )}

        {/* Medical Pulse Effect */}
        {medical && !disabled && (
          <motion.div
            className="absolute inset-0 border-2 border-blue-400 rounded-lg opacity-0"
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Success Confetti Effect */}
        {success && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 1,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };