# Sistema de Automações - Fase 2.2: Versionamento Git Completo

## 📋 Resumo

Implementação da **Fase 2.2** do roadmap de automações: Versionamento Git Completo.

Esta fase adiciona:
- ✅ Serviço completo de integração Git
- ✅ Sistema de commits automáticos para workflows
- ✅ Histórico Git com interface visual
- ✅ Diff visual entre versões
- ✅ Rollback com um clique
- ✅ Gerenciamento de branches
- ✅ Sistema de tags
- ✅ Sincronização com banco de dados

## 🏗️ Arquitetura

### WorkflowGit Service ([admin/src/lib/workflow-git.ts](admin/src/lib/workflow-git.ts))

Serviço singleton para gerenciar operações Git:

```typescript
export class WorkflowGit {
  // Gerenciamento de repositório
  async init(): Promise<void>

  // Workflows
  async saveWorkflow(workflowId: string, workflowName: string, workflowData: unknown): Promise<string>

  // Commits
  async commit(workflowId, workflowName, workflowData, options): Promise<GitCommitInfo>
  async getLatestCommit(): Promise<GitCommitInfo>
  async getHistory(workflowId: string, limit?: number): Promise<GitCommitInfo[]>

  // Diff e Rollback
  async diff(workflowId: string, commit1: string, commit2: string): Promise<GitDiffResult>
  async rollback(workflowId: string, commitHash: string): Promise<unknown>
  async getWorkflowAtCommit(workflowId: string, commitHash: string): Promise<unknown>

  // Branches
  async listBranches(): Promise<string[]>
  async getCurrentBranch(): Promise<string>
  async createOrCheckoutBranch(branchName: string): Promise<void>
  async merge(sourceBranch: string, targetBranch?: string): Promise<void>
  async deleteBranch(branchName: string, force?: boolean): Promise<void>

  // Tags
  async createTag(tagName: string, message?: string, commitHash?: string): Promise<void>
  async listTags(): Promise<string[]>
}
```

### Estrutura de Arquivos

Os workflows são salvos como arquivos JSON em `workflows/`:

```
workflows/
  ├── processar-leads-abc123.json
  ├── sync-crm-def456.json
  └── enviar-email-ghi789.json
```

Cada arquivo contém o snapshot completo do workflow do n8n.

## 🔌 API Endpoints

### GET /api/n8n/git

**Ações disponíveis:**

#### 1. Histórico de Commits
```bash
GET /api/n8n/git?action=history&workflowId=abc123&limit=20
```

**Resposta:**
```json
{
  "history": [
    {
      "hash": "a1b2c3d4e5f6...",
      "shortHash": "a1b2c3d",
      "author": "João Silva",
      "email": "joao@example.com",
      "date": "2025-12-11T15:30:00Z",
      "message": "feat: Adicionar validação de dados",
      "branch": "main"
    }
  ]
}
```

#### 2. Listar Branches
```bash
GET /api/n8n/git?action=branches
```

**Resposta:**
```json
{
  "branches": ["main", "dev", "feature/slack-integration"],
  "currentBranch": "main"
}
```

#### 3. Listar Tags
```bash
GET /api/n8n/git?action=tags
```

**Resposta:**
```json
{
  "tags": ["v1.0.0", "v1.1.0", "v2.0.0"]
}
```

#### 4. Diff entre Commits
```bash
GET /api/n8n/git?action=diff&workflowId=abc123&commit1=a1b2c3d&commit2=HEAD
```

**Resposta:**
```json
{
  "diff": {
    "additions": 15,
    "deletions": 8,
    "changes": [
      {
        "type": "add",
        "path": "workflows/processar-leads-abc123.json",
        "content": "  \"timeout\": 5000,"
      },
      {
        "type": "remove",
        "path": "workflows/processar-leads-abc123.json",
        "content": "  \"timeout\": 3000,"
      }
    ]
  }
}
```

#### 5. Conteúdo de um Commit
```bash
GET /api/n8n/git?action=content&workflowId=abc123&commit=a1b2c3d
```

**Resposta:**
```json
{
  "content": {
    "id": "abc123",
    "name": "Processar Leads",
    "nodes": [...],
    "connections": {...}
  }
}
```

### POST /api/n8n/git

**Ações disponíveis:**

#### 1. Criar Commit
```json
{
  "action": "commit",
  "workflowId": "abc123",
  "workflowName": "Processar Leads",
  "workflowData": {...},
  "message": "feat: Adicionar integração Slack",
  "author": "João Silva",
  "email": "joao@example.com",
  "branch": "main"
}
```

**Resposta:**
```json
{
  "commit": {
    "hash": "a1b2c3d4e5f6...",
    "shortHash": "a1b2c3d",
    "author": "João Silva",
    "email": "joao@example.com",
    "date": "2025-12-11T15:30:00Z",
    "message": "feat: Adicionar integração Slack",
    "branch": "main"
  }
}
```

#### 2. Criar/Checkout Branch
```json
{
  "action": "branch",
  "branchName": "feature/new-integration"
}
```

#### 3. Merge de Branches
```json
{
  "action": "merge",
  "sourceBranch": "feature/new-integration",
  "targetBranch": "main"
}
```

#### 4. Criar Tag
```json
{
  "action": "tag",
  "tagName": "v1.2.0",
  "message": "Release 1.2.0",
  "commitHash": "a1b2c3d"
}
```

#### 5. Rollback
```json
{
  "action": "rollback",
  "workflowId": "abc123",
  "commitHash": "a1b2c3d"
}
```

**Resposta:**
```json
{
  "success": true,
  "workflowData": {...}
}
```

### DELETE /api/n8n/git

```bash
DELETE /api/n8n/git?branch=feature/old-feature&force=true
```

## 🎨 Interface - WorkflowGitHistory

### Modal Interativo

O componente `WorkflowGitHistory` fornece uma interface completa para Git:

#### 1. Informações da Branch
- Branch atual destacada
- Lista de todas as branches
- Tags disponíveis

#### 2. Lista de Commits
- Visualização cronológica
- Hash curto do commit
- Mensagem do commit
- Autor e data
- Badge da branch
- Seleção para comparação (até 2 commits)

#### 3. Comparação de Versões (Diff)
- Contador de adições e remoções
- Diff visual colorizado:
  - Verde: Linhas adicionadas
  - Vermelho: Linhas removidas
- Visualização em formato "unified diff"

#### 4. Rollback
- Botão em cada commit
- Confirmação antes de executar
- Criação automática de versão no banco
- Atualização do histórico após rollback

### Como Usar

1. **Abrir Histórico Git**: Clique no ícone de branch (🌿) ao lado de qualquer workflow

2. **Visualizar Commits**: Veja o histórico completo de mudanças

3. **Comparar Versões**:
   - Clique em um commit (fica selecionado)
   - Clique em outro commit
   - Clique em "Comparar Selecionados"
   - Veja o diff detalhado

4. **Fazer Rollback**:
   - Clique em "Rollback" no commit desejado
   - Confirme a ação
   - O workflow será restaurado automaticamente

## 🔄 Fluxo de Trabalho

### Criando um Commit Manualmente

```javascript
const response = await fetch('/api/n8n/git', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'commit',
    workflowId: 'abc123',
    workflowName: 'Processar Leads',
    workflowData: workflowSnapshot,
    message: 'feat: Adicionar validação de email',
    author: 'João Silva',
    email: 'joao@example.com'
  })
})

const { commit } = await response.json()
console.log(`Commit criado: ${commit.shortHash}`)
```

### Trabalhando com Branches

```javascript
// Criar nova branch
await fetch('/api/n8n/git', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'branch',
    branchName: 'feature/slack-integration'
  })
})

// Fazer commit na nova branch
await fetch('/api/n8n/git', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'commit',
    workflowId: 'abc123',
    workflowName: 'Processar Leads',
    workflowData: workflowSnapshot,
    message: 'feat: Adicionar integração Slack',
    branch: 'feature/slack-integration'
  })
})

// Fazer merge de volta para main
await fetch('/api/n8n/git', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'merge',
    sourceBranch: 'feature/slack-integration',
    targetBranch: 'main'
  })
})
```

### Comparando Versões

```javascript
const response = await fetch(
  '/api/n8n/git?action=diff&workflowId=abc123&commit1=a1b2c3d&commit2=e4f5g6h'
)

const { diff } = await response.json()

console.log(`Mudanças: +${diff.additions} -${diff.deletions}`)

diff.changes.forEach((change) => {
  console.log(`[${change.type}] ${change.content}`)
})
```

### Fazendo Rollback

```javascript
const response = await fetch('/api/n8n/git', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'rollback',
    workflowId: 'abc123',
    commitHash: 'a1b2c3d'
  })
})

const { workflowData } = await response.json()

// workflowData contém o workflow restaurado
// Uma nova versão foi criada automaticamente no banco
```

## 📊 Integração com Banco de Dados

Quando um commit é criado via API, o sistema automaticamente:

1. **Cria uma versão no banco** (tabela `workflow_versions`)
2. **Armazena o commit hash** do Git
3. **Registra a branch** onde foi criado
4. **Mantém changelog** sincronizado

Quando um rollback é executado:

1. **Recupera o workflow** do commit especificado
2. **Cria nova versão** marcada como "rollback"
3. **Ativa a versão** restaurada
4. **Desativa versões** anteriores

## 🔐 Segurança e Boas Práticas

### Proteções Implementadas

1. **Confirmação de Rollback**: Requer confirmação do usuário antes de executar
2. **Force Delete**: Branches requerem flag `force` para deletar
3. **Validação de Parâmetros**: Todos os endpoints validam inputs obrigatórios
4. **Error Handling**: Tratamento completo de erros Git

### Recomendações

1. **Branches para Desenvolvimento**: Use branches separadas para testar mudanças
2. **Merge para Produção**: Apenas faça merge para `main` após testes
3. **Tags para Releases**: Crie tags para versões estáveis
4. **Mensagens Descritivas**: Use mensagens de commit claras e descritivas
5. **Backup Regular**: Faça backup do repositório Git periodicamente

## 🎯 Casos de Uso

### 1. Desenvolvimento de Nova Feature

```bash
# Criar branch
POST /api/n8n/git { action: "branch", branchName: "feature/email-notifications" }

# Fazer mudanças e commitar
POST /api/n8n/git { action: "commit", branch: "feature/email-notifications", ... }

# Testar no n8n

# Merge quando pronto
POST /api/n8n/git { action: "merge", sourceBranch: "feature/email-notifications" }
```

### 2. Correção Emergencial (Hotfix)

```bash
# Criar branch de hotfix
POST /api/n8n/git { action: "branch", branchName: "hotfix/fix-timeout" }

# Aplicar correção
POST /api/n8n/git { action: "commit", branch: "hotfix/fix-timeout", message: "fix: Aumentar timeout para 10s" }

# Merge direto para main
POST /api/n8n/git { action: "merge", sourceBranch: "hotfix/fix-timeout" }

# Criar tag
POST /api/n8n/git { action: "tag", tagName: "v1.0.1", message: "Hotfix: timeout" }
```

### 3. Auditoria e Revisão

```bash
# Ver histórico completo
GET /api/n8n/git?action=history&workflowId=abc123&limit=100

# Comparar versão atual com versão de 1 mês atrás
GET /api/n8n/git?action=diff&workflowId=abc123&commit1=old-hash&commit2=HEAD

# Ver conteúdo exato de versão antiga
GET /api/n8n/git?action=content&workflowId=abc123&commit=old-hash
```

### 4. Rollback de Produção

```bash
# Identificar último commit estável
GET /api/n8n/git?action=history&workflowId=abc123

# Fazer rollback
POST /api/n8n/git { action: "rollback", workflowId: "abc123", commitHash: "stable-hash" }

# Verificar que rollback funcionou
GET /api/n8n/git?action=history&workflowId=abc123
```

## 🛠️ Manutenção

### Compactar Repositório Git

```bash
cd admin
git gc --aggressive --prune=now
```

### Backup do Repositório

```bash
# Backup completo
cd admin
tar -czf workflows-backup-$(date +%Y%m%d).tar.gz workflows/ .git/

# Ou usar git bundle
git bundle create workflows-backup.bundle --all
```

### Limpar Branches Antigas

```javascript
// Listar todas as branches
const { branches } = await (await fetch('/api/n8n/git?action=branches')).json()

// Deletar branches não utilizadas
for (const branch of oldBranches) {
  await fetch(`/api/n8n/git?branch=${branch}&force=true`, {
    method: 'DELETE'
  })
}
```

## 📈 Benefícios

### 1. **Rastreabilidade Total**
- Cada mudança em workflows é registrada
- Histórico completo com autor, data e mensagem
- Facilita auditorias e compliance

### 2. **Segurança**
- Rollback rápido em caso de problemas
- Teste de mudanças em branches separadas
- Recuperação de qualquer versão anterior

### 3. **Colaboração**
- Múltiplos desenvolvedores podem trabalhar em branches
- Merge controlado de features
- Revisão de mudanças via diff

### 4. **Versionamento Semântico**
- Tags para releases (v1.0.0, v1.1.0, etc.)
- Changelog automático
- Rastreamento de breaking changes

### 5. **Backup Automático**
- Cada commit é um ponto de backup
- Repositório Git pode ser clonado
- Recuperação de desastres facilitada

## 🔮 Próximos Passos (Fase 3)

A Fase 3 do roadmap incluirá:

### Testes e Qualidade
- Ambiente de staging separado
- Testes automatizados de workflows
- Modo debug avançado
- Validação de workflows antes do commit
- CI/CD com GitHub Actions

## 📚 Referências

- [Roadmap Completo](../roadmaps/roadmap_automacoes_melhores_praticas.md)
- [README Fase 2.1](./README_AUTOMACOES_FASE_2.md)
- [README Fase 1](./README_AUTOMACOES.md)
- [Git Documentation](https://git-scm.com/doc)
- [Semantic Versioning](https://semver.org/)
