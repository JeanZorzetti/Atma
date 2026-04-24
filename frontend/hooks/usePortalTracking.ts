'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

// Mapear rotas para IDs de seção
const rotaParaSecao: Record<string, string> = {
  '/portal': 'dashboard',
  '/portal/analise': 'analise',
  '/portal/financeiro': 'financeiro',
  '/portal/timeline': 'timeline',
  '/portal/tecnologia': 'tecnologia',
  '/portal/depoimentos': 'depoimentos',
  '/portal/perguntas': 'perguntas',
  '/portal/downloads': 'downloads',
  '/portal/agendar': 'agendar',
}

const mensagensBoasVindas: Record<string, string> = {
  dashboard: '🏠 Bem-vindo ao seu portal!',
  analise: '📊 Descubra a análise completa do seu caso',
  financeiro: '💰 Explore as opções de pagamento',
  timeline: '⏱️ Veja a jornada do seu tratamento',
  tecnologia: '🔬 Conheça a tecnologia Atma',
  depoimentos: '💬 Leia histórias inspiradoras',
  perguntas: '❓ Tire todas as suas dúvidas',
  downloads: '📥 Baixe seus materiais',
  agendar: '📅 Agende sua consulta presencial',
}

export function usePortalTracking() {
  const pathname = usePathname()

  useEffect(() => {
    const secaoId = rotaParaSecao[pathname]
    if (!secaoId) return

    // Verificar se já visitou
    const visitadas = JSON.parse(localStorage.getItem('portal_secoes_visitadas') || '[]')
    const jaVisitou = visitadas.includes(secaoId)

    // Marcar como visitada
    if (!visitadas.includes(secaoId)) {
      visitadas.push(secaoId)
      localStorage.setItem('portal_secoes_visitadas', JSON.stringify(visitadas))

      // Mostrar toast de primeira visita
      if (secaoId !== 'dashboard') {
        toast.success(mensagensBoasVindas[secaoId], {
          duration: 3000,
          icon: '✨',
        })
      }

      // Verificar se completou todas as seções
      if (visitadas.length === Object.keys(rotaParaSecao).length) {
        setTimeout(() => {
          toast.success('🏆 Parabéns! Você explorou todo o portal!', {
            duration: 5000,
            description: 'Você ganhou o badge de Explorador!',
          })
        }, 1500)
      }
    }

    // Registrar no banco de dados (opcional - tracking de analytics)
    // registrarVisita(secaoId)
  }, [pathname])
}

// Função helper para registrar ações
export function registrarAcao(acaoId: string, detalhes?: any) {
  const acoes = JSON.parse(localStorage.getItem('portal_acoes_completadas') || '[]')

  if (!acoes.includes(acaoId)) {
    acoes.push(acaoId)
    localStorage.setItem('portal_acoes_completadas', JSON.stringify(acoes))

    // Mensagens específicas por ação
    const mensagensAcoes: Record<string, { titulo: string; descricao?: string }> = {
      'baixou-pdf': {
        titulo: '📄 PDF baixado com sucesso!',
        descricao: 'Você pode acessá-lo a qualquer momento',
      },
      'calculou-parcelas': {
        titulo: '💳 Ótima escolha!',
        descricao: 'Explore outras formas de pagamento',
      },
      'compartilhou-relatorio': {
        titulo: '🔗 Link gerado!',
        descricao: 'Compartilhe com seu ortodontista',
      },
      'copiou-perguntas': {
        titulo: '📋 Perguntas copiadas!',
        descricao: 'Leve para sua consulta',
      },
    }

    const msg = mensagensAcoes[acaoId]
    if (msg) {
      toast.success(msg.titulo, {
        description: msg.descricao,
        duration: 4000,
      })
    }

    // Registrar no banco (opcional)
    // fetch('/api/portal/interacao', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ tipo: acaoId, detalhes }),
    // })
  }
}
