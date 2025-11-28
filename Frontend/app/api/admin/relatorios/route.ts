import { NextRequest, NextResponse } from 'next/server'
import { listarRelatoriosRecentes, contarRelatorios } from '@/lib/repositories/relatorio-repository'

/**
 * GET /api/admin/relatorios?limit=50&offset=0
 * Lista relatórios recentes com paginação
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [relatorios, total] = await Promise.all([
      listarRelatoriosRecentes(limit, offset),
      contarRelatorios()
    ])

    return NextResponse.json({
      success: true,
      data: {
        relatorios,
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('❌ Erro ao buscar relatórios:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar relatórios'
      },
      { status: 500 }
    )
  }
}
