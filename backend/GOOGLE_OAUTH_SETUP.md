# Google OAuth 2.0 Setup for Search Console API

Este guia explica como configurar as credenciais do Google para integração com o Search Console.

## Passo 1: Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Clique em **Select a project** > **New Project**
3. Nome do projeto: `Atma Search Console Integration`
4. Clique em **Create**

## Passo 2: Habilitar Google Search Console API

1. No projeto criado, vá em **APIs & Services** > **Library**
2. Pesquise por "Google Search Console API"
3. Clique em **Enable**

## Passo 3: Criar Credenciais OAuth 2.0

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS** > **OAuth client ID**

### 3.1 Configurar OAuth Consent Screen (se necessário)

Se aparecer mensagem para configurar o consent screen:

1. Clique em **CONFIGURE CONSENT SCREEN**
2. Escolha **External** (ou Internal se for Google Workspace)
3. Preencha os campos obrigatórios:
   - **App name**: Atma Aligner Admin
   - **User support email**: atma.roilabs@gmail.com
   - **Developer contact**: atma.roilabs@gmail.com
4. Clique em **SAVE AND CONTINUE**
5. Em **Scopes**, clique **ADD OR REMOVE SCOPES** e adicione:
   - `https://www.googleapis.com/auth/webmasters.readonly`
6. Clique em **SAVE AND CONTINUE**
7. Em **Test users**, adicione o email da conta Google que tem acesso ao Search Console
8. Clique em **SAVE AND CONTINUE**

### 3.2 Criar OAuth Client ID

1. Volte para **Credentials** > **+ CREATE CREDENTIALS** > **OAuth client ID**
2. **Application type**: Web application
3. **Name**: Atma Backend OAuth Client
4. **Authorized redirect URIs**:
   - Desenvolvimento: `http://localhost:3001/api/search-console/auth/callback`
   - Produção: `https://atmaapi.roilabs.com.br/api/search-console/auth/callback`
5. Clique em **CREATE**

### 3.3 Copiar Credenciais

Após criar, você verá:
- **Client ID**: `xxxxxxxxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxx`

**Copie esses valores!**

## Passo 4: Configurar .env

Edite o arquivo `Backend/.env` e substitua os valores:

```bash
# Google OAuth 2.0 Credentials (Search Console API)
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_REDIRECT_URI=http://localhost:3001/api/search-console/auth/callback

# Admin Panel URL (para redirects OAuth)
ADMIN_URL=http://localhost:3000/admin
```

**Em produção**, altere para:

```bash
GOOGLE_REDIRECT_URI=https://atmaapi.roilabs.com.br/api/search-console/auth/callback
ADMIN_URL=https://atmaadmin.roilabs.com.br/admin
```

## Passo 5: Verificar Propriedade no Search Console

1. Acesse: https://search.google.com/search-console
2. Adicione a propriedade: `https://atma.roilabs.com.br`
3. Verifique a propriedade (via DNS ou HTML)
4. Certifique-se de que a conta Google que autenticará tem acesso de **Owner** ou **Full User**

## Passo 6: Testar Autenticação

### 6.1 Iniciar o Backend

```bash
cd Backend
npm start
```

### 6.2 Obter URL de Autorização

```bash
curl http://localhost:3001/api/search-console/auth/url
```

Resposta esperada:
```json
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Redirect user to this URL to authorize Google Search Console access"
}
```

### 6.3 Autorizar no Browser

1. Copie o `authUrl` da resposta
2. Cole no navegador
3. Faça login com a conta Google que tem acesso ao Search Console
4. Aceite as permissões solicitadas
5. Você será redirecionado para o admin panel com `?auth=success`

### 6.4 Verificar Status de Autenticação

```bash
curl http://localhost:3001/api/search-console/auth/status
```

Resposta esperada:
```json
{
  "success": true,
  "authenticated": true,
  "expiresAt": "2025-11-07T15:30:00.000Z",
  "message": "Authenticated with Google Search Console"
}
```

## Troubleshooting

### Erro: "redirect_uri_mismatch"

**Causa**: A URI de callback não está registrada no Google Cloud Console

**Solução**:
1. Vá em **Google Cloud Console** > **Credentials**
2. Edite o OAuth Client ID criado
3. Adicione a URI exata em **Authorized redirect URIs**
4. Certifique-se de que o `.env` usa a mesma URI

### Erro: "invalid_client"

**Causa**: Client ID ou Client Secret incorretos

**Solução**:
1. Verifique os valores no `.env`
2. Copie novamente do Google Cloud Console
3. Reinicie o servidor Backend

### Erro: "access_denied"

**Causa**: Usuário não autorizou ou não tem permissão

**Solução**:
1. Certifique-se de aceitar as permissões na tela de consentimento
2. Verifique se a conta Google tem acesso ao Search Console
3. Verifique se o email está nos **Test users** (se app estiver em modo Testing)

### Erro: "Error: Cannot find module 'googleapis'"

**Causa**: Dependências não instaladas

**Solução**:
```bash
cd Backend
npm install googleapis@129.0.0
```

## Próximos Passos

Após a autenticação funcionar:

1. ✅ **FASE 1 COMPLETA** - OAuth configurado
2. ⏳ **FASE 2** - Implementar GoogleSearchConsoleService
3. ⏳ **FASE 3** - Criar Dashboard SEO no admin panel

## URLs Úteis

- **Google Cloud Console**: https://console.cloud.google.com/
- **Search Console**: https://search.google.com/search-console
- **API Library**: https://console.cloud.google.com/apis/library
- **Credentials**: https://console.cloud.google.com/apis/credentials
- **OAuth Consent**: https://console.cloud.google.com/apis/credentials/consent

## Segurança

⚠️ **IMPORTANTE**:
- NUNCA comite credenciais no Git
- `.env` já está no `.gitignore`
- Em produção, use variáveis de ambiente seguras (Railway, Vercel, etc.)
- Revogue tokens imediatamente se expostos: `DELETE /api/search-console/auth/revoke`
