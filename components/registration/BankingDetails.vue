<template>
  <div>
    <div class="space-y-8">
      <div class="text-center md:text-left">
        <h2 class="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Banking Details</h2>
        <p class="mt-2 text-sm text-gray-600">Please provide your banking information for payments</p>
      </div>

      <div class="space-y-6">
        <div class="space-y-3">
          <Label for="accountHolder" class="flex items-center justify-between text-gray-700 font-medium">
            <span>Account Holder Name</span>
            <span v-if="formData.accountHolder" class="text-xs text-gray-500">
              {{ formData.accountHolder.length }}/100 characters
            </span>
          </Label>
          <Input
            id="accountHolder"
            v-model="formData.accountHolder"
            type="text"
            placeholder="Enter account holder name"
            class="transition-all duration-200 focus:border-orange-400 focus:ring-orange-200"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.accountHolder,
              'border-green-500 focus:ring-green-500': formData.accountHolder && !errors.accountHolder
            }"
            aria-describedby="accountHolder-error"
            @input="handleDataChange"
          />
          <p id="accountHolder-hint" class="text-xs text-gray-500">Enter the name exactly as it appears on your bank account</p>
          <span 
            v-if="errors.accountHolder" 
            id="accountHolder-error" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.accountHolder }}
          </span>
        </div>

        <div class="space-y-3">
          <Label for="bankName" class="text-gray-700 font-medium">Bank Name</Label>
          <Input
            id="bankName"
            v-model="formData.bankName"
            type="text"
            placeholder="Enter bank name"
            class="transition-all duration-200 focus:border-orange-400 focus:ring-orange-200"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.bankName,
              'border-green-500 focus:ring-green-500': formData.bankName && !errors.bankName
            }"
            @input="handleDataChange"
          />
          <span 
            v-if="errors.bankName" 
            id="bankName-error" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.bankName }}
          </span>
        </div>

        <div class="space-y-3">
          <Label for="accountNumber" class="flex items-center justify-between text-gray-700 font-medium">
            <span>Account Number</span>
            <span v-if="formData.accountNumber" class="text-xs text-gray-500">
              {{ formData.accountNumber.length }}/16 digits
            </span>
          </Label>
          <Input
            id="accountNumber"
            v-model="formData.accountNumber"
            type="text"
            maxlength="16"
            placeholder="Enter account number"
            class="transition-all duration-200 focus:border-orange-400 focus:ring-orange-200"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.accountNumber,
              'border-green-500 focus:ring-green-500': formData.accountNumber && !errors.accountNumber
            }"
            @input="formatAccountNumber"
          />
          <span 
            v-if="errors.accountNumber" 
            id="accountNumber-error" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.accountNumber }}
          </span>
        </div>

        <div class="space-y-3">
          <Label for="accountType" class="text-gray-700 font-medium">Account Type</Label>
          <Select
            v-model="formData.accountType"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.accountType,
              'border-green-500 focus:ring-green-500': formData.accountType && !errors.accountType
            }"
            @update:model-value="handleDataChange"
          >
            <SelectTrigger id="accountType" aria-describedby="accountType-error" class="transition-all duration-200 focus:border-orange-400 focus:ring-orange-200">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="current">Current/Cheque</SelectItem>
              <SelectItem value="transmission">Transmission</SelectItem>
            </SelectContent>
          </Select>
          <span 
            v-if="errors.accountType" 
            id="accountType-error" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.accountType }}
          </span>
        </div>

        <div class="space-y-3">
          <Label for="branchCode" class="flex items-center justify-between text-gray-700 font-medium">
            <span>Branch Code</span>
            <span v-if="formData.branchCode" class="text-xs text-gray-500">
              {{ formData.branchCode.length }}/6 digits
            </span>
          </Label>
          <Input
            id="branchCode"
            v-model="formData.branchCode"
            type="text"
            maxlength="6"
            placeholder="Enter 6-digit branch code"
            class="transition-all duration-200 focus:border-orange-400 focus:ring-orange-200"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.branchCode,
              'border-green-500 focus:ring-green-500': formData.branchCode && !errors.branchCode
            }"
            aria-describedby="branchCode-error branchCode-hint"
            @input="formatBranchCode"
          />
          <p id="branchCode-hint" class="text-xs text-gray-500">Enter your bank's 6-digit branch/sorting code</p>
          <span 
            v-if="errors.branchCode" 
            id="branchCode-error" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.branchCode }}
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const props = defineProps({
  registrationData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['dataChange'])

const formData = ref({
  accountHolder: '',
  bankName: '',
  accountNumber: '',
  accountType: '',
  branchCode: ''
})

const errors = ref({})

// Initialize form data from props if available
watch(() => props.registrationData?.banking, (newValue) => {
  if (newValue) {
    formData.value = { ...newValue }
  }
}, { immediate: true })

// Format account number to only allow numbers
const formatAccountNumber = (event) => {
  formData.value.accountNumber = event.target.value.replace(/\D/g, '').slice(0, 16)
  handleDataChange()
}

// Format branch code to only allow numbers
const formatBranchCode = (event) => {
  formData.value.branchCode = event.target.value.replace(/\D/g, '').slice(0, 6)
  handleDataChange()
}

// Validate form data before submitting
watch(formData, (newValue) => {
  const newErrors = {}
  
  if (!newValue.accountHolder) {
    newErrors.accountHolder = 'Account holder name is required'
  } else if (newValue.accountHolder.length < 3) {
    newErrors.accountHolder = 'Please enter a valid account holder name'
  }

  if (!newValue.bankName) {
    newErrors.bankName = 'Bank name is required'
  }

  if (!newValue.accountNumber) {
    newErrors.accountNumber = 'Account number is required'
  } else if (!/^\d{5,16}$/.test(newValue.accountNumber)) {
    newErrors.accountNumber = 'Please enter a valid account number (5-16 digits)'
  }

  if (!newValue.accountType) {
    newErrors.accountType = 'Account type is required'
  }

  if (!newValue.branchCode) {
    newErrors.branchCode = 'Branch code is required'
  } else if (!/^\d{6}$/.test(newValue.branchCode)) {
    newErrors.branchCode = 'Please enter a valid 6-digit branch code'
  }

  errors.value = newErrors
}, { deep: true })

const handleDataChange = () => {
  // Emit the data to parent
  emit('dataChange', { ...formData.value })
}

// Expose form data to parent
defineExpose({
  validate: () => {
    return Object.keys(errors.value).length === 0
  },
  getData: () => formData.value
})
</script> 