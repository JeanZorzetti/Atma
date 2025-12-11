/**
 * Sistema de Controle de Acesso Baseado em Roles (RBAC)
 * Fase 4.2 - Segurança e Compliance
 */

export enum Permission {
  // Workflow permissions
  VIEW_WORKFLOWS = 'workflows:view',
  CREATE_WORKFLOWS = 'workflows:create',
  EDIT_WORKFLOWS = 'workflows:edit',
  DELETE_WORKFLOWS = 'workflows:delete',
  EXECUTE_WORKFLOWS = 'workflows:execute',
  ACTIVATE_WORKFLOWS = 'workflows:activate',
  DEACTIVATE_WORKFLOWS = 'workflows:deactivate',

  // Execution permissions
  VIEW_EXECUTIONS = 'executions:view',
  RETRY_EXECUTIONS = 'executions:retry',
  DELETE_EXECUTIONS = 'executions:delete',

  // Credential permissions
  VIEW_CREDENTIALS = 'credentials:view',
  CREATE_CREDENTIALS = 'credentials:create',
  EDIT_CREDENTIALS = 'credentials:edit',
  DELETE_CREDENTIALS = 'credentials:delete',
  ROTATE_CREDENTIALS = 'credentials:rotate',

  // Environment permissions
  VIEW_ENVIRONMENTS = 'environments:view',
  SWITCH_ENVIRONMENTS = 'environments:switch',
  MANAGE_PRODUCTION = 'environments:production',

  // Testing permissions
  VIEW_TESTS = 'tests:view',
  CREATE_TESTS = 'tests:create',
  RUN_TESTS = 'tests:run',
  DELETE_TESTS = 'tests:delete',

  // Debug permissions
  VIEW_DEBUG = 'debug:view',
  USE_DEBUG = 'debug:use',

  // Validation permissions
  VIEW_VALIDATION = 'validation:view',
  RUN_VALIDATION = 'validation:run',

  // Template permissions
  VIEW_TEMPLATES = 'templates:view',
  CREATE_TEMPLATES = 'templates:create',
  EDIT_TEMPLATES = 'templates:edit',
  DELETE_TEMPLATES = 'templates:delete',

  // User management
  VIEW_USERS = 'users:view',
  CREATE_USERS = 'users:create',
  EDIT_USERS = 'users:edit',
  DELETE_USERS = 'users:delete',
  MANAGE_ROLES = 'users:roles',

  // Audit permissions
  VIEW_AUDIT_LOGS = 'audit:view',
  EXPORT_AUDIT_LOGS = 'audit:export',

  // System permissions
  VIEW_METRICS = 'system:metrics',
  MANAGE_SETTINGS = 'system:settings',
}

export enum Role {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  customPermissions?: Permission[]
  workflowRestrictions?: string[] // IDs of workflows they can access
  environmentRestrictions?: string[] // Which environments they can access
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface RoleDefinition {
  name: Role
  displayName: string
  description: string
  permissions: Permission[]
  color: string
  icon: string
}

export interface PermissionCheck {
  hasPermission: boolean
  reason?: string
  requiredRole?: Role
  requiredPermission?: Permission
}

export interface AccessLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  permission: Permission
  granted: boolean
  reason?: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

class RBACManager {
  private static instance: RBACManager

  // Role definitions
  private roleDefinitions: Record<Role, RoleDefinition> = {
    [Role.ADMIN]: {
      name: Role.ADMIN,
      displayName: 'Administrador',
      description: 'Acesso completo ao sistema',
      permissions: Object.values(Permission),
      color: 'red',
      icon: 'shield-check',
    },
    [Role.DEVELOPER]: {
      name: Role.DEVELOPER,
      displayName: 'Desenvolvedor',
      description: 'Pode criar, editar e testar workflows',
      permissions: [
        Permission.VIEW_WORKFLOWS,
        Permission.CREATE_WORKFLOWS,
        Permission.EDIT_WORKFLOWS,
        Permission.EXECUTE_WORKFLOWS,
        Permission.ACTIVATE_WORKFLOWS,
        Permission.DEACTIVATE_WORKFLOWS,
        Permission.VIEW_EXECUTIONS,
        Permission.RETRY_EXECUTIONS,
        Permission.VIEW_CREDENTIALS,
        Permission.VIEW_ENVIRONMENTS,
        Permission.SWITCH_ENVIRONMENTS,
        Permission.VIEW_TESTS,
        Permission.CREATE_TESTS,
        Permission.RUN_TESTS,
        Permission.DELETE_TESTS,
        Permission.VIEW_DEBUG,
        Permission.USE_DEBUG,
        Permission.VIEW_VALIDATION,
        Permission.RUN_VALIDATION,
        Permission.VIEW_TEMPLATES,
        Permission.CREATE_TEMPLATES,
        Permission.VIEW_METRICS,
      ],
      color: 'blue',
      icon: 'code',
    },
    [Role.OPERATOR]: {
      name: Role.OPERATOR,
      displayName: 'Operador',
      description: 'Pode executar e monitorar workflows',
      permissions: [
        Permission.VIEW_WORKFLOWS,
        Permission.EXECUTE_WORKFLOWS,
        Permission.ACTIVATE_WORKFLOWS,
        Permission.DEACTIVATE_WORKFLOWS,
        Permission.VIEW_EXECUTIONS,
        Permission.RETRY_EXECUTIONS,
        Permission.VIEW_ENVIRONMENTS,
        Permission.SWITCH_ENVIRONMENTS,
        Permission.VIEW_TESTS,
        Permission.RUN_TESTS,
        Permission.VIEW_VALIDATION,
        Permission.RUN_VALIDATION,
        Permission.VIEW_TEMPLATES,
        Permission.VIEW_METRICS,
      ],
      color: 'green',
      icon: 'play',
    },
    [Role.VIEWER]: {
      name: Role.VIEWER,
      displayName: 'Visualizador',
      description: 'Apenas visualização, sem alterações',
      permissions: [
        Permission.VIEW_WORKFLOWS,
        Permission.VIEW_EXECUTIONS,
        Permission.VIEW_ENVIRONMENTS,
        Permission.VIEW_TESTS,
        Permission.VIEW_DEBUG,
        Permission.VIEW_VALIDATION,
        Permission.VIEW_TEMPLATES,
        Permission.VIEW_METRICS,
      ],
      color: 'gray',
      icon: 'eye',
    },
  }

  // In-memory storage (in production, use database)
  private users: Map<string, User> = new Map()
  private accessLogs: AccessLog[] = []

  private constructor() {
    // Create default admin user
    this.users.set('user-123', {
      id: 'user-123',
      name: 'Admin User',
      email: 'admin@roilabs.com.br',
      role: Role.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static getInstance(): RBACManager {
    if (!RBACManager.instance) {
      RBACManager.instance = new RBACManager()
    }
    return RBACManager.instance
  }

  /**
   * Get all role definitions
   */
  getRoleDefinitions(): RoleDefinition[] {
    return Object.values(this.roleDefinitions)
  }

  /**
   * Get role definition
   */
  getRoleDefinition(role: Role): RoleDefinition {
    return this.roleDefinitions[role]
  }

  /**
   * Get all permissions for a role
   */
  getRolePermissions(role: Role): Permission[] {
    return this.roleDefinitions[role].permissions
  }

  /**
   * Check if a role has a specific permission
   */
  roleHasPermission(role: Role, permission: Permission): boolean {
    return this.roleDefinitions[role].permissions.includes(permission)
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): User | undefined {
    return this.users.get(userId)
  }

  /**
   * Create or update user
   */
  saveUser(user: User): User {
    this.users.set(user.id, user)
    return user
  }

  /**
   * List all users
   */
  listUsers(filters?: {
    role?: Role
    isActive?: boolean
    search?: string
  }): User[] {
    let users = Array.from(this.users.values())

    if (filters) {
      if (filters.role) {
        users = users.filter(u => u.role === filters.role)
      }

      if (typeof filters.isActive === 'boolean') {
        users = users.filter(u => u.isActive === filters.isActive)
      }

      if (filters.search) {
        const search = filters.search.toLowerCase()
        users = users.filter(u =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
        )
      }
    }

    return users
  }

  /**
   * Check if user has permission
   */
  checkPermission(
    userId: string,
    permission: Permission,
    options?: {
      workflowId?: string
      environment?: string
    }
  ): PermissionCheck {
    const user = this.users.get(userId)

    if (!user) {
      return {
        hasPermission: false,
        reason: 'User not found',
      }
    }

    if (!user.isActive) {
      return {
        hasPermission: false,
        reason: 'User is inactive',
      }
    }

    // Check custom permissions first
    if (user.customPermissions && user.customPermissions.includes(permission)) {
      return { hasPermission: true }
    }

    // Check role permissions
    const rolePermissions = this.getRolePermissions(user.role)
    if (!rolePermissions.includes(permission)) {
      return {
        hasPermission: false,
        reason: `Role ${user.role} does not have permission ${permission}`,
        requiredPermission: permission,
      }
    }

    // Check workflow restrictions
    if (options?.workflowId && user.workflowRestrictions) {
      if (!user.workflowRestrictions.includes(options.workflowId)) {
        return {
          hasPermission: false,
          reason: `User does not have access to workflow ${options.workflowId}`,
        }
      }
    }

    // Check environment restrictions
    if (options?.environment && user.environmentRestrictions) {
      if (!user.environmentRestrictions.includes(options.environment)) {
        return {
          hasPermission: false,
          reason: `User does not have access to environment ${options.environment}`,
        }
      }
    }

    // Special check for production environment
    if (options?.environment === 'production') {
      if (!rolePermissions.includes(Permission.MANAGE_PRODUCTION)) {
        return {
          hasPermission: false,
          reason: 'User does not have permission to access production environment',
          requiredPermission: Permission.MANAGE_PRODUCTION,
        }
      }
    }

    return { hasPermission: true }
  }

  /**
   * Check multiple permissions at once
   */
  checkPermissions(
    userId: string,
    permissions: Permission[],
    options?: {
      requireAll?: boolean // If true, user must have ALL permissions
      workflowId?: string
      environment?: string
    }
  ): PermissionCheck {
    const requireAll = options?.requireAll ?? true
    const checks = permissions.map(p => this.checkPermission(userId, p, options))

    if (requireAll) {
      const failed = checks.find(c => !c.hasPermission)
      if (failed) {
        return failed
      }
      return { hasPermission: true }
    } else {
      const passed = checks.find(c => c.hasPermission)
      if (passed) {
        return { hasPermission: true }
      }
      return {
        hasPermission: false,
        reason: 'User does not have any of the required permissions',
      }
    }
  }

  /**
   * Log access attempt
   */
  logAccess(log: Omit<AccessLog, 'id' | 'timestamp'>): void {
    const accessLog: AccessLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...log,
    }

    this.accessLogs.push(accessLog)

    // Keep only last 10000 logs in memory
    if (this.accessLogs.length > 10000) {
      this.accessLogs = this.accessLogs.slice(-10000)
    }
  }

  /**
   * Get access logs
   */
  getAccessLogs(filters?: {
    userId?: string
    action?: string
    resource?: string
    granted?: boolean
    startDate?: Date
    endDate?: Date
    limit?: number
  }): AccessLog[] {
    let logs = [...this.accessLogs]

    if (filters) {
      if (filters.userId) {
        logs = logs.filter(l => l.userId === filters.userId)
      }

      if (filters.action) {
        logs = logs.filter(l => l.action.includes(filters.action!))
      }

      if (filters.resource) {
        logs = logs.filter(l => l.resource === filters.resource)
      }

      if (typeof filters.granted === 'boolean') {
        logs = logs.filter(l => l.granted === filters.granted)
      }

      if (filters.startDate) {
        logs = logs.filter(l => l.timestamp >= filters.startDate!)
      }

      if (filters.endDate) {
        logs = logs.filter(l => l.timestamp <= filters.endDate!)
      }

      if (filters.limit) {
        logs = logs.slice(-filters.limit)
      }
    }

    return logs.reverse() // Most recent first
  }

  /**
   * Get access statistics
   */
  getAccessStats(userId?: string): {
    totalAttempts: number
    granted: number
    denied: number
    uniqueUsers: number
    attemptsByAction: Record<string, number>
    attemptsByResource: Record<string, number>
    denialReasons: Record<string, number>
  } {
    let logs = this.accessLogs

    if (userId) {
      logs = logs.filter(l => l.userId === userId)
    }

    const granted = logs.filter(l => l.granted).length
    const denied = logs.filter(l => !l.granted).length
    const uniqueUsers = new Set(logs.map(l => l.userId)).size

    const attemptsByAction: Record<string, number> = {}
    const attemptsByResource: Record<string, number> = {}
    const denialReasons: Record<string, number> = {}

    logs.forEach(log => {
      attemptsByAction[log.action] = (attemptsByAction[log.action] || 0) + 1
      attemptsByResource[log.resource] = (attemptsByResource[log.resource] || 0) + 1

      if (!log.granted && log.reason) {
        denialReasons[log.reason] = (denialReasons[log.reason] || 0) + 1
      }
    })

    return {
      totalAttempts: logs.length,
      granted,
      denied,
      uniqueUsers,
      attemptsByAction,
      attemptsByResource,
      denialReasons,
    }
  }

  /**
   * Assign role to user
   */
  assignRole(userId: string, role: Role, assignedBy: string): User {
    const user = this.users.get(userId)

    if (!user) {
      throw new Error('User not found')
    }

    user.role = role
    user.updatedAt = new Date()

    this.users.set(userId, user)

    // Log the role change
    this.logAccess({
      userId: assignedBy,
      userName: 'System',
      action: `assign_role:${role}`,
      resource: 'user',
      resourceId: userId,
      permission: Permission.MANAGE_ROLES,
      granted: true,
    })

    return user
  }

  /**
   * Add custom permission to user
   */
  addCustomPermission(userId: string, permission: Permission): User {
    const user = this.users.get(userId)

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.customPermissions) {
      user.customPermissions = []
    }

    if (!user.customPermissions.includes(permission)) {
      user.customPermissions.push(permission)
      user.updatedAt = new Date()
      this.users.set(userId, user)
    }

    return user
  }

  /**
   * Remove custom permission from user
   */
  removeCustomPermission(userId: string, permission: Permission): User {
    const user = this.users.get(userId)

    if (!user) {
      throw new Error('User not found')
    }

    if (user.customPermissions) {
      user.customPermissions = user.customPermissions.filter(p => p !== permission)
      user.updatedAt = new Date()
      this.users.set(userId, user)
    }

    return user
  }

  /**
   * Set workflow restrictions for user
   */
  setWorkflowRestrictions(userId: string, workflowIds: string[]): User {
    const user = this.users.get(userId)

    if (!user) {
      throw new Error('User not found')
    }

    user.workflowRestrictions = workflowIds
    user.updatedAt = new Date()
    this.users.set(userId, user)

    return user
  }

  /**
   * Set environment restrictions for user
   */
  setEnvironmentRestrictions(userId: string, environments: string[]): User {
    const user = this.users.get(userId)

    if (!user) {
      throw new Error('User not found')
    }

    user.environmentRestrictions = environments
    user.updatedAt = new Date()
    this.users.set(userId, user)

    return user
  }

  /**
   * Get all users with a specific permission
   */
  getUsersWithPermission(permission: Permission): User[] {
    return Array.from(this.users.values()).filter(user => {
      const check = this.checkPermission(user.id, permission)
      return check.hasPermission
    })
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: Role): User[] {
    return Array.from(this.users.values()).filter(user => user.role === role)
  }

  /**
   * Deactivate user
   */
  deactivateUser(userId: string): User {
    const user = this.users.get(userId)

    if (!user) {
      throw new Error('User not found')
    }

    user.isActive = false
    user.updatedAt = new Date()
    this.users.set(userId, user)

    return user
  }

  /**
   * Activate user
   */
  activateUser(userId: string): User {
    const user = this.users.get(userId)

    if (!user) {
      throw new Error('User not found')
    }

    user.isActive = true
    user.updatedAt = new Date()
    this.users.set(userId, user)

    return user
  }

  /**
   * Update user's last login
   */
  updateLastLogin(userId: string): void {
    const user = this.users.get(userId)

    if (user) {
      user.lastLoginAt = new Date()
      this.users.set(userId, user)
    }
  }
}

export function getRBACManager(): RBACManager {
  return RBACManager.getInstance()
}

/**
 * Helper decorator for permission checking
 */
export function requirePermission(permission: Permission) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: unknown[]) {
      const rbac = getRBACManager()
      // In production, get userId from session
      const userId = 'user-123'

      const check = rbac.checkPermission(userId, permission)

      if (!check.hasPermission) {
        throw new Error(`Permission denied: ${check.reason}`)
      }

      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}
