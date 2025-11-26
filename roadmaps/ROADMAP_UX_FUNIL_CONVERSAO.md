# 🎨 Roadmap UX/UI: Dashboard de Funil de Conversão

**Objetivo**: Transformar o dashboard de conversão em uma ferramenta de analytics de classe mundial, seguindo as melhores práticas de UX/UI de empresas como Mixpanel, Amplitude, Segment, Google Analytics 4, e Heap Analytics.

**Status Atual**: Layout horizontal compacto implementado (Fase 1 completa)
**Próximas Fases**: 4 fases de evolução progressiva

---

## 📊 Análise da Situação Atual

### ✅ Pontos Fortes (já implementados)
- Layout horizontal compacto (2 linhas)
- Health indicators com cores semânticas
- Tooltips básicos on hover
- Gradientes nos cards para profundidade visual
- Transition times visíveis nas setas
- Drop-off summary no footer

### ❌ Pontos Fracos (a melhorar)
1. **Falta de interatividade avançada**: Não é possível clicar em estágios para drill-down
2. **Visualização estática**: Não mostra variação temporal (tendências)
3. **Densidade de informação limitada**: Muitos cards pequenos, informação fragmentada
4. **Falta de contexto**: Não compara com períodos anteriores
5. **Ausência de insights automáticos**: Não identifica anomalias ou oportunidades
6. **Responsividade limitada**: Layout fixo não se adapta bem a telas menores
7. **Falta de personalização**: Todos veem a mesma view
8. **Ausência de animações**: Transições bruscas, sem feedback visual suave

---

## 🎯 Referências e Benchmarking

### Top 5 Analytics Dashboards (Pesquisa 2024-2025)

#### 1. **Mixpanel Funnels** (Gold Standard)
**O que eles fazem bem:**
- Funil em forma de cone (Sankey diagram) com largura proporcional ao volume
- Drill-down ao clicar em qualquer etapa
- Comparação side-by-side de períodos
- Breakdown por propriedades (dispositivo, fonte, localização)
- Cohort analysis integrado
- Exportação de dados em CSV/PNG

**Aplicável ao Atma:**
- ✅ Sankey diagram (Fase 2)
- ✅ Drill-down (Fase 3)
- ✅ Comparação de períodos (Fase 2)
- ⚠️ Breakdown por propriedades (Fase 4 - se tivermos dados)

#### 2. **Amplitude Analytics**
**O que eles fazem bem:**
- Micro-interactions elegantes (hover, click, drag)
- Animated transitions entre estados
- Real-time data updates com pulse indicator
- Smart insights AI (detecta anomalias automaticamente)
- Collaborative features (comentários, anotações)
- Dark mode

**Aplicável ao Atma:**
- ✅ Micro-interactions (Fase 2)
- ✅ Animated transitions (Fase 2)
- ⚠️ Real-time updates (Fase 3 - se necessário)
- ⚠️ Smart insights (Fase 3 - com regras simples)
- ❌ Collaborative features (não prioritário)
- ✅ Dark mode (Fase 4)

#### 3. **Google Analytics 4 - Funnel Exploration**
**O que eles fazem bem:**
- Visualização compacta com mini sparklines
- Integrated filters no topo (data range, segmentos)
- Progressive disclosure (mais detalhes ao expandir)
- Benchmark comparisons (vs média da indústria)
- Export para Data Studio

**Aplicável ao Atma:**
- ✅ Mini sparklines (Fase 2)
- ✅ Integrated filters (Fase 2)
- ✅ Progressive disclosure (Fase 2)
- ❌ Benchmark comparisons (não temos dados da indústria)
- ⚠️ Export (Fase 3)

#### 4. **Segment - Journey Builder**
**O que eles fazem bem:**
- Visual flow builder interativo
- Real-time preview ao configurar
- Multi-step funnel (até 10 steps)
- Custom conversion windows
- A/B test integration

**Aplicável ao Atma:**
- ❌ Visual flow builder (complexo demais)
- ❌ A/B test integration (não temos A/B tests)
- ⚠️ Custom conversion windows (Fase 4)

#### 5. **Heap Analytics - Funnels**
**O que eles fazem bem:**
- Auto-capture de todos os eventos (não precisa instrumentar)
- Retroactive funnels (cria funil de dados passados)
- User-level drill-down (ver lista de usuários em cada etapa)
- Session replay integrado

**Aplicável ao Atma:**
- ❌ Auto-capture (precisaria de JS tracking)
- ❌ Retroactive funnels (nossos dados são limitados)
- ⚠️ User-level drill-down (Fase 3 - lista de pacientes)
- ❌ Session replay (não aplicável)

---

## 🗓️ Roadmap de Implementação

### **FASE 1: Foundation** ✅ COMPLETA (26/11/2025)

**Objetivo**: Layout horizontal compacto e funcional

**Implementado:**
- [x] Grid horizontal de 2 linhas (9 estágios)
- [x] Cards compactos com gradientes
- [x] Health indicators coloridos
- [x] Tooltips básicos on hover
- [x] Transition times nas setas
- [x] Drop-off summary
- [x] Legend para health colors

**Resultado**: Dashboard 70% mais compacto, toda informação visível sem scroll.

---

### **FASE 2: Interactivity & Context** 🎯 PRÓXIMA (4-5 dias)

**Objetivo**: Adicionar interatividade, contexto temporal e micro-animations

#### 2.1 Sankey Diagram Visualization (2 dias)

**Descrição**: Transformar as setas entre estágios em um fluxo visual tipo Sankey, onde a largura representa o volume de conversão.

**Mockup Conceitual:**
```
┌─────────┐
│ Impress.│ ════════════════╗
│  3.5k   │                 ║ 93 (2.7%)
└─────────┘                 ║
                           ╔╝
                      ┌────▼────┐
                      │ Cliques │ ═══════════╗
                      │   93    │            ║ 30 (32%)
                      └─────────┘            ║
                                            ╔╝
                                       ┌────▼────┐
                                       │Cadastros│
                                       │   30    │
                                       └─────────┘
```

**Implementação Técnica:**
```tsx
// Usar SVG path para criar fluxos variáveis
<svg className="absolute inset-0 pointer-events-none">
  <defs>
    <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
    </linearGradient>
  </defs>
  <path
    d={generateSankeyPath(stage1Pos, stage2Pos, volumePercentage)}
    fill="url(#flow-gradient)"
    stroke="#3b82f6"
    strokeWidth="2"
  />
</svg>

// Função helper para calcular path
function generateSankeyPath(start, end, volume) {
  const width = volume * 5; // largura proporcional ao volume
  return `M ${start.x} ${start.y}
          C ${start.x + 50} ${start.y},
            ${end.x - 50} ${end.y},
            ${end.x} ${end.y}`;
}
```

**Bibliotecas Sugeridas:**
- `react-flow` (mais completo, mas pesado - 150kb)
- `d3-sankey` (leve, 20kb, mas requer mais código)
- **Recomendação**: Implementação custom com SVG (mais leve e controlável)

**Benefícios:**
- Visualização imediata do volume em cada transição
- Identifica gargalos visualmente
- Mais próximo dos padrões de Mixpanel/Amplitude

---

#### 2.2 Period Comparison (1 dia)

**Descrição**: Adicionar comparação automática com período anterior (vs last 30 days).

**UI Mockup:**
```tsx
// Header do Card com toggle de comparação
<CardHeader>
  <div className="flex items-center justify-between">
    <CardTitle>Funil de Conversão Completo</CardTitle>
    <div className="flex items-center gap-2">
      <Switch
        checked={compareMode}
        onCheckedChange={setCompareMode}
        id="compare-mode"
      />
      <Label htmlFor="compare-mode" className="text-sm">
        Comparar com período anterior
      </Label>
    </div>
  </div>
</CardHeader>

// Card de estágio com comparação
<div className="relative">
  <div className="text-lg font-bold text-gray-900">
    {metrics.crm.registrations}
    {compareMode && (
      <span className={`text-sm ml-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </span>
    )}
  </div>
</div>
```

**Backend Changes:**
```javascript
// Adicionar no conversionFunnelService.js
async getDetailedFunnelMetricsWithComparison(startDate, endDate) {
  // Calcular período anterior com mesmo número de dias
  const daysDiff = this.calculateDaysBetween(startDate, endDate);
  const previousEndDate = new Date(startDate);
  previousEndDate.setDate(previousEndDate.getDate() - 1);
  const previousStartDate = new Date(previousEndDate);
  previousStartDate.setDate(previousStartDate.getDate() - daysDiff);

  // Buscar métricas dos dois períodos em paralelo
  const [currentMetrics, previousMetrics] = await Promise.all([
    this.getDetailedFunnelMetrics(startDate, endDate),
    this.getDetailedFunnelMetrics(
      previousStartDate.toISOString().split('T')[0],
      previousEndDate.toISOString().split('T')[0]
    )
  ]);

  // Calcular trends
  return {
    current: currentMetrics,
    previous: previousMetrics,
    trends: this.calculateTrends(currentMetrics, previousMetrics)
  };
}
```

**Benefícios:**
- Contexto temporal para decisões
- Identifica tendências positivas/negativas
- Padrão usado por Google Analytics e Mixpanel

---

#### 2.3 Micro-Interactions & Animations (1 dia)

**Descrição**: Adicionar animações suaves e feedback visual para melhorar a experiência.

**Animações a Implementar:**

**A) Fade-in ao carregar:**
```tsx
import { motion } from 'framer-motion';

// Cada stage card entra com delay incremental
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: stageIndex * 0.05 }}
>
  {/* Stage card content */}
</motion.div>
```

**B) Number counter animation:**
```tsx
import { useSpring, animated } from '@react-spring/web';

function AnimatedNumber({ value }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  return <animated.span>{number.to(n => n.toFixed(0))}</animated.span>;
}
```

**C) Pulse effect em conversão crítica:**
```css
@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
}

.critical-conversion {
  animation: pulse-red 2s infinite;
}
```

**D) Hover state enhancement:**
```tsx
<motion.div
  whileHover={{
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: { duration: 0.2 }
  }}
  whileTap={{ scale: 0.98 }}
>
  {/* Stage card */}
</motion.div>
```

**Bibliotecas:**
- `framer-motion` (40kb) - Animações declarativas
- `react-spring` (25kb) - Animações de números
- **Recomendação**: Usar ambas, são leves e complementares

---

#### 2.4 Mini Sparklines (1 dia)

**Descrição**: Adicionar mini gráficos de tendência dentro de cada card mostrando a evolução dos últimos 7 dias.

**UI Mockup:**
```tsx
import { Sparklines, SparklinesLine } from 'react-sparklines';

<div className="relative group cursor-pointer">
  <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 rounded-lg p-3">
    {/* Existing content */}
    <div className="text-lg font-bold text-gray-900">3.5k</div>

    {/* NEW: Mini sparkline */}
    <div className="mt-2 h-8">
      <Sparklines data={last7DaysData} width={100} height={30}>
        <SparklinesLine color="#3b82f6" />
      </Sparklines>
    </div>
  </div>
</div>
```

**Backend Changes:**
```javascript
// Adicionar ao getDetailedFunnelMetrics
async getDetailedFunnelMetrics(startDate, endDate) {
  // ... existing code ...

  // Buscar últimos 7 dias para sparklines
  const sparklineData = await this.getLast7DaysTrend(endDate);

  return {
    // ... existing return ...
    sparklines: {
      impressions: sparklineData.impressions,
      clicks: sparklineData.clicks,
      registrations: sparklineData.registrations,
      // ... outros stages ...
    }
  };
}

async getLast7DaysTrend(endDate) {
  const end = new Date(endDate);
  const start = new Date(end);
  start.setDate(start.getDate() - 7);

  const dailyData = await this.getDailyBreakdown(
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  );

  return {
    impressions: dailyData.data.map(d => d.impressions),
    clicks: dailyData.data.map(d => d.clicks),
    registrations: dailyData.data.map(d => d.registrations),
    // ... etc
  };
}
```

**Bibliotecas:**
- `react-sparklines` (10kb, leve e simples)
- Alternative: `recharts` (já usamos no projeto, mas mais pesado)

---

#### 2.5 Enhanced Tooltips (0.5 dia)

**Descrição**: Tooltips mais ricos com múltiplas informações e formatação melhor.

**Antes:**
```tsx
<div className="bg-gray-900 text-white text-xs rounded px-2 py-1">
  3,460 impressões
</div>
```

**Depois:**
```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip delayDuration={200}>
    <TooltipTrigger asChild>
      <div className="cursor-pointer">{/* Stage card */}</div>
    </TooltipTrigger>
    <TooltipContent className="max-w-xs p-4 space-y-2">
      <div className="font-semibold border-b pb-2">Impressões (Google)</div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-400">Total:</div>
        <div className="font-bold">{metrics.seo.impressions.toLocaleString('pt-BR')}</div>

        <div className="text-gray-400">Posição Média:</div>
        <div className="font-bold">{metrics.seo.avgPosition}</div>

        <div className="text-gray-400">Período:</div>
        <div>{period.days} dias</div>

        <div className="text-gray-400">Taxa de Crescimento:</div>
        <div className={trend >= 0 ? 'text-green-400' : 'text-red-400'}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      </div>

      {/* Mini chart no tooltip */}
      <div className="pt-2 border-t">
        <div className="text-xs text-gray-400 mb-1">Últimos 7 dias:</div>
        <Sparklines data={sparklineData} width={200} height={40}>
          <SparklinesLine color="#3b82f6" />
        </Sparklines>
      </div>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Benefícios:**
- Mais informações sem poluir a UI
- Progressive disclosure (detalhes on demand)
- Melhor aproveitamento do espaço

---

### **Checklist Fase 2:**
- [ ] Implementar Sankey diagram com SVG paths
- [ ] Adicionar period comparison (vs período anterior)
- [ ] Implementar micro-animations com framer-motion
- [ ] Adicionar mini sparklines em cada card
- [ ] Melhorar tooltips com mais informações
- [ ] Testar performance com animações
- [ ] Garantir responsividade em telas menores

**Estimativa**: 4-5 dias de desenvolvimento
**Dependências**: Nenhuma (pode começar imediatamente)

---

### **FASE 3: Intelligence & Drill-Down** 🔮 (5-7 dias)

**Objetivo**: Adicionar inteligência automática para identificar insights e permitir drill-down nos dados.

#### 3.1 Smart Insights (2 dias)

**Descrição**: Sistema automático que analisa os dados e identifica anomalias, oportunidades e alertas.

**Tipos de Insights:**

**A) Anomaly Detection:**
```javascript
// No conversionFunnelService.js
function detectAnomalies(currentMetrics, historicalAverage) {
  const insights = [];

  // 1. Conversão significativamente abaixo da média
  if (currentMetrics.conversions.clickToRegistration < historicalAverage.clickToRegistration * 0.8) {
    insights.push({
      type: 'warning',
      severity: 'high',
      stage: 'clickToRegistration',
      message: `Taxa de conversão Cliques→Cadastros está ${((1 - currentMetrics.conversions.clickToRegistration / historicalAverage.clickToRegistration) * 100).toFixed(0)}% abaixo da média histórica`,
      recommendation: 'Verifique landing pages e formulários de cadastro',
      icon: 'alert-triangle'
    });
  }

  // 2. Gargalo crítico (drop-off > 70%)
  const dropoffs = {
    'Contatado→Agendado': currentMetrics.conversions.contatadoToAgendado,
    'Agendado→Avaliação': currentMetrics.conversions.agendadoToAvaliacaoInicial,
    'Avaliação→Atribuído': currentMetrics.conversions.avaliacaoInicialToAtribuido
  };

  Object.entries(dropoffs).forEach(([stage, rate]) => {
    if (rate < 30) { // menos de 30% convertendo
      insights.push({
        type: 'critical',
        severity: 'high',
        stage,
        message: `Gargalo crítico em ${stage}: apenas ${rate}% convertendo`,
        recommendation: `Priorize otimizações na etapa de ${stage.split('→')[0]}`,
        icon: 'x-circle'
      });
    }
  });

  // 3. Performance excepcional (acima de 20% da média)
  if (currentMetrics.conversions.atribuidoToConvertido > historicalAverage.atribuidoToConvertido * 1.2) {
    insights.push({
      type: 'success',
      severity: 'info',
      stage: 'atribuidoToConvertido',
      message: `Conversão Atribuído→Convertido está ${((currentMetrics.conversions.atribuidoToConvertido / historicalAverage.atribuidoToConvertido - 1) * 100).toFixed(0)}% acima da média!`,
      recommendation: 'Documente o que está funcionando bem nesta etapa',
      icon: 'trending-up'
    });
  }

  // 4. Tempo de transição anormal
  if (currentMetrics.transitionTimes.novo_to_contatado?.avgDays > 3) {
    insights.push({
      type: 'warning',
      severity: 'medium',
      stage: 'novo_to_contatado',
      message: `Tempo médio Novo→Contatado está alto: ${currentMetrics.transitionTimes.novo_to_contatado.avgDays} dias`,
      recommendation: 'Considere aumentar velocidade de resposta ao primeiro contato',
      icon: 'clock'
    });
  }

  return insights.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
```

**UI Component:**
```tsx
{insights.length > 0 && (
  <Card className="border-l-4 border-l-blue-500">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-blue-600" />
        Insights Automáticos ({insights.length})
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {insights.map((insight, idx) => (
        <Alert key={idx} variant={insight.type}>
          <Icon name={insight.icon} className="h-4 w-4" />
          <AlertTitle>{insight.message}</AlertTitle>
          <AlertDescription>
            💡 {insight.recommendation}
          </AlertDescription>
        </Alert>
      ))}
    </CardContent>
  </Card>
)}
```

---

#### 3.2 Drill-Down Modal (2 dias)

**Descrição**: Ao clicar em qualquer estágio, abrir modal com detalhes profundos sobre aquela etapa.

**UI Mockup:**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function StageDetailModal({ stage, isOpen, onClose, metrics }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {stage.icon}
            <span>{stage.name}</span>
            <Badge variant={stage.healthStatus}>{stage.conversionRate}%</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stage.count}</div>
                <p className="text-xs text-gray-500">Total nesta etapa</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {stage.convertedCount}
                </div>
                <p className="text-xs text-gray-500">Convertidos para próxima</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  {stage.droppedCount}
                </div>
                <p className="text-xs text-gray-500">Drop-offs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {stage.avgTimeInStage}h
                </div>
                <p className="text-xs text-gray-500">Tempo médio nesta etapa</p>
              </CardContent>
            </Card>
          </div>

          {/* Historical Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência Histórica (30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stage.historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="conversionRate" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Patient List (if applicable) */}
          {stage.showPatientList && (
            <Card>
              <CardHeader>
                <CardTitle>Pacientes nesta etapa ({stage.patients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Entrada nesta etapa</TableHead>
                      <TableHead>Tempo decorrido</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stage.patients.slice(0, 10).map(patient => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{formatDate(patient.enteredAt)}</TableCell>
                        <TableCell>{patient.timeInStage}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Ver detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Backend:**
```javascript
// Novo endpoint: GET /api/conversion-funnel/stage-details/:stageName
async getStageDetails(stageName, startDate, endDate) {
  // 1. Buscar count por dia (últimos 30 dias)
  const historicalData = await this.getStageHistoricalData(stageName, startDate, endDate);

  // 2. Buscar lista de pacientes nesta etapa
  const patientsInStage = await executeQuery(`
    SELECT
      p.id,
      p.name,
      p.email,
      p.phone,
      p.created_at,
      p.updated_at,
      TIMESTAMPDIFF(HOUR, p.updated_at, NOW()) as hours_in_stage
    FROM patient_leads p
    WHERE p.status = ?
      AND DATE(p.created_at) >= ?
      AND DATE(p.created_at) <= ?
    ORDER BY p.updated_at DESC
    LIMIT 100
  `, [stageName, startDate, endDate]);

  // 3. Calcular métricas agregadas
  const avgTimeInStage = patientsInStage.reduce((sum, p) => sum + p.hours_in_stage, 0) / patientsInStage.length;

  return {
    stageName,
    count: patientsInStage.length,
    avgTimeInStage: avgTimeInStage.toFixed(1),
    historicalData,
    patients: patientsInStage,
    // ... outros dados
  };
}
```

---

#### 3.3 Export & Share (1 dia)

**Descrição**: Permitir exportar dados e compartilhar links do dashboard.

**Features:**

**A) Export to CSV:**
```tsx
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

function exportToCSV(metrics, period) {
  const data = [
    ['Etapa', 'Total', 'Taxa de Conversão', 'Drop-offs', 'Tempo Médio'],
    ['Impressões', metrics.seo.impressions, '-', '-', '-'],
    ['Cliques', metrics.seo.clicks, metrics.conversions.impressionToClick + '%', '-', '-'],
    ['Cadastros', metrics.crm.registrations, metrics.conversions.clickToRegistration + '%', '-', '-'],
    // ... outros estágios ...
  ];

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `funil-conversao-${period.startDate}-${period.endDate}.csv`);
}

// Botão no header
<Button variant="outline" onClick={() => exportToCSV(metrics, period)}>
  <Download className="h-4 w-4 mr-2" />
  Exportar CSV
</Button>
```

**B) Export to PNG:**
```tsx
import html2canvas from 'html2canvas';

async function exportToPNG(elementRef) {
  const canvas = await html2canvas(elementRef.current, {
    backgroundColor: '#ffffff',
    scale: 2 // retina quality
  });

  canvas.toBlob(blob => {
    saveAs(blob, `funil-conversao-${Date.now()}.png`);
  });
}

<Button variant="outline" onClick={() => exportToPNG(funnelRef)}>
  <Image className="h-4 w-4 mr-2" />
  Exportar PNG
</Button>
```

**C) Shareable Link:**
```tsx
function generateShareableLink(filters) {
  const params = new URLSearchParams({
    startDate: filters.startDate,
    endDate: filters.endDate,
    compareMode: filters.compareMode
  });

  const url = `${window.location.origin}/admin/bi-conversao/share?${params.toString()}`;

  navigator.clipboard.writeText(url);
  toast({
    title: "Link copiado!",
    description: "O link foi copiado para a área de transferência"
  });
}

<Button variant="outline" onClick={() => generateShareableLink(filters)}>
  <Share2 className="h-4 w-4 mr-2" />
  Compartilhar
</Button>
```

---

### **Checklist Fase 3:**
- [ ] Implementar sistema de smart insights com detecção de anomalias
- [ ] Criar modal de drill-down por estágio
- [ ] Adicionar endpoint backend para detalhes de estágio
- [ ] Implementar exportação para CSV
- [ ] Implementar exportação para PNG
- [ ] Adicionar funcionalidade de share link
- [ ] Criar página /share com view read-only
- [ ] Testar performance com lista de pacientes grande

**Estimativa**: 5-7 dias de desenvolvimento
**Dependências**: Fase 2 completa

---

### **FASE 4: Personalization & Advanced Features** 🚀 (7-10 dias)

**Objetivo**: Adicionar personalização, dark mode, filtros avançados e features premium.

#### 4.1 Advanced Filters & Segments (3 dias)

**Descrição**: Permitir filtrar o funil por múltiplas dimensões.

**Filtros Disponíveis:**
- **Fonte de Tráfego**: Orgânico, Pago, Direto, Referral, Social
- **Dispositivo**: Desktop, Mobile, Tablet
- **Localização**: Estado, Cidade
- **Faixa Etária**: 18-25, 26-35, 36-45, 46+
- **Ortodontista Atribuído**: Dropdown com lista
- **Status de Pagamento**: Pago, Pendente, Cancelado

**UI Component:**
```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">
      <Filter className="h-4 w-4 mr-2" />
      Filtros ({activeFilters.length})
    </Button>
  </SheetTrigger>
  <SheetContent className="w-[400px] overflow-y-auto">
    <SheetHeader>
      <SheetTitle>Filtros Avançados</SheetTitle>
    </SheetHeader>

    <div className="space-y-6 mt-6">
      {/* Fonte de Tráfego */}
      <div>
        <Label>Fonte de Tráfego</Label>
        <Select
          value={filters.source}
          onValueChange={v => setFilters({...filters, source: v})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as fontes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="organic">Orgânico</SelectItem>
            <SelectItem value="paid">Pago (Google Ads)</SelectItem>
            <SelectItem value="direct">Direto</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dispositivo */}
      <div>
        <Label>Dispositivo</Label>
        <div className="flex gap-2 mt-2">
          {['desktop', 'mobile', 'tablet'].map(device => (
            <Button
              key={device}
              variant={filters.devices.includes(device) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleDevice(device)}
            >
              <Icon name={device} className="h-4 w-4 mr-1" />
              {device}
            </Button>
          ))}
        </div>
      </div>

      {/* Localização */}
      <div>
        <Label>Estado</Label>
        <MultiSelect
          options={stateOptions}
          value={filters.states}
          onChange={states => setFilters({...filters, states})}
          placeholder="Selecione estados..."
        />
      </div>

      {/* Faixa Etária */}
      <div>
        <Label>Faixa Etária</Label>
        <Slider
          min={18}
          max={65}
          step={1}
          value={filters.ageRange}
          onValueChange={range => setFilters({...filters, ageRange: range})}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{filters.ageRange[0]} anos</span>
          <span>{filters.ageRange[1]} anos</span>
        </div>
      </div>

      {/* Ortodontista */}
      <div>
        <Label>Ortodontista Atribuído</Label>
        <Select
          value={filters.orthodontist}
          onValueChange={v => setFilters({...filters, orthodontist: v})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os ortodontistas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {orthodontists.map(ortho => (
              <SelectItem key={ortho.id} value={ortho.id}>
                {ortho.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="flex gap-2 mt-6">
      <Button onClick={applyFilters} className="flex-1">
        Aplicar Filtros
      </Button>
      <Button variant="outline" onClick={clearFilters}>
        Limpar
      </Button>
    </div>
  </SheetContent>
</Sheet>
```

**Backend:**
```javascript
// Modificar getDetailedFunnelMetrics para aceitar filters
async getDetailedFunnelMetrics(startDate, endDate, filters = {}) {
  let whereConditions = [
    'DATE(p.created_at) >= ?',
    'DATE(p.created_at) <= ?'
  ];
  let params = [startDate, endDate];

  // Adicionar condições de filtro
  if (filters.source && filters.source !== 'all') {
    whereConditions.push('p.traffic_source = ?');
    params.push(filters.source);
  }

  if (filters.devices && filters.devices.length > 0) {
    whereConditions.push(`p.device IN (${filters.devices.map(() => '?').join(',')})`);
    params.push(...filters.devices);
  }

  if (filters.states && filters.states.length > 0) {
    whereConditions.push(`p.state IN (${filters.states.map(() => '?').join(',')})`);
    params.push(...filters.states);
  }

  if (filters.ageRange) {
    whereConditions.push('TIMESTAMPDIFF(YEAR, p.birth_date, CURDATE()) BETWEEN ? AND ?');
    params.push(filters.ageRange[0], filters.ageRange[1]);
  }

  if (filters.orthodontist && filters.orthodontist !== 'all') {
    whereConditions.push('p.assigned_orthodontist_id = ?');
    params.push(filters.orthodontist);
  }

  const whereClause = whereConditions.join(' AND ');

  // Usar whereClause nas queries existentes
  // ... resto da implementação
}
```

---

#### 4.2 Dark Mode (1 dia)

**Descrição**: Implementar tema escuro para uso noturno ou preferência do usuário.

**Implementação com next-themes:**
```tsx
// Em layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// Toggle no header
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
```

**Tailwind Config:**
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... outras cores com CSS variables
      }
    }
  }
};

// globals.css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... outras variáveis light mode */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... outras variáveis dark mode */
  }
}
```

**Ajustar Componentes:**
```tsx
// Exemplo de card adaptável
<div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 border-2 border-blue-300 dark:border-blue-700">
  <div className="text-gray-900 dark:text-gray-100">{value}</div>
  <div className="text-gray-600 dark:text-gray-400">{label}</div>
</div>
```

---

#### 4.3 Custom Dashboards & Saved Views (2 dias)

**Descrição**: Permitir que usuários criem e salvem views personalizadas.

**Features:**
- Salvar configurações de filtros
- Criar múltiplos dashboards customizados
- Definir dashboard padrão
- Compartilhar views com outros usuários

**UI:**
```tsx
<div className="flex items-center gap-2">
  <Select value={currentDashboard} onValueChange={loadDashboard}>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Selecione uma view" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="default">View Padrão</SelectItem>
      {savedViews.map(view => (
        <SelectItem key={view.id} value={view.id}>
          {view.name}
        </SelectItem>
      ))}
      <SelectSeparator />
      <SelectItem value="new">
        <Plus className="h-4 w-4 mr-2" />
        Criar Nova View
      </SelectItem>
    </SelectContent>
  </Select>

  <Button
    variant="ghost"
    size="icon"
    onClick={saveCurrentView}
    title="Salvar view atual"
  >
    <Save className="h-4 w-4" />
  </Button>
</div>
```

**Backend Schema:**
```sql
CREATE TABLE dashboard_views (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  config JSON NOT NULL, -- { filters, layout, preferences }
  is_default BOOLEAN DEFAULT FALSE,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Config JSON example:
{
  "filters": {
    "source": "organic",
    "devices": ["mobile", "desktop"],
    "states": ["SP", "RJ"],
    "ageRange": [25, 45]
  },
  "layout": {
    "showSparklines": true,
    "showComparison": true,
    "chartType": "sankey"
  },
  "preferences": {
    "theme": "dark",
    "density": "compact"
  }
}
```

---

#### 4.4 Real-time Updates (WebSocket) (2 dias)

**Descrição**: Atualizar dashboard em tempo real quando novos dados chegam.

**Implementação:**

**Backend (Socket.io):**
```javascript
// server.js
const io = require('socket.io')(server, {
  cors: { origin: process.env.ALLOWED_ORIGINS }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Cliente entra na sala do dashboard
  socket.on('subscribe:dashboard', ({ filters }) => {
    socket.join('dashboard');
    console.log('Cliente subscrito ao dashboard');
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Quando um novo lead é criado
app.post('/api/patient-leads', async (req, res) => {
  // ... criar lead ...

  // Emitir evento para todos conectados
  io.to('dashboard').emit('dashboard:new-lead', {
    stage: 'novo',
    count: newTotalCount,
    patient: sanitizedPatientData
  });
});

// Quando status muda
app.patch('/api/patient-leads/:id/status', async (req, res) => {
  // ... atualizar status ...

  io.to('dashboard').emit('dashboard:status-change', {
    fromStage: oldStatus,
    toStage: newStatus,
    counts: updatedCounts
  });
});
```

**Frontend:**
```tsx
import io from 'socket.io-client';
import { useEffect } from 'react';

function BIConversaoPage() {
  const [metrics, setMetrics] = useState<DetailedFunnelMetrics | null>(null);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);

  useEffect(() => {
    if (!realtimeEnabled) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log('Conectado ao servidor');
      socket.emit('subscribe:dashboard', { filters: currentFilters });
    });

    socket.on('dashboard:new-lead', (data) => {
      toast({
        title: "Novo cadastro!",
        description: `Um novo paciente entrou no funil`,
        duration: 3000
      });

      // Atualizar count com animação
      setMetrics(prev => ({
        ...prev,
        crm: {
          ...prev.crm,
          registrations: prev.crm.registrations + 1,
          statusBreakdown: {
            ...prev.crm.statusBreakdown,
            novo: prev.crm.statusBreakdown.novo + 1
          }
        }
      }));
    });

    socket.on('dashboard:status-change', (data) => {
      // Atualizar counts dos estágios afetados
      setMetrics(prev => ({
        ...prev,
        crm: {
          ...prev.crm,
          statusBreakdown: data.counts
        }
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [realtimeEnabled]);

  return (
    <div>
      {/* Toggle real-time */}
      <div className="flex items-center gap-2">
        <Switch
          checked={realtimeEnabled}
          onCheckedChange={setRealtimeEnabled}
        />
        <Label>Atualizações em tempo real</Label>
        {realtimeEnabled && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse" />
            Conectado
          </span>
        )}
      </div>

      {/* ... resto do dashboard ... */}
    </div>
  );
}
```

**Considerações:**
- ⚠️ WebSocket mantém conexão aberta (uso de recursos)
- ⚠️ Pode ser overkill para dashboard administrativo (não é crítico)
- ✅ Muito útil se múltiplos usuários monitoram simultaneamente
- ✅ Cria senso de urgência e engajamento

**Recomendação**: Implementar como feature opcional (opt-in).

---

#### 4.5 Mobile Responsive Layout (1 dia)

**Descrição**: Adaptar layout para mobile com navegação por swipe.

**Layout Mobile:**
```tsx
// Usar react-swipeable para navegação por stages
import { useSwipeable } from 'react-swipeable';

function MobileFunnelView({ metrics }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const stages = [
    { name: 'Impressões', data: metrics.seo.impressions, ... },
    { name: 'Cliques', data: metrics.seo.clicks, ... },
    // ... todos os stages
  ];

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentStageIndex(i => Math.min(i + 1, stages.length - 1)),
    onSwipedRight: () => setCurrentStageIndex(i => Math.max(i - 1, 0)),
    trackMouse: true
  });

  return (
    <div className="md:hidden" {...handlers}>
      {/* Progress indicator */}
      <div className="flex gap-1 mb-4">
        {stages.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded ${
              idx === currentStageIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Current stage card */}
      <motion.div
        key={currentStageIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bg-white rounded-lg p-6 shadow-lg"
      >
        <div className="text-center">
          {stages[currentStageIndex].icon}
          <h2 className="text-2xl font-bold mt-4">
            {stages[currentStageIndex].name}
          </h2>
          <div className="text-4xl font-bold text-blue-600 mt-2">
            {stages[currentStageIndex].data.toLocaleString('pt-BR')}
          </div>

          {/* Conversion to next */}
          {currentStageIndex < stages.length - 1 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-center gap-2">
                <ArrowDown className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {stages[currentStageIndex].conversionRate}% para próxima etapa
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation hints */}
      <div className="flex justify-between mt-4 text-sm text-gray-500">
        {currentStageIndex > 0 && (
          <button onClick={() => setCurrentStageIndex(i => i - 1)}>
            ← Anterior
          </button>
        )}
        <span className="mx-auto">
          {currentStageIndex + 1} de {stages.length}
        </span>
        {currentStageIndex < stages.length - 1 && (
          <button onClick={() => setCurrentStageIndex(i => i + 1)}>
            Próximo →
          </button>
        )}
      </div>
    </div>
  );
}
```

---

### **Checklist Fase 4:**
- [ ] Implementar filtros avançados (fonte, dispositivo, localização, idade, ortodontista)
- [ ] Criar sistema de segmentação dinâmica
- [ ] Implementar dark mode com next-themes
- [ ] Criar sistema de saved views
- [ ] Adicionar real-time updates com WebSocket (opcional)
- [ ] Implementar layout mobile responsivo com swipe navigation
- [ ] Testar performance com múltiplos filtros ativos
- [ ] Garantir acessibilidade (keyboard navigation, screen readers)

**Estimativa**: 7-10 dias de desenvolvimento
**Dependências**: Fase 3 completa

---

## 📊 Métricas de Sucesso

Como medir se as melhorias de UX estão funcionando:

### Métricas Quantitativas:
1. **Time to Insight**: Quanto tempo leva para identificar um gargalo?
   - **Meta**: Reduzir de 3min para <30seg

2. **Click Depth**: Quantos cliques para chegar ao dado desejado?
   - **Meta**: Máximo 2 cliques para qualquer informação

3. **Dashboard Load Time**: Tempo de carregamento inicial
   - **Meta**: <2s para primeira renderização

4. **User Engagement**: Tempo médio na página
   - **Meta**: Aumentar de 2min para 5min+

5. **Feature Adoption**: % usuários que usam filtros avançados
   - **Meta**: 60%+ usam pelo menos 1 filtro

### Métricas Qualitativas:
1. **System Usability Scale (SUS)**: Survey com 10 perguntas
   - **Meta**: Score >80 (Excellent)

2. **Net Promoter Score (NPS)**: "Recomendaria para colega?"
   - **Meta**: NPS >50

3. **User Interviews**: Feedback direto de 5 usuários
   - Identificar pain points residuais

---

## 🛠️ Stack Tecnológico Recomendado

### Bibliotecas Novas (a adicionar):

| Biblioteca | Tamanho | Propósito | Prioridade |
|------------|---------|-----------|------------|
| `framer-motion` | 40kb | Animações | Alta |
| `react-spring` | 25kb | Number animations | Média |
| `react-sparklines` | 10kb | Mini charts | Alta |
| `d3-sankey` | 20kb | Sankey diagrams | Alta |
| `html2canvas` | 50kb | Export PNG | Média |
| `papaparse` | 20kb | Export CSV | Baixa |
| `socket.io-client` | 30kb | Real-time | Baixa |
| `react-swipeable` | 15kb | Mobile swipe | Média |
| `next-themes` | 5kb | Dark mode | Alta |

**Total adicional**: ~215kb (gzipped: ~70kb)

### Já Disponíveis no Projeto:
- `recharts` - Gráficos (já usamos)
- `lucide-react` - Ícones (já usamos)
- `shadcn/ui` - Componentes (já usamos)
- `tailwindcss` - Styling (já usamos)

---

## 🚀 Plano de Execução

### Cronograma Sugerido:

**Semana 1-2**: Fase 2 (Interactivity & Context)
- Dias 1-2: Sankey diagram
- Dia 3: Period comparison
- Dia 4: Micro-interactions
- Dia 5: Mini sparklines + Enhanced tooltips
- **Entrega**: Dashboard com contexto temporal e animações

**Semana 3-4**: Fase 3 (Intelligence & Drill-Down)
- Dias 1-2: Smart insights
- Dias 3-4: Drill-down modal
- Dia 5: Export & share
- **Entrega**: Dashboard inteligente com drill-down

**Semana 5-6**: Fase 4 (Personalization & Advanced)
- Dias 1-3: Advanced filters
- Dia 4: Dark mode
- Dias 5-6: Custom dashboards
- Dias 7-8: Real-time (opcional)
- Dias 9-10: Mobile responsive
- **Entrega**: Dashboard completo e profissional

### Priorização:
1. **Must Have** (Fazer primeiro):
   - Sankey diagram
   - Period comparison
   - Micro-interactions
   - Smart insights
   - Drill-down modal

2. **Should Have** (Fazer depois):
   - Mini sparklines
   - Enhanced tooltips
   - Export CSV/PNG
   - Dark mode
   - Advanced filters

3. **Nice to Have** (Se der tempo):
   - Real-time updates
   - Custom dashboards
   - Mobile swipe navigation
   - Share links

---

## 📝 Notas Finais

### Princípios de Design a Seguir:
1. **Progressive Disclosure**: Mostrar o essencial primeiro, detalhes on-demand
2. **Feedback Imediato**: Toda ação deve ter feedback visual em <100ms
3. **Consistency**: Seguir padrões estabelecidos (cores, spacing, interactions)
4. **Accessibility**: WCAG 2.1 AA compliance (contraste, keyboard nav, screen readers)
5. **Performance First**: Nenhuma animação deve causar lag (60fps target)

### Testes Importantes:
- [ ] Teste com dados reais (1000+ leads)
- [ ] Teste em mobile (iPhone, Android)
- [ ] Teste em tablets
- [ ] Teste com usuários reais (5 pessoas)
- [ ] Teste de carga (múltiplos usuários simultâneos)
- [ ] Teste de acessibilidade (screen reader, keyboard only)

### Referências Úteis:
- [Mixpanel Funnels Guide](https://help.mixpanel.com/hc/en-us/articles/360001244886)
- [Amplitude Analytics Best Practices](https://www.docs.developers.amplitude.com/)
- [Google Analytics 4 Funnel Exploration](https://support.google.com/analytics/answer/9327974)
- [Data Viz Best Practices (Storytelling with Data)](https://www.storytellingwithdata.com/)

---

**Criado em**: 26/11/2025
**Última atualização**: 26/11/2025
**Próxima revisão**: Após completar Fase 2

---
