# Notification System Setup Guide

Este guia ajuda você a configurar o sistema de notificações do Atma Aligner.

## 🚀 Quick Setup (Recomendado)

### Windows

```bash
cd Backend/database
setup-notifications.bat
```

### Linux/Mac

```bash
cd Backend/database
chmod +x setup-notifications.sh
./setup-notifications.sh
```

O script irá:
1. Criar as tabelas necessárias (`email_templates`, `notification_log`, `system_settings`)
2. Inserir 7 templates de email profissionais
3. Configurar settings padrão de notificação
4. Verificar a instalação

---

## 📋 Manual Setup

Se preferir executar manualmente:

### Passo 1: Criar Tabelas

```bash
mysql -u root -p atmadb < migrations/create_notification_tables.sql
```

Isso cria:
- `email_templates` - Templates Handlebars
- `notification_log` - Histórico de notificações
- `system_settings` - Configurações do sistema

### Passo 2: Inserir Templates de Email

```bash
mysql -u root -p atmadb < migrations/add_notification_email_templates.sql
```

Isso insere 7 templates:
1. **new_patient** - Notificação de novo paciente para admin
2. **appointment_scheduled** - Confirmação de agendamento
3. **appointment_cancelled** - Notificação de cancelamento
4. **appointment_reminder** - Lembrete 24h antes
5. **payment_confirmation** - Recibo de pagamento
6. **weekly_report** - Relatório semanal para admin
7. **generic** - Template genérico

### Passo 3: Verificar Instalação

```sql
-- Verificar tabelas criadas
SHOW TABLES LIKE '%email_templates%';
SHOW TABLES LIKE '%notification_log%';
SHOW TABLES LIKE '%system_settings%';

-- Contar templates instalados (deve retornar 7)
SELECT COUNT(*) FROM email_templates WHERE is_active = 1;

-- Ver configurações de notificação
SELECT * FROM system_settings WHERE category = 'notifications';
```

---

## ⚙️ Configuração

### 1. Configurar .env

Adicione as credenciais SMTP no arquivo `.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app

# Email Headers
EMAIL_FROM_NAME=Atma Aligner
EMAIL_FROM_ADDRESS=noreply@atma.roilabs.com.br

# Admin
ADMIN_URL=https://atmaadmin.roilabs.com.br
```

**Para Gmail:**
1. Ative a verificação em 2 etapas
2. Gere uma "Senha de app" em: https://myaccount.google.com/apppasswords
3. Use a senha de app no `SMTP_PASS`

### 2. Configurar Email do Admin

O email do admin recebe notificações de novos pacientes, alertas de sistema, etc.

```sql
UPDATE system_settings
SET setting_value = 'seu-admin@atma.com.br'
WHERE setting_key = 'admin_email';
```

### 3. Habilitar/Desabilitar Tipos de Notificação

Você pode controlar quais notificações estão ativas:

```sql
-- Ver configuração atual
SELECT setting_key, setting_value
FROM system_settings
WHERE setting_key LIKE 'notification%';

-- Desabilitar notificações de novos pacientes
UPDATE system_settings
SET setting_value = 'false'
WHERE setting_key = 'notification_type_new_patients';

-- Habilitar SMS (futuro)
UPDATE system_settings
SET setting_value = 'true'
WHERE setting_key = 'notification_sms';
```

Depois de alterar, recarregue as configurações:

```bash
curl -X POST http://localhost:3001/api/notifications/settings/reload
```

---

## 🧪 Testar o Sistema

### 1. Verificar Configurações

```bash
curl http://localhost:3001/api/notifications/settings
```

Deve retornar:
```json
{
  "success": true,
  "settings": {
    "emailEnabled": true,
    "smsEnabled": false,
    "types": {
      "newPatients": true,
      "appointments": true,
      "payments": true,
      "weeklyReports": true,
      "systemAlerts": true
    }
  }
}
```

### 2. Enviar Notificação de Teste

```bash
curl -X POST http://localhost:3001/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "seu-email@example.com",
    "type": "systemAlerts"
  }'
```

Você deve receber um email de teste.

### 3. Ver Histórico de Notificações

```bash
curl http://localhost:3001/api/notifications/log?limit=10
```

### 4. Ver Estatísticas

```bash
curl http://localhost:3001/api/notifications/stats?period=7
```

---

## 🔧 Troubleshooting

### Erro: "Table 'atmadb.email_templates' doesn't exist"

**Solução**: Execute o script de criação de tabelas:

```bash
mysql -u root -p atmadb < migrations/create_notification_tables.sql
```

### Erro: "SMTP connection failed"

**Causas comuns**:

1. **Credenciais incorretas** - Verifique `.env`
2. **Porta bloqueada** - Teste com telnet:
   ```bash
   telnet smtp.gmail.com 587
   ```
3. **Gmail bloqueando** - Use senha de app (não a senha normal)
4. **Firewall** - Libere porta 587

**Testar SMTP manualmente**:

```bash
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify()
  .then(() => console.log('✅ SMTP connection OK'))
  .catch(err => console.error('❌ SMTP error:', err.message));
"
```

### Notificações não chegam

1. **Verificar se o tipo está habilitado**:
   ```bash
   curl http://localhost:3001/api/notifications/settings
   ```

2. **Verificar logs do backend**:
   ```bash
   tail -f backend.log | grep notification
   ```

3. **Verificar se email está no spam**

4. **Ver notificações que falharam**:
   ```bash
   curl "http://localhost:3001/api/notifications/log?status=failed"
   ```

### Templates não aparecem

**Solução**: Recarregar templates do banco:

```bash
curl -X POST http://localhost:3001/api/notifications/settings/reload
```

---

## 📚 Documentação Completa

Para detalhes completos sobre:
- Arquitetura do sistema
- API reference completa
- Customização de templates
- Integração com eventos
- Exemplos de código

Veja: **[Backend/docs/NOTIFICATION_SYSTEM.md](../docs/NOTIFICATION_SYSTEM.md)**

---

## 📊 Estrutura das Tabelas

### email_templates

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INT | Primary key |
| template_name | VARCHAR(100) | ID único (ex: 'new_patient') |
| name | VARCHAR(255) | Nome legível |
| subject | VARCHAR(500) | Assunto (com variáveis Handlebars) |
| html_content | TEXT | Template HTML completo |
| text_content | TEXT | Versão texto puro |
| variables | JSON | Array das variáveis usadas |
| is_active | BOOLEAN | Se o template está ativo |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

### notification_log

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INT | Primary key |
| notification_type | VARCHAR(50) | Tipo (newPatients, appointments, etc.) |
| recipient | VARCHAR(255) | Email ou telefone |
| subject | VARCHAR(500) | Assunto |
| message | TEXT | Mensagem enviada |
| sent_at | TIMESTAMP | Quando foi enviada |
| email_sent | BOOLEAN | Se email foi enviado |
| sms_sent | BOOLEAN | Se SMS foi enviado |
| status | ENUM | sent, failed, pending |
| error_message | TEXT | Mensagem de erro (se falhou) |
| metadata | JSON | Dados adicionais |

### system_settings

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INT | Primary key |
| setting_key | VARCHAR(100) | Chave única (ex: 'notification_email') |
| setting_value | TEXT | Valor da configuração |
| description | VARCHAR(500) | Descrição legível |
| category | VARCHAR(50) | Categoria (ex: 'notifications') |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

---

## 🎯 Próximos Passos Após Setup

1. ✅ Verificar que todas as tabelas foram criadas
2. ✅ Testar envio de email com `/test`
3. ✅ Configurar email do admin correto
4. ✅ Cadastrar um paciente de teste e verificar se admin recebeu email
5. ✅ Verificar logs: `GET /api/notifications/log`
6. 📱 (Futuro) Configurar SMS com Twilio
7. 📊 (Futuro) Configurar relatórios semanais via cron

---

**Última atualização**: 24/10/2025
**Versão**: 1.0.0
**Suporte**: Backend/docs/NOTIFICATION_SYSTEM.md
