# 🎯 Roadmap: BI de Conversão - Funil Completo de Vendas

**Data de Criação**: 26/11/2025
**Última Atualização**: 26/11/2025
**Status**: Em Planejamento
**Prioridade**: Alta

---

## 📊 Objetivo

Criar um dashboard de BI de Conversão que mapeia **TODA a jornada de compra** do paciente, desde a primeira impressão no Google até o início do tratamento, alinhado com os status da tabela `patient_leads`.

---

## 🔄 Funil de Conversão Completo (B2C - Pacientes)

### Status Atual da Jornada (Conforme Migration 010)

```
novo → contatado → agendado → avaliacao_inicial → atribuido → convertido | cancelado
```

### Mapeamento do Funil Completo

| Etapa | Fonte de Dados | Status no CRM | Métrica | Descrição |
|-------|----------------|---------------|---------|-----------|
| **1. Impressões** | Google Search Console | - | `seo.impressions` | Quantas vezes o site apareceu no Google |
| **2. Cliques** | Google Search Console | - | `seo.clicks` | Quantos usuários clicaram no site |
| **3. Leads Novos** | CRM (`patient_leads`) | `novo` | `crm.novo` | Usuários que preencheram o formulário |
| **4. Contatados** | CRM (`patient_leads`) | `contatado` | `crm.contatado` | Leads que foram contatados pela equipe |
| **5. Agendados** | CRM (`patient_leads`) | `agendado` | `crm.agendado` | Leads que agendaram avaliação inicial |
| **6. Avaliação Inicial** | CRM (`patient_leads`) | `avaliacao_inicial` | `crm.avaliacao_inicial` | Pacientes que compareceram à avaliação |
| **7. Atribuídos** | CRM (`patient_leads`) | `atribuido` | `crm.atribuido` | Pacientes atribuídos a um ortodontista |
| **8. Convertidos** | CRM (`patient_leads`) | `convertido` | `crm.convertido` | Pacientes que iniciaram tratamento |
| **❌ Cancelados** | CRM (`patient_leads`) | `cancelado` | `crm.cancelado` | Leads/pacientes que cancelaram em qualquer etapa |

---

## 🎯 Taxas de Conversão a Calcular

### Conversões Primárias (SEO → CRM)

1. **CTR (Click-Through Rate)**
   - `(cliques / impressões) × 100`
   - Meta: > 2.5%

2. **Clique → Lead**
   - `(leads novos / cliques) × 100`
   - Meta: > 15%

3. **Impressão → Lead**
   - `(leads novos / impressões) × 100`
   - Meta: > 0.3%

### Conversões Comerciais (CRM Pipeline)

4. **Novo → Contatado**
   - `(contatados / novos) × 100`
   - Meta: > 95% (quase 100% - SLA de contato)

5. **Contatado → Agendado**
   - `(agendados / contatados) × 100`
   - Meta: > 60%

6. **Agendado → Avaliação Inicial (Show-up Rate)**
   - `(avaliacao_inicial / agendados) × 100`
   - Meta: > 70%

7. **Avaliação Inicial → Atribuído**
   - `(atribuidos / avaliacao_inicial) × 100`
   - Meta: > 80%

8. **Atribuído → Convertido (Close Rate)**
   - `(convertidos / atribuidos) × 100`
   - Meta: > 70%

### Conversões Globais (End-to-End)

9. **Clique → Convertido**
   - `(convertidos / cliques) × 100`
   - Meta: > 5%

10. **Lead → Convertido**
    - `(convertidos / leads novos) × 100`
    - Meta: > 40%

### Taxa de Perda (Churn)

11. **Taxa de Cancelamento**
    - `(cancelados / total de leads) × 100`
    - Meta: < 15%

12. **Cancelamento por Etapa**
    - Novo → Cancelado
    - Contatado → Cancelado
    - Agendado → Cancelado (no-show)
    - Avaliação → Cancelado
    - Atribuído → Cancelado

---

## 🛠️ Plano de Implementação

### **Fase 1: Backend - API de Métricas do Funil Completo**

#### 1.1 Criar Endpoint de Funil Detalhado

**Arquivo**: `Backend/src/controllers/conversionFunnelController.js`

**Endpoint**: `GET /api/conversion-funnel/detailed-metrics`

**Query Params**:
- `startDate`: Data de início (formato: YYYY-MM-DD)
- `endDate`: Data de fim (formato: YYYY-MM-DD)

**Response Expected**:

```json
{
  "success": true,
  "period": {
    "startDate": "2025-10-01",
    "endDate": "2025-11-26",
    "days": 57
  },
  "seo": {
    "impressions": 8500,
    "clicks": 215,
    "ctr": 2.53,
    "avgPosition": 8.2
  },
  "crm": {
    "novo": 32,
    "contatado": 30,
    "agendado": 18,
    "avaliacao_inicial": 13,
    "atribuido": 10,
    "convertido": 7,
    "cancelado": 5
  },
  "conversions": {
    "ctr": 2.53,
    "clickToLead": 14.88,
    "impressionToLead": 0.38,
    "novoToContatado": 93.75,
    "contatadoToAgendado": 60.00,
    "agendadoToAvaliacaoInicial": 72.22,
    "avaliacaoInicialToAtribuido": 76.92,
    "atribuidoToConvertido": 70.00,
    "clickToConvertido": 3.26,
    "leadToConvertido": 21.88,
    "cancellationRate": 15.63
  },
  "cancellationBreakdown": {
    "novoToCancelado": 1,
    "contatadoToCancelado": 2,
    "agendadoToCancelado": 5,
    "avaliacaoInicialToCancelado": 3,
    "atribuidoToCancelado": 3
  }
}
```

**SQL Queries Necessárias**:

```sql
-- 1. Contar leads por status (período selecionado)
SELECT
  status,
  COUNT(*) as count
FROM patient_leads
WHERE created_at >= ? AND created_at <= ?
GROUP BY status;

-- 2. Métricas SEO (do Google Search Console)
SELECT
  SUM(impressions) as total_impressions,
  SUM(clicks) as total_clicks,
  AVG(ctr) as avg_ctr,
  AVG(position) as avg_position
FROM seo_metrics_history
WHERE date >= ? AND date <= ?;

-- 3. Análise de cancelamentos por etapa (opcional)
-- Requer campo `previous_status` ou histórico de mudanças
```

#### 1.2 Adicionar Tracking de Transições de Status

**Problema**: Atualmente não sabemos QUANDO um lead mudou de status.

**Solução**: Criar tabela de histórico de status.

**Migration**: `011_create_patient_status_history.sql`

```sql
CREATE TABLE IF NOT EXISTS patient_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  previous_status ENUM('novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado'),
  new_status ENUM('novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado') NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by INT, -- user_id que fez a mudança
  notes TEXT,
  FOREIGN KEY (patient_id) REFERENCES patient_leads(id) ON DELETE CASCADE,
  INDEX idx_patient_id (patient_id),
  INDEX idx_new_status (new_status),
  INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT 'Historical log of patient status transitions for funnel analysis';
```

**Trigger para Popular Automaticamente**:

```sql
DELIMITER $$

CREATE TRIGGER patient_status_change_tracker
AFTER UPDATE ON patient_leads
FOR EACH ROW
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO patient_status_history (
      patient_id,
      previous_status,
      new_status,
      changed_at,
      notes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NOW(),
      CONCAT('Status changed from ', OLD.status, ' to ', NEW.status)
    );
  END IF;
END$$

DELIMITER ;
```

#### 1.3 Criar Query Avançada de Análise de Funil com Tempo Médio

```sql
-- Análise de funil com tempo médio entre estágios
SELECT
  'novo → contatado' as transition,
  COUNT(DISTINCT h1.patient_id) as count,
  AVG(TIMESTAMPDIFF(HOUR, p.created_at, h1.changed_at)) as avg_hours
FROM patient_status_history h1
JOIN patient_leads p ON h1.patient_id = p.id
WHERE h1.new_status = 'contatado'
  AND h1.changed_at >= ? AND h1.changed_at <= ?

UNION ALL

SELECT
  'contatado → agendado' as transition,
  COUNT(DISTINCT h2.patient_id) as count,
  AVG(TIMESTAMPDIFF(HOUR, h1.changed_at, h2.changed_at)) as avg_hours
FROM patient_status_history h1
JOIN patient_status_history h2 ON h1.patient_id = h2.patient_id
WHERE h1.new_status = 'contatado'
  AND h2.new_status = 'agendado'
  AND h2.changed_at > h1.changed_at
  AND h2.changed_at >= ? AND h2.changed_at <= ?

-- ... (repetir para cada transição)
```

---

### **Fase 2: Frontend - Dashboard Visual do Funil Completo**

#### 2.1 Refatorar `Admin/src/app/admin/bi-conversao/page.tsx`

**Melhorias a Implementar**:

1. **Adicionar todas as 7 etapas do funil** (atualmente só tem 4)
   - Novo
   - Contatado
   - Agendado
   - Avaliação Inicial
   - Atribuído
   - Convertido
   - Cancelado (barra lateral vermelha)

2. **Adicionar Sankey Diagram** para visualizar fluxo completo
   - Biblioteca: `react-flow` ou `recharts` com customização

3. **Adicionar Tempo Médio entre Etapas**
   - "Novo → Contatado: 2.3 horas"
   - "Contatado → Agendado: 18 horas"
   - "Agendado → Avaliação: 5 dias"

4. **Adicionar Indicadores de Saúde do Funil**
   - Verde: Taxa acima da meta
   - Amarelo: Taxa entre 80-100% da meta
   - Vermelho: Taxa abaixo de 80% da meta

5. **Adicionar Gráfico de Tendência Temporal**
   - Conversão semanal/mensal ao longo do tempo
   - Identificar sazonalidade

6. **Adicionar Breakdown de Cancelamentos**
   - Quantos cancelaram em cada etapa
   - Principais motivos (se houver campo de motivo)

#### 2.2 Componente de Visualização de Funil

**Arquivo**: `Admin/src/components/conversion-funnel/FunnelVisualization.tsx`

```tsx
interface FunnelStep {
  label: string
  value: number
  color: string
  icon: React.ReactNode
  conversionRate?: number
  avgTime?: string
  status: 'healthy' | 'warning' | 'critical'
}

export function FunnelVisualization({ steps }: { steps: FunnelStep[] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const nextStep = steps[index + 1]
        const width = (step.value / steps[0].value) * 100

        return (
          <div key={index}>
            {/* Funnel Step Bar */}
            <div
              className={`rounded-lg p-6 border-2 transition-all hover:shadow-lg`}
              style={{
                width: `${width}%`,
                backgroundColor: step.color,
                borderColor: step.status === 'critical' ? 'red' : 'transparent'
              }}
            >
              <div className="flex items-center gap-3">
                {step.icon}
                <div>
                  <div className="text-sm text-gray-600">{step.label}</div>
                  <div className="text-2xl font-bold">{step.value}</div>
                  {step.avgTime && (
                    <div className="text-xs text-gray-500">
                      Tempo médio: {step.avgTime}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Conversion Arrow */}
            {nextStep && (
              <div className="flex items-center justify-center py-2">
                <ArrowDown className="h-6 w-6 text-gray-400" />
                <div className={`ml-2 font-bold ${
                  step.conversionRate >= 70 ? 'text-green-600' :
                  step.conversionRate >= 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {step.conversionRate}%
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

---

### **Fase 3: Alertas e Insights Automatizados**

#### 3.1 Sistema de Alertas de Performance

**Alertas a Criar**:

1. **Taxa de Conversão Abaixo da Meta**
   - "Alerta: Taxa de Agendamento caiu para 45% (meta: 60%)"

2. **Tempo Médio Acima do Esperado**
   - "Alerta: Tempo médio Novo → Contatado é 12 horas (meta: 2 horas)"

3. **Spike de Cancelamentos**
   - "Alerta: 8 cancelamentos em 'agendado' nas últimas 24h (média: 2)"

4. **Gargalo Identificado**
   - "Alerta: 15 leads em 'contatado' há mais de 48h sem agendar"

#### 3.2 Painel de Insights AI

**Análises Automáticas**:

- "Sua taxa de conversão Clique → Lead (18%) está 20% acima da média do setor (15%)"
- "O tempo médio de resposta ao lead (1.2h) está excelente (meta: 2h)"
- "Oportunidade: 12 leads em 'avaliacao_inicial' podem ser impactados com follow-up"

---

### **Fase 4: Exportação e Relatórios**

#### 4.1 Exportar para Excel

**Botão**: "Exportar Relatório Completo (.xlsx)"

**Sheets do Excel**:

1. **Resumo Executivo**
   - Métricas principais
   - Taxas de conversão
   - Comparação com metas

2. **Funil Detalhado**
   - Todas as 7 etapas com números absolutos e percentuais

3. **Análise Temporal**
   - Conversão dia a dia
   - Tendências semanais

4. **Cancelamentos**
   - Breakdown por etapa
   - Motivos (se disponível)

5. **Tempo Médio**
   - Tempo entre cada transição

#### 4.2 Agendar Relatórios Automáticos

**Cron Job**: Enviar relatório semanal via email para administradores

---

## 📋 Checklist de Implementação

### Fase 1: Backend ✅ COMPLETA (26/11/2025)

- [x] Criar tabela `patient_status_history`
- [x] Criar trigger para popular histórico automaticamente (2 triggers: UPDATE + INSERT)
- [x] Criar endpoint `/api/conversion-funnel/detailed-metrics`
- [x] Implementar query de contagem por status
- [x] Implementar query de tempo médio entre transições
- [x] Implementar query de breakdown de cancelamentos
- [x] Adicionar validação de período (max 90 dias)
- [x] Adicionar indexes para performance (5 índices)
- [ ] Adicionar cache de 15 minutos para evitar queries pesadas (FUTURO)

**Status**: Backend completo e funcional. Endpoint pronto para uso.

**Arquivos Criados/Modificados**:
- `Backend/migrations/011_create_patient_status_history.sql` (NEW - 205 linhas)
- `Backend/src/services/conversionFunnelService.js` (+160 linhas)
- `Backend/src/controllers/conversionFunnelController.js` (+65 linhas)
- `Backend/src/routes/conversionFunnelRoutes.js` (+3 linhas)

**Como Testar**:
```bash
# 1. Rodar migration
node Backend/scripts/run-migration-011.js

# 2. Testar endpoint
curl "http://localhost:3001/api/conversion-funnel/detailed-metrics?startDate=2025-10-01&endDate=2025-11-26"
```

### Fase 2: Frontend 🎨 ✅ COMPLETA (26/11/2025)

- [x] Atualizar interface TypeScript para `DetailedFunnelMetrics`
- [x] Mudar API call para endpoint `/detailed-metrics`
- [x] Adicionar helper functions para health status
- [x] Adicionar novos ícones (Phone, UserCheck, Award, Clock, AlertCircle)
- [x] Refatorar visualização do funil com 7 etapas completas
- [x] Adicionar indicadores de saúde (verde/amarelo/vermelho) em cada etapa
- [x] Mostrar tempo médio de transição em cada seta (horas/dias)
- [x] Criar card de breakdown de cancelamentos com progress bars
- [x] Adicionar insight inteligente de gargalo (alerta amarelo)

**Status**: ✅ 100% Completa. Dashboard funcional com visualização completa do funil B2C.

**Arquivos Modificados**:

- `admin/src/app/admin/bi-conversao/page.tsx` (refatoração completa do funil)

**Funcionalidades Implementadas**:

1. **Funil Visual Completo**: 7 etapas (Impressões → Cliques → Novo → Contatado → Agendado → Avaliação → Atribuído → Convertido)
2. **Health Indicators**: Verde (>=target), Amarelo (>=80%), Vermelho (<80%)
3. **Transition Times**: Exibição de tempo médio entre etapas (horas ou dias)
4. **Cancellation Analysis**: Breakdown visual com identificação automática de maior gargalo
5. **Responsive Design**: Layout compacto que cabe em uma tela sem scroll excessivo

**Pendente para Fase 2.1 (opcional/futuro)**:

- [ ] Implementar filtros avançados (por fonte, por ortodontista, etc.)
- [ ] Adicionar comparação de períodos (este mês vs mês anterior)
- [ ] Adicionar gráfico de tendência temporal (line chart)

### Fase 3: Alertas 🚨

- [ ] Criar sistema de alertas de performance
- [ ] Implementar detecção de gargalos
- [ ] Adicionar painel de insights AI
- [ ] Criar notificações push para administradores

### Fase 4: Relatórios 📊

- [ ] Implementar exportação para Excel
- [ ] Criar relatório PDF formatado
- [ ] Agendar envio automático semanal via email
- [ ] Adicionar integração com Google Data Studio (opcional)

---

## 🎯 Métricas de Sucesso

### Objetivos Imediatos

- ✅ Visualizar funil completo com todas as 7 etapas
- ✅ Identificar gargalos em tempo real
- ✅ Tempo médio de resposta ao lead < 2 horas

### Objetivos a Médio Prazo

- ✅ Taxa de conversão Lead → Convertido > 40%
- ✅ Taxa de cancelamento < 15%
- ✅ Show-up rate (Agendado → Avaliação) > 70%

### Objetivos a Longo Prazo

- ✅ Previsibilidade: conseguir prever conversões com 85% de acurácia
- ✅ ROI: reduzir CAC (Custo de Aquisição de Cliente) em 20%
- ✅ Otimização: identificar etapa com maior potencial de melhoria

---

## 📝 Notas Técnicas

### Stack Atual

- **Frontend**: Next.js 15 + TypeScript + Shadcn/ui
- **Backend**: Node.js + Express + MySQL
- **APIs**: Google Search Console API v1
- **Charts**: Recharts (já instalado no projeto)

### Arquivos Principais

```
Backend/
  src/
    controllers/conversionFunnelController.js   # Controller principal
    services/conversionFunnelService.js         # Lógica de negócio
  migrations/
    011_create_patient_status_history.sql       # Tracking de transições

Admin/
  src/
    app/admin/bi-conversao/page.tsx             # Dashboard principal
    components/
      conversion-funnel/
        FunnelVisualization.tsx                  # Componente de funil
        CancellationBreakdown.tsx                # Análise de cancelamentos
        TimelineChart.tsx                        # Gráfico temporal
```

### Performance Considerations

- **Cache**: Usar cache de 15 minutos para métricas agregadas
- **Índices**: Garantir índices em `patient_id`, `status`, `created_at`, `changed_at`
- **Paginação**: Limitar resultados detalhados a 1000 registros
- **Background Jobs**: Processar relatórios pesados em background

---

## 🔗 Referências

- [Migration 010 - Patient Status](../Backend/migrations/010_add_patient_status_atribuido_avaliacao.sql)
- [BI Conversão Atual](../Admin/src/app/admin/bi-conversao/page.tsx)
- [Conversion Funnel Service](../Backend/src/services/conversionFunnelService.js)

---

**Última Atualização**: 26/11/2025
**Próxima Revisão**: Após Fase 1 completa
**Responsável**: Time de Produto + Dev
