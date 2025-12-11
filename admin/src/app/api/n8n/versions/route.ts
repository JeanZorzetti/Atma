import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar versões de um workflow
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')
    const version = searchParams.get('version')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      )
    }

    if (version) {
      // Buscar uma versão específica
      const workflowVersion = await prisma.workflowVersion.findUnique({
        where: {
          workflowId_version: {
            workflowId,
            version
          }
        },
        include: {
          metadata: true
        }
      })

      if (!workflowVersion) {
        return NextResponse.json(
          { error: 'Version not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ version: workflowVersion })
    }

    // Buscar todas as versões do workflow
    const versions = await prisma.workflowVersion.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        metadata: {
          select: {
            workflowName: true,
            category: true
          }
        }
      }
    })

    // Buscar a versão ativa
    const activeVersion = versions.find((v: { isActive: boolean }) => v.isActive)

    return NextResponse.json({
      versions,
      activeVersion,
      total: versions.length
    })
  } catch (error) {
    console.error('Error fetching versions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch versions', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Criar nova versão de um workflow
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      workflowId,
      version,
      versionName,
      description,
      changeType,
      workflowData,
      gitCommitHash,
      gitBranch,
      gitTag,
      createdBy,
      createdByEmail,
      changelog,
      breakingChanges,
      isStable,
      setAsActive
    } = body

    if (!workflowId || !version || !workflowData) {
      return NextResponse.json(
        { error: 'workflowId, version, and workflowData are required' },
        { status: 400 }
      )
    }

    // Verificar se os metadados existem
    const metadata = await prisma.workflowMetadata.findUnique({
      where: { workflowId }
    })

    if (!metadata) {
      return NextResponse.json(
        { error: 'Workflow metadata not found. Create metadata first.' },
        { status: 404 }
      )
    }

    // Se setAsActive for true, desativar todas as versões anteriores
    if (setAsActive) {
      await prisma.workflowVersion.updateMany({
        where: {
          workflowId,
          isActive: true
        },
        data: {
          isActive: false
        }
      })
    }

    // Criar a nova versão
    const newVersion = await prisma.workflowVersion.create({
      data: {
        workflowId,
        version,
        versionName,
        description,
        changeType: changeType || 'minor',
        workflowData,
        gitCommitHash,
        gitBranch,
        gitTag,
        createdBy,
        createdByEmail,
        changelog,
        breakingChanges,
        isStable: isStable ?? true,
        isActive: setAsActive ?? false,
        deployedAt: setAsActive ? new Date() : null,
        deployedBy: setAsActive ? createdBy : null
      },
      include: {
        metadata: true
      }
    })

    // Atualizar a versão nos metadados
    if (setAsActive) {
      await prisma.workflowMetadata.update({
        where: { workflowId },
        data: {
          version,
          versionNotes: description
        }
      })
    }

    return NextResponse.json({ version: newVersion })
  } catch (error) {
    console.error('Error creating version:', error)
    return NextResponse.json(
      { error: 'Failed to create version', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PATCH - Ativar uma versão específica
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { workflowId, version, deployedBy } = body

    if (!workflowId || !version) {
      return NextResponse.json(
        { error: 'workflowId and version are required' },
        { status: 400 }
      )
    }

    // Desativar todas as versões anteriores
    await prisma.workflowVersion.updateMany({
      where: {
        workflowId,
        isActive: true
      },
      data: {
        isActive: false
      }
    })

    // Ativar a versão selecionada
    const activatedVersion = await prisma.workflowVersion.update({
      where: {
        workflowId_version: {
          workflowId,
          version
        }
      },
      data: {
        isActive: true,
        deployedAt: new Date(),
        deployedBy
      },
      include: {
        metadata: true
      }
    })

    // Atualizar os metadados
    await prisma.workflowMetadata.update({
      where: { workflowId },
      data: {
        version,
        versionNotes: activatedVersion.description
      }
    })

    return NextResponse.json({ version: activatedVersion })
  } catch (error) {
    console.error('Error activating version:', error)
    return NextResponse.json(
      { error: 'Failed to activate version', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar uma versão
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')
    const version = searchParams.get('version')

    if (!workflowId || !version) {
      return NextResponse.json(
        { error: 'workflowId and version are required' },
        { status: 400 }
      )
    }

    // Verificar se não é a versão ativa
    const versionToDelete = await prisma.workflowVersion.findUnique({
      where: {
        workflowId_version: {
          workflowId,
          version
        }
      }
    })

    if (versionToDelete?.isActive) {
      return NextResponse.json(
        { error: 'Cannot delete active version' },
        { status: 400 }
      )
    }

    await prisma.workflowVersion.delete({
      where: {
        workflowId_version: {
          workflowId,
          version
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting version:', error)
    return NextResponse.json(
      { error: 'Failed to delete version', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
