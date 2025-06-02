<template>
    <div v-if="isRegistrationEnabled" class="min-h-screen bg-gray-50">
        <!-- Mobile Header -->
        <div class="md:hidden bg-white px-4 py-3 border-b fixed top-0 left-0 right-0 z-10">
            <h1 class="text-lg font-semibold text-center">Registration</h1>
        </div>

        <div class="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <!-- Progress Steps - Hidden on mobile -->
            <div class="hidden md:block py-12">
                <div class="relative flex justify-between">
                    <!-- Progress Line -->
                    <div class="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200">
                        <div
                            class="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                            :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
                        />
                    </div>

                    <!-- Steps -->
                    <div v-for="(step, index) in steps" :key="step.id" class="relative flex flex-col items-center">
                        <div
                            :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10',
                                currentStep > index + 1
                                    ? 'bg-primary border-primary text-white'
                                    : currentStep === index + 1
                                    ? 'bg-white border-primary text-primary'
                                    : 'bg-white border-gray-300 text-gray-500'
                            ]"
                        >
                            <span v-if="currentStep > index + 1" class="text-sm">✓</span>
                            <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
                        </div>
                        <span 
                            class="absolute top-12 text-sm font-medium whitespace-nowrap"
                            :class="[
                                currentStep > index + 1
                                    ? 'text-primary'
                                    : currentStep === index + 1
                                    ? 'text-primary'
                                    : 'text-gray-500'
                            ]"
                        >
                            {{ step.name }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Form Container -->
            <div class="bg-white shadow-xl rounded-lg mt-16 md:mt-0 mb-24 md:mb-12">
                <form id="registrationForm" @submit.prevent="handleStepComplete">
                    <KeepAlive>
                        <component
                            :is="currentComponent"
                            v-model:type="formData.type"
                            :registration-data="formData"
                            class="p-6"
                        />
                    </KeepAlive>
                </form>
            </div>

            <!-- Navigation Buttons -->
            <NavigationButtons
                :current-step="currentStep"
                :total-steps="steps.length"
                :show-prev="currentStep > 1"
                :is-last-step="currentStep === steps.length"
                :loading="loading"
                @prev="prevStep"
            />
        </div>
    </div>
    <div v-else class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center px-4">
            <h2 class="text-2xl font-bold text-gray-900">Registration Not Available</h2>
            <p class="mt-2 text-gray-600">Registration is currently not enabled in this environment.</p>
            <NuxtLink to="/" class="mt-4 inline-block text-primary hover:text-primary/90">
                Return to Home
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue'
import RegistrationType from '~/components/registration/RegistrationType.vue'
import PersonalInfo from '~/components/registration/PersonalInfo.vue'
import DocumentUpload from '~/components/registration/DocumentUpload.vue'
import BankingDetails from '~/components/registration/BankingDetails.vue'
import AddressDetails from '~/components/registration/AddressDetails.vue'
import MeterDetails from '~/components/registration/MeterDetails.vue'
import Summary from '~/components/registration/Summary.vue'
import NavigationButtons from '~/components/registration/NavigationButtons.vue'

const config = useRuntimeConfig()
const isRegistrationEnabled = computed(() => config.public.APP_ENV === 'registration')

const steps = [
    { id: 'type', name: 'Type', component: markRaw(RegistrationType) },
    { id: 'personal', name: 'Personal Info', component: markRaw(PersonalInfo) },
    { id: 'documents', name: 'Documents', component: markRaw(DocumentUpload) },
    { id: 'banking', name: 'Banking', component: markRaw(BankingDetails) },
    { id: 'address', name: 'Address', component: markRaw(AddressDetails) },
    { id: 'meters', name: 'Meters', component: markRaw(MeterDetails) },
    { id: 'summary', name: 'Summary', component: markRaw(Summary) }
]

const currentStep = ref(1)
const loading = ref(false)
const formData = ref({
    type: '',
    personal: null,
    documents: null,
    banking: null,
    address: null,
    meters: null
})

const currentComponent = computed(() => steps[currentStep.value - 1].component)

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}

const handleStepComplete = async () => {
    loading.value = true
    try {
        // Here you would validate the current step's data
        const stepId = steps[currentStep.value - 1].id
        
        if (currentStep.value === steps.length) {
            await handleSubmit()
        } else {
            // Move to next step
            currentStep.value++
        }
    } catch (error) {
        useToast({
            title: 'Error',
            description: error.message || 'Please check your input and try again.',
            variant: 'destructive'
        })
    } finally {
        loading.value = false
    }
}

const handleSubmit = async () => {
    try {
        // Here you would typically send the data to your backend
        console.log('Registration submitted:', formData.value)

        useToast({
            title: 'Success',
            description: 'Your registration has been submitted successfully. We will send you a confirmation email shortly.',
            variant: 'success'
        })

        await navigateTo('/')
    } catch (error) {
        console.error('Error submitting registration:', error)
        throw new Error('There was an error submitting your registration. Please try again.')
    }
}
</script>

<style scoped>
/* Add padding to account for fixed navigation on mobile */
@media (max-width: 768px) {
    .min-h-screen {
        padding-top: 56px; /* Height of mobile header */
        padding-bottom: 72px; /* Height of mobile navigation */
    }
}
</style>
