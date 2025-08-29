<template>
    <div class="h-screen flex flex-col overflow-hidden">
        <!-- Main Content Area -->
        <div class="flex-1 p-4 lg:p-6 flex flex-col min-h-0">
            <!-- KPI Cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mb-4 flex-shrink-0">
                <!-- Water Spending -->
                <Card class="relative">
                    <CardHeader class="pb-1 lg:pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-1 lg:gap-2">
                                <Icon name="lucide:droplets" class="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                                <CardTitle class="text-xs lg:text-sm font-medium text-gray-600">Water Spending</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0">
                        <div class="text-lg lg:text-2xl font-bold text-gray-900">R {{ waterSpending }}</div>
                    </CardContent>
                </Card>

                <!-- Electricity Spending -->
                <Card class="relative">
                    <CardHeader class="pb-1 lg:pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-1 lg:gap-2">
                                <Icon name="lucide:zap" class="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
                                <CardTitle class="text-xs lg:text-sm font-medium text-gray-600">Electricity Spending</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0">
                        <div class="text-lg lg:text-2xl font-bold text-gray-900">R {{ electricitySpending }}</div>
                    </CardContent>
                </Card>

                <!-- Total Refunds -->
                <Card class="relative">
                    <CardHeader class="pb-1 lg:pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-1 lg:gap-2">
                                <Icon name="lucide:refresh-cw" class="w-4 h-4 lg:w-5 lg:h-5 text-orange-500" />
                                <CardTitle class="text-xs lg:text-sm font-medium text-gray-600">Total Refunds</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0">
                        <div class="text-lg lg:text-2xl font-bold text-orange-500">R {{ totalRefunds }}</div>
                    </CardContent>
                </Card>

                <!-- KL Vended -->
                <Card class="relative hidden md:block">
                    <CardHeader class="pb-1 lg:pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-1 lg:gap-2">
                                <Icon name="lucide:droplets" class="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                                <CardTitle class="text-xs lg:text-sm font-medium text-gray-600">KL Vended</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0">
                        <div class="text-lg lg:text-2xl font-bold text-blue-500">{{ klVended }} KL</div>
                    </CardContent>
                </Card>

                <!-- Electricity Vended -->
                <Card class="relative hidden lg:block">
                    <CardHeader class="pb-1 lg:pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-1 lg:gap-2">
                                <Icon name="lucide:zap" class="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
                                <CardTitle class="text-xs lg:text-sm font-medium text-gray-600">Electricity Vended</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0">
                        <div class="text-lg lg:text-2xl font-bold text-blue-500">{{ electricityVended }} KWh</div>
                    </CardContent>
                </Card>
            </div>

            <!-- Charts Section -->
            <div class="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
                <!-- Combined Utility Spending Trend Chart -->
                <div class="flex-1 min-h-0 flex flex-col gap-4">
                    <!-- Trend Chart -->
                    <div class="flex-1 min-h-0">
                        <Trend 
                            :transactions="originalTransactions" 
                            title="Utility Spending Trend"
                            description="Track your water and electricity spending over time"
                        />
                    </div>
                    
                 
                </div>
                
                <!-- Today's Transactions Sidebar -->
                <div class="w-full lg:w-96 xl:w-[28rem] flex-shrink-0">
                    <Card class="h-full flex flex-col">
                        <CardHeader class="pb-2 flex-shrink-0">
                            <CardTitle class="text-lg font-semibold">Today's Transactions</CardTitle>
                            <CardDescription>Recent transactions from today</CardDescription>
                        </CardHeader>
                        <CardContent class="flex-1 min-h-0">
                            <div v-if="todayTransactions.length > 0" class="h-full overflow-y-auto custom-scrollbar">
                                <table class="w-full text-xs">
                                    <thead class="sticky top-0 bg-white border-b">
                                        <tr>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700 w-16 lg:w-20">Meter</th>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700">Complex</th>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700 w-20 lg:w-24">Amount</th>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700 w-16 lg:w-20 hidden lg:table-cell">Units</th>
                                            <th class="text-left py-2 px-1 lg:px-2 font-medium text-gray-700 w-14 lg:w-16 hidden lg:table-cell">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-for="(transaction, index) in todayTransactions" :key="transaction.transactionID">
                                            <!-- Main Row -->
                                            <tr 
                                                class="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                                                @click="toggleRowExpansion(index)"
                                            >
                                                <td class="py-2 px-1 lg:px-2 font-medium text-gray-900">
                                                    <div class="truncate max-w-[60px] lg:max-w-[80px]" :title="transaction.meterNumber">
                                                        {{ transaction.meterNumber }}
                                                    </div>
                                                </td>
                                                <td class="py-2 px-1 lg:px-2 text-gray-600">
                                                    <div class="truncate max-w-[80px] lg:max-w-[120px]" :title="transaction.complexName">
                                                        {{ transaction.complexName }}
                                                    </div>
                                                </td>
                                                <td class="py-2 px-1 lg:px-2 font-semibold text-green-600 whitespace-nowrap">R {{ parseFloat(transaction.managedTenderAmount).toFixed(2) }}</td>
                                                <td class="py-2 px-1 lg:px-2 text-gray-600 whitespace-nowrap hidden lg:table-cell">{{ parseFloat(transaction.totalUnitsIssued).toFixed(1) }} {{ transaction.utilityType === 'Water' ? 'KL' : 'KWh' }}</td>
                                                <td class="py-2 px-1 lg:px-2 text-gray-500 whitespace-nowrap hidden lg:table-cell">{{ formattedTime(transaction.transactionDate) }}</td>
                                            </tr>
                                            
                                            <!-- Expanded Details Row -->
                                            <tr v-if="expandedRow === index" class="bg-blue-50 border-b">
                                                <td colspan="5" class="py-3 px-1 lg:px-2">
                                                    <div class="space-y-2">
                                                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                                                            <div>
                                                                <span class="font-medium text-gray-700">Full Meter:</span>
                                                                <div class="text-gray-900">{{ transaction.meterNumber }}</div>
                                                            </div>
                                                            <div>
                                                                <span class="font-medium text-gray-700">Full Complex:</span>
                                                                <div class="text-gray-900">{{ transaction.complexName }}</div>
                                                            </div>
                                                            <div>
                                                                <span class="font-medium text-gray-700">Units:</span>
                                                                <div class="text-gray-900">{{ parseFloat(transaction.totalUnitsIssued).toFixed(1) }} {{ transaction.utilityType === 'Water' ? 'KL' : 'KWh' }}</div>
                                                            </div>
                                                            <div>
                                                                <span class="font-medium text-gray-700">Time:</span>
                                                                <div class="text-gray-900">{{ formattedTime(transaction.transactionDate) }}</div>
                                                            </div>
                                                        </div>
                                                        <div class="flex justify-end pt-2">
                                                            <Button 
                                                                size="sm" 
                                                                @click.stop="viewMeter(transaction.installationUniqueId)"
                                                                class="text-xs"
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
                                    <Icon name="lucide:receipt" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No transactions today</p>
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
            const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetMeterActivity`, {
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
            this.originalTransactions = result.responseData.transactionData
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
                .reduce((sum, t) => sum + (parseFloat(t.managedTenderAmount) - parseFloat(t.commissionAmount) || 0), 0)
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
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
    transition: background-color 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Firefox scrollbar styles */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}

/* Hide scrollbar when not needed */
.custom-scrollbar::-webkit-scrollbar-thumb:vertical {
    min-height: 30px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:horizontal {
    min-width: 30px;
}
</style>