import { Hono } from 'hono'
import { DashboardPage, LoginPage } from '../../ui/pages'

export const uiRouter = new Hono()

uiRouter.get('/', (c) => {
  return c.redirect('/dashboard')
})

uiRouter.get('/dashboard', (c) => {
  return c.html(<DashboardPage />)
})

uiRouter.get('/login', (c) => {
  return c.html(<LoginPage />)
})
