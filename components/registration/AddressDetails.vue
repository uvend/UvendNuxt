<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900">Address Details</h2>
      <p class="mt-2 text-sm text-gray-600">Please enter your address information</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <Label for="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          v-model="form.streetAddress"
          type="text"
          required
          :class="{ 'border-red-500': errors.streetAddress }"
        />
        <span v-if="errors.streetAddress" class="text-xs text-red-500">{{ errors.streetAddress }}</span>
      </div>

      <div class="space-y-2">
        <Label for="suburb">Suburb</Label>
        <Input
          id="suburb"
          v-model="form.suburb"
          type="text"
          required
          :class="{ 'border-red-500': errors.suburb }"
        />
        <span v-if="errors.suburb" class="text-xs text-red-500">{{ errors.suburb }}</span>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <Label for="city">City</Label>
          <Input
            id="city"
            v-model="form.city"
            type="text"
            required
            :class="{ 'border-red-500': errors.city }"
          />
          <span v-if="errors.city" class="text-xs text-red-500">{{ errors.city }}</span>
        </div>

        <div class="space-y-2">
          <Label for="province">Province</Label>
          <Select v-model="form.province" :class="{ 'border-red-500': errors.province }">
            <option value="">Select province</option>
            <option v-for="province in provinces" :key="province" :value="province">
              {{ province }}
            </option>
          </Select>
          <span v-if="errors.province" class="text-xs text-red-500">{{ errors.province }}</span>
        </div>
      </div>

      <div class="space-y-2">
        <Label for="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          v-model="form.postalCode"
          type="text"
          required
          :class="{ 'border-red-500': errors.postalCode }"
        />
        <span v-if="errors.postalCode" class="text-xs text-red-500">{{ errors.postalCode }}</span>
      </div>

      <div class="space-y-2">
        <Label for="propertyType">Property Type</Label>
        <Select v-model="form.propertyType" :class="{ 'border-red-500': errors.propertyType }">
          <option value="">Select property type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="townhouse">Townhouse</option>
          <option value="business">Business Premises</option>
          <option value="other">Other</option>
        </Select>
        <span v-if="errors.propertyType" class="text-xs text-red-500">{{ errors.propertyType }}</span>
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

const emit = defineEmits(['prev', 'next'])

const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape'
]

const form = reactive({
  streetAddress: '',
  suburb: '',
  city: '',
  province: '',
  postalCode: '',
  propertyType: ''
})

const errors = reactive({})

const validateForm = () => {
  errors.streetAddress = !form.streetAddress ? 'Street address is required' : ''
  errors.suburb = !form.suburb ? 'Suburb is required' : ''
  errors.city = !form.city ? 'City is required' : ''
  errors.province = !form.province ? 'Province is required' : ''
  errors.postalCode = !form.postalCode ? 'Postal code is required' : 
                     !/^\d{4}$/.test(form.postalCode) ? 'Invalid postal code' : ''
  errors.propertyType = !form.propertyType ? 'Property type is required' : ''

  return Object.values(errors).every(error => !error)
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('next', form)
  }
}
</script> 