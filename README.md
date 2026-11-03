# LinkGuard

> **Ultra-lightweight, self-hosted website health and real-time broken link monitoring platform.**

LinkGuard is an independent, single-container solution designed to run 24/7 on minimal-resource environments (such as budget VPS or entry-level cloud servers) with a sub-128MB RAM footprint. It continuously crawls registered websites, monitors URL health, detects broken links in real time, visualizes link networks, and dispatches instant alerts across multiple chat channels.

---

## Key Features & Value Proposition

- **SEO & Traffic Retention:** Automatically detects 404s, 500s, DNS resolution errors, and expired SSL certificates before they damage search engine rankings and disrupt visitor experiences.
- **Silent Revenue Protection:** Guarantees affiliate links, sponsored references, and product CTA targets remain healthy without manual audits.
- **Zero-Bloat Self-Hosted Architecture:** Replaces heavy, recurring-cost commercial SaaS platforms (Ahrefs, Semrush, Screaming Frog) with a nimble, standalone utility running on modern web standards.
- **Real-Time Live Monitoring:** Emits streaming progress updates via Server-Sent Events (SSE) directly to an interactive dashboard with proxy-buffering protection.
- **Multi-Channel Alert Dispatcher:** Employs an extensible Adapter Pattern to broadcast standardized error payloads in parallel to Telegram, Discord, and Slack without cross-channel blocking.
- **Production-Ready & Reverse-Proxy Aware:** Engineered to sit securely behind reverse proxies (Caddy, Nginx, Cloudflare) with native `X-Forwarded-*` header parsing, loopback isolation (`127.0.0.1`), and zero-dependency Web Crypto HMAC session protection.

---

## System Architecture & Specifications

LinkGuard is designed according to the **C4 Model** for clear system context and runtime modularity. The full system architecture, database schema, and REST API contracts are maintained in dedicated specifications:

* **[System Architecture Overview](docs/architecture/overview.md):** C4 System Context & Container diagrams, end-to-end execution lifecycle, component boundaries, and technology stack rationales.
* **[Database Schema Specification](docs/architecture/database-schema.md):** Canonical SQLite DDL tables (`sites`, `scans`, `discovered_links`), constraints, and performance indexes.
* **[REST API Contract Specification](docs/architecture/api-spec.md):** Canonical REST endpoints, request/response JSON schemas, query parameters, and error envelopes.

---

## Repository Structure

The codebase is organized as a unified, modular monolith:

```text
linkguard/
├── .agents/                    # Agent skills, operational guidelines, and tool configs
├── docs/                       # Project documentation and architectural governance
│   ├── architecture/           # System architecture, database schema & API contracts
│   ├── adr/                    # Architecture Decision Records (e.g., 0001-storage-sqlite.md)
│   ├── use-cases/              # Functional use case specifications
│   ├── rfcs/                   # Technical Request for Comments proposals
│   └── diagrams/               # Architecture and container diagrams (.drawio / .png)
│
├── public/                     # Static client-side assets
│   ├── css/
│   │   └── app.css             # Lightweight utility styling
│   └── js/
│       ├── sse-client.js       # Real-time Server-Sent Events client listener
│       └── link-graph.js       # Minimal SVG/Canvas link network visualization
│
├── src/
│   ├── config/                 # Application configuration and type-safe environment variables
│   │   ├── env.ts              # Schema validation and runtime env variables
│   │   └── constants.ts        # Default crawler depth, rate limits, and timeouts
│   │
│   ├── db/                     # Embedded SQLite persistence layer
│   │   ├── client.ts           # Bun:sqlite connection factory & WAL configuration
│   │   ├── migrations/         # Raw SQL schema migration scripts
│   │   ├── repositories/       # Isolated data access repositories (sites, scans, links, alerts)
│   │   └── maintenance.ts      # Log retention policy & vacuum cleanup
│   │
│   ├── core/                   # Domain business logic (runtime & framework agnostic)
│   │   ├── crawler/            # Discovery Engine: BFS traversal, Cheerio parser
│   │   ├── verifier/           # Verification Engine: HEAD/GET verification, polite rate limiter
│   │   ├── alerts/             # Multi-channel notification subsystem
│   │   │   ├── dispatcher.ts   # Parallel broadcaster & resilience handler
│   │   │   └── adapters/       # Channel adapters (base, telegram, discord, slack)
│   │   ├── events/             # In-memory typed Event Bus for SSE & decoupled alerts
│   │   └── scheduler/          # Background cron scheduler for automated recurring scans
│   │
│   ├── security/               # Core cryptographic primitives and session token management
│   │   ├── crypto.ts           # Web Crypto HMAC signing, constant-time comparison, key generation
│   │   └── session.ts          # Session payload serialization, token encryption & lifecycle
│   │
│   ├── middlewares/            # Hono HTTP request/response pipeline interceptors
│   │   ├── auth.ts             # Route guard middleware (validates signed session cookies)
│   │   ├── proxy.ts            # Trusted reverse proxy middleware (parses X-Forwarded-* headers)
│   │   ├── logger.ts           # Request logging, correlation IDs, and execution timing
│   │   └── error.ts            # Centralized HTTP error boundary and exception handler
│   │
│   ├── shared/                 # Cross-cutting types, utilities, and errors reusable across all layers
│   │   ├── types/              # Universal domain DTOs, Result types, and event contracts
│   │   ├── utils/              # Pure utility functions (URL normalization, string & time helpers)
│   │   └── errors/             # Standard domain and application exception classes
│   │
│   ├── routes/                 # Hono routing and controllers
│   │   ├── api/                # REST & SSE endpoints (/api/sites, /api/scans, /api/events)
│   │   └── ui/                 # Server-rendered view routes (login, dashboard, site details)
│   │
│   ├── ui/                     # Presentation layer (Hono JSX templates)
│   │   ├── layouts/            # Base HTML shell and shared layouts
│   │   ├── pages/              # Full page templates (Dashboard, SiteDetail, Login)
│   │   └── components/         # Reusable UI micro-components (tables, badges, stat cards)
│   │
│   └── index.ts                # Application entrypoint (assembles Hono, mounts routes, starts scheduler)
│
├── tests/                      # Automated test suites
│   ├── fixtures/               # Mock HTML pages & broken link edge-case samples
│   ├── unit/                   # Unit tests for URL normalizer, Cheerio parser, and crypto helpers
│   └── integration/            # In-memory Hono route testing via app.request()
│
├── package.json                # Project dependencies and operational scripts
├── tsconfig.json               # TypeScript compiler configuration (hono/jsx configured)
└── README.md                   # Project overview and architectural blueprint
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.1.0 or newer)

### Installation

```sh
# Clone repository
git clone https://github.com/NgocPMT/linkguard.git
cd linkguard

# Install dependencies
bun install
```

### Running Locally

```sh
# Start local development server with hot-reload
bun run dev
```

The application will start on `http://localhost:3000`.

### Testing & Code Quality

```sh
# Run unit and integration test suites
bun test

# Inspect registered routes using the Hono CLI
bunx hono routes
```
