import { NextRequest, NextResponse } from 'next/server'
import { queryMany } from '@/lib/db'
import { enviarEmail } from '@/lib/resend'
import { EmailLembrete3Dias, EmailLembrete7Dias } from '@/lib/email-templates'
import { render } from '@react-email/render'
import { createElement } from 'react'

// Esta rota deve ser chamada por um cron job (Vercel Cron ou similar)
// Exemplo: executar diariamente às 10h

// Verificar autenticação via Bearer token
function verificarAutenticacao(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  // Token secreto configurado no ambiente
  const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret-change-in-production'

  return token === CRON_SECRET
}

// GET /api/emails/cron - Enviar emails automáticos
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    if (!verificarAutenticacao(request)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const resultados = {
      lembrete3dias: { enviados: 0, erros: 0 },
      lembrete7dias: { enviados: 0, erros: 0 },
    }

    // 1. Buscar usuários cadastrados há 3 dias que ainda não receberam lembrete
    const usuarios3Dias = await queryMany<{
      id: number
      nome: string
      email: string
      clerk_user_id: string
    }>(
      `SELECT pu.id, pu.nome, pu.email, pu.clerk_user_id
       FROM portal_users pu
       WHERE DATE(pu.created_at) = DATE(NOW() - INTERVAL 3 DAY)
         AND NOT EXISTS (
           SELECT 1 FROM portal_email_logs el
           WHERE el.user_id = pu.id AND el.tipo_email = 'lembrete-3dias'
         )
       LIMIT 100`
    )

    // Enviar emails de 3 dias
    for (const usuario of usuarios3Dias) {
      try {
        const htmlContent = render(
          createElement(EmailLembrete3Dias, { usuario: { nome: usuario.nome, email: usuario.email } })
        )

        const resultado = await enviarEmail({
          to: usuario.email,
          subject: '🔍 Você já explorou seu relatório?',
          html: htmlContent,
        })

        if (resultado.success) {
          // Registrar log do email enviado
          await queryMany(
            `INSERT INTO portal_email_logs (user_id, tipo_email, status, sent_at)
             VALUES (?, 'lembrete-3dias', 'enviado', NOW())`,
            [usuario.id]
          )
          resultados.lembrete3dias.enviados++
        } else {
          resultados.lembrete3dias.erros++
        }
      } catch (error) {
        console.error(`Erro ao enviar email para ${usuario.email}:`, error)
        resultados.lembrete3dias.erros++
      }
    }

    // 2. Buscar usuários cadastrados há 7 dias que ainda não receberam lembrete
    const usuarios7Dias = await queryMany<{
      id: number
      nome: string
      email: string
      clerk_user_id: string
    }>(
      `SELECT pu.id, pu.nome, pu.email, pu.clerk_user_id
       FROM portal_users pu
       WHERE DATE(pu.created_at) = DATE(NOW() - INTERVAL 7 DAY)
         AND NOT EXISTS (
           SELECT 1 FROM portal_email_logs el
           WHERE el.user_id = pu.id AND el.tipo_email = 'lembrete-7dias'
         )
       LIMIT 100`
    )

    // Enviar emails de 7 dias
    for (const usuario of usuarios7Dias) {
      try {
        const htmlContent = render(
          createElement(EmailLembrete7Dias, { usuario: { nome: usuario.nome, email: usuario.email } })
        )

        const resultado = await enviarEmail({
          to: usuario.email,
          subject: '📅 Pronto para agendar sua consulta?',
          html: htmlContent,
        })

        if (resultado.success) {
          // Registrar log do email enviado
          await queryMany(
            `INSERT INTO portal_email_logs (user_id, tipo_email, status, sent_at)
             VALUES (?, 'lembrete-7dias', 'enviado', NOW())`,
            [usuario.id]
          )
          resultados.lembrete7dias.enviados++
        } else {
          resultados.lembrete7dias.erros++
        }
      } catch (error) {
        console.error(`Erro ao enviar email para ${usuario.email}:`, error)
        resultados.lembrete7dias.erros++
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      resultados,
    })
  } catch (error) {
    console.error('Erro no cron de emails:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Permitir apenas GET (cron jobs)
export async function POST() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  )
}
