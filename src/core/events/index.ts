import type { AlertPayload, ScanProgressEvent } from '../../shared/types'

export type EventMap = {
  'scan:started': { scanId: string; siteUrl: string }
  'scan:progress': ScanProgressEvent
  'scan:completed': { scanId: string; totalScanned: number; brokenCount: number }
  'link:broken': AlertPayload
}

export type EventListener<T> = (data: T) => void | Promise<void>

export class EventBus {
  private listeners: Map<keyof EventMap, Set<EventListener<EventMap[keyof EventMap]>>> = new Map()

  on<K extends keyof EventMap>(event: K, listener: EventListener<EventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)?.add(listener as EventListener<EventMap[keyof EventMap]>)
  }

  off<K extends keyof EventMap>(event: K, listener: EventListener<EventMap[K]>): void {
    this.listeners.get(event)?.delete(listener as EventListener<EventMap[keyof EventMap]>)
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const handlers = this.listeners.get(event)
    if (!handlers) return
    for (const handler of handlers) {
      try {
        handler(data)
      } catch (err: unknown) {
        console.error(`[EventBus] Error in listener for ${String(event)}:`, err)
      }
    }
  }
}

export const eventBus = new EventBus()
