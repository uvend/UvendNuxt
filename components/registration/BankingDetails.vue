<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900">Banking Details</h2>
      <p class="mt-2 text-sm text-gray-600">Please enter your banking information</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <Label for="accountHolder">Account Holder Name</Label>
        <Input
          id="accountHolder"
          v-model="form.accountHolder"
          type="text"
          required
          :class="{ 'border-red-500': errors.accountHolder }"
        />
        <span v-if="errors.accountHolder" class="text-xs text-red-500">{{ errors.accountHolder }}</span>
      </div>

      <div class="space-y-2">
        <Label for="bankName">Bank Name</Label>
        <Select v-model="form.bankName" :class="{ 'border-red-500': errors.bankName }">
          <option value="">Select a bank</option>
          <option v-for="bank in banks" :key="bank" :value="bank">{{ bank }}</option>
        </Select>
        <span v-if="errors.bankName" class="text-xs text-red-500">{{ errors.bankName }}</span>
      </div>

      <div class="space-y-2">
        <Label for="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          v-model="form.accountNumber"
          type="text"
          required
          :class="{ 'border-red-500': errors.accountNumber }"
        />
        <span v-if="errors.accountNumber" class="text-xs text-red-500">{{ errors.accountNumber }}</span>
      </div>

      <div class="space-y-2">
        <Label for="accountType">Account Type</Label>
        <Select v-model="form.accountType" :class="{ 'border-red-500': errors.accountType }">
          <option value="">Select account type</option>
          <option value="savings">Savings</option>
          <option value="current">Current/Cheque</option>
          <option value="transmission">Transmission</option>
        </Select>
        <span v-if="errors.accountType" class="text-xs text-red-500">{{ errors.accountType }}</span>
      </div>

      <div class="space-y-2">
        <Label for="branchCode">Branch Code</Label>
        <Input
          id="branchCode"
          v-model="form.branchCode"
          type="text"
          required
          :class="{ 'border-red-500': errors.branchCode }"
        />
        <span v-if="errors.branchCode" class="text-xs text-red-500">{{ errors.branchCode }}</span>
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

const banks = [
  'ABSA',
  'Capitec',
  'FNB',
  'Nedbank',
  'Standard Bank',
  'African Bank',
  'Bidvest Bank',
  'Discovery Bank',
  'TymeBank'
]

const form = reactive({
  accountHolder: '',
  bankName: '',
  accountNumber: '',
  accountType: '',
  branchCode: ''
})

const errors = reactive({})

const validateForm = () => {
  errors.accountHolder = !form.accountHolder ? 'Account holder name is required' : ''
  errors.bankName = !form.bankName ? 'Bank name is required' : ''
  errors.accountNumber = !form.accountNumber ? 'Account number is required' : 
                        !/^\d{5,16}$/.test(form.accountNumber) ? 'Invalid account number' : ''
  errors.accountType = !form.accountType ? 'Account type is required' : ''
  errors.branchCode = !form.branchCode ? 'Branch code is required' : 
                     !/^\d{6}$/.test(form.branchCode) ? 'Invalid branch code' : ''

  return Object.values(errors).every(error => !error)
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('next', form)
  }
}
</script> 