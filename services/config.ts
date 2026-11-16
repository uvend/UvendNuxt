/** Runtime API base URLs from `globalThis.__NUXT_RUNTIME__` (via Vite define). */

declare const API_URL: string
declare const STATEMENT_API: string
declare const STATEMENT_SUMMARISED_PATH: string
declare const VEND_URL: string
declare const MPESA_URL: string
declare const CUSTOMER_API: string
declare const ADMIN_AUTH: string
declare const VEND_TerminalID: string
declare const VEND_OperatorID: string

export function normalizeBaseUrl(url: unknown): string {
  return (typeof url === 'string' ? url : '').replace(/\/$/, '')
}

export function getApiUrl(): string {
  return normalizeBaseUrl(API_URL)
}

export function getStatementApi(): string {
  return normalizeBaseUrl(STATEMENT_API)
}

export function getStatementSummarisedPath(): string {
  const path = typeof STATEMENT_SUMMARISED_PATH === 'string' ? STATEMENT_SUMMARISED_PATH : ''
  return path.startsWith('/') ? path : path ? `/${path}` : '/statement/GetDBMeterActivitySummarised'
}

export function getVendUrl(): string {
  return normalizeBaseUrl(VEND_URL)
}

export function getMpesaUrl(): string {
  return normalizeBaseUrl(MPESA_URL)
}

export function getCustomerApi(): string {
  return normalizeBaseUrl(CUSTOMER_API)
}

export function getAdminAuth(): string {
  return typeof ADMIN_AUTH === 'string' ? ADMIN_AUTH : ''
}

export function getVendTerminalId(): string {
  return typeof VEND_TerminalID === 'string' ? VEND_TerminalID : ''
}

export function getVendOperatorId(): string {
  return typeof VEND_OperatorID === 'string' ? VEND_OperatorID : ''
}

/**
 * Which service implementation to use.
 * Flip to `v2` (or set per-domain) when the new API is ready.
 */
export type ServiceVersion = 'v1' | 'v2'

export function getServiceVersion(_domain?: string): ServiceVersion {
  const runtime = (globalThis as any).__NUXT_RUNTIME__ || {}
  const version = runtime.API_SERVICE_VERSION || runtime.apiServiceVersion
  return version === 'v2' ? 'v2' : 'v1'
}
