<template>
  <div>
    <div class="space-y-6">
      <div class="text-center md:text-left">
        <h2 class="text-xl font-semibold text-gray-900">Document Upload</h2>
        <p class="mt-1 text-sm text-gray-500">Please upload the required documents</p>
        <NuxtLink 
          to="/registration/special-docs"
          class="inline-block mt-2 text-primary hover:text-primary/80 text-sm font-medium"
        >
          Need to submit special documentation? Click here
        </NuxtLink>
      </div>

      <div class="space-y-6">
        <!-- ID Document Upload -->
        <div class="space-y-2">
          <Label>ID Document</Label>
          <div class="border-2 border-dashed rounded-lg p-6 text-center" 
               :class="errors.idDocument ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary'">
            <div v-if="!formData.idDocument" class="space-y-2">
              <div class="flex justify-center">
                <Upload class="h-10 w-10 text-gray-400" />
              </div>
              <div class="text-sm text-gray-500">
                <label for="idDocument" class="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
                  <span>Upload ID document</span>
                  <input id="idDocument" name="idDocument" type="file" class="sr-only" @change="handleFileUpload($event, 'idDocument')" accept=".pdf,.jpg,.jpeg,.png">
                </label>
                <p>or drag and drop</p>
                <p class="text-xs">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div v-else class="space-y-2">
              <div class="flex items-center justify-center">
                <FileCheck class="h-10 w-10 text-green-500" />
              </div>
              <p class="text-sm font-medium">{{ formData.idDocument.name }}</p>
              <button type="button" class="text-sm text-red-500" @click="removeFile('idDocument')">Remove</button>
            </div>
          </div>
          <span v-if="errors.idDocument" class="text-sm text-red-500">{{ errors.idDocument }}</span>
        </div>

        <!-- Proof of Address -->
        <div class="space-y-2">
          <Label>Proof of Address</Label>
          <div class="border-2 border-dashed rounded-lg p-6 text-center"
               :class="errors.proofOfAddress ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary'">
            <div v-if="!formData.proofOfAddress" class="space-y-2">
              <div class="flex justify-center">
                <Upload class="h-10 w-10 text-gray-400" />
              </div>
              <div class="text-sm text-gray-500">
                <label for="proofOfAddress" class="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
                  <span>Upload proof of address</span>
                  <input id="proofOfAddress" name="proofOfAddress" type="file" class="sr-only" @change="handleFileUpload($event, 'proofOfAddress')" accept=".pdf,.jpg,.jpeg,.png">
                </label>
                <p>or drag and drop</p>
                <p class="text-xs">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div v-else class="space-y-2">
              <div class="flex items-center justify-center">
                <FileCheck class="h-10 w-10 text-green-500" />
              </div>
              <p class="text-sm font-medium">{{ formData.proofOfAddress.name }}</p>
              <button type="button" class="text-sm text-red-500" @click="removeFile('proofOfAddress')">Remove</button>
            </div>
          </div>
          <span v-if="errors.proofOfAddress" class="text-sm text-red-500">{{ errors.proofOfAddress }}</span>
        </div>

        <!-- Bank Statement -->
        <div class="space-y-2">
          <Label>Bank Statement</Label>
          <div class="border-2 border-dashed rounded-lg p-6 text-center"
               :class="errors.bankStatement ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary'">
            <div v-if="!formData.bankStatement" class="space-y-2">
              <div class="flex justify-center">
                <Upload class="h-10 w-10 text-gray-400" />
              </div>
              <div class="text-sm text-gray-500">
                <label for="bankStatement" class="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
                  <span>Upload bank statement</span>
                  <input id="bankStatement" name="bankStatement" type="file" class="sr-only" @change="handleFileUpload($event, 'bankStatement')" accept=".pdf,.jpg,.jpeg,.png">
                </label>
                <p>or drag and drop</p>
                <p class="text-xs">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div v-else class="space-y-2">
              <div class="flex items-center justify-center">
                <FileCheck class="h-10 w-10 text-green-500" />
              </div>
              <p class="text-sm font-medium">{{ formData.bankStatement.name }}</p>
              <button type="button" class="text-sm text-red-500" @click="removeFile('bankStatement')">Remove</button>
            </div>
          </div>
          <span v-if="errors.bankStatement" class="text-sm text-red-500">{{ errors.bankStatement }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Label } from '~/components/ui/label'
import { Upload, FileCheck } from 'lucide-vue-next'

const props = defineProps({
  registrationData: {
    type: Object,
    required: true
  }
})

const formData = ref({
  idDocument: null,
  proofOfAddress: null,
  bankStatement: null
})

const errors = ref({})

// Initialize form data from props if available
watch(() => props.registrationData?.documents, (newValue) => {
  if (newValue) {
    formData.value = { ...newValue }
  }
}, { immediate: true })

const validateFile = (file) => {
  if (!file) return false
  
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  
  if (file.size > maxSize) {
    return 'File size must be less than 10MB'
  }
  
  if (!allowedTypes.includes(file.type)) {
    return 'File must be PDF, JPG, or PNG'
  }
  
  return true
}

const handleFileUpload = (event, field) => {
  const file = event.target.files[0]
  if (!file) return
  
  const validation = validateFile(file)
  if (validation === true) {
    formData.value[field] = file
    errors.value[field] = ''
  } else {
    errors.value[field] = validation
  }
}

const removeFile = (field) => {
  formData.value[field] = null
}

// Validate form data
watch(formData, (newValue) => {
  const newErrors = {}
  
  if (!newValue.idDocument) {
    newErrors.idDocument = 'ID document is required'
  }
  if (!newValue.proofOfAddress) {
    newErrors.proofOfAddress = 'Proof of address is required'
  }
  if (!newValue.bankStatement) {
    newErrors.bankStatement = 'Bank statement is required'
  }

  errors.value = newErrors
}, { deep: true })

// Expose form data to parent
defineExpose({
  validate: () => {
    return Object.keys(errors.value).length === 0
  },
  getData: () => formData.value
})
</script> 