<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <BankingDetails
        @prev="handlePrev"
        @next="handleNext"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import BankingDetails from '~/components/registration/BankingDetails.vue'

const registrationStore = useRegistrationStore()
const router = useRouter()

onMounted(() => {
  // Check if user has completed previous steps
  if (!registrationStore.type || !registrationStore.personal || !registrationStore.documents) {
    router.push('/registration/documents')
  }
})

const handlePrev = () => {
  registrationStore.goBack()
  router.push('/registration/documents')
}

const handleNext = (data) => {
  registrationStore.setBanking(data)
  router.push('/registration/address')
}
</script> 