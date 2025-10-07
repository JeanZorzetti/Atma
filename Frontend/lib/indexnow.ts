/**
 * IndexNow Utility
 * Helpers for submitting URLs to search engines via IndexNow protocol
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://atma.roilabs.com.br'

interface IndexNowResponse {
  success: boolean
  submitted?: number
  url?: string
  engines?: Array<{
    engine: string
    status: number
    ok: boolean
  }>
  successfulSubmissions?: number
  error?: string
}

/**
 * Submit a single URL to IndexNow
 * @param url - Full URL to submit (must be on atma.roilabs.com.br)
 * @returns Promise with submission result
 */
export async function submitUrl(url: string): Promise<IndexNowResponse> {
  try {
    const response = await fetch('/api/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    return await response.json()
  } catch (error) {
    console.error('IndexNow submission failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Submit multiple URLs to IndexNow
 * @param urls - Array of full URLs (max 10,000)
 * @returns Promise with submission result
 */
export async function submitUrls(urls: string[]): Promise<IndexNowResponse> {
  try {
    const response = await fetch('/api/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    })

    return await response.json()
  } catch (error) {
    console.error('IndexNow batch submission failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Submit all URLs from sitemap to IndexNow
 * Useful after major site updates or deployments
 */
export async function submitSitemap(): Promise<IndexNowResponse> {
  try {
    // Fetch sitemap
    const sitemapResponse = await fetch(`${BASE_URL}/sitemap.xml`)
    const sitemapText = await sitemapResponse.text()

    // Extract URLs from sitemap XML
    const urlMatches = sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)
    const urls = Array.from(urlMatches).map(match => match[1])

    if (urls.length === 0) {
      return {
        success: false,
        error: 'No URLs found in sitemap',
      }
    }

    // Submit all URLs
    return await submitUrls(urls)
  } catch (error) {
    console.error('Sitemap submission failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Submit the current page to IndexNow
 * Useful for client-side submissions after content updates
 */
export async function submitCurrentPage(): Promise<IndexNowResponse> {
  if (typeof window === 'undefined') {
    return {
      success: false,
      error: 'Can only be called from browser',
    }
  }

  const currentUrl = window.location.href
  return await submitUrl(currentUrl)
}

/**
 * Create a helper for submitting pages on navigation/updates
 * @param enabled - Whether IndexNow is enabled (default: production only)
 */
export function createIndexNowSubmitter(enabled?: boolean) {
  const isEnabled = enabled ?? process.env.NODE_ENV === 'production'

  return {
    /**
     * Submit a page path (e.g., '/pacientes/precos')
     */
    async submitPath(path: string): Promise<IndexNowResponse | null> {
      if (!isEnabled) {
        console.log('[IndexNow] Skipped (not in production):', path)
        return null
      }

      const url = `${BASE_URL}${path}`
      return await submitUrl(url)
    },

    /**
     * Submit multiple page paths
     */
    async submitPaths(paths: string[]): Promise<IndexNowResponse | null> {
      if (!isEnabled) {
        console.log('[IndexNow] Skipped (not in production):', paths.length, 'URLs')
        return null
      }

      const urls = paths.map(path => `${BASE_URL}${path}`)
      return await submitUrls(urls)
    },

    /**
     * Submit entire sitemap
     */
    async submitAll(): Promise<IndexNowResponse | null> {
      if (!isEnabled) {
        console.log('[IndexNow] Skipped (not in production): sitemap submission')
        return null
      }

      return await submitSitemap()
    },
  }
}
