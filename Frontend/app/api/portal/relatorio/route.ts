/**
 * API Route: /api/portal/relatorio
 *
 * Busca o relatório de viabilidade do usuário autenticado
 */

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'

// Tipo do relatório
export type Relatorio = {
  id: number
  user_id: number
  dados_json: any
  score: number
  custo_estimado: number | null
  duracao_meses: number | null
  complexidade: 'Simples' | 'Moderada' | 'Complexa' | 'Muito Complexa' | null
  status: 'novo' | 'em_analise' | 'ativo' | 'concluido' | 'cancelado'
  payment_status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded' | null
  pdf_url: string | null
  created_at: string
  expires_at: string | null
  is_active: boolean
}

// Tipo do usuário
export type Usuario = {
  id: number
  clerk_user_id: string
  email: string
  nome: string
  telefone: string | null
  cpf: string | null
  foto_url: string | null
  created_at: string
  updated_at: string
  last_login_at: string | null
}

/**
 * GET /api/portal/relatorio
 * Busca o relatório ativo do usuário
 */
export async function GET() {
  try {
    // Verificar autenticação
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Buscar usuário no banco
    const user = await queryOne<Usuario>(
      'SELECT * FROM portal_users WHERE clerk_user_id = ?',
      [userId]
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado no banco' },
        { status: 404 }
      )
    }

    // Buscar relatório ativo do usuário
    const relatorio = await queryOne<Relatorio>(
      `SELECT * FROM portal_relatorios
       WHERE user_id = ?
         AND is_active = TRUE
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id]
    )

    if (!relatorio) {
      return NextResponse.json(
        {
          error: 'Nenhum relatório encontrado',
          message: 'Você ainda não possui um relatório de viabilidade',
        },
        { status: 404 }
      )
    }

    // Registrar acesso (fire and forget - não bloqueia resposta)
    registrarAcesso(user.id, '/api/portal/relatorio', 'get_relatorio').catch((err) =>
      console.error('Erro ao registrar acesso:', err)
    )

    return NextResponse.json({
      usuario: user,
      relatorio: relatorio,
    })
  } catch (error) {
    console.error('❌ Erro ao buscar relatório:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar relatório' },
      { status: 500 }
    )
  }
}

/**
 * Registra um acesso no banco (para analytics)
 */
async function registrarAcesso(
  userId: number,
  pageUrl: string,
  action: string
): Promise<void> {
  try {
    await query(
      `INSERT INTO portal_acessos
        (user_id, ip_address, page_url, page_type, action, accessed_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, 'api', pageUrl, 'outros', action]
    )
  } catch (error) {
    console.error('❌ Erro ao registrar acesso:', error)
    // Não propagamos o erro - acesso é não-crítico
  }
}
