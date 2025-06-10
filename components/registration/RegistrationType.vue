<template>
  <div>
    <div class="text-center md:text-left">
      <h2 class="text-2xl font-semibold text-gray-900">Registration Type</h2>
      <p class="mt-1 text-sm text-gray-500">Please select your registration type</p>
    </div>

    <div class="mt-8 space-y-4">
      <div
        v-for="option in registrationTypes"
        :key="option.value"
        class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
        :class="{
          'border-primary ring-2 ring-primary': selectedType === option.value,
          'border-gray-300': selectedType !== option.value
        }"
        @click="selectType(option.value)"
      >
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center">
            <div class="text-sm">
              <p class="font-medium text-gray-900">{{ option.title }}</p>
              <p class="text-gray-500">{{ option.description }}</p>
            </div>
          </div>
          <CheckIcon
            v-if="selectedType === option.value"
            class="h-5 w-5 text-primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CheckIcon } from 'lucide-vue-next'

const props = defineProps({
  registrationData: {
    type: Object,
    required: true
  }
})

const registrationTypes = [
  {
    title: 'New Registration',
    value: 'new',
    description: 'Register as a new user or business'
  },
  {
    title: 'Update Details',
    value: 'update',
    description: 'Update your existing registration information'
  },
  {
    title: 'Existing Registration',
    value: 'existing',
    description: 'Access or view your existing registration'
  }
]

const selectedType = ref('')

// Initialize from props if available
watch(() => props.registrationData?.type, (newValue) => {
  if (newValue) {
    selectedType.value = newValue
  }
}, { immediate: true })

const selectType = (type) => {
  selectedType.value = type
}

// Expose component data
defineExpose({
  validate: () => selectedType.value !== '',
  getData: () => ({
    type: selectedType.value
  })
})
</script> 