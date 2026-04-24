# Configuração de Email Marketing - Atma Portal

Este documento descreve como configurar o sistema de email marketing do Portal do Paciente Atma.

## 📋 Índice

1. [Configuração do Resend](#configuração-do-resend)
2. [Variáveis de Ambiente](#variáveis-de-ambiente)
3. [Criação da Tabela de Logs](#criação-da-tabela-de-logs)
4. [Configuração do Cron Job](#configuração-do-cron-job)
5. [Tipos de Email](#tipos-de-email)
6. [Testando os Emails](#testando-os-emails)

## 🔧 Configuração do Resend

### 1. Criar conta no Resend

1. Acesse [https://resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Verifique seu email

### 2. Obter API Key

1. No dashboard do Resend, vá em **API Keys**
2. Clique em **Create API Key**
3. Dê um nome (ex: "Atma Portal - Production")
4. Copie a chave gerada (começa com `re_`)

### 3. Configurar Domínio (Opcional mas Recomendado)

1. No Resend, vá em **Domains**
2. Adicione seu domínio (ex: `atma.roilabs.com.br`)
3. Configure os registros DNS conforme instruído
4. Aguarde verificação (pode levar até 48h)

**Com domínio verificado**, seus emails virão de `noreply@atma.roilabs.com.br`
**Sem domínio**, virão de `onboarding@resend.dev` (menos profissional)

## 🔐 Variáveis de Ambiente

Adicione no arquivo `.env.local` (desenvolvimento) e no Vercel (produção):

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Token secreto para cron jobs (gere um aleatório forte)
CRON_SECRET=seu-token-secreto-aleatorio-aqui
```

### Como gerar token secreto forte:

```bash
# No terminal (Linux/Mac)
openssl rand -base64 32

# No terminal (Windows PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Ou use um gerador online:
# https://www.random.org/strings/
```

## 🗄️ Criação da Tabela de Logs

Execute a migration SQL no seu banco de dados:

```bash
mysql -u root -p atma_crm < Frontend/db/migrations/005_create_email_logs.sql
```

Ou execute manualmente:

```sql
CREATE TABLE portal_email_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo_email VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'enviado',
  metadata JSON,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_tipo_email (tipo_email),
  INDEX idx_sent_at (sent_at),
  FOREIGN KEY (user_id) REFERENCES portal_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## ⏰ Configuração do Cron Job

### No Vercel (Recomendado)

O arquivo `vercel.json` já está configurado:

```json
{
  "crons": [
    {
      "path": "/api/emails/cron",
      "schedule": "0 10 * * *"
    }
  ]
}
```

**Schedule**: `0 10 * * *` = Todo dia às 10h UTC (7h BRT)

### Variáveis de Ambiente no Vercel

1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - `RESEND_API_KEY` = sua chave do Resend
   - `CRON_SECRET` = token secreto forte

### Testando o Cron Manualmente

```bash
curl -X GET https://atma.roilabs.com.br/api/emails/cron \
  -H "Authorization: Bearer SEU_CRON_SECRET"
```

Resposta esperada:

```json
{
  "success": true,
  "timestamp": "2024-12-01T10:00:00.000Z",
  "resultados": {
    "lembrete3dias": { "enviados": 5, "erros": 0 },
    "lembrete7dias": { "enviados": 3, "erros": 0 }
  }
}
```

## 📧 Tipos de Email

### 1. Email de Cadastro (Boas-vindas)

**Quando**: Imediatamente após usuário se cadastrar
**Conteúdo**:

- Boas-vindas ao portal
- Resumo do relatório (score, duração, custo)
- Lista de funcionalidades do portal
- CTA: "Acessar Meu Portal"

**Envio Manual** (via webhook do Clerk ou após criar relatório):

```typescript
await fetch('/api/emails/enviar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tipo: 'cadastro',
    usuario: { nome: 'João Silva', email: 'joao@example.com' },
    relatorio: {
      score: 85,
      custoEstimado: 8500,
      duracaoMeses: 12,
      complexidade: 'Moderada',
    },
  }),
})
```

### 2. Lembrete 3 Dias

**Quando**: 3 dias após cadastro (automático via cron)
**Conteúdo**:

- Pergunta se já explorou o relatório
- Destaque para 3 seções importantes (Análise, Financeiro, Depoimentos)
- CTA: "Continuar Explorando"

**Enviado automaticamente** pelo cron job às 10h UTC

### 3. Lembrete 7 Dias

**Quando**: 7 dias após cadastro (automático via cron)
**Conteúdo**:

- Incentivo para agendar consulta presencial
- Destaque: Avaliação inicial GRATUITA
- Lista de benefícios da consulta
- Informações sobre unidades
- CTA: "Agendar Agora"

**Enviado automaticamente** pelo cron job às 10h UTC

### 4. Confirmação de Agendamento

**Quando**: Após usuário agendar consulta via Calendly
**Conteúdo**:

- Confirmação da consulta
- Detalhes (data, horário, local)
- O que levar na consulta
- CTA: "Acessar Meu Portal"

**Envio Manual** (via webhook do Calendly):

```typescript
await fetch('/api/emails/enviar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tipo: 'agendamento',
    usuario: { nome: 'João Silva', email: 'joao@example.com' },
    agendamento: {
      data: '15 de Dezembro de 2024',
      horario: '14:00',
      unidade: 'São Paulo - Jardins',
      endereco: 'Rua Augusta, 2676 - Cerqueira César',
      tipoConsulta: 'Avaliação Inicial',
    },
  }),
})
```

## 🧪 Testando os Emails

### 1. Testar Email de Cadastro

```bash
curl -X POST http://localhost:3000/api/emails/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "cadastro",
    "usuario": {
      "nome": "Teste",
      "email": "seu-email@example.com"
    },
    "relatorio": {
      "score": 85,
      "custoEstimado": 8500,
      "duracaoMeses": 12,
      "complexidade": "Moderada"
    }
  }'
```

### 2. Testar Lembrete 3 Dias

```bash
curl -X POST http://localhost:3000/api/emails/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "lembrete-3dias",
    "usuario": {
      "nome": "Teste",
      "email": "seu-email@example.com"
    }
  }'
```

### 3. Testar Lembrete 7 Dias

```bash
curl -X POST http://localhost:3000/api/emails/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "lembrete-7dias",
    "usuario": {
      "nome": "Teste",
      "email": "seu-email@example.com"
    }
  }'
```

### 4. Testar Confirmação de Agendamento

```bash
curl -X POST http://localhost:3000/api/emails/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "agendamento",
    "usuario": {
      "nome": "Teste",
      "email": "seu-email@example.com"
    },
    "agendamento": {
      "data": "15 de Dezembro de 2024",
      "horario": "14:00",
      "unidade": "São Paulo - Jardins",
      "endereco": "Rua Augusta, 2676 - Cerqueira César",
      "tipoConsulta": "Avaliação Inicial"
    }
  }'
```

## 📊 Monitoramento

### Ver Logs de Emails Enviados

```sql
SELECT
  el.id,
  pu.nome,
  pu.email,
  el.tipo_email,
  el.status,
  el.sent_at
FROM portal_email_logs el
JOIN portal_users pu ON el.user_id = pu.id
ORDER BY el.sent_at DESC
LIMIT 50;
```

### Verificar Usuários que Receberão Emails Hoje

```sql
-- Usuários que receberão lembrete de 3 dias
SELECT nome, email, created_at
FROM portal_users
WHERE DATE(created_at) = DATE(NOW() - INTERVAL 3 DAY)
  AND NOT EXISTS (
    SELECT 1 FROM portal_email_logs
    WHERE user_id = portal_users.id AND tipo_email = 'lembrete-3dias'
  );

-- Usuários que receberão lembrete de 7 dias
SELECT nome, email, created_at
FROM portal_users
WHERE DATE(created_at) = DATE(NOW() - INTERVAL 7 DAY)
  AND NOT EXISTS (
    SELECT 1 FROM portal_email_logs
    WHERE user_id = portal_users.id AND tipo_email = 'lembrete-7dias'
  );
```

## 🎨 Personalizando Templates

Os templates estão em: `Frontend/lib/email-templates.tsx`

Para editar:

1. Abra o arquivo
2. Localize a função do template (ex: `EmailCadastro`)
3. Edite o JSX/HTML
4. Teste o email

**Dica**: Todos os estilos devem ser inline para compatibilidade com clientes de email.

## 🚨 Troubleshooting

### Email não está sendo enviado

1. Verifique se `RESEND_API_KEY` está correta
2. Verifique logs no console do servidor
3. Confirme que o domínio está verificado no Resend
4. Teste com email pessoal primeiro

### Cron job não está executando

1. Confirme que `CRON_SECRET` está configurado no Vercel
2. Verifique logs do Vercel: **Functions** → **Logs**
3. Teste manualmente com curl
4. Confirme timezone (UTC vs BRT)

### Emails vão para spam

1. Configure SPF, DKIM e DMARC no DNS
2. Verifique domínio no Resend
3. Use domínio próprio ao invés de `onboarding@resend.dev`
4. Evite palavras spam no assunto/conteúdo

## 📚 Recursos

- [Resend Docs](https://resend.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [React Email](https://react.email) - Para templates mais complexos
