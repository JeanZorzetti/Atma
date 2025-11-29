/**
 * Utilitários para geração de gráficos com Chart.js no servidor
 * Usado para criar imagens de gráficos que serão inseridas no PDF
 */

import { createCanvas } from 'canvas'
import { Chart, ChartConfiguration, registerables } from 'chart.js'
import { generateChartWithCache, getOptimizedCanvasSize } from './pdf-optimizer'

// Registrar todos os componentes do Chart.js
Chart.register(...registerables)

// Cores da paleta Atma
const COLORS = {
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  success: '#10B981',
  warning: '#FBBF24',
  danger: '#EF4444',
  gray: '#6B7280',
  grayLight: '#F3F4F6',
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
  return generateChartWithCache('score-breakdown', scores, async (params) => {
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
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: COLORS.primary,
        borderWidth: 2,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: COLORS.primary,
          pointRadius: 5,
          pointHoverRadius: 7,
        }]
      },
      options: {
        responsive: false,
        scales: {
          r: {
            min: 0,
            max: 20,
            ticks: {
              stepSize: 5,
              font: { size: 12 }
            },
            pointLabels: {
              font: { size: 14, weight: 'bold' }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Breakdown do Score por Fator',
            font: { size: 18, weight: 'bold' }
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
          COLORS.danger
        ],
        borderColor: [
          COLORS.primary,
          COLORS.danger,
          COLORS.success,
          COLORS.warning,
          COLORS.danger
        ],
        borderWidth: 2,
        borderRadius: 8,
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
            font: { size: 12 }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          ticks: {
            font: { size: 13, weight: 'bold' }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Comparação de Custos Entre Opções',
          font: { size: 18, weight: 'bold' }
        },
        tooltip: {
          callbacks: {
            label: (context) => `R$ ${context.parsed.x.toLocaleString('pt-BR')}`
          }
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

  return canvas.toDataURL('image/png')
}

/**
 * Gera gráfico de linha para timeline de tratamento
 */
export async function generateTimelineProgressChart(meses: number): Promise<string> {
  const width = 700
  const height = 350
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Criar dados simulados de progresso (curva S)
  const labels: string[] = []
  const progressData: number[] = []

  for (let i = 0; i <= meses; i++) {
    labels.push(`Mês ${i}`)
    // Curva S: progresso lento no início, rápido no meio, lento no final
    const progress = 100 / (1 + Math.exp(-0.5 * (i - meses / 2)))
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
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
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
            font: { size: 12 }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: { size: 10 }
          },
          grid: {
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
          text: 'Progresso Estimado do Tratamento',
          font: { size: 18, weight: 'bold' }
        },
        tooltip: {
          callbacks: {
            label: (context) => `Progresso: ${context.parsed.y}%`
          }
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

  return canvas.toDataURL('image/png')
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
  const width = 500
  const height = 500
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const config: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: [
        'Alinhadores (70%)',
        'Planejamento 3D (10%)',
        'Check-ups (7%)',
        'Contenções (3%)',
        'Outros (10%)'
      ],
      datasets: [{
        data: [
          breakdown.alinhadores,
          breakdown.planejamento,
          breakdown.checkups,
          breakdown.contencoes,
          breakdown.outros
        ],
        backgroundColor: [
          COLORS.primary,
          COLORS.success,
          COLORS.warning,
          '#8B5CF6', // Purple
          COLORS.gray
        ],
        borderColor: '#fff',
        borderWidth: 3,
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: { size: 13 },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: true,
          text: 'Distribuição do Investimento',
          font: { size: 18, weight: 'bold' },
          padding: { bottom: 20 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ''
              const value = `R$ ${Number(context.parsed).toLocaleString('pt-BR')}`
              return `${label}: ${value}`
            }
          }
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

  return canvas.toDataURL('image/png')
}

/**
 * Gera gráfico de ROI (economia acumulada ao longo do tempo)
 */
export async function generateROIChart(custoAtma: number, custoInvisalign: number): Promise<string> {
  const width = 700
  const height = 350
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const economia = custoInvisalign - custoAtma
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
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: COLORS.success,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }]
    },
    options: {
      responsive: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `R$ ${Number(value).toLocaleString('pt-BR')}`,
            font: { size: 12 }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          ticks: {
            font: { size: 12 }
          },
          grid: {
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
          font: { size: 18, weight: 'bold' }
        },
        tooltip: {
          callbacks: {
            label: (context) => `Economia: R$ ${context.parsed.y.toLocaleString('pt-BR')}`
          }
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

  return canvas.toDataURL('image/png')
}
