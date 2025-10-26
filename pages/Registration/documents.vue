<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <DocumentUpload
        @prev="handlePrev"
        @next="handleNext"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import DocumentUpload from '~/components/registration/DocumentUpload.vue'

const registrationStore = useRegistrationStore()
const router = useRouter()

onMounted(() => {
  // Check if user has completed previous steps
  if (!registrationStore.type || !registrationStore.personal) {
    router.push('/registration/personal')
  }
})

const handlePrev = () => {
  registrationStore.goBack()
  router.push('/registration/personal')
}

const handleNext = (data) => {
  registrationStore.setDocuments(data)
  router.push('/registration/banking')
}
</script> 