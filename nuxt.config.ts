// https://nuxt.com/docs/api/configuration/nuxt-config
const pagesDir = process.env.APP_ENV != '' 
  ? `pages/${process.env.APP_ENV}` 
  : 'pages'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/icon','@pinia/nuxt'],
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
    define: {
      API_URL: JSON.stringify(process.env.API_URL || ''),
      VEND_URL: JSON.stringify(process.env.VEND_URL || ''),
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
    }
  },
  ssr: false,// Not required in Tailwind 3+, but useful for older versions
  plugins: [
    '~/plugins/toast',
    '~/plugins/pinia',
  ],
  dir: {
    pages: pagesDir
  },
})