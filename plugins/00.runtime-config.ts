/**
 * Bootstraps `globalThis.__NUXT_RUNTIME__` with the values from `runtimeConfig.public`
 * BEFORE any page/component code runs.
 *
 * The Vite `define` config in `nuxt.config.ts` rewrites identifiers like
 * `STATEMENT_API`, `API_URL`, etc. to `(globalThis.__NUXT_RUNTIME__?.<KEY> ?? "")`,
 * so this plugin must initialise that global at the earliest possible moment.
 *
 * The filename prefix `00.` ensures lexical ordering puts this plugin first
 * (see https://nuxt.com/docs/guide/directory-structure/plugins#plugin-registration-order).
 *
 * On the server, the equivalent setup runs in `server/plugins/runtime-config.ts`,
 * which also populates `runtimeConfig.public` from `process.env`.
 */
export default defineNuxtPlugin({
  name: 'runtime-config-globals',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig()
    const target = globalThis as Record<string, unknown>
    target.__NUXT_RUNTIME__ = { ...(config.public as Record<string, unknown>) }
  },
})
