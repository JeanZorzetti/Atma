# Sistema de Automações - Fase 3.1: Testes e Ambientes

## 📋 Resumo

Implementação da **Fase 3.1** do roadmap de automações: Testes Automatizados e Gerenciamento de Ambientes.

Esta fase adiciona:
- ✅ Sistema de ambientes (dev/staging/prod)
- ✅ Testes automatizados de workflows
- ✅ 3 tipos de testes (unit, integration, e2e)
- ✅ Sistema de assertions com 7 tipos
- ✅ Interface visual completa para testes
- ✅ Execução de testes em diferentes ambientes
- ✅ Histórico e relatórios de testes

## 🏗️ Arquitetura

### Parte 1: Sistema de Ambientes

#### EnvironmentManager ([admin/src/lib/workflow-environment.ts](admin/src/lib/workflow-environment.ts))

Gerenciador singleton de ambientes:

```typescript
export type EnvironmentType = 'development' | 'staging' | 'production'

class EnvironmentManager {
  // Gerenciamento de ambiente
  getCurrentEnvironment(): Environment
  getAllEnvironments(): Environment[]
  switchEnvironment(envType: EnvironmentType): void

  // Configuração
  getApiUrl(): string
  getApiKey(): string | undefined
  isProduction(): boolean

  // Validação e testes
  validateEnvironment(envType: EnvironmentType): { valid: boolean; errors: string[] }
  async testConnection(envType: EnvironmentType): Promise<{ success: boolean; message: string; latency?: number }>
}
```

**Ambientes pré-configurados:**
- **Development** (🔧 Azul): http://localhost:5678/api/v1
- **Staging** (🧪 Amarelo): https://n8n-staging.roilabs.com.br/api/v1
- **Production** (🚀 Vermelho): https://ia-n8n.tjmarr.easypanel.host/api/v1

### Parte 2: Sistema de Testes

#### WorkflowTestRunner ([admin/src/lib/workflow-test.ts](admin/src/lib/workflow-test.ts))

Executor de testes singleton:

```typescript
class WorkflowTestRunner {
  // Execução de testes
  async runScenario(scenario: TestScenario, n8nApiUrl, n8nApiKey): Promise<TestResult>
  async runSuite(suite: TestSuite, environment, n8nApiUrl, n8nApiKey): Promise<TestRun>

  // Gerenciamento
  getTestRun(runId: string): TestRun | undefined
  getActiveTestRuns(): TestRun[]
}
```

#### Tipos de Teste

**1. Unit Tests (🧪)**
- Testam componentes isolados
- Focam em nós individuais
- Rápidos e frequentes
- Exemplo: Testar validação de email

**2. Integration Tests (🔗)**
- Testam integração entre componentes
- Validam comunicação entre nós
- Médio tempo de execução
- Exemplo: Testar fluxo de webhook → processamento → resposta

**3. End-to-End Tests (🌐)**
- Testam fluxo completo
- Incluem serviços externos
- Mais lentos e abrangentes
- Exemplo: Testar todo o processo de lead → CRM → notificação

## 📊 Sistema de Assertions

### 7 Tipos de Assertions

```typescript
interface TestAssertion {
  id: string
  type: 'equals' | 'contains' | 'matches' | 'exists' | 'notExists' | 'greaterThan' | 'lessThan'
  path: string // JSONPath para valor
  expectedValue?: unknown
  message?: string
}
```

**1. equals**: Verifica igualdade exata
```json
{
  "type": "equals",
  "path": "data.status",
  "expectedValue": "success"
}
```

**2. contains**: Verifica se contém substring
```json
{
  "type": "contains",
  "path": "data.message",
  "expectedValue": "processado"
}
```

**3. matches**: Verifica regex
```json
{
  "type": "matches",
  "path": "data.email",
  "expectedValue": "^[a-z]+@example\\.com$"
}
```

**4. exists**: Verifica se valor existe
```json
{
  "type": "exists",
  "path": "data.userId"
}
```

**5. notExists**: Verifica se valor não existe
```json
{
  "type": "notExists",
  "path": "data.error"
}
```

**6. greaterThan**: Verifica maior que
```json
{
  "type": "greaterThan",
  "path": "data.count",
  "expectedValue": 0
}
```

**7. lessThan**: Verifica menor que
```json
{
  "type": "lessThan",
  "path": "data.duration",
  "expectedValue": 5000
}
```

## 🔌 API Endpoints

### GET /api/n8n/test

#### 1. Listar Cenários
```bash
GET /api/n8n/test?action=scenarios&workflowId=abc123
```

**Resposta:**
```json
{
  "scenarios": [
    {
      "id": "scenario-1",
      "name": "Validar entrada de dados",
      "type": "unit",
      "enabled": true,
      "inputData": {...},
      "timeout": 30000
    }
  ]
}
```

#### 2. Listar Suites
```bash
GET /api/n8n/test?action=suites&workflowId=abc123
```

#### 3. Obter Resultados
```bash
GET /api/n8n/test?action=results&scenarioId=scenario-1&limit=20
```

**Resposta:**
```json
{
  "results": [
    {
      "id": "result-1",
      "status": "passed",
      "duration": 1234,
      "assertions": [
        {
          "passed": true,
          "message": "Status equals 'success'"
        }
      ],
      "coverage": {
        "percentage": 85.5,
        "executedNodes": 6,
        "totalNodes": 7
      }
    }
  ]
}
```

#### 4. Listar Runs
```bash
GET /api/n8n/test?action=runs&workflowId=abc123&limit=20
```

#### 5. Runs Ativos
```bash
GET /api/n8n/test?action=active
```

### POST /api/n8n/test

#### 1. Criar Cenário
```json
{
  "action": "create-scenario",
  "workflowId": "abc123",
  "name": "Validar processamento de leads",
  "type": "integration",
  "inputData": {
    "email": "test@example.com",
    "name": "Test User"
  },
  "expectedOutput": {
    "success": true
  },
  "timeout": 30000,
  "assertions": [
    {
      "id": "assert-1",
      "type": "equals",
      "path": "data.success",
      "expectedValue": true
    }
  ]
}
```

#### 2. Executar Cenário
```json
{
  "action": "run-scenario",
  "scenarioId": "scenario-1",
  "environment": "development"
}
```

**Resposta:**
```json
{
  "result": {
    "id": "result-1",
    "status": "passed",
    "startTime": "2025-12-11T16:00:00Z",
    "endTime": "2025-12-11T16:00:01Z",
    "duration": 1234,
    "executionLog": [
      {
        "timestamp": "2025-12-11T16:00:00Z",
        "level": "info",
        "message": "Starting test scenario"
      }
    ],
    "assertions": [
      {
        "assertionId": "assert-1",
        "passed": true,
        "message": "Value equals expected"
      }
    ],
    "coverage": {
      "totalNodes": 7,
      "executedNodes": 6,
      "percentage": 85.71
    }
  }
}
```

#### 3. Criar Suite
```json
{
  "action": "create-suite",
  "workflowId": "abc123",
  "name": "Suite de Regressão",
  "description": "Testes completos de regressão",
  "scenarioIds": ["scenario-1", "scenario-2", "scenario-3"]
}
```

#### 4. Executar Suite
```json
{
  "action": "run-suite",
  "suiteId": "suite-1",
  "environment": "staging"
}
```

**Resposta:**
```json
{
  "run": {
    "id": "run-1",
    "status": "completed",
    "totalScenarios": 3,
    "passed": 2,
    "failed": 1,
    "skipped": 0,
    "startTime": "2025-12-11T16:00:00Z",
    "endTime": "2025-12-11T16:00:05Z"
  }
}
```

### PATCH /api/n8n/test

```json
{
  "type": "scenario",
  "id": "scenario-1",
  "name": "Novo nome",
  "enabled": false
}
```

### DELETE /api/n8n/test

```bash
DELETE /api/n8n/test?type=scenario&id=scenario-1
```

## 🎨 Interface - WorkflowTestPanel

### Modal Interativo

O componente `WorkflowTestPanel` fornece interface completa para testes:

#### Aba 1: Cenários

- **Lista de cenários** com cards informativos
- **Ícones por tipo** (🧪 Unit, 🔗 Integration, 🌐 E2E)
- **Status do último teste** (passou/falhou)
- **Métricas** (duração, cobertura)
- **Ações**:
  - Executar teste individual
  - Executar todos os testes
  - Editar cenário
  - Deletar cenário
  - Criar novo cenário

#### Aba 2: Resultados

- **Histórico de execuções**
- **Status visual** com ícones
- **Métricas detalhadas**:
  - Duração da execução
  - Percentual de cobertura
  - Data e hora
- **Assertions**:
  - Lista de todas as verificações
  - Status individual (passou/falhou)
  - Mensagens descritivas

#### Aba 3: Cobertura

- **Análise de cobertura** de nós
- **Visualização de nós executados vs total**
- **Percentual de cobertura**
- **Lista detalhada de nós**

### Como Usar

#### 1. Criar Cenário de Teste

1. Clique no ícone Activity (⚡) ao lado de um workflow
2. Clique em "Novo Cenário"
3. Preencha:
   - Nome do teste
   - Descrição (opcional)
   - Tipo (Unit/Integration/E2E)
   - Dados de entrada (JSON)
   - Saída esperada (JSON, opcional)
   - Timeout (ms)
4. Clique em "Criar Cenário"

#### 2. Executar Teste

**Individual:**
1. Clique em "Executar" no card do cenário
2. Aguarde execução
3. Veja resultado instantâneo

**Todos:**
1. Clique em "Executar Todos"
2. Cenários são executados sequencialmente
3. Veja progresso em tempo real

#### 3. Visualizar Resultados

1. Vá para aba "Resultados"
2. Veja histórico de execuções
3. Expanda para ver:
   - Logs de execução
   - Assertions individuais
   - Erros (se houver)
   - Cobertura de nós

## 🔄 Fluxo de Trabalho

### Desenvolvimento com Testes (TDD)

```bash
# 1. Criar cenário de teste
POST /api/n8n/test { action: "create-scenario", ... }

# 2. Executar teste (deve falhar inicialmente)
POST /api/n8n/test { action: "run-scenario", scenarioId: "...", environment: "development" }

# 3. Desenvolver workflow no n8n

# 4. Executar teste novamente
POST /api/n8n/test { action: "run-scenario", ... }

# 5. Refinar até passar

# 6. Promover para staging
# Trocar ambiente para staging e executar novamente

# 7. Criar suite de regressão
POST /api/n8n/test { action: "create-suite", scenarioIds: [...] }

# 8. Executar suite antes de deploy
POST /api/n8n/test { action: "run-suite", suiteId: "...", environment: "staging" }
```

### CI/CD com Testes

```javascript
// Script de CI/CD
async function runTestsBeforeDeploy(workflowId) {
  // 1. Obter todas as suites do workflow
  const { suites } = await fetch(
    `/api/n8n/test?action=suites&workflowId=${workflowId}`
  ).then(r => r.json())

  // 2. Executar cada suite em staging
  for (const suite of suites) {
    const { run } = await fetch('/api/n8n/test', {
      method: 'POST',
      body: JSON.stringify({
        action: 'run-suite',
        suiteId: suite.id,
        environment: 'staging'
      })
    }).then(r => r.json())

    // 3. Verificar se todos passaram
    if (run.failed > 0) {
      throw new Error(`Tests failed: ${run.failed}/${run.totalScenarios}`)
    }
  }

  // 4. Se todos passaram, fazer deploy para produção
  console.log('✅ All tests passed! Ready for production.')
}
```

## 📊 Integração com Banco de Dados

### Modelos Prisma

**WorkflowTestScenario**
- Armazena cenários de teste
- Relacionamento com suite (opcional)
- Relacionamento com resultados

**WorkflowTestSuite**
- Agrupa múltiplos cenários
- Facilita execução em batch
- Relacionamento com runs

**WorkflowTestResult**
- Resultado de cada execução
- Logs, erros, assertions
- Cobertura de nós
- Relacionamento com scenario e run

**WorkflowTestRun**
- Execução de suite completa
- Estatísticas agregadas
- Relacionamento com results

### Queries Úteis

```typescript
// Buscar cenários de um workflow
const scenarios = await prisma.workflowTestScenario.findMany({
  where: { workflowId: 'abc123' },
  include: { results: { take: 5, orderBy: { startTime: 'desc' } } }
})

// Buscar últimos resultados
const results = await prisma.workflowTestResult.findMany({
  where: { scenarioId: 'scenario-1' },
  orderBy: { startTime: 'desc' },
  take: 10
})

// Estatísticas de uma suite
const suite = await prisma.workflowTestSuite.findUnique({
  where: { id: 'suite-1' },
  include: {
    scenarios: true,
    runs: {
      orderBy: { startTime: 'desc' },
      take: 5
    }
  }
})
```

## 🎯 Casos de Uso

### 1. Teste de Validação de Entrada

```json
{
  "name": "Validar email obrigatório",
  "type": "unit",
  "inputData": {
    "nome": "João Silva"
    // email ausente propositalmente
  },
  "assertions": [
    {
      "type": "exists",
      "path": "error.message",
      "message": "Deve retornar erro quando email ausente"
    },
    {
      "type": "contains",
      "path": "error.message",
      "expectedValue": "email",
      "message": "Mensagem deve mencionar email"
    }
  ]
}
```

### 2. Teste de Integração com API Externa

```json
{
  "name": "Integração com CRM",
  "type": "integration",
  "inputData": {
    "email": "test@example.com",
    "nome": "Test User"
  },
  "timeout": 10000,
  "assertions": [
    {
      "type": "equals",
      "path": "crm.status",
      "expectedValue": "created"
    },
    {
      "type": "exists",
      "path": "crm.id"
    },
    {
      "type": "matches",
      "path": "crm.id",
      "expectedValue": "^[0-9]+$"
    }
  ]
}
```

### 3. Teste E2E de Workflow Completo

```json
{
  "name": "Fluxo completo de lead",
  "type": "e2e",
  "inputData": {
    "email": "lead@example.com",
    "nome": "Lead Test",
    "telefone": "+5511999999999"
  },
  "timeout": 30000,
  "assertions": [
    {
      "type": "equals",
      "path": "lead.status",
      "expectedValue": "processed"
    },
    {
      "type": "exists",
      "path": "crm.contactId"
    },
    {
      "type": "equals",
      "path": "notification.sent",
      "expectedValue": true
    },
    {
      "type": "greaterThan",
      "path": "score",
      "expectedValue": 50
    }
  ]
}
```

## 🔐 Segurança e Boas Práticas

### Proteções Implementadas

1. **Isolamento de Ambientes**: Testes nunca afetam produção diretamente
2. **Confirmação de Ambiente**: Alertas ao trocar para produção
3. **Validação de Dados**: JSON schemas validados antes de execução
4. **Timeouts**: Prevenção de testes infinitos
5. **Rate Limiting**: Proteção contra execuções excessivas

### Recomendações

1. **Testes em Desenvolvimento**: Use ambiente dev para iteração rápida
2. **Testes em Staging**: Execute suite completa antes de produção
3. **Dados de Teste**: Use dados sintéticos, nunca dados reais
4. **Assertions Específicas**: Faça assertions detalhadas, não genéricas
5. **Cobertura Alta**: Mire em >80% de cobertura de nós críticos
6. **Testes Rápidos**: Mantenha unit tests <1s, integration <5s
7. **Cleanup**: Limpe dados de teste após execução
8. **Documentação**: Documente propósito de cada cenário

## 📈 Benefícios

### 1. **Qualidade Garantida**
- Catch bugs antes de produção
- Regressões detectadas automaticamente
- Confiança em mudanças

### 2. **Desenvolvimento Mais Rápido**
- Feedback imediato
- Menos debugging manual
- Refatoração segura

### 3. **Documentação Viva**
- Testes servem como documentação
- Comportamento esperado explícito
- Exemplos de uso claros

### 4. **Confiança em Deploy**
- Suite passa = deploy seguro
- Histórico de estabilidade
- Rollback rápido se necessário

### 5. **Manutenibilidade**
- Mudanças validadas automaticamente
- Integração com CI/CD
- Menos tempo em QA manual

## 🔮 Próximos Passos (Fase 3.2)

A próxima fase incluirá:

### Modo Debug Avançado
- Breakpoints em nós
- Inspeção de dados em tempo real
- Step-by-step execution
- Variáveis watched

### Validação de Workflows
- Schema validation
- Best practices checker
- Performance analysis
- Security scanning

### Relatórios Avançados
- Dashboard de qualidade
- Trends de cobertura
- Performance metrics
- Alertas de degradação

## 📚 Referências

- [Roadmap Completo](../roadmaps/roadmap_automacoes_melhores_praticas.md)
- [README Fase 2.2 - Git](./README_AUTOMACOES_FASE_2_2.md)
- [README Fase 2.1 - Documentação](./README_AUTOMACOES_FASE_2.md)
- [README Fase 1 - Monitoramento](./README_AUTOMACOES.md)
- [n8n Testing Best Practices](https://docs.n8n.io/workflows/testing/)
- [JSONPath Syntax](https://goessner.net/articles/JsonPath/)
