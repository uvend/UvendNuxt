// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
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
    define:{
      API_URL: JSON.stringify(process.env.API_URL),
      JSREPORT_URL: JSON.stringify(process.env.JSREPORT_URL),
      MPESA_URL: JSON.stringify(process.env.MPESA_URL),
      HOSTNAME: JSON.stringify(process.env.HOSTNAME) ?? 'http://localhost:3000'
    }
  },
  ssr: false,
  plugins: [
    '~/plugins/toast',  // Add the plugin to the array
  ],
  nitro: {
    devProxy: {
      "/my": {
        target: "https://vendlive11.api.vendease.co.za",
        changeOrigin: true,
        secure: false, // Ignore SSL errors
      },
    },
  },
})