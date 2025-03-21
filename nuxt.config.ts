// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/icon','@pinia/nuxt'],
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs'],
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
    define:{
      API_URL: JSON.stringify(process.env.API_URL),
      VEND_URL: JSON.stringify(process.env.VEND_URL),
      JSREPORT_URL: JSON.stringify(process.env.JSREPORT_URL),
      MPESA_URL: JSON.stringify(process.env.MPESA_URL),
      ADMIN_AUTH: JSON.stringify(process.env.ADMIN_AUTH),
      VEND_TerminalID: JSON.stringify(process.env.VEND_TerminalID),
      VEND_OperatorID: JSON.stringify(process.env.VEND_OperatorID)
    }
  },
  ssr: false,
  plugins: [
    '~/plugins/toast',
    '~/plugins/pinia',
  ],
})