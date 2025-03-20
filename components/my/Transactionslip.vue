<template>
    <div>
        <h2>Transaction Details</h2>
        <p>ID: {{ transaction.id }}</p>
        <p>Amount: {{ transaction.amount }}</p>
        <p>Date: {{ transaction.date }}</p>
        <button @click="fetchSlip">Get Slip</button>
        <div v-if="slip">
            <h3>Transaction Slip</h3>
            <p>{{ slip.details }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        transaction: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            slip: null // To store the fetched slip
        }
    },
    methods: {
        async fetchSlip() {
            try {
                const response = await fetch(`${API_URL}/path/to/get/slip/${this.transaction.id}`);
                const data = await response.json();
                this.slip = data.slip; // Assuming the API returns an object with a 'slip' property
            } catch (error) {
                console.error('Error fetching slip:', error);
            }
        }
    }
}
</script>
