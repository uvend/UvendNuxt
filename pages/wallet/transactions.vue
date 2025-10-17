<template>
<div class="flex flex-col p-4 gap-6">
    <!-- Wallet Card and Meter Spending Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <!-- Wallet Card -->
         
        <WalletDebitCard />
        
        <!-- Meter Spending Chart -->
       
    </div>



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
    <SpendingTrendsChart :transactions="transactions" :isLoading="isLoading" />
        

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
                                            <p class="text-sm font-medium text-gray-900">{{ formatDate(transaction.created) }}</p>
                                            <p class="text-xs text-gray-500">{{ formatTime(transaction.created) }}</p>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border" :class="getUtilityBg(transaction.utilityType)">
                                                    <Icon :name="getUtilityIcon(transaction.utilityType)" class="w-5 h-5" :class="getUtilityIconClass(transaction.utilityType)" />
                                                </div>
                                                <div>
                                                    <span class="text-sm font-semibold text-gray-900">{{ transaction.utilityType }}</span>
                                                    <p class="text-xs text-gray-500">Utility Service</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <p class="text-sm text-gray-900 font-mono">{{ transaction.meterNumber }}</p>
                                            <p v-if="transaction.latestReading && (transaction.latestReading['Remaining Litres'] > 0 || transaction.latestReading['Remaining Credit'] > 0)" class="text-xs text-gray-500 mt-1">
                                                {{ getRemainingUnits(transaction) }}
                                            </p>
                                        </td>
                                      
                                        <td class="py-3 px-4 text-right whitespace-nowrap">
                                            <p class="text-sm font-semibold" :class="getAmountClass(transaction.utilityType)">
                                                R {{ parseFloat(transaction.amount).toFixed(2) }}
                                            </p>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                                                <Icon name="lucide:check-circle" class="w-3 h-3 mr-1" />
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
                                <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border" :class="getUtilityBg(transaction.utilityType)">
                                    <Icon :name="getUtilityIcon(transaction.utilityType)" class="w-6 h-6" :class="getUtilityIconClass(transaction.utilityType)" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">{{ transaction.utilityType }}</p>
                                    <p class="text-xs text-gray-500">{{ formatDate(transaction.created) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <p class="text-sm font-bold" :class="getAmountClass(transaction.utilityType)">
                                    R {{ parseFloat(transaction.amount).toFixed(2) }}
                                </p>
                                <Icon 
                                    :name="expandedRows.includes(transaction.id) ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                                    class="w-5 h-5 text-gray-500 transition-colors duration-200"
                                />
                            </div>
        </div>

                        <!-- Expanded View -->
                        <div v-if="expandedRows.includes(transaction.id)" class="mt-4 space-y-3 bg-gray-50 p-3 rounded-lg">
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Meter Number</span>
                                <span class="text-xs font-medium text-gray-900 font-mono">{{ transaction.meterNumber }}</span>
                            </div>
                            <div
                                v-if="transaction.latestReading && (transaction.latestReading['Remaining Litres'] > 0 || transaction.latestReading['Remaining Credit'] > 0)"
                                class="flex justify-between"
                            >
                                <span class="text-xs text-gray-600">Remaining</span>
                                <span class="text-xs font-medium text-gray-900">{{ getRemainingUnits(transaction) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Time</span>
                                <span class="text-xs font-medium text-gray-900">{{ formatTime(transaction.created) }}</span>
                            </div>
                            
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Status</span>
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                                    <Icon name="lucide:check-circle" class="w-3 h-3 mr-1" />
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
import SpendingTrendsChart from '~/components/wallet/SpendingTrendsChart.vue'
import MeterSpendingChart from '~/components/wallet/MeterSpendingChart.vue'

definePageMeta({
    layout: 'wallet'
})

  export default {
    components: {
      ServiceSelector,
      SpendingTrendsChart,
      MeterSpendingChart
    },
    data() {
      return {
            isLoading: false,
        activeFilter: null,
            selectedService: null,
            transactions: [],
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
            expandedRows: []
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
                    transactionDate: t.created,
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
            return type === 'Electricity' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
        },

        getUtilityIconClass(type) {
            return type === 'Electricity' ? 'text-orange-600' : 'text-blue-600'
        },

        getAmountClass(type) {
            return type === 'Electricity' ? 'text-orange-600' : 'text-blue-600'
        },

        getRemainingUnits(transaction) {
            if (!transaction.latestReading) {
                return '';
            }
            
            if (transaction.utilityType === 'Electricity') {
                const credit = transaction.latestReading["Remaining Credit"];
                if (credit && credit > 0) {
                    return `${(parseFloat(credit) / 1000).toFixed(2)} KWh`;
                }
            } else if (transaction.utilityType === 'Water') {
                const litres = transaction.latestReading["Remaining Litres"];
                if (litres && litres > 0) {
                    return `${(parseFloat(litres) / 1000).toFixed(2)} KL`;
                }
            }
            
            return '';
        },

        formatDate(dateString) {
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    return 'Invalid Date';
                }
                return date.toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (error) {
                console.warn('Error formatting date:', dateString, error);
                return 'Invalid Date';
            }
        },

        formatTime(dateString) {
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    return 'Invalid Time';
                }
                return date.toLocaleTimeString('en-ZA', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            } catch (error) {
                console.warn('Error formatting time:', dateString, error);
                return 'Invalid Time';
            }
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
        totalSpent() {
            if (!this.transactions || this.transactions.length === 0) return '0.00';
            return this.transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2);
        },
        
        averageTransaction() {
            if (!this.transactions || this.transactions.length === 0) return '0.00';
            const total = this.transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
            return (total / this.transactions.length).toFixed(2);
        },
        
        electricityTotal() {
            if (!this.transactions || this.transactions.length === 0) return 0;
            return this.transactions
                .filter(t => t.utilityType === 'Electricity')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        },
        
        waterTotal() {
            if (!this.transactions || this.transactions.length === 0) return 0;
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
  