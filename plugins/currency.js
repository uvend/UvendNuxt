import { useCurrency } from '@/composables/useCurrency'

export default defineNuxtPlugin((nuxtApp) => {
  const { formatMoney, currencyCode } = useCurrency()
  nuxtApp.provide('formatMoney', formatMoney)
  nuxtApp.provide('currencyCode', currencyCode)
})
