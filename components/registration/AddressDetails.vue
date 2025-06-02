<template>
  <div>
    <div class="space-y-6">
      <div class="text-center md:text-left">
        <h2 class="text-xl font-semibold text-gray-900">Address Details</h2>
        <p class="mt-1 text-sm text-gray-500">Please provide your residential address</p>
      </div>

      <div class="space-y-6">
        <div class="space-y-2">
          <Label for="streetAddress" class="flex items-center justify-between">
            <span>Street Address</span>
            <span v-if="formData.streetAddress" class="text-xs text-gray-500">
              {{ formData.streetAddress.length }}/100 characters
            </span>
          </Label>
          <Input
            id="streetAddress"
            v-model="formData.streetAddress"
            type="text"
            maxlength="100"
            placeholder="Enter your street name and number"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.streetAddress,
              'border-green-500 focus:ring-green-500': formData.streetAddress && !errors.streetAddress
            }"
            aria-describedby="streetAddress-error streetAddress-hint"
          />
          <p id="streetAddress-hint" class="text-xs text-gray-500">Include your street name and house/unit number</p>
          <span 
            v-if="errors.streetAddress" 
            id="streetAddress-error" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.streetAddress }}
          </span>
        </div>

        <div class="space-y-2">
          <Label for="suburb" class="flex items-center justify-between">
            <span>Suburb</span>
            <span v-if="formData.suburb" class="text-xs text-gray-500">
              {{ formData.suburb.length }}/50 characters
            </span>
          </Label>
          <Input
            id="suburb"
            v-model="formData.suburb"
            type="text"
            maxlength="50"
            placeholder="Enter your suburb"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.suburb,
              'border-green-500 focus:ring-green-500': formData.suburb && !errors.suburb
            }"
            aria-describedby="suburb-error"
          />
          <span 
            v-if="errors.suburb" 
            id="suburb-error" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.suburb }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <Label for="city" class="flex items-center justify-between">
              <span>City</span>
              <span v-if="formData.city" class="text-xs text-gray-500">
                {{ formData.city.length }}/50 characters
              </span>
            </Label>
            <Input
              id="city"
              v-model="formData.city"
              type="text"
              maxlength="50"
              placeholder="Enter your city"
              :class="{ 
                'border-red-500 focus:ring-red-500': errors.city,
                'border-green-500 focus:ring-green-500': formData.city && !errors.city
              }"
              aria-describedby="city-error"
            />
            <span 
              v-if="errors.city" 
              id="city-error" 
              class="text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle class="h-4 w-4" />
              {{ errors.city }}
            </span>
          </div>

          <div class="space-y-2">
            <Label for="province" class="flex items-center justify-between">
              <span>Province</span>
              <span v-if="formData.province" class="text-xs text-gray-500">
                {{ formData.province.length }}/50 characters
              </span>
            </Label>
            <Input
              id="province"
              v-model="formData.province"
              type="text"
              maxlength="50"
              placeholder="Enter your province"
              :class="{ 
                'border-red-500 focus:ring-red-500': errors.province,
                'border-green-500 focus:ring-green-500': formData.province && !errors.province
              }"
              aria-describedby="province-error"
            />
            <span 
              v-if="errors.province" 
              id="province-error" 
              class="text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle class="h-4 w-4" />
              {{ errors.province }}
            </span>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="postalCode" class="flex items-center justify-between">
            <span>Postal Code</span>
            <span v-if="formData.postalCode" class="text-xs text-gray-500">
              {{ formData.postalCode.length }}/4 digits
            </span>
          </Label>
          <Input
            id="postalCode"
            v-model="formData.postalCode"
            type="text"
            maxlength="4"
            placeholder="Enter 4-digit postal code"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.postalCode,
              'border-green-500 focus:ring-green-500': formData.postalCode && !errors.postalCode
            }"
            aria-describedby="postalCode-error postalCode-hint"
            @input="formatPostalCode"
          />
          <p id="postalCode-hint" class="text-xs text-gray-500">Enter a valid 4-digit South African postal code</p>
          <span 
            v-if="errors.postalCode" 
            id="postalCode-error" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.postalCode }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  registrationData: {
    type: Object,
    required: true
  }
})

const formData = ref({
  streetAddress: '',
  suburb: '',
  city: '',
  province: '',
  postalCode: ''
})

const errors = ref({})

// Initialize form data from props if available
watch(() => props.registrationData?.address, (newValue) => {
  if (newValue) {
    formData.value = { ...newValue }
  }
}, { immediate: true })

// Format postal code to only allow numbers
const formatPostalCode = (event) => {
  formData.value.postalCode = event.target.value.replace(/\D/g, '').slice(0, 4)
}

// Validate form data before submitting
watch(formData, (newValue) => {
  const newErrors = {}
  
  if (!newValue.streetAddress) {
    newErrors.streetAddress = 'Street address is required'
  } else if (newValue.streetAddress.length < 5) {
    newErrors.streetAddress = 'Please enter a complete street address'
  }

  if (!newValue.suburb) {
    newErrors.suburb = 'Suburb is required'
  } else if (newValue.suburb.length < 2) {
    newErrors.suburb = 'Please enter a valid suburb name'
  }

  if (!newValue.city) {
    newErrors.city = 'City is required'
  } else if (newValue.city.length < 2) {
    newErrors.city = 'Please enter a valid city name'
  }

  if (!newValue.province) {
    newErrors.province = 'Province is required'
  } else if (newValue.province.length < 2) {
    newErrors.province = 'Please enter a valid province name'
  }

  if (!newValue.postalCode) {
    newErrors.postalCode = 'Postal code is required'
  } else if (!/^\d{4}$/.test(newValue.postalCode)) {
    newErrors.postalCode = 'Please enter a valid 4-digit postal code'
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