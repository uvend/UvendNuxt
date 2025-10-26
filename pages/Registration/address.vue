<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <AddressDetails
        @prev="handlePrev"
        @next="handleNext"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AddressDetails from '~/components/registration/AddressDetails.vue'

const registrationStore = useRegistrationStore()
const router = useRouter()

onMounted(() => {
  // Check if user has completed previous steps
  if (!registrationStore.type || !registrationStore.personal || !registrationStore.documents || !registrationStore.banking) {
    router.push('/registration/banking')
  }
})

const handlePrev = () => {
  registrationStore.goBack()
  router.push('/registration/banking')
}

const handleNext = (data) => {
  registrationStore.setAddress(data)
  router.push('/registration/meters')
}
</script> 