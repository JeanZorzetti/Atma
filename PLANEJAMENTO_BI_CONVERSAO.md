# Análise Estratégica e Planejamento - BI de Conversão Atma

**Data:** 03/12/2025
**Responsável:** Análise técnica e estratégica
**URL:** https://atmaadmin.roilabs.com.br/admin/bi-conversao

---

## 📊 1. ANÁLISE DA SITUAÇÃO ATUAL

### 1.1 Estrutura Atual da Página

A página de BI de Conversão atualmente apresenta um **funil completo end-to-end**:

```
SEO (Google) → Cadastro → Comercial/CRM → Conversão
```

#### Etapas do Funil:
1. **Impressões** (Google Search Console)
2. **Cliques** (Google Search Console)
3. **Cadastros Totais** (CRM)
4. **Novo** (Status inicial)
5. **Contatado** (Primeiro contato)
6. **Atribuído** (Designado a ortodontista) ⭐ NOVO STATUS
7. **Agendado** (Consulta marcada)
8. **Avaliação Inicial** (Primeira consulta)
9. **Convertido** (Tratamento iniciado)

#### Dados Exibidos:
- ✅ Taxas de conversão entre cada etapa
- ✅ Tempo médio de transição (em horas/dias)
- ✅ Breakdown de cancelamentos por etapa
- ✅ Visualização interativa com React Flow
- ✅ Cards compactos alternativos
- ✅ Métricas agregadas (conversão total, taxa cancelamento, etc.)
- ✅ Health status (saudável/atenção/crítico) com cores

### 1.2 Pontos Fortes

1. **Visualização Completa**: Funil end-to-end desde impressões SEO até conversão final
2. **Métricas Detalhadas**: Incluindo tempos de transição e breakdown de cancelamentos
3. **Interface Interativa**: React Flow com tooltips e visualização proporcional
4. **Health Indicators**: Sistema de cores para identificar gargalos
5. **Flexibilidade de Período**: Filtro de data range (até 90 dias)
6. **Múltiplas Visualizações**: React Flow + cards compactos + detalhes numéricos

### 1.3 Limitações e Oportunidades de Melhoria

#### 🔴 **Crítico** - Problemas que impedem tomada de decisão:
1. **Falta de Comparação Temporal**: Não há como comparar períodos (ex: este mês vs mês passado)
2. **Sem Metas/Benchmarks**: Valores de "health status" estão hardcoded, não são configuráveis
3. **Falta de Drill-down**: Não é possível clicar em uma etapa e ver os pacientes específicos
4. **Ausência de Segmentação**: Não há filtros por cidade, ortodontista, origem, etc.

#### 🟡 **Importante** - Melhorias que aumentam valor:
5. **Análise de Coorte**: Não rastreia grupos de pacientes ao longo do tempo
6. **Insights Automáticos**: Apenas um alerta básico de gargalo identificado
7. **Previsões**: Nenhuma projeção ou forecast baseado em tendências
8. **ROI/CAC**: Não calcula custo de aquisição ou retorno sobre investimento
9. **Exportação Limitada**: Não há opção de exportar relatórios

#### 🟢 **Bom ter** - Funcionalidades adicionais:
10. **Alertas Personalizados**: Notificações quando métricas caem abaixo de thresholds
11. **Dashboards Salvos**: Salvar configurações favoritas de período/filtros
12. **Comentários/Anotações**: Marcar eventos importantes na timeline (campanhas, mudanças)

---

## 🎯 2. OBJETIVOS ESTRATÉGICOS

### 2.1 Objetivo Principal
**Transformar o BI de Conversão em uma ferramenta de tomada de decisão proativa e acionável**

### 2.2 Objetivos Secundários
1. **Reduzir tempo de análise**: De 30min para 5min para identificar problemas
2. **Aumentar taxa de conversão**: Identificar e resolver gargalos rapidamente
3. **Melhorar previsibilidade**: Projetar resultados futuros com base em tendências
4. **Otimizar recursos**: Identificar onde investir (SEO, equipe comercial, ortodontistas)

---

## 🚀 3. PROPOSTA DE EVOLUÇÃO ESTRATÉGICA

### FASE 1: Comparações e Contexto (Prioridade ALTA) 🔴

#### 3.1.1 Comparação de Períodos
**Problema:** Impossível saber se está melhorando ou piorando
**Solução:**
```typescript
interface ComparisonMode {
  type: 'none' | 'previous_period' | 'same_period_last_year' | 'custom'
  customPeriod?: { from: Date, to: Date }
}
```

**UI Proposta:**
- Botões de ação rápida: "Comparar com período anterior" | "Mesmo período ano passado"
- Exibir variação percentual (↑12% ou ↓8%) ao lado de cada métrica
- Mini-gráfico de sparkline mostrando tendência

**Impacto Esperado:**
- ✅ Identificar rapidamente se performance está melhorando
- ✅ Validar impacto de campanhas/mudanças
- ✅ Tomar decisões baseadas em tendências, não snapshots

#### 3.1.2 Metas e Benchmarks Configuráveis
**Problema:** Thresholds de "saúde" estão hardcoded
**Solução:**
- Página de configuração de metas por etapa
- Metas ajustáveis por período (ex: meta de Q4 2025)
- Comparação automática com benchmarks de mercado (ortodontia)

**Backend Required:**
```sql
CREATE TABLE funnel_targets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  metric_name VARCHAR(100) NOT NULL,
  target_value DECIMAL(5,2) NOT NULL,
  warning_threshold DECIMAL(5,2) NOT NULL,
  critical_threshold DECIMAL(5,2) NOT NULL,
  period_start DATE,
  period_end DATE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Impacto Esperado:**
- ✅ Metas realistas baseadas em histórico próprio
- ✅ Alertas automáticos quando abaixo de meta
- ✅ Gamificação (atingir metas)

### FASE 2: Drill-down e Segmentação (Prioridade ALTA) 🔴

#### 3.2.1 Drill-down Clicável
**Problema:** Ver número agregado, mas não saber QUEM são os pacientes
**Solução:**
- Cada card do funil clicável
- Modal ou nova página listando pacientes específicos daquela etapa
- Filtros adicionais dentro do drill-down

**Exemplo de Interação:**
```
User clica em "Contatado: 45"
  ↓
Abre modal com lista de 45 pacientes
  - Nome, data de contato, ortodontista responsável, cidade
  - Botões de ação: "Agendar", "Marcar como prioridade"
  - Exportar lista para CSV
```

**Impacto Esperado:**
- ✅ Ação imediata sobre pacientes estagnados
- ✅ Identificar padrões (ex: todos de uma mesma cidade)
- ✅ Responsabilização da equipe comercial

#### 3.2.2 Segmentação Avançada
**Problema:** Não há filtros além de data
**Solução:**
```typescript
interface FunnelFilters {
  dateRange: DateRange
  cities?: string[]
  states?: string[]
  orthodontists?: number[]
  sources?: ('organic' | 'paid' | 'direct' | 'referral')[]
  ageRange?: { min: number, max: number }
  treatmentType?: string[]
}
```

**UI Proposta:**
- Painel lateral de filtros (estilo e-commerce)
- Multi-select para cidades, ortodontistas
- Tags visuais mostrando filtros ativos
- "Salvar filtros" como preset

**Casos de Uso:**
1. **Por Cidade**: "Como está a conversão em São Paulo vs Campinas?"
2. **Por Ortodontista**: "Qual ortodontista tem melhor taxa de conversão?"
3. **Por Origem**: "SEO orgânico converte melhor que tráfego pago?"

**Impacto Esperado:**
- ✅ Identificar mercados/parceiros de alto desempenho
- ✅ Realocar recursos para canais mais eficientes
- ✅ Personalizar estratégias por segmento

### FASE 3: Análise Preditiva e Proativa (Prioridade MÉDIA) 🟡

#### 3.3.1 Projeções e Forecasting
**Problema:** Não há visibilidade de onde estaremos no futuro
**Solução:**
- Algoritmo de regressão linear para projetar próximos 30/60/90 dias
- Simulador: "Se melhorarmos taxa X em Y%, quantos convertidos teremos?"
- Alertas proativos: "No ritmo atual, não atingirá meta do mês"

**Exemplo de UI:**
```
📈 Projeção para Final do Mês
Convertidos projetados: 42 (meta: 50)
⚠️ Déficit de 8 conversões
💡 Ação sugerida: Aumentar taxa de agendamento de 60% para 73%
```

**Backend Required:**
- Histórico de métricas armazenado (tabela `funnel_metrics_daily`)
- Modelo de ML simples (Python/TensorFlow) ou regressão linear
- Cron job para atualizar projeções diariamente

**Impacto Esperado:**
- ✅ Agir antes do problema acontecer
- ✅ Planejar contratações com antecedência
- ✅ Validar impacto de mudanças em tempo real

#### 3.3.2 Insights Automáticos com IA
**Problema:** Usuário precisa interpretar todos os dados manualmente
**Solução:**
- Sistema de insights automáticos usando GPT-4
- Análise de padrões e anomalias
- Recomendações acionáveis

**Exemplos de Insights:**
```
🔍 Insight 1: Taxa de cancelamento aumentou 15% na última semana.
   Principais motivos identificados: tempo de espera para agendamento.
   💡 Ação: Priorizar agendamentos em até 48h.

🔍 Insight 2: Ortodontista Dr. João tem 85% de conversão vs média de 65%.
   💡 Ação: Entrevistar para identificar melhores práticas.

🔍 Insight 3: Pacientes de Campinas têm 2x mais chance de cancelar.
   💡 Ação: Revisar processo de qualificação de leads desta região.
```

**Implementação:**
- Endpoint `/api/insights/generate` que analisa métricas
- Cache de insights por 24h
- UI com cards de insights no topo da página

**Impacto Esperado:**
- ✅ Democratizar análise (não precisa ser expert)
- ✅ Descobrir padrões não óbvios
- ✅ Priorizar ações com maior ROI

### FASE 4: ROI e Financeiro (Prioridade MÉDIA) 🟡

#### 3.4.1 Custo de Aquisição de Cliente (CAC)
**Problema:** Não sabe quanto custa adquirir cada paciente
**Solução:**
```typescript
interface CACMetrics {
  totalMarketingSpend: number
  totalSalesSpend: number
  newCustomers: number
  cac: number // (marketing + sales) / newCustomers
  cacBySou rce: Record<string, number>
  ltv: number // Lifetime Value (futuro)
  ltvCacRatio: number // Ideal: 3:1
}
```

**Dados Necessários:**
- Integração com ferramentas de ads (Google Ads, Meta Ads)
- Custo da equipe comercial (salários, ferramentas)
- Ticket médio de tratamento ortodôntico

**UI Proposta:**
```
┌─────────────────────────────────────┐
│ CAC Médio: R$ 450,00               │
│ LTV: R$ 4.500,00                   │
│ Ratio: 10:1 ✅ (Excelente)         │
└─────────────────────────────────────┘

Breakdown por Canal:
- SEO Orgânico: R$ 120,00 (melhor ROI)
- Google Ads: R$ 680,00
- Meta Ads: R$ 920,00
```

**Impacto Esperado:**
- ✅ Cortar canais não rentáveis
- ✅ Escalar canais de alto ROI
- ✅ Justificar budget de marketing com dados

#### 3.4.2 Análise de Coorte
**Problema:** Não rastreia grupos de pacientes ao longo do tempo
**Solução:**
- Agrupar pacientes por mês de cadastro
- Ver evolução de cada coorte através do funil
- Identificar mudanças na qualidade de leads

**Visualização:**
```
Coorte    | Cadastros | Conv. 30d | Conv. 60d | Conv. 90d
----------|-----------|-----------|-----------|----------
Jan/2025  |    120    |   15%     |   28%     |   35%
Feb/2025  |    145    |   18%     |   32%     |   ?
Mar/2025  |    138    |   20%     |   ?       |   ?
```

**Insights Possíveis:**
- "Coortes recentes estão convertendo mais rápido" → Processo melhorou
- "Coorte de Jan tem conversão estagnada em 60d" → Reengajar?

**Impacto Esperado:**
- ✅ Entender impacto de mudanças ao longo do tempo
- ✅ Identificar "vintage" de leads (qualidade por época)
- ✅ Otimizar tempo de nurturing

### FASE 5: Colaboração e Governança (Prioridade BAIXA) 🟢

#### 3.5.1 Comentários e Anotações
**Solução:**
- Permitir adicionar comentários em datas específicas
- Marcar eventos (lançamento de campanha, mudança de processo)
- Timeline visual com anotações

**Exemplo:**
```
📌 15/10/2025 - Lançamento campanha Meta Ads
📌 20/10/2025 - Contratação de 2 atendentes
📌 01/11/2025 - Mudança no script de atendimento
```

**Impacto:**
- ✅ Correlacionar mudanças com resultados
- ✅ Documentar histórico de decisões

#### 3.5.2 Alertas e Notificações
**Solução:**
- Webhooks para Slack/Email/WhatsApp
- Alertas personalizáveis por métrica

**Exemplos:**
```
⚠️ Taxa de agendamento caiu abaixo de 50% (meta: 60%)
🎉 Conversão do mês ultrapassou meta de 50 pacientes!
📉 Tempo de resposta aumentou para 12h (meta: <6h)
```

---

## 📋 4. PRIORIZAÇÃO E ROADMAP

### Sprint 1 (2 semanas) - Comparações e Contexto
- [ ] Implementar comparação de períodos (previous_period)
- [ ] Adicionar indicadores de variação (↑ ↓ percentual)
- [ ] Criar tabela `funnel_targets` no banco
- [ ] Página de configuração de metas

**Entregáveis:**
- ✅ Usuário pode comparar "este mês vs mês passado"
- ✅ Vê se cada métrica melhorou ou piorou
- ✅ Pode configurar metas personalizadas

### Sprint 2 (2 semanas) - Drill-down e Segmentação
- [ ] Tornar cards do funil clicáveis
- [ ] Modal de drill-down com lista de pacientes
- [ ] Filtros por cidade, estado, ortodontista
- [ ] Salvar presets de filtros

**Entregáveis:**
- ✅ Clicar em "Contatado: 45" abre lista de 45 pacientes
- ✅ Filtrar funil por "São Paulo" ou "Dr. João"
- ✅ Exportar lista de pacientes para CSV

### Sprint 3 (3 semanas) - Projeções e Insights
- [ ] Algoritmo de forecast (regressão linear)
- [ ] UI de projeções para próximos 30/60/90 dias
- [ ] Sistema de insights automáticos
- [ ] Integração com OpenAI API

**Entregáveis:**
- ✅ Ver projeção: "No ritmo atual, teremos X conversões"
- ✅ Receber 3-5 insights automáticos por dia
- ✅ Simulador: "E se melhorarmos X em Y%?"

### Sprint 4 (2 semanas) - ROI e Financeiro
- [ ] Integração com Google Ads API
- [ ] Integração com Meta Ads API
- [ ] Cálculo de CAC por canal
- [ ] Dashboard de ROI/LTV

**Entregáveis:**
- ✅ Ver CAC por canal de aquisição
- ✅ Ratio LTV:CAC calculado automaticamente
- ✅ Identificar canais não rentáveis

### Sprint 5 (2 semanas) - Análise de Coorte
- [ ] Tabela de coortes por mês de cadastro
- [ ] Visualização de evolução de coortes
- [ ] Comparação entre coortes

**Entregáveis:**
- ✅ Ver como coorte de Janeiro evoluiu ao longo de 90 dias
- ✅ Comparar qualidade de leads entre meses

### Sprint 6+ (Futuro) - Colaboração e Alertas
- [ ] Sistema de comentários/anotações
- [ ] Webhooks para Slack
- [ ] Alertas personalizáveis
- [ ] Dashboards salvos

---

## 🎨 5. WIREFRAMES E MOCKUPS (Propostas)

### 5.1 Nova Estrutura da Página

```
┌────────────────────────────────────────────────────────────┐
│  BI de Conversão                              [Atualizar]  │
│  Funil completo: SEO → Cadastro → Conversão                │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  [Últimos 30 dias ▼]  [vs Período anterior ▼]              │
│  [+ Adicionar Filtros]  [💾 Salvar Preset]                 │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  📊 INSIGHTS AUTOMÁTICOS                                   │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔍 Taxa de cancelamento aumentou 15% na última      │ │
│  │    semana. Principal gargalo: tempo de agendamento. │ │
│  │    💡 Ação sugerida: Priorizar agendamentos <48h    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  📈 PROJEÇÕES                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Convertidos projetados (fim do mês): 42 / 50 (meta) │ │
│  │ ⚠️ Déficit de 8 conversões                           │ │
│  │ 💡 Para atingir: aumentar agendamentos de 60% → 73% │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  FUNIL DE CONVERSÃO INTERATIVO                             │
│  (React Flow existente com drill-down)                     │
│  [Clicar em cada card abre modal com lista de pacientes]  │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  📊 MÉTRICAS COMPARADAS                                    │
│  ┌─────────────┬────────┬──────────┬─────────┐            │
│  │ Métrica     │ Atual  │ Anterior │ Variação│            │
│  ├─────────────┼────────┼──────────┼─────────┤            │
│  │ Conversão   │ 12.5%  │  10.8%   │ ↑ 15.7% │ ✅         │
│  │ CAC         │ R$ 450 │  R$ 520  │ ↓ 13.5% │ ✅         │
│  │ Agendamento │ 58%    │  62%     │ ↓ 6.5%  │ ⚠️         │
│  └─────────────┴────────┴──────────┴─────────┘            │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  💰 ANÁLISE FINANCEIRA                                     │
│  CAC: R$ 450  |  LTV: R$ 4.500  |  Ratio: 10:1 ✅         │
│                                                             │
│  Breakdown por Canal:                                      │
│  ▓▓▓▓▓▓▓▓▓▓ SEO Orgânico   R$ 120  (melhor ROI)           │
│  ▓▓▓▓▓▓░░░░ Google Ads      R$ 680                         │
│  ▓▓▓░░░░░░░ Meta Ads        R$ 920                         │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### 5.2 Modal de Drill-down (Novo)

```
┌────────────────────────────────────────────────┐
│  45 Pacientes no status "Contatado"      [X]  │
├────────────────────────────────────────────────┤
│  [🔍 Buscar]  [Exportar CSV]                  │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ Nome             │ Data     │ Ortodont.  │ │
│  ├──────────────────┼──────────┼───────────┤ │
│  │ Maria Silva      │ 01/12    │ Dr. João  │ │
│  │ João Santos      │ 29/11    │ Dra. Ana  │ │
│  │ Ana Costa        │ 28/11    │ Dr. João  │ │
│  │ ...              │ ...      │ ...       │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Ações em lote:                                │
│  [📞 Ligar]  [📧 Enviar email]  [⭐ Priorizar]│
└────────────────────────────────────────────────┘
```

---

## 📊 6. MÉTRICAS DE SUCESSO

### KPIs para Avaliar Melhorias:

#### Antes (Baseline Atual):
- Tempo médio para identificar gargalo: **~30 minutos**
- Número de ações tomadas por semana: **~5 ações**
- Taxa de conversão geral: **X%** (baseline)
- Satisfação da equipe com BI: **?/10** (medir)

#### Depois (Metas):
- Tempo para identificar gargalo: **<5 minutos** (redução de 83%)
- Ações tomadas por semana: **>15 ações** (aumento de 3x)
- Taxa de conversão geral: **+10-20%** (melhoria via otimizações)
- Satisfação da equipe: **>8/10**

#### Métricas de Uso da Ferramenta:
- DAU (Daily Active Users) do BI
- Tempo médio na página
- Número de drill-downs realizados
- Presets de filtros salvos
- Insights marcados como úteis

---

## 💡 7. CONSIDERAÇÕES TÉCNICAS

### 7.1 Arquitetura Backend

**Novos Endpoints Necessários:**
```
GET  /api/conversion-funnel/compare              // Comparação de períodos
GET  /api/conversion-funnel/drill-down/:stage    // Lista pacientes por etapa
POST /api/conversion-funnel/filters              // Aplicar filtros avançados
GET  /api/conversion-funnel/forecast             // Projeções
GET  /api/conversion-funnel/insights             // Insights automáticos
GET  /api/conversion-funnel/cohorts              // Análise de coorte
GET  /api/conversion-funnel/cac                  // Métricas financeiras
```

**Novas Tabelas:**
```sql
-- Histórico diário de métricas (para forecasting)
CREATE TABLE funnel_metrics_daily (
  date DATE PRIMARY KEY,
  impressions INT,
  clicks INT,
  registrations INT,
  novo INT,
  contatado INT,
  atribuido INT,
  agendado INT,
  avaliacao_inicial INT,
  convertido INT,
  cancelado INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Metas configuráveis
CREATE TABLE funnel_targets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  metric_name VARCHAR(100),
  target_value DECIMAL(5,2),
  warning_threshold DECIMAL(5,2),
  critical_threshold DECIMAL(5,2),
  period_start DATE,
  period_end DATE
);

-- Gastos com marketing por canal
CREATE TABLE marketing_spend (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE,
  channel ENUM('seo', 'google_ads', 'meta_ads', 'other'),
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anotações/Eventos
CREATE TABLE funnel_annotations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE,
  title VARCHAR(255),
  description TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7.2 Integrações Externas

**APIs Necessárias:**
1. **Google Ads API** - Custo de campanhas
2. **Meta Ads API** - Custo de campanhas
3. **OpenAI API** - Geração de insights
4. **Slack Webhooks** - Notificações

**Autenticação:**
- OAuth 2.0 para Google/Meta
- API Keys para OpenAI
- Webhooks seguros com assinatura

### 7.3 Performance e Escalabilidade

**Otimizações:**
- Cache de métricas com Redis (TTL 5min)
- Materializar funnel_metrics_daily via cron job diário
- Pagination no drill-down (500 pacientes por página)
- Lazy loading de insights (carregar sob demanda)

**Monitoramento:**
- Query performance (<200ms P95)
- API response time (<1s P95)
- Cache hit rate (>80%)

---

## 🎯 8. QUICK WINS (Implementação Rápida)

Se precisar entregar valor imediato, priorize:

### Week 1 - Quick Win #1: Comparação Básica
- Endpoint `/api/conversion-funnel/compare?period=previous`
- UI mostrando valores lado a lado com % de variação
- **Impacto:** Alto | **Esforço:** Baixo

### Week 1 - Quick Win #2: Drill-down Simples
- Modal listando pacientes ao clicar em card
- Sem filtros avançados, apenas lista básica
- **Impacto:** Alto | **Esforço:** Baixo

### Week 2 - Quick Win #3: Filtro por Cidade
- Dropdown simples de cidades
- Aplicar filtro na query existente
- **Impacto:** Médio | **Esforço:** Muito Baixo

---

## 📚 9. REFERÊNCIAS E BENCHMARKS

### Ferramentas Inspiradoras:
1. **Mixpanel** - Funil, drill-down, cohorts
2. **Amplitude** - Insights automáticos, forecasting
3. **Google Analytics 4** - Funil de conversão
4. **HubSpot** - Funil de vendas, relatórios

### Benchmarks de Mercado (Ortodontia Digital):
- CTR médio Google: **2-5%**
- Cadastro/Clique: **8-12%**
- Agendamento/Contato: **50-70%**
- Conversão final: **30-50%** (dos agendados)
- CAC médio: **R$ 300-800**

---

## ✅ 10. PRÓXIMOS PASSOS

1. **Validar Prioridades** com stakeholders (CEO, comercial, ortodontistas)
2. **Estimar Esforço** de cada feature (planning poker)
3. **Definir MVP** (Minimum Viable Product) da Fase 1
4. **Prototipar** wireframes com Figma
5. **Desenvolver** Sprint 1 (2 semanas)
6. **Medir** KPIs de sucesso

---

## 📞 Contato e Feedback

Este documento é vivo e deve ser atualizado conforme:
- Feedback de usuários
- Mudanças no negócio
- Novas tecnologias disponíveis
- Resultados das sprints

**Última atualização:** 03/12/2025
**Versão:** 1.0
