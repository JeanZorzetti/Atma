# Sistema de Notificações Atma Admin

Sistema completo de notificações por email/SMS para eventos do sistema Atma Aligner.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Configuração](#configuração)
- [Tipos de Notificações](#tipos-de-notificações)
- [API Endpoints](#api-endpoints)
- [Templates de Email](#templates-de-email)
- [Integração com Eventos](#integração-com-eventos)
- [Exemplos de Uso](#exemplos-de-uso)
- [Troubleshooting](#troubleshooting)

---

## Visão Geral

O sistema de notificações permite enviar emails e SMS automáticos baseados em eventos do sistema, como:

- ✅ Novos pacientes cadastrados
- ✅ Agendamentos (criados, cancelados, lembretes)
- ✅ Pagamentos confirmados
- ✅ Relatórios semanais para admin
- ✅ Alertas de sistema

### Características

- **Singleton Pattern**: Uma única instância global do serviço
- **Configurável**: Habilitar/desabilitar tipos de notificação via admin UI
- **Templates Handlebars**: Templates HTML profissionais e responsivos
- **Logging Completo**: Todas as notificações são registradas no banco
- **Fallback Gracioso**: Falhas não interrompem o fluxo principal
- **Múltiplos Canais**: Email (implementado) + SMS (placeholder para futuro)

---

## Arquitetura

```
┌─────────────────────────────────────────────────┐
│            Event Triggers (Controllers)          │
│  createPatientLead, bookAppointment, etc.       │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         NotificationService (Singleton)          │
│                                                  │
│  - loadSettings()  (from DB)                    │
│  - sendNotification()                           │
│  - notifyNewPatient()                           │
│  - notifyAppointment()                          │
│  - notifyPayment()                              │
│  - sendWeeklyReport()                           │
│  - notifySystemAlert()                          │
└────────────┬───────────────┬────────────────────┘
             │               │
             ▼               ▼
    ┌────────────┐   ┌──────────────┐
    │  Email     │   │  SMS         │
    │  Service   │   │  (Future)    │
    └────────────┘   └──────────────┘
```

### Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `src/services/notificationService.js` | Serviço principal (singleton) |
| `src/routes/notificationRoutes.js` | API REST endpoints |
| `src/services/emailService.js` | Integração com nodemailer |
| `database/migrations/add_notification_email_templates.sql` | Templates de email |
| `src/controllers/patientController.js` | Exemplo de integração |

---

## Configuração

### 1. Variáveis de Ambiente (.env)

```env
# SMTP Configuration (obrigatório para emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app

# Email Headers
EMAIL_FROM_NAME=Atma Aligner
EMAIL_FROM_ADDRESS=noreply@atma.roilabs.com.br

# Admin Configuration
ADMIN_URL=https://atmaadmin.roilabs.com.br
```

### 2. Database Settings

As configurações de notificação são armazenadas na tabela `system_settings`:

```sql
-- Habilitar/desabilitar canais
INSERT INTO system_settings (setting_key, setting_value) VALUES
  ('notification_email', 'true'),    -- Habilita emails
  ('notification_sms', 'false');     -- Desabilita SMS

-- Habilitar/desabilitar tipos
INSERT INTO system_settings (setting_key, setting_value) VALUES
  ('notification_type_new_patients', 'true'),
  ('notification_type_appointments', 'true'),
  ('notification_type_payments', 'true'),
  ('notification_type_weekly_reports', 'true'),
  ('notification_type_system_alerts', 'true');

-- Email do administrador (destino das notificações)
INSERT INTO system_settings (setting_key, setting_value) VALUES
  ('admin_email', 'admin@atma.com.br');
```

### 3. Executar Migration dos Templates

```bash
cd Backend
mysql -u root -p atma_db < database/migrations/add_notification_email_templates.sql
```

Isto cria 7 templates de email:
- `new_patient`
- `appointment_scheduled`
- `appointment_cancelled`
- `appointment_reminder`
- `payment_confirmation`
- `weekly_report`
- `generic`

### 4. Recarregar Configurações

Após alterar as configurações no banco, recarregue via API:

```bash
curl -X POST http://localhost:3001/api/notifications/settings/reload
```

---

## Tipos de Notificações

### 1. New Patients (`newPatients`)

**Trigger**: Quando um novo paciente se cadastra

**Destinatário**: Email do admin (configurado em `system_settings.admin_email`)

**Template**: `new_patient`

**Dados**:
```javascript
{
  patientName: "João Silva",
  patientEmail: "joao@example.com",
  patientPhone: "(54) 99999-9999",
  registeredAt: "24/10/2025 10:30",
  dashboardLink: "https://atmaadmin.roilabs.com.br/admin/pacientes/123"
}
```

---

### 2. Appointments (`appointments`)

**Trigger**: Agendamento criado, cancelado, reagendado ou lembrete

**Destinatários**:
- Paciente (email do paciente)
- Admin (email do admin)

**Templates**:
- `appointment_scheduled`
- `appointment_cancelled`
- `appointment_reminder`

**Dados**:
```javascript
{
  patientName: "João Silva",
  orthodontistName: "Dr. Rafael Martins",
  appointmentDate: "25/10/2025",
  appointmentTime: "14:30",
  location: "Clínica Atma Passo Fundo",
  notes: "Trazer documentos"
}
```

---

### 3. Payments (`payments`)

**Trigger**: Pagamento confirmado

**Destinatários**:
- Paciente (recibo)
- Admin (notificação de receita)

**Template**: `payment_confirmation`

**Dados**:
```javascript
{
  patientName: "João Silva",
  amount: "R$ 5.990,00",
  paymentDate: "24/10/2025",
  paymentMethod: "Cartão de Crédito",
  transactionId: "TXN-123456789"
}
```

---

### 4. Weekly Reports (`weeklyReports`)

**Trigger**: Cron job semanal (domingo à noite)

**Destinatário**: Email do admin

**Template**: `weekly_report`

**Dados**:
```javascript
{
  period: "Últimos 7 dias",
  startDate: "17/10/2025",
  endDate: "24/10/2025",
  newPatients: 12,
  newAppointments: 8,
  revenue: "R$ 47.920,00",
  leadConversionRate: "65.5%"
}
```

---

### 5. System Alerts (`systemAlerts`)

**Trigger**: Erros críticos, falhas de sistema, etc.

**Destinatário**: Email do admin

**Template**: `generic`

**Dados**:
```javascript
{
  subject: "[ALERTA] Falha no Backup",
  message: "O backup automático das 03:00 falhou. Verificar logs."
}
```

---

## API Endpoints

Base URL: `http://localhost:3001/api/notifications`

### 1. Enviar Notificação Manual

**POST** `/send`

```bash
curl -X POST http://localhost:3001/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "systemAlerts",
    "to": "admin@atma.com.br",
    "subject": "Teste de Notificação",
    "message": "Esta é uma notificação de teste.",
    "priority": true
  }'
```

**Body Parameters**:
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `type` | string | Sim | `newPatients`, `appointments`, `payments`, `weeklyReports`, `systemAlerts` |
| `to` | string | Sim | Email ou telefone do destinatário |
| `subject` | string | Sim | Assunto da notificação |
| `message` | string | Não | Mensagem (usado com template `generic`) |
| `templateName` | string | Não | Nome do template (ex: `new_patient`) |
| `data` | object | Não | Dados para o template |
| `priority` | boolean | Não | Se `true`, envia imediatamente |

**Response**:
```json
{
  "success": true,
  "message": "Notificação enviada com sucesso",
  "results": {
    "email": { "success": true, "sentAt": "2025-10-24T10:30:00.000Z" },
    "sms": null
  }
}
```

---

### 2. Enviar Notificação de Teste

**POST** `/test`

```bash
curl -X POST http://localhost:3001/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "admin@atma.com.br",
    "type": "systemAlerts"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Notificação de teste enviada para admin@atma.com.br",
  "results": {
    "email": { "success": true, "sentAt": "2025-10-24T10:30:00.000Z" }
  }
}
```

---

### 3. Ver Histórico de Notificações

**GET** `/log?limit=50&offset=0&type=payments&status=sent`

```bash
curl http://localhost:3001/api/notifications/log?limit=20&type=payments
```

**Query Parameters**:
| Parâmetro | Padrão | Descrição |
|-----------|--------|-----------|
| `limit` | 50 | Número de registros (max: 200) |
| `offset` | 0 | Paginação |
| `type` | - | Filtrar por tipo de notificação |
| `status` | - | Filtrar por status (`sent`, `failed`, `pending`) |

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "notification_type": "payments",
      "recipient": "joao@example.com",
      "subject": "Pagamento Confirmado - R$ 5.990,00",
      "sent_at": "2025-10-24T10:30:00.000Z",
      "email_sent": 1,
      "sms_sent": 0,
      "status": "sent"
    }
  ],
  "pagination": {
    "total": 456,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 4. Ver Configurações Atuais

**GET** `/settings`

```bash
curl http://localhost:3001/api/notifications/settings
```

**Response**:
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
      "weeklyReports": false,
      "systemAlerts": true
    }
  }
}
```

---

### 5. Recarregar Configurações

**POST** `/settings/reload`

```bash
curl -X POST http://localhost:3001/api/notifications/settings/reload
```

Força o reload das configurações do banco de dados.

---

### 6. Enviar Relatório Semanal Manualmente

**POST** `/weekly-report`

```bash
curl -X POST http://localhost:3001/api/notifications/weekly-report
```

---

### 7. Ver Estatísticas de Notificações

**GET** `/stats?period=7`

```bash
curl http://localhost:3001/api/notifications/stats?period=30
```

**Response**:
```json
{
  "success": true,
  "period": "Últimos 30 dias",
  "byType": [
    { "notification_type": "payments", "total": 45, "sent": 43, "failed": 2, "email_sent": 43, "sms_sent": 0 },
    { "notification_type": "newPatients", "total": 12, "sent": 12, "failed": 0, "email_sent": 12, "sms_sent": 0 }
  ],
  "total": {
    "total": 57,
    "sent": 55,
    "failed": 2
  }
}
```

---

## Templates de Email

Todos os templates usam **Handlebars** para variáveis dinâmicas.

### Estrutura de um Template

```sql
INSERT INTO email_templates (
  template_name,      -- ID único (ex: 'new_patient')
  name,               -- Nome legível
  subject,            -- Assunto (com variáveis {{...}})
  html_content,       -- HTML completo responsivo
  text_content,       -- Versão texto puro
  variables,          -- JSON array das variáveis
  is_active,          -- true/false
  created_at,
  updated_at
) VALUES (...)
```

### Variáveis Handlebars

```handlebars
<!-- Variável simples -->
<p>Olá {{patientName}},</p>

<!-- Condicional -->
{{#if notes}}
  <p>Observações: {{notes}}</p>
{{/if}}

<!-- Loop (não usado atualmente, mas disponível) -->
{{#each items}}
  <li>{{this.name}}</li>
{{/each}}
```

### Customizar Templates

Para customizar um template, edite diretamente no banco:

```sql
UPDATE email_templates
SET html_content = '<html>...',
    text_content = '...',
    updated_at = NOW()
WHERE template_name = 'new_patient';
```

Depois, recarregue:

```bash
curl -X POST http://localhost:3001/api/notifications/settings/reload
```

---

## Integração com Eventos

### Exemplo: Notificar Novo Paciente

**Arquivo**: `src/controllers/patientController.js`

```javascript
const notificationService = require('../services/notificationService');

const createPatientLead = async (req, res, next) => {
  try {
    const { nome, email, telefone } = req.body;

    // ... código de criação do paciente ...
    const leadId = result.insertId;

    // Notificar admin sobre novo paciente
    try {
      await notificationService.notifyNewPatient({
        id: leadId,
        name: nome,
        email,
        phone: telefone
      });
    } catch (error) {
      logger.error('Erro ao enviar notificação:', error.message);
      // Não falha o processo se a notificação falhar
    }

    res.status(201).json({ success: true, ... });
  } catch (error) {
    next(error);
  }
};
```

### Exemplo: Notificar Agendamento

```javascript
// Criar agendamento
const appointment = await createAppointment(data);

// Notificar paciente e admin
await notificationService.notifyAppointment(appointment, 'scheduled');
```

### Exemplo: Lembrete de Consulta (Cron Job)

```javascript
// cron: todos os dias às 09:00
cron.schedule('0 9 * * *', async () => {
  // Buscar consultas agendadas para amanhã
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await getAppointmentsForDate(tomorrow);

  for (const appointment of appointments) {
    await notificationService.notifyAppointment(appointment, 'reminder');
  }
});
```

---

## Exemplos de Uso

### 1. Enviar Notificação de Novo Paciente Programaticamente

```javascript
const notificationService = require('./services/notificationService');

await notificationService.notifyNewPatient({
  id: 123,
  name: "João Silva",
  email: "joao@example.com",
  phone: "(54) 99999-9999"
});
```

---

### 2. Enviar Alerta de Sistema

```javascript
await notificationService.notifySystemAlert({
  title: "Erro no Backup",
  message: "O backup automático falhou às 03:00. Verificar logs urgentemente."
});
```

---

### 3. Testar Configuração de Email

```javascript
const result = await notificationService.sendTestNotification(
  'seu-email@example.com',
  'systemAlerts'
);

if (result.success) {
  console.log('Email de teste enviado com sucesso!');
} else {
  console.error('Falha:', result.error || result.reason);
}
```

---

### 4. Verificar se um Tipo Está Habilitado

```javascript
const isEnabled = notificationService.settings.types.newPatients;

if (isEnabled) {
  await notificationService.notifyNewPatient(patient);
}
```

---

## Troubleshooting

### Problema: Notificações não estão sendo enviadas

**Diagnóstico**:

1. Verificar se o tipo de notificação está habilitado:
```bash
curl http://localhost:3001/api/notifications/settings
```

2. Verificar configuração SMTP no `.env`:
```bash
# Testar SMTP manualmente
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify().then(console.log).catch(console.error);
"
```

3. Verificar logs do backend:
```bash
tail -f backend.log | grep "notification"
```

---

### Problema: Templates não estão sendo carregados

**Solução**:

1. Verificar se a migration foi executada:
```sql
SELECT COUNT(*) FROM email_templates
WHERE template_name IN ('new_patient', 'appointment_scheduled', 'payment_confirmation');
```

Deve retornar `3` ou mais.

2. Recarregar templates:
```bash
curl -X POST http://localhost:3001/api/notifications/settings/reload
```

---

### Problema: Variáveis não aparecem no email

**Causa**: Variável com nome incorreto no template ou dados.

**Solução**:

1. Verificar quais variáveis o template espera:
```sql
SELECT template_name, variables
FROM email_templates
WHERE template_name = 'new_patient';
```

2. Certificar que os dados passados têm **exatamente** os mesmos nomes:
```javascript
// ✅ CORRETO
await notificationService.sendNotification({
  templateName: 'new_patient',
  data: {
    patientName: "João",  // Igual ao template
    patientEmail: "joao@example.com"
  }
});

// ❌ ERRADO
await notificationService.sendNotification({
  templateName: 'new_patient',
  data: {
    name: "João",  // Nome diferente!
    email: "joao@example.com"
  }
});
```

---

### Problema: Email cai no spam

**Soluções**:

1. **SPF Record**: Adicionar registro SPF no DNS:
```
TXT @ "v=spf1 include:_spf.google.com ~all"
```

2. **DKIM**: Configurar DKIM no provedor de email

3. **DMARC**: Adicionar política DMARC:
```
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@atma.com.br"
```

4. **Evitar palavras de spam** no assunto:
   - ❌ "URGENTE!!!", "GRÁTIS", "CLIQUE AQUI"
   - ✅ "Consulta Agendada", "Pagamento Confirmado"

---

### Problema: Muitas notificações / spam para admin

**Solução**: Desabilitar tipos específicos no admin UI ou via SQL:

```sql
UPDATE system_settings
SET setting_value = 'false'
WHERE setting_key = 'notification_type_new_patients';
```

Depois:
```bash
curl -X POST http://localhost:3001/api/notifications/settings/reload
```

---

## Logs e Monitoramento

### Ver últimas 50 notificações enviadas

```bash
curl "http://localhost:3001/api/notifications/log?limit=50&status=sent"
```

### Ver notificações que falharam

```bash
curl "http://localhost:3001/api/notifications/log?status=failed"
```

### Estatísticas dos últimos 7 dias

```bash
curl "http://localhost:3001/api/notifications/stats?period=7"
```

### Logs do backend

```bash
grep "notification" backend.log
```

---

## Próximos Passos (Roadmap)

- [ ] **SMS Integration**: Implementar integração com Twilio/AWS SNS
- [ ] **Webhooks**: Permitir notificações via webhook para integrações externas
- [ ] **Rate Limiting**: Limitar frequência de notificações (anti-spam)
- [ ] **Scheduled Notifications**: Agendar notificações para envio futuro
- [ ] **Templates Drag-and-Drop**: Editor visual de templates no admin UI
- [ ] **A/B Testing**: Testar diferentes versões de templates
- [ ] **Analytics**: Rastrear taxa de abertura e cliques
- [ ] **Multi-language**: Suporte a múltiplos idiomas

---

## Suporte

Para dúvidas ou problemas:

1. Verificar esta documentação
2. Verificar logs do backend
3. Testar com endpoint `/test`
4. Entrar em contato com o time de desenvolvimento

---

**Última atualização**: 24/10/2025
**Versão**: 1.0.0
**Autor**: Sistema Atma - ROI Labs
