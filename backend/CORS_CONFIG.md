# 🔧 Configuração CORS - EasyPanel

## 🚨 Problema Atual:
```
Access to fetch at 'https://atmaapi.roilabs.com.br/api/system/stats' 
from origin 'https://atmaadmin.roilabs.com.br' has been blocked by CORS policy
```

## ✅ Solução: Environment Variables no EasyPanel

### Variáveis Obrigatórias:
```bash
# CORS - Permite acesso do admin
ALLOWED_ORIGINS=https://roilabs.com.br,https://www.roilabs.com.br,https://atmaadmin.roilabs.com.br

# Servidor
PORT=3001
NODE_ENV=production

# Database
DB_HOST=atma-mysql
DB_PORT=3306
DB_USER=atma_user
DB_PASSWORD=AtmaUser2024!Strong#
DB_NAME=atma_aligner

# Segurança
JWT_SECRET=AtmaJWT2024!SuperSecureKey#9876
JWT_EXPIRE=24h
```

## 🔍 Verificar Backend:

### 1. Status no EasyPanel:
- Aplicação deve estar "Running" (verde)
- Logs não devem mostrar erros críticos

### 2. Testar URLs:
```bash
# Health Check
curl https://atmaapi.roilabs.com.br/health

# API Stats  
curl https://atmaapi.roilabs.com.br/api/system/stats
```

### 3. Resposta Esperada:
```json
{
  "status": "OK",
  "timestamp": "2025-08-21T...",
  "version": "1.0.0",
  "environment": "production"
}
```

## 🚨 Troubleshooting:

### Erro 502 Bad Gateway:
1. ✅ Backend container parou
2. ✅ Erro na inicialização (ver logs)
3. ✅ Environment variables incorretas
4. ✅ Banco de dados não conecta

### CORS Ainda Bloqueado:
1. ✅ ALLOWED_ORIGINS não configurado
2. ✅ Domínio com typo
3. ✅ Precisa redeploy após configurar

## 📋 Passos no EasyPanel:

1. **Applications** → **Sua App Backend**
2. **Environment Variables** → Adicionar/Editar
3. **ALLOWED_ORIGINS** = `https://roilabs.com.br,https://www.roilabs.com.br,https://atmaadmin.roilabs.com.br`
4. **Deploy** → Restart Application
5. **Logs** → Verificar startup
6. **Teste**: https://atmaapi.roilabs.com.br/health