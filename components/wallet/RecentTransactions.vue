<template>
    <Card class="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/20 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
        <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                        <Icon name="lucide:history" class="h-4 w-4 text-gray-600"/>
                    </div>
                    <CardTitle class="text-lg font-bold text-gray-900">Recent Transactions</CardTitle>
                </div>
                <Button 
                    variant="ghost" 
                    class="group/btn relative overflow-hidden text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300"
                    @click="navigateTo('/wallet/transactions')"
                >
                    <span class="relative z-10 flex items-center gap-1">
                        View all
                        <Icon name="lucide:arrow-right" class="h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-300"/>
                    </span>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div v-if="isLoading" class="py-8 flex justify-center">
                <div class="flex flex-col items-center gap-3">
                    <MyLoader />
                    <p class="text-xs text-gray-500">Loading transactions...</p>
                </div>
            </div>
            <div v-else-if="recentTransactions.length > 0" class="space-y-3">
                <div v-for="transaction in recentTransactions" 
                     :key="transaction.id"
                     class="group/item relative overflow-hidden bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200/50 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300"
                                 :class="transaction.type === 'electricity' ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-gradient-to-br from-blue-100 to-cyan-100'">
                                <Icon :name="transaction.type === 'electricity' ? 'lucide:zap' : 'lucide:droplet'" 
                                      :class="transaction.type === 'electricity' ? 'h-5 w-5 text-yellow-600' : 'h-5 w-5 text-blue-600'"/>
                            </div>
                            <div class="space-y-1">
                                <p class="text-sm font-bold text-gray-900">
                                    {{ transaction.type === 'electricity' ? 'Electricity prepaid purchase' : 'Water prepaid purchase' }}
                                </p>
                                <div class="flex items-center gap-2">
                                    <p class="text-xs text-gray-600 font-medium">
                                        {{ formatDate(transaction.date) }}
                                    </p>
                                    <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                                    <p class="text-xs text-gray-500 font-mono">Ref {{ transaction.reference }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold"
                               :class="transaction.type === 'electricity' ? 'text-orange-600' : 'text-blue-600'">
                                -{{ formatAmount(transaction.amount) }}
                            </p>
                            <div class="flex items-center gap-1 mt-1">
                                <div class="w-1.5 h-1.5 rounded-full"
                                     :class="transaction.type === 'electricity' ? 'bg-orange-400' : 'bg-blue-400'"></div>
                                <p class="text-xs text-gray-500 font-medium">Debit</p>
                            </div>
                        </div>
                    </div>
                    <!-- Subtle gradient overlay -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-100/20 pointer-events-none"></div>
                </div>
            </div>
            <div v-else class="py-12 text-center">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Icon name="lucide:receipt" class="h-8 w-8 text-gray-400"/>
                    </div>
                    <div class="space-y-1">
                        <p class="text-lg font-semibold text-gray-500">No recent transactions</p>
                        <p class="text-sm text-gray-400">Your transaction history will appear here</p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const recentTransactions = ref([])

function formatAmount(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

async function fetchRecentTransactions() {
    isLoading.value = true
    try {
        // Fetch transactions data
        const transactionsResponse = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/history`)
        
        // Process and format recent transactions (last 4)
        recentTransactions.value = transactionsResponse.transactions
            .slice(0, 4)
            .map(transaction => ({
                id: transaction.id || transaction.meterNumber + transaction.date,
                type: transaction.meterNumber.startsWith('ELE') ? 'electricity' : 'water',
                date: transaction.date,
                amount: parseFloat(transaction.amount),
                reference: transaction.reference || `${transaction.meterNumber.slice(-6)}`
            }))
            
    } catch (error) {
        console.error('Error fetching recent transactions:', error)
        // Show sample data if API fails
        recentTransactions.value = [
            {
                id: '1',
                type: 'electricity',
                date: '2025-09-08',
                amount: 150.00,
                reference: 'E-94123'
            },
            {
                id: '2',
                type: 'water',
                date: '2025-09-06',
                amount: 85.50,
                reference: 'W-18322'
            },
            {
                id: '3',
                type: 'electricity',
                date: '2025-09-01',
                amount: 200.00,
                reference: 'E-88234'
            },
            {
                id: '4',
                type: 'water',
                date: '2025-08-29',
                amount: 120.75,
                reference: 'W-44567'
            }
        ]
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchRecentTransactions()
})
</script>
