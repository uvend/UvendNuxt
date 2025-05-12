<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <!-- Header -->
            <div class="text-center">
                <h2 class="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
                <p class="mt-2 text-sm text-gray-600">
                    Already have an account?
                    <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </NuxtLink>
                </p>
            </div>

            <!-- Registration Form -->
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm space-y-4">
                    <!-- Personal Information -->
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label for="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    v-model="form.firstName"
                                    type="text"
                                    required
                                    :class="{ 'border-red-500': errors.firstName }"
                                />
                                <span v-if="errors.firstName" class="text-xs text-red-500">{{ errors.firstName }}</span>
                            </div>
                            <div>
                                <Label for="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    v-model="form.lastName"
                                    type="text"
                                    required
                                    :class="{ 'border-red-500': errors.lastName }"
                                />
                                <span v-if="errors.lastName" class="text-xs text-red-500">{{ errors.lastName }}</span>
                            </div>
                        </div>

                        <div>
                            <Label for="email">Email address</Label>
                            <Input
                                id="email"
                                v-model="form.email"
                                type="email"
                                autocomplete="email"
                                required
                                :class="{ 'border-red-500': errors.email }"
                            />
                            <span v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</span>
                        </div>

                        <div>
                            <Label for="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                v-model="form.phone"
                                type="tel"
                                required
                                :class="{ 'border-red-500': errors.phone }"
                            />
                            <span v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</span>
                        </div>
                    </div>

                    <!-- Password Section -->
                    <div class="space-y-4">
                        <div>
                            <Label for="password">Password</Label>
                            <Input
                                id="password"
                                v-model="form.password"
                                type="password"
                                required
                                :class="{ 'border-red-500': errors.password }"
                            />
                            <span v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</span>
                        </div>

                        <div>
                            <Label for="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                v-model="form.confirmPassword"
                                type="password"
                                required
                                :class="{ 'border-red-500': errors.confirmPassword }"
                            />
                            <span v-if="errors.confirmPassword" class="text-xs text-red-500">{{ errors.confirmPassword }}</span>
                        </div>
                    </div>

                    <!-- Terms and Conditions -->
                    <div class="flex items-center">
                        <Checkbox
                            id="terms"
                            v-model="form.acceptTerms"
                            :class="{ 'border-red-500': errors.acceptTerms }"
                        />
                        <Label for="terms" class="ml-2 block text-sm text-gray-900">
                            I agree to the
                            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Terms and Conditions</a>
                        </Label>
                    </div>
                    <span v-if="errors.acceptTerms" class="text-xs text-red-500">{{ errors.acceptTerms }}</span>
                </div>

                <!-- Submit Button -->
                <div>
                    <Button
                        type="submit"
                        class="w-full"
                        :loading="isLoading"
                        :disabled="isLoading"
                    >
                        {{ isLoading ? 'Creating account...' : 'Create account' }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isLoading = ref(false)
const errors = reactive({})

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
})

function validateForm() {
    errors.firstName = !form.firstName ? 'First name is required' : ''
    errors.lastName = !form.lastName ? 'Last name is required' : ''
    errors.email = !form.email ? 'Email is required' : 
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Invalid email format' : ''
    errors.phone = !form.phone ? 'Phone number is required' : ''
    errors.password = !form.password ? 'Password is required' : 
                     form.password.length < 8 ? 'Password must be at least 8 characters' : ''
    errors.confirmPassword = !form.confirmPassword ? 'Please confirm your password' :
                           form.password !== form.confirmPassword ? 'Passwords do not match' : ''
    errors.acceptTerms = !form.acceptTerms ? 'You must accept the terms and conditions' : ''

    return Object.values(errors).every(error => !error)
}

async function handleSubmit() {
    if (!validateForm()) return

    isLoading.value = true
    try {
        // Call your registration API here
        const response = await useAuthFetch(`${API_URL}/auth/register`, {
            method: 'POST',
            body: {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                password: form.password
            }
        })

        // Handle successful registration
        useToast({
            title: 'Success',
            description: 'Your account has been created successfully',
            variant: 'success'
        })

        // Redirect to login page or dashboard
        navigateTo('/login')
    } catch (error) {
        console.error('Registration error:', error)
        useToast({
            title: 'Error',
            description: error.message || 'Failed to create account',
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
}
</script>
