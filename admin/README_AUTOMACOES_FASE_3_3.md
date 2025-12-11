# Sistema de Validação de Workflows - Fase 3.3

## 📋 Visão Geral

Sistema completo de validação de workflows n8n que analisa automaticamente workflows em 6 categorias diferentes, atribui um score de qualidade (0-100), identifica problemas e fornece recomendações de correção.

**Data de Implementação**: 11/12/2025
**Status**: ✅ Completo

## 🎯 Objetivos

1. **Garantir Qualidade**: Validar workflows contra melhores práticas
2. **Prevenir Problemas**: Detectar issues antes de ir para produção
3. **Melhorar Segurança**: Identificar vulnerabilidades de segurança
4. **Otimizar Performance**: Sugerir melhorias de performance
5. **Facilitar Manutenção**: Garantir nomenclatura consistente

## 🏗️ Arquitetura

### Singleton Pattern

```typescript
// admin/src/lib/workflow-validator.ts
class WorkflowValidator {
  private static instance: WorkflowValidator
  private config: WorkflowValidationConfig

  static getInstance(): WorkflowValidator
  async validateWorkflow(workflowData: WorkflowData): Promise<ValidationResult>
  updateConfig(config: Partial<WorkflowValidationConfig>): void
  getRecommendations(result: ValidationResult): string[]
}
```

### Estrutura de Dados

```typescript
interface ValidationResult {
  valid: boolean                    // Sem erros críticos?
  score: number                      // 0-100
  issues: ValidationIssue[]          // Lista de problemas
  summary: {
    errors: number
    warnings: number
    info: number
  }
  categories: Record<ValidationCategory, {
    passed: number
    failed: number
    score: number                    // Score individual
  }>
  timestamp: Date
}

interface ValidationIssue {
  id: string
  severity: 'error' | 'warning' | 'info'
  category: ValidationCategory
  nodeId?: string                    // Nó específico
  nodeName?: string
  message: string                    // Título do problema
  description: string                // Descrição detalhada
  fix?: string                       // Sugestão de correção
  code: string                       // Código único (ex: SEC_HARDCODED_CREDENTIALS)
}
```

## 📊 6 Categorias de Validação

### 1. Schema ✅

Valida a estrutura básica do workflow.

**Verificações:**
- ✅ Workflow tem nome
- ✅ Nome não é vazio
- ✅ Workflow tem pelo menos um nó
- ✅ Cada nó tem ID único
- ✅ Cada nó tem tipo definido
- ✅ Cada nó tem nome

**Códigos de Erro:**
- `SCHEMA_NO_NAME`: Workflow sem nome
- `SCHEMA_EMPTY_WORKFLOW`: Workflow sem nós
- `SCHEMA_NO_NODE_ID`: Nó sem ID
- `SCHEMA_NO_NODE_TYPE`: Nó sem tipo
- `SCHEMA_NO_NODE_NAME`: Nó sem nome

### 2. Best Practices ✅

Recomendações de padrões e organização.

**Verificações:**
- ✅ Workflow tem pelo menos um trigger
- ✅ Não há múltiplos triggers manuais
- ✅ Nós desabilitados são sinalizados
- ✅ Workflow não é muito longo (>20 nós)
- ✅ Set nodes têm configuração
- ✅ Workflow tem tags

**Códigos:**
- `BP_NO_TRIGGER`: Sem nó de trigger
- `BP_MULTIPLE_MANUAL_TRIGGERS`: Múltiplos triggers manuais
- `BP_DISABLED_NODES`: Nós desabilitados presentes
- `BP_TOO_MANY_NODES`: Workflow muito longo
- `BP_EMPTY_SET_NODE`: Set node sem configuração
- `BP_NO_TAGS`: Workflow sem tags

### 3. Performance ✅

Identifica possíveis problemas de performance.

**Verificações:**
- ✅ Loops têm limite configurado
- ✅ HTTP requests têm timeout
- ✅ Waits não são excessivamente longos (>1 hora)
- ✅ Não há excesso de API calls (>5)
- ✅ Split in Batches tem batch size

**Códigos:**
- `PERF_UNBOUNDED_LOOP`: Loop sem limite
- `PERF_NO_TIMEOUT`: HTTP sem timeout
- `PERF_LONG_WAIT`: Wait muito longo
- `PERF_MANY_API_CALLS`: Muitas chamadas de API

### 4. Security 🔒

Detecta vulnerabilidades de segurança.

**Verificações:**
- ✅ Sem credenciais hardcoded
- ✅ Sem API keys nos parâmetros
- ✅ Sem credenciais em URLs
- ✅ Webhooks têm autenticação
- ✅ Sem logs de dados sensíveis

**Códigos:**
- `SEC_HARDCODED_CREDENTIALS`: Credenciais hardcoded
- `SEC_API_KEY_IN_PARAMS`: API key nos parâmetros
- `SEC_CREDENTIALS_IN_URL`: Credenciais na URL
- `SEC_WEBHOOK_NO_AUTH`: Webhook sem autenticação
- `SEC_LOGGING_SENSITIVE_DATA`: Log de dados sensíveis

### 5. Naming ✅

Valida convenções de nomenclatura.

**Verificações:**
- ✅ Nome do workflow não é muito curto (<5 chars)
- ✅ Nome do workflow não está em CAPS
- ✅ Nomes de nós não são duplicados
- ✅ Nomes de nós não são padrão ("HTTP Request", "Set")
- ✅ Nomes de nós não são muito curtos (<3 chars)

**Códigos:**
- `NAMING_SHORT_WORKFLOW_NAME`: Nome muito curto
- `NAMING_ALL_CAPS`: Nome em MAIÚSCULAS
- `NAMING_DUPLICATE_NODE_NAME`: Nome duplicado
- `NAMING_DEFAULT_NODE_NAME`: Nome padrão
- `NAMING_SHORT_NODE_NAME`: Nome de nó muito curto

### 6. Error Handling 🛡️

Verifica tratamento de erros.

**Verificações:**
- ✅ Nós críticos têm error handling (HTTP, DB, API)
- ✅ Retry tem maxTries configurado
- ✅ maxTries não é excessivo (>5)
- ✅ Workflows complexos têm error workflow

**Configurações Verificadas:**
- `continueOnFail`
- `retryOnFail`
- `maxTries`
- `waitBetweenTries`
- `alwaysOutputData`

**Códigos:**
- `ERROR_NO_HANDLING`: Sem tratamento de erro
- `ERROR_NO_MAX_TRIES`: Retry sem maxTries
- `ERROR_TOO_MANY_RETRIES`: Muitas tentativas
- `ERROR_NO_ERROR_WORKFLOW`: Sem workflow de erro

## 📈 Sistema de Scoring

### Cálculo do Score Geral

```typescript
let score = 100

// Penalidades por severidade
score -= errors * 15      // Erros: -15 pontos cada
score -= warnings * 5     // Avisos: -5 pontos cada
score -= info * 2         // Info: -2 pontos cada

score = Math.max(0, Math.min(100, score))
```

### Score por Categoria

Cada categoria começa com 100 pontos:
- **Error**: -20 pontos
- **Warning**: -10 pontos
- **Info**: -5 pontos (implícito)

### Interpretação dos Scores

| Score | Status | Descrição |
|-------|--------|-----------|
| 90-100 | ✅ Excelente | Workflow seguindo melhores práticas |
| 70-89 | 👍 Bom | Bom workflow, pode ser melhorado |
| 50-69 | ⚠️ Regular | Precisa de melhorias significativas |
| 0-49 | ❌ Ruim | Problemas críticos - atenção imediata |

## 🎨 Interface Visual

### WorkflowValidationPanel Component

Modal interativo com 4 abas:

#### 1. Visão Geral
- **Cards de Resumo**: Erros, Avisos, Info
- **Score Geral**: Badge com cor baseada no score
- **Recomendações**: Lista de sugestões automáticas
- **Top 5 Problemas**: Erros mais críticos

#### 2. Problemas
- **Lista Completa**: Todos os problemas encontrados
- **Color Coding**: Vermelho (error), Amarelo (warning), Azul (info)
- **Badge de Categoria**: Schema, Security, Performance, etc.
- **Sugestões de Correção**: Box azul com "💡 Como corrigir"
- **Código do Erro**: Para referência (ex: SEC_HARDCODED_CREDENTIALS)

#### 3. Categorias
- **Grid 2x3**: Cards para cada categoria
- **Score Individual**: 0-100 para cada categoria
- **Barra de Progresso**: Representação visual
- **Contador de Problemas**: Quantos issues por categoria

#### 4. Configuração
- **Checkboxes**: Ativar/desativar cada categoria
- **Modo Estrito**: Validação mais rigorosa
- **Descrições**: Explicação de cada categoria

### Color Scheme

```typescript
// Categorias
schema:        'bg-purple-100 text-purple-800 border-purple-200'
security:      'bg-red-100 text-red-800 border-red-200'
performance:   'bg-yellow-100 text-yellow-800 border-yellow-200'
bestPractices: 'bg-green-100 text-green-800 border-green-200'
naming:        'bg-blue-100 text-blue-800 border-blue-200'
errorHandling: 'bg-orange-100 text-orange-800 border-orange-200'

// Scores
90-100: text-green-600 / bg-green-50
70-89:  text-blue-600 / bg-blue-50
50-69:  text-yellow-600 / bg-yellow-50
0-49:   text-red-600 / bg-red-50
```

## 🔌 API REST

### Endpoint: `/api/n8n/validate`

#### GET ?action=config
Retorna configuração atual do validador.

**Response:**
```json
{
  "config": {
    "enableSchemaValidation": true,
    "enableBestPractices": true,
    "enablePerformanceChecks": true,
    "enableSecurityChecks": true,
    "enableNamingConventions": true,
    "enableErrorHandling": true,
    "strictMode": false
  }
}
```

#### POST ?action=validate
Valida workflow data fornecido.

**Request:**
```json
{
  "workflowData": {
    "id": "workflow-123",
    "name": "Meu Workflow",
    "active": true,
    "nodes": [...],
    "connections": {...},
    "settings": {...}
  }
}
```

**Response:**
```json
{
  "result": {
    "valid": false,
    "score": 75,
    "issues": [
      {
        "id": "sec-1234567890-1",
        "severity": "error",
        "category": "security",
        "nodeId": "node-abc",
        "nodeName": "HTTP Request",
        "message": "Possível credencial hardcoded",
        "description": "Credenciais devem ser armazenadas no sistema de credentials do n8n",
        "fix": "Use o sistema de credentials em vez de hardcoded values",
        "code": "SEC_HARDCODED_CREDENTIALS"
      }
    ],
    "summary": {
      "errors": 2,
      "warnings": 5,
      "info": 3
    },
    "categories": {
      "schema": { "passed": 0, "failed": 0, "score": 100 },
      "security": { "passed": 0, "failed": 2, "score": 60 },
      // ...
    },
    "timestamp": "2025-12-11T12:00:00.000Z"
  },
  "recommendations": [
    "⚠️ Workflow precisa de melhorias significativas",
    "🔒 Priorize corrigir problemas de segurança"
  ]
}
```

#### POST ?action=validate-from-n8n
Busca workflow do n8n e valida automaticamente.

**Request:**
```json
{
  "workflowId": "workflow-123",
  "environment": "development"  // opcional
}
```

**Response:**
```json
{
  "result": {...},
  "recommendations": [...],
  "workflowData": {...}  // Workflow completo do n8n
}
```

#### POST ?action=update-config
Atualiza configuração do validador.

**Request:**
```json
{
  "config": {
    "enableSecurityChecks": true,
    "strictMode": true
  }
}
```

**Response:**
```json
{
  "config": {
    // Configuração completa atualizada
  }
}
```

## 💻 Uso no Código

### Validar Workflow Manualmente

```typescript
import { getWorkflowValidator } from '@/lib/workflow-validator'

const validator = getWorkflowValidator()

// Validar workflow
const result = await validator.validateWorkflow(workflowData)

console.log('Score:', result.score)
console.log('Valid:', result.valid)
console.log('Errors:', result.summary.errors)

// Obter recomendações
const recommendations = validator.getRecommendations(result)
recommendations.forEach(rec => console.log(rec))

// Filtrar apenas erros críticos
const criticalIssues = result.issues.filter(i => i.severity === 'error')

// Filtrar por categoria
const securityIssues = result.issues.filter(i => i.category === 'security')
```

### Configurar Validador

```typescript
const validator = getWorkflowValidator()

// Desabilitar validação de nomenclatura
validator.updateConfig({
  enableNamingConventions: false
})

// Ativar modo estrito
validator.updateConfig({
  strictMode: true
})

// Ver configuração atual
const config = validator.getConfig()
console.log(config)
```

### Integração com n8n API

```typescript
// Buscar workflow do n8n
const response = await fetch('/api/n8n/validate?action=validate-from-n8n', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'workflow-123',
    environment: 'development'
  })
})

const { result, recommendations } = await response.json()

// Resultado já inclui dados do workflow validado
```

## 📝 Exemplos de Validação

### Exemplo 1: Workflow Perfeito (Score 100)

```typescript
{
  name: "Notificações de Slack",
  nodes: [
    {
      id: "trigger-1",
      name: "Webhook Trigger",
      type: "n8n-nodes-base.webhook",
      parameters: { authentication: "headerAuth" },
      credentials: { headerAuth: "slack-webhook" }
    },
    {
      id: "slack-1",
      name: "Enviar Mensagem Slack",
      type: "n8n-nodes-base.slack",
      credentials: { slackApi: "slack-creds" },
      retryOnFail: true,
      maxTries: 3,
      waitBetweenTries: 1000
    }
  ],
  tags: ["notificação", "slack", "produção"]
}

// Resultado: Score 100 ✅
```

### Exemplo 2: Workflow com Problemas de Segurança (Score 45)

```typescript
{
  name: "API Call",
  nodes: [
    {
      id: "http-1",
      name: "HTTP Request",
      type: "n8n-nodes-base.httpRequest",
      parameters: {
        url: "https://user:password@api.example.com",  // ❌ Credenciais na URL
        authentication: "none",  // ❌ Sem autenticação
        timeout: null  // ❌ Sem timeout
      }
    }
  ]
}

// Issues Detectados:
// 1. SEC_CREDENTIALS_IN_URL (error)
// 2. PERF_NO_TIMEOUT (warning)
// 3. ERROR_NO_HANDLING (warning)
// 4. BP_NO_TRIGGER (warning)
// 5. BP_NO_TAGS (info)
// Score: 45 ❌
```

### Exemplo 3: Workflow com Boas Práticas (Score 85)

```typescript
{
  name: "Processar Pedidos",
  nodes: [
    {
      id: "webhook-1",
      name: "Receber Pedido",
      type: "n8n-nodes-base.webhook",
      parameters: { authentication: "headerAuth" },
      credentials: { headerAuth: "api-auth" }
    },
    {
      id: "function-1",
      name: "Validar Pedido",
      type: "n8n-nodes-base.function",
      continueOnFail: true
    },
    {
      id: "http-1",
      name: "Salvar no ERP",
      type: "n8n-nodes-base.httpRequest",
      credentials: { httpBasicAuth: "erp-creds" },
      retryOnFail: true,
      maxTries: 2,
      parameters: { timeout: 10000 }
    },
    {
      id: "Set",  // ⚠️ Nome padrão
      name: "Set",
      type: "n8n-nodes-base.set"
    }
  ],
  tags: ["pedidos", "erp"]
}

// Issues Detectados:
// 1. NAMING_DEFAULT_NODE_NAME (info) - Nó "Set"
// Score: 85 👍
```

## 🚀 Integração na UI

### Botão de Validação

```tsx
// admin/src/app/admin/automacoes/page.tsx

<Button
  variant="outline"
  size="sm"
  onClick={() => {
    setSelectedWorkflow({ id: workflow.id, name: workflow.name })
    setValidationPanelOpen(true)
  }}
  title="Validar Workflow"
>
  <FileCheck className="h-4 w-4" />
</Button>
```

### Modal de Validação

```tsx
<WorkflowValidationPanel
  open={validationPanelOpen}
  onOpenChange={setValidationPanelOpen}
  workflowId={selectedWorkflow.id}
  workflowName={selectedWorkflow.name}
/>
```

## 🔍 Detalhes de Implementação

### Validação de Schemas

Usa pattern matching para detectar problemas:

```typescript
// Detecção de credenciais em parâmetros
const paramsStr = JSON.stringify(node.parameters).toLowerCase()
if (paramsStr.includes('password') && paramsStr.includes(':')) {
  // Verificar se usa sistema de credentials
  const hasCredentialField = node.credentials && Object.keys(node.credentials).length > 0
  if (!hasCredentialField) {
    issues.push({...})  // SEC_HARDCODED_CREDENTIALS
  }
}
```

### Validação de Performance

Analisa configurações específicas:

```typescript
// Verificação de loops
const loopNodes = workflow.nodes.filter(node =>
  node.type.toLowerCase().includes('loop') ||
  node.type === 'n8n-nodes-base.splitInBatches'
)

loopNodes.forEach(node => {
  if (!node.parameters || typeof node.parameters.batchSize === 'undefined') {
    issues.push({...})  // PERF_UNBOUNDED_LOOP
  }
})
```

### Recomendações Inteligentes

```typescript
getRecommendations(result: ValidationResult): string[] {
  const recommendations: string[] = []

  // Score geral
  if (result.score >= 90) {
    recommendations.push('✅ Excelente! Workflow seguindo as melhores práticas')
  }

  // Priorizar segurança
  if (result.categories.security.score < 70) {
    recommendations.push('🔒 Priorize corrigir problemas de segurança')
  }

  // Priorizar erros
  if (result.summary.errors > 0) {
    recommendations.push(`🚨 Corrija ${result.summary.errors} erro(s) crítico(s) primeiro`)
  }

  return recommendations
}
```

## 📊 Métricas e KPIs

### Métricas de Qualidade

- **Score Médio**: Média dos scores de todos os workflows
- **Taxa de Aprovação**: % de workflows com score >= 70
- **Erros Críticos**: Total de erros de segurança
- **Workflows Validados**: Total de validações executadas

### Categorias Mais Problemáticas

Rastrear quais categorias têm mais issues:
- Security: X erros
- Performance: Y avisos
- Naming: Z sugestões

## 🎓 Boas Práticas

### Para Desenvolvedores

1. **Valide Antes de Deploy**: Execute validação antes de ativar workflow
2. **Score Mínimo**: Mantenha score >= 70 em produção
3. **Zero Erros de Segurança**: Nunca ignore erros críticos de segurança
4. **Use Modo Estrito**: Em ambientes de produção

### Para QA

1. **Validação Obrigatória**: Incluir na checklist de testes
2. **Documente Issues**: Criar tickets para problemas recorrentes
3. **Monitore Tendências**: Acompanhar evolução dos scores

### Para DevOps

1. **CI/CD Integration**: Bloquear deploy se score < 70
2. **Alertas Automáticos**: Notificar quando score cai
3. **Relatórios Periódicos**: Dashboard de qualidade de workflows

## 📈 Roadmap Futuro

### Melhorias Planejadas

- [ ] Histórico de validações
- [ ] Comparação de versões
- [ ] Validação automática no save
- [ ] CI/CD integration
- [ ] Custom rules (regras customizadas)
- [ ] Export de relatórios (PDF, CSV)
- [ ] Métricas agregadas
- [ ] Dashboard de qualidade
- [ ] Auto-fix para alguns problemas
- [ ] Validação em tempo real no editor

## 📚 Referências

- [n8n Best Practices](https://docs.n8n.io/workflows/best-practices/)
- [n8n Error Handling](https://docs.n8n.io/workflows/error-handling/)
- [n8n Security](https://docs.n8n.io/hosting/security/)

---

**Documentação criada em**: 11/12/2025
**Última atualização**: 11/12/2025
**Versão**: 1.0.0
