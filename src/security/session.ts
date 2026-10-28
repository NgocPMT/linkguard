import { signData, verifySignedData } from './crypto'

export interface SessionPayload {
  authenticated: boolean
  issuedAt: number
}

export async function createSessionToken(payload: SessionPayload, secret: string): Promise<string> {
  const serialized = JSON.stringify(payload)
  return signData(serialized, secret)
}

export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<SessionPayload | null> {
  const verified = await verifySignedData(token, secret)
  if (!verified) return null
  try {
    return JSON.parse(verified) as SessionPayload
  } catch {
    return null
  }
}
