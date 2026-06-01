<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <RegistrationType
        v-model:type="registrationType"
        @next="handleNext"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RegistrationType from '~/components/registration/RegistrationType.vue'

const registrationType = ref('')

const handleNext = (type) => {
  // Store the registration type in the store or local storage
  const registrationStore = useRegistrationStore()
  registrationStore.setType(type)
  
  // Navigate to the next step
  navigateTo('/registration/personal')
}
</script> 