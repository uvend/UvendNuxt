/**
 * Reads URL/feature env vars at SERVER STARTUP (not build time) and injects them
 * into every HTML response as an inline `<script>` that populates
 * `globalThis.__NUXT_RUNTIME__`.
 *
 * Vite's `define` config in `nuxt.config.ts` rewrites every occurrence of these
 * identifiers in the bundle to `globalThis.__NUXT_RUNTIME__.<KEY>`, so this
 * inline script must run BEFORE any other script in the page. We use `head.unshift`
 * to push the script to the very top of `<head>`, where it runs synchronously
 * during HTML parsing — strictly before the deferred module bundle.
 *
 * The `nuxt.config.ts` already injects an empty-default initializer via
 * `app.head.script`, so even if env vars are missing the global is always at
 * least an object with empty-string values for every key (no `undefined` leaks
 * into URLs).
 *
 * Why not use Nuxt's runtimeConfig env-var override mechanism? Because Nuxt
 * freezes `runtimeConfig.public` after init (so we can't mutate it from a Nitro
 * plugin), and its standard `NUXT_PUBLIC_*` convention would force renaming of
 * every variable in `.env` (and the conventions map to camelCase keys, which
 * wouldn't match the existing UPPER_SNAKE_CASE identifiers used in the code).
 */
const PUBLIC_ENV_KEYS = [
  'API_URL',
  'VEND_URL',
  'WALLET_API_URL',
  'STATEMENT_API',
  'STATEMENT_SUMMARISED_PATH',
  'JSREPORT_URL',
  'MPESA_URL',
  'ADMIN_AUTH',
  'VEND_TerminalID',
  'VEND_OperatorID',
  'APP_LOGO',
  'APP_BG_1',
  'APP_BG_2',
  'APP_BG_3',
  'APP_FONT_COLOR_1',
  'APP_FONT_COLOR_2',
  'APP_FONT_COLOR_3',
  'CUSTOMER_API',
  'APP_ENV',
  'APP_CURRENCY',
  'CURRENCY_CODE',
  'AEON_CHECK',
] as const

export default defineNitroPlugin((nitroApp) => {
  const env = process.env
  const appEnv = (env.APP_ENV ?? '').trim()
  const currencyCode = (env.CURRENCY_CODE ?? '').trim().toUpperCase()

  const resolved: Record<string, string> = {}
  for (const key of PUBLIC_ENV_KEYS) {
    resolved[key] = (env[key] ?? '').toString()
  }
  resolved.APP_ENV = appEnv
  resolved.APP_CURRENCY = currencyCode
  resolved.CURRENCY_CODE = currencyCode
  if (!resolved.STATEMENT_SUMMARISED_PATH) {
    resolved.STATEMENT_SUMMARISED_PATH = '/statement/GetDBMeterActivitySummarised'
  }

  ;(globalThis as Record<string, unknown>).__NUXT_RUNTIME__ = { ...resolved }

  // JSON.stringify produces a JS-literal-safe object; using `</script>` inside a
  // value would be unsafe, but these are all known config keys with URL/string
  // values from env, so a basic escape of `</` is sufficient defense-in-depth.
  const safeJson = JSON.stringify(resolved).replace(/<\//g, '<\\/')
  const inlineScript = `<script>window.__NUXT_RUNTIME__=Object.assign(window.__NUXT_RUNTIME__||{},${safeJson});</script>`

  nitroApp.hooks.hook('render:html', (html) => {
    html.head.unshift(inlineScript)
  })
})
