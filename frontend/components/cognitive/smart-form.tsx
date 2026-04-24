"use client"

/**
 * Smart Form - Formulário Cognitivo Inteligente
 * FASE 2.3 - UX Cognitivo Avançado
 *
 * Formulário que se adapta baseado na carga cognitiva do usuário
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertCircle, Loader2, Lightbulb } from 'lucide-react'
import { useFormCognitiveTracking } from '@/hooks/use-cognitive-load'
import { FieldHelp } from './context-help'
import { cn } from '@/lib/utils'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea'
  required?: boolean
  placeholder?: string
  help?: string
  example?: string
  validation?: string
  options?: { value: string; label: string }[]
  dependsOn?: string // Field only shows if this field is filled
}

interface SmartFormProps {
  formId: string
  title: string
  description?: string
  fields: FormField[]
  onSubmit: (data: Record<string, string>) => Promise<void>
  submitLabel?: string
  showProgressBar?: boolean
}

export function SmartForm({
  formId,
  title,
  description,
  fields,
  onSubmit,
  submitLabel = 'Enviar',
  showProgressBar = true
}: SmartFormProps) {
  const {
    metrics,
    trackField,
    getFieldDifficulty,
    getProblematicFields,
    getRecommendations
  } = useFormCognitiveTracking(formId)

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Progressive disclosure - only show next field when previous is filled
  const [visibleFields, setVisibleFields] = useState<string[]>([fields[0]?.name].filter(Boolean))

  useEffect(() => {
    const newVisibleFields = new Set(visibleFields)

    fields.forEach((field) => {
      if (!field.dependsOn) {
        newVisibleFields.add(field.name)
      } else if (formData[field.dependsOn]) {
        newVisibleFields.add(field.name)
      }
    })

    setVisibleFields(Array.from(newVisibleFields))
  }, [formData, fields, visibleFields])

  const validateField = (name: string, value: string) => {
    const field = fields.find(f => f.name === name)
    if (!field) return null

    if (field.required && !value) {
      return `${field.label} é obrigatório`
    }

    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido'
    }

    if (field.type === 'tel' && value && !/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(value)) {
      return 'Telefone inválido. Ex: (11) 99999-9999'
    }

    return null
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    trackField(name, 'change')

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }))
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    trackField(name, 'blur')

    const error = validateField(name, formData[name])
    if (error) {
      trackField(name, 'error')
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: Record<string, string> = {}
    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name])
      if (error) {
        newErrors[field.name] = error
        trackField(field.name, 'error')
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched(Object.fromEntries(fields.map(f => [f.name, true])))
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setSubmitSuccess(true)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (Object.keys(formData).filter(k => formData[k]).length / fields.length) * 100
  const recommendations = getRecommendations()
  const problematicFields = getProblematicFields()

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
        >
          <Check className="h-8 w-8 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Enviado com sucesso!</h3>
        <p className="text-slate-600">Entraremos em contato em breve.</p>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
        {description && <p className="text-slate-600">{description}</p>}
      </div>

      {/* Cognitive Load Indicator */}
      {metrics.cognitiveLoad !== 'low' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'mb-6 p-4 rounded-lg border-l-4',
            metrics.cognitiveLoad === 'critical' && 'bg-red-50 border-red-500',
            metrics.cognitiveLoad === 'high' && 'bg-amber-50 border-amber-500',
            metrics.cognitiveLoad === 'medium' && 'bg-blue-50 border-blue-500'
          )}
        >
          <div className="flex items-start space-x-3">
            <Lightbulb className={cn(
              'h-5 w-5 mt-0.5',
              metrics.cognitiveLoad === 'critical' && 'text-red-600',
              metrics.cognitiveLoad === 'high' && 'text-amber-600',
              metrics.cognitiveLoad === 'medium' && 'text-blue-600'
            )} />
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Dicas úteis:</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                {recommendations.map((rec, i) => (
                  <li key={i}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      {showProgressBar && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Progresso</span>
            <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {fields.filter(f => visibleFields.includes(f.name)).map((field, index) => {
            const difficulty = getFieldDifficulty(field.name)
            const hasError = !!errors[field.name]
            const isProblematic = problematicFields.includes(field.name)

            return (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                  {field.help && (
                    <FieldHelp
                      fieldName={field.label}
                      help={field.help}
                      example={field.example}
                      validation={field.validation}
                    />
                  )}
                  {isProblematic && (
                    <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      Campo difícil - veja as dicas
                    </span>
                  )}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onFocus={() => trackField(field.name, 'focus')}
                    onBlur={() => handleBlur(field.name)}
                    className={cn(
                      'w-full px-4 py-2 border rounded-lg transition-colors',
                      hasError
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-slate-300 focus:border-blue-500'
                    )}
                  >
                    <option value="">Selecione...</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onFocus={() => trackField(field.name, 'focus')}
                    onBlur={() => handleBlur(field.name)}
                    placeholder={field.placeholder}
                    rows={4}
                    className={cn(
                      'w-full px-4 py-2 border rounded-lg transition-colors resize-none',
                      hasError
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-slate-300 focus:border-blue-500'
                    )}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onFocus={() => trackField(field.name, 'focus')}
                    onBlur={() => handleBlur(field.name)}
                    placeholder={field.placeholder}
                    className={cn(
                      'w-full px-4 py-2 border rounded-lg transition-colors',
                      hasError
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-slate-300 focus:border-blue-500'
                    )}
                  />
                )}

                {/* Error Message */}
                <AnimatePresence>
                  {hasError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 flex items-center text-sm text-red-600"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors[field.name]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                     text-white font-semibold rounded-lg transition-colors
                     flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </motion.button>
      </form>
    </div>
  )
}
