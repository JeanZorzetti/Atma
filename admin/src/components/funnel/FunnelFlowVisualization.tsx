'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  MarkerType,
  Position,
} from 'reactflow';
import { Eye, MousePointerClick, UserPlus, Phone, Calendar, CheckCircle2, UserCheck, Award } from 'lucide-react';
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

// Helper para health status
const getHealthStatus = (rate: number, target: number): 'healthy' | 'warning' | 'critical' => {
  if (rate >= target) return 'healthy';
  if (rate >= target * 0.8) return 'warning';
  return 'critical';
};

const getHealthColor = (status: 'healthy' | 'warning' | 'critical'): string => {
  return {
    healthy: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    critical: 'bg-red-100 text-red-700 border-red-300',
  }[status];
};

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

  // Definir edges com labels customizados
  const edges: Edge[] = [
    {
      id: 'e1',
      source: 'impressoes',
      target: 'cliques',
      type: 'smoothstep',
      animated: metrics.conversions.impressionToClick >= 3,
      style: {
        stroke: metrics.conversions.impressionToClick >= 3 ? '#10b981' : metrics.conversions.impressionToClick >= 2.4 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      label: `${metrics.conversions.impressionToClick.toFixed(1)}%`,
      labelStyle: { fontSize: 12, fontWeight: 700 },
      labelBgStyle: {
        fill: metrics.conversions.impressionToClick >= 3 ? '#dcfce7' : metrics.conversions.impressionToClick >= 2.4 ? '#fef3c7' : '#fee2e2',
      },
      labelBgPadding: [8, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e2',
      source: 'cliques',
      target: 'cadastros',
      type: 'smoothstep',
      animated: metrics.conversions.clickToRegistration >= 8,
      style: {
        stroke: metrics.conversions.clickToRegistration >= 8 ? '#10b981' : metrics.conversions.clickToRegistration >= 6.4 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      label: `${metrics.conversions.clickToRegistration.toFixed(1)}%`,
      labelStyle: { fontSize: 12, fontWeight: 700 },
      labelBgStyle: {
        fill: metrics.conversions.clickToRegistration >= 8 ? '#dcfce7' : metrics.conversions.clickToRegistration >= 6.4 ? '#fef3c7' : '#fee2e2',
      },
      labelBgPadding: [8, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e3',
      source: 'cadastros',
      target: 'novo',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 3 },
      label: '100%',
      labelStyle: { fontSize: 12, fontWeight: 700 },
      labelBgStyle: { fill: '#dcfce7' },
      labelBgPadding: [8, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e4',
      source: 'novo',
      target: 'contatado',
      type: 'smoothstep',
      animated: metrics.conversions.novoToContatado >= 95,
      style: {
        stroke: metrics.conversions.novoToContatado >= 95 ? '#10b981' : metrics.conversions.novoToContatado >= 76 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      label: `${metrics.conversions.novoToContatado.toFixed(1)}%`,
      labelStyle: { fontSize: 12, fontWeight: 700 },
      labelBgStyle: {
        fill: metrics.conversions.novoToContatado >= 95 ? '#dcfce7' : metrics.conversions.novoToContatado >= 76 ? '#fef3c7' : '#fee2e2',
      },
      labelBgPadding: [8, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e5',
      source: 'contatado',
      target: 'agendado',
      type: 'smoothstep',
      animated: metrics.conversions.contatadoToAgendado >= 60,
      style: {
        stroke: metrics.conversions.contatadoToAgendado >= 60 ? '#10b981' : metrics.conversions.contatadoToAgendado >= 48 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      label: `${metrics.conversions.contatadoToAgendado.toFixed(1)}%`,
      labelStyle: { fontSize: 12, fontWeight: 700 },
      labelBgStyle: {
        fill: metrics.conversions.contatadoToAgendado >= 60 ? '#dcfce7' : metrics.conversions.contatadoToAgendado >= 48 ? '#fef3c7' : '#fee2e2',
      },
      labelBgPadding: [8, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e6',
      source: 'agendado',
      target: 'avaliacao_inicial',
      type: 'smoothstep',
      animated: metrics.conversions.agendadoToAvaliacaoInicial >= 70,
      style: {
        stroke: metrics.conversions.agendadoToAvaliacaoInicial >= 70 ? '#10b981' : metrics.conversions.agendadoToAvaliacaoInicial >= 56 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      label: `${metrics.conversions.agendadoToAvaliacaoInicial.toFixed(1)}%`,
      labelStyle: { fontSize: 12, fontWeight: 700 },
      labelBgStyle: {
        fill: metrics.conversions.agendadoToAvaliacaoInicial >= 70 ? '#dcfce7' : metrics.conversions.agendadoToAvaliacaoInicial >= 56 ? '#fef3c7' : '#fee2e2',
      },
      labelBgPadding: [8, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e7',
      source: 'avaliacao_inicial',
      target: 'atribuido',
      type: 'smoothstep',
      animated: metrics.conversions.avaliacaoInicialToAtribuido >= 80,
      style: {
        stroke: metrics.conversions.avaliacaoInicialToAtribuido >= 80 ? '#10b981' : metrics.conversions.avaliacaoInicialToAtribuido >= 64 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      label: `${metrics.conversions.avaliacaoInicialToAtribuido.toFixed(1)}%`,
      labelStyle: { fontSize: 12, fontWeight: 700 },
      labelBgStyle: {
        fill: metrics.conversions.avaliacaoInicialToAtribuido >= 80 ? '#dcfce7' : metrics.conversions.avaliacaoInicialToAtribuido >= 64 ? '#fef3c7' : '#fee2e2',
      },
      labelBgPadding: [8, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e8',
      source: 'atribuido',
      target: 'convertido',
      type: 'smoothstep',
      animated: metrics.conversions.atribuidoToConvertido >= 70,
      style: {
        stroke: metrics.conversions.atribuidoToConvertido >= 70 ? '#10b981' : metrics.conversions.atribuidoToConvertido >= 56 ? '#f59e0b' : '#ef4444',
        strokeWidth: 3,
      },
      label: `${metrics.conversions.atribuidoToConvertido.toFixed(1)}%`,
      labelStyle: { fontSize: 12, fontWeight: 700 },
      labelBgStyle: {
        fill: metrics.conversions.atribuidoToConvertido >= 70 ? '#dcfce7' : metrics.conversions.atribuidoToConvertido >= 56 ? '#fef3c7' : '#fee2e2',
      },
      labelBgPadding: [8, 4] as [number, number],
      markerEnd: { type: MarkerType.ArrowClosed },
    },
  ];

  return (
    <div className="w-full h-[450px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
          type: 'smoothstep',
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
