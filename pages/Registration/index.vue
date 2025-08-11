<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-orange-50 relative overflow-hidden">
        <!-- Watermark Background -->
        <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <img 
                src="/UVendlogo-Better.png" 
                alt="UVEND Logo Watermark" 
                class="w-96 h-96 object-contain"
            />
        </div>

        <!-- UVEND Logo and Registration Icon - Top Left Corner -->
        <div class="absolute top-6 left-6 z-20">
            <div class="flex items-center gap-2">
                <h1 class="text-2xl font-bold text-blue-700">UVEND</h1>
                <Icon name="lucide:user-plus" class="h-6 w-6 text-blue-600" />
            </div>
        </div>

        <!-- Mobile Header -->
        <div class="md:hidden bg-white/90 backdrop-blur-sm px-4 py-3 border-b border-blue-300 fixed top-0 left-0 right-0 z-10 shadow-sm">
            <h1 class="text-lg font-semibold text-center text-gray-800">Registration</h1>
        </div>

        <div class="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <!-- Progress Steps - Hidden on mobile -->
            <div class="hidden md:block py-8">
                <div class="relative flex justify-between">
                    <!-- Progress Line -->
                    <div class="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-orange-200 rounded-full">
                        <div
                            class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-700 to-orange-500 rounded-full transition-all duration-500 ease-out"
                            :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
                        />
                    </div>

                    <!-- Steps -->
                    <div v-for="(step, index) in steps" :key="step.id" class="relative flex flex-col items-center">
                        <div
                            :class="[
                                'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 shadow-lg',
                                currentStep > index + 1
                                    ? 'bg-gradient-to-br from-blue-700 to-orange-500 border-transparent text-white shadow-blue-400'
                                    : currentStep === index + 1
                                    ? 'bg-white border-blue-600 text-blue-700 shadow-blue-300'
                                    : 'bg-white border-gray-300 text-gray-500 shadow-gray-200'
                            ]"
                        >
                            <span v-if="currentStep > index + 1" class="text-sm font-bold">✓</span>
                            <span v-else class="text-sm font-bold">{{ index + 1 }}</span>
                        </div>
                        <span 
                            class="absolute top-16 text-sm font-medium whitespace-nowrap transition-colors duration-300"
                            :class="[
                                currentStep > index + 1
                                    ? 'text-blue-700'
                                    : currentStep === index + 1
                                    ? 'text-blue-700'
                                    : 'text-gray-500'
                            ]"
                        >
                            {{ step.name }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Form Container -->
            <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl mt-8 md:mt-0 mb-24 md:mb-12 border border-blue-200">
                <form id="registrationForm" @submit.prevent="handleStepComplete">
                    <KeepAlive>
                        <component
                            ref="currentComponentRef"
                            :is="currentComponent"
                            v-model:type="formData.type"
                            :registration-data="formData"
                            class="p-8"
                            @data-change="handleDataChange"
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
</template>

<script setup>
import { ref, computed, markRaw, getCurrentInstance } from 'vue'
import RegistrationType from '~/components/registration/RegistrationType.vue'
import PersonalInfo from '~/components/registration/PersonalInfo.vue'
import DocumentUpload from '~/components/registration/DocumentUpload.vue'
import BankingDetails from '~/components/registration/BankingDetails.vue'
import AddressDetails from '~/components/registration/AddressDetails.vue'
import MeterDetails from '~/components/registration/MeterDetails.vue'
import Summary from '~/components/registration/Summary.vue'
import NavigationButtons from '~/components/registration/NavigationButtons.vue'
import { useRegistrationStore } from '~/stores/registration'

const config = useRuntimeConfig()
const isRegistrationEnabled = computed(() => config.public.APP_ENV === 'registration')

const registrationStore = useRegistrationStore()

const steps = [
    { id: 'type', name: 'Type', component: markRaw(RegistrationType) },
    { id: 'personal', name: 'Personal Info', component: markRaw(PersonalInfo) },
    { id: 'documents', name: 'Documents', component: markRaw(DocumentUpload) },
    { id: 'banking', name: 'Banking', component: markRaw(BankingDetails) },
    { id: 'address', name: 'Address', component: markRaw(AddressDetails) },
    { id: 'meters', name: 'Meters', component: markRaw(MeterDetails) },
    { id: 'summary', name: 'Summary', component: markRaw(Summary) }
]

const currentStep = ref(registrationStore.currentStep || 1)
const loading = ref(false)
const currentComponentRef = ref(null)

// Use the store's formData getter
const formData = computed(() => registrationStore.formData)

const currentComponent = computed(() => steps[currentStep.value - 1].component)

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
        registrationStore.goBack()
    }
}

const handleStepComplete = async () => {
    loading.value = true
    try {
        // Get the current component instance using template ref
        const componentRef = currentComponentRef.value
        
        // Try to call submit method on the component
        if (componentRef && typeof componentRef.submit === 'function') {
            const success = componentRef.submit()
            if (!success) {
                throw new Error('Please check your input and try again.')
            }
        }
        
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

const handleDataChange = (data) => {
    // Store the data based on current step
    const stepId = steps[currentStep.value - 1].id
    
    console.log('Data change received:', { stepId, data })
    
    switch (stepId) {
        case 'type':
            registrationStore.setType(data)
            break
        case 'personal':
            registrationStore.setPersonal(data)
            break
        case 'documents':
            registrationStore.setDocuments(data)
            break
        case 'banking':
            registrationStore.setBanking(data)
            break
        case 'address':
            registrationStore.setAddress(data)
            break
        case 'meters':
            registrationStore.setMeters(data)
            break
    }
    
    console.log('Store data after update:', registrationStore.formData)
}

const handlePrev = () => {
    if (currentStep.value > 1) {
        currentStep.value--
        registrationStore.goBack()
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
