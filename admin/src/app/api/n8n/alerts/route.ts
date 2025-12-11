import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar alertas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {}
    if (workflowId) where.workflowId = workflowId
    if (status) where.status = status
    if (type) where.type = type

    const [alerts, total] = await Promise.all([
      prisma.workflowAlert.findMany({
        where,
        include: {
          execution: {
            select: {
              workflowName: true,
              status: true,
              startedAt: true,
              errorMessage: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.workflowAlert.count({ where })
    ])

    return NextResponse.json({
      alerts,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Criar alerta
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      executionId,
      type,
      title,
      message,
      workflowId,
      workflowName,
      channels
    } = body

    if (!type || !title || !message || !workflowId || !workflowName) {
      return NextResponse.json(
        { error: 'type, title, message, workflowId, and workflowName are required' },
        { status: 400 }
      )
    }

    const alert = await prisma.workflowAlert.create({
      data: {
        executionId,
        type,
        title,
        message,
        workflowId,
        workflowName,
        channels,
        status: 'pending'
      }
    })

    // Aqui você pode adicionar lógica para enviar o alerta via Slack, email, etc.
    // Por enquanto, vamos apenas criar o registro

    return NextResponse.json({ alert }, { status: 201 })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Failed to create alert', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar status do alerta (acknowledge, etc)
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, acknowledgedBy } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (acknowledgedBy) {
      updateData.acknowledgedBy = acknowledgedBy
      updateData.acknowledgedAt = new Date()
    }

    const alert = await prisma.workflowAlert.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ alert })
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json(
      { error: 'Failed to update alert', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
