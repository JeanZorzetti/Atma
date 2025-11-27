# 🚀 Setup Completo: Infoproduto Automatizado

## 📊 Visão Geral

Sistema de **Relatório de Viabilidade Ortodôntica** - Infoproduto 100% automatizado por R$ 47

### Estrutura Criada

```
/Frontend/app/infoproduto/relatorio-viabilidade/
├── page.tsx                    ✅ Landing page (copywriting otimizado)
├── formulario/page.tsx         ✅ Formulário de 15 perguntas (4 etapas)
├── checkout/page.tsx           ✅ Página de pagamento
└── sucesso/page.tsx            ✅ Página de confirmação

/Frontend/app/api/infoproduto/
├── checkout/route.ts           ✅ API de processamento de checkout
├── gerar-pdf/route.ts          ✅ API de geração de PDF (com lógica inteligente)
└── webhook/route.ts            ✅ Webhook para Mercado Pago
```

---

## 🔧 Passo 1: Instalar Dependências

### 1.1 Bibliotecas Necessárias

```bash
cd Frontend

# Para geração de PDF (escolha UMA das opções)

# Opção A: jsPDF (mais leve, simples)
npm install jspdf jspdf-autotable

# Opção B: Puppeteer (melhor qualidade, mais pesado)
npm install puppeteer

# Opção C: PDFKit (Node.js, boa performance)
npm install pdfkit

# SDK do Mercado Pago
npm install mercadopago

# Para envio de emails
npm install resend
# ou
npm install nodemailer

# Validação de dados
npm install zod
```

---

## 💳 Passo 2: Configurar Mercado Pago

### 2.1 Criar Conta Mercado Pago

1. Acesse: https://www.mercadopago.com.br
2. Crie conta Business (gratuito)
3. Ative vendas online

### 2.2 Obter Credenciais

1. Vá em: **Configurações** → **Credenciais**
2. Copie:
   - **Access Token de Teste** (para testar)
   - **Access Token de Produção** (para vender de verdade)

### 2.3 Configurar Variáveis de Ambiente

Crie/edite: `Frontend/.env.local`

```env
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
NEXT_PUBLIC_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=sua_chave_resend_aqui

# Ou Nodemailer (Gmail, SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu@email.com
EMAIL_PASS=sua_senha_app

# Database (se usar)
DATABASE_URL=postgresql://user:pass@localhost:5432/atma
```

### 2.4 Atualizar API de Checkout

Edite: `Frontend/app/api/infoproduto/checkout/route.ts`

Descomente o código do Mercado Pago e adicione:

```typescript
import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!
})

// ... (já está no arquivo)
```

### 2.5 Configurar Webhook no Mercado Pago

1. No painel do Mercado Pago: **Configurações** → **Notificações**
2. Adicione URL do webhook:
   ```
   https://seu-dominio.com.br/api/infoproduto/webhook
   ```
3. Selecione eventos: `payment`, `merchant_order`

---

## 📧 Passo 3: Configurar Envio de Email

### Opção A: Resend (Recomendado - mais fácil)

```bash
npm install resend
```

Crie: `Frontend/lib/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function enviarRelatorio(
  email: string,
  nome: string,
  pdfBuffer: Buffer
) {
  await resend.emails.send({
    from: 'Atma Aligner <noreply@atma.com.br>',
    to: email,
    subject: `${nome}, Seu Relatório de Viabilidade Está Pronto! 🎉`,
    html: `
      <h1>Olá ${nome}!</h1>
      <p>Seu relatório personalizado está anexo a este email.</p>
      <p><strong>Próximos passos:</strong></p>
      <ol>
        <li>Baixe o PDF anexo</li>
        <li>Leia com atenção todas as seções</li>
        <li>Use o plano de ação para dar sequência</li>
      </ol>
      <p>Qualquer dúvida, responda este email!</p>
    `,
    attachments: [
      {
        filename: 'relatorio-viabilidade-atma.pdf',
        content: pdfBuffer,
      },
    ],
  })
}
```

### Opção B: Nodemailer (Gmail)

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function enviarRelatorio(
  email: string,
  nome: string,
  pdfBuffer: Buffer
) {
  await transporter.sendMail({
    from: '"Atma Aligner" <noreply@atma.com.br>',
    to: email,
    subject: `${nome}, Seu Relatório de Viabilidade Está Pronto!`,
    html: `... (mesmo HTML acima)`,
    attachments: [
      {
        filename: 'relatorio-viabilidade-atma.pdf',
        content: pdfBuffer,
      },
    ],
  })
}
```

---

## 📄 Passo 4: Implementar Geração de PDF

### Opção A: Puppeteer (Melhor Qualidade)

Crie: `Frontend/lib/pdf-generator.ts`

```typescript
import puppeteer from 'puppeteer'

export async function gerarPDFRelatorio(dados: any): Promise<Buffer> {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // HTML do relatório (use template engine como Handlebars se quiser)
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #2563eb; }
        .score { font-size: 72px; font-weight: bold; color: #10b981; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        td, th { border: 1px solid #ddd; padding: 12px; text-align: left; }
      </style>
    </head>
    <body>
      <h1>Relatório de Viabilidade Ortodôntica</h1>
      <p><strong>Cliente:</strong> ${dados.cliente.nome}</p>
      <p><strong>Data:</strong> ${dados.dataGeracao}</p>

      <h2>Score de Viabilidade</h2>
      <div class="score">${dados.score}/100</div>

      <h2>Análise Personalizada</h2>
      <p>${dados.analise}</p>

      <h2>Estimativa de Custos</h2>
      <table>
        <tr>
          <th>Categoria do Caso</th>
          <td>${dados.estimativaCustos.categoria}</td>
        </tr>
        <tr>
          <th>Faixa de Preço (Atma)</th>
          <td>R$ ${dados.estimativaCustos.faixaPreco.min} - R$ ${dados.estimativaCustos.faixaPreco.max}</td>
        </tr>
        <tr>
          <th>Alinhadores Necessários</th>
          <td>${dados.estimativaCustos.alinhadores}</td>
        </tr>
        <tr>
          <th>Timeline Estimado</th>
          <td>${dados.timeline}</td>
        </tr>
      </table>

      <h2>Comparativo de Mercado</h2>
      <table>
        <tr>
          <th>Opção</th>
          <th>Preço Estimado</th>
        </tr>
        <tr>
          <td>Atma Aligner</td>
          <td>R$ ${dados.estimativaCustos.comparacao.atma}</td>
        </tr>
        <tr>
          <td>Invisalign®</td>
          <td>R$ ${dados.estimativaCustos.comparacao.invisalign}</td>
        </tr>
        <tr>
          <td>Aparelho Fixo</td>
          <td>R$ ${dados.estimativaCustos.comparacao.aparelhoFixo}</td>
        </tr>
      </table>

      <h2>Plano de Ação</h2>
      <ol>
        ${dados.planoAcao.map((acao: string) => `<li>${acao}</li>`).join('')}
      </ol>

      <div style="margin-top: 60px; padding: 20px; background: #f3f4f6; border-left: 4px solid #2563eb;">
        <h3>Próximos Passos</h3>
        <p>Entre em contato conosco: <strong>contato@atma.com.br</strong></p>
        <p>WhatsApp: <strong>(11) 99999-9999</strong></p>
      </div>
    </body>
    </html>
  `

  await page.setContent(html)

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm',
    },
  })

  await browser.close()

  return pdfBuffer
}
```

### Atualizar API de Gerar PDF

Edite: `Frontend/app/api/infoproduto/gerar-pdf/route.ts`

Adicione no final:

```typescript
import { gerarPDFRelatorio } from '@/lib/pdf-generator'
import { enviarRelatorio } from '@/lib/email'

// ... (no POST handler, após preparar relatorioData)

// Gerar PDF
const pdfBuffer = await gerarPDFRelatorio(relatorioData)

// Enviar email
await enviarRelatorio(
  formData.email,
  formData.nome,
  pdfBuffer
)
```

---

## 🗄️ Passo 5: Banco de Dados (Opcional mas Recomendado)

Para rastrear vendas e evitar duplicações.

### 5.1 Schema Prisma

Crie: `Frontend/prisma/schema.prisma`

```prisma
model Pedido {
  id                String   @id @default(cuid())
  email             String
  nome              String
  telefone          String
  formData          Json     // Dados completos do formulário
  status            String   @default("pending") // pending, paid, completed
  mercadopagoId     String?  @unique
  externalReference String?  @unique
  processado        Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

```bash
npx prisma generate
npx prisma db push
```

### 5.2 Salvar Pedido na API de Checkout

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// No POST do checkout/route.ts
const pedido = await prisma.pedido.create({
  data: {
    email: formData.email,
    nome: formData.nome,
    telefone: formData.telefone,
    formData: formData,
    externalReference: `${Date.now()}-${email}`,
  },
})
```

---

## 🧪 Passo 6: Testar Localmente

```bash
cd Frontend
npm run dev
```

Acesse: http://localhost:3000/infoproduto/relatorio-viabilidade

### Fluxo de Teste

1. ✅ Preencher formulário (4 etapas)
2. ✅ Ver página de checkout
3. ✅ Clicar em "Pagar Agora"
4. ✅ Ver página de sucesso
5. ✅ Receber email com PDF

---

## 🚀 Passo 7: Deploy em Produção

### 7.1 Vercel (Recomendado para Next.js)

```bash
npm install -g vercel
vercel
```

### 7.2 Configurar Variáveis de Ambiente no Vercel

Dashboard Vercel → Settings → Environment Variables

Adicione todas as variáveis do `.env.local`

### 7.3 Atualizar Webhook no Mercado Pago

Trocar URL de:
```
http://localhost:3000/api/infoproduto/webhook
```

Para:
```
https://atma.roilabs.com.br/api/infoproduto/webhook
```

---

## 📊 Passo 8: Tracking e Analytics

### 8.1 Google Analytics

Adicione eventos customizados:

```typescript
// Quando landing page carregar
gtag('event', 'infoproduto_view', {
  produto: 'relatorio-viabilidade',
  valor: 47
})

// Quando preencher formulário
gtag('event', 'infoproduto_form_complete')

// Quando comprar
gtag('event', 'purchase', {
  value: 47,
  currency: 'BRL',
  items: [{ name: 'Relatório Viabilidade' }]
})
```

### 8.2 Facebook Pixel

```typescript
fbq('track', 'ViewContent', { content_name: 'Relatório Viabilidade' })
fbq('track', 'Purchase', { value: 47.00, currency: 'BRL' })
```

---

## 💰 Projeção de Receita

Com seus números atuais (31 cadastros/mês):

| Métrica | Conv. | Quantidade | Valor | Receita |
|---------|-------|------------|-------|---------|
| Cadastros/mês | - | 31 | - | - |
| Taxa conversão landing → checkout | 20% | 6 | - | - |
| Taxa conversão checkout → venda | 60% | 3-4 | R$ 47 | **R$ 141-188/mês** |

**Escalando tráfego:**
- Com 100 cadastros/mês: **R$ 500-600/mês**
- Com 300 cadastros/mês: **R$ 1.500-1.800/mês**
- Com 1.000 cadastros/mês: **R$ 5.000-6.000/mês**

**Margem:** ~98% (custo quase zero após setup)

---

## 🎯 Próximos Passos Recomendados

### Curto Prazo (Semana 1-2)
1. ✅ Implementar geração de PDF
2. ✅ Configurar Mercado Pago
3. ✅ Testar fluxo completo
4. ✅ Fazer primeira venda de teste

### Médio Prazo (Semana 3-4)
1. Adicionar upsell: "Consulta Virtual R$ 97" na página de sucesso
2. Criar sequência de emails automatizada
3. A/B test do preço (R$ 37 vs R$ 47 vs R$ 67)
4. Implementar cupom de desconto para primeiros clientes

### Longo Prazo (Mês 2-3)
1. Criar "Clube Atma Premium" (R$ 29,90/mês)
2. Adicionar módulo de afiliados
3. Criar versão "Relatório Empresarial" (R$ 197)
4. Expandir para outros infoprodutos

---

## 🆘 Troubleshooting

### PDF não está sendo gerado
- Verifique logs do console
- Teste localmente primeiro
- Use `console.log` para debug

### Email não está sendo enviado
- Verifique credenciais (Resend ou SMTP)
- Teste com mailtrap.io primeiro
- Verifique spam folder

### Mercado Pago não redireciona
- Confirme credenciais corretas
- Use modo sandbox primeiro
- Verifique back_urls estão corretas

### Webhook não dispara
- Teste com ngrok localmente
- Confirme URL está pública
- Verifique logs do Mercado Pago

---

## 📞 Suporte

Se precisar de ajuda:
1. Consulte logs: `/api/...` endpoints
2. Use Mercado Pago em modo sandbox
3. Teste envio de email com serviços de teste

**Está tudo pronto para você começar a vender!** 🚀

Custos totais: **R$ 0** (exceto taxa do Mercado Pago: 4,99% + R$ 0,49 por venda)
