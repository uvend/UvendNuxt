<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <MeterDetails
        @prev="handlePrev"
        @next="handleNext"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import MeterDetails from '~/components/registration/MeterDetails.vue'

const registrationStore = useRegistrationStore()
const router = useRouter()

onMounted(() => {
  // Check if user has completed previous steps
  if (!registrationStore.type || !registrationStore.personal || !registrationStore.documents || 
      !registrationStore.banking || !registrationStore.address) {
    router.push('/registration/address')
  }
})

const handlePrev = () => {
  registrationStore.goBack()
  router.push('/registration/address')
}

const handleNext = (data) => {
  registrationStore.setMeters(data.meters)
  router.push('/registration/summary')
}
</script> 