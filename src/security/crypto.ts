export async function signData(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  const base64Sig = Buffer.from(signature).toString('base64url')
  return `${data}.${base64Sig}`
}

export async function verifySignedData(
  signedValue: string,
  secret: string,
): Promise<string | null> {
  const lastDot = signedValue.lastIndexOf('.')
  if (lastDot === -1) return null

  const data = signedValue.slice(0, lastDot)
  const signaturePart = signedValue.slice(lastDot + 1)
  const expectedSigned = await signData(data, secret)
  const expectedSigPart = expectedSigned.slice(data.length + 1)

  if (signaturePart === expectedSigPart) {
    return data
  }
  return null
}

export async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder()
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(text))
  return Buffer.from(digest).toString('hex')
}
