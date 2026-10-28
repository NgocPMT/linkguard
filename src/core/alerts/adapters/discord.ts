import type { AlertPayload } from '../../../shared/types'
import type { AlertAdapter } from './base'

export class DiscordAdapter implements AlertAdapter {
  readonly channelName = 'discord'

  constructor(private readonly webhookUrl?: string) {}

  async send(_payload: AlertPayload): Promise<boolean> {
    if (!this.webhookUrl) return false
    // Skeleton stub for Discord webhook dispatch
    return true
  }
}
