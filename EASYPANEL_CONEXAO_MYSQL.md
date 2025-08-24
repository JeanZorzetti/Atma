# Guia de Conexão MySQL no EasyPanel - Atma Aligner

## 🎯 Informações Identificadas

Com base na análise do screenshot e configurações existentes, identifiquei:

### 📊 Dados do MySQL no EasyPanel:
- **Serviço MySQL**: `dados_atmadb`
- **Usuário**: `atmadb`
- **Senha**: `PAzol8**` (valor censurado na imagem)
- **Database**: `atmadb`
- **Host Interno**: `dados_atmadb`
- **Porta**: `3306`

## 🔧 Configuração no EasyPanel

### Passo 1: Configurar Variáveis de Ambiente no Backend

No painel do EasyPanel, vá até sua aplicação backend e configure essas variáveis de ambiente:

```bash
# Servidor
PORT=3001
NODE_ENV=production

# Banco MySQL - ATENÇÃO: Use o host interno!
DB_HOST=dados_atmadb
DB_PORT=3306
DB_USER=atmadb
DB_PASSWORD=PAzol8**
DB_NAME=atmadb

# Segurança
JWT_SECRET=AtmaAligner2024_EasyPanel_SuperSecure_JWT_Key!#@$%^&*()
JWT_EXPIRE=24h

# CORS
ALLOWED_ORIGINS=https://roilabs.com.br,https://www.roilabs.com.br,https://atmaadmin.roilabs.com.br,https://atmaapi.roilabs.com.br

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Passo 2: Verificar Conexão Interna

✅ **IMPORTANTE**: No EasyPanel, as aplicações se comunicam via nomes de serviços internos
- Use `dados_atmadb` como DB_HOST (não `localhost` ou IP externo)
- A porta permanece `3306`
- As aplicações dentro do EasyPanel podem se comunicar diretamente

### Passo 3: Deploy e Teste

1. **Salvar configurações** no EasyPanel
2. **Restart da aplicação** para carregar novas variáveis
3. **Testar endpoints**:
   - `https://atmaapi.roilabs.com.br/health`
   - `https://atmaapi.roilabs.com.br/api/system/stats`

## 🧪 Executar Migrações

Após o backend conectar, execute via terminal no EasyPanel ou localmente:

```bash
# Conectar ao banco e criar estrutura
npm run db:migrate

# Inserir dados iniciais
npm run db:seed

# Testar conexão
npm run db:test
```

## 🔍 Troubleshooting

### Se a conexão falhar:

1. **Verificar logs** no EasyPanel → Aplicação → Logs
2. **Confirmar variáveis** estão corretas
3. **Verificar se MySQL está rodando**
4. **Testar com senha real** (se PAzol8** não for a senha completa)

### Comandos de teste:

```bash
# Via backend (se tiver acesso ao terminal)
npm run db:test

# Verificar tabelas criadas
npm run db:migrate
```

### Logs esperados:
```
✅ Conexão com o banco de dados estabelecida com sucesso
📊 Tabelas no banco de dados: patient_leads, orthodontist_partnerships, ...
```

## 🚨 Pontos Críticos

1. **Host Interno**: Use sempre `dados_atmadb`, não `localhost`
2. **Senha Real**: A senha na imagem estava censurada, use a senha real
3. **Restart**: Sempre restart a aplicação após mudar env vars
4. **Network**: EasyPanel gerencia a rede interna automaticamente

## 📋 Checklist Final

- [ ] Variáveis configuradas no EasyPanel
- [ ] Backend reiniciado
- [ ] Endpoint `/health` retorna status 200
- [ ] Migrações executadas com sucesso
- [ ] Dados de teste inseridos
- [ ] API funcionando corretamente

## 🎯 URLs Finais

- **API Health**: https://atmaapi.roilabs.com.br/health
- **Sistema Stats**: https://atmaapi.roilabs.com.br/api/system/stats
- **Frontend**: https://roilabs.com.br
- **Admin**: https://atmaadmin.roilabs.com.br

## 💡 Dica Important
Se você não tem a senha real do MySQL (censurada na imagem), acesse o painel do EasyPanel → Services → dados_atmadb → Connection → Show Password para ver a senha completa.