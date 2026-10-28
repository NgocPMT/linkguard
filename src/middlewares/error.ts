import type { MiddlewareHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { AppError } from '../shared/errors'

export const errorHandler: MiddlewareHandler = async (c) => {
  const err = c.error
  const statusCode = (err instanceof AppError ? err.statusCode : 500) as ContentfulStatusCode
  const message = err?.message || 'Internal Server Error'
  const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR'

  return c.json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    },
    statusCode,
  )
}
