"use client"

/**
 * Medical Glossary - Simplificação de Terminologia
 * FASE 2.3 - UX Cognitivo Avançado
 *
 * Sistema de glossário interativo que traduz termos técnicos para linguagem simples
 */

import { motion } from 'framer-motion'
import { BookOpen, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface GlossaryTerm {
  technical: string
  simple: string
  definition: string
  example?: string
  relatedTerms?: string[]
}

// Base de dados de termos ortodônticos simplificados
export const orthodonticGlossary: Record<string, GlossaryTerm> = {
  'má oclusão': {
    technical: 'Má oclusão',
    simple: 'Dentes desalinhados',
    definition: 'Quando os dentes superiores e inferiores não se encaixam corretamente ao fechar a boca.',
    example: 'Dentes tortos, separados ou que se sobrepõem',
    relatedTerms: ['classe I', 'classe II', 'classe III']
  },
  'classe i': {
    technical: 'Má oclusão Classe I',
    simple: 'Mordida normal com dentes desalinhados',
    definition: 'Os dentes de trás estão bem posicionados, mas os da frente estão tortos ou apinhados.',
    example: 'Dentes da frente encavalados mesmo com mordida correta'
  },
  'classe ii': {
    technical: 'Má oclusão Classe II',
    simple: 'Queixo para trás',
    definition: 'Os dentes superiores ficam muito à frente dos inferiores, dando aparência de queixo retraído.',
    example: 'Dentes de coelho, overjet aumentado'
  },
  'classe iii': {
    technical: 'Má oclusão Classe III',
    simple: 'Queixo para frente',
    definition: 'Os dentes inferiores ficam à frente dos superiores, dando aparência de queixo projetado.',
    example: 'Mordida cruzada anterior, prognatismo'
  },
  'apinhamento': {
    technical: 'Apinhamento Dentário',
    simple: 'Dentes amontoados',
    definition: 'Quando não há espaço suficiente para todos os dentes na arcada, ficando encavalados.',
    example: 'Dentes sobrepostos ou girados por falta de espaço'
  },
  'diastema': {
    technical: 'Diastema',
    simple: 'Espaço entre os dentes',
    definition: 'Espaçamento visível entre dois ou mais dentes, mais comum entre os incisivos centrais.',
    example: 'Espacinho entre os dentes da frente'
  },
  'overjet': {
    technical: 'Overjet',
    simple: 'Dentes da frente para fora',
    definition: 'Distância horizontal entre os dentes superiores e inferiores da frente.',
    example: 'Quanto os dentes superiores ficam "pulados" para frente'
  },
  'overbite': {
    technical: 'Overbite',
    simple: 'Sobreposição vertical',
    definition: 'Quanto os dentes superiores cobrem os inferiores ao fechar a boca.',
    example: 'Dentes superiores cobrindo muito ou pouco os inferiores'
  },
  'mordida cruzada': {
    technical: 'Mordida Cruzada',
    simple: 'Dentes invertidos',
    definition: 'Quando dentes superiores ficam por dentro dos inferiores ao fechar a boca.',
    example: 'Dentes de cima mordendo por dentro dos de baixo'
  },
  'mordida aberta': {
    technical: 'Mordida Aberta',
    simple: 'Dentes não se tocam',
    definition: 'Espaço entre os dentes superiores e inferiores mesmo com a boca fechada.',
    example: 'Abertura na frente ou nas laterais ao morder'
  },
  'alinhador': {
    technical: 'Alinhador Ortodôntico',
    simple: 'Aparelho transparente',
    definition: 'Moldeira removível de plástico transparente que move os dentes gradualmente.',
    example: 'Aparelho invisível que você pode tirar para comer'
  },
  'attachment': {
    technical: 'Attachment',
    simple: 'Botão no dente',
    definition: 'Pequeno ponto de resina colado no dente para ajudar o alinhador a movimentá-lo.',
    example: 'Pontinho da cor do dente que ajuda o aparelho'
  },
  'ipr': {
    technical: 'IPR (Redução Interproximal)',
    simple: 'Desgaste entre dentes',
    definition: 'Leve polimento entre os dentes para criar espaço necessário ao tratamento.',
    example: 'Lixar levemente entre os dentes para ganhar espaço'
  },
  'contenção': {
    technical: 'Contenção Ortodôntica',
    simple: 'Manutenção pós-tratamento',
    definition: 'Aparelho usado após o tratamento para manter os dentes na posição correta.',
    example: 'Aparelho de manutenção para os dentes não voltarem'
  }
}

/**
 * Componente para destacar e explicar termos técnicos
 */
export function MedicalTerm({
  term,
  children,
  className
}: {
  term: string
  children?: React.ReactNode
  className?: string
}) {
  const [isHovering, setIsHovering] = useState(false)
  const termKey = term.toLowerCase()
  const glossaryEntry = orthodonticGlossary[termKey]

  if (!glossaryEntry) {
    return <span className={className}>{children || term}</span>
  }

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          'cursor-help border-b-2 border-dotted border-blue-400',
          'hover:border-blue-600 transition-colors',
          className
        )}
      >
        {children || glossaryEntry.simple}
      </span>

      {isHovering && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4
                     bg-white rounded-lg shadow-xl border-2 border-blue-200 z-50"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-blue-900">{glossaryEntry.simple}</h4>
              <span className="text-xs text-slate-500 italic">{glossaryEntry.technical}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {glossaryEntry.definition}
            </p>
            {glossaryEntry.example && (
              <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                <strong>Exemplo:</strong> {glossaryEntry.example}
              </div>
            )}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1
                          w-0 h-0 border-8 border-transparent border-t-blue-200" />
        </motion.div>
      )}
    </span>
  )
}

/**
 * Glossário completo com busca
 */
export function GlossaryModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTerms = Object.entries(orthodonticGlossary).filter(
    ([key, term]) =>
      term.simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.technical.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Glossário Ortodôntico</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
            <input
              type="text"
              placeholder="Buscar termo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 border-2 border-white/30
                         text-white placeholder-blue-200 focus:bg-white/30 focus:border-white
                         transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          <div className="grid gap-4">
            {filteredTerms.map(([key, term]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-bold text-blue-900">{term.simple}</h3>
                  <span className="text-sm text-slate-500 italic">{term.technical}</span>
                </div>
                <p className="text-slate-700 mb-2">{term.definition}</p>
                {term.example && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-2 text-sm">
                    <strong className="text-blue-900">Exemplo:</strong>{' '}
                    <span className="text-blue-800">{term.example}</span>
                  </div>
                )}
                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-xs text-slate-600">Termos relacionados:</span>
                    {term.relatedTerms.map((related) => (
                      <span
                        key={related}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                      >
                        {orthodonticGlossary[related]?.simple || related}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Nenhum termo encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Botão para abrir glossário
 */
export function GlossaryButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100
                   text-blue-700 rounded-lg transition-colors border border-blue-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BookOpen className="h-4 w-4" />
        <span className="text-sm font-medium">Glossário</span>
      </motion.button>

      <GlossaryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
