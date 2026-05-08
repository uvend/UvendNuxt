// https://nuxt.com/docs/api/configuration/nuxt-config
// When APP_ENV is unset/undefined, `undefined != ''` is true in JS — must not resolve to `pages/undefined`.
// NOTE: pagesDir is resolved at build time only (file layout cannot change at runtime).
//       Everything else is resolved at runtime via runtimeConfig + globalThis.__NUXT_RUNTIME__.
const appEnv = (process.env.APP_ENV ?? '').trim()
const pagesDir = appEnv ? `pages/${appEnv}` : 'pages'

// Helper: produce a runtime expression for a public runtime-config key.
// At build time, every occurrence of e.g. `STATEMENT_API` in source is replaced with
// `(globalThis.__NUXT_RUNTIME__?.STATEMENT_API ?? "")`, which reads the value at runtime
// from a global populated by `plugins/00.runtime-config.ts` (client) and
// `server/plugins/runtime-config.ts` (server).
const runtimeRef = (key: string) =>
  `(globalThis.__NUXT_RUNTIME__?.${key} ?? "")`

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

const viteDefine: Record<string, string> = {}
for (const k of RUNTIME_KEYS) viteDefine[k] = runtimeRef(k)

const publicConfigDefaults: Record<string, string> = {}
for (const k of RUNTIME_KEYS) publicConfigDefaults[k] = ''

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
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
  ssr: false,// Not required in Tailwind 3+, but useful for older versions
  plugins: [
    '~/plugins/00.runtime-config',
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
