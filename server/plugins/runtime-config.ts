/**
 * Reads environment variables at SERVER STARTUP (not build time) and overrides
 * `runtimeConfig.public.*`. The same image can therefore be deployed to dev/uat/prod
 * by simply changing the container's environment (e.g. `env_file: .env` in compose).
 *
 * The keys here intentionally use the same names as the existing .env file so no
 * variable renaming is required (Nuxt's standard `NUXT_PUBLIC_*` override convention
 * is not used here — see plugins/00.runtime-config.ts).
 *
 * runtimeConfig.public is serialized into the SPA shell HTML by Nitro and is read
 * by `useRuntimeConfig()` on the client.
 */
const PUBLIC_ENV_KEYS = [
  'API_URL',
  'VEND_URL',
  'WALLET_API_URL',
  'STATEMENT_API',
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
] as const

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
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

  Object.assign(config.public as Record<string, unknown>, resolved)

  ;(globalThis as Record<string, unknown>).__NUXT_RUNTIME__ = { ...resolved }
})
