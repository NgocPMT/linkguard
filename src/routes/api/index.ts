import { Hono } from 'hono'
import { getDatabase } from '../../db/client'
import { createRepositories } from '../../db/repositories'

export const apiRouter = new Hono()

apiRouter.get('/sites', async (c) => {
  const db = getDatabase()
  const { sites } = createRepositories(db)
  const allSites = await sites.findAll()
  return c.json({ ok: true, data: allSites })
})

apiRouter.post('/scans', async (c) => {
  const body = await c.req.json<{ url?: string }>().catch(() => ({}) as { url?: string })
  return c.json(
    {
      ok: true,
      data: {
        scanId: 'scan_init',
        status: 'pending',
        targetUrl: body?.url || '',
      },
    },
    202,
  )
})

apiRouter.get('/events', (c) => {
  // SSE placeholder endpoint
  return c.text('data: {"status":"connected"}\n\n', 200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
})
