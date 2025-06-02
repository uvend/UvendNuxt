<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <PersonalInfo
        @prev="handlePrev"
        @next="handleNext"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import PersonalInfo from '~/components/registration/PersonalInfo.vue'

const registrationStore = useRegistrationStore()
const router = useRouter()

onMounted(() => {
  // Check if user has completed previous step
  if (!registrationStore.type) {
    router.push('/registration/type')
  }
})

const handlePrev = () => {
  registrationStore.goBack()
  router.push('/registration/type')
}

const handleNext = (data) => {
  registrationStore.setPersonal(data)
  router.push('/registration/documents')
}
</script> 