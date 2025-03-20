<template>
    <div>
        <h1>Tariffs</h1>
        <button @click="fetchTariffs">Show Tariffs</button>
        <ul v-if="tariffs.length > 0">
            <li v-for="tariff in tariffs" :key="tariff.id">
                {{ tariff.name }}: {{ tariff.rate }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tariffs: [] // Array to store the fetched tariffs
        }
    },
    methods: {
        async fetchTariffs() {
            try {
                const response = await fetch(`${API_URL}/path/to/get/tariffs`, {
                    method: "GET",
                    params: {
                        customerId: this.$route.params.customer_id // Assuming you have customer_id in route params
                    }
                });
                const data = await response.json();
                this.tariffs = data.tariffs; // Assuming the API returns an object with a 'tariffs' array
            } catch (error) {
                console.error('Error fetching tariffs:', error);
            }
        }
    }
}
</script>
