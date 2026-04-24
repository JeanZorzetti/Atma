/**
 * Animated Input Component - FASE 2 Micro-Interações
 * Sistema de validação visual em tempo real com feedback imediato
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formVariants } from '@/lib/motion';
import { useFormAnimation } from '@/hooks/use-motion';
import { CheckCircle, Star, Calendar, Users } from 'lucide-react';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  validation?: (value: string) => { isValid: boolean; message?: string };
  showValidationIcon?: boolean;
  className?: string;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({
    label,
    error,
    success,
    hint,
    validation,
    showValidationIcon = true,
    className,
    type = 'text',
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...props
  }, ref) => {
    const [value, setValue] = useState('');
    const [validationState, setValidationState] = useState<{
      isValid: boolean;
      message?: string;
    }>({ isValid: true });
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { controls, setFocus, setValid, setInvalid, reset } = useFormAnimation();

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // Real-time validation
    useEffect(() => {
      if (validation && value) {
        const result = validation(value);
        setValidationState(result);

        if (result.isValid) {
          setValid();
        } else {
          setInvalid();
        }
      } else if (error) {
        setInvalid();
      } else if (success) {
        setValid();
      } else {
        reset();
      }
    }, [value, validation, error, success, setValid, setInvalid, reset]);

    const handleFocus = () => {
      setIsFocused(true);
      setFocus();
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (!value && !error && !success) {
        reset();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      props.onChange?.(e);
    };

    const getValidationMessage = () => {
      if (error) return error;
      if (success) return success;
      if (validationState.message) return validationState.message;
      return hint;
    };

    const getValidationIcon = () => {
      if (error || (!validationState.isValid && value)) {
        return <Star className="h-5 w-5 text-red-500" />;
      }
      if (success || (validationState.isValid && value && validation)) {
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      }
      return null;
    };

    const getValidationColor = () => {
      if (error || (!validationState.isValid && value)) return 'text-red-600';
      if (success || (validationState.isValid && value && validation)) return 'text-green-600';
      return 'text-slate-600';
    };

    return (
      <motion.div className={cn('space-y-2', className)}>
        {label && (
          <motion.label
            className={cn(
              'block text-sm font-medium transition-colors',
              isFocused ? 'text-blue-600' : 'text-slate-700'
            )}
            htmlFor={props.id}
            animate={{
              color: isFocused ? 'rgb(37, 99, 235)' : 'rgb(51, 65, 85)',
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {props.required && (
              <motion.span
                className="ml-1 text-red-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                *
              </motion.span>
            )}
          </motion.label>
        )}

        <div className="relative">
          <motion.input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full rounded-lg border border-slate-300 px-4 py-3 pr-12',
              'text-slate-900 placeholder-slate-400',
              'transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              'touch-target' // WCAG 2.2 compliance
            )}
            variants={formVariants}
            animate={controls}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {/* Validation Icon */}
          <AnimatePresence>
            {showValidationIcon && (
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isPassword ? (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:bg-slate-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <Calendar className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Users className="h-4 w-4 text-slate-500" />
                    )}
                  </button>
                ) : (
                  getValidationIcon()
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Focus Ring Effect */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-lg"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: isFocused ? 1 : 0,
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
            style={{
              boxShadow: 'inset 0 0 0 2px rgb(59, 130, 246)',
            }}
          />
        </div>

        {/* Validation Message */}
        <AnimatePresence mode="wait">
          {getValidationMessage() && (
            <motion.div
              className={cn('text-sm', getValidationColor())}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start space-x-2 pt-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {(error || (!validationState.isValid && value)) && (
                    <Star className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  {(success || (validationState.isValid && value && validation)) && (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                </motion.div>
                <span>{getValidationMessage()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Counter for text areas */}
        {props.maxLength && (
          <motion.div
            className="text-right text-xs text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: value.length > 0 ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {value.length}/{props.maxLength}
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';

export { AnimatedInput };