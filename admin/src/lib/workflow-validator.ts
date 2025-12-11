/**
 * Sistema de Validação de Workflows
 * Fase 3.3
 */

export type ValidationSeverity = 'error' | 'warning' | 'info'
export type ValidationCategory = 'schema' | 'bestPractices' | 'performance' | 'security' | 'naming' | 'errorHandling'

export interface ValidationIssue {
  id: string
  severity: ValidationSeverity
  category: ValidationCategory
  nodeId?: string
  nodeName?: string
  message: string
  description: string
  fix?: string
  code: string
}

export interface ValidationResult {
  valid: boolean
  score: number // 0-100
  issues: ValidationIssue[]
  summary: {
    errors: number
    warnings: number
    info: number
  }
  categories: Record<ValidationCategory, {
    passed: number
    failed: number
    score: number
  }>
  timestamp: Date
}

export interface WorkflowValidationConfig {
  enableSchemaValidation: boolean
  enableBestPractices: boolean
  enablePerformanceChecks: boolean
  enableSecurityChecks: boolean
  enableNamingConventions: boolean
  enableErrorHandling: boolean
  strictMode: boolean
}

interface WorkflowNode {
  id: string
  name: string
  type: string
  parameters?: Record<string, unknown>
  credentials?: Record<string, unknown>
  position?: [number, number]
  disabled?: boolean
  executeOnce?: boolean
  retryOnFail?: boolean
  maxTries?: number
  waitBetweenTries?: number
  alwaysOutputData?: boolean
  continueOnFail?: boolean
}

interface WorkflowData {
  id?: string
  name: string
  active?: boolean
  nodes: WorkflowNode[]
  connections?: Record<string, unknown>
  settings?: Record<string, unknown>
  tags?: string[]
}

class WorkflowValidator {
  private static instance: WorkflowValidator
  private config: WorkflowValidationConfig = {
    enableSchemaValidation: true,
    enableBestPractices: true,
    enablePerformanceChecks: true,
    enableSecurityChecks: true,
    enableNamingConventions: true,
    enableErrorHandling: true,
    strictMode: false,
  }

  private constructor() {}

  static getInstance(): WorkflowValidator {
    if (!WorkflowValidator.instance) {
      WorkflowValidator.instance = new WorkflowValidator()
    }
    return WorkflowValidator.instance
  }

  updateConfig(config: Partial<WorkflowValidationConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): WorkflowValidationConfig {
    return { ...this.config }
  }

  async validateWorkflow(workflowData: WorkflowData): Promise<ValidationResult> {
    const issues: ValidationIssue[] = []

    // 1. Schema Validation
    if (this.config.enableSchemaValidation) {
      issues.push(...this.validateSchema(workflowData))
    }

    // 2. Best Practices
    if (this.config.enableBestPractices) {
      issues.push(...this.validateBestPractices(workflowData))
    }

    // 3. Performance Checks
    if (this.config.enablePerformanceChecks) {
      issues.push(...this.validatePerformance(workflowData))
    }

    // 4. Security Checks
    if (this.config.enableSecurityChecks) {
      issues.push(...this.validateSecurity(workflowData))
    }

    // 5. Naming Conventions
    if (this.config.enableNamingConventions) {
      issues.push(...this.validateNaming(workflowData))
    }

    // 6. Error Handling
    if (this.config.enableErrorHandling) {
      issues.push(...this.validateErrorHandling(workflowData))
    }

    return this.buildValidationResult(issues)
  }

  private validateSchema(workflow: WorkflowData): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    // Workflow must have a name
    if (!workflow.name || workflow.name.trim() === '') {
      issues.push({
        id: `schema-${Date.now()}-1`,
        severity: 'error',
        category: 'schema',
        message: 'Workflow sem nome',
        description: 'Todo workflow deve ter um nome descritivo',
        fix: 'Adicione um nome ao workflow',
        code: 'SCHEMA_NO_NAME',
      })
    }

    // Must have at least one node
    if (!workflow.nodes || workflow.nodes.length === 0) {
      issues.push({
        id: `schema-${Date.now()}-2`,
        severity: 'error',
        category: 'schema',
        message: 'Workflow vazio',
        description: 'O workflow não possui nenhum nó',
        fix: 'Adicione pelo menos um nó ao workflow',
        code: 'SCHEMA_EMPTY_WORKFLOW',
      })
    }

    // Validate each node
    if (workflow.nodes) {
      workflow.nodes.forEach((node, index) => {
        // Node must have an ID
        if (!node.id) {
          issues.push({
            id: `schema-${Date.now()}-node-${index}`,
            severity: 'error',
            category: 'schema',
            nodeId: node.id,
            nodeName: node.name,
            message: `Nó sem ID`,
            description: 'Todo nó deve ter um ID único',
            fix: 'Configure o ID do nó',
            code: 'SCHEMA_NO_NODE_ID',
          })
        }

        // Node must have a type
        if (!node.type) {
          issues.push({
            id: `schema-${Date.now()}-node-${index}-type`,
            severity: 'error',
            category: 'schema',
            nodeId: node.id,
            nodeName: node.name,
            message: `Nó sem tipo`,
            description: 'Todo nó deve ter um tipo definido',
            fix: 'Configure o tipo do nó',
            code: 'SCHEMA_NO_NODE_TYPE',
          })
        }

        // Node must have a name
        if (!node.name || node.name.trim() === '') {
          issues.push({
            id: `schema-${Date.now()}-node-${index}-name`,
            severity: 'error',
            category: 'schema',
            nodeId: node.id,
            nodeName: node.name,
            message: `Nó sem nome`,
            description: 'Todo nó deve ter um nome descritivo',
            fix: 'Adicione um nome ao nó',
            code: 'SCHEMA_NO_NODE_NAME',
          })
        }
      })
    }

    return issues
  }

  private validateBestPractices(workflow: WorkflowData): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    if (!workflow.nodes) return issues

    // Check for trigger nodes
    const triggerNodes = workflow.nodes.filter(node =>
      node.type.toLowerCase().includes('trigger') ||
      node.type === 'n8n-nodes-base.start'
    )

    if (triggerNodes.length === 0) {
      issues.push({
        id: `bp-${Date.now()}-1`,
        severity: 'warning',
        category: 'bestPractices',
        message: 'Sem nó de trigger',
        description: 'Workflows devem ter pelo menos um nó que inicia a execução',
        fix: 'Adicione um trigger (webhook, schedule, manual, etc.)',
        code: 'BP_NO_TRIGGER',
      })
    }

    // Check for multiple manual triggers
    const manualTriggers = workflow.nodes.filter(node =>
      node.type === 'n8n-nodes-base.manualTrigger' ||
      node.type === 'n8n-nodes-base.start'
    )

    if (manualTriggers.length > 1) {
      issues.push({
        id: `bp-${Date.now()}-2`,
        severity: 'warning',
        category: 'bestPractices',
        message: 'Múltiplos triggers manuais',
        description: 'Geralmente um workflow deve ter apenas um ponto de entrada manual',
        fix: 'Considere usar apenas um trigger manual',
        code: 'BP_MULTIPLE_MANUAL_TRIGGERS',
      })
    }

    // Check for disabled nodes
    const disabledNodes = workflow.nodes.filter(node => node.disabled === true)
    if (disabledNodes.length > 0) {
      issues.push({
        id: `bp-${Date.now()}-3`,
        severity: 'info',
        category: 'bestPractices',
        message: `${disabledNodes.length} nó(s) desabilitado(s)`,
        description: 'Nós desabilitados não serão executados',
        fix: 'Remova ou habilite os nós desabilitados antes de publicar',
        code: 'BP_DISABLED_NODES',
      })
    }

    // Check for very long workflows (>20 nodes)
    if (workflow.nodes.length > 20) {
      issues.push({
        id: `bp-${Date.now()}-4`,
        severity: 'warning',
        category: 'bestPractices',
        message: 'Workflow muito longo',
        description: `Workflow com ${workflow.nodes.length} nós pode ser difícil de manter`,
        fix: 'Considere dividir em sub-workflows menores',
        code: 'BP_TOO_MANY_NODES',
      })
    }

    // Check for Set nodes without meaningful operations
    const setNodes = workflow.nodes.filter(node => node.type === 'n8n-nodes-base.set')
    setNodes.forEach(node => {
      if (!node.parameters || Object.keys(node.parameters).length === 0) {
        issues.push({
          id: `bp-${Date.now()}-set-${node.id}`,
          severity: 'warning',
          category: 'bestPractices',
          nodeId: node.id,
          nodeName: node.name,
          message: 'Nó Set vazio',
          description: 'Nó Set sem parâmetros configurados',
          fix: 'Configure os campos ou remova o nó',
          code: 'BP_EMPTY_SET_NODE',
        })
      }
    })

    // Check for tags
    if (!workflow.tags || workflow.tags.length === 0) {
      issues.push({
        id: `bp-${Date.now()}-5`,
        severity: 'info',
        category: 'bestPractices',
        message: 'Workflow sem tags',
        description: 'Tags ajudam a organizar e encontrar workflows',
        fix: 'Adicione tags relevantes ao workflow',
        code: 'BP_NO_TAGS',
      })
    }

    return issues
  }

  private validatePerformance(workflow: WorkflowData): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    if (!workflow.nodes) return issues

    // Check for potential infinite loops
    const loopNodes = workflow.nodes.filter(node =>
      node.type.toLowerCase().includes('loop') ||
      node.type === 'n8n-nodes-base.splitInBatches'
    )

    loopNodes.forEach(node => {
      if (!node.parameters || typeof node.parameters.batchSize === 'undefined') {
        issues.push({
          id: `perf-${Date.now()}-loop-${node.id}`,
          severity: 'warning',
          category: 'performance',
          nodeId: node.id,
          nodeName: node.name,
          message: 'Loop sem limite',
          description: 'Loops sem limites podem causar execuções infinitas',
          fix: 'Configure um limite de iterações ou batch size',
          code: 'PERF_UNBOUNDED_LOOP',
        })
      }
    })

    // Check for HTTP nodes without timeout
    const httpNodes = workflow.nodes.filter(node =>
      node.type === 'n8n-nodes-base.httpRequest' ||
      node.type.toLowerCase().includes('http')
    )

    httpNodes.forEach(node => {
      if (!node.parameters || typeof node.parameters.timeout === 'undefined') {
        issues.push({
          id: `perf-${Date.now()}-http-${node.id}`,
          severity: 'warning',
          category: 'performance',
          nodeId: node.id,
          nodeName: node.name,
          message: 'HTTP request sem timeout',
          description: 'Requisições HTTP devem ter timeout configurado',
          fix: 'Configure um timeout apropriado (ex: 10000ms)',
          code: 'PERF_NO_TIMEOUT',
        })
      }
    })

    // Check for wait nodes with very long delays
    const waitNodes = workflow.nodes.filter(node => node.type === 'n8n-nodes-base.wait')
    waitNodes.forEach(node => {
      if (node.parameters && typeof node.parameters.amount === 'number') {
        const amount = node.parameters.amount
        const unit = node.parameters.unit as string || 'seconds'

        let seconds = amount
        if (unit === 'minutes') seconds *= 60
        if (unit === 'hours') seconds *= 3600
        if (unit === 'days') seconds *= 86400

        if (seconds > 3600) { // More than 1 hour
          issues.push({
            id: `perf-${Date.now()}-wait-${node.id}`,
            severity: 'warning',
            category: 'performance',
            nodeId: node.id,
            nodeName: node.name,
            message: 'Wait muito longo',
            description: `Aguardando ${amount} ${unit} pode bloquear recursos`,
            fix: 'Considere usar um cron trigger ou webhook para delays longos',
            code: 'PERF_LONG_WAIT',
          })
        }
      }
    })

    // Check for multiple sequential API calls (potential for batching)
    const apiNodes = workflow.nodes.filter(node =>
      node.type.includes('httpRequest') ||
      node.type.includes('api') ||
      node.type.includes('webhook')
    )

    if (apiNodes.length > 5) {
      issues.push({
        id: `perf-${Date.now()}-6`,
        severity: 'info',
        category: 'performance',
        message: 'Múltiplas chamadas de API',
        description: `${apiNodes.length} nós de API podem impactar performance`,
        fix: 'Considere fazer batch de requisições ou usar cache',
        code: 'PERF_MANY_API_CALLS',
      })
    }

    return issues
  }

  private validateSecurity(workflow: WorkflowData): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    if (!workflow.nodes) return issues

    // Check for hardcoded credentials
    workflow.nodes.forEach(node => {
      if (node.parameters) {
        const paramsStr = JSON.stringify(node.parameters).toLowerCase()

        // Check for potential hardcoded passwords
        if (paramsStr.includes('password') && paramsStr.includes(':')) {
          const hasCredentialField = node.credentials && Object.keys(node.credentials).length > 0

          if (!hasCredentialField) {
            issues.push({
              id: `sec-${Date.now()}-cred-${node.id}`,
              severity: 'error',
              category: 'security',
              nodeId: node.id,
              nodeName: node.name,
              message: 'Possível credencial hardcoded',
              description: 'Credenciais devem ser armazenadas no sistema de credentials do n8n',
              fix: 'Use o sistema de credentials em vez de hardcoded values',
              code: 'SEC_HARDCODED_CREDENTIALS',
            })
          }
        }

        // Check for API keys in parameters
        if (paramsStr.includes('apikey') || paramsStr.includes('api_key') || paramsStr.includes('token')) {
          issues.push({
            id: `sec-${Date.now()}-api-${node.id}`,
            severity: 'warning',
            category: 'security',
            nodeId: node.id,
            nodeName: node.name,
            message: 'Possível API key nos parâmetros',
            description: 'API keys devem ser armazenadas como credentials',
            fix: 'Mova API keys para o sistema de credentials',
            code: 'SEC_API_KEY_IN_PARAMS',
          })
        }

        // Check for URLs with credentials
        if (paramsStr.includes('://') && paramsStr.includes('@')) {
          issues.push({
            id: `sec-${Date.now()}-url-${node.id}`,
            severity: 'error',
            category: 'security',
            nodeId: node.id,
            nodeName: node.name,
            message: 'Credenciais na URL',
            description: 'URLs não devem conter credenciais (ex: http://user:pass@host)',
            fix: 'Use autenticação adequada em vez de credenciais na URL',
            code: 'SEC_CREDENTIALS_IN_URL',
          })
        }
      }
    })

    // Check for webhooks without authentication
    const webhookNodes = workflow.nodes.filter(node =>
      node.type === 'n8n-nodes-base.webhook'
    )

    webhookNodes.forEach(node => {
      if (node.parameters) {
        const auth = node.parameters.authentication

        if (!auth || auth === 'none') {
          issues.push({
            id: `sec-${Date.now()}-webhook-${node.id}`,
            severity: 'warning',
            category: 'security',
            nodeId: node.id,
            nodeName: node.name,
            message: 'Webhook sem autenticação',
            description: 'Webhooks devem ter autenticação para evitar acesso não autorizado',
            fix: 'Configure autenticação (header auth, basic auth, etc.)',
            code: 'SEC_WEBHOOK_NO_AUTH',
          })
        }
      }
    })

    // Check for nodes that might log sensitive data
    const functionNodes = workflow.nodes.filter(node =>
      node.type === 'n8n-nodes-base.function' ||
      node.type === 'n8n-nodes-base.code'
    )

    functionNodes.forEach(node => {
      if (node.parameters && node.parameters.functionCode) {
        const code = String(node.parameters.functionCode).toLowerCase()

        if (code.includes('console.log') && (
          code.includes('password') ||
          code.includes('token') ||
          code.includes('apikey') ||
          code.includes('secret')
        )) {
          issues.push({
            id: `sec-${Date.now()}-log-${node.id}`,
            severity: 'warning',
            category: 'security',
            nodeId: node.id,
            nodeName: node.name,
            message: 'Possível log de dados sensíveis',
            description: 'Não faça log de senhas, tokens ou dados sensíveis',
            fix: 'Remova logs de dados sensíveis',
            code: 'SEC_LOGGING_SENSITIVE_DATA',
          })
        }
      }
    })

    return issues
  }

  private validateNaming(workflow: WorkflowData): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    if (!workflow.nodes) return issues

    // Check workflow name conventions
    if (workflow.name) {
      // Should not be too short
      if (workflow.name.length < 5) {
        issues.push({
          id: `naming-${Date.now()}-1`,
          severity: 'info',
          category: 'naming',
          message: 'Nome do workflow muito curto',
          description: 'Use nomes descritivos para facilitar identificação',
          fix: 'Use um nome mais descritivo (mínimo 5 caracteres)',
          code: 'NAMING_SHORT_WORKFLOW_NAME',
        })
      }

      // Should use proper case
      if (workflow.name === workflow.name.toUpperCase() && workflow.name.length > 3) {
        issues.push({
          id: `naming-${Date.now()}-2`,
          severity: 'info',
          category: 'naming',
          message: 'Nome em MAIÚSCULAS',
          description: 'Use Title Case ou sentence case para melhor legibilidade',
          fix: 'Renomeie para Title Case ou sentence case',
          code: 'NAMING_ALL_CAPS',
        })
      }
    }

    // Check node naming
    const nodeNames = new Set<string>()
    const defaultNamePattern = /^(.*?)\d*$/

    workflow.nodes.forEach(node => {
      // Check for duplicate names
      if (nodeNames.has(node.name)) {
        issues.push({
          id: `naming-${Date.now()}-dup-${node.id}`,
          severity: 'warning',
          category: 'naming',
          nodeId: node.id,
          nodeName: node.name,
          message: 'Nome de nó duplicado',
          description: `Outro nó já usa o nome "${node.name}"`,
          fix: 'Use nomes únicos e descritivos para cada nó',
          code: 'NAMING_DUPLICATE_NODE_NAME',
        })
      }
      nodeNames.add(node.name)

      // Check for default names (like "HTTP Request", "Set", etc.)
      const isDefaultName = node.name === node.type.split('.').pop() ||
                           defaultNamePattern.test(node.name)

      if (isDefaultName && !this.config.strictMode) {
        issues.push({
          id: `naming-${Date.now()}-default-${node.id}`,
          severity: 'info',
          category: 'naming',
          nodeId: node.id,
          nodeName: node.name,
          message: 'Nome padrão do nó',
          description: `Nó usando nome padrão "${node.name}"`,
          fix: 'Renomeie para algo mais descritivo',
          code: 'NAMING_DEFAULT_NODE_NAME',
        })
      }

      // Check for very short node names
      if (node.name && node.name.length < 3) {
        issues.push({
          id: `naming-${Date.now()}-short-${node.id}`,
          severity: 'info',
          category: 'naming',
          nodeId: node.id,
          nodeName: node.name,
          message: 'Nome de nó muito curto',
          description: 'Use nomes descritivos com pelo menos 3 caracteres',
          fix: 'Renomeie o nó com um nome mais descritivo',
          code: 'NAMING_SHORT_NODE_NAME',
        })
      }
    })

    return issues
  }

  private validateErrorHandling(workflow: WorkflowData): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    if (!workflow.nodes) return issues

    // Check for nodes without error handling
    const criticalNodes = workflow.nodes.filter(node =>
      node.type.includes('httpRequest') ||
      node.type.includes('api') ||
      node.type.includes('database') ||
      node.type.includes('mysql') ||
      node.type.includes('postgres') ||
      node.type.includes('mongodb')
    )

    criticalNodes.forEach(node => {
      const hasErrorHandling = node.continueOnFail === true ||
                              node.retryOnFail === true ||
                              node.alwaysOutputData === true

      if (!hasErrorHandling) {
        issues.push({
          id: `error-${Date.now()}-${node.id}`,
          severity: 'warning',
          category: 'errorHandling',
          nodeId: node.id,
          nodeName: node.name,
          message: 'Sem tratamento de erro',
          description: 'Nós críticos devem ter tratamento de erro configurado',
          fix: 'Configure continueOnFail, retryOnFail ou alwaysOutputData',
          code: 'ERROR_NO_HANDLING',
        })
      }

      // Check for retry configuration
      if (node.retryOnFail === true) {
        if (!node.maxTries || node.maxTries < 1) {
          issues.push({
            id: `error-${Date.now()}-retry-${node.id}`,
            severity: 'warning',
            category: 'errorHandling',
            nodeId: node.id,
            nodeName: node.name,
            message: 'Retry sem maxTries',
            description: 'Retry deve ter um número máximo de tentativas',
            fix: 'Configure maxTries (recomendado: 2-3)',
            code: 'ERROR_NO_MAX_TRIES',
          })
        }

        if (node.maxTries && node.maxTries > 5) {
          issues.push({
            id: `error-${Date.now()}-too-many-${node.id}`,
            severity: 'info',
            category: 'errorHandling',
            nodeId: node.id,
            nodeName: node.name,
            message: 'Muitas tentativas de retry',
            description: `${node.maxTries} tentativas pode atrasar muito a execução`,
            fix: 'Considere reduzir para 2-3 tentativas',
            code: 'ERROR_TOO_MANY_RETRIES',
          })
        }
      }
    })

    // Check for error workflow
    const hasErrorWorkflow = workflow.settings &&
                            typeof workflow.settings.errorWorkflow === 'string'

    if (!hasErrorWorkflow && workflow.nodes.length > 5) {
      issues.push({
        id: `error-${Date.now()}-no-workflow`,
        severity: 'info',
        category: 'errorHandling',
        message: 'Sem workflow de erro',
        description: 'Workflows complexos devem ter um workflow de erro configurado',
        fix: 'Configure um error workflow nas settings',
        code: 'ERROR_NO_ERROR_WORKFLOW',
      })
    }

    return issues
  }

  private buildValidationResult(issues: ValidationIssue[]): ValidationResult {
    const errors = issues.filter(i => i.severity === 'error').length
    const warnings = issues.filter(i => i.severity === 'warning').length
    const info = issues.filter(i => i.severity === 'info').length

    // Calculate score (100 = perfect, 0 = very bad)
    let score = 100
    score -= errors * 15 // Errors heavily impact score
    score -= warnings * 5 // Warnings moderately impact
    score -= info * 2 // Info slightly impacts
    score = Math.max(0, Math.min(100, score))

    // Calculate per-category scores
    const categories: Record<ValidationCategory, { passed: number; failed: number; score: number }> = {
      schema: { passed: 0, failed: 0, score: 100 },
      bestPractices: { passed: 0, failed: 0, score: 100 },
      performance: { passed: 0, failed: 0, score: 100 },
      security: { passed: 0, failed: 0, score: 100 },
      naming: { passed: 0, failed: 0, score: 100 },
      errorHandling: { passed: 0, failed: 0, score: 100 },
    }

    issues.forEach(issue => {
      if (issue.severity === 'error' || issue.severity === 'warning') {
        categories[issue.category].failed++
        categories[issue.category].score -= issue.severity === 'error' ? 20 : 10
      }
    })

    Object.keys(categories).forEach(key => {
      const cat = key as ValidationCategory
      categories[cat].score = Math.max(0, Math.min(100, categories[cat].score))
    })

    return {
      valid: errors === 0,
      score,
      issues,
      summary: { errors, warnings, info },
      categories,
      timestamp: new Date(),
    }
  }

  // Get validation recommendations based on score
  getRecommendations(result: ValidationResult): string[] {
    const recommendations: string[] = []

    if (result.score >= 90) {
      recommendations.push('✅ Excelente! Workflow seguindo as melhores práticas')
    } else if (result.score >= 70) {
      recommendations.push('👍 Bom workflow, mas pode ser melhorado')
    } else if (result.score >= 50) {
      recommendations.push('⚠️ Workflow precisa de melhorias significativas')
    } else {
      recommendations.push('❌ Workflow com problemas críticos - requer atenção imediata')
    }

    // Category-specific recommendations
    if (result.categories.security.score < 70) {
      recommendations.push('🔒 Priorize corrigir problemas de segurança')
    }

    if (result.categories.errorHandling.score < 70) {
      recommendations.push('🛡️ Adicione tratamento de erro adequado')
    }

    if (result.categories.performance.score < 70) {
      recommendations.push('⚡ Otimize para melhor performance')
    }

    if (result.summary.errors > 0) {
      recommendations.push(`🚨 Corrija ${result.summary.errors} erro(s) crítico(s) primeiro`)
    }

    return recommendations
  }
}

export function getWorkflowValidator(): WorkflowValidator {
  return WorkflowValidator.getInstance()
}
