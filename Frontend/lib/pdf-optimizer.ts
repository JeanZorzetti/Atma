/**
 * Otimizações para geração de PDF
 * Fase 4.2: Redução de tamanho e performance
 */

import crypto from 'crypto'

// Cache em memória para gráficos (evita regenerar gráficos idênticos)
const chartCache = new Map<string, string>()

// Configurações de otimização
export const OPTIMIZATION_CONFIG = {
  // Qualidade de imagens (0-1, onde 1 = máxima qualidade)
  imageQuality: 0.85,

  // Máximo de entradas no cache (limpar antigas)
  maxCacheEntries: 100,

  // TTL do cache em milissegundos (15 minutos)
  cacheTTL: 15 * 60 * 1000,

  // Comprimir imagens de gráficos
  compressCharts: true,

  // Reduzir resolução de gráficos para PDF (ainda fica bom)
  chartScale: 2, // 2x = boa qualidade, 1x = menor tamanho
}

interface CacheEntry {
  data: string
  timestamp: number
  hits: number
}

const chartCacheWithMetadata = new Map<string, CacheEntry>()

/**
 * Gera hash único para cache baseado nos parâmetros do gráfico
 */
export function generateCacheKey(type: string, params: any): string {
  const paramsString = JSON.stringify(params)
  return crypto.createHash('md5').update(`${type}:${paramsString}`).digest('hex')
}

/**
 * Busca gráfico no cache
 */
export function getCachedChart(cacheKey: string): string | null {
  const entry = chartCacheWithMetadata.get(cacheKey)

  if (!entry) {
    return null
  }

  // Verificar se expirou
  const now = Date.now()
  if (now - entry.timestamp > OPTIMIZATION_CONFIG.cacheTTL) {
    chartCacheWithMetadata.delete(cacheKey)
    return null
  }

  // Incrementar hits
  entry.hits++

  console.log(`✅ Cache HIT para gráfico: ${cacheKey.substring(0, 8)}... (${entry.hits} hits)`)
  return entry.data
}

/**
 * Armazena gráfico no cache
 */
export function setCachedChart(cacheKey: string, data: string): void {
  // Limpar cache se estiver muito grande
  if (chartCacheWithMetadata.size >= OPTIMIZATION_CONFIG.maxCacheEntries) {
    cleanOldCacheEntries()
  }

  chartCacheWithMetadata.set(cacheKey, {
    data,
    timestamp: Date.now(),
    hits: 0
  })

  console.log(`💾 Cache MISS - armazenado: ${cacheKey.substring(0, 8)}... (total: ${chartCacheWithMetadata.size})`)
}

/**
 * Limpa entradas antigas do cache (LRU - Least Recently Used)
 */
function cleanOldCacheEntries(): void {
  const entries = Array.from(chartCacheWithMetadata.entries())

  // Ordenar por hits (menos usado primeiro)
  entries.sort((a, b) => a[1].hits - b[1].hits)

  // Remover 20% das entradas menos usadas
  const toRemove = Math.floor(entries.length * 0.2)
  for (let i = 0; i < toRemove; i++) {
    chartCacheWithMetadata.delete(entries[i][0])
  }

  console.log(`🧹 Cache limpo: ${toRemove} entradas removidas (restam ${chartCacheWithMetadata.size})`)
}

/**
 * Comprime imagem base64 (reduz qualidade mantendo boa visualização)
 */
export async function compressImageDataURL(dataURL: string, quality = OPTIMIZATION_CONFIG.imageQuality): Promise<string> {
  if (!OPTIMIZATION_CONFIG.compressCharts) {
    return dataURL
  }

  try {
    // Para PNG (usado nos gráficos), não há compressão nativa
    // Mas podemos reduzir a resolução mantendo qualidade visual

    // Se já estiver comprimido (tamanho razoável), retornar
    const sizeKB = (dataURL.length * 3) / 4 / 1024
    if (sizeKB < 50) {
      // Já está pequeno (< 50KB)
      return dataURL
    }

    // Para imagens grandes, poderíamos converter PNG -> JPEG com qualidade
    // mas isso muda a transparência. Por ora, retornamos o original.
    // Futura otimização: usar sharp para comprimir PNG

    return dataURL

  } catch (error) {
    console.error('Erro ao comprimir imagem:', error)
    return dataURL
  }
}

/**
 * Obtém estatísticas do cache
 */
export function getCacheStats(): {
  size: number
  totalHits: number
  entries: Array<{ key: string; hits: number; age: number }>
} {
  const entries = Array.from(chartCacheWithMetadata.entries()).map(([key, entry]) => ({
    key: key.substring(0, 8),
    hits: entry.hits,
    age: Math.round((Date.now() - entry.timestamp) / 1000 / 60) // minutos
  }))

  const totalHits = entries.reduce((sum, e) => sum + e.hits, 0)

  return {
    size: chartCacheWithMetadata.size,
    totalHits,
    entries: entries.sort((a, b) => b.hits - a.hits).slice(0, 10) // Top 10
  }
}

/**
 * Limpa todo o cache
 */
export function clearCache(): void {
  const size = chartCacheWithMetadata.size
  chartCacheWithMetadata.clear()
  console.log(`🗑️ Cache completamente limpo (${size} entradas removidas)`)
}

/**
 * Estima tamanho do PDF baseado nos dados
 */
export function estimatePDFSize(dados: {
  numPages: number
  numCharts: number
  hasImages: boolean
}): { estimatedSizeKB: number; warning?: string } {
  let sizeKB = 0

  // Base: ~5KB por página (texto + tabelas)
  sizeKB += dados.numPages * 5

  // Gráficos: ~40-60KB cada (PNG base64)
  sizeKB += dados.numCharts * 50

  // Imagens adicionais (se houver)
  if (dados.hasImages) {
    sizeKB += 100 // Estimativa conservadora
  }

  let warning: string | undefined

  if (sizeKB > 2000) {
    warning = 'PDF grande (>2MB) - considere otimizar imagens'
  } else if (sizeKB > 5000) {
    warning = 'PDF muito grande (>5MB) - envio por email pode falhar'
  }

  return {
    estimatedSizeKB: Math.round(sizeKB),
    warning
  }
}

/**
 * Otimiza configuração do jsPDF para reduzir tamanho
 */
export function getOptimizedPDFConfig() {
  return {
    compress: true, // Ativar compressão interna do PDF
    precision: 2, // Reduzir precisão de números (2 casas decimais)
    userUnit: 1.0, // Unidade padrão
  }
}

/**
 * Wrapper para geração de gráfico com cache
 */
export async function generateChartWithCache<T>(
  type: string,
  params: T,
  generator: (params: T) => Promise<string>
): Promise<string> {
  const cacheKey = generateCacheKey(type, params)

  // Tentar cache primeiro
  const cached = getCachedChart(cacheKey)
  if (cached) {
    return cached
  }

  // Gerar novo gráfico
  const startTime = Date.now()
  const chartDataURL = await generator(params)
  const duration = Date.now() - startTime

  console.log(`📊 Gráfico ${type} gerado em ${duration}ms`)

  // Comprimir se configurado
  const compressed = await compressImageDataURL(chartDataURL)

  // Armazenar no cache
  setCachedChart(cacheKey, compressed)

  return compressed
}

/**
 * Reduz resolução de canvas para otimizar tamanho
 */
export function getOptimizedCanvasSize(originalWidth: number, originalHeight: number): {
  width: number
  height: number
} {
  const scale = OPTIMIZATION_CONFIG.chartScale

  return {
    width: originalWidth * scale,
    height: originalHeight * scale
  }
}

/**
 * Monitora uso de memória do cache
 */
export function monitorCacheMemory(): {
  entriesCount: number
  estimatedMemoryMB: number
} {
  const entries = Array.from(chartCacheWithMetadata.values())

  // Estimar tamanho em memória (base64 data URLs)
  const totalBytes = entries.reduce((sum, entry) => {
    return sum + (entry.data.length * 0.75) // base64 -> bytes (aproximado)
  }, 0)

  return {
    entriesCount: entries.length,
    estimatedMemoryMB: Math.round(totalBytes / 1024 / 1024 * 100) / 100
  }
}
