import type { AlertPayload } from '../../../shared/types'

export interface AlertAdapter {
  readonly channelName: string
  send(payload: AlertPayload): Promise<boolean>
}
