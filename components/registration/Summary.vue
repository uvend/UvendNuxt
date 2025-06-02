<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900">Registration Summary</h2>
      <p class="mt-2 text-sm text-gray-600">Please review your information before submitting</p>
    </div>

    <div class="space-y-8">
      <!-- Registration Type -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Registration Type</h3>
        <p class="text-gray-700 capitalize">{{ registrationData.type }}</p>
      </div>

      <!-- Personal Information -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Personal Information</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Full Name</p>
            <p class="text-gray-700">{{ registrationData.personal.firstName }} {{ registrationData.personal.lastName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="text-gray-700">{{ registrationData.personal.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Phone</p>
            <p class="text-gray-700">{{ registrationData.personal.phone }}</p>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Uploaded Documents</h3>
        <div class="grid grid-cols-1 gap-2">
          <div v-if="registrationData.documents.idDocument">
            <p class="text-sm text-gray-500">ID Document</p>
            <p class="text-gray-700">{{ registrationData.documents.idDocument.name }}</p>
          </div>
          <div v-if="registrationData.documents.municipalAccount">
            <p class="text-sm text-gray-500">Municipal Account</p>
            <p class="text-gray-700">{{ registrationData.documents.municipalAccount.name }}</p>
          </div>
          <div v-if="registrationData.documents.bankStatement">
            <p class="text-sm text-gray-500">Bank Statement</p>
            <p class="text-gray-700">{{ registrationData.documents.bankStatement.name }}</p>
          </div>
        </div>
      </div>

      <!-- Banking Details -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Banking Details</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Account Holder</p>
            <p class="text-gray-700">{{ registrationData.banking.accountHolder }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Bank Name</p>
            <p class="text-gray-700">{{ registrationData.banking.bankName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Account Type</p>
            <p class="text-gray-700 capitalize">{{ registrationData.banking.accountType }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Account Number</p>
            <p class="text-gray-700">{{ registrationData.banking.accountNumber }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Branch Code</p>
            <p class="text-gray-700">{{ registrationData.banking.branchCode }}</p>
          </div>
        </div>
      </div>

      <!-- Address Details -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Address Details</h3>
        <div class="space-y-1">
          <p class="text-gray-700">{{ registrationData.address.streetAddress }}</p>
          <p class="text-gray-700">{{ registrationData.address.suburb }}</p>
          <p class="text-gray-700">
            {{ registrationData.address.city }}, {{ registrationData.address.province }}
          </p>
          <p class="text-gray-700">{{ registrationData.address.postalCode }}</p>
          <p class="text-sm text-gray-500 mt-2">Property Type</p>
          <p class="text-gray-700 capitalize">{{ registrationData.address.propertyType }}</p>
        </div>
      </div>

      <!-- Meter Details -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Meter Details</h3>
        <div class="space-y-4">
          <div v-for="(meter, index) in registrationData.meters" :key="index" class="p-4 border rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Meter Number</p>
                <p class="text-gray-700">{{ meter.meterNumber }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Utility Type</p>
                <p class="text-gray-700 capitalize">{{ meter.utilityType }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Location</p>
                <p class="text-gray-700">{{ meter.location }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status</p>
                <p class="text-gray-700">{{ meter.isActive ? 'Active' : 'Inactive' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
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
          @click="handleSubmit"
          :loading="isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Registration' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  registrationData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['prev', 'submit'])
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Here you would typically send the data to your backend
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated API call
    emit('submit', props.registrationData)
  } catch (error) {
    console.error('Error submitting registration:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script> 