// https://nuxt.com/docs/api/configuration/nuxt-config
// When APP_ENV is unset/undefined, `undefined != ''` is true in JS — must not resolve to `pages/undefined`.
const appEnv = (process.env.APP_ENV ?? '').trim()
const pagesDir = appEnv ? `pages/${appEnv}` : 'pages'
const isDev = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/icon','@pinia/nuxt'],
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
    // Local dev: same-origin proxies avoid CORS to Kenya hosts. See `.env` / `env-kenya-local-dev.txt`.
    server: {
      proxy: {
        '/__dev_proxy/kenya-admin': {
          target: 'https://kenya-adminapi.vendease.co.za',
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/__dev_proxy\/kenya-admin/, '/api')
        },
        '/__dev_proxy/kenya-customer': {
          target: 'https://kenya-customer-api.uatvend.co.za',
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/__dev_proxy\/kenya-customer/, '')
        },
        '/__dev_proxy/kenya-vend': {
          target: 'https://kenya-vendliveapi.vendease.co.za',
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/__dev_proxy\/kenya-vend/, '/api')
        }
      }
    },
    define: {
      API_URL: JSON.stringify(process.env.API_URL || ''),
      VEND_URL: JSON.stringify(process.env.VEND_URL || ''),
      WALLET_API_URL : JSON.stringify(process.env.WALLET_API_URL || ''),
      STATEMENT_API: JSON.stringify(process.env.STATEMENT_API || ''),
      STATEMENT_SUMMARISED_PATH: JSON.stringify(
        process.env.STATEMENT_SUMMARISED_PATH || '/statement/GetDBMeterActivitySummarised'
      ),
      JSREPORT_URL: JSON.stringify(process.env.JSREPORT_URL || ''),
      MPESA_URL: JSON.stringify(process.env.MPESA_URL || ''),
      ADMIN_AUTH: JSON.stringify(process.env.ADMIN_AUTH || ''),
      VEND_TerminalID: JSON.stringify(process.env.VEND_TerminalID || ''),
      VEND_OperatorID: JSON.stringify(process.env.VEND_OperatorID || ''),
      APP_LOGO: JSON.stringify(process.env.APP_LOGO || ''),
      APP_BG_1: JSON.stringify(process.env.APP_BG_1 || ''),
      APP_BG_2: JSON.stringify(process.env.APP_BG_2 || ''),
      APP_BG_3: JSON.stringify(process.env.APP_BG_3 || ''),
      APP_FONT_COLOR_1: JSON.stringify(process.env.APP_FONT_COLOR_1 || ''),
      APP_FONT_COLOR_2: JSON.stringify(process.env.APP_FONT_COLOR_2 || ''),
      APP_FONT_COLOR_3: JSON.stringify(process.env.APP_FONT_COLOR_3 || ''),
      APP_ENV: JSON.stringify(process.env.APP_ENV || ''),
      APP_CURRENCY: JSON.stringify((process.env.APP_CURRENCY || 'ZAR').trim().toUpperCase()),
      CUSTOMER_API: JSON.stringify(process.env.CUSTOMER_API || ''),
    },
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
      ]
    }
  },
  runtimeConfig: {
    // Private keys are only available on the server
    // apiSecret: '123'

    // Public keys that are exposed to the client
    public: {
      APP_ENV: process.env.APP_ENV || 'default',
      APP_CURRENCY: (process.env.APP_CURRENCY || 'ZAR').trim().toUpperCase()
    }
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