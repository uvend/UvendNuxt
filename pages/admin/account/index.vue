<template>
    <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <img src="/Dethro.jpg" alt="Dethro Technology" class="h-24 w-auto mx-auto mb-6 rounded-lg shadow-lg" />
            <h1 class="text-5xl font-bold mb-4" style="color: #1a1a5e;">Welcome To Dethro Accounting</h1>
            <p class="text-xl text-gray-500">Your comprehensive payment management system</p>
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