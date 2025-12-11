import { NextRequest, NextResponse } from 'next/server'
import {
  getCredentialsVault,
  CredentialType,
  CredentialStatus,
  CredentialData,
  VaultConfig,
} from '@/lib/credentials-vault'

export const dynamic = 'force-dynamic'

// Mock user for demo (in production, get from session)
const MOCK_USER = {
  id: 'user-123',
  name: 'Admin User',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    const vault = getCredentialsVault()

    switch (action) {
      case 'list': {
        const type = searchParams.get('type') as CredentialType | null
        const status = searchParams.get('status') as CredentialStatus | null
        const search = searchParams.get('search')
        const tags = searchParams.get('tags')?.split(',').filter(Boolean)

        const credentials = await vault.listCredentials({
          type: type || undefined,
          status: status || undefined,
          search: search || undefined,
          tags: tags || undefined,
        })

        return NextResponse.json({ credentials })
      }

      case 'get': {
        const credentialId = searchParams.get('credentialId')

        if (!credentialId) {
          return NextResponse.json(
            { error: 'Credential ID is required' },
            { status: 400 }
          )
        }

        const result = await vault.getCredential(
          credentialId,
          MOCK_USER.id,
          MOCK_USER.name
        )

        return NextResponse.json(result)
      }

      case 'expiring': {
        const daysAhead = parseInt(searchParams.get('daysAhead') || '7')
        const credentials = await vault.getExpiringCredentials(daysAhead)

        return NextResponse.json({ credentials })
      }

      case 'needs-rotation': {
        const credentials = await vault.getCredentialsNeedingRotation()

        return NextResponse.json({ credentials })
      }

      case 'access-logs': {
        const credentialId = searchParams.get('credentialId') || undefined
        const userId = searchParams.get('userId') || undefined
        const action = searchParams.get('logAction') as 'read' | 'create' | 'update' | 'delete' | 'rotate' | undefined
        const limit = parseInt(searchParams.get('limit') || '50')

        const logs = await vault.getAccessLogs({
          credentialId,
          userId,
          action,
          limit,
        })

        return NextResponse.json({ logs })
      }

      case 'access-stats': {
        const credentialId = searchParams.get('credentialId') || undefined
        const stats = await vault.getAccessStats(credentialId)

        return NextResponse.json({ stats })
      }

      case 'config': {
        const config = vault.getConfig()
        return NextResponse.json({ config })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in credentials GET:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const body = await request.json()

    const vault = getCredentialsVault()

    switch (action) {
      case 'create': {
        const { name, type, data, description, expiresAt, rotationIntervalDays, tags, metadata } = body as {
          name: string
          type: CredentialType
          data: CredentialData
          description?: string
          expiresAt?: string
          rotationIntervalDays?: number
          tags?: string[]
          metadata?: Record<string, unknown>
        }

        if (!name || !type || !data) {
          return NextResponse.json(
            { error: 'Name, type, and data are required' },
            { status: 400 }
          )
        }

        const credential = await vault.storeCredential(name, type, data, {
          description,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
          rotationIntervalDays,
          createdBy: MOCK_USER.id,
          tags,
          metadata,
        })

        return NextResponse.json({ credential })
      }

      case 'update': {
        const { credentialId, ...updates } = body as {
          credentialId: string
          name?: string
          description?: string
          data?: CredentialData
          status?: CredentialStatus
          expiresAt?: string
          rotationIntervalDays?: number
          tags?: string[]
          metadata?: Record<string, unknown>
        }

        if (!credentialId) {
          return NextResponse.json(
            { error: 'Credential ID is required' },
            { status: 400 }
          )
        }

        const credential = await vault.updateCredential(
          credentialId,
          {
            ...updates,
            expiresAt: updates.expiresAt ? new Date(updates.expiresAt) : undefined,
          },
          MOCK_USER.id,
          MOCK_USER.name
        )

        return NextResponse.json({ credential })
      }

      case 'delete': {
        const { credentialId } = body as { credentialId: string }

        if (!credentialId) {
          return NextResponse.json(
            { error: 'Credential ID is required' },
            { status: 400 }
          )
        }

        await vault.deleteCredential(credentialId, MOCK_USER.id, MOCK_USER.name)

        return NextResponse.json({ success: true })
      }

      case 'rotate': {
        const { credentialId, newData } = body as {
          credentialId: string
          newData: CredentialData
        }

        if (!credentialId || !newData) {
          return NextResponse.json(
            { error: 'Credential ID and new data are required' },
            { status: 400 }
          )
        }

        const credential = await vault.rotateCredential(
          credentialId,
          newData,
          MOCK_USER.id,
          MOCK_USER.name
        )

        return NextResponse.json({ credential })
      }

      case 'mark-used-by': {
        const { credentialId, workflowId } = body as {
          credentialId: string
          workflowId: string
        }

        if (!credentialId || !workflowId) {
          return NextResponse.json(
            { error: 'Credential ID and workflow ID are required' },
            { status: 400 }
          )
        }

        await vault.markAsUsedBy(credentialId, workflowId)

        return NextResponse.json({ success: true })
      }

      case 'remove-workflow-usage': {
        const { credentialId, workflowId } = body as {
          credentialId: string
          workflowId: string
        }

        if (!credentialId || !workflowId) {
          return NextResponse.json(
            { error: 'Credential ID and workflow ID are required' },
            { status: 400 }
          )
        }

        await vault.removeWorkflowUsage(credentialId, workflowId)

        return NextResponse.json({ success: true })
      }

      case 'update-config': {
        const { config } = body as { config: Partial<VaultConfig> }

        if (!config) {
          return NextResponse.json(
            { error: 'Config is required' },
            { status: 400 }
          )
        }

        vault.updateConfig(config)
        const updatedConfig = vault.getConfig()

        return NextResponse.json({ config: updatedConfig })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in credentials POST:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
