// https://nuxt.com/docs/api/configuration/nuxt-config
// When APP_ENV is unset/undefined, `undefined != ''` is true in JS — must not resolve to `pages/undefined`.
// NOTE: pagesDir is resolved at build time only (file layout cannot change at runtime).
//       Everything else is resolved at runtime via runtimeConfig + globalThis.__NUXT_RUNTIME__.
const appEnv = (process.env.APP_ENV ?? '').trim()
const pagesDir = appEnv ? `pages/${appEnv}` : 'pages'

// Keys whose values must be resolved at RUNTIME (not build time).
// Vite's `define` rewrites every occurrence of these identifiers in the source
// (e.g. `STATEMENT_API`) to the member expression `globalThis.__NUXT_RUNTIME__.STATEMENT_API`.
// The `globalThis.__NUXT_RUNTIME__` object is populated by:
//   - server/plugins/runtime-config.ts: reads process.env at server startup AND
//     injects an inline <script> into every HTML response with the real values.
//   - the empty-default inline script below: ensures all keys are at least empty
//     strings even before the runtime-injected script runs.
const RUNTIME_KEYS = [
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

// esbuild/Vite require `define` values to be a JS literal or a plain entity-name
// member expression — NOT an expression with `??`/`?.`/parentheses. So we use a
// straight member access here and rely on the inline head script (below) to
// guarantee `globalThis.__NUXT_RUNTIME__` is always a defined object with all
// keys present (default: empty string), before any other code runs.
const viteDefine: Record<string, string> = {}
for (const k of RUNTIME_KEYS) viteDefine[k] = `globalThis.__NUXT_RUNTIME__.${k}`

const publicConfigDefaults: Record<string, string> = {}
for (const k of RUNTIME_KEYS) publicConfigDefaults[k] = ''

// Inline script injected into the very top of <head>. It runs synchronously
// during HTML parsing — before any deferred/module script — so by the time the
// app bundle executes, `globalThis.__NUXT_RUNTIME__.<KEY>` is guaranteed to be
// at least an empty string. The values get overwritten with real ones by
// `plugins/00.runtime-config.ts` once `useRuntimeConfig()` is available.
const runtimeBootstrap =
  `window.__NUXT_RUNTIME__=Object.assign(${JSON.stringify(publicConfigDefaults)},window.__NUXT_RUNTIME__||{});`

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/icon','@pinia/nuxt'],
  components: [
    {
      path: '~/components',
      extensions: ['vue']
    }
  ],
  build: {
    transpile: ['vue3-apexcharts']
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  css: ['@/assets/css/tailwind.css'],
  vite: {
    define: viteDefine
  },
  ssr: isDev, // Enable SSR in dev, keep SPA behavior for production
  plugins: [
    '~/plugins/toast',
    '~/plugins/pinia',
    '~/plugins/apexcharts.client',
  ],
  dir: {
    pages: pagesDir
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        }
      ],
      script: [
        {
          innerHTML: runtimeBootstrap,
          tagPosition: 'head',
          tagPriority: 'critical'
        }
      ]
    }
  },
  runtimeConfig: {
    public: publicConfigDefaults
  },
  routeRules: {
    '/registration/**': { 
      headers: {
        'x-middleware-cache': 'no-cache'
      }
    }
  },
  router: {
    options: {
      sensitive: false // Make routes case-insensitive
    }
  },
  experimental: {
    payloadExtraction: false
  }
})
