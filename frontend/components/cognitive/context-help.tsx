"use client"

/**
 * Context-Aware Help System
 * FASE 2.3 - UX Cognitivo Avançado
 *
 * Sistema de ajuda que aparece contextualmente baseado na ação do usuário
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type HelpType = 'info' | 'tip' | 'warning' | 'success'

interface ContextHelpProps {
  context: string // Identificador único do contexto
  title: string
  content: React.ReactNode
  type?: HelpType
  position?: 'top' | 'bottom' | 'left' | 'right'
  triggerMode?: 'hover' | 'click' | 'auto' | 'focus'
  delay?: number // Delay para auto-trigger (ms)
  className?: string
}

const typeConfig = {
  info: {
    icon: HelpCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  tip: {
    icon: Lightbulb,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
}

export function ContextHelp({
  context,
  title,
  content,
  type = 'info',
  position = 'right',
  triggerMode = 'hover',
  delay = 1000,
  className
}: ContextHelpProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenShown, setHasBeenShown] = useState(false)

  const Icon = typeConfig[type].icon

  useEffect(() => {
    // Check if user has already seen this help
    const seenHelps = JSON.parse(localStorage.getItem('seenContextHelps') || '[]')
    setHasBeenShown(seenHelps.includes(context))

    if (triggerMode === 'auto' && !seenHelps.includes(context)) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        markAsSeen()
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [context, triggerMode, delay])

  const markAsSeen = () => {
    const seenHelps = JSON.parse(localStorage.getItem('seenContextHelps') || '[]')
    if (!seenHelps.includes(context)) {
      localStorage.setItem('seenContextHelps', JSON.stringify([...seenHelps, context]))
      setHasBeenShown(true)
    }
  }

  const handleInteraction = (show: boolean) => {
    setIsVisible(show)
    if (show && !hasBeenShown) {
      markAsSeen()
    }
  }

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  }

  const triggerProps = {
    hover: {
      onMouseEnter: () => handleInteraction(true),
      onMouseLeave: () => handleInteraction(false)
    },
    click: {
      onClick: () => handleInteraction(!isVisible)
    },
    focus: {
      onFocus: () => handleInteraction(true),
      onBlur: () => handleInteraction(false)
    },
    auto: {}
  }

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Help Trigger Icon */}
      {triggerMode !== 'auto' && (
        <button
          {...triggerProps[triggerMode]}
          className={cn(
            'p-1 rounded-full hover:bg-slate-100 transition-colors',
            typeConfig[type].color
          )}
          aria-label="Abrir ajuda contextual"
          aria-expanded={isVisible}
        >
          <Icon className="h-4 w-4" />
          {!hasBeenShown && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          )}
        </button>
      )}

      {/* Help Popup */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'bottom' ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'bottom' ? -10 : 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 w-80 p-4 rounded-lg shadow-xl border-2',
              typeConfig[type].bgColor,
              typeConfig[type].borderColor,
              positionClasses[position]
            )}
          >
            {/* Close button */}
            {triggerMode !== 'hover' && (
              <button
                onClick={() => handleInteraction(false)}
                className="absolute top-2 right-2 p-1 hover:bg-white/50 rounded-full transition-colors"
                aria-label="Fechar ajuda"
              >
                <X className="h-3 w-3 text-slate-500" />
              </button>
            )}

            {/* Content */}
            <div className="flex items-start space-x-3">
              <div className={cn('p-2 rounded-lg bg-white/50')}>
                <Icon className={cn('h-5 w-5', typeConfig[type].color)} />
              </div>
              <div className="flex-1 pr-6">
                <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
                <div className="text-sm text-slate-700 leading-relaxed">
                  {content}
                </div>
              </div>
            </div>

            {/* Arrow pointer */}
            <div
              className={cn(
                'absolute w-3 h-3 rotate-45 border',
                typeConfig[type].bgColor,
                typeConfig[type].borderColor,
                position === 'right' && '-left-1.5 top-6 border-r-0 border-t-0',
                position === 'left' && '-right-1.5 top-6 border-l-0 border-b-0',
                position === 'bottom' && 'left-6 -top-1.5 border-b-0 border-r-0',
                position === 'top' && 'left-6 -bottom-1.5 border-t-0 border-l-0'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Inline Help - Para uso dentro de formulários e textos
 */
export function InlineHelp({
  term,
  definition,
  type = 'info'
}: {
  term: string
  definition: string
  type?: HelpType
}) {
  return (
    <span className="inline-flex items-center">
      <span className="font-medium text-slate-900">{term}</span>
      <ContextHelp
        context={`inline-${term}`}
        title={term}
        content={definition}
        type={type}
        position="top"
        triggerMode="hover"
        className="ml-1"
      />
    </span>
  )
}

/**
 * Field Help - Específico para campos de formulário
 */
export function FieldHelp({
  fieldName,
  help,
  example,
  validation
}: {
  fieldName: string
  help: string
  example?: string
  validation?: string
}) {
  return (
    <ContextHelp
      context={`field-${fieldName}`}
      title={`Sobre: ${fieldName}`}
      content={
        <div className="space-y-2">
          <p>{help}</p>
          {example && (
            <div className="bg-white/50 p-2 rounded border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Exemplo:</p>
              <p className="font-mono text-sm">{example}</p>
            </div>
          )}
          {validation && (
            <p className="text-xs text-slate-600">
              <strong>Formato:</strong> {validation}
            </p>
          )}
        </div>
      }
      type="info"
      position="right"
      triggerMode="click"
    />
  )
}

/**
 * Smart Tooltip - Tooltip inteligente que se adapta ao contexto
 */
export function SmartTooltip({
  children,
  tooltip,
  context,
  showOnce = false
}: {
  children: React.ReactNode
  tooltip: string
  context: string
  showOnce?: boolean
}) {
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    if (showOnce) {
      const shown = localStorage.getItem(`tooltip-${context}`)
      setShouldShow(!shown)
    }
  }, [context, showOnce])

  const handleShow = () => {
    if (showOnce && shouldShow) {
      localStorage.setItem(`tooltip-${context}`, 'true')
      setShouldShow(false)
    }
  }

  if (!shouldShow && showOnce) {
    return <>{children}</>
  }

  return (
    <div className="relative group inline-block">
      {children}
      <div
        onMouseEnter={handleShow}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
                   bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible
                   group-hover:opacity-100 group-hover:visible transition-all duration-200
                   whitespace-nowrap pointer-events-none z-50"
      >
        {tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1
                        w-0 h-0 border-4 border-transparent border-t-slate-900" />
      </div>
    </div>
  )
}
