'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Eye, MousePointerClick, UserPlus, Phone, Calendar, CheckCircle2, UserCheck, Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  borderColor: string;
}

interface FunnelConversion {
  from: string;
  to: string;
  rate: number;
  count: number;
  formula: string;
  explanation: string;
  healthStatus: 'healthy' | 'warning' | 'critical';
  avgTime?: string;
}

interface DetailedFunnelMetrics {
  success: boolean;
  seo: {
    impressions: number;
    clicks: number;
    ctr: number;
    avgPosition: number;
  };
  crm: {
    registrations: number;
    statusBreakdown: {
      novo: number;
      contatado: number;
      agendado: number;
      avaliacao_inicial: number;
      atribuido: number;
      convertido: number;
      cancelado: number;
    };
  };
  conversions: {
    impressionToClick: number;
    clickToRegistration: number;
    novoToContatado: number;
    contatadoToAgendado: number;
    agendadoToAvaliacaoInicial: number;
    avaliacaoInicialToAtribuido: number;
    atribuidoToConvertido: number;
  };
  transitionTimes: {
    [key: string]: {
      avgHours: number;
      avgDays: number;
    } | undefined;
  };
}

interface FunnelFlowVisualizationProps {
  metrics: DetailedFunnelMetrics;
}

// Custom Node Component with Tooltip
function StageNode({ data }: { data: FunnelStage & { position: { x: number; y: number } } }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            className={`${data.bgGradient} border-2 ${data.borderColor} rounded-xl p-4 min-w-[140px] shadow-lg hover:shadow-xl transition-all cursor-pointer`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`${data.color}`}>{data.icon}</div>
              <div className="text-[10px] font-semibold text-gray-600 uppercase text-center">
                {data.name}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {data.count.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-3">
          <div className="space-y-1">
            <div className="font-semibold text-sm">{data.name}</div>
            <div className="text-xs text-gray-400">
              Total: <span className="font-bold text-white">{data.count.toLocaleString('pt-BR')}</span> pacientes
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Custom Edge Label with Tooltip
function EdgeLabel({ data }: { data: FunnelConversion }) {
  const healthColor = {
    healthy: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    critical: 'bg-red-100 text-red-700 border-red-300',
  }[data.healthStatus];

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="relative cursor-help">
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${healthColor} shadow-md hover:scale-110 transition-transform`}
            >
              {data.rate.toFixed(1)}%
            </div>
            {data.avgTime && (
              <div className="text-[9px] text-gray-500 text-center mt-0.5">
                ⏱ {data.avgTime}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-sm p-4 bg-gray-900 border-gray-700">
          <div className="space-y-3">
            {/* Header */}
            <div className="border-b border-gray-700 pb-2">
              <div className="font-semibold text-white">
                Taxa de Conversão: {data.from} → {data.to}
              </div>
              <div className="text-xl font-bold text-blue-400 mt-1">
                {data.rate.toFixed(2)}%
              </div>
            </div>

            {/* Formula */}
            <div className="bg-gray-800 rounded p-2 font-mono text-xs">
              <div className="text-gray-400 mb-1">Fórmula:</div>
              <div className="text-green-400">{data.formula}</div>
            </div>

            {/* Explanation */}
            <div className="text-xs text-gray-300">
              <div className="text-gray-400 mb-1">Explicação:</div>
              <div>{data.explanation}</div>
            </div>

            {/* Volume */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-gray-400">Volume:</div>
                <div className="font-bold text-white">{data.count} pacientes</div>
              </div>
              {data.avgTime && (
                <div>
                  <div className="text-gray-400">Tempo Médio:</div>
                  <div className="font-bold text-white">{data.avgTime}</div>
                </div>
              )}
            </div>

            {/* Health Status */}
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    data.healthStatus === 'healthy'
                      ? 'bg-green-500/20 text-green-400'
                      : data.healthStatus === 'warning'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {data.healthStatus === 'healthy' && '✓ Saudável'}
                  {data.healthStatus === 'warning' && '⚠ Atenção'}
                  {data.healthStatus === 'critical' && '⚠ Crítico'}
                </span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const nodeTypes = {
  stageNode: StageNode,
};

export default function FunnelFlowVisualization({ metrics }: FunnelFlowVisualizationProps) {
  const { nodes, edges } = useMemo(() => {
    // Helper para determinar health status
    const getHealthStatus = (rate: number, target: number): 'healthy' | 'warning' | 'critical' => {
      if (rate >= target) return 'healthy';
      if (rate >= target * 0.8) return 'warning';
      return 'critical';
    };

    // Definir estágios
    const stages: FunnelStage[] = [
      {
        id: 'impressoes',
        name: 'Impressões',
        count: metrics.seo.impressions,
        icon: <Eye className="h-5 w-5" />,
        color: 'text-blue-600',
        bgGradient: 'bg-gradient-to-br from-blue-100 to-blue-50',
        borderColor: 'border-blue-300',
      },
      {
        id: 'cliques',
        name: 'Cliques',
        count: metrics.seo.clicks,
        icon: <MousePointerClick className="h-5 w-5" />,
        color: 'text-green-600',
        bgGradient: 'bg-gradient-to-br from-green-100 to-green-50',
        borderColor: 'border-green-300',
      },
      {
        id: 'cadastros',
        name: 'Cadastros',
        count: metrics.crm.registrations,
        icon: <UserPlus className="h-5 w-5" />,
        color: 'text-indigo-600',
        bgGradient: 'bg-gradient-to-br from-indigo-100 to-indigo-50',
        borderColor: 'border-indigo-300',
      },
      {
        id: 'novo',
        name: 'Novo',
        count: metrics.crm.statusBreakdown.novo,
        icon: <UserPlus className="h-5 w-5" />,
        color: 'text-purple-600',
        bgGradient: 'bg-gradient-to-br from-purple-100 to-purple-50',
        borderColor: 'border-purple-300',
      },
      {
        id: 'contatado',
        name: 'Contatado',
        count: metrics.crm.statusBreakdown.contatado,
        icon: <Phone className="h-5 w-5" />,
        color: 'text-cyan-600',
        bgGradient: 'bg-gradient-to-br from-cyan-100 to-cyan-50',
        borderColor: 'border-cyan-300',
      },
      {
        id: 'agendado',
        name: 'Agendado',
        count: metrics.crm.statusBreakdown.agendado,
        icon: <Calendar className="h-5 w-5" />,
        color: 'text-orange-600',
        bgGradient: 'bg-gradient-to-br from-orange-100 to-orange-50',
        borderColor: 'border-orange-300',
      },
      {
        id: 'avaliacao',
        name: 'Avaliação',
        count: metrics.crm.statusBreakdown.avaliacao_inicial,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'text-indigo-600',
        bgGradient: 'bg-gradient-to-br from-indigo-100 to-indigo-50',
        borderColor: 'border-indigo-300',
      },
      {
        id: 'atribuido',
        name: 'Atribuído',
        count: metrics.crm.statusBreakdown.atribuido,
        icon: <UserCheck className="h-5 w-5" />,
        color: 'text-violet-600',
        bgGradient: 'bg-gradient-to-br from-violet-100 to-violet-50',
        borderColor: 'border-violet-300',
      },
      {
        id: 'convertido',
        name: 'Convertido',
        count: metrics.crm.statusBreakdown.convertido,
        icon: <Award className="h-5 w-5" />,
        color: 'text-emerald-600',
        bgGradient: 'bg-gradient-to-br from-emerald-100 to-emerald-50',
        borderColor: 'border-emerald-400',
      },
    ];

    // Criar nodes em layout de zig-zag (2 linhas)
    const flowNodes: Node[] = stages.map((stage, index) => {
      // Primeira linha: 0-4, Segunda linha: 5-8
      const row = index <= 4 ? 0 : 1;
      const colInRow = index <= 4 ? index : index - 5;

      return {
        id: stage.id,
        type: 'stageNode',
        position: {
          x: colInRow * 200,
          y: row * 180,
        },
        data: { ...stage, position: { x: colInRow * 200, y: row * 180 } },
      };
    });

    // Definir conversões com fórmulas detalhadas
    const conversions: FunnelConversion[] = [
      {
        from: 'Impressões',
        to: 'Cliques',
        rate: metrics.conversions.impressionToClick,
        count: metrics.seo.clicks,
        formula: '(Cliques / Impressões) × 100',
        explanation: `De ${metrics.seo.impressions.toLocaleString('pt-BR')} impressões no Google, ${metrics.seo.clicks} pessoas clicaram no site. Esta é a taxa de CTR (Click-Through Rate).`,
        healthStatus: getHealthStatus(metrics.conversions.impressionToClick, 3),
      },
      {
        from: 'Cliques',
        to: 'Cadastros',
        rate: metrics.conversions.clickToRegistration,
        count: metrics.crm.registrations,
        formula: '(Cadastros Totais / Cliques) × 100',
        explanation: `De ${metrics.seo.clicks} cliques, ${metrics.crm.registrations} pessoas completaram o cadastro. Mede a eficácia da landing page e formulário.`,
        healthStatus: getHealthStatus(metrics.conversions.clickToRegistration, 8),
      },
      {
        from: 'Cadastros',
        to: 'Novo',
        rate: 100,
        count: metrics.crm.statusBreakdown.novo,
        formula: '100% (todos iniciam como "Novo")',
        explanation: `Todos os ${metrics.crm.registrations} cadastros entram automaticamente no status "Novo". Esta é uma transição automática do sistema.`,
        healthStatus: 'healthy',
      },
      {
        from: 'Novo',
        to: 'Contatado',
        rate: metrics.conversions.novoToContatado,
        count: metrics.crm.statusBreakdown.contatado,
        formula: '(Contatados / Novo) × 100',
        explanation: `De ${metrics.crm.statusBreakdown.novo} pacientes novos, ${metrics.crm.statusBreakdown.contatado} foram contatados pela equipe. Mede a velocidade e eficácia do primeiro contato.`,
        healthStatus: getHealthStatus(metrics.conversions.novoToContatado, 95),
        avgTime: metrics.transitionTimes.novo_to_contatado
          ? `${metrics.transitionTimes.novo_to_contatado.avgHours.toFixed(0)}h`
          : undefined,
      },
      {
        from: 'Contatado',
        to: 'Agendado',
        rate: metrics.conversions.contatadoToAgendado,
        count: metrics.crm.statusBreakdown.agendado,
        formula: '(Agendados / Contatados) × 100',
        explanation: `De ${metrics.crm.statusBreakdown.contatado} pacientes contatados, ${metrics.crm.statusBreakdown.agendado} agendaram consulta. Reflete qualidade do atendimento e interesse do paciente.`,
        healthStatus: getHealthStatus(metrics.conversions.contatadoToAgendado, 60),
        avgTime: metrics.transitionTimes.contatado_to_agendado
          ? `${metrics.transitionTimes.contatado_to_agendado.avgDays.toFixed(0)}d`
          : undefined,
      },
      {
        from: 'Agendado',
        to: 'Avaliação',
        rate: metrics.conversions.agendadoToAvaliacaoInicial,
        count: metrics.crm.statusBreakdown.avaliacao_inicial,
        formula: '(Avaliações Iniciais / Agendados) × 100',
        explanation: `De ${metrics.crm.statusBreakdown.agendado} consultas agendadas, ${metrics.crm.statusBreakdown.avaliacao_inicial} compareceram para avaliação inicial. Mede taxa de no-show.`,
        healthStatus: getHealthStatus(metrics.conversions.agendadoToAvaliacaoInicial, 70),
        avgTime: metrics.transitionTimes.agendado_to_avaliacao_inicial
          ? `${metrics.transitionTimes.agendado_to_avaliacao_inicial.avgDays.toFixed(0)}d`
          : undefined,
      },
      {
        from: 'Avaliação',
        to: 'Atribuído',
        rate: metrics.conversions.avaliacaoInicialToAtribuido,
        count: metrics.crm.statusBreakdown.atribuido,
        formula: '(Atribuídos / Avaliações Iniciais) × 100',
        explanation: `De ${metrics.crm.statusBreakdown.avaliacao_inicial} avaliações iniciais, ${metrics.crm.statusBreakdown.atribuido} foram atribuídos a ortodontistas. Indica aprovação técnica do caso.`,
        healthStatus: getHealthStatus(metrics.conversions.avaliacaoInicialToAtribuido, 80),
        avgTime: metrics.transitionTimes.avaliacao_inicial_to_atribuido
          ? `${metrics.transitionTimes.avaliacao_inicial_to_atribuido.avgDays.toFixed(0)}d`
          : undefined,
      },
      {
        from: 'Atribuído',
        to: 'Convertido',
        rate: metrics.conversions.atribuidoToConvertido,
        count: metrics.crm.statusBreakdown.convertido,
        formula: '(Convertidos / Atribuídos) × 100',
        explanation: `De ${metrics.crm.statusBreakdown.atribuido} pacientes atribuídos, ${metrics.crm.statusBreakdown.convertido} iniciaram tratamento. Esta é a conversão final!`,
        healthStatus: getHealthStatus(metrics.conversions.atribuidoToConvertido, 70),
        avgTime: metrics.transitionTimes.atribuido_to_convertido
          ? `${metrics.transitionTimes.atribuido_to_convertido.avgDays.toFixed(0)}d`
          : undefined,
      },
    ];

    // Criar edges com strokeWidth proporcional ao volume
    const maxCount = Math.max(...conversions.map(c => c.count));

    const flowEdges: Edge[] = conversions.map((conv, index) => {
      const fromNode = flowNodes.find(n => n.data.name === conv.from);
      const toNode = flowNodes.find(n => n.data.name === conv.to);

      if (!fromNode || !toNode) return null;

      // Calcular largura da seta proporcional ao volume (min 2, max 12)
      const strokeWidth = Math.max(2, Math.min(12, (conv.count / maxCount) * 12));

      // Cor baseada em health status
      const strokeColor =
        conv.healthStatus === 'healthy'
          ? '#10b981'
          : conv.healthStatus === 'warning'
          ? '#f59e0b'
          : '#ef4444';

      return {
        id: `edge-${index}`,
        source: fromNode.id,
        target: toNode.id,
        type: ConnectionLineType.SmoothStep,
        animated: conv.healthStatus === 'healthy',
        style: {
          stroke: strokeColor,
          strokeWidth,
          opacity: 0.6,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 20,
          height: 20,
        },
        label: <EdgeLabel data={conv} />,
        labelStyle: {
          fill: 'transparent',
          fontWeight: 700,
        },
        labelBgStyle: {
          fill: 'transparent',
        },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 8,
      };
    }).filter(Boolean) as Edge[];

    return { nodes: flowNodes, edges: flowEdges };
  }, [metrics]);

  return (
    <div className="w-full h-[500px] bg-gray-50 rounded-lg border border-gray-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: ConnectionLineType.SmoothStep,
        }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={() => '#3b82f6'}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white border border-gray-300 rounded"
        />
      </ReactFlow>
    </div>
  );
}
