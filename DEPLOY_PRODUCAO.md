# 🚀 Deploy Produção - ROI Labs

## 🌐 URLs Configuradas

- **Frontend**: https://roilabs.com.br
- **Admin**: https://atmaadmin.roilabs.com.br  
- **Backend API**: https://atmaapi.roilabs.com.br

## 📋 Checklist de Deploy

### 1. ✅ Backend (EasyPanel) 
**URL**: https://atmaapi.roilabs.com.br

#### Environment Variables no EasyPanel:
```bash
PORT=3001
NODE_ENV=production

# Database (configure com seus dados MySQL)
DB_HOST=atma-mysql
DB_PORT=3306
DB_USER=atma_user
DB_PASSWORD=AtmaUser2024!Strong#
DB_NAME=atma_aligner

# Security
JWT_SECRET=AtmaJWT2024!SuperSecureKey#9876
JWT_EXPIRE=24h

# CORS - IMPORTANTE: URLs corretas
ALLOWED_ORIGINS=https://roilabs.com.br,https://www.roilabs.com.br,https://atmaadmin.roilabs.com.br

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@roilabs.com.br
SMTP_PASS=SUA_SENHA_APP_GMAIL

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Teste Backend:
- ✅ https://atmaapi.roilabs.com.br/health
- ✅ https://atmaapi.roilabs.com.br/api/system/stats

### 2. ✅ Admin (Vercel)
**URL**: https://atmaadmin.roilabs.com.br

#### Environment Variables no Vercel:
```bash
NEXT_PUBLIC_API_URL=https://atmaapi.roilabs.com.br/api
NEXT_PUBLIC_FRONTEND_URL=https://roilabs.com.br
NEXTAUTH_URL=https://atmaadmin.roilabs.com.br
NEXTAUTH_SECRET=AtmaAdmin2024!NextAuth#Secret
```

#### Configuração no Vercel:
1. **Project Settings** → **Environment Variables**
2. Adicionar as variáveis acima
3. **Domains** → Adicionar `atmaadmin.roilabs.com.br`
4. Redeploy

### 3. ✅ Frontend (A ser configurado)
**URL**: https://roilabs.com.br

#### Environment Variables:
```bash
NEXT_PUBLIC_API_URL=https://atmaapi.roilabs.com.br/api
NEXT_PUBLIC_ADMIN_URL=https://atmaadmin.roilabs.com.br
```

## 🔄 Fluxo de Conexão

```
Frontend (roilabs.com.br) 
    ↓ API calls
Backend (atmaapi.roilabs.com.br)
    ↑ Admin access  
Admin (atmaadmin.roilabs.com.br)
```

## 🧪 Testes de Integração

### 1. Backend Health Check
```bash
curl https://atmaapi.roilabs.com.br/health
```
**Resposta esperada**: `{"status":"OK",...}`

### 2. Admin Dashboard
1. Acesse: https://atmaadmin.roilabs.com.br
2. Verifique indicador "Backend conectado"
3. Dashboard deve carregar estatísticas

### 3. CORS Test
```javascript
// No console do admin
fetch('https://atmaapi.roilabs.com.br/api/system/stats')
  .then(r => r.json())
  .then(console.log)
```

## 🚨 Solução de Problemas

### Admin não conecta ao Backend
1. ✅ Verificar CORS: `ALLOWED_ORIGINS` inclui `atmaadmin.roilabs.com.br`
2. ✅ Verificar URL: `NEXT_PUBLIC_API_URL=https://atmaapi.roilabs.com.br/api`
3. ✅ Backend rodando: https://atmaapi.roilabs.com.br/health

### Frontend não carrega dados
1. ✅ Verificar URL da API no Frontend
2. ✅ Verificar CORS inclui `roilabs.com.br`
3. ✅ Testar endpoints da API diretamente

## 🔐 Configurações de Segurança

### HTTPS
- ✅ Todos domínios devem usar HTTPS
- ✅ Cookies secure em produção
- ✅ CORS restrito aos domínios corretos

### Headers de Segurança
O backend já inclui:
- ✅ Helmet.js
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Body size limits

## 📊 Monitoramento

### URLs de Monitoramento:
- **Backend Health**: https://atmaapi.roilabs.com.br/health
- **API Stats**: https://atmaapi.roilabs.com.br/api/system/stats
- **Admin Dashboard**: https://atmaadmin.roilabs.com.br

### Logs:
- **EasyPanel**: Logs do backend
- **Vercel**: Logs do admin
- **Browser Console**: Erros de CORS/API

## ✅ Deploy Final

1. **EasyPanel**: Redeploy backend com env vars atualizadas
2. **Vercel**: Redeploy admin com domínio personalizado
3. **Teste**: Verificar comunicação entre sistemas
4. **DNS**: Configurar apontamentos dos domínios

## 🎯 Próximos Passos

1. Configurar SSL/TLS nos domínios
2. Configurar monitoramento/alertas
3. Backup do banco de dados
4. Configuração de email produção
5. Analytics e métricas