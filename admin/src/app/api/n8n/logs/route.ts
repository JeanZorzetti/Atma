import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar logs com filtros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const executionId = searchParams.get('executionId')
    const level = searchParams.get('level')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {}
    if (executionId) where.executionId = executionId
    if (level) where.level = level

    const [logs, total] = await Promise.all([
      prisma.workflowLog.findMany({
        where,
        include: {
          execution: {
            select: {
              workflowId: true,
              workflowName: true,
              status: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.workflowLog.count({ where })
    ])

    return NextResponse.json({
      logs,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Criar novo log
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      executionId,
      level,
      message,
      nodeName,
      nodeType,
      data
    } = body

    if (!executionId || !level || !message) {
      return NextResponse.json(
        { error: 'executionId, level, and message are required' },
        { status: 400 }
      )
    }

    const log = await prisma.workflowLog.create({
      data: {
        executionId,
        level,
        message,
        nodeName,
        nodeType,
        data
      }
    })

    return NextResponse.json({ log }, { status: 201 })
  } catch (error) {
    console.error('Error creating log:', error)
    return NextResponse.json(
      { error: 'Failed to create log', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
