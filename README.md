# Atma Aligner - Sistema Completo

Sistema completo de ortodontia digital com frontend público, painel administrativo e API backend.

## 🏗️ Arquitetura

```
Atma/
├── Frontend/        # Site público (Next.js) - Porta 3000
├── admin/          # Painel administrativo (Next.js) - Porta 3002  
├── Backend/        # API REST (Express.js) - Porta 3001
└── package.json    # Scripts para gerenciar todos os serviços
```

## 🚀 Início Rápido

### Instalação

```bash
# Instalar dependências de todos os projetos
npm run install:all

# Ou instalar individualmente
cd Backend && npm install
cd Frontend && npm install  
cd admin && npm install
```

### Desenvolvimento

```bash
# Iniciar todos os serviços simultaneamente
npm run dev

# Ou iniciar individualmente
npm run dev:backend    # API na porta 3001
npm run dev:frontend   # Site na porta 3000
npm run dev:admin      # Admin na porta 3002
```

### URLs de Desenvolvimento

- **Site público**: http://localhost:3000
- **API Backend**: http://localhost:3001
- **Painel Admin**: http://localhost:3002
- **Health Check**: http://localhost:3001/health

## 📦 Deploy com Docker

### Preparação
```bash
# Build da imagem Docker do backend
npm run docker:build

# Iniciar serviços com Docker Compose (Backend + MySQL)
npm run docker:up

# Parar serviços
npm run docker:down
```

### Deploy no EasyPanel
Consulte o arquivo `Backend/DEPLOY.md` para instruções detalhadas.

## 🔧 Configuração

### Variáveis de Ambiente

**Backend (.env)**
```bash
# Copiar do exemplo
cp Backend/.env.example Backend/.env
# Configurar credenciais do banco e SMTP
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
```

**Admin (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-here
```

## 🗄️ Banco de Dados

O sistema usa MySQL. Execute os scripts em ordem:

```bash
# 1. Criar estrutura
mysql -u root -p < Backend/database/schema.sql

# 2. Inserir dados iniciais
mysql -u root -p < Backend/database/seed.sql
```

## 📋 Funcionalidades

### Site Público (Frontend)
- ✅ Landing page responsiva
- ✅ Páginas para pacientes e ortodontistas
- ✅ Formulários de contato integrados com API
- ✅ Busca de ortodontistas por região
- ✅ FAQ e informações sobre tratamentos

### Painel Admin
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gerenciamento de pacientes
- ✅ Gerenciamento de ortodontistas  
- ✅ Sistema de relatórios
- ✅ Configurações do sistema

### API Backend
- ✅ API REST com Express.js
- ✅ Endpoints para pacientes e ortodontistas
- ✅ Sistema de emails automatizado
- ✅ Validação de CEP
- ✅ Rate limiting e segurança
- ✅ Logs estruturados
- ✅ Health check

## 🔄 Integração entre Sistemas

Os três sistemas se comunicam através da API:

```
Frontend → API Backend ← Admin
    ↓           ↓         ↓
  Porta 3000  Porta 3001  Porta 3002
```

- **Frontend**: Envia leads de pacientes e solicitações de parceria
- **Admin**: Gerencia dados e visualiza estatísticas  
- **Backend**: Centraliza dados e lógica de negócio

## 🧪 Testando a Integração

1. Inicie todos os serviços: `npm run dev`
2. Acesse http://localhost:3002 (admin)
3. Verifique se aparece "Backend conectado" no dashboard
4. Teste formulários no frontend (http://localhost:3000)
5. Verifique se dados aparecem no admin

## 📝 Scripts Disponíveis

```bash
npm run dev           # Inicia todos em desenvolvimento
npm run build         # Build de produção
npm run start         # Inicia todos em produção
npm run install:all   # Instala dependências
npm run docker:build  # Build Docker do backend
npm run docker:up     # Sobe backend + MySQL
```

## 🔒 Segurança

- ✅ Rate limiting na API
- ✅ Validação de dados de entrada
- ✅ Headers de segurança (Helmet.js)
- ✅ CORS configurado
- ✅ Logs de auditoria
- ✅ Container Docker com usuário não-root

## 📊 Monitoramento

- Health check em `/health`
- Logs estruturados com Winston
- Métricas de sistema no admin
- Dashboard de estatísticas em tempo real