# 🚨 Troubleshooting Guide - Sistema Atma Aligner

## 🔍 Problemas Identificados (24/08/2025)

### 1. ❌ Backend API Offline (502 Bad Gateway)
**Problema**: `https://atmaapi.roilabs.com.br` retornando 502 Bad Gateway
**Causa**: Serviço não está rodando no EasyPanel ou há problema de deploy

#### ✅ Solução Imediata:
1. **Verificar EasyPanel**:
   - Login no EasyPanel
   - Ir em Applications → Atma Backend
   - Verificar status (deve estar "Running")
   - Se não estiver, clicar em "Start"

2. **Verificar Logs**:
   - Na aplicação, ir em "Logs"
   - Procurar por erros de inicialização
   - Erros comuns:
     - Database connection failed
     - Missing environment variables
     - Port already in use

3. **Verificar Environment Variables**:
   ```bash
   PORT=3001
   NODE_ENV=production
   DB_HOST=seu_mysql_host
   DB_PORT=3306
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=atma_aligner
   JWT_SECRET=sua_chave_jwt
   ALLOWED_ORIGINS=https://roilabs.com.br,https://www.roilabs.com.br,https://atmaadmin.roilabs.com.br
   ```

### 2. 🌐 Erros CORS Solucionados
**Status**: ✅ Configuração CORS melhorada no backend

#### Melhorias implementadas:
- ✅ Headers CORS explícitos adicionados
- ✅ Tratamento de preflight OPTIONS requests
- ✅ Logging detalhado para debug
- ✅ Suporte aprimorado para subdomínios Vercel

### 3. 🗄️ Endpoint /patients/leads Melhorado
**Status**: ✅ Tratamento de erros robusto implementado

#### Melhorias:
- ✅ Detecção de erros de conectividade
- ✅ Respostas adequadas para serviço indisponível
- ✅ Fallback para problemas de banco
- ✅ Logging detalhado para debugging

## 🔄 Como Resolver o Problema Principal

### Passo 1: Restartar Backend no EasyPanel
1. Acesse o EasyPanel
2. Applications → Atma Backend
3. Stop → Start
4. Aguarde 30-60 segundos
5. Teste: `curl https://atmaapi.roilabs.com.br/health`

### Passo 2: Verificar Banco de Dados
Se o health check mostrar problema de DB:
1. Verificar se o MySQL está rodando
2. Testar conexão manualmente
3. Verificar credenciais nas env vars
4. Se necessário, restart do MySQL também

### Passo 3: Deploy das Correções CORS
Se o backend estiver rodando mas com CORS:
1. Fazer push do código atualizado
2. Redeploy no EasyPanel
3. Aguardar deploy completar
4. Testar CORS: 
   ```bash
   curl -H "Origin: https://atmaadmin.roilabs.com.br" https://atmaapi.roilabs.com.br/health -I
   ```

## 🧪 Comandos de Teste

### Teste 1: Backend Online
```bash
curl https://atmaapi.roilabs.com.br/health
# Deve retornar: {"status":"OK",...}
```

### Teste 2: CORS Headers
```bash
curl -H "Origin: https://atmaadmin.roilabs.com.br" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://atmaapi.roilabs.com.br/health -v
```
Deve mostrar headers `Access-Control-Allow-*`

### Teste 3: API Endpoints
```bash
# System stats
curl https://atmaapi.roilabs.com.br/api/system/stats

# Patients (pode precisar de auth)
curl https://atmaapi.roilabs.com.br/api/patients/leads?page=1&limit=5
```

### Teste 4: Admin Dashboard
1. Acesse: https://atmaadmin.roilabs.com.br
2. Abra Dev Tools → Network
3. Recarregue a página
4. Verifique se requests para API retornam 200
5. Não deve haver erros CORS no console

## 📝 Logs Úteis

### Backend Logs (EasyPanel)
Procurar por:
- `🚀 Servidor rodando na porta 3001`
- `✅ Conexão com banco de dados OK`
- `📡 Request recebido` (para requests)
- `❌ CORS blocked` (para problemas CORS)

### Admin Logs (Browser)
Console deve mostrar:
- API calls sucessful
- Dados carregando no dashboard
- SEM erros CORS

## 🆘 Se Nada Funcionar

### Cenário 1: Backend não inicia
1. Verificar todas env vars no EasyPanel
2. Verificar se MySQL está acessível
3. Ver logs completos no EasyPanel
4. Se necessário, redeploy from scratch

### Cenário 2: CORS ainda bloqueado
1. Verificar se ALLOWED_ORIGINS inclui domínio exato
2. Verificar se não há conflito entre middlewares
3. Testar com curl primeiro
4. Verificar cache do browser

### Cenário 3: Database errors
1. Health check direto: `/health`
2. Verificar se tabelas existem
3. Rodar migration se necessário
4. Verificar permissões do usuário DB

## 📞 Contato

Se os problemas persistirem:
1. Capturar logs completos do EasyPanel
2. Screenshot dos erros no browser console
3. Resultado dos comandos de teste
4. Environment variables (sem senhas)