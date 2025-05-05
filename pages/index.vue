<template>
    <div class="main-grid">
        <div :style="{ backgroundColor: bgColor }" class="bg-dynamic">
            <MyLogo />
            <div class="p-6">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Top 5 Meters by Vending Amount</h3>
                        <button 
                            @click="fetchDashboardData" 
                            class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                            :disabled="chartIsLoading"
                        >
                            <span v-if="chartIsLoading">Loading...</span>
                            <span v-else>Refresh</span>
                        </button>
                    </div>
                    
                    <div v-if="chartIsLoading" class="flex justify-center items-center h-64">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    
                    <div v-else-if="chartError" class="text-red-500 text-center h-64 flex items-center justify-center">
                        {{ chartError }}
                    </div>
                    
                    <BarChart
                        v-else-if="chartData.length > 0"
                        :data="chartData"
                        :categories="['amount']"
                        index="name"
                        :colors="['#2563eb']"
                        type="grouped"
                        :rounded-corners="4"
                        :y-formatter="formatAmount"
                        :show-legend="false"
                    />
                    <p v-else class="text-center text-gray-500 h-64 flex items-center justify-center">
                        No vending data available
                    </p>
                </div>
            </div>
        </div>
        <div class="profile-grid flex h-full">
            <div class="flex justify-between py-2 px-4">
                <div></div>
                <MyUserMenu />
            </div>
            <div class="p-20 h-full w-[500px]">
                <div class="flex items-center gap-2 mt-20 mb-8">
                    <Icon name="lucide:search" />
                    <Input type="text" v-model="search" class="focus-visible:ring-0 border-0" placeholder="Search"/>
                </div>
                <div class="">
                    <MySkeletenCardList v-if="isLoading" :columns="1"/>
                    <div v-else class="customer-container hide-scrollbar">
                        <MyCustomerCard class="my-2 cursor-pointer" v-for="customer in searchCustomers" :customer="customer" @click="navigateTo(`/my/${customer.uniqueIdentification}/transactions`)"/> 
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { BarChart } from '@/components/ui/chart-bar'

const customers = ref([])
const isLoading = ref(true)
const search = ref('')
const chartData = ref([])
const chartIsLoading = ref(true)
const chartError = ref(null)

async function fetchDashboardData() {
    chartIsLoading.value = true
    try {
        // Fetch meters data
        const metersResponse = await useWalletAuthFetch(`${WALLET_API_URL}/meter`)
        
        // Fetch transactions data
        const transactionsResponse = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/history`)
        
        // Process meter statistics
        const meterTransactions = new Map()
        transactionsResponse.transactions.forEach(transaction => {
            const meterNumber = transaction.meterNumber
            const amount = parseFloat(transaction.amount)
            
            if (meterTransactions.has(meterNumber)) {
                meterTransactions.get(meterNumber).amount += amount
            } else {
                const meter = metersResponse.meters.find(m => m.meterNumber === meterNumber)
                meterTransactions.set(meterNumber, {
                    meterNumber: meterNumber,
                    name: meter?.name || meterNumber,
                    amount: amount
                })
            }
        })

        // Convert to array and sort by amount
        chartData.value = Array.from(meterTransactions.values())
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5) // Show top 5 meters
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
        chartError.value = error.message
    } finally {
        chartIsLoading.value = false
    }
}

async function getCustomers() {
    isLoading.value = true
    try {
        const result = await useAuthFetch(`${API_URL}/AdminSystem/Customer/GetCustomerList`, {
            method: "GET"
        })
        console.log(result)
        customers.value = result.list.listOfDefinitions
    } catch (error) {
        console.error('Error fetching customers:', error)
    } finally {
        isLoading.value = false
    }
}

function formatAmount(tick) {
    if (typeof tick === 'number') {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(tick)
    }
    return ''
}

const searchCustomers = computed(() => {
    let filtered = [...customers.value]
    
    // Sort by description
    filtered = filtered.sort((a, b) => {
        let descA = a.description.toLowerCase()
        let descB = b.description.toLowerCase()
        if (descA < descB) return -1
        if (descA > descB) return 1
        return 0
    })
    
    // Filter active and non-deleted customers
    filtered = filtered.filter(customer => {
        if (customer.accountStatus != "Active") {
            console.log(customer)
        }
        return customer.accountStatus === "Active" && !customer.is_deleted
    })
    
    // Apply search filter
    if (search.value !== '') {
        filtered = filtered.filter(customer => {
            return customer.description.toLowerCase().includes(search.value.toLowerCase())
        })
    }
    
    return filtered
})

const bgColor = computed(() => {
    return `#${APP_BG_1?.replace('#', '') || '172554'}`
})

onMounted(() => {
    getCustomers()
    fetchDashboardData()
})
</script>
<style scoped>
.bg-dynamic {
    transition: background-color 0.3s;
}
.main-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
}
.customer-container {
    height: 300px;
    overflow: scroll;
}
.search-input {
    margin: 20px auto;
    border: 0;
}
.search-input:focus-visible {
    border: 0;
}
.profile-grid {
    display: grid;
    grid-template-rows: min-content auto;
    overflow: hidden;
    height: calc(100vh);
}
.customer-container {
    overflow-y: scroll;
    height: calc(100vh - 50px);
}

.logo-container img {
    padding: 10px;
    width: 230px;
}
</style>