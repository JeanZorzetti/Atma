# Sistema de Automações - Fase 1 Implementada

## 📋 Resumo

Implementação da **Fase 1** do roadmap de automações, conforme descrito em `roadmaps/roadmap_automacoes_melhores_praticas.md`.

Esta fase inclui:
- ✅ Sistema de logging centralizado
- ✅ Monitoramento em tempo real
- ✅ Integração com Slack para alertas
- ✅ Health checks automáticos
- ✅ Painel de métricas e execuções

## 🗃️ Estrutura de Banco de Dados

### Tabelas Criadas (Prisma Schema)

O schema Prisma foi criado em `admin/prisma/schema.prisma` com as seguintes tabelas:

1. **workflow_executions** - Registra cada execução de workflow
2. **workflow_logs** - Logs detalhados de cada execução
3. **workflow_alerts** - Alertas e notificações
4. **workflow_metrics** - Métricas agregadas por workflow
5. **workflow_health_checks** - Resultados de health checks
6. **alert_configurations** - Configurações de alertas por workflow

### Configuração do Banco de Dados

#### 1. Configurar variável de ambiente

Certifique-se de que o arquivo `admin/.env` existe com a variável `DATABASE_URL`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/atma_aligner"
```

#### 2. Criar as tabelas

Execute os seguintes comandos na pasta `admin`:

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar as tabelas no banco de dados
npx prisma db push
```

#### 3. Verificar as tabelas

```bash
# Ver o estado do banco de dados
npx prisma studio
```

## 🔌 API Endpoints

### Execuções

- `GET /api/n8n/executions` - Lista execuções com filtros
- `POST /api/n8n/executions` - Cria nova execução
- `GET /api/n8n/executions/[id]` - Busca execução específica
- `PATCH /api/n8n/executions/[id]` - Atualiza execução
- `DELETE /api/n8n/executions/[id]` - Deleta execução

### Logs

- `GET /api/n8n/logs` - Lista logs com filtros
- `POST /api/n8n/logs` - Cria novo log

### Alertas

- `GET /api/n8n/alerts` - Lista alertas
- `POST /api/n8n/alerts` - Cria alerta
- `PATCH /api/n8n/alerts` - Atualiza status do alerta
- `POST /api/n8n/alerts/send` - Envia alerta via Slack/Email

### Métricas

- `GET /api/n8n/metrics` - Busca métricas
- `POST /api/n8n/metrics` - Calcula métricas de um workflow

### Health Checks

- `GET /api/n8n/health` - Lista health checks
- `POST /api/n8n/health` - Executa health check

### Configurações de Alertas

- `GET /api/n8n/alert-config` - Busca configuração
- `POST /api/n8n/alert-config` - Cria/atualiza configuração
- `DELETE /api/n8n/alert-config` - Remove configuração

## 🔔 Integração com Slack

### Configurar Webhook do Slack

1. Acesse https://api.slack.com/messaging/webhooks
2. Crie um Incoming Webhook para seu workspace
3. Configure via API:

```bash
curl -X POST https://atmaadmin.roilabs.com.br/api/n8n/alert-config \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "seu-workflow-id",
    "workflowName": "Nome do Workflow",
    "enabled": true,
    "slackEnabled": true,
    "slackWebhook": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
    "slackChannel": "#automations",
    "alertOnError": true,
    "alertOnWarning": false
  }'
```

### Testar Envio de Alerta

```bash
curl -X POST https://atmaadmin.roilabs.com.br/api/n8n/alerts/send \
  -H "Content-Type: application/json" \
  -d '{
    "alertId": "id-do-alerta"
  }'
```

## 📊 Interface Web

A página de Automações foi completamente atualizada e inclui:

### Abas

1. **Workflows** - Lista de workflows do n8n
2. **Execuções** - Histórico de execuções com logs
3. **Alertas** - Alertas pendentes e notificações
4. **Métricas** - Análise de performance (em desenvolvimento)

### Features

- ✅ Auto-refresh a cada 30 segundos
- ✅ Visualização de logs por execução
- ✅ Status em tempo real (success, error, running)
- ✅ Indicadores visuais de problemas
- ✅ Duração de execuções formatada
- ✅ Contadores de alertas pendentes

## 🚀 Como Usar

### 1. Registrar uma Execução

```javascript
// No início da execução do workflow
const response = await fetch('/api/n8n/executions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'workflow-123',
    workflowName: 'Processar Leads',
    executionId: 'exec-456',
    status: 'running',
    mode: 'trigger',
    triggeredBy: 'webhook'
  })
})

const { execution } = await response.json()
const executionId = execution.id
```

### 2. Adicionar Logs Durante a Execução

```javascript
await fetch('/api/n8n/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    executionId: executionId,
    level: 'info',
    message: 'Processando cliente X',
    nodeName: 'Process Customer',
    nodeType: 'n8n-nodes-base.code'
  })
})
```

### 3. Finalizar Execução

```javascript
await fetch(`/api/n8n/executions/${executionId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'success',
    finishedAt: new Date().toISOString(),
    duration: 5000,
    nodesExecuted: 10,
    nodesSuccess: 10,
    nodesError: 0
  })
})
```

### 4. Executar Health Check

```javascript
await fetch('/api/n8n/health', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'workflow-123',
    workflowName: 'Processar Leads'
  })
})
```

## 📈 Próximas Fases

Conforme o roadmap, as próximas fases incluem:

### Fase 2 - Documentação e Versionamento
- Sistema de documentação inline
- Versionamento Git
- Biblioteca de templates

### Fase 3 - Testes e Qualidade
- Ambiente de staging
- Testes automatizados
- Modo debug avançado

### Fase 4 - Segurança e Compliance
- Vault de credenciais
- RBAC
- Auditoria e LGPD

### Fase 5 - Otimização e Analytics
- Machine Learning
- Dashboard executivo
- Otimizações automáticas

## 🛠️ Manutenção

### Limpar Logs Antigos

```sql
-- Deletar logs com mais de 30 dias
DELETE FROM workflow_logs
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Deletar execuções com mais de 90 dias
DELETE FROM workflow_executions
WHERE startedAt < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

### Recalcular Métricas

```bash
curl -X POST https://atmaadmin.roilabs.com.br/api/n8n/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "workflow-123",
    "workflowName": "Nome do Workflow"
  }'
```

## 📝 Notas Importantes

1. **Banco de Dados**: Certifique-se de que o MySQL está rodando antes de executar `prisma db push`
2. **Variáveis de Ambiente**: Todas as variáveis necessárias estão em `admin/.env.local`
3. **Performance**: Os logs são limitados a 5 por execução na interface para performance
4. **Auto-refresh**: A página atualiza execuções e alertas automaticamente a cada 30 segundos

## 🐛 Troubleshooting

### Erro: "Can't reach database server"
- Verifique se o MySQL está rodando
- Confirme as credenciais em `admin/.env`
- Teste a conexão: `npx prisma db pull`

### Erro: "N8N API credentials not configured"
- Adicione `N8N_API_URL` e `N8N_API_KEY` em `admin/.env.local`
- Verifique se as variáveis estão disponíveis no servidor

### Alertas não estão sendo enviados
- Verifique se a configuração de alertas está ativada
- Teste o webhook do Slack manualmente
- Verifique os logs do servidor para erros

## 📚 Referências

- [Roadmap Completo](../roadmaps/roadmap_automacoes_melhores_praticas.md)
- [Pesquisa sobre Automações](../docs/pesquisa_automacoes.md)
- [Documentação Prisma](https://www.prisma.io/docs)
- [n8n API Documentation](https://docs.n8n.io/api)
