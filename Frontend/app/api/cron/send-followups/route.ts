import { NextRequest, NextResponse } from 'next/server'
import { enviarEmailD7, enviarEmailD14, enviarEmailD30 } from '@/lib/email'
import mysql from 'mysql2/promise'

// Configuração do banco MySQL
const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}

/**
 * API Route para enviar emails de follow-up automatizados
 * Executado diariamente via Vercel Cron
 *
 * Envia:
 * - Email D+7: 7 dias após receber o relatório
 * - Email D+14: 14 dias após receber o relatório
 * - Email D+30: 30 dias após receber o relatório
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar chave de autorização (segurança)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Iniciando job de follow-up automático...')

    // Conectar ao banco
    const connection = await mysql.createConnection(dbConfig)

    const hoje = new Date()
    let emailsEnviados = 0

    // ===== EMAIL D+7 =====
    console.log('📧 Processando emails D+7...')

    const [clientesD7]: any = await connection.query(`
      SELECT
        c.id as cliente_id,
        c.nome,
        c.email,
        r.id as relatorio_id,
        r.data_geracao,
        r.email_d7_enviado
      FROM clientes c
      INNER JOIN relatorios r ON c.id = r.cliente_id
      WHERE r.email_d7_enviado = FALSE
        AND DATEDIFF(NOW(), r.data_geracao) >= 7
        AND DATEDIFF(NOW(), r.data_geracao) < 8
      LIMIT 50
    `)

    for (const cliente of clientesD7) {
      try {
        await enviarEmailD7(cliente.email, cliente.nome, cliente.relatorio_id)

        // Marcar como enviado
        await connection.query(
          'UPDATE relatorios SET email_d7_enviado = TRUE, email_d7_data = NOW() WHERE id = ?',
          [cliente.relatorio_id]
        )

        emailsEnviados++
        console.log(`✅ D+7 enviado para: ${cliente.email}`)
      } catch (error) {
        console.error(`❌ Erro ao enviar D+7 para ${cliente.email}:`, error)
      }
    }

    // ===== EMAIL D+14 =====
    console.log('📧 Processando emails D+14...')

    const [clientesD14]: any = await connection.query(`
      SELECT
        c.id as cliente_id,
        c.nome,
        c.email,
        r.id as relatorio_id,
        r.data_geracao,
        r.email_d14_enviado
      FROM clientes c
      INNER JOIN relatorios r ON c.id = r.cliente_id
      WHERE r.email_d14_enviado = FALSE
        AND DATEDIFF(NOW(), r.data_geracao) >= 14
        AND DATEDIFF(NOW(), r.data_geracao) < 15
      LIMIT 50
    `)

    for (const cliente of clientesD14) {
      try {
        await enviarEmailD14(cliente.email, cliente.nome, cliente.relatorio_id)

        // Marcar como enviado
        await connection.query(
          'UPDATE relatorios SET email_d14_enviado = TRUE, email_d14_data = NOW() WHERE id = ?',
          [cliente.relatorio_id]
        )

        emailsEnviados++
        console.log(`✅ D+14 enviado para: ${cliente.email}`)
      } catch (error) {
        console.error(`❌ Erro ao enviar D+14 para ${cliente.email}:`, error)
      }
    }

    // ===== EMAIL D+30 =====
    console.log('📧 Processando emails D+30...')

    const [clientesD30]: any = await connection.query(`
      SELECT
        c.id as cliente_id,
        c.nome,
        c.email,
        r.id as relatorio_id,
        r.data_geracao,
        r.email_d30_enviado
      FROM clientes c
      INNER JOIN relatorios r ON c.id = r.cliente_id
      WHERE r.email_d30_enviado = FALSE
        AND DATEDIFF(NOW(), r.data_geracao) >= 30
        AND DATEDIFF(NOW(), r.data_geracao) < 31
      LIMIT 50
    `)

    for (const cliente of clientesD30) {
      try {
        await enviarEmailD30(cliente.email, cliente.nome, cliente.relatorio_id)

        // Marcar como enviado
        await connection.query(
          'UPDATE relatorios SET email_d30_enviado = TRUE, email_d30_data = NOW() WHERE id = ?',
          [cliente.relatorio_id]
        )

        emailsEnviados++
        console.log(`✅ D+30 enviado para: ${cliente.email}`)
      } catch (error) {
        console.error(`❌ Erro ao enviar D+30 para ${cliente.email}:`, error)
      }
    }

    await connection.end()

    console.log(`🎉 Job concluído! ${emailsEnviados} emails enviados.`)

    return NextResponse.json({
      success: true,
      emailsEnviados,
      breakdown: {
        d7: clientesD7.length,
        d14: clientesD14.length,
        d30: clientesD30.length,
      },
      timestamp: hoje.toISOString(),
    })

  } catch (error) {
    console.error('❌ Erro no job de follow-up:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
