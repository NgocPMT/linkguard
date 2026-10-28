import { describe, expect, it } from 'bun:test'
import app from '../../src/index'

describe('Application Endpoints Integration', () => {
  it('GET /healthz returns healthy status JSON', async () => {
    const res = await app.request('/healthz')
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(data.status).toBe('healthy')
    expect(data.timestamp).toBeDefined()
  })

  it('GET / redirects to /dashboard', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('/dashboard')
  })

  it('GET /dashboard renders SSR HTML document', async () => {
    const res = await app.request('/dashboard')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')

    const body = await res.text()
    expect(body).toContain('LinkGuard')
    expect(body).toContain('Monitoring Dashboard')
  })

  it('GET /login renders master access login page', async () => {
    const res = await app.request('/login')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')

    const body = await res.text()
    expect(body).toContain('Master Access')
  })

  it('GET /api/sites returns empty site array in skeleton state', async () => {
    const res = await app.request('/api/sites')
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('POST /api/scans accepts new crawl scan request', async () => {
    const res = await app.request('/api/scans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' }),
    })
    expect(res.status).toBe(202)

    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(data.data.status).toBe('pending')
  })
})
