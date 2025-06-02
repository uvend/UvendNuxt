<template>
  <div>
    <div class="space-y-6">
      <div class="text-center md:text-left">
        <h2 class="text-xl font-semibold text-gray-900">Banking Details</h2>
        <p class="mt-1 text-sm text-gray-500">Please provide your banking information</p>
      </div>

      <div class="space-y-6">
        <div class="space-y-2">
          <Label for="accountHolder" class="flex items-center justify-between">
            <span>Account Holder Name</span>
            <span v-if="formData.accountHolder" class="text-xs text-gray-500">
              {{ formData.accountHolder.length }}/100 characters
            </span>
          </Label>
          <Input
            id="accountHolder"
            v-model="formData.accountHolder"
            type="text"
            maxlength="100"
            placeholder="Enter the name on your bank account"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.accountHolder,
              'border-green-500 focus:ring-green-500': formData.accountHolder && !errors.accountHolder
            }"
            aria-describedby="accountHolder-error accountHolder-hint"
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

        <div class="space-y-2">
          <Label for="bankName">Bank Name</Label>
          <Select
            v-model="formData.bankName"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.bankName,
              'border-green-500 focus:ring-green-500': formData.bankName && !errors.bankName
            }"
          >
            <SelectTrigger id="bankName" aria-describedby="bankName-error">
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Major Banks</SelectLabel>
                <SelectItem value="ABSA">ABSA</SelectItem>
                <SelectItem value="Capitec">Capitec</SelectItem>
                <SelectItem value="FNB">FNB</SelectItem>
                <SelectItem value="Nedbank">Nedbank</SelectItem>
                <SelectItem value="Standard Bank">Standard Bank</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Other Banks</SelectLabel>
                <SelectItem value="African Bank">African Bank</SelectItem>
                <SelectItem value="Bidvest Bank">Bidvest Bank</SelectItem>
                <SelectItem value="Discovery Bank">Discovery Bank</SelectItem>
                <SelectItem value="TymeBank">TymeBank</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <span 
            v-if="errors.bankName" 
            id="bankName-error" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.bankName }}
          </span>
        </div>

        <div class="space-y-2">
          <Label for="accountNumber" class="flex items-center justify-between">
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
            placeholder="Enter your account number"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.accountNumber,
              'border-green-500 focus:ring-green-500': formData.accountNumber && !errors.accountNumber
            }"
            aria-describedby="accountNumber-error"
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

        <div class="space-y-2">
          <Label for="accountType">Account Type</Label>
          <Select
            v-model="formData.accountType"
            :class="{ 
              'border-red-500 focus:ring-red-500': errors.accountType,
              'border-green-500 focus:ring-green-500': formData.accountType && !errors.accountType
            }"
          >
            <SelectTrigger id="accountType" aria-describedby="accountType-error">
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

        <div class="space-y-2">
          <Label for="branchCode" class="flex items-center justify-between">
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
}

// Format branch code to only allow numbers
const formatBranchCode = (event) => {
  formData.value.branchCode = event.target.value.replace(/\D/g, '').slice(0, 6)
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

// Expose form data to parent
defineExpose({
  validate: () => {
    return Object.keys(errors.value).length === 0
  },
  getData: () => formData.value
})
</script> 