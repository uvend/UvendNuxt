import { getServiceVersion, type ServiceVersion } from './config'

type ImplMap<T> = Partial<Record<ServiceVersion, T>> & { v1: T }

/**
 * Pick v1 / v2 implementation for a domain.
 * Components always import the facade; swap implementations here.
 */
export function createService<T extends object>(domain: string, impls: ImplMap<T>): T {
  const version = getServiceVersion(domain)
  const selected = impls[version] ?? impls.v1
  return selected
}
