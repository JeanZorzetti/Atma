# Documentação da API - Atma Aligner Backend

## Visão Geral

Esta API foi desenvolvida para gerenciar leads de pacientes e parcerias com ortodontistas para a Atma Aligner. O sistema inclui funcionalidades de distribuição automática de leads, emails transacionais e dashboard administrativo.

**Base URL:** `http://localhost:3001/api`

## Autenticação

Atualmente a API não requer autenticação para os endpoints públicos de formulários. Endpoints administrativos podem ser protegidos conforme necessário.

## Rate Limiting

- **Geral:** 100 requests por 15 minutos por IP
- **Formulários:** 3 submissões por 15 minutos por IP  
- **Autenticação:** 5 tentativas por 15 minutos por IP

## Formato de Resposta

Todas as respostas seguem o padrão:

```json
{
  "success": true|false,
  "data": {
    // dados da resposta
  },
  "error": {
    "message": "Mensagem de erro",
    "details": [] // opcional
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 👥 Endpoints de Pacientes

### POST /api/patients/leads
Criar novo lead de paciente.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cep": "01310-100",
  "consentimento": true
}
```

**Validações:**
- `nome`: 2-255 caracteres, apenas letras e espaços
- `email`: formato de email válido
- `telefone`: formato brasileiro (11) 99999-9999
- `cep`: formato 12345-678 ou nome da cidade
- `consentimento`: deve ser true

**Resposta 201:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "message": "Solicitação recebida com sucesso!",
    "proximosPassos": [
      "Você receberá um contato em até 24 horas",
      "Agendamento da consulta de avaliação",
      "Análise do seu caso específico",
      "Apresentação do plano de tratamento personalizado"
    ],
    "lead": {
      "id": 123,
      "nome": "João Silva",
      "status": "atribuido",
      "ortodontista_nome": "Dr. João Santos",
      "ortodontista_clinica": "Clínica OdontoExcelência"
    }
  }
}
```

**Erros:**
- `409`: Email já possui solicitação ativa
- `400`: Dados inválidos

---

### GET /api/patients/leads
Listar leads de pacientes (admin).

**Query Parameters:**
- `page`: Página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `status`: Filtrar por status (novo, atribuido, contatado, agendado, convertido, cancelado)
- `ortodontista_id`: Filtrar por ortodontista
- `data_inicio`: Data início (YYYY-MM-DD)
- `data_fim`: Data fim (YYYY-MM-DD)
- `search`: Buscar por nome, email ou telefone

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": 123,
        "nome": "João Silva",
        "email": "joao@email.com",
        "telefone": "(11) 99999-9999",
        "cep": "01310-100",
        "status": "atribuido",
        "ortodontista_nome": "Dr. João Santos",
        "ortodontista_clinica": "Clínica OdontoExcelência",
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 95,
      "items_per_page": 20,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

### PUT /api/patients/leads/:id/status
Atualizar status do lead.

**Body:**
```json
{
  "status": "contatado",
  "observacoes": "Paciente interessado, agendou consulta"
}
```

**Status válidos:**
- `novo`, `atribuido`, `contatado`, `agendado`, `convertido`, `cancelado`

---

### GET /api/patients/stats
Estatísticas de leads.

**Query Parameters:**
- `periodo`: Período em dias (padrão: 30)

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "resumo": {
      "total_leads": 150,
      "taxa_atribuicao": "85.3",
      "periodo_dias": 30
    },
    "leads_por_status": [
      {"status": "novo", "count": 25},
      {"status": "atribuido", "count": 60},
      {"status": "contatado", "count": 40}
    ],
    "leads_por_dia": [
      {"data": "2024-01-15", "count": 8}
    ],
    "top_ortodontistas": [
      {
        "nome": "Dr. João Santos",
        "clinica": "Clínica OdontoExcelência",
        "total_leads": 25
      }
    ]
  }
}
```

---

## 🦷 Endpoints de Ortodontistas

### POST /api/orthodontists/partnerships
Criar solicitação de parceria.

**Body:**
```json
{
  "nome": "Dr. João Silva",
  "clinica": "Clínica Odontológica Silva",
  "cro": "CRO-SP 12345",
  "email": "dr.joao@clinica.com.br",
  "telefone": "(11) 99999-9999",
  "consultórios": "2-3",
  "scanner": "sim",
  "scannerMarca": "iTero Element",
  "casosmes": "6-10",
  "interesse": "atma-aligner",
  "mensagem": "Mensagem opcional"
}
```

**Validações:**
- `cro`: Formato CRO-XX 12345
- `consultórios`: "1", "2-3", "4-5", "6+"
- `scanner`: "sim", "nao"
- `casosmes`: "1-5", "6-10", "11-20", "21+"
- `interesse`: "atma-aligner", "atma-labs", "ambos"

**Resposta 201:**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "message": "Solicitação de parceria recebida com sucesso!",
    "proximosPassos": [
      "Análise do perfil da sua clínica",
      "Apresentação personalizada dos modelos de parceria",
      "Demonstração da tecnologia e software",
      "Proposta comercial customizada",
      "Suporte completo para implementação"
    ]
  }
}
```

---

### GET /api/orthodontists/partnerships
Listar solicitações de parceria.

**Query Parameters:**
- `page`, `limit`: Paginação
- `status`: novo, analisando, proposta-enviada, negociacao, fechado, rejeitado
- `interesse`: atma-aligner, atma-labs, ambos
- `search`: Buscar por nome, clínica, email ou CRO

---

### GET /api/orthodontists/active
Listar ortodontistas ativos (parceiros).

**Query Parameters:**
- `modelo_parceria`: atma-aligner, atma-labs
- `cidade`, `estado`: Filtrar por localização

---

### GET /api/orthodontists/search
Buscar ortodontistas por localização.

**Query Parameters:**
- `cep`: CEP para busca
- `cidade`: Nome da cidade
- `estado`: Sigla do estado (2 letras)
- `distancia`: Distância em km (padrão: 50)

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "orthodontists": [
      {
        "id": 1,
        "nome": "Dr. João Santos",
        "clinica": "Clínica OdontoExcelência",
        "cidade": "São Paulo",
        "estado": "SP",
        "modelo_parceria": "atma-aligner",
        "tem_scanner": true,
        "capacidade_mensal": 15
      }
    ],
    "total_encontrados": 1,
    "criterios_busca": {
      "cep": "01310-100",
      "distancia": 50
    }
  }
}
```

---

## 📧 Endpoints de Email

### GET /api/emails/logs
Buscar logs de emails enviados.

**Query Parameters:**
- `page`, `limit`: Paginação
- `status`: enviado, falhado, pendente
- `template_name`: Nome do template
- `search`: Buscar por email ou assunto

---

### POST /api/emails/test
Testar configuração de email.

**Body:**
```json
{
  "email": "test@example.com" // opcional
}
```

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "message": "Email de teste enviado com sucesso",
    "destinatario": "test@example.com",
    "resultado": {
      "messageId": "<123@smtp.gmail.com>",
      "response": "250 OK"
    }
  }
}
```

---

### GET /api/emails/templates
Listar templates de email disponíveis.

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": 1,
        "name": "patient_lead_confirmation",
        "subject": "Recebemos sua solicitação - Atma Align",
        "description": "Confirmação para pacientes que solicitaram contato",
        "variables": ["nome", "email", "telefone"],
        "is_active": true
      }
    ]
  }
}
```

---

### POST /api/emails/send
Enviar email customizado.

**Body:**
```json
{
  "to": "destinatario@email.com",
  "template_name": "patient_lead_confirmation",
  "data": {
    "nome": "João Silva",
    "email": "joao@email.com"
  },
  "priority": "normal"
}
```

---

## ⚙️ Endpoints do Sistema

### GET /api/system/health
Health check detalhado.

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0.0",
    "environment": "development",
    "uptime": 3600,
    "checks": {
      "database": {
        "status": "OK",
        "message": "Conectado"
      },
      "email": {
        "status": "OK",
        "message": "Configurado e conectado"
      },
      "memory": {
        "status": "OK",
        "message": "Heap usado: 85MB",
        "usage": {
          "heapUsed": 85,
          "heapTotal": 120
        }
      }
    }
  }
}
```

---

### GET /api/system/stats
Estatísticas gerais do sistema.

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "resumo": {
      "leads": {
        "total_leads": 150,
        "leads_novos": 25,
        "leads_convertidos": 45
      },
      "parcerias": {
        "total_parcerias": 30,
        "parcerias_novas": 5,
        "parcerias_fechadas": 12
      },
      "ortodontistas_ativos": 25,
      "emails": {
        "total_emails": 500,
        "emails_enviados": 485
      }
    },
    "avisos_capacidade": [
      {
        "nome": "Dr. João Santos",
        "utilizacao_percentual": 95.0,
        "leads_atribuidos": 19,
        "capacidade_mensal": 20
      }
    ]
  }
}
```

---

### POST /api/system/maintenance
Executar tarefas de manutenção.

**Body:**
```json
{
  "tasks": [
    "clean_expired_cache",
    "rebalance_leads",
    "cleanup_old_logs"
  ]
}
```

**Tarefas disponíveis:**
- `clean_expired_cache`: Limpar cache expirado
- `rebalance_leads`: Rebalancear distribuição de leads
- `cleanup_old_logs`: Limpar logs antigos (>90 dias)
- `refresh_email_templates`: Recarregar templates
- `check_capacity_warnings`: Verificar avisos de capacidade

---

## Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Dados inválidos ou malformados
- `404`: Recurso não encontrado
- `409`: Conflito (ex: email duplicado)
- `429`: Rate limit excedido
- `500`: Erro interno do servidor
- `503`: Serviço indisponível

---

## Exemplos de Integração

### Frontend - Formulário de Paciente

```javascript
const submitPatientForm = async (formData) => {
  try {
    const response = await fetch('/api/patients/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Mostrar tela de sucesso
      showSuccessScreen(result.data);
    } else {
      // Mostrar erro
      showErrorMessage(result.error.message);
    }
  } catch (error) {
    console.error('Erro na submissão:', error);
  }
};
```

### Frontend - Formulário de Ortodontista

```javascript
const submitPartnershipForm = async (formData) => {
  try {
    const response = await fetch('/api/orthodontists/partnerships', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Redirecionar para tela de sucesso
      window.location.href = '/ortodontistas/sucesso';
    } else {
      // Mostrar erros de validação
      handleValidationErrors(result.error.details);
    }
  } catch (error) {
    console.error('Erro na submissão:', error);
  }
};
```

---

## Tratamento de Erros

### Erros de Validação (400)

```json
{
  "success": false,
  "error": {
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email deve ter formato válido",
        "value": "email-invalido"
      },
      {
        "field": "telefone",
        "message": "Telefone deve ter formato válido (ex: (11) 99999-9999)",
        "value": "123456"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Rate Limit (429)

```json
{
  "error": "Muitas tentativas realizadas. Tente novamente mais tarde.",
  "retryAfter": 900
}
```

### Erro Interno (500)

```json
{
  "success": false,
  "error": {
    "message": "Erro interno do servidor"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```