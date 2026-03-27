const SUPPORTED = new Set(['ZAR', 'KES'])

/**
 * Display currency for customer-facing ("my") pages. Set APP_CURRENCY=KES (build-time) for Kenyan shilling.
 */
export function useCurrency() {
  const raw =
    typeof APP_CURRENCY !== 'undefined'
      ? String(APP_CURRENCY).trim().toUpperCase()
      : 'ZAR'
  const currencyCode = SUPPORTED.has(raw) ? raw : 'ZAR'
  const locale = currencyCode === 'KES' ? 'en-KE' : 'en-ZA'

  function formatMoney(value) {
    const n = typeof value === 'number' ? value : parseFloat(value)
    if (Number.isNaN(n)) return '—'
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(n)
    } catch {
      return `${currencyCode} ${n.toFixed(2)}`
    }
  }

  return { currencyCode, locale, formatMoney }
}
