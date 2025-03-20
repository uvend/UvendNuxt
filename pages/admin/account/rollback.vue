<template>
    <div>
        <h1>Rolled-back Payments</h1>
        <ul>
            <li v-for="payment in rolledBackPayments" :key="payment.id">
                {{ payment.details }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
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
                this.rolledBackPayments = data.payments; // Assuming the API returns an object with a 'payments' array
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
