# Sistema de Automações - Fase 2.1: Documentação Implementada

## 📋 Resumo

Implementação da **Fase 2.1** do roadmap de automações: Sistema de Documentação Integrada.

Esta fase adiciona:
- ✅ Sistema completo de metadados para workflows
- ✅ Documentação estruturada e editável
- ✅ Versionamento de workflows com snapshots
- ✅ Biblioteca de templates reutilizáveis
- ✅ Interface visual para gerenciamento

## 🗃️ Estrutura de Banco de Dados Adicionada

### Novas Tabelas (Prisma Schema)

#### 1. **workflow_metadata** - Metadados dos Workflows
Armazena informações estruturadas sobre cada workflow:

```prisma
model WorkflowMetadata {
  id                String   @id @default(uuid())
  workflowId        String   @unique
  workflowName      String

  // Informações básicas
  description       String?  @db.Text
  purpose           String?  @db.Text
  category          String?  // integration, automation, analytics, etc
  tags              Json?    // array de strings

  // Autoria
  author            String?
  authorEmail       String?
  team              String?

  // Versionamento
  version           String   @default("1.0.0")
  versionNotes      String?  @db.Text

  // Status
  status            String   @default("active") // active, deprecated, archived, draft
  isPublic          Boolean  @default(false)
  isTemplate        Boolean  @default(false)

  // Métricas
  complexity        String?  // low, medium, high
  estimatedDuration Int?     // em minutos

  // Dependências
  dependencies      Json?    // array de workflow IDs
  requiredServices  Json?    // array de serviços externos necessários

  // Relacionamentos
  documentation     WorkflowDocumentation?
  versions          WorkflowVersion[]
}
```

#### 2. **workflow_documentation** - Documentação Detalhada
Armazena toda a documentação textual dos workflows:

```prisma
model WorkflowDocumentation {
  id                String   @id @default(uuid())
  workflowId        String   @unique

  // Conteúdo da documentação (Markdown)
  overview          String?  @db.Text
  setupInstructions String?  @db.Text
  usageExamples     String?  @db.Text
  troubleshooting   String?  @db.Text
  notes             String?  @db.Text

  // Diagramas (JSON)
  flowDiagram       Json?
  architectureDiagram Json?

  // Configurações (JSON)
  configExamples    Json?
  environmentVars   Json?

  // Schemas (JSON)
  inputSchema       Json?
  outputSchema      Json?
  webhookUrl        String?

  // FAQ e Issues (JSON arrays)
  faqItems          Json?    // [{question, answer}]
  knownIssues       Json?    // [{title, description}]

  // Links externos (JSON array)
  externalDocs      Json?    // [{title, url}]
  relatedWorkflows  Json?    // array de workflow IDs

  // Metadata de edição
  lastEditedBy      String?
  lastEditedAt      DateTime?
}
```

#### 3. **workflow_versions** - Versionamento com Snapshots
Sistema completo de versionamento com histórico:

```prisma
model WorkflowVersion {
  id                String   @id @default(uuid())
  workflowId        String

  // Informações da versão
  version           String   // semver: 1.0.0, 1.1.0, etc
  versionName       String?  // nome amigável
  description       String?  @db.Text
  changeType        String   // major, minor, patch, hotfix

  // Snapshot completo do workflow
  workflowData      Json     // estrutura completa do n8n

  // Git integration
  gitCommitHash     String?
  gitBranch         String?
  gitTag            String?

  // Autor e changelog
  createdBy         String?
  createdByEmail    String?
  changelog         String?  @db.Text
  breakingChanges   String?  @db.Text

  // Status e deployment
  isActive          Boolean  @default(false)
  isStable          Boolean  @default(true)
  deployedAt        DateTime?
  deployedBy        String?
}
```

#### 4. **workflow_templates** - Biblioteca de Templates
Templates reutilizáveis para novos workflows:

```prisma
model WorkflowTemplate {
  id                String   @id @default(uuid())

  // Informações básicas
  name              String
  description       String   @db.Text
  category          String
  tags              Json?

  // Template data
  templateData      Json     // estrutura do workflow
  thumbnailUrl      String?

  // Configuração necessária
  configSchema      Json?    // schema de configuração
  requiredServices  Json?    // serviços necessários

  // Métricas de uso
  useCount          Int      @default(0)
  rating            Float?

  // Autor e status
  createdBy         String?
  isOfficial        Boolean  @default(false)
  isPublic          Boolean  @default(true)
  status            String   @default("active")
}
```

## 🔌 API Endpoints

### Metadados de Workflows

#### GET /api/n8n/metadata
Buscar metadados de workflows

**Parâmetros:**
- `workflowId` (opcional) - ID específico do workflow
- `category` (opcional) - Filtrar por categoria
- `status` (opcional) - Filtrar por status
- `isTemplate` (opcional) - Filtrar templates

**Resposta:**
```json
{
  "metadata": {
    "id": "uuid",
    "workflowId": "workflow-123",
    "workflowName": "Processar Leads",
    "description": "Workflow para processar e qualificar leads...",
    "category": "automation",
    "tags": ["leads", "crm", "automation"],
    "author": "João Silva",
    "version": "1.2.0",
    "complexity": "medium",
    "dependencies": ["workflow-456"],
    "requiredServices": ["Slack", "MySQL"],
    "documentation": { ... },
    "versions": [ ... ]
  }
}
```

#### POST /api/n8n/metadata
Criar ou atualizar metadados

**Body:**
```json
{
  "workflowId": "workflow-123",
  "workflowName": "Processar Leads",
  "description": "Descrição do workflow",
  "purpose": "Objetivo do workflow",
  "category": "automation",
  "tags": ["leads", "crm"],
  "author": "João Silva",
  "authorEmail": "joao@example.com",
  "team": "Growth",
  "version": "1.0.0",
  "status": "active",
  "isPublic": false,
  "isTemplate": false,
  "complexity": "medium",
  "estimatedDuration": 5,
  "dependencies": ["workflow-456"],
  "requiredServices": ["Slack"]
}
```

### Documentação

#### GET /api/n8n/documentation
Buscar documentação de um workflow

**Parâmetros:**
- `workflowId` (obrigatório) - ID do workflow

#### POST /api/n8n/documentation
Criar ou atualizar documentação

**Body:**
```json
{
  "workflowId": "workflow-123",
  "overview": "# Visão Geral\n\nEste workflow...",
  "setupInstructions": "## Setup\n\n1. Configure...",
  "usageExamples": "## Exemplos\n\n...",
  "troubleshooting": "## Troubleshooting\n\n...",
  "notes": "Notas adicionais",
  "webhookUrl": "https://...",
  "faqItems": [
    {
      "question": "Como configurar?",
      "answer": "Siga os passos..."
    }
  ],
  "knownIssues": [
    {
      "title": "Issue 1",
      "description": "Descrição do problema"
    }
  ],
  "externalDocs": [
    {
      "title": "Documentação API",
      "url": "https://..."
    }
  ],
  "lastEditedBy": "João Silva"
}
```

### Versionamento

#### GET /api/n8n/versions
Listar versões de um workflow

**Parâmetros:**
- `workflowId` (obrigatório) - ID do workflow
- `version` (opcional) - Versão específica
- `limit` (opcional) - Limite de resultados (padrão: 10)

#### POST /api/n8n/versions
Criar nova versão

**Body:**
```json
{
  "workflowId": "workflow-123",
  "version": "1.2.0",
  "versionName": "Feature: Integração Slack",
  "description": "Adiciona integração com Slack",
  "changeType": "minor",
  "workflowData": { ... }, // snapshot completo do workflow
  "createdBy": "João Silva",
  "createdByEmail": "joao@example.com",
  "changelog": "- Adicionada integração Slack\n- Melhorias de performance",
  "breakingChanges": null,
  "isStable": true,
  "setAsActive": true // ativa esta versão
}
```

#### PATCH /api/n8n/versions
Ativar uma versão específica (rollback)

**Body:**
```json
{
  "workflowId": "workflow-123",
  "version": "1.1.0",
  "deployedBy": "João Silva"
}
```

### Templates

#### GET /api/n8n/templates
Listar templates

**Parâmetros:**
- `id` (opcional) - Template específico
- `category` (opcional) - Filtrar por categoria
- `isPublic` (opcional) - Filtrar públicos
- `status` (opcional) - Filtrar por status
- `sortBy` (opcional) - useCount, rating, createdAt

#### POST /api/n8n/templates
Criar novo template

**Body:**
```json
{
  "name": "Template de Integração",
  "description": "Template para integrar serviços",
  "category": "integration",
  "tags": ["template", "integration"],
  "templateData": { ... }, // estrutura do workflow
  "thumbnailUrl": "https://...",
  "configSchema": { ... },
  "requiredServices": ["Service A", "Service B"],
  "createdBy": "João Silva",
  "isOfficial": false,
  "isPublic": true,
  "status": "active"
}
```

## 🎨 Interface de Documentação

### Modal Interativo

O modal de documentação possui 3 abas principais:

#### 1. Aba Metadados
- Descrição e propósito do workflow
- Categoria e status
- Complexidade e duração estimada
- Autor, email e time
- Versão atual
- Tags editáveis
- Dependências de outros workflows
- Serviços externos necessários
- Opções: Público e É Template

#### 2. Aba Documentação
- **Visão Geral**: Descrição completa do workflow
- **Instruções de Setup**: Passo a passo de configuração
- **Exemplos de Uso**: Casos de uso práticos
- **Troubleshooting**: Problemas comuns e soluções
- **Notas Adicionais**: Informações extras

Todos os campos suportam Markdown para formatação rica.

#### 3. Aba Configuração
- Webhook URL
- Aviso sobre recursos avançados disponíveis via API

### Como Usar

1. **Abrir Documentação**: Na lista de workflows, clique no ícone de documento (📄) ao lado de cada workflow

2. **Preencher Metadados**: Na aba "Metadados", adicione:
   - Descrição clara do que o workflow faz
   - Categoria apropriada
   - Tags para facilitar busca
   - Informações de autoria
   - Dependências e serviços necessários

3. **Escrever Documentação**: Na aba "Documentação":
   - Overview: Explique o funcionamento geral
   - Setup: Detalhe a configuração necessária
   - Exemplos: Forneça casos de uso reais
   - Troubleshooting: Liste problemas conhecidos

4. **Salvar**: Clique em "Salvar Documentação"

## 📊 Benefícios do Sistema

### 1. **Documentação Centralizada**
- Toda informação sobre workflows em um só lugar
- Facilita onboarding de novos desenvolvedores
- Reduz tempo de entendimento de workflows existentes

### 2. **Versionamento Robusto**
- Histórico completo de mudanças
- Rollback fácil para versões anteriores
- Changelog automático
- Integração com Git

### 3. **Biblioteca de Templates**
- Reutilização de workflows comuns
- Padrões organizacionais
- Avaliação e contagem de uso
- Templates oficiais e comunitários

### 4. **Busca e Organização**
- Tags para categorização
- Filtros por categoria e status
- Dependências mapeadas
- Serviços necessários documentados

### 5. **Colaboração**
- Autoria rastreada
- Times identificados
- Histórico de edições
- Status de publicação

## 🔄 Fluxo de Trabalho Recomendado

### Criando um Novo Workflow

1. **Criar no n8n**: Desenvolva o workflow no editor n8n
2. **Documentar**: Abra o modal de documentação e preencha:
   - Metadados básicos (descrição, categoria, autor)
   - Documentação completa
   - Dependências e serviços
3. **Versionar**: Crie a primeira versão (1.0.0)
4. **Publicar**: Marque como ativo

### Atualizando um Workflow

1. **Fazer Mudanças**: Edite o workflow no n8n
2. **Atualizar Docs**: Atualize a documentação se necessário
3. **Nova Versão**: Crie uma nova versão com:
   - Número de versão incrementado (seguindo semver)
   - Changelog detalhado
   - Breaking changes (se houver)
4. **Ativar**: Marque a nova versão como ativa

### Criando Templates

1. **Workflow Funcionando**: Tenha um workflow testado e funcional
2. **Generalizar**: Remova dados específicos do workflow
3. **Documentar**: Crie documentação detalhada do template
4. **Criar Template**: Use a API de templates para salvar
5. **Publicar**: Marque como público se apropriado

## 🚀 Próximos Passos (Fase 2.2 e 2.3)

### Fase 2.2 - Versionamento Git Completo
- [ ] Interface para commits Git
- [ ] Diff visual entre versões
- [ ] Sistema de branches
- [ ] Pull requests para workflows
- [ ] Integração com GitHub/GitLab

### Fase 2.3 - Biblioteca de Templates Avançada
- [ ] Marketplace de templates
- [ ] Sistema de avaliações e comentários
- [ ] Preview de templates antes de usar
- [ ] Categorias expandidas
- [ ] Import/export em massa
- [ ] Templates com variáveis de configuração

## 📝 Exemplos de Uso

### Documentar um Workflow Existente

```javascript
// 1. Criar metadados
const metadata = await fetch('/api/n8n/metadata', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'abc123',
    workflowName: 'Processar Vendas',
    description: 'Processa vendas do Shopify e atualiza CRM',
    category: 'integration',
    tags: ['shopify', 'crm', 'vendas'],
    author: 'João Silva',
    complexity: 'medium',
    requiredServices: ['Shopify', 'HubSpot']
  })
})

// 2. Adicionar documentação
const docs = await fetch('/api/n8n/documentation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'abc123',
    overview: '# Processador de Vendas\n\nEste workflow sincroniza vendas do Shopify com o HubSpot...',
    setupInstructions: '## Setup\n\n1. Configure webhook no Shopify\n2. Adicione API key do HubSpot...',
    usageExamples: '## Como Usar\n\nO workflow é acionado automaticamente quando...',
    lastEditedBy: 'João Silva'
  })
})
```

### Criar uma Versão

```javascript
const version = await fetch('/api/n8n/versions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'abc123',
    version: '1.1.0',
    description: 'Adiciona suporte para múltiplas moedas',
    changeType: 'minor',
    workflowData: workflowSnapshot, // dados do n8n
    createdBy: 'João Silva',
    changelog: '- Suporte para EUR e GBP\n- Conversão automática de moedas',
    setAsActive: true
  })
})
```

### Buscar Templates Populares

```javascript
const templates = await fetch('/api/n8n/templates?sortBy=useCount&isPublic=true')
const data = await templates.json()

data.templates.forEach((template: { name: string; useCount: number; rating: number }) => {
  console.log(`${template.name} - ${template.useCount} usos - ⭐ ${template.rating}`)
})
```

## 🛠️ Manutenção

### Limpeza de Versões Antigas

```sql
-- Deletar versões antigas (manter apenas últimas 10)
DELETE v FROM workflow_versions v
LEFT JOIN (
  SELECT id FROM workflow_versions
  WHERE workflowId = 'abc123'
  ORDER BY createdAt DESC
  LIMIT 10
) AS keep ON v.id = keep.id
WHERE v.workflowId = 'abc123'
AND keep.id IS NULL
AND v.isActive = false;
```

### Backup de Documentação

```bash
# Exportar toda a documentação
curl https://atmaadmin.roilabs.com.br/api/n8n/metadata > backup_metadata.json
```

## 📚 Referências

- [Roadmap Completo](../roadmaps/roadmap_automacoes_melhores_praticas.md)
- [README Fase 1](./README_AUTOMACOES.md)
- [Documentação Prisma](https://www.prisma.io/docs)
- [n8n API Documentation](https://docs.n8n.io/api)
- [Semantic Versioning](https://semver.org/)
