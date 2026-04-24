/**
 * Endpoint de teste para validar conexão com MySQL CRM
 * GET /api/crm/test
 */

import { NextResponse } from 'next/server'
import { testConnection, query } from '@/lib/db'
import { salvarCliente } from '@/lib/repositories/cliente-repository'

export async function GET() {
  try {
    console.log('🧪 Testando conexão MySQL CRM...')

    // Teste 1: Conexão básica
    const connected = await testConnection()
    if (!connected) {
      return NextResponse.json(
        { success: false, error: 'Falha ao conectar ao MySQL' },
        { status: 500 }
      )
    }

    // Teste 2: Listar tabelas
    const tables = await query<any>('SHOW TABLES')
    const tableNames = tables.map(t => Object.values(t)[0])

    // Teste 3: Verificar tabelas CRM
    const crmTables = ['clientes', 'relatorios', 'consultas', 'tratamentos', 'atividades']
    const missingTables = crmTables.filter(t => !tableNames.includes(t))

    if (missingTables.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Tabelas CRM faltando',
        missingTables,
        existingTables: tableNames
      }, { status: 500 })
    }

    // Teste 4: Contar registros
    const [clientesCount] = await query<{ total: number }>(
      'SELECT COUNT(*) as total FROM clientes'
    )
    const [relatoriosCount] = await query<{ total: number }>(
      'SELECT COUNT(*) as total FROM relatorios'
    )

    // Teste 5: Criar cliente de teste (se não existir)
    let testeClienteId: number | null = null
    try {
      testeClienteId = await salvarCliente({
        nome: 'Cliente Teste API',
        email: 'teste-api@atma.com.br',
        telefone: '(11) 99999-9999',
        idade: 30,
        cidade: 'São Paulo',
        estado: 'SP',
        profissao: 'Desenvolvedor'
      })
    } catch (error: any) {
      // Se já existe, tudo bem
      if (!error.message.includes('Duplicate entry')) {
        throw error
      }
    }

    return NextResponse.json({
      success: true,
      message: '✅ Conexão MySQL CRM funcionando!',
      tests: {
        connection: '✅ Conectado',
        tables: `✅ ${crmTables.length} tabelas CRM criadas`,
        data: {
          clientes: clientesCount.total,
          relatorios: relatoriosCount.total
        },
        testeCliente: testeClienteId ? `✅ Cliente teste criado (ID: ${testeClienteId})` : '✅ Cliente teste já existe'
      },
      database: {
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        tablesCount: tableNames.length,
        crmTables: crmTables
      }
    })

  } catch (error: any) {
    console.error('❌ Erro no teste CRM:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
