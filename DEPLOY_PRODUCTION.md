# 🚀 Deploy em Produção - Portal do Paciente

## ❌ Problema Atual

Erro: `GET https://clerk.atma.roilabs.com.br/npm/@clerk/clerk-js@5/dist/clerk.browser.js net::ERR_NAME_NOT_RESOLVED`

**Causa**: O Clerk está tentando usar um subdomínio customizado que não foi configurado.

## ✅ Solução Rápida

### Opção 1: Usar domínio padrão do Clerk (Recomendado para teste)

1. Acesse: https://dashboard.clerk.com
2. Vá em **Configure** → **Domains**
3. **Remova** qualquer domínio customizado se tiver
4. Use o domínio padrão fornecido pelo Clerk (ex: `profound-eagle-7.clerk.accounts.dev`)

### Opção 2: Configurar subdomínio customizado (Para produção final)

Se quiser usar `clerk.atma.roilabs.com.br`:

1. **No seu DNS (onde está o domínio atma.roilabs.com.br)**:
   - Crie um registro CNAME:
   - Nome: `clerk`
   - Valor: `clerk.clerk.com` (ou o valor fornecido pelo Clerk)

2. **No Dashboard do Clerk**:
   - Vá em **Configure** → **Domains**
   - Clique em **Add domain**
   - Digite: `clerk.atma.roilabs.com.br`
   - Aguarde propagação DNS (5-30 minutos)

## 🔧 Configuração Completa para Produção

### Passo 1: Configurar Variáveis na Vercel

Acesse: https://vercel.com/seu-projeto/settings/environment-variables

Adicione estas variáveis (se ainda não tiver):

```env
# Clerk - Autenticação
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJvZm91bmQtZWFnbGUtNy5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_SZFUztCCuoE4YllzNfxwiuSoL03kWQFk8L0U4Z3NDI

# URLs de autenticação
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/portal/entrar
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/portal/cadastro
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/portal

# Outras variáveis do sistema
MERCADOPAGO_ACCESS_TOKEN=APP_USR-4457823026267557-112712-aaa3398796833ff8f3212546354502a5-3020352786
RESEND_API_KEY=re_TVthPAVn_3xuU1RpxRGCo8or9LnyTE2VR
MYSQL_HOST=31.97.23.166
MYSQL_PORT=3306
MYSQL_USER=atmadb
MYSQL_PASSWORD=atma2024
MYSQL_DATABASE=atmadb
CRON_SECRET=atma-cron-secret-2025-followup-emails
NEXT_PUBLIC_URL=https://atma.roilabs.com.br
```

**⚠️ Importante**: Após adicionar, clique em **Redeploy** para aplicar as variáveis.

### Passo 2: Configurar URLs no Clerk

Acesse: https://dashboard.clerk.com

#### 2.1 Paths (Rotas)

Vá em **Configure** → **Paths**:

- **Sign-in page path**: `/portal/entrar`
- **Sign-up page path**: `/portal/cadastro`
- **After sign-in URL**: `https://atma.roilabs.com.br/portal`
- **After sign-up URL**: `https://atma.roilabs.com.br/portal`

#### 2.2 Allowed Origins (Origens Permitidas)

Vá em **Configure** → **Settings** → **Allowed origins**:

Adicione:
- `https://atma.roilabs.com.br`
- `http://localhost:3006` (para desenvolvimento)

#### 2.3 Domains (Domínios)

**Opção A - Usar domínio padrão (Recomendado para iniciar)**:
- Não adicione nenhum domínio customizado
- Use o domínio fornecido pelo Clerk

**Opção B - Domínio customizado (Opcional)**:
- Apenas se você configurou o CNAME no DNS
- Adicione: `clerk.atma.roilabs.com.br`

### Passo 3: Redeploy na Vercel

1. Acesse: https://vercel.com/seu-projeto
2. Clique em **Deployments**
3. Nos 3 pontinhos do último deploy, clique em **Redeploy**
4. Aguarde 1-2 minutos

### Passo 4: Limpar Cache do Navegador

1. Abra o site: https://atma.roilabs.com.br/portal
2. Pressione: `Ctrl + Shift + R` (ou `Cmd + Shift + R` no Mac)
3. Ou limpe o cache manualmente:
   - Chrome: F12 → Application → Clear storage
   - Firefox: F12 → Storage → Clear all

## 🧪 Testar

Após configurar:

1. Acesse: https://atma.roilabs.com.br/portal
2. Deve redirecionar para: https://atma.roilabs.com.br/portal/entrar
3. Crie uma conta de teste
4. Verifique se o dashboard aparece
5. **Não deve haver** erros de `ERR_NAME_NOT_RESOLVED`

## 🐛 Troubleshooting

### Erro: "Clerk: Missing publishable key"

**Solução**: Adicione a variável `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` na Vercel e redeploy

### Erro: "ERR_NAME_NOT_RESOLVED" persiste

**Solução**:
1. Verifique se a variável está com o prefixo `NEXT_PUBLIC_`
2. Faça um redeploy completo na Vercel
3. Limpe o cache do navegador
4. Se usar domínio customizado, remova temporariamente

### Erro: "Unauthorized"

**Solução**:
1. Verifique se `CLERK_SECRET_KEY` está correta
2. Verifique se as origens permitidas estão configuradas no Clerk

### Erro: "Too many redirects"

**Solução**:
1. Verifique se as URLs de redirecionamento estão corretas
2. Certifique-se de que `/portal/entrar` e `/portal/cadastro` estão nas rotas públicas do middleware

## 📊 Checklist Final

Antes de considerar o deploy completo:

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Redeploy feito após adicionar variáveis
- [ ] URLs configuradas no Clerk dashboard
- [ ] Origens permitidas adicionadas no Clerk
- [ ] Site testado sem erros 404 ou DNS
- [ ] Login e cadastro funcionando
- [ ] Dashboard aparecendo após login
- [ ] Cache do navegador limpo ao testar

## 🎯 Status Atual

**Data**: 2025-12-01
**Status**: ⚠️ Deploy parcial (erro de DNS do Clerk)
**Próximo passo**: Configurar domínios no Clerk conforme opções acima

---

## 📝 Notas

### Chaves de Teste vs Produção

**Atualmente usando**: Chaves de teste (`pk_test_*` e `sk_test_*`)

**Para produção real** (quando lançar oficialmente):
1. No Clerk, mude para Production mode
2. Copie as novas chaves `pk_live_*` e `sk_live_*`
3. Atualize na Vercel
4. Redeploy

**Limitações das chaves de teste**:
- ⚠️ Limite de usuários ativos
- ⚠️ Mensagem de desenvolvimento aparece no console
- ⚠️ Não recomendado para uso com clientes reais

**Vantagens das chaves de teste**:
- ✅ Gratuito para testar
- ✅ Funcionalidade completa
- ✅ Perfeito para desenvolvimento e homologação

---

**Criado em**: 2025-12-01
**Última atualização**: 2025-12-01
