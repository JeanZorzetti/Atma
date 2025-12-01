# Configuração do Webhook do Clerk

Este guia explica como configurar o webhook do Clerk para sincronizar usuários automaticamente com o banco de dados MySQL.

## O que o Webhook Faz?

O webhook sincroniza automaticamente os usuários do Clerk com a tabela `portal_users` no MySQL:

- ✅ **user.created**: Quando um novo usuário se registra, cria registro em `portal_users` e `portal_preferencias`
- ✅ **user.updated**: Quando dados do usuário são atualizados (nome, email, foto), atualiza `portal_users`
- ✅ **user.deleted**: Quando usuário é deletado, remove de `portal_users` (CASCADE remove relatórios, acessos, etc.)

## Passo a Passo

### 1. Acessar Dashboard do Clerk

1. Acesse: https://dashboard.clerk.com/
2. Selecione sua aplicação: **profound-eagle-7**
3. No menu lateral, vá em **Webhooks**

### 2. Criar Novo Webhook

1. Clique em **+ Add Endpoint**
2. **Endpoint URL**:
   - **Desenvolvimento**: `http://localhost:3002/api/webhooks/clerk`
   - **Produção**: `https://atma.roilabs.com.br/api/webhooks/clerk`

3. **Descrição**: "Sincronização de usuários com MySQL"

### 3. Selecionar Eventos

Marque os seguintes eventos:

- [x] `user.created`
- [x] `user.updated`
- [x] `user.deleted`

### 4. Copiar o Webhook Secret

Após criar o webhook, o Clerk vai gerar um **Signing Secret**. Copie esse valor.

Exemplo: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 5. Adicionar ao `.env.local`

Abra o arquivo `Frontend/.env.local` e adicione:

```env
# Webhook do Clerk
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANTE**: Substitua `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` pelo secret real do Clerk.

### 6. Reiniciar o Servidor

```bash
cd Frontend
npm run dev
```

### 7. Testar o Webhook

#### Opção A: Teste via Dashboard do Clerk

1. No Clerk Dashboard → Webhooks → Seu webhook
2. Clique em **Testing**
3. Selecione o evento `user.created`
4. Clique em **Send Example**
5. Verifique os logs no terminal do Next.js

Você deve ver:

```
📨 Webhook recebido: user.created
👤 Criando usuário: user_xxxxx
✅ Usuário criado no banco: 1
✅ Preferências criadas para usuário: 1
```

#### Opção B: Teste Real (Criar Novo Usuário)

1. Abra uma aba anônima
2. Acesse: http://localhost:3002/portal/cadastro
3. Crie uma nova conta de teste
4. Após criar, verifique o banco de dados:

```sql
SELECT * FROM portal_users ORDER BY created_at DESC LIMIT 1;
```

Você deve ver o novo usuário criado!

### 8. Verificar no Banco de Dados

```sql
-- Ver todos os usuários sincronizados
SELECT
  id,
  clerk_user_id,
  email,
  nome,
  created_at
FROM portal_users
ORDER BY created_at DESC;

-- Ver preferências criadas automaticamente
SELECT
  p.id,
  u.nome,
  u.email,
  p.notificacoes_email,
  p.idioma
FROM portal_preferencias p
INNER JOIN portal_users u ON p.user_id = u.id;
```

## Troubleshooting

### Erro: "Webhook secret não configurado"

**Solução**: Verifique se `CLERK_WEBHOOK_SECRET` está no `.env.local` e reinicie o servidor.

### Erro: "Headers do webhook ausentes"

**Solução**: O Clerk envia headers especiais (`svix-id`, `svix-timestamp`, `svix-signature`). Certifique-se de que está usando a URL correta do webhook.

### Erro: "Erro ao verificar webhook"

**Solução**: O secret está incorreto. Copie novamente do Clerk Dashboard.

### Usuário não aparece no banco após cadastro

**Solução**:

1. Verifique os logs do servidor Next.js
2. Verifique se o webhook está ativo no Clerk Dashboard
3. Teste manualmente enviando um evento de teste
4. Verifique se a conexão MySQL está funcionando:

```bash
cd Frontend
npm run db:migrate
```

## Produção

Para produção, você precisa:

1. **Criar webhook separado** no Clerk para produção
2. **URL de produção**: `https://atma.roilabs.com.br/api/webhooks/clerk`
3. **Adicionar secret ao Vercel**:
   - Acesse: https://vercel.com/ → Settings → Environment Variables
   - Nome: `CLERK_WEBHOOK_SECRET`
   - Valor: `whsec_xxxxxxxxx` (secret de produção)
   - Ambiente: **Production**

## Segurança

✅ **O webhook é seguro porque**:

- Usa verificação criptográfica (Svix)
- Apenas requests assinados pelo Clerk são aceitos
- Headers especiais (`svix-signature`) garantem autenticidade
- Secret é armazenado de forma segura em variáveis de ambiente

## Estrutura de Dados

### Evento `user.created`

```json
{
  "type": "user.created",
  "data": {
    "id": "user_2xxxxxxxxxxxxx",
    "email_addresses": [
      { "email_address": "usuario@exemplo.com" }
    ],
    "first_name": "João",
    "last_name": "Silva",
    "phone_numbers": [
      { "phone_number": "+5511999999999" }
    ],
    "image_url": "https://img.clerk.com/...",
    "created_at": 1234567890
  }
}
```

### O que é criado no banco:

**Tabela `portal_users`**:

- `clerk_user_id`: "user_2xxxxxxxxxxxxx"
- `email`: "usuario@exemplo.com"
- `nome`: "João Silva"
- `telefone`: "+5511999999999"
- `foto_url`: "https://img.clerk.com/..."

**Tabela `portal_preferencias`** (valores padrão):

- `user_id`: ID gerado no MySQL
- `notificacoes_email`: true
- `idioma`: "pt-BR"
- `timezone`: "America/Sao_Paulo"

## Próximos Passos

Após configurar o webhook:

1. ✅ Usuários são sincronizados automaticamente
2. ✅ Dashboard busca dados reais do banco
3. ⏭️ Próximo: Criar relatórios de viabilidade para os usuários

## Referências

- [Clerk Webhooks Documentation](https://clerk.com/docs/integrations/webhooks)
- [Svix Webhook Security](https://www.svix.com/docs/)
- [Código do webhook](Frontend/app/api/webhooks/clerk/route.ts)
