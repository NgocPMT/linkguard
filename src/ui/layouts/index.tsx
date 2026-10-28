import type { FC, PropsWithChildren } from 'hono/jsx'

export interface BaseLayoutProps {
  title?: string
}

export const BaseLayout: FC<PropsWithChildren<BaseLayoutProps>> = ({
  title = 'LinkGuard - Website Health & Broken Link Monitoring',
  children,
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <link rel="stylesheet" href="/css/app.css" />
      </head>
      <body className="bg-slate-900 text-slate-100 min-h-screen">
        <header className="border-b border-slate-800 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-white">LinkGuard</h1>
            <nav className="space-x-4 text-sm text-slate-400">
              <a href="/dashboard" className="hover:text-white">
                Dashboard
              </a>
              <a href="/api/sites" className="hover:text-white">
                API
              </a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
