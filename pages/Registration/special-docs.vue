<template>
  <div>
    <NuxtLayout name="registration">
      <div class="min-h-screen bg-gray-50">
        <!-- Mobile Header -->
        <div class="md:hidden bg-white px-4 py-3 border-b fixed top-0 left-0 right-0 z-10">
          <h1 class="text-lg font-semibold text-center">Special Documentation</h1>
        </div>

        <SpecialDocs />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SpecialDocs from '~/components/registration/SpecialDocs.vue'

// Ensure registration is enabled
const config = useRuntimeConfig()
const isRegistrationEnabled = computed(() => config.public.APP_ENV === 'registration')

// Redirect if registration is not enabled
if (!isRegistrationEnabled.value) {
  navigateTo('/')
}
</script>

<style scoped>
/* Add padding to account for fixed navigation on mobile */
@media (max-width: 768px) {
  .min-h-screen {
    padding-top: 56px; /* Height of mobile header */
    padding-bottom: 72px; /* Height of mobile navigation */
  }
}
</style> 