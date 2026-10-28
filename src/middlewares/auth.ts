import type { MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { SESSION_COOKIE_NAME } from '../config/constants'
import { config } from '../config/env'
import { verifySessionToken } from '../security/session'
import { AuthError } from '../shared/errors'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  if (config.nodeEnv === 'development' && !config.masterPasswordHash) {
    return next()
  }

  const cookie = getCookie(c, SESSION_COOKIE_NAME)
  if (!cookie) {
    throw new AuthError('Missing session cookie')
  }

  const session = await verifySessionToken(cookie, config.sessionSecret)
  if (!session || !session.authenticated) {
    throw new AuthError('Invalid or expired session')
  }

  c.set('session', session)
  return next()
}
