<template>
    <div class="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <!-- Main Content Area -->
        <div class="flex-1 p-6 lg:p-8 flex flex-col min-h-0">
            <!-- KPI Cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-6 flex-shrink-0">
                <!-- Water Spending -->
                <Card class="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader class="pb-2 relative z-10">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <Icon name="lucide:droplets" class="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                                </div>
                                <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">Water Spending</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0 relative z-10">
                        <div class="text-lg lg:text-2xl font-bold text-gray-900">R {{ waterSpending }}</div>
                    </CardContent>
                </Card>

                <!-- Electricity Spending -->
                <Card class="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader class="pb-2 relative z-10">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                                    <Icon name="lucide:zap" class="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
                                </div>
                                <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">Electricity Spending</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0 relative z-10">
                        <div class="text-lg lg:text-2xl font-bold text-gray-900">R {{ electricitySpending }}</div>
                    </CardContent>
                </Card>

                <!-- Total Refunds -->
                <Card class="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader class="pb-2 relative z-10">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                    <Icon name="lucide:refresh-cw" class="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                                </div>
                                <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">Total Refunds</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0 relative z-10">
                        <div class="text-lg lg:text-2xl font-bold text-orange-600">R {{ totalRefunds }}</div>
                    </CardContent>
                </Card>

                <!-- KL Vended -->
                <Card class="relative hidden md:block bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader class="pb-2 relative z-10">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <Icon name="lucide:droplets" class="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                                </div>
                                <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">KL Vended</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0 relative z-10">
                        <div class="text-lg lg:text-2xl font-bold text-blue-600">{{ klVended }} KL</div>
                    </CardContent>
                </Card>

                <!-- Electricity Vended -->
                <Card class="relative hidden lg:block bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader class="pb-2 relative z-10">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                                    <Icon name="lucide:zap" class="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
                                </div>
                                <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">Electricity Vended</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0 relative z-10">
                        <div class="text-lg lg:text-2xl font-bold text-blue-600">{{ electricityVended }} KWh</div>
                    </CardContent>
                </Card>
            </div>

            <!-- Charts Section -->
            <div class="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-0">
                <!-- Combined Utility Spending Trend Chart -->
                <div class="flex-1 min-h-0 flex flex-col gap-6">
                    <!-- Trend Chart -->
                    <div class="flex-1 min-h-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                        <Trend 
                            :transactions="originalTransactions" 
                            title="Utility Spending Trend"
                            description="Track your water and electricity spending over time"
                        />
                    </div>
                </div>
                
                <!-- Today's Transactions Sidebar -->
                <div class="w-full lg:w-96 xl:w-[28rem] flex-shrink-0">
                    <Card class="h-full flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CardHeader class="pb-3 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <CardTitle class="text-lg font-semibold text-gray-800">Today's Transactions</CardTitle>
                            <CardDescription class="text-gray-600">Recent transactions from today</CardDescription>
                        </CardHeader>
                        <CardContent class="flex-1 min-h-0 p-0">
                            <div v-if="todayTransactions.length > 0" class="h-full overflow-y-auto custom-scrollbar">
                                <table class="w-full text-xs">
                                    <thead class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700 w-16 lg:w-20">Meter</th>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700">Complex</th>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700 w-20 lg:w-24 hidden 2xl::table-cell">Amount</th>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700 w-16 lg:w-20 ">Units</th>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700 w-14 lg:w-16 hidden 2xl::table-cell">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-for="(transaction, index) in todayTransactions" :key="transaction.transactionID">
                                            <!-- Main Row -->
                                            <tr 
                                                class="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                                                @click="toggleRowExpansion(index)"
                                            >
                                                <td class="py-3 px-3 font-medium text-gray-900 group-hover:text-gray-700">
                                                    <div class="truncate max-w-[60px] lg:max-w-[80px]" :title="transaction.meterNumber">
                                                        {{ transaction.meterNumber }}
                                                    </div>
                                                </td>
                                                <td class="py-3 px-3 text-gray-600 group-hover:text-gray-700">
                                                    <div class="truncate max-w-[80px] lg:max-w-[120px]" :title="transaction.complexName">
                                                        {{ transaction.complexName }}
                                                    </div>
                                                </td>
                                                <td class="py-2 px-1 lg:px-2 font-semibold text-green-600 whitespace-nowrap hidden 2xl::table-cell">R {{ parseFloat(transaction.managedTenderAmount).toFixed(2) }}</td>
                                                <td class="py-2 px-1 lg:px-2 text-gray-600 whitespace-nowrap ">{{ parseFloat(transaction.totalUnitsIssued).toFixed(1) }} {{ transaction.utilityType === 'Water' ? 'KL' : 'KWh' }}</td>
                                                <td class="py-2 px-1 lg:px-2 text-gray-500 whitespace-nowrap hidden 2xl::table-cell">{{ formattedTime(transaction.transactionDate) }}</td>
                                            </tr>
                                            
                                            <!-- Expanded Details Row -->
                                            <tr v-if="expandedRow === index" class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                                                <td colspan="5" class="py-4 px-3">
                                                    <div class="space-y-3">
                                                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                                                            <div class="bg-white/60 rounded-lg p-2">
                                                                <span class="font-semibold text-gray-700">Full Meter:</span>
                                                                <div class="text-gray-900 mt-1">{{ transaction.meterNumber }}</div>
                                                            </div>
                                                            <div class="bg-white/60 rounded-lg p-2">
                                                                <span class="font-semibold text-gray-700">Full Complex:</span>
                                                                <div class="text-gray-900 mt-1">{{ transaction.complexName }}</div>
                                                            </div>
                                                            <div class="bg-white/60 rounded-lg p-2">
                                                                <span class="font-semibold text-gray-700">Units:</span>
                                                                <div class="text-gray-900 mt-1">{{ parseFloat(transaction.totalUnitsIssued).toFixed(1) }} {{ transaction.utilityType === 'Water' ? 'KL' : 'KWh' }}</div>
                                                            </div>
                                                            <div class="bg-white/60 rounded-lg p-2">
                                                                <span class="font-semibold text-gray-700">Time:</span>
                                                                <div class="text-gray-900 mt-1">{{ formattedTime(transaction.transactionDate) }}</div>
                                                            </div>
                                                        </div>
                                                        <div class="flex justify-end pt-2">
                                                            <Button 
                                                                size="sm" 
                                                                @click.stop="viewMeter(transaction.meterNumber)"
                                                                class="text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                                            >
                                                                <Icon name="lucide:eye" class="w-3 h-3 mr-1" />
                                                                View Meter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="flex items-center justify-center h-full text-gray-500">
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Icon name="lucide:receipt" class="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p class="text-gray-600 font-medium">No transactions today</p>
                                    <p class="text-gray-400 text-sm mt-1">Transactions will appear here when they occur</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Trend from '~/components/my/charts/Trend.vue'
import ComplexSpendingBar from '~/components/my/charts/ComplexSpendingBar.vue'

definePageMeta({
    layout: 'my'
})

export default {
    components: {
        Trend,
        ComplexSpendingBar
    },
    data() {
        return {
            originalTransactions: [], // Store original unfiltered data
            dateRange: null,
            selectedTransaction: null,
            expandedRow: null, // Track expanded row index
        }
    },
    methods: {
        async getAdminTransactions() {
            const result = await useAuthFetch(`${STATEMENT_API}/statement/GetDBMeterActivitySummarised`, {
                method: "GET",
                params: {
                    IncludeMetersWithNoActivity: false,
                    StartDate: this.dateRange.start,
                    EndDate: this.dateRange.end,
                    ReportParentType: 4,  // customer
                    ResponseFormatType: 0,
                    ParentUniqueID: this.$route.params.customer_id,
                    UtilityType: -1
                }
            })
            
            // Clear existing transactions
            this.originalTransactions = []
            
            // Extract all transactions from all meters
            for (const [meterNumber, meterData] of Object.entries(result.data.transactionData)) {
                if (meterData.transactions && Array.isArray(meterData.transactions)) {
                    meterData.transactions.forEach(transaction => {
                        this.originalTransactions.push({
                            ...transaction,
                            meterNumber: transaction.meternumber || meterNumber,
                            complexName: transaction.complexDescription || 'Unknown',
                            utilityType: transaction.utilitytype === 1 ? 'Water' : 'Electricity',
                            managedTenderAmount: transaction.tenderedamount || 0,
                            totalUnitsIssued: transaction.totalunitsissued || 0,
                            transactionDate: transaction.row_creation_date || new Date().toISOString(),
                            transactionID: transaction.uniqueidentification || Date.now()
                        })
                    })
                }
            }
        },
        async getVendTransactions() {
            const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterReport`, {
                method: "GET",
                params: {
                    StartDate: this.dateRange.start,
                    EndDate: this.dateRange.end,
                    VendTransactionReportType: 0,  // customer
                    UtilityType: -1
                }
            })
            this.originalTransactions = result.responseData.transactionData
        },
        getTransactions() {
            if (localStorage.getItem('customer') === 'admin') {
                this.getAdminTransactions()
            } else {
                this.getVendTransactions()
            }
        },
        selectTransaction(transaction) {
            this.selectedTransaction = transaction
        },
        toggleRowExpansion(index) {
            this.expandedRow = this.expandedRow === index ? null : index;
        },
        viewMeter(meterNumber) {
            navigateTo(`/my/${this.$route.params.customer_id}/meters/${meterNumber}`);
        },
        formattedTime(dateString) {
            const date = new Date(dateString)
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            })
        }
    },
    async mounted() {
        const today = new Date()
        const lastMonth = new Date()
        lastMonth.setDate(today.getDate() - 30)
        this.dateRange = {
            start: lastMonth.toISOString(),
            end: today.toISOString()
        }
        await this.getTransactions()
    },
    computed: {
        waterSpending() {
            return this.originalTransactions
                .filter(t => t.utilityType === 'Water')
                .reduce((sum, t) => sum + (parseFloat(t.managedTenderAmount) || 0), 0)
                .toFixed(2);
        },
        electricitySpending() {
            return this.originalTransactions
                .filter(t => t.utilityType === 'Electricity')
                .reduce((sum, t) => sum + (parseFloat(t.managedTenderAmount) || 0), 0)
                .toFixed(2);
        },
        totalRefunds() {
            return this.originalTransactions
                .reduce((sum, t) => sum + (parseFloat(t.managedTenderAmount) || 0), 0)
                .toFixed(2);
        },
        klVended() {
            try {
                if (!this.originalTransactions || !Array.isArray(this.originalTransactions)) {
                    return '0.0';
                }
                return this.originalTransactions
                    .filter(t => t && t.utilityType === 'Water')
                    .reduce((sum, t) => sum + (parseFloat(t.totalUnitsIssued) || 0), 0)
                    .toFixed(1);
            } catch (error) {
                console.error('Error in klVended:', error);
                return '0.0';
            }
        },
        electricityVended() {
            try {
                if (!this.originalTransactions || !Array.isArray(this.originalTransactions)) {
                    return '0.0';
                }
                return this.originalTransactions
                    .filter(t => t && t.utilityType === 'Electricity')
                    .reduce((sum, t) => sum + (parseFloat(t.totalUnitsIssued) || 0), 0)
                    .toFixed(1);
            } catch (error) {
                console.error('Error in electricityVended:', error);
                return '0.0';
            }
        },
        todayTransactions() {
            if (!this.originalTransactions || !Array.isArray(this.originalTransactions)) {
                return []
            }
            
            const today = new Date()
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
            
            return this.originalTransactions
                .filter(transaction => {
                    const transactionDate = new Date(transaction.transactionDate)
                    return transactionDate >= todayStart && transactionDate <= todayEnd
                })
                .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)) // Most recent first
        }
    },
    watch: {
        dateRange: {
            handler(newRange, oldRange) {
                if (newRange && oldRange &&
                    (newRange.start !== oldRange.start || newRange.end !== oldRange.end)) {
                    this.getTransactions();
                }
            },
            deep: true
        }
    }
}
</script>

<style scoped>
/* Custom Scrollbar Styles */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.5);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(203, 213, 225, 0.8);
    border-radius: 4px;
    transition: all 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.9);
}

/* Firefox scrollbar styles */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(203, 213, 225, 0.8) rgba(241, 245, 249, 0.5);
}

/* Hide scrollbar when not needed */
.custom-scrollbar::-webkit-scrollbar-thumb:vertical {
    min-height: 30px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:horizontal {
    min-width: 30px;
}

/* Card hover animations */
.card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
    transform: translateY(-2px);
}

/* Table row animations */
.table-row {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient text effect */
.gradient-text {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
</style>