/**
 * Repositório de Relatórios
 * Fase 5.1: CRM Integration
 */

import { query, queryOne, insert } from '../db'

export interface Relatorio {
  id?: number
  cliente_id: number

  // Score e análise
  score: number
  categoria: string // simples, moderado, complexo

  // Problemas ortodônticos
  problemas_atuais?: string[] // Será JSON no banco
  problema_principal?: string

  // Dados do tratamento
  tempo_estimado?: string
  custo_min?: number
  custo_max?: number
  custo_atma?: number
  custo_invisalign?: number
  custo_aparelho_fixo?: number

  // Histórico ortodôntico
  ja_usou_aparelho?: string
  problemas_saude?: string[] // Será JSON no banco

  // Expectativas e urgência
  expectativa_resultado?: string
  urgencia_tratamento?: string
  orcamento_recebido?: string
  disponibilidade_uso?: string

  // Breakdown do score
  score_complexidade?: number
  score_idade?: number
  score_historico?: number
  score_saude?: number
  score_expectativas?: number

  // Metadados
  pdf_gerado?: boolean
  pdf_enviado?: boolean
  consulta_agendada?: boolean
  tratamento_iniciado?: boolean

  created_at?: Date
  updated_at?: Date
}

export interface RelatorioComCliente extends Relatorio {
  cliente_nome: string
  cliente_email: string
}

/**
 * Salva relatório no banco
 */
export async function salvarRelatorio(relatorio: Relatorio): Promise<number> {
  return insert(
    `INSERT INTO relatorios (
      cliente_id, score, categoria,
      problemas_atuais, problema_principal,
      tempo_estimado, custo_min, custo_max,
      custo_atma, custo_invisalign, custo_aparelho_fixo,
      ja_usou_aparelho, problemas_saude,
      expectativa_resultado, urgencia_tratamento, orcamento_recebido, disponibilidade_uso,
      score_complexidade, score_idade, score_historico, score_saude, score_expectativas,
      pdf_gerado, pdf_enviado, consulta_agendada, tratamento_iniciado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      relatorio.cliente_id,
      relatorio.score,
      relatorio.categoria,
      relatorio.problemas_atuais ? JSON.stringify(relatorio.problemas_atuais) : null,
      relatorio.problema_principal,
      relatorio.tempo_estimado,
      relatorio.custo_min,
      relatorio.custo_max,
      relatorio.custo_atma,
      relatorio.custo_invisalign,
      relatorio.custo_aparelho_fixo,
      relatorio.ja_usou_aparelho,
      relatorio.problemas_saude ? JSON.stringify(relatorio.problemas_saude) : null,
      relatorio.expectativa_resultado,
      relatorio.urgencia_tratamento,
      relatorio.orcamento_recebido,
      relatorio.disponibilidade_uso,
      relatorio.score_complexidade,
      relatorio.score_idade,
      relatorio.score_historico,
      relatorio.score_saude,
      relatorio.score_expectativas,
      relatorio.pdf_gerado || false,
      relatorio.pdf_enviado || false,
      relatorio.consulta_agendada || false,
      relatorio.tratamento_iniciado || false
    ]
  )
}

/**
 * Busca relatório por ID
 */
export async function buscarRelatorioPorId(id: number): Promise<Relatorio | null> {
  const relatorio = await queryOne<any>(
    'SELECT * FROM relatorios WHERE id = ? LIMIT 1',
    [id]
  )

  if (!relatorio) return null

  // Parsear JSON fields
  if (relatorio.problemas_atuais) {
    relatorio.problemas_atuais = JSON.parse(relatorio.problemas_atuais)
  }
  if (relatorio.problemas_saude) {
    relatorio.problemas_saude = JSON.parse(relatorio.problemas_saude)
  }

  return relatorio
}

/**
 * Busca relatórios de um cliente
 */
export async function buscarRelatoriosPorCliente(clienteId: number): Promise<Relatorio[]> {
  const relatorios = await query<any>(
    'SELECT * FROM relatorios WHERE cliente_id = ? ORDER BY created_at DESC',
    [clienteId]
  )

  // Parsear JSON fields
  return relatorios.map(r => ({
    ...r,
    problemas_atuais: r.problemas_atuais ? JSON.parse(r.problemas_atuais) : null,
    problemas_saude: r.problemas_saude ? JSON.parse(r.problemas_saude) : null
  }))
}

/**
 * Lista relatórios recentes (com dados do cliente)
 */
export async function listarRelatoriosRecentes(limit = 50, offset = 0): Promise<RelatorioComCliente[]> {
  const relatorios = await query<any>(
    `SELECT
      r.*,
      c.nome as cliente_nome,
      c.email as cliente_email
    FROM relatorios r
    INNER JOIN clientes c ON r.cliente_id = c.id
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?`,
    [limit, offset]
  )

  // Parsear JSON fields
  return relatorios.map(r => ({
    ...r,
    problemas_atuais: r.problemas_atuais ? JSON.parse(r.problemas_atuais) : null,
    problemas_saude: r.problemas_saude ? JSON.parse(r.problemas_saude) : null
  }))
}

/**
 * Atualiza status do relatório (PDF gerado, enviado, etc.)
 */
export async function atualizarStatusRelatorio(id: number, dados: {
  pdf_gerado?: boolean
  pdf_enviado?: boolean
  consulta_agendada?: boolean
  tratamento_iniciado?: boolean
}): Promise<void> {
  const campos: string[] = []
  const valores: any[] = []

  if (dados.pdf_gerado !== undefined) {
    campos.push('pdf_gerado = ?')
    valores.push(dados.pdf_gerado)
  }
  if (dados.pdf_enviado !== undefined) {
    campos.push('pdf_enviado = ?')
    valores.push(dados.pdf_enviado)
  }
  if (dados.consulta_agendada !== undefined) {
    campos.push('consulta_agendada = ?')
    valores.push(dados.consulta_agendada)
  }
  if (dados.tratamento_iniciado !== undefined) {
    campos.push('tratamento_iniciado = ?')
    valores.push(dados.tratamento_iniciado)
  }

  if (campos.length === 0) return

  valores.push(id)

  await query(
    `UPDATE relatorios SET ${campos.join(', ')} WHERE id = ?`,
    valores
  )
}

/**
 * Conta total de relatórios
 */
export async function contarRelatorios(): Promise<number> {
  const result = await queryOne<{ total: number }>(
    'SELECT COUNT(*) as total FROM relatorios'
  )
  return result?.total || 0
}

/**
 * Busca estatísticas gerais
 */
export async function buscarEstatisticasGerais(): Promise<{
  total_clientes: number
  total_relatorios: number
  score_medio: number
  casos_simples: number
  casos_moderados: number
  casos_complexos: number
  consultas_agendadas: number
  tratamentos_iniciados: number
  taxa_conversao_consulta: number
  taxa_conversao_tratamento: number
}> {
  const stats = await queryOne<any>('SELECT * FROM estatisticas_gerais')

  return {
    total_clientes: stats?.total_clientes || 0,
    total_relatorios: stats?.total_relatorios || 0,
    score_medio: parseFloat(stats?.score_medio || 0),
    casos_simples: stats?.casos_simples || 0,
    casos_moderados: stats?.casos_moderados || 0,
    casos_complexos: stats?.casos_complexos || 0,
    consultas_agendadas: stats?.consultas_agendadas || 0,
    tratamentos_iniciados: stats?.tratamentos_iniciados || 0,
    taxa_conversao_consulta: parseFloat(stats?.taxa_conversao_consulta || 0),
    taxa_conversao_tratamento: parseFloat(stats?.taxa_conversao_tratamento || 0)
  }
}

/**
 * Busca problemas mais comuns
 */
export async function buscarProblemasMaisComuns(): Promise<Array<{
  problema_principal: string
  quantidade: number
  score_medio: number
  consultas_agendadas: number
  taxa_conversao: number
}>> {
  const problemas = await query<any>('SELECT * FROM problemas_mais_comuns LIMIT 10')

  return problemas.map(p => ({
    problema_principal: p.problema_principal,
    quantidade: p.quantidade,
    score_medio: parseFloat(p.score_medio || 0),
    consultas_agendadas: p.consultas_agendadas,
    taxa_conversao: parseFloat(p.taxa_conversao || 0)
  }))
}
