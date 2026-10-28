import type { MiddlewareHandler } from 'hono'

export const proxyMiddleware: MiddlewareHandler = async (c, next) => {
  const forwardedFor = c.req.header('x-forwarded-for')
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'
  const proto = c.req.header('x-forwarded-proto') || 'http'

  c.set('clientIp', clientIp)
  c.set('protocol', proto)

  return next()
}
