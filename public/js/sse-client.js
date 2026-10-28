// LinkGuard SSE Client Listener Stub
export function initSSE(endpoint = '/api/events') {
  if (typeof window === 'undefined') return null

  const eventSource = new EventSource(endpoint)
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log('[LinkGuard SSE]', data)
    } catch {
      console.log('[LinkGuard SSE Raw]', event.data)
    }
  }

  eventSource.onerror = (err) => {
    console.error('[LinkGuard SSE Error]', err)
  }

  return eventSource
}
