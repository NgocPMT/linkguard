import type { AlertPayload } from '../../shared/types'
import type { AlertAdapter } from './adapters/base'

export class AlertDispatcher {
  private adapters: AlertAdapter[] = []

  registerAdapter(adapter: AlertAdapter): void {
    this.adapters.push(adapter)
  }

  async dispatch(payload: AlertPayload): Promise<void> {
    await Promise.allSettled(
      this.adapters.map(async (adapter) => {
        try {
          await adapter.send(payload)
        } catch (err) {
          console.error(`[AlertDispatcher] Failed delivery via ${adapter.channelName}:`, err)
        }
      }),
    )
  }
}
