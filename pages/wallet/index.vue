<template>
    <div class="flex flex-col p-4 gap-4 overflow-hidden">
        <!-- Filter buttons in a scrollable container on mobile -->
        <div class="flex justify-between flex-wrap gap-2">
            <WalletUtilitySelector v-model="filterOptions" @update="console.log"/>
            <WalletDateRangeSelector @update="console.log"/>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3">
            <WalletCardBalance :addMoney="true"/>
            
            <Card class="p-4 bg-white border shadow-sm">
              <div class="flex flex-col">
                  <div class="flex justify-between items-center mb-2">
                    <p class="text-gray-600 text-sm">Active Meters</p>
                    <WalletPopup buttonLabel="Add Meter">
                      <WalletAddMeter @success="fetchDashboardData()"/>
                    </WalletPopup>
                  </div>
                  <p class="text-2xl font-bold">{{ activeMeters }}</p>
                  <p class="text-sm text-muted-foreground">Total meters: {{ totalMeters }}</p>
              </div>
            </Card>
            
            <Card class="p-4 bg-white border shadow-sm">
              <div class="flex flex-col">
                  <p class="text-gray-600 text-sm">Total Transactions</p>
                  <p class="text-2xl font-bold">{{ totalTransactions }}</p>
                  <p class="text-sm text-muted-foreground">Last 30 days</p>
              </div>
            </Card>
        </div>

        <!-- Meter Vending Statistics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Bar Chart -->
            <Card class="bg-white border shadow-sm">              
                <CardHeader>
                    <CardTitle>Meter Vending Distribution</CardTitle>
                    <CardDescription>Vending amount by meter</CardDescription>
                </CardHeader>
                <CardContent>
                    <div v-if="isLoading" class="py-8 flex justify-center">
                        <MyLoader />
                    </div>
                    <div v-else-if="meterStats.length > 0" class="h-[400px]">
                        <BarChart
                            :data="meterStats"
                            :categories="['amount']"
                            index="name"
                            :colors="['#3b82f6']"
                            type="grouped"
                            :rounded-corners="6"
                            :y-formatter="formatAmount"
                            :show-legend="false"
                            :grid="true"
                            :y-axis="true"
                            :x-axis="true"
                            :tooltip="true"
                            :animate="true"
                            :value-formatter="(value) => formatAmount(value)"
                            :show-values="true"
                            class="[&>svg]:stroke-border [&>svg]:stroke-[1]"
                            :attributes="{
                                'vis-grouped-bar__bar': {
                                    width: (d) => d.transactionCount === 1 ? 0.4 : 0.8
                                }
                            }"
                        />
                    </div>
                    <div v-else class="py-8 text-center text-gray-500">
                        No transaction data available
                    </div>
                </CardContent>
            </Card>

            <!-- List View -->
            <Card class="bg-white border shadow-sm">
                <CardHeader>
                    <CardTitle>Top Vending Meters</CardTitle>
                    <CardDescription>Ranked by vending amount</CardDescription>
                </CardHeader>
                <CardContent>
                    <div v-if="isLoading" class="py-8 flex justify-center">
                        <MyLoader />
                    </div>
                    <div v-else-if="meterStats.length > 0" class="divide-y">
                        <div v-for="(meter, index) in meterStats" 
                             :key="meter.name"
                             class="py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                             >
                            <div class="flex items-center gap-3">
                                <div>
                                    <p class="font-medium">{{ meter.name }}</p>
                                    <p class="text-sm text-gray-500">
                                        {{ formatAmount(meter.amount) }}
                                        <span class="text-xs text-gray-400 ml-2">({{ meter.transactionCount }} {{ meter.transactionCount === 1 ? 'purchase' : 'purchases' }})</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="py-8 text-center text-gray-500">
                        No transaction data available
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'wallet'
})

import { ref, onMounted } from 'vue'
import { BarChart } from '@/components/ui/chart-bar'

const walletBalance = ref(null)
const isLoading = ref(true)
const activeMeters = ref(0)
const totalMeters = ref(0)
const totalTransactions = ref(0)
const meterStats = ref([])
const filterOptions = ref([
    { key: "all", value: "All Transactions" },
    { key: "elect", value: "Electricity" },
    { key: "water", value: "Water" },
    { key: "payments", value: "Payments" },
])

function formatAmount(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: amount > 999999 ? 'compact' : 'standard'
    }).format(amount)
}

function navigateToMeter(meter) {
    // Navigate to meter details page
    navigateTo(`/wallet/meters/${meter.meterNumber}`)
}

async function fetchDashboardData() {
    isLoading.value = true
    try {
        // Fetch meters data
        const metersResponse = await useWalletAuthFetch(`${WALLET_API_URL}/meter`)
        totalMeters.value = metersResponse.meters.length
        activeMeters.value = metersResponse.meters.filter(meter => meter.status === 'Active').length

        // Fetch transactions data
        const transactionsResponse = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/history`)
        totalTransactions.value = transactionsResponse.transactions.length

        // Process meter statistics
        const meterTransactions = new Map()
        transactionsResponse.transactions.forEach(transaction => {
            const meterNumber = transaction.meterNumber
            const amount = parseFloat(transaction.amount)
            
            if (meterTransactions.has(meterNumber)) {
                const existing = meterTransactions.get(meterNumber)
                existing.amount += amount
                existing.transactionCount++
            } else {
                const meter = metersResponse.meters.find(m => m.meterNumber === meterNumber)
                meterTransactions.set(meterNumber, {
                    meterNumber: meterNumber,
                    name: meter?.name || meterNumber,
                    amount: amount,
                    transactionCount: 1
                })
            }
        })

        // Convert to array and sort by amount
        meterStats.value = Array.from(meterTransactions.values())
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10) // Show top 10 meters

    } catch (error) {
        console.error('Error fetching dashboard data:', error)
        useToast({
            title: 'Error',
            description: 'Failed to load dashboard data',
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchDashboardData()
})
</script>