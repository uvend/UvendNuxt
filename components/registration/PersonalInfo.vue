<template>
  <div>
    <div class="space-y-6">
      <div class="text-center md:text-left">
        <h2 class="text-xl font-semibold text-gray-900">Personal Information</h2>
        <p class="mt-1 text-sm text-gray-500">Please provide your personal details</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <Label for="firstName">First Name</Label>
          <Input
            id="firstName"
            v-model="formData.firstName"
            type="text"
            placeholder="Enter your first name"
            :class="{ 'border-red-500': errors.firstName }"
          />
          <span v-if="errors.firstName" class="text-sm text-red-500">{{ errors.firstName }}</span>
        </div>

        <div class="space-y-2">
          <Label for="lastName">Last Name</Label>
          <Input
            id="lastName"
            v-model="formData.lastName"
            type="text"
            placeholder="Enter your last name"
            :class="{ 'border-red-500': errors.lastName }"
          />
          <span v-if="errors.lastName" class="text-sm text-red-500">{{ errors.lastName }}</span>
        </div>

        <div class="space-y-2">
          <Label for="email">Email Address</Label>
          <Input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Enter your email"
            :class="{ 'border-red-500': errors.email }"
          />
          <span v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</span>
        </div>

        <div class="space-y-2">
          <Label for="phone">Phone Number</Label>
          <Input
            id="phone"
            v-model="formData.phone"
            type="tel"
            placeholder="Enter your phone number"
            :class="{ 'border-red-500': errors.phone }"
          />
          <span v-if="errors.phone" class="text-sm text-red-500">{{ errors.phone }}</span>
        </div>

        <div class="space-y-2">
          <Label for="idNumber">ID Number</Label>
          <Input
            id="idNumber"
            v-model="formData.idNumber"
            type="text"
            placeholder="Enter your ID number"
            :class="{ 'border-red-500': errors.idNumber }"
          />
          <span v-if="errors.idNumber" class="text-sm text-red-500">{{ errors.idNumber }}</span>
        </div>

        <div class="space-y-2">
          <Label for="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            v-model="formData.dateOfBirth"
            type="date"
            :class="{ 'border-red-500': errors.dateOfBirth }"
          />
          <span v-if="errors.dateOfBirth" class="text-sm text-red-500">{{ errors.dateOfBirth }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'

const props = defineProps({
  registrationData: {
    type: Object,
    required: true
  }
})

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  idNumber: '',
  dateOfBirth: ''
})

const errors = ref({})

// Initialize form data from props if available
watch(() => props.registrationData?.personal, (newValue) => {
  if (newValue) {
    formData.value = { ...newValue }
  }
}, { immediate: true })

// Validate form data before submitting
watch(formData, (newValue) => {
  const newErrors = {}
  
  if (!newValue.firstName) {
    newErrors.firstName = 'First name is required'
  }
  if (!newValue.lastName) {
    newErrors.lastName = 'Last name is required'
  }
  if (!newValue.email) {
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue.email)) {
    newErrors.email = 'Please enter a valid email address'
  }
  if (!newValue.phone) {
    newErrors.phone = 'Phone number is required'
  }
  if (!newValue.idNumber) {
    newErrors.idNumber = 'ID number is required'
  }
  if (!newValue.dateOfBirth) {
    newErrors.dateOfBirth = 'Date of birth is required'
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