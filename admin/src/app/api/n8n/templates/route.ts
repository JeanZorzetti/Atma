import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar templates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const category = searchParams.get('category')
    const isPublic = searchParams.get('isPublic')
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'useCount' // useCount, rating, createdAt

    if (id) {
      // Buscar template específico
      const template = await prisma.workflowTemplate.findUnique({
        where: { id }
      })

      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }

      // Incrementar contador de uso
      await prisma.workflowTemplate.update({
        where: { id },
        data: {
          useCount: {
            increment: 1
          }
        }
      })

      return NextResponse.json({ template })
    }

    // Buscar todos os templates com filtros
    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (isPublic !== null) where.isPublic = isPublic === 'true'
    if (status) where.status = status

    // Determinar ordem
    let orderBy: Record<string, string> = { useCount: 'desc' }
    if (sortBy === 'rating') orderBy = { rating: 'desc' }
    if (sortBy === 'createdAt') orderBy = { createdAt: 'desc' }

    const templates = await prisma.workflowTemplate.findMany({
      where,
      orderBy
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Criar novo template
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      category,
      tags,
      templateData,
      thumbnailUrl,
      configSchema,
      requiredServices,
      createdBy,
      isOfficial,
      isPublic,
      status
    } = body

    if (!name || !description || !templateData) {
      return NextResponse.json(
        { error: 'name, description, and templateData are required' },
        { status: 400 }
      )
    }

    const template = await prisma.workflowTemplate.create({
      data: {
        name,
        description,
        category: category || 'automation',
        tags,
        templateData,
        thumbnailUrl,
        configSchema,
        requiredServices,
        createdBy,
        isOfficial: isOfficial ?? false,
        isPublic: isPublic ?? true,
        status: status || 'active',
        useCount: 0
      }
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar template
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      description,
      category,
      tags,
      templateData,
      thumbnailUrl,
      configSchema,
      requiredServices,
      isOfficial,
      isPublic,
      status,
      rating
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    const template = await prisma.workflowTemplate.update({
      where: { id },
      data: {
        name,
        description,
        category,
        tags,
        templateData,
        thumbnailUrl,
        configSchema,
        requiredServices,
        isOfficial,
        isPublic,
        status,
        rating
      }
    })

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar template
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    await prisma.workflowTemplate.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
