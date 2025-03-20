<template>
    <div>
        <AccountMenu />
        <h1>Rolled-back Payments</h1>
        <ul>
            <li v-for="payment in rolledBackPayments" :key="payment.id">
                {{ payment.details }}
            </li>
        </ul>
    </div>
</template>

<script>
import AccountMenu from '@/layouts/account.vue';

export default {
    components: {
        AccountMenu
    },
    data() {
        return {
            rolledBackPayments: [] // Array to store rolled-back payments
        }
    },
    methods: {
        async fetchRolledBackPayments() {
            try {
                const response = await fetch(`${API_URL}/path/to/rollback/payments`);
                const data = await response.json();
                // Sort payments by date or timestamp
                this.rolledBackPayments = data.payments.sort((a, b) => new Date(b.date) - new Date(a.date));
            } catch (error) {
                console.error('Error fetching rolled-back payments:', error);
            }
        }
    },
    async mounted() {
        await this.fetchRolledBackPayments(); // Fetch data when component is mounted
    }
}
</script>
