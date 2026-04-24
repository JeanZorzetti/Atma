/**
 * API Route: /api/portal/interacao
 *
 * Registra interações do usuário para analytics e gamificação
 */

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { query, queryOne, insert } from '@/lib/db'

type TipoInteracao =
  | 'visualizou_score'
  | 'baixou_pdf'
  | 'compartilhou_relatorio'
  | 'agendou_consulta'
  | 'calculou_parcela'
  | 'visitou_secao'
  | 'completou_checklist'
  | 'assistiu_video'
  | 'leu_depoimento'
  | 'fez_pergunta'
  | 'outros'

type RequestBody = {
  tipo: TipoInteracao
  relatorioId?: number
  detalhes?: Record<string, any>
}

/**
 * POST /api/portal/interacao
 * Registra uma nova interação do usuário
 */
export async function POST(req: Request) {
  try {
    // Verificar autenticação
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Pegar body
    const body: RequestBody = await req.json()

    if (!body.tipo) {
      return NextResponse.json(
        { error: 'Tipo de interação é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar ID do usuário no banco
    const user = await queryOne<{ id: number }>(
      'SELECT id FROM portal_users WHERE clerk_user_id = ?',
      [userId]
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Inserir interação
    const interacaoId = await insert(
      `INSERT INTO portal_interacoes
        (user_id, relatorio_id, tipo, detalhes, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [
        user.id,
        body.relatorioId || null,
        body.tipo,
        body.detalhes ? JSON.stringify(body.detalhes) : null,
      ]
    )

    console.log(`✅ Interação registrada: ${body.tipo} (ID: ${interacaoId})`)

    return NextResponse.json({
      success: true,
      interacaoId,
    })
  } catch (error) {
    console.error('❌ Erro ao registrar interação:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar interação' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/portal/interacao
 * Busca estatísticas de interação do usuário
 */
export async function GET() {
  try {
    // Verificar autenticação
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Buscar ID do usuário
    const user = await queryOne<{ id: number }>(
      'SELECT id FROM portal_users WHERE clerk_user_id = ?',
      [userId]
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar estatísticas de interação
    const stats = await query<{
      tipo: TipoInteracao
      total: number
      ultima_interacao: string
    }>(
      `SELECT
         tipo,
         COUNT(*) as total,
         MAX(created_at) as ultima_interacao
       FROM portal_interacoes
       WHERE user_id = ?
       GROUP BY tipo
       ORDER BY total DESC`,
      [user.id]
    )

    // Total de interações
    const totalInteracoes = stats.reduce((sum, stat) => sum + stat.total, 0)

    return NextResponse.json({
      total: totalInteracoes,
      porTipo: stats,
    })
  } catch (error) {
    console.error('❌ Erro ao buscar interações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar interações' },
      { status: 500 }
    )
  }
}
