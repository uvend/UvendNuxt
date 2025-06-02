<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900">Meter Details</h2>
      <p class="mt-2 text-sm text-gray-600">Add your utility meters information</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Existing Meters List -->
      <div v-if="meters.length > 0" class="space-y-4">
        <div v-for="(meter, index) in meters" :key="index" class="p-4 border rounded-lg space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Meter {{ index + 1 }}</h3>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              @click="removeMeter(index)"
            >
              <XIcon class="h-4 w-4" />
            </Button>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label :for="'meterNumber-' + index">Meter Number</Label>
              <Input
                :id="'meterNumber-' + index"
                v-model="meter.meterNumber"
                type="text"
                required
                :class="{ 'border-red-500': errors[`meters.${index}.meterNumber`] }"
              />
              <span v-if="errors[`meters.${index}.meterNumber`]" class="text-xs text-red-500">
                {{ errors[`meters.${index}.meterNumber`] }}
              </span>
            </div>

            <div class="space-y-2">
              <Label :for="'utilityType-' + index">Utility Type</Label>
              <Select
                v-model="meter.utilityType"
                :class="{ 'border-red-500': errors[`meters.${index}.utilityType`] }"
              >
                <option value="">Select utility type</option>
                <option value="electricity">Electricity</option>
                <option value="water">Water</option>
                <option value="gas">Gas</option>
              </Select>
              <span v-if="errors[`meters.${index}.utilityType`]" class="text-xs text-red-500">
                {{ errors[`meters.${index}.utilityType`] }}
              </span>
            </div>
          </div>

          <div class="space-y-2">
            <Label :for="'location-' + index">Meter Location</Label>
            <Input
              :id="'location-' + index"
              v-model="meter.location"
              type="text"
              required
              :class="{ 'border-red-500': errors[`meters.${index}.location`] }"
            />
            <span v-if="errors[`meters.${index}.location`]" class="text-xs text-red-500">
              {{ errors[`meters.${index}.location`] }}
            </span>
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox
              :id="'isActive-' + index"
              v-model="meter.isActive"
            />
            <Label :for="'isActive-' + index">Meter is currently active</Label>
          </div>
        </div>
      </div>

      <!-- Add New Meter Button -->
      <Button
        type="button"
        variant="outline"
        class="w-full"
        @click="addMeter"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        Add New Meter
      </Button>

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
          :disabled="meters.length === 0"
        >
          Next
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { XIcon, PlusIcon } from 'lucide-vue-next'

const emit = defineEmits(['prev', 'next'])

const meters = ref([])
const errors = reactive({})

const addMeter = () => {
  meters.value.push({
    meterNumber: '',
    utilityType: '',
    location: '',
    isActive: true
  })
}

const removeMeter = (index) => {
  meters.value.splice(index, 1)
}

const validateForm = () => {
  let isValid = true
  errors = {}

  if (meters.value.length === 0) {
    errors.meters = 'At least one meter is required'
    isValid = false
  }

  meters.value.forEach((meter, index) => {
    if (!meter.meterNumber) {
      errors[`meters.${index}.meterNumber`] = 'Meter number is required'
      isValid = false
    }
    if (!meter.utilityType) {
      errors[`meters.${index}.utilityType`] = 'Utility type is required'
      isValid = false
    }
    if (!meter.location) {
      errors[`meters.${index}.location`] = 'Location is required'
      isValid = false
    }
  })

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('next', { meters: meters.value })
  }
}

// Add an initial meter by default
addMeter()
</script> 