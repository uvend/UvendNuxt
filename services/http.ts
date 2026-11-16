import useAuthFetch from '~/composables/useAuthFetch'

type FetchOptions = Record<string, any>

/** Authenticated fetch (Basic token from localStorage). */
export function authFetch<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
  return useAuthFetch<T>(url, options)
}

/** Plain fetch with no auth headers. */
export function plainFetch<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
  return $fetch<T>(url, options)
}
