import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar metadados de workflows
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const isTemplate = searchParams.get('isTemplate')

    if (workflowId) {
      // Buscar metadados de um workflow específico
      const metadata = await prisma.workflowMetadata.findUnique({
        where: { workflowId },
        include: {
          documentation: true,
          versions: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      })

      if (!metadata) {
        return NextResponse.json(
          { error: 'Workflow metadata not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ metadata })
    }

    // Buscar todos os metadados com filtros
    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (status) where.status = status
    if (isTemplate) where.isTemplate = isTemplate === 'true'

    const allMetadata = await prisma.workflowMetadata.findMany({
      where,
      include: {
        documentation: true,
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ metadata: allMetadata })
  } catch (error) {
    console.error('Error fetching workflow metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow metadata', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Criar ou atualizar metadados de um workflow
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      workflowId,
      workflowName,
      description,
      purpose,
      category,
      tags,
      author,
      authorEmail,
      team,
      version,
      versionNotes,
      status,
      isPublic,
      isTemplate,
      complexity,
      estimatedDuration,
      dependencies,
      requiredServices
    } = body

    if (!workflowId || !workflowName) {
      return NextResponse.json(
        { error: 'workflowId and workflowName are required' },
        { status: 400 }
      )
    }

    const metadata = await prisma.workflowMetadata.upsert({
      where: { workflowId },
      update: {
        workflowName,
        description,
        purpose,
        category,
        tags,
        author,
        authorEmail,
        team,
        version,
        versionNotes,
        status,
        isPublic,
        isTemplate,
        complexity,
        estimatedDuration,
        dependencies,
        requiredServices
      },
      create: {
        workflowId,
        workflowName,
        description,
        purpose,
        category,
        tags,
        author,
        authorEmail,
        team,
        version: version || '1.0.0',
        versionNotes,
        status: status || 'active',
        isPublic: isPublic ?? false,
        isTemplate: isTemplate ?? false,
        complexity,
        estimatedDuration,
        dependencies,
        requiredServices
      },
      include: {
        documentation: true,
        versions: true
      }
    })

    return NextResponse.json({ metadata })
  } catch (error) {
    console.error('Error saving workflow metadata:', error)
    return NextResponse.json(
      { error: 'Failed to save workflow metadata', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar metadados de um workflow
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      )
    }

    // Deletar metadados (cascade vai deletar documentação e versões)
    await prisma.workflowMetadata.delete({
      where: { workflowId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workflow metadata:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow metadata', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
