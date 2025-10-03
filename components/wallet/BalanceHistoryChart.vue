<template>
    <Card class="group relative overflow-hidden  h-full bg-gradient-to-br from-white to-green-50/20 border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
        <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                    <Icon name="lucide:trending-up" class="h-4 w-4 text-green-600"/>
                </div>
                <CardTitle class="text-lg font-bold text-gray-900">Balance History</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <div class="space-y-4">
                <!-- Period Summary -->
                <div class="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 p-4">
                    <div class="flex items-center justify-between">
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-600">Period Growth</p>
                            <p class="text-xl font-bold text-green-700">+350.00</p>
                            <div class="flex items-center gap-1">
                                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <p class="text-xs text-gray-600">Positive trend</p>
                            </div>
                        </div>
                        <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <Icon name="lucide:arrow-up-right" class="h-6 w-6 text-green-600"/>
                        </div>
                    </div>
                    <!-- Subtle gradient overlay -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-green-100/20 pointer-events-none"></div>
                </div>
                
                <!-- Chart Area -->
                <div class="h-48 relative bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200/50 p-4">
                    <div v-if="isLoading" class="flex items-center justify-center h-full">
                        <div class="flex flex-col items-center gap-3">
                            <MyLoader />
                            <p class="text-sm text-gray-500">Loading chart data...</p>
                        </div>
                    </div>
                    <div v-else class="h-full">
                        <LineChart
                            :data="chartData"
                            :categories="['balance']"
                            index="date"
                            :colors="['#10b981']"
                            :curve="'monotone'"
                            :grid="true"
                            :y-axis="true"
                            :x-axis="true"
                            :tooltip="true"
                            :animate="true"
                            :value-formatter="(value) => formatAmount(value)"
                            class="[&>svg]:stroke-border [&>svg]:stroke-[2]"
                        />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { LineChart } from '@/components/ui/chart-line'

const isLoading = ref(true)
const chartData = ref([])

function formatAmount(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

async function fetchBalanceHistory() {
    isLoading.value = true
    try {
        // Generate sample data for the last 30 days
        const today = new Date()
        const sampleData = []
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            
            // Generate realistic balance progression
            const baseBalance = 1000
            const variation = Math.sin(i * 0.2) * 200 + Math.random() * 100
            const balance = Math.max(0, baseBalance + variation)
            
            sampleData.push({
                date: date.toISOString().split('T')[0],
                balance: Math.round(balance)
            })
        }
        
        chartData.value = sampleData
    } catch (error) {
        console.error('Error fetching balance history:', error)
        useToast({
            title: 'Error',
            description: 'Failed to load balance history',
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchBalanceHistory()
})
</script>
