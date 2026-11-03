# REST API Contract Specification

This document defines the canonical REST API specification for **LinkGuard (Increment 1: Core Engine & Walking Skeleton)**.

---

## 1. General API Conventions

### Base URL & Transport
* **Base URL:** `/api`
* **Content Negotiation:** All request bodies and response payloads use `application/json; charset=utf-8`.
* **Timestamps:** All dates and times are formatted as standard ISO 8601 UTC strings (`YYYY-MM-DDTHH:mm:ss.sssZ`).
* **Authentication in Increment 1:** Unenforced / bypassed for local development and private internal network deployments.

### Standard Error Envelope

All 4xx and 5xx responses return a consistent error JSON envelope:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid URL protocol: rootUrl must start with http:// or https://",
    "details": {
      "field": "rootUrl",
      "value": "ftp://example.com"
    }
  }
}
```

#### Standard Error Codes

| Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `BAD_REQUEST` | `400` | Malformed payload, invalid URL syntax, or illegal cron expression. |
| `NOT_FOUND` | `404` | Requested site or scan resource was not found. |
| `CONFLICT` | `409` | Conflict detected: duplicate site `root_url` or scan already running. |
| `INTERNAL_ERROR`| `500` | Unexpected server-side failure. |

---

## 2. Sites API (`/api/sites`)

### 2.1 Create Target Website

Registers a new target website to be crawled and monitored.

* **Method:** `POST`
* **Path:** `/api/sites`

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "name": "Personal Tech Blog",
  "rootUrl": "https://example.com",
  "cronSchedule": "0 2 * * *",
  "maxDepth": 3,
  "concurrency": 5
}
```

| Field | Type | Required | Default | Validation Rules |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `string` | Yes | — | 1 to 100 characters, trimmed. |
| `rootUrl` | `string` | Yes | — | Must be valid URI with `http://` or `https://`. Normalized (fragment `#` removed, trailing slash normalized). |
| `cronSchedule`| `string` | Yes | — | Valid standard 5-part cron syntax (e.g. `0 2 * * *`). |
| `maxDepth` | `number` | No | `3` | Integer between `1` and `10`. |
| `concurrency` | `number` | No | `5` | Integer between `1` and `20`. |

#### Responses

##### `201 Created`
Site successfully registered.
```json
{
  "site": {
    "id": "site_9f83a2c0-82a1-432d-94bb-1e5b15b9c021",
    "name": "Personal Tech Blog",
    "rootUrl": "https://example.com",
    "cronSchedule": "0 2 * * *",
    "maxDepth": 3,
    "concurrency": 5,
    "createdAt": "2026-11-03T10:00:00.000Z",
    "lastScannedAt": null
  }
}
```

##### `400 Bad Request`
Validation failed (e.g., malformed URL or invalid cron expression).
```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid cronSchedule: expression must contain 5 space-separated parts"
  }
}
```

##### `409 Conflict`
A site with the normalized `rootUrl` is already registered.
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "A website with root URL 'https://example.com' is already registered"
  }
}
```

---

### 2.2 List All Target Websites

Retrieves all monitored websites ordered by creation date descending.

* **Method:** `GET`
* **Path:** `/api/sites`

#### Responses

##### `200 OK`
```json
{
  "sites": [
    {
      "id": "site_9f83a2c0-82a1-432d-94bb-1e5b15b9c021",
      "name": "Personal Tech Blog",
      "rootUrl": "https://example.com",
      "cronSchedule": "0 2 * * *",
      "maxDepth": 3,
      "concurrency": 5,
      "createdAt": "2026-11-03T10:00:00.000Z",
      "lastScannedAt": "2026-11-03T10:05:00.000Z"
    }
  ]
}
```

---

### 2.3 Get Target Website By ID

Retrieves details of a single target website.

* **Method:** `GET`
* **Path:** `/api/sites/:id`

#### Responses

##### `200 OK`
```json
{
  "site": {
    "id": "site_9f83a2c0-82a1-432d-94bb-1e5b15b9c021",
    "name": "Personal Tech Blog",
    "rootUrl": "https://example.com",
    "cronSchedule": "0 2 * * *",
    "maxDepth": 3,
    "concurrency": 5,
    "createdAt": "2026-11-03T10:00:00.000Z",
    "lastScannedAt": "2026-11-03T10:05:00.000Z"
  }
}
```

##### `404 Not Found`
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Site with ID 'site_nonexistent' not found"
  }
}
```

---

## 3. Scans API (`/api/scans` & `/api/sites/:id/scans`)

### 3.1 Trigger Manual Crawl Job

Initiates an asynchronous crawl job for the target website. LinkGuard acquires an active-scan lock on the site to prevent duplicate concurrent crawls.

* **Method:** `POST`
* **Path:** `/api/sites/:id/scans`

#### Responses

##### `202 Accepted`
Scan accepted and started in background.
```json
{
  "scan": {
    "id": "scan_b2c3d4e5-6789-0123-4567-89abcdef0123",
    "siteId": "site_9f83a2c0-82a1-432d-94bb-1e5b15b9c021",
    "status": "running",
    "startedAt": "2026-11-03T10:15:00.000Z",
    "completedAt": null,
    "totalLinks": 0,
    "brokenLinks": 0,
    "errorDetails": null
  }
}
```

##### `404 Not Found`
Target site not found.
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Site with ID 'site_nonexistent' not found"
  }
}
```

##### `409 Conflict`
A scan for this website is already currently running.
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "A crawl job is already running for site 'Personal Tech Blog'"
  }
}
```

---

### 3.2 List Scan History for Site

Retrieves previous and ongoing scan executions for a specific site, ordered by start time descending.

* **Method:** `GET`
* **Path:** `/api/sites/:id/scans`

#### Responses

##### `200 OK`
```json
{
  "scans": [
    {
      "id": "scan_b2c3d4e5-6789-0123-4567-89abcdef0123",
      "siteId": "site_9f83a2c0-82a1-432d-94bb-1e5b15b9c021",
      "status": "completed",
      "startedAt": "2026-11-03T10:15:00.000Z",
      "completedAt": "2026-11-03T10:17:30.000Z",
      "totalLinks": 142,
      "brokenLinks": 3,
      "errorDetails": null
    }
  ]
}
```

---

### 3.3 Get Scan Summary Metrics

Retrieves summary statistics and status for a specific scan execution.

* **Method:** `GET`
* **Path:** `/api/scans/:id`

#### Responses

##### `200 OK`
```json
{
  "scan": {
    "id": "scan_b2c3d4e5-6789-0123-4567-89abcdef0123",
    "siteId": "site_9f83a2c0-82a1-432d-94bb-1e5b15b9c021",
    "status": "completed",
    "startedAt": "2026-11-03T10:15:00.000Z",
    "completedAt": "2026-11-03T10:17:30.000Z",
    "totalLinks": 142,
    "brokenLinks": 3,
    "errorDetails": null
  }
}
```

##### `404 Not Found`
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Scan with ID 'scan_nonexistent' not found"
  }
}
```

---

## 4. Crawled Links API (`/api/scans/:id/links`)

### 4.1 Query Crawled Links Report

Retrieves individual link verification records for a scan, with optional filtering for broken links or specific parent source pages.

* **Method:** `GET`
* **Path:** `/api/scans/:id/links`

#### Query Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `broken_only` | `boolean` | No | `false` | When `true`, filters only links where `is_broken = 1`. |
| `parent_url` | `string` | No | — | Filter links found on a specific parent source page. |

#### Responses

##### `200 OK`
```json
{
  "links": [
    {
      "id": "link_c3d4e5f6-789a-bcde-f012-3456789abcde",
      "scanId": "scan_b2c3d4e5-6789-0123-4567-89abcdef0123",
      "url": "https://partner-company.com/legacy-api",
      "parentUrl": "https://example.com/docs/integrations",
      "anchorText": "Partner API Docs",
      "statusCode": 404,
      "isBroken": true,
      "errorDetails": "404 Not Found",
      "responseTimeMs": 142,
      "createdAt": "2026-11-03T10:16:12.000Z"
    },
    {
      "id": "link_d4e5f6a7-89ab-cdef-0123-456789abcdef",
      "scanId": "scan_b2c3d4e5-6789-0123-4567-89abcdef0123",
      "url": "https://example.com/about",
      "parentUrl": "https://example.com",
      "anchorText": "About Us",
      "statusCode": 200,
      "isBroken": false,
      "errorDetails": null,
      "responseTimeMs": 45,
      "createdAt": "2026-11-03T10:15:05.000Z"
    }
  ],
  "total": 2
}
```

##### `404 Not Found`
Scan ID does not exist.
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Scan with ID 'scan_nonexistent' not found"
  }
}
```

---

## 5. System Health API (`/healthz`)

### 5.1 Health & Liveness Probe

Returns runtime operational status and uptime.

* **Method:** `GET`
* **Path:** `/healthz`

#### Responses

##### `200 OK`
```json
{
  "ok": true,
  "status": "healthy",
  "timestamp": "2026-11-03T10:20:00.000Z",
  "uptimeSeconds": 3600
}
```
