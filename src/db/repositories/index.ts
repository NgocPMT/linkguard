import type { Database } from 'bun:sqlite'
import type { DiscoveredLink, Scan, Site } from '../../shared/types'

export interface SiteRepository {
  create(site: Omit<Site, 'id' | 'createdAt'>): Promise<Site>
  findById(id: string): Promise<Site | null>
  findAll(): Promise<Site[]>
}

export interface ScanRepository {
  create(scan: Omit<Scan, 'id' | 'startedAt' | 'totalLinks' | 'brokenLinks'>): Promise<Scan>
  findById(id: string): Promise<Scan | null>
  findBySiteId(siteId: string): Promise<Scan[]>
  updateStatus(id: string, status: Scan['status']): Promise<void>
}

export interface LinkRepository {
  recordLink(link: Omit<DiscoveredLink, 'id'>): Promise<DiscoveredLink>
  findBrokenByScanId(scanId: string): Promise<DiscoveredLink[]>
}

export function createRepositories(_db: Database) {
  // Stub repositories returning empty results until tables are migrated
  const sites: SiteRepository = {
    async create(site) {
      return { id: 'site_stub', createdAt: new Date().toISOString(), ...site }
    },
    async findById(_id) {
      return null
    },
    async findAll() {
      return []
    },
  }

  const scans: ScanRepository = {
    async create(scan) {
      return {
        id: 'scan_stub',
        startedAt: new Date().toISOString(),
        totalLinks: 0,
        brokenLinks: 0,
        ...scan,
      }
    },
    async findById(_id) {
      return null
    },
    async findBySiteId(_siteId) {
      return []
    },
    async updateStatus(_id, _status) {},
  }

  const links: LinkRepository = {
    async recordLink(link) {
      return { id: 'link_stub', ...link }
    },
    async findBrokenByScanId(_scanId) {
      return []
    },
  }

  return { sites, scans, links }
}
