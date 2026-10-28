import { describe, expect, it } from 'bun:test'
import { signData, verifySignedData } from '../../src/security/crypto'
import { createSessionToken, verifySessionToken } from '../../src/security/session'

describe('Crypto & Session Security', () => {
  const secret = 'super-secure-test-secret-key-12345'

  it('signs and verifies data with HMAC SHA-256', async () => {
    const data = 'user_id_42'
    const signed = await signData(data, secret)
    expect(signed).toContain(data)

    const verified = await verifySignedData(signed, secret)
    expect(verified).toBe(data)
  })

  it('rejects tampered data', async () => {
    const data = 'user_id_42'
    const signed = await signData(data, secret)
    const tampered = signed.replace('user_id_42', 'user_id_99')

    const verified = await verifySignedData(tampered, secret)
    expect(verified).toBeNull()
  })

  it('rejects verification with wrong secret', async () => {
    const data = 'session_payload'
    const signed = await signData(data, secret)

    const verified = await verifySignedData(signed, 'wrong-secret-key')
    expect(verified).toBeNull()
  })

  it('creates and verifies JSON session tokens', async () => {
    const payload = { authenticated: true, issuedAt: Date.now() }
    const token = await createSessionToken(payload, secret)

    const recovered = await verifySessionToken(token, secret)
    expect(recovered).not.toBeNull()
    expect(recovered?.authenticated).toBe(true)
    expect(recovered?.issuedAt).toBe(payload.issuedAt)
  })
})
