import { query } from '../lib/db'

async function criarRelatorio() {
  const userId = 1 // ID do usuário Flow criado anteriormente

  try {
    const dadosJson = {
      nomeCompleto: 'Flow',
      email: 'flow@example.com',
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
    }

    console.log('Criando relatório...')
    await query(
      `INSERT INTO portal_relatorios (
        user_id, score, custo_estimado, duracao_meses,
        complexidade, status, is_active, dados_json,
        expires_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), NOW())`,
      [userId, 85, 8500, 12, 'Moderada', 'novo', true, JSON.stringify(dadosJson)]
    )

    console.log('\n🎉 Relatório criado com sucesso!')
    console.log('📊 Score: 85/100')
    console.log('💰 Custo: R$ 8.500,00')
    console.log('⏱️  Duração: 12 meses')
    console.log('🎯 Complexidade: Moderada')
    console.log('\n✅ Agora recarregue a página: https://atma.roilabs.com.br/portal')
    console.log('🎮 O Progress Tracker de gamificação aparecerá no Dashboard!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Erro:', error)
    process.exit(1)
  }
}

criarRelatorio()
