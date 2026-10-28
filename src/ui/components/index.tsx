import type { FC } from 'hono/jsx'

export interface StatCardProps {
  label: string
  value: string | number
  description?: string
}

export const StatCard: FC<StatCardProps> = ({ label, value, description }) => {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 shadow-sm">
      <div className="text-sm font-medium text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
      {description && <div className="mt-1 text-xs text-slate-500">{description}</div>}
    </div>
  )
}

export interface BadgeProps {
  status: 'healthy' | 'broken' | 'warning'
  text: string
}

export const Badge: FC<BadgeProps> = ({ status, text }) => {
  const colorMap = {
    healthy: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    broken: 'bg-rose-950 text-rose-400 border-rose-800',
    warning: 'bg-amber-950 text-amber-400 border-amber-800',
  }
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${colorMap[status]}`}
    >
      {text}
    </span>
  )
}
