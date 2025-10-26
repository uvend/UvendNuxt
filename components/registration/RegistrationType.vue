<template>
  <div>
    <div class="text-center md:text-left">
      <h2 class="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Registration Type</h2>
      <p class="mt-2 text-sm text-gray-600">Please select your registration type</p>
    </div>

    <div class="mt-8 space-y-4">
      <div
        v-for="option in registrationTypes"
        :key="option.value"
        class="relative flex cursor-pointer rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
        :class="{
          'border-blue-500 ring-2 ring-blue-200 bg-gradient-to-r from-blue-50 to-orange-50': selectedType === option.value,
          'border-gray-200 hover:border-blue-300': selectedType !== option.value
        }"
        @click="selectType(option.value)"
      >
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center">
            <div class="text-sm">
              <p class="font-semibold text-gray-900">{{ option.title }}</p>
              <p class="text-gray-600 mt-1">{{ option.description }}</p>
            </div>
          </div>
          <div v-if="selectedType === option.value" class="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full">
            <CheckIcon class="h-4 w-4 text-white" />
          </div>
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

const emit = defineEmits(['dataChange'])

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
  emit('dataChange', { type: selectedType.value })
}

// Expose component data
defineExpose({
  validate: () => selectedType.value !== '',
  getData: () => ({
    type: selectedType.value
  }),
  submit: () => {
    if (selectedType.value !== '') {
      emit('dataChange', { type: selectedType.value })
      return true
    }
    return false
  }
})
</script> 