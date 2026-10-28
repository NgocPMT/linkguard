import type { AlertPayload } from '../../../shared/types'
import type { AlertAdapter } from './base'

export class TelegramAdapter implements AlertAdapter {
  readonly channelName = 'telegram'

  constructor(
    private readonly botToken?: string,
    private readonly chatId?: string,
  ) {}

  async send(_payload: AlertPayload): Promise<boolean> {
    if (!this.botToken || !this.chatId) return false
    // Skeleton stub for Telegram bot API dispatch
    return true
  }
}
