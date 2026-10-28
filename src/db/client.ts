import { Database } from 'bun:sqlite'
import { config } from '../config/env'

let dbInstance: Database | null = null

export function getDatabase(dbPath = config.databaseUrl): Database {
  if (!dbInstance || dbPath === ':memory:') {
    const db = new Database(dbPath)
    db.exec('PRAGMA journal_mode = WAL;')
    db.exec('PRAGMA synchronous = NORMAL;')
    db.exec('PRAGMA foreign_keys = ON;')
    if (dbPath !== ':memory:') {
      dbInstance = db
    }
    return db
  }
  return dbInstance
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}
