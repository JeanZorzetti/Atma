/**
 * Script para criar um relatório de teste no portal
 * Execute: npx tsx scripts/criar-relatorio-teste.ts <clerk_user_id>
 */

import { query, queryOne } from '../lib/db'

async function criarRelatorioTeste() {
  const clerkUserId = process.argv[2]

  if (!clerkUserId) {
    console.error('❌ Erro: Forneça o clerk_user_id do usuário')
    console.log('Uso: npx tsx scripts/criar-relatorio-teste.ts <clerk_user_id>')
    console.log('\nPara encontrar seu clerk_user_id:')
    console.log('1. Acesse: https://dashboard.clerk.com/')
    console.log('2. Vá em Users')
    console.log('3. Clique no seu usuário')
    console.log('4. Copie o User ID (começa com "user_")')
    process.exit(1)
  }

  try {
    // Buscar usuário no banco
    const usuario = await queryOne<{ id: number; nome: string }>(
      'SELECT id, nome FROM portal_users WHERE clerk_user_id = ?',
      [clerkUserId]
    )

    if (!usuario) {
      console.error(`❌ Usuário não encontrado com clerk_user_id: ${clerkUserId}`)
      console.log('\n💡 O usuário precisa fazer login no portal primeiro para ser criado no banco.')
      process.exit(1)
    }

    console.log(`✅ Usuário encontrado: ${usuario.nome} (ID: ${usuario.id})`)

    // Verificar se já existe relatório ativo
    const relatorioExistente = await queryOne(
      `SELECT id FROM portal_relatorios
       WHERE user_id = ? AND is_active = TRUE`,
      [usuario.id]
    )

    if (relatorioExistente) {
      console.log('⚠️  Já existe um relatório ativo para este usuário')
      console.log('Se quiser criar um novo, primeiro desative o existente:')
      console.log(`UPDATE portal_relatorios SET is_active = FALSE WHERE id = ${relatorioExistente.id};`)
      process.exit(0)
    }

    // Dados do relatório de teste
    const dadosJson = {
      nomeCompleto: usuario.nome,
      email: 'teste@example.com',
      telefone: '(11) 99999-9999',
      idade: 28,
      problemasPrincipais: ['Dentes tortos', 'Mordida desalinhada'],
      dentesDesalinhados: 'moderado',
      mordidaDesalinhada: 'sim',
      espacosDentes: 'nao',
      analiseDetalhada: {
        viabilidadeTecnica: 90,
        complexidadeClinica: 'Moderada',
        progressaoEstimada: {
          mes3: 30,
          mes6: 60,
          mes9: 85,
          mes12: 100,
        },
        pontosAtencao: [
          'Rotação do incisivo central superior direito',
          'Apinhamento anterior inferior',
        ],
      },
      simulacao3D: {
        fotoAntes: '/images/placeholder-teeth-before.jpg',
        fotoDepois: '/images/placeholder-teeth-after.jpg',
        videoUrl: 'https://example.com/video-simulacao.mp4',
      },
    }

    // Inserir relatório
    const resultado = await query(
      `INSERT INTO portal_relatorios (
        user_id,
        score,
        custo_estimado,
        duracao_meses,
        complexidade,
        status,
        is_active,
        dados_json,
        expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
      [
        usuario.id,
        85, // score
        8500, // custo
        12, // duração em meses
        'Moderada',
        'novo',
        true,
        JSON.stringify(dadosJson),
      ]
    )

    console.log('\n🎉 Relatório de teste criado com sucesso!')
    console.log(`📊 Score: 85/100`)
    console.log(`💰 Custo: R$ 8.500,00`)
    console.log(`⏱️  Duração: 12 meses`)
    console.log(`🎯 Complexidade: Moderada`)
    console.log(`⏰ Expira em: 30 dias`)
    console.log(`\n✅ Agora você pode acessar: https://atma.roilabs.com.br/portal`)
    console.log(`\n🎮 O Progress Tracker de gamificação aparecerá no Dashboard!`)
  } catch (error) {
    console.error('❌ Erro ao criar relatório:', error)
    process.exit(1)
  }
}

criarRelatorioTeste()
