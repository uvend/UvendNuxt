<template>
  <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="space-y-8 pt-16 md:pt-0">
      <!-- Header -->
      <div class="text-center md:text-left">
        <h1 class="text-2xl font-semibold text-gray-900">Special Documentation</h1>
        <p class="mt-1 text-sm text-gray-500">Please provide additional documentation for your specific case</p>
      </div>

      <!-- Reason Selection -->
      <div class="bg-white rounded-lg border p-6 space-y-4">
        <h2 class="text-lg font-medium text-gray-900">Reason for Special Documentation</h2>
        <div class="space-y-2">
          <Label for="reason">Select your reason</Label>
          <Select
            id="reason"
            v-model="formData.reason"
            :class="{ 'border-red-500': errors.reason }"
          >
            <option value="">Please select a reason</option>
            <option v-for="reason in reasons" :key="reason.value" :value="reason.value">
              {{ reason.label }}
            </option>
          </Select>
          <span 
            v-if="errors.reason" 
            class="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle class="h-4 w-4" />
            {{ errors.reason }}
          </span>
        </div>
      </div>

      <!-- Document Upload Section -->
      <div class="bg-white rounded-lg border p-6 space-y-6">
        <h2 class="text-lg font-medium text-gray-900">Required Documents</h2>
        
        <!-- ID Document -->
        <div class="space-y-2">
          <Label>ID Document</Label>
          <FileInput
            v-model="formData.idDocument"
            accept=".pdf,.jpg,.jpeg,.png"
            :error="errors.idDocument"
          />
        </div>

        <!-- Bank Statements -->
        <div class="space-y-2">
          <Label>Bank Statements (Last 3 months)</Label>
          <FileInput
            v-model="formData.bankStatements"
            accept=".pdf"
            :error="errors.bankStatements"
          />
        </div>

        <!-- Affidavit -->
        <div class="space-y-2">
          <Label>Affidavit</Label>
          <FileInput
            v-model="formData.affidavit"
            accept=".pdf,.jpg,.jpeg,.png"
            :error="errors.affidavit"
          />
        </div>

        <!-- Additional Documents -->
        <div class="space-y-2">
          <Label>Additional Supporting Documents (Optional)</Label>
          <p class="text-sm text-gray-500 mb-2">
            Upload any additional documents such as Power of Attorney or financial management authorization
          </p>
          <FileInput
            v-model="formData.additionalDocs"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
          />
        </div>
      </div>

      <!-- OTP Verification -->
      <div class="bg-white rounded-lg border p-6 space-y-4">
        <h2 class="text-lg font-medium text-gray-900">Verification</h2>
        <div v-if="!otpSent" class="space-y-4">
          <div class="space-y-2">
            <Label for="phone">Phone Number</Label>
            <Input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="Enter your phone number"
              :class="{ 'border-red-500': errors.phone }"
            />
            <span 
              v-if="errors.phone" 
              class="text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle class="h-4 w-4" />
              {{ errors.phone }}
            </span>
          </div>
          <Button @click="sendOTP" :disabled="isLoading">
            <Loader2Icon v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
            Send OTP
          </Button>
        </div>

        <div v-else class="space-y-4">
          <div class="space-y-2">
            <Label for="otp">Enter OTP</Label>
            <div class="flex gap-2">
              <Input
                v-for="(digit, index) in 6"
                :key="index"
                v-model="otpDigits[index]"
                type="text"
                maxlength="1"
                class="w-12 text-center"
                @input="handleOtpInput($event, index)"
                @keydown.delete="handleOtpDelete($event, index)"
              />
            </div>
            <span 
              v-if="errors.otp" 
              class="text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle class="h-4 w-4" />
              {{ errors.otp }}
            </span>
          </div>
          <div class="flex items-center gap-4">
            <Button @click="verifyOTP" :disabled="isLoading">
              <Loader2Icon v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
              Verify & Submit
            </Button>
            <Button variant="ghost" @click="resendOTP" :disabled="isLoading">
              Resend OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'nuxt/app'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Select } from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import { AlertCircle, Loader2Icon } from 'lucide-vue-next'
import FileInput from '~/components/ui/file-input.vue'

const router = useRouter()
const isLoading = ref(false)
const otpSent = ref(false)
const otpDigits = ref(['', '', '', '', '', ''])
const errors = ref({})

const reasons = [
  { value: 'developer', label: 'I\'m a Developer' },
  { value: 'no_municipal', label: 'I don\'t receive a municipal account' },
  { value: 'informal_settlement', label: 'I live in an informal settlement' },
  { value: 'company_personal', label: 'I\'m signing up for my company and need to use personal details' }
]

const formData = ref({
  reason: '',
  idDocument: null,
  bankStatements: null,
  affidavit: null,
  additionalDocs: [],
  phone: ''
})

const validateForm = () => {
  const newErrors = {}

  if (!formData.value.reason) {
    newErrors.reason = 'Please select a reason'
  }

  if (!formData.value.idDocument) {
    newErrors.idDocument = 'ID Document is required'
  }

  if (!formData.value.bankStatements) {
    newErrors.bankStatements = 'Bank statements are required'
  }

  if (!formData.value.affidavit) {
    newErrors.affidavit = 'Affidavit is required'
  }

  if (!formData.value.phone) {
    newErrors.phone = 'Phone number is required'
  } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.value.phone)) {
    newErrors.phone = 'Please enter a valid phone number'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const sendOTP = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    // TODO: Implement actual OTP sending logic here
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
    otpSent.value = true
  } catch (error) {
    console.error('Failed to send OTP:', error)
  } finally {
    isLoading.value = false
  }
}

const resendOTP = () => {
  otpDigits.value = ['', '', '', '', '', '']
  sendOTP()
}

const handleOtpInput = (event, index) => {
  const value = event.target.value
  if (value && index < 5) {
    // Move to next input
    const nextInput = event.target.nextElementSibling
    if (nextInput) nextInput.focus()
  }
}

const handleOtpDelete = (event, index) => {
  if (!event.target.value && index > 0) {
    // Move to previous input
    const prevInput = event.target.previousElementSibling
    if (prevInput) prevInput.focus()
  }
}

const verifyOTP = async () => {
  const otp = otpDigits.value.join('')
  if (otp.length !== 6) {
    errors.value.otp = 'Please enter a valid 6-digit OTP'
    return
  }

  isLoading.value = true
  try {
    // TODO: Implement actual OTP verification and form submission logic here
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
    router.push('/registration/documents')
  } catch (error) {
    console.error('Failed to verify OTP:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 