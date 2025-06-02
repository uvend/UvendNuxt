<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900">Select Registration Type</h2>
      <p class="mt-2 text-sm text-gray-600">Please choose your registration type below</p>
    </div>

    <div class="grid gap-4">
      <Button
        v-for="type in registrationTypes"
        :key="type.value"
        :variant="selectedType === type.value ? 'default' : 'outline'"
        class="w-full p-6 h-auto flex flex-col items-center gap-2"
        @click="selectType(type.value)"
      >
        <component :is="type.icon" class="h-6 w-6" />
        <span class="text-lg font-semibold">{{ type.label }}</span>
        <span class="text-sm text-gray-500">{{ type.description }}</span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserPlus, UserCheck, PencilLine } from 'lucide-vue-next'

const emit = defineEmits(['update:type'])
const selectedType = ref('')

const registrationTypes = [
  {
    value: 'new',
    label: 'New Registration',
    description: 'Register as a new user',
    icon: UserPlus
  },
  {
    value: 'existing',
    label: 'Existing User',
    description: 'Already registered user',
    icon: UserCheck
  },
  {
    value: 'update',
    label: 'Update Registration',
    description: 'Update your existing registration',
    icon: PencilLine
  }
]

const selectType = (type) => {
  selectedType.value = type
  emit('update:type', type)
}
</script> 