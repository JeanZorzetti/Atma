import { NextRequest, NextResponse } from 'next/server'
import { buscarClientePorEmail } from '@/lib/repositories/cliente-repository'
import { buscarRelatoriosPorCliente } from '@/lib/repositories/relatorio-repository'

/**
 * GET /api/admin/clientes/[email]
 * Busca histórico de relatórios de um cliente por email
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email)

    const cliente = await buscarClientePorEmail(email)

    if (!cliente) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cliente não encontrado'
        },
        { status: 404 }
      )
    }

    const relatorios = await buscarRelatoriosPorCliente(cliente.id!)

    return NextResponse.json({
      success: true,
      data: {
        cliente,
        relatorios
      }
    })
  } catch (error) {
    console.error('❌ Erro ao buscar histórico do cliente:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar histórico do cliente'
      },
      { status: 500 }
    )
  }
}
