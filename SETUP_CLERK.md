# 🔐 Setup do Clerk - Autenticação do Portal do Paciente

Este guia explica como configurar a autenticação do Portal do Paciente Atma usando Clerk.

## 📋 Pré-requisitos

- Node.js instalado
- Conta no Clerk (gratuita)

## 🚀 Passo a Passo

### 1. Criar Conta no Clerk

1. Acesse [https://clerk.com](https://clerk.com)
2. Clique em **Sign Up** (ou **Get Started Free**)
3. Crie sua conta (pode usar GitHub, Google ou email)

### 2. Criar Aplicação

1. No dashboard do Clerk, clique em **+ Create Application**
2. Preencha:
   - **Application name**: `Atma Portal do Paciente`
   - **Sign-in options**: Marque pelo menos `Email` e `Google` (recomendado)
3. Clique em **Create Application**

### 3. Obter as Chaves de API

Após criar a aplicação, você verá uma tela com suas chaves:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Configurar Variáveis de Ambiente

1. Abra o arquivo `Frontend/.env.local`
2. Substitua as chaves do Clerk pelas suas chaves reais:

```env
# Clerk - Autenticação do Portal do Paciente
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_COLE_SUA_CHAVE_AQUI
CLERK_SECRET_KEY=sk_test_COLE_SUA_CHAVE_AQUI

# URLs de autenticação (já configuradas)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/portal/entrar
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/portal/cadastro
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/portal
```

### 5. Configurar URLs no Dashboard do Clerk

No dashboard do Clerk:

1. Vá em **Configure** → **Paths**
2. Configure:
   - **Sign-in page path**: `/portal/entrar`
   - **Sign-up page path**: `/portal/cadastro`
   - **After sign-in URL**: `/portal`
   - **After sign-up URL**: `/portal`

### 6. Configurar Opções de Login

No dashboard do Clerk:

1. Vá em **User & Authentication** → **Email, Phone, Username**
2. Ative as opções desejadas:
   - ✅ **Email address** (obrigatório)
   - ✅ **Require email verification** (recomendado)
   - ⚠️ **Phone number** (opcional, mas aumenta segurança)

3. Vá em **User & Authentication** → **Social Connections**
4. Ative provedores desejados:
   - ✅ **Google** (altamente recomendado - login rápido)
   - ✅ **Facebook** (opcional)
   - ⚠️ **Apple** (opcional - requer Apple Developer Account)

### 7. Personalizar Aparência (Opcional)

No dashboard do Clerk:

1. Vá em **Customization** → **Theme**
2. Personalize cores para combinar com a marca Atma:
   - **Primary color**: `#2563EB` (azul Atma)
   - **Logo**: Upload do logo Atma

### 8. Testar a Autenticação

1. Inicie o servidor de desenvolvimento:
   ```bash
   cd Frontend
   npm run dev
   ```

2. Acesse no navegador:
   - **Cadastro**: http://localhost:3002/portal/cadastro
   - **Login**: http://localhost:3002/portal/entrar
   - **Dashboard**: http://localhost:3002/portal

3. Crie uma conta de teste e verifique se:
   - ✅ Consegue criar conta
   - ✅ Recebe email de verificação
   - ✅ Consegue fazer login
   - ✅ É redirecionado para `/portal` após login
   - ✅ Consegue fazer logout

## 🔒 Segurança e Boas Práticas

### ✅ O Que Está Configurado

- [x] Middleware protegendo rotas `/portal/*`
- [x] Redirecionamento automático para login se não autenticado
- [x] Localização em português (ptBR)
- [x] Layout responsivo (mobile + desktop)

### 🚨 Importante

1. **NUNCA** commite as chaves secretas no Git
2. As chaves `pk_test_*` e `sk_test_*` são para **TESTE** apenas
3. Para produção, use chaves de produção (`pk_live_*` e `sk_live_*`)

### 📧 Emails Transacionais

O Clerk envia automaticamente:
- ✉️ Email de verificação ao criar conta
- ✉️ Email de recuperação de senha
- ✉️ Email de login mágico (magic link)

**Produção**: Configure domínio customizado em **Configure** → **Email & SMS**

## 🎨 Customizações Avançadas

### Adicionar Campos Personalizados

Se precisar coletar mais informações do usuário (CPF, telefone, data de nascimento):

1. No Clerk Dashboard: **User & Authentication** → **Metadata**
2. Adicione campos no `user.publicMetadata` ou `user.privateMetadata`
3. Acesse no código:
   ```typescript
   const user = await currentUser()
   const cpf = user?.publicMetadata?.cpf
   ```

### Webhooks (Sincronizar com Banco de Dados)

Para salvar usuários no seu banco MySQL quando se cadastrarem:

1. No Clerk Dashboard: **Configure** → **Webhooks**
2. Crie endpoint: `https://seu-dominio.com/api/webhooks/clerk`
3. Selecione evento: `user.created`
4. No código, crie rota API para receber webhook

## 📱 Rotas Disponíveis

| Rota | Descrição | Protegida? |
|------|-----------|------------|
| `/portal/entrar` | Página de login | ❌ Pública |
| `/portal/cadastro` | Página de cadastro | ❌ Pública |
| `/portal` | Dashboard principal | ✅ Protegida |
| `/portal/analise` | Análise do caso | ✅ Protegida |
| `/portal/financeiro` | Plano financeiro | ✅ Protegida |
| `/portal/timeline` | Timeline do tratamento | ✅ Protegida |
| `/portal/downloads` | Downloads e PDFs | ✅ Protegida |

## 🆘 Troubleshooting

### Erro: "Clerk: Missing publishable key"

**Solução**: Verifique se copiou corretamente a chave `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` no `.env.local`

### Erro: "Unauthorized"

**Solução**:
1. Verifique se a `CLERK_SECRET_KEY` está correta
2. Reinicie o servidor (`npm run dev`)

### Redirecionamento não funciona

**Solução**:
1. Confirme as URLs no dashboard do Clerk
2. Verifique se as URLs em `.env.local` batem com as do dashboard

### Emails não estão chegando

**Solução**:
1. Verifique pasta de spam
2. Em desenvolvimento, o Clerk usa emails de teste (sem verificação real)
3. Em produção, configure domínio próprio no Clerk

## 📚 Recursos

- [Documentação Oficial do Clerk](https://clerk.com/docs)
- [Clerk + Next.js App Router](https://clerk.com/docs/quickstarts/nextjs)
- [Componentes do Clerk](https://clerk.com/docs/components/overview)
- [API Reference](https://clerk.com/docs/references/nextjs/overview)

## ✅ Checklist de Produção

Antes de lançar em produção:

- [ ] Trocar chaves de teste por chaves de produção
- [ ] Configurar domínio customizado para emails
- [ ] Ativar verificação de email obrigatória
- [ ] Configurar webhooks para sincronizar usuários
- [ ] Testar fluxo completo em produção
- [ ] Adicionar Google Analytics para tracking de conversão
- [ ] Configurar rate limiting (Clerk faz automaticamente)

---

**Data de criação**: 2025-12-01
**Versão**: 1.0
**Status**: ✅ Configuração inicial completa
