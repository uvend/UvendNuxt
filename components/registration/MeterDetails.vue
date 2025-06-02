<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900">Meter & Unit Details</h2>
      <p class="mt-2 text-sm text-gray-600">Add your utility meters and tenant information</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Existing Meters List -->
      <div v-if="meters.length > 0" class="space-y-4">
        <div v-for="(meter, index) in meters" :key="index" class="p-6 border rounded-lg space-y-6 bg-white shadow-sm">
          <div class="flex justify-between items-center border-b pb-4">
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

          <!-- Meter Information -->
          <div class="space-y-6">
            <h4 class="font-medium text-gray-700">Meter Information</h4>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label :for="'meterNumber-' + index">Meter Number</Label>
                <Input
                  :id="'meterNumber-' + index"
                  v-model="meter.meterNumber"
                  type="text"
                  required
                  placeholder="Enter meter number"
                  :class="{ 'border-red-500': errors[`meters.${index}.meterNumber`] }"
                />
                <span v-if="errors[`meters.${index}.meterNumber`]" class="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle class="h-4 w-4" />
                  {{ errors[`meters.${index}.meterNumber`] }}
                </span>
              </div>

              <div class="space-y-2">
                <Label :for="'utilityType-' + index">Utility Type</Label>
                <Select
                  v-model="meter.utilityType"
                  :class="{ 'border-red-500': errors[`meters.${index}.utilityType`] }"
                >
                  <SelectTrigger :id="'utilityType-' + index">
                    <SelectValue placeholder="Select utility type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                  </SelectContent>
                </Select>
                <span v-if="errors[`meters.${index}.utilityType`]" class="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle class="h-4 w-4" />
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
                placeholder="e.g., Main Building Basement, Unit 101"
                :class="{ 'border-red-500': errors[`meters.${index}.location`] }"
              />
              <span v-if="errors[`meters.${index}.location`]" class="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle class="h-4 w-4" />
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

          <!-- Unit Details -->
          <div class="space-y-6 pt-6 border-t">
            <h4 class="font-medium text-gray-700">Unit Details</h4>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label :for="'unitNumber-' + index">Unit Number</Label>
                <Input
                  :id="'unitNumber-' + index"
                  v-model="meter.unit.unitNumber"
                  type="text"
                  required
                  placeholder="e.g., Unit 101"
                  :class="{ 'border-red-500': errors[`meters.${index}.unit.unitNumber`] }"
                />
                <span v-if="errors[`meters.${index}.unit.unitNumber`]" class="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle class="h-4 w-4" />
                  {{ errors[`meters.${index}.unit.unitNumber`] }}
                </span>
              </div>

              <div class="space-y-2">
                <Label :for="'unitType-' + index">Unit Type</Label>
                <Select
                  v-model="meter.unit.unitType"
                  :class="{ 'border-red-500': errors[`meters.${index}.unit.unitType`] }"
                >
                  <SelectTrigger :id="'unitType-' + index">
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
                <span v-if="errors[`meters.${index}.unit.unitType`]" class="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle class="h-4 w-4" />
                  {{ errors[`meters.${index}.unit.unitType`] }}
                </span>
              </div>
            </div>
          </div>

          <!-- Tenant Information -->
          <div class="space-y-6 pt-6 border-t">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-700">Tenant Information</h4>
              <div class="flex items-center space-x-2">
                <Checkbox
                  :id="'hasTenant-' + index"
                  v-model="meter.unit.hasTenant"
                />
                <Label :for="'hasTenant-' + index">Unit has current tenant</Label>
              </div>
            </div>

            <div v-if="meter.unit.hasTenant" class="space-y-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label :for="'tenantName-' + index">Tenant Name</Label>
                  <Input
                    :id="'tenantName-' + index"
                    v-model="meter.unit.tenant.name"
                    type="text"
                    required
                    placeholder="Enter tenant's full name"
                    :class="{ 'border-red-500': errors[`meters.${index}.unit.tenant.name`] }"
                  />
                  <span v-if="errors[`meters.${index}.unit.tenant.name`]" class="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle class="h-4 w-4" />
                    {{ errors[`meters.${index}.unit.tenant.name`] }}
                  </span>
                </div>

                <div class="space-y-2">
                  <Label :for="'tenantPhone-' + index">Phone Number</Label>
                  <Input
                    :id="'tenantPhone-' + index"
                    v-model="meter.unit.tenant.phone"
                    type="tel"
                    required
                    placeholder="Enter tenant's phone number"
                    :class="{ 'border-red-500': errors[`meters.${index}.unit.tenant.phone`] }"
                  />
                  <span v-if="errors[`meters.${index}.unit.tenant.phone`]" class="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle class="h-4 w-4" />
                    {{ errors[`meters.${index}.unit.tenant.phone`] }}
                  </span>
                </div>
              </div>

              <div class="space-y-2">
                <Label :for="'tenantEmail-' + index">Email Address</Label>
                <Input
                  :id="'tenantEmail-' + index"
                  v-model="meter.unit.tenant.email"
                  type="email"
                  required
                  placeholder="Enter tenant's email address"
                  :class="{ 'border-red-500': errors[`meters.${index}.unit.tenant.email`] }"
                />
                <span v-if="errors[`meters.${index}.unit.tenant.email`]" class="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle class="h-4 w-4" />
                  {{ errors[`meters.${index}.unit.tenant.email`] }}
                </span>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label :for="'leaseStart-' + index">Lease Start Date</Label>
                  <Input
                    :id="'leaseStart-' + index"
                    v-model="meter.unit.tenant.leaseStart"
                    type="date"
                    required
                    :class="{ 'border-red-500': errors[`meters.${index}.unit.tenant.leaseStart`] }"
                  />
                  <span v-if="errors[`meters.${index}.unit.tenant.leaseStart`]" class="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle class="h-4 w-4" />
                    {{ errors[`meters.${index}.unit.tenant.leaseStart`] }}
                  </span>
                </div>

                <div class="space-y-2">
                  <Label :for="'leaseEnd-' + index">Lease End Date</Label>
                  <Input
                    :id="'leaseEnd-' + index"
                    v-model="meter.unit.tenant.leaseEnd"
                    type="date"
                    required
                    :class="{ 'border-red-500': errors[`meters.${index}.unit.tenant.leaseEnd`] }"
                  />
                  <span v-if="errors[`meters.${index}.unit.tenant.leaseEnd`]" class="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle class="h-4 w-4" />
                    {{ errors[`meters.${index}.unit.tenant.leaseEnd`] }}
                  </span>
                </div>
              </div>
            </div>
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
        Add New Meter & Unit
      </Button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { XIcon, PlusIcon, AlertCircle } from 'lucide-vue-next'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const emit = defineEmits(['prev', 'next'])

const meters = ref([])
const errors = reactive({})

const addMeter = () => {
  meters.value.push({
    meterNumber: '',
    utilityType: '',
    location: '',
    isActive: true,
    unit: {
      unitNumber: '',
      unitType: '',
      hasTenant: false,
      tenant: {
        name: '',
        phone: '',
        email: '',
        leaseStart: '',
        leaseEnd: ''
      }
    }
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
    // Validate meter details
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

    // Validate unit details
    if (!meter.unit.unitNumber) {
      errors[`meters.${index}.unit.unitNumber`] = 'Unit number is required'
      isValid = false
    }
    if (!meter.unit.unitType) {
      errors[`meters.${index}.unit.unitType`] = 'Unit type is required'
      isValid = false
    }

    // Validate tenant details if unit has tenant
    if (meter.unit.hasTenant) {
      if (!meter.unit.tenant.name) {
        errors[`meters.${index}.unit.tenant.name`] = 'Tenant name is required'
        isValid = false
      }
      if (!meter.unit.tenant.phone) {
        errors[`meters.${index}.unit.tenant.phone`] = 'Phone number is required'
        isValid = false
      }
      if (!meter.unit.tenant.email) {
        errors[`meters.${index}.unit.tenant.email`] = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(meter.unit.tenant.email)) {
        errors[`meters.${index}.unit.tenant.email`] = 'Please enter a valid email address'
        isValid = false
      }
      if (!meter.unit.tenant.leaseStart) {
        errors[`meters.${index}.unit.tenant.leaseStart`] = 'Lease start date is required'
        isValid = false
      }
      if (!meter.unit.tenant.leaseEnd) {
        errors[`meters.${index}.unit.tenant.leaseEnd`] = 'Lease end date is required'
        isValid = false
      }
      if (meter.unit.tenant.leaseStart && meter.unit.tenant.leaseEnd &&
          new Date(meter.unit.tenant.leaseStart) > new Date(meter.unit.tenant.leaseEnd)) {
        errors[`meters.${index}.unit.tenant.leaseEnd`] = 'Lease end date must be after start date'
        isValid = false
      }
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