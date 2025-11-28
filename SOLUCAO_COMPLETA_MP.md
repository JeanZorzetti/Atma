# 🎯 Solução Completa: Testar Mercado Pago sem Cobrar Dinheiro Real

## 📚 O Que Aprendi da Documentação Oficial

Após estudar a documentação do Mercado Pago, descobri as limitações e a solução correta:

### ⚠️ Problema Identificado

**Por que as credenciais de TESTE não funcionam em produção (HTTPS)?**

Segundo a documentação oficial:
- ✅ **Credenciais de TESTE**: Funcionam apenas em ambiente de desenvolvimento
- ✅ **HTTPS é OBRIGATÓRIO em produção**: "Para garantir uma integração segura, é necessário implementar um certificado SSL e disponibilizar a forma de pagamento em uma página web que utilize o protocolo HTTPS"
- ❌ **Credenciais de TESTE em HTTPS**: O Mercado Pago bloqueia credenciais de teste quando detecta ambiente de produção (HTTPS)

**Erro que você está vendo:**
```
"Uma das partes com as quais você está tentando efetuar o pagamento é de teste"
```

Isso acontece porque:
1. Seu site está em HTTPS (produção): `https://atma.roilabs.com.br`
2. Você está usando credenciais de TESTE
3. O Mercado Pago detecta a incompatibilidade e bloqueia

---

## ✅ Solução: Usar Usuários de Teste com Credenciais de PRODUÇÃO

A forma CORRETA de testar sem cobrar dinheiro real é:

### 1️⃣ Criar Usuários de Teste

O Mercado Pago permite criar **usuários fictícios** que simulam compras reais:

**Como criar:**

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação
3. Vá em **"Contas de teste"**
4. Clique em **"+ Criar conta de teste"**

**Criar 2 usuários:**

**Usuário 1 - Vendedor:**
- País: Brasil
- Descrição: "Vendedor - Atma"
- Tipo: Vendedor
- Saldo: R$ 1.000 (fictício)

**Usuário 2 - Comprador:**
- País: Brasil
- Descrição: "Comprador - Teste"
- Tipo: Comprador
- Saldo: R$ 1.000 (fictício)

### 2️⃣ Usar Credenciais do Usuário Vendedor

Após criar o usuário vendedor de teste:
1. Acesse as **credenciais de PRODUÇÃO** desse usuário de teste
2. Copie o **Access Token de PRODUÇÃO**
3. Atualize no Vercel: `MERCADOPAGO_ACCESS_TOKEN`

### 3️⃣ Fazer Compra com Usuário Comprador

1. Faça login no Mercado Pago com o **usuário comprador de teste**
2. Acesse seu site: `https://atma.roilabs.com.br/infoproduto/relatorio-viabilidade`
3. Complete a compra usando a conta do usuário comprador
4. O dinheiro é FICTÍCIO - não sai de nenhuma conta real

---

## 🎯 Alternativa Mais Simples (Recomendada)

Se não quiser criar usuários de teste, você pode:

### Usar suas Próprias Credenciais de PRODUÇÃO + Pix

1. **Obtenha suas credenciais de PRODUÇÃO**:
   - Acesse: https://www.mercadopago.com.br/developers/panel/app
   - Mude para **PRODUÇÃO**
   - Ative as credenciais (se ainda não ativou)
   - Copie o Access Token

2. **Atualize no Vercel**:
   ```
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxx (PRODUÇÃO)
   ```

3. **Faça um teste real**:
   - Use seu próprio email
   - Escolha Pix (R$ 47)
   - Pague com Pix
   - Teste o fluxo completo
   - **O dinheiro ficará na sua conta Mercado Pago** (não é "perdido")

4. **Valide**:
   ✅ Checkout funcionou
   ✅ Pagamento aprovado
   ✅ Email com PDF recebido
   ✅ Sistema validado

5. **Estorne (opcional)**:
   - Se quiser, pode estornar o pagamento no painel do Mercado Pago
   - Ou deixar como primeiro faturamento do produto

---

## 📊 Comparação das Opções

| Método | Vantagens | Desvantagens |
|--------|-----------|--------------|
| **Usuários de Teste** | Não gasta dinheiro real | Complexo de configurar |
| **Pix R$ 47** | Simples e rápido | Gasta R$ 47 (mas fica na sua conta) |
| **Ngrok + TEST** | Mantém credenciais TEST | Requer instalação e configuração |

---

## 🚀 Minha Recomendação

**Faça um Pix de R$ 47 para você mesmo:**

1. ✅ Mais rápido (5 minutos)
2. ✅ Valida o fluxo real de produção
3. ✅ R$ 47 fica na sua conta MP (não perde dinheiro)
4. ✅ Testa exatamente como clientes reais vão usar
5. ✅ Recebe o PDF de verdade no email

**Depois do teste:**
- Sistema validado ✅
- Pronto para vender ✅
- Você pode até usar o PDF que receber! ✅

---

## 📖 Referências

- [Requisitos para entrar em produção](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/go-to-production-requirements)
- [Criar usuário de teste](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/additional-content/your-integrations/test/accounts)
- [Contas de teste - Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/test/accounts)
- [Credenciais do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/credentials)

---

**Próximo Passo:** Qual método você prefere usar para testar?

1. 🏃 **Rápido**: Pix de R$ 47 (5 min)
2. 🔬 **Avançado**: Criar usuários de teste (15 min)
3. 🛠️ **Técnico**: Instalar ngrok (20 min)
