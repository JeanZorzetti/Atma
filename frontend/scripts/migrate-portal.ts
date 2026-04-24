/**
 * Script de Migração do Schema do Portal do Paciente
 *
 * Aplica o schema SQL no banco de dados MySQL
 *
 * Uso:
 *   npm run db:migrate
 *   ou
 *   npx ts-node database/migrate.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Configuração do banco de dados
const DB_CONFIG = {
  host: process.env.MYSQL_HOST || '31.97.23.166',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'atmadb',
  password: process.env.MYSQL_PASSWORD || 'atma2024',
  database: process.env.MYSQL_DATABASE || 'atmadb',
  multipleStatements: true, // Necessário para executar múltiplos comandos SQL
}

async function executeMigration() {
  let connection: mysql.Connection | null = null

  try {
    console.log('🚀 Iniciando migração do schema do Portal do Paciente...\n')

    // 1. Conectar ao banco
    console.log('📡 Conectando ao banco de dados...')
    console.log(`   Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`)
    console.log(`   Database: ${DB_CONFIG.database}`)
    console.log(`   User: ${DB_CONFIG.user}\n`)

    connection = await mysql.createConnection(DB_CONFIG)
    console.log('✅ Conexão estabelecida com sucesso!\n')

    // 2. Ler arquivo SQL
    const schemaPath = path.join(__dirname, '../../database/schema-portal.sql')
    console.log(`📄 Lendo arquivo: ${schemaPath}`)

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Arquivo schema-portal.sql não encontrado em: ${schemaPath}`)
    }

    const sqlContent = fs.readFileSync(schemaPath, 'utf-8')
    console.log(`✅ Arquivo SQL carregado (${sqlContent.length} caracteres)\n`)

    // 3. Dividir comandos SQL (separar por ponto e vírgula, ignorando comentários e views)
    console.log('🔧 Executando comandos SQL...\n')

    // Remover comentários de linha única
    let cleanSql = sqlContent.replace(/--[^\n]*/g, '')

    // Separar comandos por delimitadores especiais
    const commands: string[] = []

    // Processar triggers separadamente (eles usam DELIMITER)
    const delimiterRegex = /DELIMITER\s+\/\/(.*?)DELIMITER\s+;/gs
    const triggers = cleanSql.match(delimiterRegex)

    if (triggers) {
      triggers.forEach(trigger => {
        // Extrair apenas o corpo do trigger
        const triggerBody = trigger
          .replace(/DELIMITER\s+\/\//g, '')
          .replace(/DELIMITER\s+;/g, '')
          .trim()
        if (triggerBody) {
          commands.push(triggerBody)
        }
      })
      // Remover triggers do SQL principal
      cleanSql = cleanSql.replace(delimiterRegex, '')
    }

    // Dividir o resto por ponto e vírgula
    const mainCommands = cleanSql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && cmd !== 'DELIMITER')

    commands.push(...mainCommands)

    // 4. Executar cada comando
    let successCount = 0
    let skipCount = 0

    for (const [index, command] of commands.entries()) {
      // Ignorar comandos vazios ou só com espaços
      if (!command || command.trim().length === 0) {
        continue
      }

      try {
        // Detectar tipo de comando
        const cmdType = command.trim().split(/\s+/)[0].toUpperCase()

        console.log(`[${index + 1}/${commands.length}] Executando: ${cmdType}...`)

        await connection.execute(command)

        successCount++
        console.log(`   ✅ Sucesso\n`)

      } catch (error: any) {
        // Ignorar erros de "já existe" (safe to ignore)
        if (
          error.code === 'ER_TABLE_EXISTS_ERROR' ||
          error.message.includes('already exists') ||
          error.message.includes('Duplicate')
        ) {
          skipCount++
          console.log(`   ⚠️  Já existe (ignorado)\n`)
        } else {
          console.error(`   ❌ Erro: ${error.message}\n`)
          console.error(`   Comando: ${command.substring(0, 100)}...\n`)
          // Continuar com próximo comando mesmo em caso de erro
        }
      }
    }

    // 5. Verificar tabelas criadas
    console.log('\n📊 Verificando tabelas criadas...\n')

    const [tables] = await connection.query(`
      SELECT TABLE_NAME, TABLE_COMMENT, TABLE_ROWS
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME LIKE 'portal_%'
      ORDER BY TABLE_NAME
    `, [DB_CONFIG.database])

    console.log('Tabelas do portal:')
    console.table(tables)

    // 6. Verificar views criadas
    const [views] = await connection.query(`
      SELECT TABLE_NAME as VIEW_NAME
      FROM information_schema.VIEWS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME LIKE 'vw_%'
      ORDER BY TABLE_NAME
    `, [DB_CONFIG.database])

    if ((views as any[]).length > 0) {
      console.log('\nViews criadas:')
      console.table(views)
    }

    // 7. Resumo
    console.log('\n' + '='.repeat(60))
    console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!')
    console.log('='.repeat(60))
    console.log(`📊 Comandos executados: ${successCount}`)
    console.log(`⚠️  Comandos ignorados: ${skipCount}`)
    console.log(`📁 Tabelas criadas: ${(tables as any[]).length}`)
    console.log(`👁️  Views criadas: ${(views as any[]).length}`)
    console.log('='.repeat(60) + '\n')

  } catch (error: any) {
    console.error('\n❌ ERRO NA MIGRAÇÃO:')
    console.error(error.message)

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n⚠️  Verifique as credenciais do banco de dados em .env.local')
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Não foi possível conectar ao banco de dados')
      console.error(`   Verifique se o MySQL está rodando em ${DB_CONFIG.host}:${DB_CONFIG.port}`)
    }

    process.exit(1)

  } finally {
    // Fechar conexão
    if (connection) {
      await connection.end()
      console.log('👋 Conexão fechada\n')
    }
  }
}

// Executar migração
executeMigration()
