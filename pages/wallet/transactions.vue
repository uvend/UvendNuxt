<template>
<div class="flex flex-col p-4 gap-6">
    <!-- Wallet Card -->
    <WalletDebitCard />



    <!-- Summary Statistics -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Spent -->
        <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:coins" class="w-4 h-4 text-purple-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Total Spent</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">R {{ totalSpent }}</p>
                <p class="text-xs text-gray-500 mt-1">Last 30 days</p>
            </CardContent>
        </Card>

        <!-- Average per Transaction -->
        <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:trending-up" class="w-4 h-4 text-green-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Average</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">R {{ averageTransaction }}</p>
                <p class="text-xs text-gray-500 mt-1">Per transaction</p>
            </CardContent>
        </Card>

        <!-- Highest Utility -->
        <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="highestUtility.bgClass">
                        <Icon :name="highestUtility.icon" class="w-4 h-4" :class="highestUtility.iconClass" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Highest</span>
                </div>
                <p class="text-2xl font-bold" :class="highestUtility.textClass">{{ highestUtility.name }}</p>
                <p class="text-xs text-gray-500 mt-1">R {{ highestUtility.amount }}</p>
            </CardContent>
        </Card>

        <!-- Lowest Utility -->
        <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="lowestUtility.bgClass">
                        <Icon :name="lowestUtility.icon" class="w-4 h-4" :class="lowestUtility.iconClass" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Lowest</span>
                </div>
                <p class="text-2xl font-bold" :class="lowestUtility.textClass">{{ lowestUtility.name }}</p>
                <p class="text-xs text-gray-500 mt-1">R {{ lowestUtility.amount }}</p>
            </CardContent>
        </Card>
    </div>
        <!-- Service Selection -->
    <ServiceSelector 
      v-model="selectedService" 
      @service-selected="handleServiceSelection" 
    />
    <!-- Spending Trends Chart -->
    <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
                <div>
                    <CardTitle class="text-lg font-semibold text-gray-800">Spending Trends</CardTitle>
                    <CardDescription class="text-sm">Last 30 days spending comparison</CardDescription>
                </div>
                <div class="flex items-center gap-3 text-xs">
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-600">Electricity</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-600">Water</span>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent class="p-4 sm:p-6">
            <div v-if="isLoading" class="py-8 flex justify-center">
                <MyLoader />
            </div>
            <div v-else class="w-full">
                <!-- Chart Container -->
                <div class="relative h-[250px] sm:h-[300px]">
                    <!-- Y-axis labels -->
                    <div class="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 pr-2">
                        <span>R{{ maxAmount }}</span>
                        <span>R{{ Math.round(maxAmount * 0.75) }}</span>
                        <span>R{{ Math.round(maxAmount * 0.5) }}</span>
                        <span>R{{ Math.round(maxAmount * 0.25) }}</span>
                        <span>R0</span>
                    </div>
                    
                    <!-- Chart area -->
                    <div class="absolute left-12 right-0 top-0 bottom-8 border-l border-b border-gray-200">
                        <!-- Grid lines -->
                        <div class="absolute inset-0">
                            <div class="absolute top-0 left-0 right-0 border-t border-gray-100"></div>
                            <div class="absolute top-1/4 left-0 right-0 border-t border-gray-100"></div>
                            <div class="absolute top-1/2 left-0 right-0 border-t border-gray-100"></div>
                            <div class="absolute top-3/4 left-0 right-0 border-t border-gray-100"></div>
                        </div>
                        
                        <!-- Line Chart SVG -->
                        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <!-- Electricity Line with gradient fill -->
                            <defs>
                                <linearGradient id="electricityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:rgb(249, 115, 22);stop-opacity:0.3" />
                                    <stop offset="100%" style="stop-color:rgb(249, 115, 22);stop-opacity:0.05" />
                                </linearGradient>
                                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:rgb(59, 130, 246);stop-opacity:0.3" />
                                    <stop offset="100%" style="stop-color:rgb(59, 130, 246);stop-opacity:0.05" />
                                </linearGradient>
                            </defs>
                            
                            <!-- Electricity area fill -->
                            <path 
                                v-if="electricityLinePath"
                                :d="electricityAreaPath" 
                                fill="url(#electricityGradient)"
                                class="transition-all duration-300"
                            />
                            
                            <!-- Water area fill -->
                            <path 
                                v-if="waterLinePath"
                                :d="waterAreaPath" 
                                fill="url(#waterGradient)"
                                class="transition-all duration-300"
                            />
                            
                            <!-- Electricity line -->
                            <path 
                                v-if="electricityLinePath"
                                :d="electricityLinePath" 
                                fill="none" 
                                stroke="rgb(249, 115, 22)" 
                                stroke-width="0.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="transition-all duration-300"
                            />
                            
                            <!-- Water line -->
                            <path 
                                v-if="waterLinePath"
                                :d="waterLinePath" 
                                fill="none" 
                                stroke="rgb(59, 130, 246)" 
                                stroke-width="0.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="transition-all duration-300"
                            />
                            
                            <!-- Data points for Electricity -->
                            <g v-if="electricityLinePath">
                                <circle 
                                    v-for="(point, index) in electricityPoints" 
                                    :key="'e-' + index"
                                    :cx="point.x" 
                                    :cy="point.y" 
                                    r="1"
                                    fill="rgb(249, 115, 22)"
                                    class="cursor-pointer hover:r-1.5 transition-all"
                                    @mouseenter="showLineTooltip(index, 'electricity', dailyChartData[index])"
                                    @mouseleave="hideTooltip"
                                >
                                    <title>R{{ dailyChartData[index].electricity }}</title>
                                </circle>
                            </g>
                            
                            <!-- Data points for Water -->
                            <g v-if="waterLinePath">
                                <circle 
                                    v-for="(point, index) in waterPoints" 
                                    :key="'w-' + index"
                                    :cx="point.x" 
                                    :cy="point.y" 
                                    r="1"
                                    fill="rgb(59, 130, 246)"
                                    class="cursor-pointer hover:r-1.5 transition-all"
                                    @mouseenter="showLineTooltip(index, 'water', dailyChartData[index])"
                                    @mouseleave="hideTooltip"
                                >
                                    <title>R{{ dailyChartData[index].water }}</title>
                                </circle>
                            </g>
                        </svg>
                        
                        <!-- Tooltip -->
                        <div 
                            v-if="tooltipVisible" 
                            class="absolute px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10 pointer-events-none"
                            :style="{ left: tooltipX + '%', top: tooltipY + '%', transform: 'translate(-50%, -120%)' }"
                        >
                            {{ tooltipType === 'electricity' ? 'Electricity' : 'Water' }}: R{{ tooltipValue }}
                        </div>
                    </div>
                    
                    <!-- X-axis labels -->
                    <div class="absolute left-12 right-0 bottom-0 h-8 flex items-center justify-around text-xs text-gray-500">
                        <span v-for="(day, index) in dailyChartData" :key="index">{{ day.label }}</span>
                    </div>
                </div>
                
                <!-- Empty state when no data -->
                <div v-if="dailyChartData.length === 0" class="text-center py-8">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="lucide:bar-chart-3" class="w-8 h-8 text-gray-400" />
                    </div>
                    <p class="text-gray-600 font-medium">No spending data available</p>
                    <p class="text-xs text-gray-400 mt-1">Chart will appear when transactions are available</p>
                </div>
            </div>
        </CardContent>
    </Card>
        

    <!-- Transactions Table -->
    <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden ">
        <CardHeader>
            <CardTitle class="text-lg font-semibold text-gray-800">Transaction History</CardTitle>
            <CardDescription class="text-sm">{{ summary.transactionCount }} transactions found</CardDescription>
        </CardHeader>
        <CardContent class="p-0">
            <div v-if="isLoading" class="py-8 flex justify-center">
                <MyLoader />
            </div>
            <div v-else-if="transactions.length > 0">
                <!-- Desktop Table - Scrollable -->
                <div class="hidden md:block overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                        <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <table class="min-w-[900px] w-full">
                                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[150px]">Date & Time</th>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[150px]">Service</th>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[150px]">Meter Number</th>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[200px]">Reference</th>
                                        <th class="text-right py-3 px-4 text-xs font-semibold text-gray-700 w-[120px]">Amount</th>
                                        <th class="text-center py-3 px-4 text-xs font-semibold text-gray-700 w-[100px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100 bg-white">
                                    <tr v-for="transaction in transactions" 
                                        :key="transaction.id"
                                        class="hover:bg-blue-50/50 transition-colors duration-200"
                                    >
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <p class="text-sm font-medium text-gray-900">{{ formatDate(transaction.createdAt) }}</p>
                                            <p class="text-xs text-gray-500">{{ formatTime(transaction.createdAt) }}</p>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <div class="flex items-center gap-2">
                                                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="getUtilityBg(transaction.utilityType)">
                                                    <Icon :name="getUtilityIcon(transaction.utilityType)" class="w-4 h-4" />
                                                </div>
                                                <span class="text-sm font-medium text-gray-900">{{ transaction.utilityType }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <p class="text-sm text-gray-900 font-mono">{{ transaction.meterNumber }}</p>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <p class="text-sm text-gray-600">{{ transaction.reference || 'N/A' }}</p>
                                        </td>
                                        <td class="py-3 px-4 text-right whitespace-nowrap">
                                            <p class="text-sm font-semibold" :class="getAmountClass(transaction.utilityType)">
                                                R {{ parseFloat(transaction.amount).toFixed(2) }}
                                            </p>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Success
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
        </div>

                <!-- Mobile Cards -->
                <div class="md:hidden divide-y divide-gray-100">
                    <div v-for="transaction in transactions" 
                         :key="transaction.id"
                         class="p-4"
                    >
                        <!-- Collapsed View -->
                        <div 
                            class="flex items-center justify-between cursor-pointer"
                            @click="toggleExpand(transaction.id)"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getUtilityBg(transaction.utilityType)">
                                    <Icon :name="getUtilityIcon(transaction.utilityType)" class="w-5 h-5" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">{{ transaction.utilityType }}</p>
                                    <p class="text-xs text-gray-500">{{ formatDate(transaction.createdAt) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <p class="text-sm font-bold" :class="getAmountClass(transaction.utilityType)">
                                    R {{ parseFloat(transaction.amount).toFixed(2) }}
                                </p>
                                <Icon 
                                    :name="expandedRows.includes(transaction.id) ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                                    class="w-5 h-5 text-gray-400"
                                />
                            </div>
        </div>

                        <!-- Expanded View -->
                        <div v-if="expandedRows.includes(transaction.id)" class="mt-4 space-y-3 bg-gray-50 p-3 rounded-lg">
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Meter Number</span>
                                <span class="text-xs font-medium text-gray-900 font-mono">{{ transaction.meterNumber }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Time</span>
                                <span class="text-xs font-medium text-gray-900">{{ formatTime(transaction.createdAt) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Reference</span>
                                <span class="text-xs font-medium text-gray-900">{{ transaction.reference || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Status</span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    Success
                                </span>
                            </div>
                            <div v-if="transaction.token" class="pt-2 border-t border-gray-200">
                                <span class="text-xs text-gray-600">Token</span>
                                <p class="text-xs font-mono text-gray-900 mt-1 break-all">{{ transaction.token }}</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
            <div v-else class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="lucide:receipt" class="w-8 h-8 text-gray-400" />
    </div>
                <p class="text-gray-600 font-medium">No transactions found</p>
                <p class="text-gray-400 text-sm mt-1">Transactions will appear here when they occur</p>
    </div>
        </CardContent>
    </Card>
</div>
</template>

<script>
import ServiceSelector from '~/components/wallet/ServiceSelector.vue'

definePageMeta({
    layout: 'wallet'
})

  export default {
    components: {
      ServiceSelector
    },
    data() {
      return {
            isLoading: false,
        activeFilter: null,
            selectedService: null,
            transactions: [
                {
                    id: 1,
                    createdAt: '2025-10-08T14:30:00Z',
                    utilityType: 'Electricity',
                    meterNumber: '04567891234',
                    reference: 'TXN-E-20251008-001',
                    amount: 250.00,
                    token: '1234-5678-9012-3456-7890'
                },
                {
                    id: 2,
                    createdAt: '2025-10-07T09:15:00Z',
                    utilityType: 'Water',
                    meterNumber: '98765432101',
                    reference: 'TXN-W-20251007-001',
                    amount: 150.50,
                    token: '9876-5432-1098-7654-3210'
                },
                {
                    id: 3,
                    createdAt: '2025-10-06T16:45:00Z',
                    utilityType: 'Electricity',
                    meterNumber: '04567891234',
                    reference: 'TXN-E-20251006-002',
                    amount: 320.75,
                    token: '5555-6666-7777-8888-9999'
                },
                {
                    id: 4,
                    createdAt: '2025-10-05T11:20:00Z',
                    utilityType: 'Water',
                    meterNumber: '98765432101',
                    reference: 'TXN-W-20251005-001',
                    amount: 95.25,
                    token: '1111-2222-3333-4444-5555'
                },
                {
                    id: 5,
                    createdAt: '2025-10-04T08:30:00Z',
                    utilityType: 'Electricity',
                    meterNumber: '04567891234',
                    reference: 'TXN-E-20251004-001',
                    amount: 180.00,
                    token: '6666-7777-8888-9999-0000'
                },
                {
                    id: 6,
                    createdAt: '2025-10-03T13:10:00Z',
                    utilityType: 'Water',
                    meterNumber: '98765432101',
                    reference: 'TXN-W-20251003-002',
                    amount: 125.00,
                    token: '2222-3333-4444-5555-6666'
                },
                {
                    id: 7,
                    createdAt: '2025-10-02T10:45:00Z',
                    utilityType: 'Electricity',
                    meterNumber: '04567891234',
                    reference: 'TXN-E-20251002-001',
                    amount: 275.50,
                    token: '7777-8888-9999-0000-1111'
                },
                {
                    id: 8,
                    createdAt: '2025-10-01T15:20:00Z',
                    utilityType: 'Water',
                    meterNumber: '98765432101',
                    reference: 'TXN-W-20251001-001',
                    amount: 110.75,
                    token: '3333-4444-5555-6666-7777'
                },
                {
                    id: 9,
                    createdAt: '2025-09-30T12:00:00Z',
                    utilityType: 'Electricity',
                    meterNumber: '04567891234',
                    reference: 'TXN-E-20250930-003',
                    amount: 300.00,
                    token: '8888-9999-0000-1111-2222'
                },
                {
                    id: 10,
                    createdAt: '2025-09-29T09:30:00Z',
                    utilityType: 'Water',
                    meterNumber: '98765432101',
                    reference: 'TXN-W-20250929-001',
                    amount: 85.50,
                    token: '4444-5555-6666-7777-8888'
                }
            ],
            chartData: [],
        summary: {
                totalSpent: '0.00',
                transactionCount: 0
            },
        filterOptions: [
                { key: null, value: "All Transactions" },
                { key: "Electricity", value: "Electricity" },
                { key: "Water", value: "Water" },
        ],
            startDate: null,
            endDate: null,
            expandedRows: [],
            tooltipVisible: false,
            tooltipIndex: null,
            tooltipType: null,
            tooltipX: 0,
            tooltipY: 0,
            tooltipValue: 0
        }
    },
    methods: {
      async fetchTransactionsData() {
        this.isLoading = true;        
        try {
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/history`, {
            params: {
              startDate: this.startDate,
              endDate: this.endDate,
              utilityType: this.activeFilter
            }
          })
          this.transactions = response.transactions.reverse();
          this.summary.totalSpent = Number(response.totalAmount).toFixed(2)
          this.summary.transactionCount = response.totalCount
         
                // Prepare chart data
                this.chartData = this.transactions.map(t => ({
                    transactionDate: t.createdAt,
                    managedTenderAmount: parseFloat(t.amount),
                    utilityType: t.utilityType
                }))

        } catch (error) {
          console.error('Error fetching transactions data:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to load transactions data',
            variant: 'destructive'
          });
        } finally {
          this.isLoading = false;
        }
      },
      
        getUtilityIcon(type) {
            return type === 'Electricity' ? 'lucide:zap' : 'lucide:droplet'
        },

        getUtilityBg(type) {
            return type === 'Electricity' ? 'bg-orange-100' : 'bg-blue-100'
        },

        getAmountClass(type) {
            return type === 'Electricity' ? 'text-orange-600' : 'text-blue-600'
        },

        formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        },

        formatTime(dateString) {
            const date = new Date(dateString)
            return date.toLocaleTimeString('en-ZA', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        },

        formatDateForAPI(rawDate) {
        return rawDate.toISOString().split('T')[0];
      },

        setDateRange(newValue) {
        const startDate = new Date();
        const endDate = new Date();
            if (newValue == '7days') {
          startDate.setDate(endDate.getDate() - 7);
        }
            if (newValue == '30days') {
          startDate.setDate(endDate.getDate() - 30);
        }
            if (newValue == '6months') {
          startDate.setDate(endDate.getDate() - 182);
        }
            if (newValue == '12months') {
          startDate.setDate(endDate.getDate() - 265);
        }
            this.startDate = this.formatDateForAPI(startDate);
        endDate.setDate(endDate.getDate() + 1);
            this.endDate = this.formatDateForAPI(endDate);
        },

        handleFilterUpdate(value) {
            console.log('Filter update:', value)
        },

        handleDateUpdate(value) {
            console.log('Date update:', value)
        },

        toggleExpand(transactionId) {
            const index = this.expandedRows.indexOf(transactionId)
            if (index > -1) {
                this.expandedRows.splice(index, 1)
            } else {
                this.expandedRows.push(transactionId)
            }
        },
        
        showLineTooltip(index, type, day) {
            this.tooltipVisible = true;
            this.tooltipIndex = index;
            this.tooltipType = type;
            
            // Calculate tooltip position
            const dataLength = this.dailyChartData.length;
            this.tooltipX = (index / (dataLength - 1)) * 100;
            
            const value = parseFloat(type === 'electricity' ? day.electricity : day.water);
            this.tooltipValue = value.toFixed(2);
            this.tooltipY = 100 - ((value / this.maxAmount) * 100);
        },
        
        hideTooltip() {
            this.tooltipVisible = false;
            this.tooltipIndex = null;
            this.tooltipType = null;
        },

        handleServiceSelection(service) {
            console.log('Selected service:', service);
            // You can add navigation logic here or emit to parent component
            // For example: navigate to payment page for selected service
        }
    },

    async mounted() {
        this.setDateRange('30days');
        // Calculate summary from sample data
        this.summary.transactionCount = this.transactions.length;
        this.summary.totalSpent = this.transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2);
        
        // Log for debugging
        console.log('Transactions:', this.transactions.length);
        console.log('Daily Chart Data:', this.dailyChartData);
        console.log('Max Amount:', this.maxAmount);
        
        // Uncomment below to fetch real data
        await this.fetchTransactionsData();
    },

    watch: {
        '$store.dateRange'(newValue) {
        this.setDateRange(newValue)
        this.fetchTransactionsData();
      },
        '$store.utilityType'(newValue) {
        this.activeFilter = newValue;
        this.fetchTransactionsData();
        }
    },
    
    computed: {
        dailyChartData() {
            // Group transactions by date
            const groupedByDate = {};
            
            this.transactions.forEach(transaction => {
                const date = new Date(transaction.createdAt);
                const dateKey = date.toISOString().split('T')[0];
                
                if (!groupedByDate[dateKey]) {
                    groupedByDate[dateKey] = {
                        date: dateKey,
                        electricity: 0,
                        water: 0
                    };
                }
                
                if (transaction.utilityType === 'Electricity') {
                    groupedByDate[dateKey].electricity += parseFloat(transaction.amount);
                } else if (transaction.utilityType === 'Water') {
                    groupedByDate[dateKey].water += parseFloat(transaction.amount);
                }
            });
            
            // Convert to array and sort by date
            const chartData = Object.values(groupedByDate)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(day => ({
                    label: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    electricity: day.electricity.toFixed(2),
                    water: day.water.toFixed(2),
                    date: day.date
                }));
            
            // Show last 7 days for better readability on mobile
            return chartData.slice(-7);
        },
        
        maxAmount() {
            if (this.dailyChartData.length === 0) return 100;
            
            const maxElectricity = Math.max(...this.dailyChartData.map(d => parseFloat(d.electricity)));
            const maxWater = Math.max(...this.dailyChartData.map(d => parseFloat(d.water)));
            const max = Math.max(maxElectricity, maxWater);
            
            // Round up to nearest 50
            return Math.ceil(max / 50) * 50;
        },
        
        electricityPoints() {
            return this.dailyChartData.map((day, index) => {
                const x = (index / (this.dailyChartData.length - 1)) * 100;
                const y = 100 - ((parseFloat(day.electricity) / this.maxAmount) * 100);
                return { x, y };
            });
        },
        
        waterPoints() {
            return this.dailyChartData.map((day, index) => {
                const x = (index / (this.dailyChartData.length - 1)) * 100;
                const y = 100 - ((parseFloat(day.water) / this.maxAmount) * 100);
                return { x, y };
            });
        },
        
        electricityLinePath() {
            if (this.electricityPoints.length === 0) return '';
            return this.electricityPoints.map((point, index) => {
                return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
            }).join(' ');
        },
        
        waterLinePath() {
            if (this.waterPoints.length === 0) return '';
            return this.waterPoints.map((point, index) => {
                return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
            }).join(' ');
        },
        
        electricityAreaPath() {
            if (this.electricityPoints.length === 0) return '';
            const linePath = this.electricityLinePath;
            const firstPoint = this.electricityPoints[0];
            const lastPoint = this.electricityPoints[this.electricityPoints.length - 1];
            return `${linePath} L ${lastPoint.x} 100 L ${firstPoint.x} 100 Z`;
        },
        
        waterAreaPath() {
            if (this.waterPoints.length === 0) return '';
            const linePath = this.waterLinePath;
            const firstPoint = this.waterPoints[0];
            const lastPoint = this.waterPoints[this.waterPoints.length - 1];
            return `${linePath} L ${lastPoint.x} 100 L ${firstPoint.x} 100 Z`;
        },
        
        totalSpent() {
            return this.transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2);
        },
        
        averageTransaction() {
            if (this.transactions.length === 0) return '0.00';
            const total = this.transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
            return (total / this.transactions.length).toFixed(2);
        },
        
        electricityTotal() {
            return this.transactions
                .filter(t => t.utilityType === 'Electricity')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        },
        
        waterTotal() {
            return this.transactions
                .filter(t => t.utilityType === 'Water')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        },
        
        highestUtility() {
            const elecTotal = this.electricityTotal;
            const waterTotal = this.waterTotal;
            
            if (elecTotal > waterTotal) {
                return {
                    name: 'Electricity',
                    amount: elecTotal.toFixed(2),
                    icon: 'lucide:zap',
                    bgClass: 'bg-orange-100',
                    iconClass: 'text-orange-600',
                    textClass: 'text-orange-600'
                };
            } else {
                return {
                    name: 'Water',
                    amount: waterTotal.toFixed(2),
                    icon: 'lucide:droplet',
                    bgClass: 'bg-blue-100',
                    iconClass: 'text-blue-600',
                    textClass: 'text-blue-600'
                };
            }
        },
        
        lowestUtility() {
            const elecTotal = this.electricityTotal;
            const waterTotal = this.waterTotal;
            
            if (elecTotal < waterTotal) {
                return {
                    name: 'Electricity',
                    amount: elecTotal.toFixed(2),
                    icon: 'lucide:zap',
                    bgClass: 'bg-orange-100',
                    iconClass: 'text-orange-600',
                    textClass: 'text-orange-600'
                };
            } else {
                return {
                    name: 'Water',
                    amount: waterTotal.toFixed(2),
                    icon: 'lucide:droplet',
                    bgClass: 'bg-blue-100',
                    iconClass: 'text-blue-600',
                    textClass: 'text-blue-600'
                };
            }
        }
    }
  }
  </script>

<style scoped>
/* Custom scrollbar for transaction table */
.scrollbar-thin::-webkit-scrollbar {
    height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    transition: background 0.2s ease;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Firefox scrollbar */
.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>
  