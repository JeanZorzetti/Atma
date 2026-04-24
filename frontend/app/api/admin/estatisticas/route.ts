import { NextRequest, NextResponse } from 'next/server'
import { buscarEstatisticasGerais, buscarProblemasMaisComuns } from '@/lib/repositories/relatorio-repository'

/**
 * GET /api/admin/estatisticas
 * Retorna estatísticas gerais do CRM
 */
export async function GET(request: NextRequest) {
  try {
    const [estatisticas, problemas] = await Promise.all([
      buscarEstatisticasGerais(),
      buscarProblemasMaisComuns()
    ])

    return NextResponse.json({
      success: true,
      data: {
        geral: estatisticas,
        problemasMaisComuns: problemas
      }
    })
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar estatísticas'
      },
      { status: 500 }
    )
  }
}
