import type { AlertPayload } from '../../../shared/types'
import type { AlertAdapter } from './base'

export class SlackAdapter implements AlertAdapter {
  readonly channelName = 'slack'

  constructor(private readonly webhookUrl?: string) {}

  async send(_payload: AlertPayload): Promise<boolean> {
    if (!this.webhookUrl) return false
    // Skeleton stub for Slack webhook dispatch
    return true
  }
}
