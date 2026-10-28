export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface Site {
  id: string
  url: string
  name: string
  createdAt: string
  lastScannedAt?: string
}

export interface Scan {
  id: string
  siteId: string
  status: ScanStatus
  startedAt: string
  completedAt?: string
  totalLinks: number
  brokenLinks: number
}

export interface DiscoveredLink {
  id: string
  scanId: string
  url: string
  parentUrl: string
  statusCode?: number
  isBroken: boolean
  errorDetails?: string
  responseTimeMs?: number
}

export interface AlertPayload {
  siteName: string
  siteUrl: string
  brokenUrl: string
  parentUrl: string
  statusCode?: number
  errorDetails?: string
  timestamp: string
}

export interface ScanProgressEvent {
  scanId: string
  scannedCount: number
  totalDiscovered: number
  currentUrl: string
}
