<template>
    <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-900 mb-4">Welcome To Uvend Accounting</h1>
            <p class="text-xl text-gray-600">Your comprehensive payment management system</p>
        </div>
    </div>
</template>
<script>
definePageMeta({
    layout: 'account'
})

export default {
    data() {
        return {
            mpesaUrl: false
        }
    },
    mounted() {
        if (MPESA_URL != "") {
            this.mpesaUrl = true;
        }
    },
    methods: {
        goToLastCustomer() {
            // Get the last customer from localStorage or go to customer selection
            const lastCustomer = localStorage.getItem('lastCustomerId')
            if (lastCustomer) {
                this.$router.push(`/my/${lastCustomer}/dashboard`)
            } else {
                this.$router.push('/')
            }
        },
        goToCustomerSelection() {
            this.$router.push('/')
        }
    }
}
</script>