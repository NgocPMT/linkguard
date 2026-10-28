import type { FC } from 'hono/jsx'
import { StatCard } from '../components'
import { BaseLayout } from '../layouts'

export const DashboardPage: FC = () => {
  return (
    <BaseLayout title="LinkGuard - Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Monitoring Dashboard</h2>
          <button
            type="button"
            className="rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            New Scan
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Monitored Sites" value={0} description="Active targets" />
          <StatCard label="Total Scanned" value={0} description="All-time link checks" />
          <StatCard label="Broken Links" value={0} description="Needs remediation" />
        </div>
      </div>
    </BaseLayout>
  )
}

export const LoginPage: FC = () => {
  return (
    <BaseLayout title="LinkGuard - Login">
      <div className="mx-auto max-w-sm mt-12 rounded-lg border border-slate-800 bg-slate-950 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white text-center">Master Access</h2>
        <form className="mt-4 space-y-4" method="post" action="/login">
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate-400">
              Master Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            Authenticate
          </button>
        </form>
      </div>
    </BaseLayout>
  )
}
