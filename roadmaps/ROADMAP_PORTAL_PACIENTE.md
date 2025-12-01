# 🏥 Roadmap: Portal do Paciente Atma

## 📊 Visão Geral

**Objetivo**: Transformar o infoproduto de PDF estático em um Portal Web interativo com login, mantendo o PDF como recurso de download.

**Valor Percebido**: R$ 47 → R$ 97-147 (potencial de upsell)

**Timeline Estimado**: 2-3 semanas para MVP completo

---

## 🎯 Fase 1: Fundação & Autenticação ✅ COMPLETA (2 horas)

### 1.1 Setup de Autenticação ✅

- [x] Instalar e configurar **Clerk** ✅
  - Clerk instalado via npm
  - ClerkProvider configurado no root layout
  - Chaves de API configuradas em `.env.local`
  - **Documentação**: [SETUP_CLERK.md](../SETUP_CLERK.md)
- [x] Middleware de proteção de rotas ✅
  - Arquivo `middleware.ts` criado
  - Rotas públicas e protegidas configuradas
  - Redirecionamento automático para login
- [x] Criar schema de banco de dados ✅

  ```sql
  -- Tabelas criadas no atmadb:
  ✅ portal_users (usuários do portal sincronizados com Clerk)
  ✅ portal_relatorios (relatórios de viabilidade com dados JSON)
  ✅ portal_acessos (logs de acesso para auditoria)
  ✅ portal_interacoes (tracking de engajamento/gamificação)
  ✅ portal_preferencias (configurações do usuário)

  -- Views criadas:
  ✅ vw_relatorios_ativos (relatórios válidos com dados do usuário)
  ✅ vw_estatisticas_uso (métricas de uso por usuário)
  ```

- [x] Setup MySQL ✅
  - Schema aplicado no banco `atmadb` existente
  - Script de migração: `npm run db:migrate`
  - Arquivo: `database/schema-portal.sql`

### 1.2 Páginas de Autenticação ✅

- [x] `/portal/entrar` - Tela de login ✅
- [x] `/portal/cadastro` - Criação de conta ✅
- [x] Email transacional (Clerk gerencia automaticamente) ✅
  - Verificação de email
  - Recuperação de senha
  - Login mágico (magic link)

### 1.3 Layout do Portal ✅

- [x] Layout com sidebar (desktop) ✅
- [x] Bottom navigation (mobile) ✅
- [x] Header com UserButton ✅
- [x] Menu de navegação com 8 seções ✅

### 1.4 Dashboard Principal ✅

- [x] `/portal` - Dashboard com score ✅
- [x] ScoreCard component (circle progress animado) ✅
- [x] Cards de resumo (4 cards: investimento, duração, complexidade, status) ✅
- [x] QuickActions component (Baixar PDF, Agendar, Compartilhar) ✅
- [x] Próximos Passos (3 etapas numeradas) ✅
- [x] Banner informativo sobre o relatório ✅

**Entregável**: ✅ Sistema de auth funcionando + Dashboard interativo

**📁 Arquivos Criados**:

**Frontend:**

- `middleware.ts` - Proteção de rotas
- `app/portal/(auth)/entrar/page.tsx` - Login
- `app/portal/(auth)/cadastro/page.tsx` - Cadastro
- `app/portal/(dashboard)/layout.tsx` - Layout do portal
- `app/portal/(dashboard)/page.tsx` - Dashboard (corrigido de portal/page.tsx)
- `components/portal/ScoreCard.tsx` - Score visual
- `components/portal/QuickActions.tsx` - Ações rápidas
- `lib/db.ts` - Cliente MySQL (já existia)
- `scripts/migrate-portal.ts` - Script de migração do banco

**Database:**

- `database/schema-portal.sql` - Schema SQL completo

**Documentação:**

- `SETUP_CLERK.md` - Guia de configuração do Clerk
- `FASE_1_PORTAL_COMPLETA.md` - Documentação da Fase 1
- `DEPLOY_PRODUCTION.md` - Guia de deploy e troubleshooting

**🔗 Acessível em**: <http://localhost:3006/portal>

---

## 🎨 Fase 2: Layout & Dashboard Principal ✅ 100% COMPLETA

### 2.1 Design System ✅

- [x] **shadcn/ui** já instalado ✅
  - Componentes Radix UI já presentes
  - Card, Button, Badge disponíveis
- [x] Paleta de cores definida ✅
  - Usando cores do `chart-utils.ts`
  - Primary: `#2563EB` (Blue-600)
  - Success: `#10B981` (Green-500)
  - Warning: `#F59E0B` (Amber-500)
  - Purple: `#8B5CF6` (Purple-500)
- [x] Componentes base implementados ✅
  - Card personalizado
  - Button variants
  - Badge para scores
  - Toast (sonner já instalado)

### 2.2 Layout do Portal ✅

- [x] `/portal/(dashboard)/layout.tsx` criado ✅
  - Sidebar navegação (desktop) com 8 seções
  - Bottom nav (mobile) com 5 principais
  - Header com UserButton do Clerk
  - Logo Atma com badge
- [x] Componentes de navegação ✅
  - Menu items com ícones Lucide
  - Estados hover
  - User profile integrado
- [x] **Breadcrumbs no header** ✅
  - Componente `Breadcrumbs.tsx` criado
  - Navegação hierárquica com ícones
  - Integrado ao layout (desktop only)
  - Home icon + ChevronRight separators
- [x] **Indicador de página ativa** ✅
  - Sidebar: Fundo azul + barra lateral azul
  - Mobile nav: Cor azul + dot indicator
  - Função `isActive()` com lógica inteligente
  - usePathname() para detecção de rota

### 2.3 Dashboard Principal (`/portal`) ✅

- [x] **Hero Section** - ScoreCard ✅
  - Score de viabilidade em destaque
  - Circle progress animado (SVG)
  - Mensagem personalizada baseada no score
  - 4 níveis de classificação (cores dinâmicas)
- [x] **Cards de Resumo** (grid 2x2) ✅
  - Custo estimado (R$ 5.990)
  - Duração do tratamento (12 meses)
  - Complexidade do caso (Moderada)
  - Status (Em Análise)
- [x] **Quick Actions** ✅
  - Botão principal: "Baixar PDF"
  - Botão secundário: "Agendar Consulta"
  - Botão terciário: "Compartilhar"
  - 4 links rápidos para seções

### 2.4 Páginas de Navegação (Placeholder) ✅

- [x] `/portal/analise` - Análise do Caso ✅
  - Layout básico com radar de viabilidade
  - Cards de complexidade e previsões
- [x] `/portal/financeiro` - Informações Financeiras ✅
  - Cards de investimento, parcelamento, economia
  - Calculadora de parcelas
  - Formas de pagamento aceitas
- [x] `/portal/timeline` - Timeline do Tratamento ✅
  - 4 etapas do tratamento (mês a mês)
  - Indicadores de status (pendente/completo)
  - Informações pós-tratamento

**Entregável**: ✅ Dashboard visual e funcional + Navegação completa com breadcrumbs e indicadores ativos

---

## 📊 Fase 3: Seções de Conteúdo + Integração DB ⚙️ 40% COMPLETA

### 3.0 Integração com Banco de Dados ✅

- [x] **Webhook do Clerk** ✅
  - Rota `/api/webhooks/clerk` criada
  - Eventos: `user.created`, `user.updated`, `user.deleted`
  - Sincronização automática com `portal_users`
  - Criação automática de `portal_preferencias`
  - Verificação segura com Svix
  - Documentação completa: `SETUP_WEBHOOK_CLERK.md`

- [x] **API Routes de Dados** ✅
  - `/api/portal/relatorio` - Busca relatório ativo do usuário
  - `/api/portal/interacao` - Tracking de engajamento
  - GET relatorio: Retorna dados do relatório + usuário
  - POST interacao: Registra interações (views, downloads, etc.)
  - GET interacao: Estatísticas de uso

- [x] **Dashboard com Dados Reais** ✅
  - Substituiu dados hardcoded por queries MySQL
  - Busca `portal_users` via `clerk_user_id`
  - Busca `portal_relatorios` ativos e não expirados
  - Estado "Sem Relatório" quando não há dados
  - Parse de `dados_json` para dados customizados
  - Exibe: score, custo, duração, complexidade, status
  - Badges dinâmicos baseados no status de pagamento

- [x] **Dependências Instaladas** ✅
  - `svix` para verificação de webhooks
  - `dotenv` para variáveis de ambiente (migração)

**Entregável**: ✅ Infraestrutura de dados completa - Dashboard integrado com MySQL

**📁 Arquivos Criados**:

**API Routes:**
- `app/api/webhooks/clerk/route.ts` - Webhook Clerk
- `app/api/portal/relatorio/route.ts` - Buscar relatório
- `app/api/portal/interacao/route.ts` - Tracking

**Documentação:**
- `SETUP_WEBHOOK_CLERK.md` - Guia completo de webhook

**Modificados:**
- `app/portal/(dashboard)/page.tsx` - Dashboard com dados reais

### 3.1 Seção: Análise do Caso (`/portal/analise`)
- [ ] **Score Breakdown**
  - Gráfico radar interativo (Chart.js no browser, não canvas server-side)
  - Tooltips explicativos em cada fator
  - Cards detalhando cada componente do score
- [ ] **Análise Detalhada**
  - Problemas identificados (lista com badges coloridos)
  - Recomendações personalizadas
  - Nível de complexidade visual
- [ ] **Gráficos Interativos**
  - Usar Recharts (React-native) ao invés de Chart.js server-side
  - Animações de entrada
  - Hover states informativos

### 3.2 Seção: Plano Financeiro (`/portal/financeiro`)
- [ ] **Comparativo de Custos**
  - Gráfico de barras interativo
  - Tabela comparativa (Atma vs concorrentes)
  - Destacar economia com badge verde
- [ ] **Calculadora Interativa**
  - Slider de parcelas (1x até 24x)
  - Atualização em tempo real
  - Comparação de juros
  - Simulação de diferentes cenários
- [ ] **Composição do Investimento**
  - Gráfico donut interativo
  - Breakdown de custos com tooltips
  - Seção "O que está incluído?"

### 3.3 Seção: Timeline (`/portal/timeline`)
- [ ] **Visualização de Cronograma**
  - Timeline vertical interativa
  - Fases do tratamento com ícones
  - Estimativa de duração em destaque
  - Milestones importantes
- [ ] **Gráfico de Progresso**
  - Curva S animada
  - Pontos de check-in marcados
  - Projeção de conclusão
- [ ] **Calendário Sugerido**
  - Cards de fases (30-60-90 dias)
  - Checkboxes para ações necessárias
  - Links para agendar consultas

### 3.4 Seção: Tecnologia (`/portal/tecnologia`)
- [ ] **Sobre o Atma Aligner**
  - Infográfico interativo
  - Comparação com métodos tradicionais
  - Vídeos explicativos (iframe YouTube)
- [ ] **Ciência por Trás**
  - Accordion com FAQs científicas
  - Estudos e referências
  - Certificações e aprovações

### 3.5 Seção: Depoimentos (`/portal/depoimentos`)
- [ ] **Cards de Depoimentos**
  - Filtros por caso similar
  - Filtros por duração de tratamento
  - Fotos antes/depois (blur com reveal)
  - Rating com estrelas
- [ ] **Casos Reais**
  - Histórias completas
  - Timeline do paciente
  - Resultados alcançados

### 3.6 Seção: Perguntas (`/portal/perguntas`)
- [ ] **FAQ Personalizado**
  - Baseado no caso do paciente
  - Categorias colapsáveis
  - Busca em tempo real
- [ ] **Perguntas para o Ortodontista**
  - Lista de perguntas sugeridas
  - Botão "Copiar todas"
  - Opção de imprimir

### 3.7 Seção: Downloads (`/portal/downloads`)
- [ ] **Gerador de PDF**
  - Botão principal "Baixar Relatório Completo"
  - Loading state com progresso
  - Preview do PDF
- [ ] **Materiais Extras**
  - Guia de cuidados (PDF)
  - Checklist de preparação (PDF)
  - Cartão de perguntas (PNG para salvar)
- [ ] **Compartilhamento**
  - Link de compartilhamento com dentista
  - QR Code para consulta online
  - Opção de enviar por email

**Entregável**: Todas as seções funcionais com conteúdo interativo

---

## 🚀 Fase 4: Features de Engajamento (2-3 dias)

### 4.1 Gamificação Básica
- [ ] **Progress Tracker**
  - % de seções visitadas
  - Badge "Explorador" ao visitar tudo
  - Checklist de ações recomendadas
- [ ] **Notificações**
  - Toast quando completa ação
  - Badge de "novo" em features

### 4.2 Integrações
- [ ] **Agendamento Online**
  - Integração com Calendly ou Cal.com
  - Embed do calendário na página
  - Confirmação por email
- [ ] **Email Marketing**
  - Resend ou SendGrid
  - Email após cadastro
  - Email após 3 dias: "Viu tudo?"
  - Email após 7 dias: "Agende sua consulta"

### 4.3 Analytics
- [ ] **Tracking de Eventos**
  - Google Analytics 4
  - Eventos personalizados:
    - Seção visitada
    - PDF baixado
    - Consulta agendada
    - Tempo de permanência
- [ ] **Dashboard Admin (futuro)**
  - Métricas de engajamento
  - Taxa de conversão
  - Funil de vendas

**Entregável**: Portal completo com features de engajamento

---

## 📱 Fase 5: Mobile & Otimizações (2 dias)

### 5.1 Mobile-First
- [ ] Testar todas as telas em mobile
- [ ] Ajustar navegação (bottom nav)
- [ ] Touch gestures (swipe entre seções)
- [ ] Otimizar gráficos para touch
- [ ] PWA (opcional: instalar como app)

### 5.2 Performance
- [ ] Lazy loading de seções
- [ ] Otimização de imagens (next/image)
- [ ] Code splitting por rota
- [ ] Cache de dados do relatório
- [ ] Lighthouse score > 90

### 5.3 SEO & Metadata
- [ ] Meta tags personalizadas
- [ ] OG images dinâmicas
- [ ] Sitemap
- [ ] robots.txt

**Entregável**: Portal otimizado e responsivo

---

## 💰 Fase 6: Monetização & Upsells (conforme demanda)

### 6.1 Planos
- [ ] **Plano Básico** (R$ 47)
  - Acesso ao portal por 30 dias
  - Download do PDF
  - Análise completa
- [ ] **Plano Premium** (R$ 97)
  - Acesso vitalício
  - Consulta online incluída
  - Simulador 3D (futuro)
  - Atualizações de progresso
- [ ] **Plano Pro** (R$ 147)
  - Tudo do Premium +
  - Acompanhamento mensal
  - Chat com especialista
  - Segunda opinião

### 6.2 Upsells no Portal
- [ ] Modal de upgrade após 7 dias
- [ ] Banner de "Upgrade para Premium"
- [ ] Features bloqueadas com CTA
- [ ] Comparativo de planos

### 6.3 Pagamentos
- [ ] Integração Stripe ou Mercado Pago
- [ ] Checkout inline
- [ ] Gestão de assinaturas
- [ ] Cancelamento self-service

**Entregável**: Sistema de monetização funcionando

---

## 🗄️ Estrutura de Arquivos Proposta

```
Frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── cadastro/
│   │   │   └── page.tsx
│   │   └── esqueci-senha/
│   │       └── page.tsx
│   │
│   ├── (portal)/
│   │   ├── layout.tsx              # Layout com sidebar
│   │   ├── portal/
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── analise/
│   │   │   │   └── page.tsx
│   │   │   ├── financeiro/
│   │   │   │   └── page.tsx
│   │   │   ├── timeline/
│   │   │   │   └── page.tsx
│   │   │   ├── tecnologia/
│   │   │   │   └── page.tsx
│   │   │   ├── depoimentos/
│   │   │   │   └── page.tsx
│   │   │   ├── perguntas/
│   │   │   │   └── page.tsx
│   │   │   └── downloads/
│   │   │       └── page.tsx
│   │   │
│   │   └── perfil/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/                   # NextAuth endpoints
│   │   ├── relatorio/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── download-pdf/
│   │   │       └── route.ts
│   │   └── stripe/                 # Webhooks pagamento
│   │
│   └── globals.css
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── portal/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── QuickActions.tsx
│   │   └── sections/
│   │       ├── AnaliseSection.tsx
│   │       ├── FinanceiroSection.tsx
│   │       ├── TimelineSection.tsx
│   │       └── ...
│   ├── charts/
│   │   ├── RadarChart.tsx          # Recharts no browser
│   │   ├── BarChart.tsx
│   │   ├── DonutChart.tsx
│   │   └── LineChart.tsx
│   └── ui/
│       ├── button.tsx              # shadcn/ui
│       ├── card.tsx
│       ├── badge.tsx
│       └── ...
│
├── lib/
│   ├── auth.ts                     # Config NextAuth/Clerk
│   ├── db.ts                       # Prisma/Supabase client
│   ├── pdf-generator-v6.ts         # Mantém geração PDF
│   ├── chart-utils.ts              # Mantém (server-side)
│   └── utils.ts
│
├── hooks/
│   ├── useRelatorio.ts
│   ├── useUser.ts
│   └── useAnalytics.ts
│
├── types/
│   └── relatorio.ts
│
└── prisma/
    └── schema.prisma               # Se usar Prisma
```

---

## 🔧 Stack Técnica

### Core
- ✅ **Next.js 15** (já tem)
- ✅ **React 19** (já tem)
- ✅ **TypeScript** (já tem)
- ✅ **TailwindCSS** (já tem)

### Novos
- **Autenticação**: Clerk ou NextAuth.js
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **UI Components**: shadcn/ui
- **Charts (Browser)**: Recharts
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand (se necessário)
- **Analytics**: Vercel Analytics + Google Analytics 4
- **Email**: Resend
- **Pagamentos**: Stripe (futuro)

---

## 📊 Métricas de Sucesso

### Técnicas
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Mobile-friendly (Google Mobile Test)

### Negócio
- [ ] Taxa de conclusão de cadastro > 80%
- [ ] Tempo médio de sessão > 5 minutos
- [ ] Taxa de download do PDF > 60%
- [ ] Taxa de agendamento de consulta > 20%
- [ ] NPS > 8

---

## 🚦 Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Complexidade de auth | Alto | Usar Clerk (plug & play) |
| Tempo de desenvolvimento | Alto | MVP focado, features incrementais |
| Migração de usuários existentes | Médio | Criar ferramenta de importação |
| Performance dos gráficos | Médio | Lazy loading, code splitting |
| Custo de hospedagem | Baixo | Vercel free tier suficiente para início |

---

## 🎯 Próximos Passos Imediatos

### ✅ Concluído (Fase 1 + 2 Parcial)

1. ✅ **Stack de autenticação decidida** - Clerk implementado
2. ✅ **Autenticação básica** - Login/signup funcionando
3. ✅ **Layout do portal** - Sidebar + Dashboard criados
4. ✅ **Dashboard visual** - ScoreCard + QuickActions implementados

### 🔜 Próximo (Fase 3)

1. **Criar seções de conteúdo**:
   - `/portal/analise` - Análise detalhada com gráficos interativos
   - `/portal/financeiro` - Plano financeiro e calculadora
   - `/portal/timeline` - Cronograma visual
   - `/portal/tecnologia` - Sobre o Atma Aligner
   - `/portal/depoimentos` - Cases de sucesso
   - `/portal/perguntas` - FAQ personalizado
   - `/portal/downloads` - PDFs e materiais

2. **Setup banco de dados**:
   - Criar schema MySQL (users + relatorios)
   - API routes para CRUD de relatórios
   - Webhook Clerk para sincronizar usuários

3. **Integrar dados reais**:
   - Buscar dados do relatório do banco
   - Substituir dados hardcoded por dados reais
   - Sistema de upload/geração de relatórios

---

## 💡 Ideias Futuras (Backlog)

- [ ] Simulador 3D do sorriso (Three.js)
- [ ] Comparação lado-a-lado de planos
- [ ] Chat em tempo real com especialista
- [ ] Gamificação completa (pontos, badges)
- [ ] Programa de indicação (referral)
- [ ] App mobile nativo (React Native)
- [ ] Integração com Zapier
- [ ] API pública para dentistas
- [ ] White-label para clínicas

---

## 📞 Suporte e Recursos

- **Documentação Next.js 15**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Clerk**: https://clerk.dev
- **Supabase**: https://supabase.com
- **Recharts**: https://recharts.org

---

---

## 📈 Status do Projeto

**Última atualização**: 2025-12-01
**Status**: 🚀 **EM DESENVOLVIMENTO** (Fase 1 completa, Fase 2 parcial)
**Responsável**: Equipe ROI Labs

### Progresso Geral

- ✅ **Fase 1**: Fundação & Autenticação - **100% COMPLETA**
- 🟡 **Fase 2**: Layout & Dashboard - **80% COMPLETA** (faltam breadcrumbs e indicador ativo)
- ⚪ **Fase 3**: Seções de Conteúdo - **0% COMPLETA**
- ⚪ **Fase 4**: Features de Engajamento - **0% COMPLETA**
- ⚪ **Fase 5**: Mobile & Otimizações - **0% COMPLETA**
- ⚪ **Fase 6**: Monetização - **0% COMPLETA**

**Total**: ~30% do MVP completo

### Links Importantes

- [Guia de Setup do Clerk](../SETUP_CLERK.md)
- [Documentação Fase 1 Completa](../FASE_1_PORTAL_COMPLETA.md)
- [Servidor Local](http://localhost:3006/portal)
