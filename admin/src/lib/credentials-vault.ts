/**
 * Sistema de Gestão de Credenciais (Vault)
 * Fase 4.1 - Segurança e Compliance
 */

import crypto from 'crypto'

export type CredentialType =
  | 'api_key'
  | 'basic_auth'
  | 'oauth2'
  | 'ssh_key'
  | 'database'
  | 'custom'

export type CredentialStatus = 'active' | 'expired' | 'revoked' | 'pending_rotation'

export interface Credential {
  id: string
  name: string
  type: CredentialType
  description?: string
  encryptedData: string
  status: CredentialStatus
  expiresAt?: Date
  lastRotatedAt?: Date
  rotationIntervalDays?: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
  tags?: string[]
  usedByWorkflows?: string[]
  metadata?: Record<string, unknown>
}

export interface CredentialAccessLog {
  id: string
  credentialId: string
  credentialName: string
  action: 'read' | 'create' | 'update' | 'delete' | 'rotate'
  userId: string
  userName: string
  timestamp: Date
  ipAddress?: string
  success: boolean
  reason?: string
}

export interface CredentialData {
  // For API Key
  apiKey?: string

  // For Basic Auth
  username?: string
  password?: string

  // For OAuth2
  clientId?: string
  clientSecret?: string
  accessToken?: string
  refreshToken?: string
  tokenType?: string

  // For SSH Key
  privateKey?: string
  publicKey?: string
  passphrase?: string

  // For Database
  host?: string
  port?: number
  database?: string
  user?: string

  // Custom fields
  [key: string]: unknown
}

export interface VaultConfig {
  encryptionAlgorithm: string
  keyDerivationIterations: number
  enableAutoRotation: boolean
  defaultRotationDays: number
  enableAccessLogging: boolean
  enableExpirationAlerts: boolean
  expirationAlertDays: number
}

class CredentialsVault {
  private static instance: CredentialsVault
  private config: VaultConfig = {
    encryptionAlgorithm: 'aes-256-gcm',
    keyDerivationIterations: 100000,
    enableAutoRotation: true,
    defaultRotationDays: 90,
    enableAccessLogging: true,
    enableExpirationAlerts: true,
    expirationAlertDays: 7,
  }

  // In-memory storage for demo (in production, use database)
  private credentials: Map<string, Credential> = new Map()
  private accessLogs: CredentialAccessLog[] = []

  private constructor() {}

  static getInstance(): CredentialsVault {
    if (!CredentialsVault.instance) {
      CredentialsVault.instance = new CredentialsVault()
    }
    return CredentialsVault.instance
  }

  updateConfig(config: Partial<VaultConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): VaultConfig {
    return { ...this.config }
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   */
  private encrypt(data: string, masterKey: string): string {
    try {
      // Generate a random IV (Initialization Vector)
      const iv = crypto.randomBytes(16)

      // Derive key from master key using PBKDF2
      const salt = crypto.randomBytes(32)
      const key = crypto.pbkdf2Sync(
        masterKey,
        salt,
        this.config.keyDerivationIterations,
        32,
        'sha256'
      )

      // Create cipher
      const cipher = crypto.createCipheriv(this.config.encryptionAlgorithm, key, iv) as crypto.CipherGCM

      // Encrypt data
      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')

      // Get auth tag for GCM mode
      const authTag = cipher.getAuthTag()

      // Combine salt, iv, authTag, and encrypted data
      const combined = {
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        data: encrypted,
      }

      return JSON.stringify(combined)
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Decrypt sensitive data
   */
  private decrypt(encryptedData: string, masterKey: string): string {
    try {
      const combined = JSON.parse(encryptedData)

      // Extract components
      const salt = Buffer.from(combined.salt, 'hex')
      const iv = Buffer.from(combined.iv, 'hex')
      const authTag = Buffer.from(combined.authTag, 'hex')
      const encrypted = combined.data

      // Derive key from master key
      const key = crypto.pbkdf2Sync(
        masterKey,
        salt,
        this.config.keyDerivationIterations,
        32,
        'sha256'
      )

      // Create decipher
      const decipher = crypto.createDecipheriv(this.config.encryptionAlgorithm, key, iv) as crypto.DecipherGCM
      decipher.setAuthTag(authTag)

      // Decrypt data
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Store a new credential
   */
  async storeCredential(
    name: string,
    type: CredentialType,
    data: CredentialData,
    options: {
      description?: string
      expiresAt?: Date
      rotationIntervalDays?: number
      createdBy: string
      tags?: string[]
      metadata?: Record<string, unknown>
    }
  ): Promise<Credential> {
    try {
      // Get master key from environment
      const masterKey = process.env.VAULT_MASTER_KEY || 'default-dev-key-change-in-production'

      // Validate credential name uniqueness
      if (this.credentials.has(name)) {
        throw new Error(`Credential with name "${name}" already exists`)
      }

      // Encrypt credential data
      const dataStr = JSON.stringify(data)
      const encryptedData = this.encrypt(dataStr, masterKey)

      // Create credential object
      const credential: Credential = {
        id: crypto.randomUUID(),
        name,
        type,
        description: options.description,
        encryptedData,
        status: 'active',
        expiresAt: options.expiresAt,
        lastRotatedAt: new Date(),
        rotationIntervalDays: options.rotationIntervalDays || this.config.defaultRotationDays,
        createdBy: options.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: options.tags,
        usedByWorkflows: [],
        metadata: options.metadata,
      }

      // Store credential
      this.credentials.set(credential.id, credential)

      // Log access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId: credential.id,
          credentialName: credential.name,
          action: 'create',
          userId: options.createdBy,
          userName: options.createdBy,
          success: true,
        })
      }

      return credential
    } catch (error) {
      // Log failed access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId: 'unknown',
          credentialName: name,
          action: 'create',
          userId: options.createdBy,
          userName: options.createdBy,
          success: false,
          reason: error instanceof Error ? error.message : 'Unknown error',
        })
      }
      throw error
    }
  }

  /**
   * Get credential (decrypted)
   */
  async getCredential(
    credentialId: string,
    userId: string,
    userName: string
  ): Promise<{ credential: Credential; data: CredentialData }> {
    try {
      const credential = this.credentials.get(credentialId)

      if (!credential) {
        throw new Error('Credential not found')
      }

      // Check if credential is expired
      if (credential.expiresAt && credential.expiresAt < new Date()) {
        throw new Error('Credential has expired')
      }

      // Check if credential is revoked
      if (credential.status === 'revoked') {
        throw new Error('Credential has been revoked')
      }

      // Get master key
      const masterKey = process.env.VAULT_MASTER_KEY || 'default-dev-key-change-in-production'

      // Decrypt data
      const dataStr = this.decrypt(credential.encryptedData, masterKey)
      const data = JSON.parse(dataStr) as CredentialData

      // Log access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId: credential.id,
          credentialName: credential.name,
          action: 'read',
          userId,
          userName,
          success: true,
        })
      }

      return { credential, data }
    } catch (error) {
      // Log failed access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId,
          credentialName: 'unknown',
          action: 'read',
          userId,
          userName,
          success: false,
          reason: error instanceof Error ? error.message : 'Unknown error',
        })
      }
      throw error
    }
  }

  /**
   * Update credential
   */
  async updateCredential(
    credentialId: string,
    updates: {
      name?: string
      description?: string
      data?: CredentialData
      status?: CredentialStatus
      expiresAt?: Date
      rotationIntervalDays?: number
      tags?: string[]
      metadata?: Record<string, unknown>
    },
    userId: string,
    userName: string
  ): Promise<Credential> {
    try {
      const credential = this.credentials.get(credentialId)

      if (!credential) {
        throw new Error('Credential not found')
      }

      // Update fields
      if (updates.name) credential.name = updates.name
      if (updates.description !== undefined) credential.description = updates.description
      if (updates.status) credential.status = updates.status
      if (updates.expiresAt) credential.expiresAt = updates.expiresAt
      if (updates.rotationIntervalDays) credential.rotationIntervalDays = updates.rotationIntervalDays
      if (updates.tags) credential.tags = updates.tags
      if (updates.metadata) credential.metadata = updates.metadata

      // If data is being updated, re-encrypt
      if (updates.data) {
        const masterKey = process.env.VAULT_MASTER_KEY || 'default-dev-key-change-in-production'
        const dataStr = JSON.stringify(updates.data)
        credential.encryptedData = this.encrypt(dataStr, masterKey)
      }

      credential.updatedAt = new Date()

      // Store updated credential
      this.credentials.set(credentialId, credential)

      // Log access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId: credential.id,
          credentialName: credential.name,
          action: 'update',
          userId,
          userName,
          success: true,
        })
      }

      return credential
    } catch (error) {
      // Log failed access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId,
          credentialName: 'unknown',
          action: 'update',
          userId,
          userName,
          success: false,
          reason: error instanceof Error ? error.message : 'Unknown error',
        })
      }
      throw error
    }
  }

  /**
   * Delete credential
   */
  async deleteCredential(
    credentialId: string,
    userId: string,
    userName: string
  ): Promise<void> {
    try {
      const credential = this.credentials.get(credentialId)

      if (!credential) {
        throw new Error('Credential not found')
      }

      // Check if credential is in use
      if (credential.usedByWorkflows && credential.usedByWorkflows.length > 0) {
        throw new Error(
          `Cannot delete credential. Used by ${credential.usedByWorkflows.length} workflow(s)`
        )
      }

      // Delete credential
      this.credentials.delete(credentialId)

      // Log access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId: credential.id,
          credentialName: credential.name,
          action: 'delete',
          userId,
          userName,
          success: true,
        })
      }
    } catch (error) {
      // Log failed access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId,
          credentialName: 'unknown',
          action: 'delete',
          userId,
          userName,
          success: false,
          reason: error instanceof Error ? error.message : 'Unknown error',
        })
      }
      throw error
    }
  }

  /**
   * Rotate credential (create new version)
   */
  async rotateCredential(
    credentialId: string,
    newData: CredentialData,
    userId: string,
    userName: string
  ): Promise<Credential> {
    try {
      const credential = this.credentials.get(credentialId)

      if (!credential) {
        throw new Error('Credential not found')
      }

      // Archive old credential (in production, store in separate table)
      // For now, just update with new data

      const masterKey = process.env.VAULT_MASTER_KEY || 'default-dev-key-change-in-production'
      const dataStr = JSON.stringify(newData)
      credential.encryptedData = this.encrypt(dataStr, masterKey)
      credential.lastRotatedAt = new Date()
      credential.updatedAt = new Date()

      // Reset status if it was pending rotation
      if (credential.status === 'pending_rotation') {
        credential.status = 'active'
      }

      this.credentials.set(credentialId, credential)

      // Log access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId: credential.id,
          credentialName: credential.name,
          action: 'rotate',
          userId,
          userName,
          success: true,
        })
      }

      return credential
    } catch (error) {
      // Log failed access
      if (this.config.enableAccessLogging) {
        this.logAccess({
          credentialId,
          credentialName: 'unknown',
          action: 'rotate',
          userId,
          userName,
          success: false,
          reason: error instanceof Error ? error.message : 'Unknown error',
        })
      }
      throw error
    }
  }

  /**
   * List all credentials (without decrypted data)
   */
  async listCredentials(filters?: {
    type?: CredentialType
    status?: CredentialStatus
    tags?: string[]
    search?: string
  }): Promise<Credential[]> {
    let credentials = Array.from(this.credentials.values())

    if (filters) {
      if (filters.type) {
        credentials = credentials.filter(c => c.type === filters.type)
      }

      if (filters.status) {
        credentials = credentials.filter(c => c.status === filters.status)
      }

      if (filters.tags && filters.tags.length > 0) {
        credentials = credentials.filter(c =>
          c.tags?.some(tag => filters.tags?.includes(tag))
        )
      }

      if (filters.search) {
        const search = filters.search.toLowerCase()
        credentials = credentials.filter(c =>
          c.name.toLowerCase().includes(search) ||
          c.description?.toLowerCase().includes(search)
        )
      }
    }

    return credentials
  }

  /**
   * Get credentials expiring soon
   */
  async getExpiringCredentials(daysAhead = 7): Promise<Credential[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead)

    return Array.from(this.credentials.values()).filter(c =>
      c.expiresAt &&
      c.expiresAt <= cutoffDate &&
      c.expiresAt > new Date() &&
      c.status === 'active'
    )
  }

  /**
   * Get credentials needing rotation
   */
  async getCredentialsNeedingRotation(): Promise<Credential[]> {
    const now = new Date()

    return Array.from(this.credentials.values()).filter(c => {
      if (!c.rotationIntervalDays || !c.lastRotatedAt) return false

      const rotationDate = new Date(c.lastRotatedAt)
      rotationDate.setDate(rotationDate.getDate() + c.rotationIntervalDays)

      return rotationDate <= now && c.status === 'active'
    })
  }

  /**
   * Mark credential as used by workflow
   */
  async markAsUsedBy(credentialId: string, workflowId: string): Promise<void> {
    const credential = this.credentials.get(credentialId)

    if (!credential) {
      throw new Error('Credential not found')
    }

    if (!credential.usedByWorkflows) {
      credential.usedByWorkflows = []
    }

    if (!credential.usedByWorkflows.includes(workflowId)) {
      credential.usedByWorkflows.push(workflowId)
      credential.updatedAt = new Date()
      this.credentials.set(credentialId, credential)
    }
  }

  /**
   * Remove workflow usage marker
   */
  async removeWorkflowUsage(credentialId: string, workflowId: string): Promise<void> {
    const credential = this.credentials.get(credentialId)

    if (!credential) {
      throw new Error('Credential not found')
    }

    if (credential.usedByWorkflows) {
      credential.usedByWorkflows = credential.usedByWorkflows.filter(id => id !== workflowId)
      credential.updatedAt = new Date()
      this.credentials.set(credentialId, credential)
    }
  }

  /**
   * Log credential access
   */
  private logAccess(log: Omit<CredentialAccessLog, 'id' | 'timestamp'>): void {
    const accessLog: CredentialAccessLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...log,
    }

    this.accessLogs.push(accessLog)

    // Keep only last 1000 logs in memory (in production, use database)
    if (this.accessLogs.length > 1000) {
      this.accessLogs = this.accessLogs.slice(-1000)
    }
  }

  /**
   * Get access logs
   */
  async getAccessLogs(filters?: {
    credentialId?: string
    userId?: string
    action?: CredentialAccessLog['action']
    startDate?: Date
    endDate?: Date
    limit?: number
  }): Promise<CredentialAccessLog[]> {
    let logs = [...this.accessLogs]

    if (filters) {
      if (filters.credentialId) {
        logs = logs.filter(l => l.credentialId === filters.credentialId)
      }

      if (filters.userId) {
        logs = logs.filter(l => l.userId === filters.userId)
      }

      if (filters.action) {
        logs = logs.filter(l => l.action === filters.action)
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
  async getAccessStats(credentialId?: string): Promise<{
    totalAccesses: number
    successfulAccesses: number
    failedAccesses: number
    uniqueUsers: number
    accessesByAction: Record<string, number>
    accessesByUser: Record<string, number>
  }> {
    let logs = this.accessLogs

    if (credentialId) {
      logs = logs.filter(l => l.credentialId === credentialId)
    }

    const successfulAccesses = logs.filter(l => l.success).length
    const failedAccesses = logs.filter(l => !l.success).length
    const uniqueUsers = new Set(logs.map(l => l.userId)).size

    const accessesByAction: Record<string, number> = {}
    const accessesByUser: Record<string, number> = {}

    logs.forEach(log => {
      accessesByAction[log.action] = (accessesByAction[log.action] || 0) + 1
      accessesByUser[log.userName] = (accessesByUser[log.userName] || 0) + 1
    })

    return {
      totalAccesses: logs.length,
      successfulAccesses,
      failedAccesses,
      uniqueUsers,
      accessesByAction,
      accessesByUser,
    }
  }
}

export function getCredentialsVault(): CredentialsVault {
  return CredentialsVault.getInstance()
}
