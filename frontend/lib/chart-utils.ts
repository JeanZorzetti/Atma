/**
 * Utilitários para geração de gráficos com Chart.js no servidor
 * Usado para criar imagens de gráficos que serão inseridas no PDF
 */

import { createCanvas } from '@napi-rs/canvas'
import { Chart, ChartConfiguration, registerables } from 'chart.js'
import { generateChartWithCache, getOptimizedCanvasSize } from './pdf-optimizer'

// Registrar todos os componentes do Chart.js
Chart.register(...registerables)

// VERSÃO DOS GRÁFICOS - Incremente para invalidar cache
const CHART_VERSION = '2.3' // Atualizado: donut chart com proporção corrigida e legenda na base

// Cores da paleta Atma (atualizadas para design moderno)
const COLORS = {
  primary: '#2563EB',      // Blue-600
  primaryLight: '#DBEAFE', // Blue-100
  primaryDark: '#1E40AF',  // Blue-800
  success: '#10B981',      // Green-500
  successLight: '#D1FAE5', // Green-100
  warning: '#F59E0B',      // Amber-500
  warningLight: '#FEF3C7', // Amber-100
  danger: '#EF4444',       // Red-500
  dangerLight: '#FEE2E2',  // Red-100
  purple: '#8B5CF6',       // Purple-500
  purpleLight: '#EDE9FE',  // Purple-100
  sky: '#0EA5E9',          // Sky-500
  gray: '#6B7280',         // Gray-500
  grayLight: '#F3F4F6',    // Gray-100
  grayDark: '#374151',     // Gray-700
}

/**
 * Gera um gráfico de breakdown do score (radar chart)
 * Mostra os 5 fatores que compõem o score
 */
export async function generateScoreBreakdownChart(scores: {
  complexidade: number
  idade: number
  historico: number
  saude: number
  expectativas: number
}): Promise<string> {
  // Usar cache para evitar regenerar gráficos idênticos
  return generateChartWithCache('score-breakdown', { ...scores, version: CHART_VERSION }, async (params) => {
    const optimizedSize = getOptimizedCanvasSize(600, 400)
    const canvas = createCanvas(optimizedSize.width, optimizedSize.height)
    const ctx = canvas.getContext('2d')

    const config: ChartConfiguration = {
      type: 'radar',
      data: {
        labels: ['Complexidade', 'Idade', 'Histórico', 'Saúde Bucal', 'Expectativas'],
        datasets: [{
          label: 'Seu Score',
          data: [
            params.complexidade,
            params.idade,
            params.historico,
            params.saude,
            params.expectativas
          ],
          backgroundColor: 'rgba(37, 99, 235, 0.25)',
          borderColor: COLORS.primary,
          borderWidth: 3,
          pointBackgroundColor: COLORS.primary,
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointHoverBackgroundColor: COLORS.primaryDark,
          pointHoverBorderColor: '#fff',
          pointRadius: 6,
          pointHoverRadius: 8,
        }]
      },
      options: {
        responsive: false,
        scales: {
          r: {
            min: 0,
            max: 20,
            backgroundColor: 'rgba(243, 244, 246, 0.3)',
            angleLines: {
              color: 'rgba(107, 114, 128, 0.2)',
              lineWidth: 1
            },
            grid: {
              color: 'rgba(107, 114, 128, 0.2)',
              lineWidth: 1
            },
            ticks: {
              stepSize: 5,
              font: { size: 13, weight: 500 as any },
              backdropColor: 'rgba(255, 255, 255, 0.9)',
              color: COLORS.grayDark,
              showLabelBackdrop: true,
              backdropPadding: 4
            },
            pointLabels: {
              font: { size: 15, weight: 'bold' },
              color: COLORS.grayDark,
              padding: 15
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Análise Detalhada do Score',
            font: { size: 20, weight: 'bold' },
            color: COLORS.grayDark,
            padding: { bottom: 25 }
          }
        }
      },
      plugins: [{
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart) => {
          const ctx = chart.canvas.getContext('2d')
          if (ctx) {
            ctx.save()
            ctx.globalCompositeOperation = 'destination-over'
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, chart.width, chart.height)
            ctx.restore()
          }
        }
      }]
    }

    new Chart(ctx as any, config)

    // Converter canvas para data URL
    return canvas.toDataURL('image/png')
  }) // Fecha generateChartWithCache
}

/**
 * Gera gráfico de barras para comparação de custos
 */
export async function generateCostComparisonChart(custos: {
  atma: number
  invisalign: number
  aparelhoFixo: number
  clearCorrect: number
  aparelhoLingual: number
}): Promise<string> {
  return generateChartWithCache('cost-comparison', { ...custos, version: CHART_VERSION }, async () => {
    const width = 700
    const height = 400
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: [
        'Atma\nAligner',
        'Invisalign®',
        'Aparelho\nFixo',
        'ClearCorrect',
        'Aparelho\nLingual'
      ],
      datasets: [{
        label: 'Custo Médio (R$)',
        data: [
          custos.atma,
          custos.invisalign,
          custos.aparelhoFixo,
          custos.clearCorrect,
          custos.aparelhoLingual
        ],
        backgroundColor: [
          COLORS.primary,
          COLORS.danger,
          COLORS.success,
          COLORS.warning,
          COLORS.purple
        ],
        borderColor: [
          COLORS.primary,
          COLORS.danger,
          COLORS.success,
          COLORS.warning,
          COLORS.purple
        ],
        borderWidth: 0,
        borderRadius: 12,
        barThickness: 35,
      }]
    },
    options: {
      responsive: false,
      indexAxis: 'y', // Horizontal bars
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `R$ ${Number(value).toLocaleString('pt-BR')}`,
            font: { size: 13, weight: 500 as any },
            color: COLORS.grayDark
          },
          grid: {
            color: 'rgba(107, 114, 128, 0.15)',
            lineWidth: 1
          },
          border: {
            display: false
          }
        },
        y: {
          ticks: {
            font: { size: 14, weight: 'bold' },
            color: COLORS.grayDark,
            padding: 10
          },
          grid: {
            display: false
          },
          border: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Comparação de Custos no Mercado',
          font: { size: 20, weight: 'bold' },
          color: COLORS.grayDark,
          padding: { bottom: 25 }
        },
        tooltip: {
          backgroundColor: 'rgba(55, 65, 81, 0.95)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `Custo: R$ ${(context.parsed.x ?? 0).toLocaleString('pt-BR')}`
          }
        }
      },
      layout: {
        padding: { left: 10, right: 30, top: 10, bottom: 10 }
      }
    },
    plugins: [{
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d')
        if (ctx) {
          ctx.save()
          ctx.globalCompositeOperation = 'destination-over'
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, chart.width, chart.height)
          ctx.restore()
        }
      }
    }]
  }

    new Chart(ctx as any, config)

    return canvas.toDataURL('image/png')
  }) // Fecha generateChartWithCache
}

/**
 * Gera gráfico de linha para timeline de tratamento
 */
export async function generateTimelineProgressChart(meses: number): Promise<string> {
  return generateChartWithCache('timeline-progress', { meses, version: CHART_VERSION }, async (params) => {
    const width = 700
    const height = 350
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // Criar dados simulados de progresso (curva S)
    const labels: string[] = []
    const progressData: number[] = []

    for (let i = 0; i <= params.meses; i++) {
      labels.push(`Mês ${i}`)
      // Curva S: progresso lento no início, rápido no meio, lento no final
      const progress = 100 / (1 + Math.exp(-0.5 * (i - params.meses / 2)))
      progressData.push(Math.round(progress))
    }

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Progresso do Tratamento (%)',
        data: progressData,
        borderColor: COLORS.primary,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 350)
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)')
          gradient.addColorStop(1, 'rgba(37, 99, 235, 0.05)')
          return gradient
        },
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: COLORS.primaryDark,
        pointHoverBorderWidth: 4,
      }]
    },
    options: {
      responsive: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`,
            font: { size: 13, weight: 500 as any },
            color: COLORS.grayDark,
            padding: 8
          },
          grid: {
            color: 'rgba(107, 114, 128, 0.15)',
            lineWidth: 1
          },
          border: {
            display: false
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: { size: 11, weight: 500 as any },
            color: COLORS.grayDark
          },
          grid: {
            display: false
          },
          border: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Curva de Progresso Estimada',
          font: { size: 20, weight: 'bold' },
          color: COLORS.grayDark,
          padding: { bottom: 25 }
        },
        tooltip: {
          backgroundColor: 'rgba(55, 65, 81, 0.95)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `Progresso: ${context.parsed.y}%`
          }
        }
      },
      layout: {
        padding: { left: 10, right: 20, top: 10, bottom: 10 }
      }
    },
    plugins: [{
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d')
        if (ctx) {
          ctx.save()
          ctx.globalCompositeOperation = 'destination-over'
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, chart.width, chart.height)
          ctx.restore()
        }
      }
    }]
  }

    new Chart(ctx as any, config)

    return canvas.toDataURL('image/png')
  }) // Fecha generateChartWithCache
}

/**
 * Gera gráfico de pizza para distribuição de investimento
 */
export async function generateInvestmentBreakdownChart(breakdown: {
  alinhadores: number
  planejamento: number
  checkups: number
  contencoes: number
  outros: number
}): Promise<string> {
  return generateChartWithCache('investment-breakdown', { ...breakdown, version: CHART_VERSION }, async (params) => {
    const width = 650
    const height = 450
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

  // Calcular total e percentuais
  const total = params.alinhadores + params.planejamento + params.checkups + params.contencoes + params.outros
  const percentuais = [
    Math.round((params.alinhadores / total) * 100),
    Math.round((params.planejamento / total) * 100),
    Math.round((params.checkups / total) * 100),
    Math.round((params.contencoes / total) * 100),
    Math.round((params.outros / total) * 100)
  ]

  const config = {
    type: 'doughnut' as const,
    data: {
      labels: [
        'Alinhadores',
        'Planejamento 3D',
        'Check-ups',
        'Contenções',
        'Outros'
      ],
      datasets: [{
        data: [
          params.alinhadores,
          params.planejamento,
          params.checkups,
          params.contencoes,
          params.outros
        ],
        backgroundColor: [
          COLORS.primary,
          COLORS.success,
          COLORS.warning,
          COLORS.purple,
          COLORS.sky
        ],
        borderColor: '#fff',
        borderWidth: 5,
        hoverBorderWidth: 7,
        hoverOffset: 12,
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      aspectRatio: 1.3,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            font: { size: 13, weight: 600 as any },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle',
            color: COLORS.grayDark,
            boxWidth: 15,
            boxHeight: 15,
            generateLabels: (chart: any) => {
              const data = chart.data
              return data.labels.map((label: string, i: number) => ({
                text: `${label} (${percentuais[i]}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              }))
            }
          }
        },
        title: {
          display: true,
          text: 'Composição do Investimento Total',
          font: { size: 20, weight: 'bold' },
          color: COLORS.grayDark,
          padding: { bottom: 20, top: 5 }
        },
        tooltip: {
          backgroundColor: 'rgba(55, 65, 81, 0.95)',
          titleFont: { size: 15, weight: 'bold' },
          bodyFont: { size: 14 },
          padding: 15,
          cornerRadius: 10,
          displayColors: true,
          boxWidth: 15,
          boxHeight: 15,
          boxPadding: 5,
          callbacks: {
            label: (context: any) => {
              const label = context.label || ''
              const value = `R$ ${Number(context.parsed).toLocaleString('pt-BR')}`
              const percent = percentuais[context.dataIndex]
              return [`${label}: ${value}`, `${percent}% do total`]
            }
          }
        }
      },
      layout: {
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
      }
    },
    plugins: [
      {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart: any) => {
          const ctx = chart.canvas.getContext('2d')
          if (ctx) {
            ctx.save()
            ctx.globalCompositeOperation = 'destination-over'
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, chart.width, chart.height)
            ctx.restore()
          }
        }
      },
      {
        id: 'centerText',
        afterDraw: (chart: any) => {
          const ctx = chart.ctx
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2

          ctx.save()

          // Valor total
          ctx.font = 'bold 28px Helvetica'
          ctx.fillStyle = COLORS.grayDark
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(`R$ ${total.toLocaleString('pt-BR')}`, centerX, centerY - 10)

          // Label "Total"
          ctx.font = '14px Helvetica'
          ctx.fillStyle = COLORS.gray
          ctx.fillText('Investimento Total', centerX, centerY + 15)

          ctx.restore()
        }
      }
    ]
  } as any

    new Chart(ctx as any, config)

    return canvas.toDataURL('image/png')
  }) // Fecha generateChartWithCache
}

/**
 * Gera gráfico de ROI (economia acumulada ao longo do tempo)
 */
export async function generateROIChart(custoAtma: number, custoInvisalign: number): Promise<string> {
  return generateChartWithCache('roi-chart', { custoAtma, custoInvisalign, version: CHART_VERSION }, async (params) => {
    const width = 700
    const height = 350
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const economia = params.custoInvisalign - params.custoAtma
    const meses = 60 // 5 anos

    const labels: string[] = []
    const economiaData: number[] = []

    for (let i = 0; i <= meses; i += 6) {
      const anos = i / 12
      labels.push(`${anos.toFixed(1)} anos`)
      // Economia cresce considerando possível retratamento em 5 anos
      const fator = i <= 12 ? 1 : 1 + ((i - 12) / 48) * 0.5 // Aumenta 50% em 4 anos
      economiaData.push(Math.round(economia * fator))
    }

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Economia Acumulada (R$)',
        data: economiaData,
        borderColor: COLORS.success,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 350)
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)')
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)')
          return gradient
        },
        borderWidth: 4,
        fill: true,
        tension: 0.3,
        pointRadius: 6,
        pointBackgroundColor: COLORS.success,
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#059669',
        pointHoverBorderWidth: 4,
      }]
    },
    options: {
      responsive: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `R$ ${Number(value).toLocaleString('pt-BR')}`,
            font: { size: 13, weight: 500 as any },
            color: COLORS.grayDark,
            padding: 8
          },
          grid: {
            color: 'rgba(107, 114, 128, 0.15)',
            lineWidth: 1
          },
          border: {
            display: false
          }
        },
        x: {
          ticks: {
            font: { size: 13, weight: 500 as any },
            color: COLORS.grayDark
          },
          grid: {
            display: false
          },
          border: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Economia: Atma vs. Invisalign® (5 anos)',
          font: { size: 20, weight: 'bold' },
          color: COLORS.grayDark,
          padding: { bottom: 25 }
        },
        tooltip: {
          backgroundColor: 'rgba(55, 65, 81, 0.95)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `Economia: R$ ${(context.parsed.y ?? 0).toLocaleString('pt-BR')}`
          }
        }
      },
      layout: {
        padding: { left: 10, right: 20, top: 10, bottom: 10 }
      }
    },
    plugins: [{
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d')
        if (ctx) {
          ctx.save()
          ctx.globalCompositeOperation = 'destination-over'
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, chart.width, chart.height)
          ctx.restore()
        }
      }
    }]
  }

    new Chart(ctx as any, config)

    return canvas.toDataURL('image/png')
  }) // Fecha generateChartWithCache
}
