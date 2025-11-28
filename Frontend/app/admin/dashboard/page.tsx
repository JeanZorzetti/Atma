'use client'

import { useEffect, useState } from 'react'

interface Estatisticas {
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
}

interface Problema {
  problema_principal: string
  quantidade: number
  score_medio: number
  consultas_agendadas: number
  taxa_conversao: number
}

interface Relatorio {
  id: number
  created_at: string
  cliente_nome: string
  cliente_email: string
  score: number
  categoria: string
  problema_principal: string
  custo_atma: number
  pdf_gerado: boolean
  pdf_enviado: boolean
  consulta_agendada: boolean
  tratamento_iniciado: boolean
}

export default function DashboardAdmin() {
  const [stats, setStats] = useState<Estatisticas | null>(null)
  const [problemas, setProblemas] = useState<Problema[]>([])
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      setLoading(true)

      // Buscar estatísticas
      const resStats = await fetch('/api/admin/estatisticas')
      const dataStats = await resStats.json()

      if (dataStats.success) {
        setStats(dataStats.data.geral)
        setProblemas(dataStats.data.problemasMaisComuns)
      }

      // Buscar relatórios recentes
      const resRelatorios = await fetch('/api/admin/relatorios?limit=20')
      const dataRelatorios = await resRelatorios.json()

      if (dataRelatorios.success) {
        setRelatorios(dataRelatorios.data.relatorios)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin - Atma CRM</h1>
          <p className="text-gray-600 mt-2">Visão geral dos relatórios e estatísticas</p>
        </div>

        {/* Estatísticas Gerais */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Total de Clientes</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">{stats.total_clientes}</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Total de Relatórios</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">{stats.total_relatorios}</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Score Médio</div>
              <div className="text-3xl font-bold text-green-600 mt-2">{stats.score_medio.toFixed(1)}</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Taxa de Conversão</div>
              <div className="text-3xl font-bold text-purple-600 mt-2">{stats.taxa_conversao_consulta.toFixed(1)}%</div>
            </div>
          </div>
        )}

        {/* Distribuição por Categoria */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Distribuição por Categoria</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.casos_simples}</div>
                <div className="text-sm text-gray-600 mt-1">Simples</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.casos_moderados}</div>
                <div className="text-sm text-gray-600 mt-1">Moderados</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.casos_complexos}</div>
                <div className="text-sm text-gray-600 mt-1">Complexos</div>
              </div>
            </div>
          </div>
        )}

        {/* Problemas Mais Comuns */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Problemas Mais Comuns</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score Médio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa Conversão
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {problemas.map((problema) => (
                  <tr key={problema.problema_principal}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {problema.problema_principal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {problema.quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {problema.score_medio.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {problema.taxa_conversao.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Relatórios Recentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Relatórios Recentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {relatorios.map((rel) => (
                  <tr key={rel.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(rel.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{rel.cliente_nome}</div>
                      <div className="text-xs text-gray-500">{rel.cliente_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-bold ${
                        rel.score >= 80 ? 'text-green-600' :
                        rel.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {rel.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rel.categoria === 'simples' ? 'bg-green-100 text-green-800' :
                        rel.categoria === 'moderado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {rel.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex gap-2">
                        {rel.pdf_enviado && <span className="text-green-600">✓ PDF</span>}
                        {rel.consulta_agendada && <span className="text-blue-600">✓ Consulta</span>}
                        {rel.tratamento_iniciado && <span className="text-purple-600">✓ Tratamento</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
