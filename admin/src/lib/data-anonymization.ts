/**
 * Sistema de Anonimização de Dados para Compliance LGPD
 *
 * Este módulo implementa anonimização automática de dados sensíveis
 * em logs, execuções e outros registros do sistema.
 */

import crypto from 'crypto'

// Tipos de dados sensíveis reconhecidos
export enum SensitiveDataType {
  EMAIL = 'email',
  PHONE = 'phone',
  CPF = 'cpf',
  CNPJ = 'cnpj',
  CREDIT_CARD = 'creditCard',
  ADDRESS = 'address',
  NAME = 'name',
  IP_ADDRESS = 'ipAddress',
  PASSWORD = 'password',
  API_KEY = 'apiKey',
  TOKEN = 'token',
}

// Nível de anonimização
export enum AnonymizationLevel {
  NONE = 'none',           // Sem anonimização
  PARTIAL = 'partial',     // Anonimização parcial (mantém alguns caracteres)
  FULL = 'full',          // Anonimização completa
  HASH = 'hash',          // Hash irreversível
}

// Configuração de anonimização
export interface AnonymizationConfig {
  level: AnonymizationLevel
  fieldsToAnonymize: SensitiveDataType[]
  preserveFormat: boolean  // Mantém formato (ex: XXX.XXX.XXX-XX para CPF)
  hashSalt?: string       // Salt para hashing
}

// Resultado de anonimização
export interface AnonymizationResult {
  original: unknown
  anonymized: unknown
  fieldsAnonymized: string[]
  level: AnonymizationLevel
  timestamp: Date
}

/**
 * Classe singleton para anonimização de dados
 */
export class DataAnonymizer {
  private static instance: DataAnonymizer
  private config: AnonymizationConfig

  private constructor() {
    // Configuração padrão
    this.config = {
      level: AnonymizationLevel.PARTIAL,
      fieldsToAnonymize: Object.values(SensitiveDataType),
      preserveFormat: true,
      hashSalt: process.env.ANONYMIZATION_SALT || 'atma-default-salt-2025',
    }
  }

  /**
   * Obtém instância singleton
   */
  public static getInstance(): DataAnonymizer {
    if (!DataAnonymizer.instance) {
      DataAnonymizer.instance = new DataAnonymizer()
    }
    return DataAnonymizer.instance
  }

  /**
   * Atualiza configuração
   */
  public updateConfig(config: Partial<AnonymizationConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Obtém configuração atual
   */
  public getConfig(): AnonymizationConfig {
    return { ...this.config }
  }

  /**
   * Anonimiza um objeto completo
   */
  public anonymizeObject(data: unknown, level?: AnonymizationLevel): AnonymizationResult {
    const anonymizationLevel = level || this.config.level
    const fieldsAnonymized: string[] = []

    const anonymized = this.deepAnonymize(data, fieldsAnonymized, anonymizationLevel)

    return {
      original: data,
      anonymized,
      fieldsAnonymized,
      level: anonymizationLevel,
      timestamp: new Date(),
    }
  }

  /**
   * Anonimiza recursivamente um objeto
   */
  private deepAnonymize(obj: unknown, fieldsAnonymized: string[], level: AnonymizationLevel, path = ''): unknown {
    if (obj === null || obj === undefined) {
      return obj
    }

    // Se for array, processar cada item
    if (Array.isArray(obj)) {
      return obj.map((item, index) =>
        this.deepAnonymize(item, fieldsAnonymized, level, `${path}[${index}]`)
      )
    }

    // Se for objeto, processar cada propriedade
    if (typeof obj === 'object') {
      const result: Record<string, unknown> = {}

      for (const [key, value] of Object.entries(obj)) {
        const fieldPath = path ? `${path}.${key}` : key

        // Detectar tipo de dado sensível
        const dataType = this.detectSensitiveDataType(key, value)

        if (dataType && this.config.fieldsToAnonymize.includes(dataType)) {
          result[key] = this.anonymizeField(value, dataType, level)
          fieldsAnonymized.push(fieldPath)
        } else if (typeof value === 'object') {
          result[key] = this.deepAnonymize(value, fieldsAnonymized, level, fieldPath)
        } else {
          result[key] = value
        }
      }

      return result
    }

    // Valores primitivos
    return obj
  }

  /**
   * Detecta tipo de dado sensível baseado no nome do campo e valor
   */
  private detectSensitiveDataType(fieldName: string, value: unknown): SensitiveDataType | null {
    if (typeof value !== 'string') return null

    const lowerFieldName = fieldName.toLowerCase()

    // Email
    if (lowerFieldName.includes('email') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return SensitiveDataType.EMAIL
    }

    // Telefone
    if (lowerFieldName.includes('phone') || lowerFieldName.includes('telefone') || lowerFieldName.includes('celular')) {
      return SensitiveDataType.PHONE
    }

    // CPF
    if (lowerFieldName.includes('cpf') || /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(value)) {
      return SensitiveDataType.CPF
    }

    // CNPJ
    if (lowerFieldName.includes('cnpj') || /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/.test(value)) {
      return SensitiveDataType.CNPJ
    }

    // Cartão de crédito
    if (lowerFieldName.includes('card') || lowerFieldName.includes('cartao') || /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/.test(value)) {
      return SensitiveDataType.CREDIT_CARD
    }

    // Senha
    if (lowerFieldName.includes('password') || lowerFieldName.includes('senha') || lowerFieldName.includes('secret')) {
      return SensitiveDataType.PASSWORD
    }

    // API Key / Token
    if (lowerFieldName.includes('apikey') || lowerFieldName.includes('api_key') || lowerFieldName.includes('token') || lowerFieldName.includes('bearer')) {
      return SensitiveDataType.API_KEY
    }

    // Endereço
    if (lowerFieldName.includes('address') || lowerFieldName.includes('endereco') || lowerFieldName.includes('rua') || lowerFieldName.includes('street')) {
      return SensitiveDataType.ADDRESS
    }

    // Nome
    if (lowerFieldName.includes('name') || lowerFieldName.includes('nome')) {
      return SensitiveDataType.NAME
    }

    // IP Address
    if (lowerFieldName.includes('ip') || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) {
      return SensitiveDataType.IP_ADDRESS
    }

    return null
  }

  /**
   * Anonimiza um campo específico
   */
  private anonymizeField(value: unknown, type: SensitiveDataType, level: AnonymizationLevel): string {
    if (typeof value !== 'string') {
      return '***'
    }

    switch (level) {
      case AnonymizationLevel.NONE:
        return value

      case AnonymizationLevel.PARTIAL:
        return this.partialAnonymize(value, type)

      case AnonymizationLevel.FULL:
        return this.fullAnonymize(value, type)

      case AnonymizationLevel.HASH:
        return this.hashValue(value)

      default:
        return '***'
    }
  }

  /**
   * Anonimização parcial (mantém alguns caracteres)
   */
  private partialAnonymize(value: string, type: SensitiveDataType): string {
    switch (type) {
      case SensitiveDataType.EMAIL:
        // ex: jo***@ex***.com
        const [localPart, domain] = value.split('@')
        if (!domain) return '***@***.***'
        const [domainName, tld] = domain.split('.')
        return `${localPart.substring(0, 2)}***@${domainName.substring(0, 2)}***.${tld}`

      case SensitiveDataType.PHONE:
        // ex: (11) 9****-1234
        const digits = value.replace(/\D/g, '')
        if (digits.length >= 10) {
          const ddd = digits.substring(0, 2)
          const last4 = digits.substring(digits.length - 4)
          return `(${ddd}) 9****-${last4}`
        }
        return '(XX) 9****-****'

      case SensitiveDataType.CPF:
        // ex: 123.***.***-45
        if (this.config.preserveFormat) {
          const digits = value.replace(/\D/g, '')
          if (digits.length === 11) {
            return `${digits.substring(0, 3)}.***.***-${digits.substring(9)}`
          }
        }
        return '***.***.***-**'

      case SensitiveDataType.CNPJ:
        // ex: 12.***.***/****-34
        if (this.config.preserveFormat) {
          const digits = value.replace(/\D/g, '')
          if (digits.length === 14) {
            return `${digits.substring(0, 2)}.***.***/****-${digits.substring(12)}`
          }
        }
        return '**.***.***/****.***'

      case SensitiveDataType.CREDIT_CARD:
        // ex: **** **** **** 1234
        const cardDigits = value.replace(/\D/g, '')
        if (cardDigits.length >= 4) {
          const last4 = cardDigits.substring(cardDigits.length - 4)
          return `**** **** **** ${last4}`
        }
        return '**** **** **** ****'

      case SensitiveDataType.NAME:
        // ex: João S***
        const nameParts = value.trim().split(' ')
        if (nameParts.length > 1) {
          return `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}***`
        }
        return `${value.substring(0, Math.min(3, value.length))}***`

      case SensitiveDataType.ADDRESS:
        // ex: Rua ***, 123
        const addressParts = value.split(',')
        if (addressParts.length > 1) {
          const number = addressParts[addressParts.length - 1].trim()
          return `*** ***, ${number}`
        }
        return '*** ***'

      case SensitiveDataType.IP_ADDRESS:
        // ex: 192.168.***.***
        const ipParts = value.split('.')
        if (ipParts.length === 4) {
          return `${ipParts[0]}.${ipParts[1]}.***.***`
        }
        return '***.***.***.***'

      case SensitiveDataType.PASSWORD:
      case SensitiveDataType.API_KEY:
      case SensitiveDataType.TOKEN:
        // Nunca mostrar senhas/chaves, mesmo parcialmente
        return '***REDACTED***'

      default:
        return '***'
    }
  }

  /**
   * Anonimização completa
   */
  private fullAnonymize(value: string, type: SensitiveDataType): string {
    switch (type) {
      case SensitiveDataType.EMAIL:
        return '***@***.***'
      case SensitiveDataType.PHONE:
        return '(**) *****-****'
      case SensitiveDataType.CPF:
        return '***.***.***-**'
      case SensitiveDataType.CNPJ:
        return '**.***.***/****-**'
      case SensitiveDataType.CREDIT_CARD:
        return '**** **** **** ****'
      case SensitiveDataType.NAME:
        return '*** ***'
      case SensitiveDataType.ADDRESS:
        return '*** ***, ***'
      case SensitiveDataType.IP_ADDRESS:
        return '***.***.***.***'
      case SensitiveDataType.PASSWORD:
      case SensitiveDataType.API_KEY:
      case SensitiveDataType.TOKEN:
        return '***REDACTED***'
      default:
        return '***'
    }
  }

  /**
   * Hash irreversível de valor
   */
  private hashValue(value: string): string {
    return crypto
      .createHash('sha256')
      .update(value + this.config.hashSalt)
      .digest('hex')
      .substring(0, 16) // Primeiros 16 caracteres para compactar
  }

  /**
   * Anonimiza execução de workflow
   */
  public anonymizeExecution(execution: unknown): unknown {
    const result = this.anonymizeObject(execution)
    return result.anonymized
  }

  /**
   * Anonimiza log
   */
  public anonymizeLog(log: unknown): unknown {
    const result = this.anonymizeObject(log)
    return result.anonymized
  }

  /**
   * Verifica se um valor contém dados sensíveis
   */
  public containsSensitiveData(value: unknown): boolean {
    if (typeof value === 'string') {
      // Verificar patterns conhecidos
      const sensitivePatterns = [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
        /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/, // CPF
        /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/, // CNPJ
        /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Cartão
      ]

      return sensitivePatterns.some(pattern => pattern.test(value))
    }

    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => this.containsSensitiveData(v))
    }

    return false
  }

  /**
   * Estatísticas de anonimização
   */
  public getAnonymizationStats(): {
    level: AnonymizationLevel
    fieldsConfigured: number
    preserveFormat: boolean
  } {
    return {
      level: this.config.level,
      fieldsConfigured: this.config.fieldsToAnonymize.length,
      preserveFormat: this.config.preserveFormat,
    }
  }
}

// Export singleton
export const dataAnonymizer = DataAnonymizer.getInstance()
