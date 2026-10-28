export interface AppConfig {
  port: number
  nodeEnv: string
  databaseUrl: string
  sessionSecret: string
  masterPasswordHash: string
}

export function loadConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  return {
    port: Number(env.PORT) || 3000,
    nodeEnv: env.NODE_ENV || 'development',
    databaseUrl: env.DATABASE_URL || 'linkguard.sqlite',
    sessionSecret: env.SESSION_SECRET || 'linkguard-dev-hmac-secret-change-in-production',
    masterPasswordHash: env.MASTER_PASSWORD_HASH || '',
  }
}

export const config = loadConfig()
