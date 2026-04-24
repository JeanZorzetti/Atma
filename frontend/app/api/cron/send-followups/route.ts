import { NextRequest, NextResponse } from 'next/server'
import { enviarEmailD7, enviarEmailD14, enviarEmailD30 } from '@/lib/email'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Iniciando job de follow-up automático...')

    const hoje = new Date()
    let emailsEnviados = 0

    // EMAIL D+7
    const clientesD7 = await query<any>(`
      SELECT c.id as cliente_id, c.nome, c.email, r.id as relatorio_id, r.data_geracao
      FROM clientes c
      INNER JOIN relatorios r ON c.id = r.cliente_id
      WHERE r.email_d7_enviado = FALSE
        AND r.data_geracao <= NOW() - INTERVAL '7 days'
        AND r.data_geracao > NOW() - INTERVAL '8 days'
      LIMIT 50
    `)

    for (const cliente of clientesD7) {
      try {
        await enviarEmailD7(cliente.email, cliente.nome, cliente.relatorio_id)
        await query(
          'UPDATE relatorios SET email_d7_enviado = TRUE, email_d7_data = NOW() WHERE id = $1',
          [cliente.relatorio_id]
        )
        emailsEnviados++
        console.log(`✅ D+7 enviado para: ${cliente.email}`)
      } catch (error) {
        console.error(`❌ Erro ao enviar D+7 para ${cliente.email}:`, error)
      }
    }

    // EMAIL D+14
    const clientesD14 = await query<any>(`
      SELECT c.id as cliente_id, c.nome, c.email, r.id as relatorio_id, r.data_geracao
      FROM clientes c
      INNER JOIN relatorios r ON c.id = r.cliente_id
      WHERE r.email_d14_enviado = FALSE
        AND r.data_geracao <= NOW() - INTERVAL '14 days'
        AND r.data_geracao > NOW() - INTERVAL '15 days'
      LIMIT 50
    `)

    for (const cliente of clientesD14) {
      try {
        await enviarEmailD14(cliente.email, cliente.nome, cliente.relatorio_id)
        await query(
          'UPDATE relatorios SET email_d14_enviado = TRUE, email_d14_data = NOW() WHERE id = $1',
          [cliente.relatorio_id]
        )
        emailsEnviados++
        console.log(`✅ D+14 enviado para: ${cliente.email}`)
      } catch (error) {
        console.error(`❌ Erro ao enviar D+14 para ${cliente.email}:`, error)
      }
    }

    // EMAIL D+30
    const clientesD30 = await query<any>(`
      SELECT c.id as cliente_id, c.nome, c.email, r.id as relatorio_id, r.data_geracao
      FROM clientes c
      INNER JOIN relatorios r ON c.id = r.cliente_id
      WHERE r.email_d30_enviado = FALSE
        AND r.data_geracao <= NOW() - INTERVAL '30 days'
        AND r.data_geracao > NOW() - INTERVAL '31 days'
      LIMIT 50
    `)

    for (const cliente of clientesD30) {
      try {
        await enviarEmailD30(cliente.email, cliente.nome, cliente.relatorio_id)
        await query(
          'UPDATE relatorios SET email_d30_enviado = TRUE, email_d30_data = NOW() WHERE id = $1',
          [cliente.relatorio_id]
        )
        emailsEnviados++
        console.log(`✅ D+30 enviado para: ${cliente.email}`)
      } catch (error) {
        console.error(`❌ Erro ao enviar D+30 para ${cliente.email}:`, error)
      }
    }

    console.log(`🎉 Job concluído! ${emailsEnviados} emails enviados.`)

    return NextResponse.json({
      success: true,
      emailsEnviados,
      breakdown: { d7: clientesD7.length, d14: clientesD14.length, d30: clientesD30.length },
      timestamp: hoje.toISOString(),
    })
  } catch (error) {
    console.error('❌ Erro no job de follow-up:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
