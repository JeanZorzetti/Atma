'use client';

import React from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Position,
  EdgeProps,
  BaseEdge,
  getSmoothStepPath,
  EdgeLabelRenderer,
} from 'reactflow';
import { Eye, MousePointerClick, UserPlus, Phone, Calendar, CheckCircle2, UserCheck, Award, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

// Custom Edge Component with Tooltip
interface CustomEdgeData {
  label: string;
  formula: string;
  description: string;
  numerator: string;
  denominator: string;
  target: string;
}

function CustomEdgeWithTooltip({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<CustomEdgeData>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 px-2 py-1 rounded-md cursor-help font-bold transition-all hover:scale-110"
                     style={{
                       backgroundColor: style.stroke === '#10b981' ? '#dcfce7' :
                                       style.stroke === '#f59e0b' ? '#fef3c7' : '#fee2e2',
                       border: `2px solid ${style.stroke}`,
                     }}>
                  <span>{data?.label}</span>
                  <Info className="h-3 w-3 opacity-60" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm p-4 bg-white border-2 shadow-xl">
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900 border-b pb-2">
                    {data?.description}
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="font-mono text-xs bg-blue-50 p-2 rounded border border-blue-200">
                      <div className="text-blue-900 font-bold mb-1">Fórmula:</div>
                      <div className="text-blue-800">{data?.formula}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-green-50 p-2 rounded border border-green-200">
                        <div className="text-[10px] text-green-700 font-semibold">NUMERADOR</div>
                        <div className="text-xs text-green-900">{data?.numerator}</div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded border border-purple-200">
                        <div className="text-[10px] text-purple-700 font-semibold">DENOMINADOR</div>
                        <div className="text-xs text-purple-900">{data?.denominator}</div>
                      </div>
                    </div>
                    <div className="bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                      <div className="text-[10px] text-amber-700 font-semibold">META</div>
                      <div className="text-xs text-amber-900">{data?.target}</div>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default function FunnelFlowVisualization({ metrics }: FunnelFlowVisualizationProps) {
  // Definir nodes com posições fixas
  const nodes: Node[] = [
    // Linha 1
    {
      id: 'impressoes',
      type: 'default',
      position: { x: 0, y: 0 },
      data: {
        label: (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-600">IMPRESSÕES</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {(metrics.seo.impressions / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-gray-500">Pos: {metrics.seo.avgPosition}</div>
          </div>
        ),
      },
      style: {
        background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
        border: '2px solid #93c5fd',
        borderRadius: '12px',
        padding: '16px',
        width: 160,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'cliques',
      type: 'default',
      position: { x: 220, y: 0 },
      data: {
        label: (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MousePointerClick className="h-4 w-4 text-green-600" />
              <span className="text-xs font-semibold text-gray-600">CLIQUES</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{metrics.seo.clicks}</div>
            <div className="text-[10px] text-green-600 font-semibold">CTR: {metrics.seo.ctr}%</div>
          </div>
        ),
      },
      style: {
        background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
        border: '2px solid #6ee7b7',
        borderRadius: '12px',
        padding: '16px',
        width: 160,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'cadastros',
      type: 'default',
      position: { x: 440, y: 0 },
      data: {
        label: (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UserPlus className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-semibold text-gray-600">CADASTROS</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{metrics.crm.registrations}</div>
            <div className="text-[10px] text-indigo-600 font-semibold">Total</div>
          </div>
        ),
      },
      style: {
        background: 'linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%)',
        border: '2px solid #a5b4fc',
        borderRadius: '12px',
        padding: '16px',
        width: 160,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'novo',
      type: 'default',
      position: { x: 660, y: 0 },
      data: {
        label: (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UserPlus className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-semibold text-gray-600">NOVO</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{metrics.crm.statusBreakdown.novo}</div>
            <div className="text-[10px] text-purple-600 font-semibold">Status inicial</div>
          </div>
        ),
      },
      style: {
        background: 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)',
        border: '2px solid #d8b4fe',
        borderRadius: '12px',
        padding: '16px',
        width: 160,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'contatado',
      type: 'default',
      position: { x: 880, y: 0 },
      data: {
        label: (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Phone className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-semibold text-gray-600">CONTATADO</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{metrics.crm.statusBreakdown.contatado}</div>
            <div className="text-[10px] text-cyan-600 font-semibold">1º contato</div>
          </div>
        ),
      },
      style: {
        background: 'linear-gradient(135deg, #cffafe 0%, #ecfeff 100%)',
        border: '2px solid #67e8f9',
        borderRadius: '12px',
        padding: '16px',
        width: 160,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Left,
    },
    // Linha 2
    {
      id: 'agendado',
      type: 'default',
      position: { x: 880, y: 180 },
      data: {
        label: (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-semibold text-gray-600">AGENDADO</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{metrics.crm.statusBreakdown.agendado}</div>
            <div className="text-[10px] text-orange-600 font-semibold">Consulta marcada</div>
          </div>
        ),
      },
      style: {
        background: 'linear-gradient(135deg, #fed7aa 0%, #ffedd5 100%)',
        border: '2px solid #fdba74',
        borderRadius: '12px',
        padding: '16px',
        width: 160,
      },
      sourcePosition: Position.Left,
      targetPosition: Position.Top,
    },
    {
      id: 'avaliacao_inicial',
      type: 'default',
      position: { x: 660, y: 180 },
      data: {
        label: (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-semibold text-gray-600">AVALIAÇÃO</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{metrics.crm.statusBreakdown.avaliacao_inicial}</div>
            <div className="text-[10px] text-indigo-600 font-semibold">1ª consulta</div>
          </div>
        ),
      },
      style: {
        background: 'linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%)',
        border: '2px solid #a5b4fc',
        borderRadius: '12px',
        padding: '16px',
        width: 160,
      },
      sourcePosition: Position.Left,
      targetPosition: Position.Right,
    },
    {
      id: 'atribuido',
      type: 'default',
      position: { x: 440, y: 180 },
      data: {
        label: (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UserCheck className="h-4 w-4 text-violet-600" />
              <span className="text-xs font-semibold text-gray-600">ATRIBUÍDO</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{metrics.crm.statusBreakdown.atribuido}</div>
            <div className="text-[10px] text-violet-600 font-semibold">Com ortodontista</div>
          </div>
        ),
      },
      style: {
        background: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)',
        border: '2px solid #c4b5fd',
        borderRadius: '12px',
        padding: '16px',
        width: 160,
      },
      sourcePosition: Position.Left,
      targetPosition: Position.Right,
    },
    {
      id: 'convertido',
      type: 'default',
      position: { x: 220, y: 180 },
      data: {
        label: (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold text-gray-600">CONVERTIDO</span>
            </div>
            <div className="text-xl font-bold text-emerald-700">{metrics.crm.statusBreakdown.convertido}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">🎉 Tratamento</div>
          </div>
        ),
      },
      style: {
        background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
        border: '3px solid #34d399',
        borderRadius: '12px',
        padding: '16px',
        width: 160,
        boxShadow: '0 0 0 3px rgba(52, 211, 153, 0.2)',
      },
      sourcePosition: Position.Left,
      targetPosition: Position.Right,
    },
  ];

  // Edge types configuration
  const edgeTypes = {
    customEdge: CustomEdgeWithTooltip,
  };

  // Definir edges com labels customizados e tooltips informativos
  const edges: Edge<CustomEdgeData>[] = [
    {
      id: 'e1',
      source: 'impressoes',
      target: 'cliques',
      type: 'customEdge',
      animated: metrics.conversions.impressionToClick >= 3,
      style: {
        stroke: metrics.conversions.impressionToClick >= 3 ? '#10b981' : metrics.conversions.impressionToClick >= 2.4 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: metrics.conversions.impressionToClick >= 3 ? '#10b981' : metrics.conversions.impressionToClick >= 2.4 ? '#f59e0b' : '#ef4444' },
      data: {
        label: `${metrics.conversions.impressionToClick.toFixed(1)}%`,
        formula: 'CTR = (Cliques ÷ Impressões) × 100',
        description: 'Taxa de Cliques (CTR) - Quantas pessoas clicaram após ver o anúncio',
        numerator: `${metrics.seo.clicks} cliques no Google`,
        denominator: `${metrics.seo.impressions.toLocaleString()} impressões nos resultados`,
        target: '≥ 3% (excelente) | 2.4-3% (bom) | < 2.4% (precisa melhorar)'
      },
    },
    {
      id: 'e2',
      source: 'cliques',
      target: 'cadastros',
      type: 'customEdge',
      animated: metrics.conversions.clickToRegistration >= 8,
      style: {
        stroke: metrics.conversions.clickToRegistration >= 8 ? '#10b981' : metrics.conversions.clickToRegistration >= 6.4 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: metrics.conversions.clickToRegistration >= 8 ? '#10b981' : metrics.conversions.clickToRegistration >= 6.4 ? '#f59e0b' : '#ef4444' },
      data: {
        label: `${metrics.conversions.clickToRegistration.toFixed(1)}%`,
        formula: 'Taxa Conversão = (Cadastros ÷ Cliques) × 100',
        description: 'Conversão de Clique para Cadastro - Quantos visitantes se cadastraram',
        numerator: `${metrics.crm.registrations} cadastros realizados`,
        denominator: `${metrics.seo.clicks} cliques no site`,
        target: '≥ 8% (excelente) | 6.4-8% (bom) | < 6.4% (precisa melhorar)'
      },
    },
    {
      id: 'e3',
      source: 'cadastros',
      target: 'novo',
      type: 'customEdge',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      data: {
        label: '100%',
        formula: 'Sempre 100% - Todo cadastro vira lead',
        description: 'Transição Automática - Todo cadastro entra como lead novo no CRM',
        numerator: `${metrics.crm.statusBreakdown.novo} leads novos`,
        denominator: `${metrics.crm.registrations} cadastros totais`,
        target: '100% (automático) - Não há perda nesta etapa'
      },
    },
    {
      id: 'e4',
      source: 'novo',
      target: 'contatado',
      type: 'customEdge',
      animated: metrics.conversions.novoToContatado >= 95,
      style: {
        stroke: metrics.conversions.novoToContatado >= 95 ? '#10b981' : metrics.conversions.novoToContatado >= 76 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: metrics.conversions.novoToContatado >= 95 ? '#10b981' : metrics.conversions.novoToContatado >= 76 ? '#f59e0b' : '#ef4444' },
      data: {
        label: `${metrics.conversions.novoToContatado.toFixed(1)}%`,
        formula: 'Taxa Contato = (Contatados ÷ Novos) × 100',
        description: 'Primeiro Contato - Quantos leads novos foram contatados pela equipe',
        numerator: `${metrics.crm.statusBreakdown.contatado} leads contatados`,
        denominator: `${metrics.crm.statusBreakdown.novo} leads novos no sistema`,
        target: '≥ 95% (excelente) | 76-95% (bom) | < 76% (crítico - leads sem contato)'
      },
    },
    {
      id: 'e5',
      source: 'contatado',
      target: 'agendado',
      type: 'customEdge',
      animated: metrics.conversions.contatadoToAgendado >= 60,
      style: {
        stroke: metrics.conversions.contatadoToAgendado >= 60 ? '#10b981' : metrics.conversions.contatadoToAgendado >= 48 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: metrics.conversions.contatadoToAgendado >= 60 ? '#10b981' : metrics.conversions.contatadoToAgendado >= 48 ? '#f59e0b' : '#ef4444' },
      data: {
        label: `${metrics.conversions.contatadoToAgendado.toFixed(1)}%`,
        formula: 'Taxa Agendamento = (Agendados ÷ Contatados) × 100',
        description: 'Agendamento - Quantos leads contatados marcaram consulta',
        numerator: `${metrics.crm.statusBreakdown.agendado} consultas agendadas`,
        denominator: `${metrics.crm.statusBreakdown.contatado} leads contatados`,
        target: '≥ 60% (excelente) | 48-60% (bom) | < 48% (baixa conversão no contato)'
      },
    },
    {
      id: 'e6',
      source: 'agendado',
      target: 'avaliacao_inicial',
      type: 'customEdge',
      animated: metrics.conversions.agendadoToAvaliacaoInicial >= 70,
      style: {
        stroke: metrics.conversions.agendadoToAvaliacaoInicial >= 70 ? '#10b981' : metrics.conversions.agendadoToAvaliacaoInicial >= 56 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: metrics.conversions.agendadoToAvaliacaoInicial >= 70 ? '#10b981' : metrics.conversions.agendadoToAvaliacaoInicial >= 56 ? '#f59e0b' : '#ef4444' },
      data: {
        label: `${metrics.conversions.agendadoToAvaliacaoInicial.toFixed(1)}%`,
        formula: 'Taxa Comparecimento = (Avaliações ÷ Agendados) × 100',
        description: 'Comparecimento - Quantos agendados compareceram à primeira consulta',
        numerator: `${metrics.crm.statusBreakdown.avaliacao_inicial} pacientes avaliados`,
        denominator: `${metrics.crm.statusBreakdown.agendado} consultas agendadas`,
        target: '≥ 70% (excelente) | 56-70% (bom) | < 56% (muitas faltas/no-shows)'
      },
    },
    {
      id: 'e7',
      source: 'avaliacao_inicial',
      target: 'atribuido',
      type: 'customEdge',
      animated: metrics.conversions.avaliacaoInicialToAtribuido >= 80,
      style: {
        stroke: metrics.conversions.avaliacaoInicialToAtribuido >= 80 ? '#10b981' : metrics.conversions.avaliacaoInicialToAtribuido >= 64 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: metrics.conversions.avaliacaoInicialToAtribuido >= 80 ? '#10b981' : metrics.conversions.avaliacaoInicialToAtribuido >= 64 ? '#f59e0b' : '#ef4444' },
      data: {
        label: `${metrics.conversions.avaliacaoInicialToAtribuido.toFixed(1)}%`,
        formula: 'Taxa Atribuição = (Atribuídos ÷ Avaliações) × 100',
        description: 'Atribuição a Ortodontista - Quantos foram designados para tratamento',
        numerator: `${metrics.crm.statusBreakdown.atribuido} pacientes atribuídos`,
        denominator: `${metrics.crm.statusBreakdown.avaliacao_inicial} avaliações realizadas`,
        target: '≥ 80% (excelente) | 64-80% (bom) | < 64% (baixa aceitação do plano)'
      },
    },
    {
      id: 'e8',
      source: 'atribuido',
      target: 'convertido',
      type: 'customEdge',
      animated: metrics.conversions.atribuidoToConvertido >= 70,
      style: {
        stroke: metrics.conversions.atribuidoToConvertido >= 70 ? '#10b981' : metrics.conversions.atribuidoToConvertido >= 56 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: metrics.conversions.atribuidoToConvertido >= 70 ? '#10b981' : metrics.conversions.atribuidoToConvertido >= 56 ? '#f59e0b' : '#ef4444' },
      data: {
        label: `${metrics.conversions.atribuidoToConvertido.toFixed(1)}%`,
        formula: 'Taxa Conversão Final = (Convertidos ÷ Atribuídos) × 100',
        description: 'Conversão para Tratamento - Quantos iniciaram o tratamento ortodôntico',
        numerator: `${metrics.crm.statusBreakdown.convertido} pacientes em tratamento`,
        denominator: `${metrics.crm.statusBreakdown.atribuido} pacientes atribuídos`,
        target: '≥ 70% (excelente) | 56-70% (bom) | < 56% (baixo fechamento)'
      },
    },
  ];

  return (
    <div className="w-full h-[450px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        defaultEdgeOptions={{
          type: 'customEdge',
        }}
      >
        <Background color="#e5e7eb" gap={16} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={() => '#3b82f6'}
          maskColor="rgba(0, 0, 0, 0.05)"
          style={{
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
      </ReactFlow>
    </div>
  );
}
