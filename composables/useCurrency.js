const SYMBOL_TO_ISO = { R: 'ZAR', KSH: 'KES', KSHS: 'KES' }
const ISO_TO_LOCALE = { ZAR: 'en-ZA', KES: 'en-KE' }
const DEFAULT_ISO = 'ZAR'

/**
 * Resolves the active currency from the runtime CURRENCY_CODE env var.
 * Accepts either an ISO 4217 code (ZAR, KES) or a symbol shorthand (R, KSH, KSHS).
 * Falls back to ZAR when unrecognised.
 */
export function useCurrency() {
  const raw = (typeof CURRENCY_CODE !== 'undefined' ? String(CURRENCY_CODE) : '').trim().toUpperCase()
  const iso = SYMBOL_TO_ISO[raw] || (ISO_TO_LOCALE[raw] ? raw : null) || DEFAULT_ISO
  const locale = ISO_TO_LOCALE[iso] || 'en-ZA'

  function formatMoney(value) {
    const n = typeof value === 'number' ? value : parseFloat(value)
    if (Number.isNaN(n)) return '—'
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: iso,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(n)
    } catch {
      return `${iso} ${n.toFixed(2)}`
    }
  }

  return { currencyCode: iso, locale, formatMoney }
}
