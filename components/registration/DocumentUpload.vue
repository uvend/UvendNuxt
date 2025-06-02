<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900">Required Documents</h2>
      <p class="mt-2 text-sm text-gray-600">Please upload the required documents</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="space-y-4">
        <!-- ID Document -->
        <div class="space-y-2">
          <Label for="idDocument">Certified ID Document</Label>
          <div class="flex items-center gap-4">
            <Input
              id="idDocument"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              @change="handleFileUpload($event, 'idDocument')"
              required
              :class="{ 'border-red-500': errors.idDocument }"
            />
            <Button
              v-if="form.idDocument"
              type="button"
              variant="destructive"
              size="icon"
              @click="removeFile('idDocument')"
            >
              <XIcon class="h-4 w-4" />
            </Button>
          </div>
          <p class="text-xs text-gray-500">Upload a clear copy of your certified ID</p>
          <span v-if="errors.idDocument" class="text-xs text-red-500">{{ errors.idDocument }}</span>
        </div>

        <!-- Municipal Account -->
        <div class="space-y-2">
          <Label for="municipalAccount">Municipal Account</Label>
          <div class="flex items-center gap-4">
            <Input
              id="municipalAccount"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              @change="handleFileUpload($event, 'municipalAccount')"
              required
              :class="{ 'border-red-500': errors.municipalAccount }"
            />
            <Button
              v-if="form.municipalAccount"
              type="button"
              variant="destructive"
              size="icon"
              @click="removeFile('municipalAccount')"
            >
              <XIcon class="h-4 w-4" />
            </Button>
          </div>
          <p class="text-xs text-gray-500">Not older than 3 months</p>
          <span v-if="errors.municipalAccount" class="text-xs text-red-500">{{ errors.municipalAccount }}</span>
        </div>

        <!-- Bank Statement -->
        <div class="space-y-2">
          <Label for="bankStatement">Bank Statement</Label>
          <div class="flex items-center gap-4">
            <Input
              id="bankStatement"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              @change="handleFileUpload($event, 'bankStatement')"
              required
              :class="{ 'border-red-500': errors.bankStatement }"
            />
            <Button
              v-if="form.bankStatement"
              type="button"
              variant="destructive"
              size="icon"
              @click="removeFile('bankStatement')"
            >
              <XIcon class="h-4 w-4" />
            </Button>
          </div>
          <p class="text-xs text-gray-500">Not older than 3 months</p>
          <span v-if="errors.bankStatement" class="text-xs text-red-500">{{ errors.bankStatement }}</span>
        </div>
      </div>

      <div class="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          @click="$emit('prev')"
        >
          Previous
        </Button>
        <Button
          type="submit"
        >
          Next
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { XIcon } from 'lucide-vue-next'

const emit = defineEmits(['prev', 'next'])

const form = reactive({
  idDocument: null,
  municipalAccount: null,
  bankStatement: null
})

const errors = reactive({})

const handleFileUpload = (event, field) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors[field] = 'File size should not exceed 5MB'
      event.target.value = ''
      return
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      errors[field] = 'Invalid file type. Please upload PDF or image files'
      event.target.value = ''
      return
    }

    form[field] = file
    errors[field] = ''
  }
}

const removeFile = (field) => {
  form[field] = null
  const input = document.getElementById(field)
  if (input) input.value = ''
}

const validateForm = () => {
  let isValid = true
  
  if (!form.idDocument) {
    errors.idDocument = 'ID Document is required'
    isValid = false
  }
  
  if (!form.municipalAccount) {
    errors.municipalAccount = 'Municipal Account is required'
    isValid = false
  }
  
  if (!form.bankStatement) {
    errors.bankStatement = 'Bank Statement is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('next', form)
  }
}
</script> 