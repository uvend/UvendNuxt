<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-blue-300 p-4 md:relative md:bg-transparent md:border-0 md:p-0">
    <div class="flex justify-between items-center max-w-3xl mx-auto w-full">
      <Button
        v-if="showPrev"
        type="button"
        variant="outline"
        class="w-[120px] border-blue-400 text-blue-700 hover:bg-blue-50 hover:border-blue-500 transition-all duration-200"
        @click="$emit('prev')"
      >
        <ChevronLeft class="h-4 w-4 mr-2" />
        Previous
      </Button>
      <div v-else class="w-[120px]" /> <!-- Spacer for alignment -->

      <div class="flex-1 px-4 flex justify-center">
        <div class="hidden md:flex items-center gap-2">
          <div
            v-for="i in totalSteps"
            :key="i"
            :class="[
              'h-2 w-2 rounded-full transition-all duration-300',
              i <= currentStep ? 'bg-gradient-to-r from-blue-700 to-orange-500' : 'bg-gray-200'
            ]"
          />
        </div>
        <span class="text-sm text-gray-600 md:hidden font-medium">
          Step {{ currentStep }} of {{ totalSteps }}
        </span>
      </div>

      <Button
        type="submit"
        class="w-[120px] bg-gradient-to-r from-blue-700 to-orange-600 hover:from-blue-800 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        :disabled="loading"
        form="registrationForm"
      >
        <span v-if="loading" class="flex items-center">
          <Loader2 class="h-4 w-4 mr-2 animate-spin" />
          Loading
        </span>
        <span v-else class="flex items-center">
          {{ isLastStep ? 'Submit' : 'Next' }}
          <ChevronRight v-if="!isLastStep" class="h-4 w-4 ml-2" />
        </span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'

defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  totalSteps: {
    type: Number,
    required: true
  },
  showPrev: {
    type: Boolean,
    default: true
  },
  isLastStep: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['prev'])
</script> 