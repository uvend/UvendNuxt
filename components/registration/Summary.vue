<template>
  <div class="space-y-8">
    <div class="text-center md:text-left">
      <h2 class="text-2xl font-semibold text-gray-900">Registration Summary</h2>
      <p class="mt-1 text-sm text-gray-500">Please review your information before submitting</p>
    </div>

    <!-- Registration Type -->
    <div class="bg-white rounded-lg border p-6 space-y-4">
      <div class="flex items-center justify-between border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900">Registration Type</h3>
        <Button variant="outline" size="sm" @click="$emit('edit', 1)">
          <PencilIcon class="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <span class="text-sm font-medium text-gray-500">Type</span>
          <p class="mt-1">{{ registrationData.type || 'Not specified' }}</p>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="bg-white rounded-lg border p-6 space-y-4">
      <div class="flex items-center justify-between border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
        <Button variant="outline" size="sm" @click="$emit('edit', 2)">
          <PencilIcon class="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span class="text-sm font-medium text-gray-500">Full Name</span>
          <p class="mt-1">{{ registrationData.personal?.fullName || 'Not provided' }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">ID Number</span>
          <p class="mt-1">{{ registrationData.personal?.idNumber || 'Not provided' }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Email</span>
          <p class="mt-1">{{ registrationData.personal?.email || 'Not provided' }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Phone Number</span>
          <p class="mt-1">{{ registrationData.personal?.phone || 'Not provided' }}</p>
        </div>
      </div>
    </div>

    <!-- Documents -->
    <div class="bg-white rounded-lg border p-6 space-y-4">
      <div class="flex items-center justify-between border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900">Documents</h3>
        <Button variant="outline" size="sm" @click="$emit('edit', 3)">
          <PencilIcon class="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div class="space-y-4">
        <div v-if="registrationData.documents?.length" class="grid grid-cols-1 gap-4">
          <div v-for="(doc, index) in registrationData.documents" :key="index" class="flex items-center space-x-4">
            <FileIcon class="h-5 w-5 text-gray-400" />
            <div>
              <p class="text-sm font-medium">{{ doc.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(doc.size) }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">No documents uploaded</p>
      </div>
    </div>

    <!-- Banking Details -->
    <div class="bg-white rounded-lg border p-6 space-y-4">
      <div class="flex items-center justify-between border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900">Banking Details</h3>
        <Button variant="outline" size="sm" @click="$emit('edit', 4)">
          <PencilIcon class="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span class="text-sm font-medium text-gray-500">Account Holder</span>
          <p class="mt-1">{{ registrationData.banking?.accountHolder || 'Not provided' }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Bank Name</span>
          <p class="mt-1">{{ registrationData.banking?.bankName || 'Not provided' }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Account Type</span>
          <p class="mt-1">{{ registrationData.banking?.accountType || 'Not provided' }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Branch Code</span>
          <p class="mt-1">{{ registrationData.banking?.branchCode || 'Not provided' }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Account Number</span>
          <p class="mt-1">{{ maskAccountNumber(registrationData.banking?.accountNumber) || 'Not provided' }}</p>
        </div>
      </div>
    </div>

    <!-- Address Details -->
    <div class="bg-white rounded-lg border p-6 space-y-4">
      <div class="flex items-center justify-between border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900">Address Details</h3>
        <Button variant="outline" size="sm" @click="$emit('edit', 5)">
          <PencilIcon class="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div class="space-y-4">
        <div>
          <span class="text-sm font-medium text-gray-500">Street Address</span>
          <p class="mt-1">{{ registrationData.address?.streetAddress || 'Not provided' }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="text-sm font-medium text-gray-500">Suburb</span>
            <p class="mt-1">{{ registrationData.address?.suburb || 'Not provided' }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">City</span>
            <p class="mt-1">{{ registrationData.address?.city || 'Not provided' }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">Province</span>
            <p class="mt-1">{{ registrationData.address?.province || 'Not provided' }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">Postal Code</span>
            <p class="mt-1">{{ registrationData.address?.postalCode || 'Not provided' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Meter & Unit Details -->
    <div class="bg-white rounded-lg border p-6 space-y-4">
      <div class="flex items-center justify-between border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900">Meter & Unit Details</h3>
        <Button variant="outline" size="sm" @click="$emit('edit', 6)">
          <PencilIcon class="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div v-if="registrationData.meters?.length" class="space-y-6">
        <div v-for="(meter, index) in registrationData.meters" :key="index" class="border-b last:border-0 pb-6 last:pb-0">
          <h4 class="font-medium text-gray-900 mb-4">Meter {{ index + 1 }}</h4>
          
          <!-- Meter Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span class="text-sm font-medium text-gray-500">Meter Number</span>
              <p class="mt-1">{{ meter.meterNumber }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Utility Type</span>
              <p class="mt-1">{{ meter.utilityType }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Location</span>
              <p class="mt-1">{{ meter.location }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Status</span>
              <p class="mt-1">{{ meter.isActive ? 'Active' : 'Inactive' }}</p>
            </div>
          </div>

          <!-- Unit Information -->
          <div class="mt-4">
            <h5 class="font-medium text-gray-700 mb-3">Unit Details</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm font-medium text-gray-500">Unit Number</span>
                <p class="mt-1">{{ meter.unit?.unitNumber }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Unit Type</span>
                <p class="mt-1">{{ meter.unit?.unitType }}</p>
              </div>
            </div>
          </div>

          <!-- Tenant Information -->
          <div v-if="meter.unit?.hasTenant" class="mt-4">
            <h5 class="font-medium text-gray-700 mb-3">Tenant Information</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm font-medium text-gray-500">Tenant Name</span>
                <p class="mt-1">{{ meter.unit.tenant.name }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Phone Number</span>
                <p class="mt-1">{{ meter.unit.tenant.phone }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Email</span>
                <p class="mt-1">{{ meter.unit.tenant.email }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Lease Period</span>
                <p class="mt-1">{{ formatDate(meter.unit.tenant.leaseStart) }} - {{ formatDate(meter.unit.tenant.leaseEnd) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500">No meters added</p>
    </div>
  </div>
</template>

<script setup>
import { PencilIcon, FileIcon } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

const props = defineProps({
  registrationData: {
    type: Object,
    required: true
  }
})

defineEmits(['edit'])

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return null
  const visible = accountNumber.slice(-4)
  const masked = '*'.repeat(accountNumber.length - 4)
  return masked + visible
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 