import { DEFAULT_CONCURRENCY, DEFAULT_CRAWL_DEPTH } from '../../config/constants'
import type { DiscoveredLink } from '../../shared/types'

export interface CrawlOptions {
  maxDepth?: number
  concurrency?: number
}

export interface CrawlerEngine {
  crawl(rootUrl: string, options?: CrawlOptions): Promise<DiscoveredLink[]>
}

export class BfsCrawler implements CrawlerEngine {
  async crawl(rootUrl: string, options: CrawlOptions = {}): Promise<DiscoveredLink[]> {
    const _maxDepth = options.maxDepth ?? DEFAULT_CRAWL_DEPTH
    const _concurrency = options.concurrency ?? DEFAULT_CONCURRENCY

    // Skeleton stub: will be fleshed out with Cheerio static parsing & queue
    return [
      {
        id: 'link_root',
        scanId: 'scan_init',
        url: rootUrl,
        parentUrl: rootUrl,
        statusCode: 200,
        isBroken: false,
      },
    ]
  }
}
