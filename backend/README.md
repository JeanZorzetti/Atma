# Atma Aligner Backend API

Backend API para o site da Atma Aligner - Ortodontia Digital. Este sistema gerencia leads de pacientes, parcerias com ortodontistas, emails automáticos e distribuição inteligente de leads.

## 🚀 Funcionalidades

### Para Pacientes
- ✅ Formulário de solicitação "Encontre um Doutor"
- ✅ Atribuição automática de ortodontista baseada em localização
- ✅ Email de confirmação automático
- ✅ Sistema de acompanhamento de status

### Para Ortodontistas
- ✅ Formulário de solicitação de parceria (4 etapas)
- ✅ Gestão de ortodontistas parceiros
- ✅ Distribuição inteligente de leads por capacidade
- ✅ Notificações automáticas de novos leads

### Sistema de Emails
- ✅ Templates personalizáveis com Handlebars
- ✅ Emails transacionais automáticos
- ✅ Logs e estatísticas de envio
- ✅ Sistema de notificações

### Administrativo
- ✅ Dashboard com estatísticas
- ✅ Gestão de configurações do sistema
- ✅ Health check e monitoramento
- ✅ Tarefas de manutenção automática

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- MySQL >= 8.0
- SMTP configurado (Gmail, SendGrid, etc.)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd atma-aligner-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Crie o banco de dados MySQL
mysql -u root -p
CREATE DATABASE atma_aligner CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Execute o schema
mysql -u root -p atma_aligner < database/schema.sql
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

5. **Crie a estrutura de diretórios**
```bash
mkdir -p logs uploads
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=atma_aligner

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@atmaaligner.com.br
SMTP_PASS=sua_senha_de_app

# Configurações de segurança
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=http://localhost:3000,https://atmaaligner.com.br
```

### Templates de Email

O sistema inclui templates padrão para:
- `patient_lead_confirmation` - Confirmação para pacientes
- `orthodontist_partnership_confirmation` - Confirmação para ortodontistas
- `new_lead_notification` - Notificação de novo lead

## 🚀 Uso

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

### Testes
```bash
npm test
```

### Lint
```bash
npm run lint
```

## 📡 API Endpoints

### Pacientes
```
POST   /api/patients/leads           # Criar lead de paciente
GET    /api/patients/leads           # Listar leads
GET    /api/patients/leads/:id       # Buscar lead específico
PUT    /api/patients/leads/:id/status # Atualizar status
GET    /api/patients/stats           # Estatísticas
```

### Ortodontistas
```
POST   /api/orthodontists/partnerships        # Criar solicitação de parceria
GET    /api/orthodontists/partnerships        # Listar solicitações
GET    /api/orthodontists/partnerships/:id    # Buscar solicitação
PUT    /api/orthodontists/partnerships/:id/status # Atualizar status
GET    /api/orthodontists/active              # Ortodontistas ativos
GET    /api/orthodontists/search              # Buscar por localização
GET    /api/orthodontists/stats               # Estatísticas
```

### Emails
```
GET    /api/emails/logs              # Logs de emails
POST   /api/emails/test              # Testar configuração
GET    /api/emails/templates         # Listar templates
POST   /api/emails/templates/reload  # Recarregar templates
GET    /api/emails/stats             # Estatísticas
```

### Sistema
```
GET    /api/system/settings          # Configurações
PUT    /api/system/settings          # Atualizar configuração
GET    /api/system/health            # Health check
GET    /api/system/stats             # Estatísticas gerais
POST   /api/system/maintenance       # Executar manutenção
```

## 📊 Monitoramento

### Health Check
```bash
curl http://localhost:3001/health
```

### Logs
Os logs são salvos em:
- `logs/app.log` - Logs gerais
- `logs/error.log` - Apenas erros
- `logs/exceptions.log` - Exceções não tratadas

### Estatísticas
- Taxa de conversão de leads
- Performance de ortodontistas
- Estatísticas de emails
- Uso de recursos do sistema

## 🔧 Manutenção

### Tarefas Automáticas
```bash
# Executar todas as tarefas de manutenção
curl -X POST http://localhost:3001/api/system/maintenance

# Executar tarefas específicas
curl -X POST http://localhost:3001/api/system/maintenance \
  -H "Content-Type: application/json" \
  -d '{"tasks": ["clean_expired_cache", "rebalance_leads"]}'
```

### Backup do Banco de Dados
```bash
mysqldump -u root -p atma_aligner > backup_$(date +%Y%m%d).sql
```

## 🛡️ Segurança

- ✅ Rate limiting configurável
- ✅ Validação de entrada com express-validator
- ✅ Headers de segurança com Helmet
- ✅ Logs detalhados de segurança
- ✅ Sanitização de dados

## 📈 Performance

- ✅ Cache de CEPs com expiração
- ✅ Compressão GZIP
- ✅ Pool de conexões MySQL
- ✅ Rate limiting inteligente

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de conexão com banco:**
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Verificar configurações no .env
```

**Emails não são enviados:**
```bash
# Testar configuração SMTP
curl -X POST http://localhost:3001/api/emails/test
```

**Rate limit muito restritivo:**
```bash
# Ajustar no .env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

## 📝 Estrutura do Projeto

```
src/
├── config/           # Configurações (banco, etc.)
├── controllers/      # Controladores da API
├── middleware/       # Middlewares (auth, validation, etc.)
├── routes/           # Rotas da API
├── services/         # Serviços (email, CEP, etc.)
├── utils/            # Utilitários (logger, etc.)
└── server.js         # Arquivo principal

database/
└── schema.sql        # Schema do banco de dados

logs/                 # Logs da aplicação
uploads/              # Arquivos enviados
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte técnico, entre em contato:
- Email: dev@atmaaligner.com.br
- Documentação: [docs.atmaaligner.com.br](https://docs.atmaaligner.com.br)