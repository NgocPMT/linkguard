import { Hono } from 'hono'
import { errorHandler } from './middlewares/error'
import { loggerMiddleware } from './middlewares/logger'
import { proxyMiddleware } from './middlewares/proxy'
import { apiRouter } from './routes/api'
import { uiRouter } from './routes/ui'

const app = new Hono()

// Global Middlewares
app.use('*', proxyMiddleware)
app.use('*', loggerMiddleware)
app.onError(errorHandler)

// Health and liveness endpoint
app.get('/healthz', (c) => {
  return c.json({
    ok: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  })
})

// Sub-routers
app.route('/api', apiRouter)
app.route('/', uiRouter)

export default app
