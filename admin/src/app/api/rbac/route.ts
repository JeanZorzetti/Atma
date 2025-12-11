import { NextRequest, NextResponse } from 'next/server'
import { getRBACManager, Role, Permission } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

// Mock current user (in production, get from session)
const CURRENT_USER_ID = 'user-123'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    const rbac = getRBACManager()

    switch (action) {
      case 'roles': {
        const roles = rbac.getRoleDefinitions()
        return NextResponse.json({ roles })
      }

      case 'role': {
        const role = searchParams.get('role') as Role | null

        if (!role) {
          return NextResponse.json(
            { error: 'Role is required' },
            { status: 400 }
          )
        }

        const roleDefinition = rbac.getRoleDefinition(role)
        return NextResponse.json({ role: roleDefinition })
      }

      case 'users': {
        const role = searchParams.get('role') as Role | null
        const isActive = searchParams.get('isActive')
        const search = searchParams.get('search')

        const users = rbac.listUsers({
          role: role || undefined,
          isActive: isActive ? isActive === 'true' : undefined,
          search: search || undefined,
        })

        return NextResponse.json({ users })
      }

      case 'user': {
        const userId = searchParams.get('userId')

        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }

        const user = rbac.getUser(userId)

        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ user })
      }

      case 'check-permission': {
        const userId = searchParams.get('userId') || CURRENT_USER_ID
        const permission = searchParams.get('permission') as Permission | null
        const workflowId = searchParams.get('workflowId') || undefined
        const environment = searchParams.get('environment') || undefined

        if (!permission) {
          return NextResponse.json(
            { error: 'Permission is required' },
            { status: 400 }
          )
        }

        const check = rbac.checkPermission(userId, permission, {
          workflowId,
          environment,
        })

        // Log the access attempt
        rbac.logAccess({
          userId,
          userName: rbac.getUser(userId)?.name || 'Unknown',
          action: 'check_permission',
          resource: 'permission',
          resourceId: permission,
          permission,
          granted: check.hasPermission,
          reason: check.reason,
        })

        return NextResponse.json({ check })
      }

      case 'access-logs': {
        const userId = searchParams.get('userId') || undefined
        const action = searchParams.get('logAction') || undefined
        const resource = searchParams.get('resource') || undefined
        const granted = searchParams.get('granted')
        const limit = parseInt(searchParams.get('limit') || '100')

        const logs = rbac.getAccessLogs({
          userId,
          action,
          resource,
          granted: granted ? granted === 'true' : undefined,
          limit,
        })

        return NextResponse.json({ logs })
      }

      case 'access-stats': {
        const userId = searchParams.get('userId') || undefined
        const stats = rbac.getAccessStats(userId)

        return NextResponse.json({ stats })
      }

      case 'users-with-permission': {
        const permission = searchParams.get('permission') as Permission | null

        if (!permission) {
          return NextResponse.json(
            { error: 'Permission is required' },
            { status: 400 }
          )
        }

        const users = rbac.getUsersWithPermission(permission)

        return NextResponse.json({ users })
      }

      case 'users-by-role': {
        const role = searchParams.get('role') as Role | null

        if (!role) {
          return NextResponse.json(
            { error: 'Role is required' },
            { status: 400 }
          )
        }

        const users = rbac.getUsersByRole(role)

        return NextResponse.json({ users })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in RBAC GET:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
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

    const rbac = getRBACManager()

    switch (action) {
      case 'create-user': {
        const { id, name, email, role } = body as {
          id: string
          name: string
          email: string
          role: Role
        }

        if (!id || !name || !email || !role) {
          return NextResponse.json(
            { error: 'ID, name, email, and role are required' },
            { status: 400 }
          )
        }

        const user = rbac.saveUser({
          id,
          name,
          email,
          role,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        return NextResponse.json({ user })
      }

      case 'update-user': {
        const { userId, ...updates } = body as {
          userId: string
          name?: string
          email?: string
        }

        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }

        const existingUser = rbac.getUser(userId)

        if (!existingUser) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          )
        }

        const user = rbac.saveUser({
          ...existingUser,
          ...updates,
          updatedAt: new Date(),
        })

        return NextResponse.json({ user })
      }

      case 'assign-role': {
        const { userId, role } = body as {
          userId: string
          role: Role
        }

        if (!userId || !role) {
          return NextResponse.json(
            { error: 'User ID and role are required' },
            { status: 400 }
          )
        }

        const user = rbac.assignRole(userId, role, CURRENT_USER_ID)

        return NextResponse.json({ user })
      }

      case 'add-custom-permission': {
        const { userId, permission } = body as {
          userId: string
          permission: Permission
        }

        if (!userId || !permission) {
          return NextResponse.json(
            { error: 'User ID and permission are required' },
            { status: 400 }
          )
        }

        const user = rbac.addCustomPermission(userId, permission)

        return NextResponse.json({ user })
      }

      case 'remove-custom-permission': {
        const { userId, permission } = body as {
          userId: string
          permission: Permission
        }

        if (!userId || !permission) {
          return NextResponse.json(
            { error: 'User ID and permission are required' },
            { status: 400 }
          )
        }

        const user = rbac.removeCustomPermission(userId, permission)

        return NextResponse.json({ user })
      }

      case 'set-workflow-restrictions': {
        const { userId, workflowIds } = body as {
          userId: string
          workflowIds: string[]
        }

        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }

        const user = rbac.setWorkflowRestrictions(userId, workflowIds || [])

        return NextResponse.json({ user })
      }

      case 'set-environment-restrictions': {
        const { userId, environments } = body as {
          userId: string
          environments: string[]
        }

        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }

        const user = rbac.setEnvironmentRestrictions(userId, environments || [])

        return NextResponse.json({ user })
      }

      case 'deactivate-user': {
        const { userId } = body as { userId: string }

        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }

        const user = rbac.deactivateUser(userId)

        return NextResponse.json({ user })
      }

      case 'activate-user': {
        const { userId } = body as { userId: string }

        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }

        const user = rbac.activateUser(userId)

        return NextResponse.json({ user })
      }

      case 'update-last-login': {
        const { userId } = body as { userId: string }

        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }

        rbac.updateLastLogin(userId)

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in RBAC POST:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
