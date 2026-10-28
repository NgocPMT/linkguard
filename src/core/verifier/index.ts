import { DEFAULT_TIMEOUT_MS, USER_AGENT } from '../../config/constants'

export interface ProbeResult {
  url: string
  statusCode: number
  isBroken: boolean
  responseTimeMs: number
  errorDetails?: string
}

export class VerifierEngine {
  async verify(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<ProbeResult> {
    const start = performance.now()
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(timeoutMs),
      })
      const responseTimeMs = Math.round(performance.now() - start)
      const isBroken = response.status >= 400

      return {
        url,
        statusCode: response.status,
        isBroken,
        responseTimeMs,
      }
    } catch (err: unknown) {
      const errorDetails = err instanceof Error ? err.message : 'Network resolution failed'
      return {
        url,
        statusCode: 0,
        isBroken: true,
        responseTimeMs: Math.round(performance.now() - start),
        errorDetails,
      }
    }
  }
}
