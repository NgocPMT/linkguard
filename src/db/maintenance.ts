import type { Database } from 'bun:sqlite'
import { SQLITE_PRUNE_DAYS } from '../config/constants'

export function pruneOldScans(db: Database, retentionDays = SQLITE_PRUNE_DAYS): number {
  // Skeleton implementation: when schema tables are migrated, deletes scans older than retentionDays
  const result = db.run('SELECT 1 WHERE 1 = 0')
  return result.changes
}

export function vacuumDatabase(db: Database): void {
  db.exec('PRAGMA incremental_vacuum;')
}
