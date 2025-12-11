import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar execuções com filtros e paginação
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {}
    if (workflowId) where.workflowId = workflowId
    if (status) where.status = status

    const [executions, total] = await Promise.all([
      prisma.workflowExecution.findMany({
        where,
        include: {
          logs: {
            orderBy: { timestamp: 'desc' },
            take: 10
          },
          alerts: {
            where: { status: 'pending' }
          }
        },
        orderBy: { startedAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.workflowExecution.count({ where })
    ])

    return NextResponse.json({
      executions,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching executions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch executions', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Criar nova execução
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      workflowId,
      workflowName,
      executionId,
      status,
      mode,
      triggeredBy,
      inputData
    } = body

    if (!workflowId || !workflowName) {
      return NextResponse.json(
        { error: 'workflowId and workflowName are required' },
        { status: 400 }
      )
    }

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        workflowName,
        executionId,
        status: status || 'running',
        mode,
        triggeredBy,
        inputData
      }
    })

    return NextResponse.json({ execution }, { status: 201 })
  } catch (error) {
    console.error('Error creating execution:', error)
    return NextResponse.json(
      { error: 'Failed to create execution', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
