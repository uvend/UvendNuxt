<template>
    <div class="flex min-h-screen">
        <!-- Main Content Area -->
        <div class="flex-1 p-6 flex flex-col">
            <!-- Header -->
             <div class="mb-6">
                <Button 
                    @click="router.back()"
                    class=" bg-blue-600 hover:bg-blue-700 mb-3"
                >
                    <Icon name="lucide:arrow-left" class="w-3 h-4" />
                    Back 
                </Button>
                 <h1 class="text-3xl font-bold text-gray-900 my-3">Meter Details</h1>
                 <p class="text-gray-600 " v-if="meterNumber">Meter: {{ meterNumber }}</p>
            </div>

             <!-- Search Bar and View Toggle -->
             <div class="mb-6 flex items-center gap-4">
                 <div class="relative w-1/2">
                     <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                     <Input 
                         type="text" 
                         placeholder="Search transactions..." 
                         class="pl-10"
                         v-model="search"
                         @input="debouncedSearch"
                     />
                 </div>
                <!-- <Button class="flex">
                    Download Report
                    <Icon name="lucide:printer"/>
                </Button> -->
             </div>

             <!-- Transaction Table View -->
             <div v-if="!showCharts" class="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                 <!-- Table Header -->
                 <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
                     <div class="flex justify-between items-center">
                         <div>
                             <h2 class="text-xl font-semibold text-gray-800">Recent Transactions</h2>
                             <p class="text-gray-600 text-sm">Meter transaction history and details</p>
                         </div>
                         <div class="text-right">
                             <div class="text-sm text-gray-600">Total Records</div>
                             <div class="text-2xl font-bold text-blue-600">{{ filteredTransactions.length }}</div>
                             <div class="text-xs text-gray-500 mt-1">Currently Shown: {{ displayedTransactions.length }}</div>
                         </div>
                     </div>
                 </div>

                 <!-- Table Content -->
                 <div class="overflow-auto custom-scrollbar" style="max-height: 600px;">
                     <table class="w-full">
                         <thead class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-b border-gray-200">
                             <tr>
                                 <th class="text-left py-4 px-6 font-semibold text-gray-700">ID</th>
                                 <th class="text-left py-4 px-6 font-semibold text-gray-700">Meter Number</th>
                                 <th class="text-left py-4 px-6 font-semibold text-gray-700">Complex</th>
                                 <th class="text-left py-4 px-6 font-semibold text-gray-700">Units Issued</th>
                                 <th class="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                                 <th class="text-left py-4 px-6 font-semibold text-gray-700">Service Fee</th>
                                 <th class="text-left py-4 px-6 font-semibold text-gray-700">Refund</th>
                                 <th class="text-left py-4 px-6 font-semibold text-gray-700">Time</th>
                             </tr>
                         </thead>
                         <tbody>
                             <tr v-for="(transaction,index) in displayedTransactions" :key="transaction.meterNumber" :data-transaction-id="transaction.meterNumber" :class="['border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 group', selectedTransaction && selectedTransaction.transactionUniqueId === transaction.transactionUniqueId ? 'bg-blue-100/80 border-blue-200' : '']" @click="selectTransaction(transaction)">
                                 <td class="py-4 px-6 text-sm font-medium text-gray-900 group-hover:text-gray-700">{{ transaction.transactionUniqueId }}</td>
                                 <td class="py-4 px-6 text-sm font-medium text-gray-900 group-hover:text-gray-700">{{ transaction.meterNumber }}</td>
                                 <td class="py-4 px-6 text-sm text-gray-700 group-hover:text-gray-700">
                                    {{ transaction.complexName }}
                                    <p class="text-gray-500">{{ transaction.address0 }}</p>
                                </td>
                                 <td class="py-4 px-6 text-sm text-gray-600 group-hover:text-gray-700">
                                     <span class="font-medium">{{ transaction.totalUnitsIssued }}</span>
                                     <span v-if="transaction.utilityType === 'Water'" class="text-blue-600">KL</span>
                                     <span v-else-if="transaction.utilityType === 'Electricity'" class="text-yellow-600">KWh</span>
                                 </td>
                                 <td class="py-4 px-6 text-sm font-semibold text-green-600 group-hover:text-green-700">R {{ transaction.managedTenderAmount }}</td>
                                 <td class="py-4 px-6 text-sm text-gray-600 group-hover:text-gray-700">R {{ transaction.commissionAmountEx }}</td>
                                 <td class="py-4 px-6 text-sm font-semibold text-orange-600 group-hover:text-orange-700">R {{ (parseFloat(transaction.managedTenderAmount) - parseFloat(transaction.commissionAmount)).toFixed(2) }}</td>
                                 <td class="py-4 px-6 text-sm text-gray-500 group-hover:text-gray-600">
                                     <div class="font-medium">{{ formattedTime(transaction.transactionDate) }}</div>
                                     <div class="text-xs text-gray-400">{{ formatedDate(transaction.transactionDate) }}</div>
                                 </td>
                             </tr>
                         </tbody>
                     </table>
                 </div>
                 
                 <!-- Load More Button - Always visible at the end -->
                 <div v-if="hasMoreTransactions" class="p-6 border-t border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-50 to-gray-100">
                     <div class="flex justify-center">
                         <Button @click="loadMore" class="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2">
                             <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                             Load More ({{ remainingTransactions }} remaining)
                         </Button>
                     </div>
                 </div>
             </div>
        </div>

        <!-- Right Sidebar -->
         <div class="w-64 bg-white border-l border-gray-200 p-6 overflow-y-auto custom-scrollbar">
            <!-- Filters Section -->
            <div v-if="!showTransactionDetails" class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                
                <!-- Date Range -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Date Range</Label>
                    <div class="space-y-2">
                        <Select v-model="selectedDateRange" @update:model-value="onDateRangeChange">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Select date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lastDay">Last Day</SelectItem>
                                <SelectItem value="lastWeek">Last Week</SelectItem>
                                <SelectItem value="lastMonth">Last Month</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>
                        <div v-if="selectedDateRange === 'custom'" class="space-y-2">
                            <div>
                                <Label class="text-xs text-gray-500 mb-1 block">Start Date</Label>
                                <Input 
                                    type="date" 
                                    v-model="startDate"
                                    class="w-full"
                                    @change="updateDateRange"
                                />
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500 mb-1 block">End Date</Label>
                                <Input 
                                    type="date" 
                                    v-model="endDate"
                                    class="w-full"
                                    @change="updateDateRange"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Type -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Type</Label>
                    <Select v-model="selectedUtility">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Electricity & Water" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="utility in utilityType" :key="utility.value" :value="utility.value">
                                {{ utility.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Complex -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Complex</Label>
                    <Select v-model="selectedMeterComplex">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select complex" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="complex in meterComplexes" :key="complex" :value="complex">
                                {{ complex }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Load More Amount -->
                <div class="mb-6">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Load More Amount</Label>
                    <Select v-model="pageSize">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="25 records" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="size in pageSizeSelect" :key="size" :value="size">
                                {{ size }} records
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Block Meter Button -->
                <div class="mb-6">
                    <Button 
                        @click="blockMeter(!meterStatus)" 
                        :variant="meterStatus ? 'destructive' : 'default'"
                        class="w-full"
                    >
                        <Icon :name="meterStatus ? 'lucide:unlock' : 'lucide:lock'" class="w-4 h-4 mr-2" />
                        {{ meterStatus ? 'Unblock Meter' : 'Block Meter' }}
                    </Button>
                </div>

                <!-- Reset Tamper Button -->
                <div class="mb-6">
                    <Button 
                        @click="resetTamper()"
                        class="w-full"
                    >
                        <Icon name="lucide:refresh-ccw" class="w-4 h-4 mr-2" />
                        Reset Tamper
                    </Button>
                </div>

                <!-- Action Buttons -->
                 <div class="flex gap-2">
                     <Button variant="outline" @click="clearFilters" class="flex-1">
                         Clear
                     </Button>
                     <Button @click="applyFilters" class="flex-1 bg-blue-600 hover:bg-blue-700">
                         Apply
                     </Button>
                 </div>
                 
                 <!-- Go to Transaction Button (only when transaction is selected) -->
                 <div v-if="selectedTransaction" class="mt-2">
                     <Button 
                         @click="goToTransaction" 
                         variant="outline"
                         class="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                     >
                         <Icon name="lucide:arrow-right" class="w-4 h-4" />
                         <span class="text-sm font-medium">Go to Selected Transaction</span>
                     </Button>
                 </div>
            </div>

            <!-- Transaction Details Section -->
            <div v-if="showTransactionDetails">
                <div class="flex items-center mb-4">
                    <button 
                        @click="showTransactionDetails = false" 
                        class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <Icon name="lucide:arrow-left" class="w-4 h-4" />
                        <span class="text-sm font-medium">Back to Filters</span>
                    </button>
                </div>
                
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                <Card>
                    <CardContent class="pt-6">
                        <div class="space-y-3" v-if="selectedTransaction">
                            <div>
                                <Label class="text-xs text-gray-500">Vendor</Label>
                                <p class="text-sm font-medium">{{ selectedTransaction.vendorName || 'N/A' }}</p>
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500">Utility Type</Label>
                                <p class="text-sm">{{ selectedTransaction.utilityType }}</p>
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500">Amount</Label>
                                <p class="text-sm font-medium">R {{ selectedTransaction.managedTenderAmount }}</p>
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500">Units</Label>
                                <p class="text-sm">{{ selectedTransaction.totalUnitsIssued }}</p>
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500">Free Units</Label>
                                <p class="text-sm">{{ selectedTransaction.freeUnits || '0' }}</p>
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500">Other</Label>
                                <p class="text-sm">R {{ selectedTransaction.commissionAmountEx || '0.00' }}</p>
                            </div>
                            <div class="border-t pt-3">
                                <Label class="text-xs text-gray-500 font-semibold">Total</Label>
                                <p class="text-sm font-bold">R {{ selectedTransaction.managedTenderAmount }}</p>
                            </div>
                            <div v-if="selectedTransaction.tokenNumbers && selectedTransaction.tokenNumbers.length > 0">
                                <Label class="text-xs text-gray-500">Token</Label>
                                <div class="bg-gray-100 p-2 rounded text-xs font-mono">
                                    <span v-for="token in selectedTransaction.tokenNumbers" :key="token">
                                        {{ addHyphens(token) }}
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div v-else class="text-center text-gray-500 py-8">
                            <p>Select a transaction to view details</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup>
import _ from 'lodash';

definePageMeta({
    layout: 'my'
})

const route = useRoute()
const router = useRouter()
const { $toast } = useNuxtApp()

// Reactive data
const isLoading = ref(true)
const meterTransactions = ref([])
const originalTransactions = ref([])
const filteredTransactions = ref([])
const displayedTransactions = ref([])
const dateRange = ref(null)
const startDate = ref(null)
const endDate = ref(null)
const selectedDateRange = ref('lastMonth')
const pageSize = ref(25)
const pageSizeSelect = ref([10, 25, 50, 100])
const currentPage = ref(1)
const meterNumber = ref(null)
const meterInfo = ref(null)
const meterStatus = ref(null)
const isOpen = ref(false)
const printJob = ref(null)
const tooltipVisible = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)
const tooltipValue = ref('')
const search = ref('')
const searchActive = ref(false)
const selectedUtility = ref(-1)
const utilityType = ref([
    { label: "Any", value: -1 },
    { label: "Electricity", value: 0 },
    { label: "Water", value: 1 }
])
const meterComplexes = ref([])
const selectedMeterComplex = ref(null)
const selectedTransaction = ref(null)
const showTransactionDetails = ref(false)
const showCharts = ref(false)

// Methods
const getAdminMeterActivity = async () => {
    try {
        isLoading.value = true
        const result = await useAuthFetch(`${STATEMENT_API}/statement/GetDBMeterActivitySummarised`, {
            method: "GET",
            params: {
                StartDate: dateRange.value.start,
                EndDate: dateRange.value.end,
                ResponseFormatType: 0,
                ReportParentType: 6, //specific meter
                ParentUniqueID: route.params.meter_id,
                UtilityType: -1
            }
        })
        
        // Clear existing transactions
        meterTransactions.value = []
        originalTransactions.value = []
        
        // Extract all transactions from all meters
        for (const [meterNumber, meterData] of Object.entries(result.data.transactionData)) {
            if (meterData.transactions && Array.isArray(meterData.transactions)) {
                meterData.transactions.forEach(transaction => {
                    const flattenedTransaction = {
                        ...transaction,
                        meterNumber: transaction.meternumber || meterNumber,
                        complexName: transaction.complexDescription || 'Unknown',
                        address: transaction.address0 || 'Unknown',
                        utilityType: transaction.utilitytype === 1 ? 'Water' : 'Electricity',
                        managedTenderAmount: transaction.tenderedamount || 0,
                        totalUnitsIssued: transaction.totalunitsissued || 0,
                        transactionDate: transaction.row_creation_date || new Date().toISOString(),
                        transactionID: transaction.uniqueidentification || Date.now(),
                        transactionUniqueId: transaction.uniqueidentification || Date.now(),
                        commissionAmount: transaction.vendCommissionAmount || 0,
                        commissionAmountEx: transaction.vendCommissionAmount || 0
                    }
                    meterTransactions.value.push(flattenedTransaction)
                    originalTransactions.value.push(flattenedTransaction)
                })
            }
        }
        
        filteredTransactions.value = JSON.parse(JSON.stringify(originalTransactions.value))
        // Sort by date (latest to oldest)
        filteredTransactions.value.sort((a, b) => {
            const dateA = new Date(a.transactionDate || 0);
            const dateB = new Date(b.transactionDate || 0);
            return dateB - dateA; // Latest first
        });
        displayedTransactions.value = filteredTransactions.value.slice(0, pageSize.value)
        console.log('Admin meter transactions:', result)
        meterNumber.value = meterTransactions.value[0]?.meterNumber ?? ''
        await getMeterComplex()
        isLoading.value = false
    } catch (error) {
        console.error('Error fetching admin meter activity:', error)
        $toast({
            title: 'API Error',
            description: 'Unable to fetch meter data. Please try again later.',
            variant: "destructive"
        })
        meterTransactions.value = []
        isLoading.value = false
    }
}

const getVendMeterActivity = async () => {
    try {
        isLoading.value = true
        const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterReport`, {
            method: "GET",
            params: {
                StartDate: dateRange.value.start,
                EndDate: dateRange.value.end,
                HasMeterIdentifier: true,
                SpecificMeterIdentifier: route.params.meter_id,
                UtilityType: selectedUtility.value
            }
        })
        
        // Clear existing transactions
        meterTransactions.value = []
        originalTransactions.value = []
        
        // Extract all transactions from all meters
        for (const [meterNumber, meterData] of Object.entries(result.responseData.transactionData)) {
            if (meterData.transactions && Array.isArray(meterData.transactions)) {
                meterData.transactions.forEach(transaction => {
                    const flattenedTransaction = {
                        ...transaction,
                        meterNumber: transaction.meternumber || meterNumber,
                        complexName: transaction.complexDescription || 'Unknown',
                        utilityType: transaction.utilitytype === 1 ? 'Water' : 'Electricity',
                        managedTenderAmount: transaction.tenderedamount || 0,
                        totalUnitsIssued: transaction.totalunitsissued || 0,
                        transactionDate: transaction.row_creation_date || new Date().toISOString(),
                        transactionID: transaction.uniqueidentification || Date.now(),
                        transactionUniqueId: transaction.uniqueidentification || Date.now(),
                        commissionAmount: transaction.vendCommissionAmount || 0,
                        commissionAmountEx: transaction.vendCommissionAmount || 0
                    }
                    meterTransactions.value.push(flattenedTransaction)
                    originalTransactions.value.push(flattenedTransaction)
                })
            }
        }
        
        filteredTransactions.value = JSON.parse(JSON.stringify(originalTransactions.value))
        // Sort by date (latest to oldest)
        filteredTransactions.value.sort((a, b) => {
            const dateA = new Date(a.transactionDate || 0);
            const dateB = new Date(b.transactionDate || 0);
            return dateB - dateA; // Latest first
        });
        displayedTransactions.value = filteredTransactions.value.slice(0, pageSize.value)
        await getMeterComplex()
        isLoading.value = false
    } catch (error) {
        console.error('Error fetching vend meter activity:', error)
        isLoading.value = false
    }
}

const getMeterActivity = async () => {
    if (localStorage.getItem('customer') === 'admin') {
        await getAdminMeterActivity()
    } else {
        await getVendMeterActivity()
    }
}

const getMeterInfo = async () => {
    try {
        if (!meterNumber.value || localStorage.getItem('customer') === 'admin') {
            return
        }
        
        const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterInfo`, {
            method: "GET",
            params: {
                "MeterNumber": meterNumber.value,
                "ApiUserParams.TerminalID": VEND_TerminalID,
                "ApiUserParams.OperatorID": VEND_OperatorID,
                "ApiUserParams.RequestID": new Date()
            }
        })
        console.log('Meter info:', result)
        meterInfo.value = result
        meterStatus.value = result.requestedMeterState
    } catch (error) {
        console.error('Error fetching meter info:', error)
    }
}

const blockMeter = async (state = true) => {
    try {
        const response = await useAuthFetch(`${VEND_URL}/MeterVend/SetMeterBlockState`, {
            method: "GET",
            params: {
                "Block": state,
                "MeterNumber": meterNumber.value,
                "ApiUserParams.TerminalID": VEND_TerminalID,
                "ApiUserParams.OperatorID": VEND_OperatorID,
                "ApiUserParams.RequestID": new Date()
            }
        })
        meterStatus.value = response.requestedMeterState
        $toast({
            title: 'Success',
            description: `Meter ${state ? 'blocked' : 'unblocked'} successfully`,
            variant: "success"
        })
    } catch (error) {
        console.error('Error blocking meter:', error)
        $toast({
            title: 'Error',
            description: 'Failed to update meter status',
            variant: "destructive"
        })
    }
}

const resetTamper = _.debounce(async () => {
    try {
        const response = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterTamperToken`, {
            method: "GET",
            params: {
                "MeterNumber": meterNumber.value,
                "ApiUserParams.TerminalID": VEND_TerminalID,
                "ApiUserParams.OperatorID": VEND_OperatorID,
                "ApiUserParams.RequestID": new Date()
            }
        })
        console.log('Reset response:', response)
        printJob.value = response.listOfTokenTransactions[0].tokens[0].delimitedTokenNumber
        isOpen.value = true
    } catch (error) {
        console.error('Error resetting tamper:', error)
    }
}, 300)

const copy = async () => {
    try {
        await navigator.clipboard.writeText(printJob.value)
        $toast({
            title: 'Copied!',
            description: 'Token copied to clipboard',
            variant: "success"
        })
    } catch (err) {
        console.error('Failed to copy: ', err)
        $toast({
            title: 'Copy Failed',
            description: 'Failed to copy token to clipboard',
            variant: "destructive"
        })
    }
}

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const showTooltip = (point, event) => {
    tooltipVisible.value = true
    tooltipX.value = point.x
    tooltipY.value = point.y - 40
    tooltipValue.value = point.label
}

const hideTooltip = () => {
    tooltipVisible.value = false
}

const loadMore = () => {
    // Add more transactions to the displayed list
    const startIndex = displayedTransactions.value.length;
    const endIndex = startIndex + pageSize.value;
    const newTransactions = filteredTransactions.value.slice(startIndex, endIndex);
    
    // Append new transactions to the displayed list
    displayedTransactions.value = [...displayedTransactions.value, ...newTransactions];
}

const clearFilters = () => {
    selectedUtility.value = -1
    selectedMeterComplex.value = null
    search.value = ''
    currentPage.value = 1
    // Reset date range dropdown and inputs to last month
    selectedDateRange.value = 'lastMonth'
    const today = new Date()
    const lastMonth = new Date()
    lastMonth.setDate(today.getDate() - 30)
    startDate.value = lastMonth.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
    updateDateRange()
    filteredTransactions.value = []
    nextTick(() => {
        filteredTransactions.value = JSON.parse(JSON.stringify(originalTransactions.value))
        // Sort by date (latest to oldest)
        filteredTransactions.value.sort((a, b) => {
            const dateA = new Date(a.transactionDate || 0);
            const dateB = new Date(b.transactionDate || 0);
            return dateB - dateA; // Latest first
        });
        displayedTransactions.value = filteredTransactions.value.slice(0, pageSize.value)
    })
    meterTransactions.value = JSON.parse(JSON.stringify(originalTransactions.value))
}

const applyFilters = () => {
    currentPage.value = 1
    filteredTransactions.value = []
    nextTick(() => {
        performFiltering()
    })
}

const performFiltering = () => {
    console.log('Performing filtering:', {
        total: originalTransactions.value.length,
        selectedUtility: selectedUtility.value,
        selectedMeterComplex: selectedMeterComplex.value,
        search: search.value
    })
    
    let filteredData = JSON.parse(JSON.stringify(originalTransactions.value))

    if (selectedMeterComplex.value) {
        filteredData = filteredData.filter(transaction => {
            return transaction.complexName === selectedMeterComplex.value
        })
    }

    if (selectedUtility.value !== -1) {
        filteredData = filteredData.filter(transaction => {
            if (selectedUtility.value === 0) {
                return transaction.utilityType === 'Electricity'
            } else if (selectedUtility.value === 1) {
                return transaction.utilityType === 'Water'
            }
            return true
        })
    }

    if (search.value && search.value.trim() !== '') {
        filteredData = filteredData.filter(transaction => {
            const searchLower = search.value.toLowerCase()
            const meterNumber = transaction.meterNumber ? transaction.meterNumber.toLowerCase() : ''
            const address = transaction.installationAdress && transaction.installationAdress[0] ? transaction.installationAdress[0].toLowerCase() : ''
            
            return meterNumber.includes(searchLower) || address.includes(searchLower)
        })
    }
    
    // Sort by date (latest to oldest)
    filteredData.sort((a, b) => {
        const dateA = new Date(a.transactionDate || 0);
        const dateB = new Date(b.transactionDate || 0);
        return dateB - dateA; // Latest first
    });
    
    filteredTransactions.value = []
    nextTick(() => {
        filteredTransactions.value = JSON.parse(JSON.stringify(filteredData))
        displayedTransactions.value = filteredTransactions.value.slice(0, pageSize.value)
        console.log('Filtered results:', filteredTransactions.value.length)
    })
}

const debouncedSearch = () => {
    currentPage.value = 1
    performFiltering()
}

const selectTransaction = (transaction) => {
    selectedTransaction.value = transaction
    showTransactionDetails.value = true
}

const goToTransaction = () => {
    showTransactionDetails.value = true
}

const addHyphens = (str) => {
    return str.replace(/(.{4})/g, '$1-').slice(0, -1)
}

const getMeterComplex = () => {
    const complexSet = new Set()
    if (originalTransactions.value && originalTransactions.value.length > 0) {
        originalTransactions.value.forEach((meter) => {
            const complexName = meter.complexName
            if (complexName) {
                complexSet.add(complexName)
            }
        })
    }
    meterComplexes.value = Array.from(complexSet).sort()
}

const formattedTime = (dateString) => {
    const date = new Date(dateString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
}

const formatedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

// Date handling methods
const updateDateRange = () => {
    if (startDate.value && endDate.value) {
        dateRange.value = {
            start: new Date(startDate.value).toISOString(),
            end: new Date(endDate.value).toISOString()
        }
    }
}

const onDateRangeChange = (value) => {
    const today = new Date()
    let start, end
    switch (value) {
        case 'lastDay':
            start = new Date(today)
            start.setDate(today.getDate() - 1)
            end = new Date(today)
            break
        case 'lastWeek':
            start = new Date(today)
            start.setDate(today.getDate() - 7)
            end = new Date(today)
            break
        case 'lastMonth':
            start = new Date(today)
            start.setDate(today.getDate() - 30)
            end = new Date(today)
            break
        case 'custom':
            return
        default:
            return
    }
    startDate.value = start.toISOString().split('T')[0]
    endDate.value = end.toISOString().split('T')[0]
    updateDateRange()
}

const setToday = () => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    startDate.value = todayStr
    endDate.value = todayStr
    updateDateRange()
}

// Computed properties
const totalPages = computed(() => {
    return Math.ceil(filteredTransactions.value.length / pageSize.value)
})

const paginated = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return filteredTransactions.value.slice(startIndex, endIndex)
})

const hasMoreTransactions = computed(() => {
    return displayedTransactions.value.length < filteredTransactions.value.length
})

const remainingTransactions = computed(() => {
    return filteredTransactions.value.length - displayedTransactions.value.length
})

const chartData = computed(() => {
    if (!meterTransactions.value.length) return []
    
    console.log('Raw transactions:', meterTransactions.value)
    
    // Log the first transaction to see its structure
    if (meterTransactions.value.length > 0) {
        console.log('First transaction structure:', JSON.stringify(meterTransactions.value[0], null, 2))
    }
    
    // Group transactions by date and sum amounts
    const grouped = {}
    meterTransactions.value.forEach((transaction, index) => {
        console.log(`Processing transaction ${index}:`, transaction)
        
        // Handle different date field names and formats
        let dateStr = null
        if (transaction.transactionDate) {
            dateStr = new Date(transaction.transactionDate).toLocaleDateString()
            console.log(`Using transactionDate: ${transaction.transactionDate} -> ${dateStr}`)
        } else if (transaction.date) {
            dateStr = new Date(transaction.date).toLocaleDateString()
            console.log(`Using date: ${transaction.date} -> ${dateStr}`)
        } else if (transaction.createdDate) {
            dateStr = new Date(transaction.createdDate).toLocaleDateString()
            console.log(`Using createdDate: ${transaction.createdDate} -> ${dateStr}`)
        } else {
            console.log('No date field found in transaction:', Object.keys(transaction))
        }
        
        // Handle different amount field names
        let amount = 0
        if (transaction.tenderedAmount) {
            amount = parseFloat(transaction.tenderedAmount) || 0
            console.log(`Using tenderedAmount: ${transaction.tenderedAmount} -> ${amount}`)
        } else if (transaction.transactionAmount) {
            amount = parseFloat(transaction.transactionAmount) || 0
            console.log(`Using transactionAmount: ${transaction.transactionAmount} -> ${amount}`)
        } else if (transaction.amount) {
            amount = parseFloat(transaction.amount) || 0
            console.log(`Using amount: ${transaction.amount} -> ${amount}`)
        } else if (transaction.vendAmount) {
            amount = parseFloat(transaction.vendAmount) || 0
            console.log(`Using vendAmount: ${transaction.vendAmount} -> ${amount}`)
        } else {
            console.log('No amount field found in transaction:', Object.keys(transaction))
        }
        
        if (dateStr && amount > 0) {
            if (!grouped[dateStr]) {
                grouped[dateStr] = 0
            }
            grouped[dateStr] += amount
            console.log(`Added to grouped data: ${dateStr} += ${amount} = ${grouped[dateStr]}`)
        } else {
            console.log(`Skipping transaction: dateStr=${dateStr}, amount=${amount}`)
        }
    })
    
    console.log('Grouped data:', grouped)
    
    // Convert to array and sort by date
    const result = Object.entries(grouped)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    
    console.log('Final chart data:', result)
    return result
})

const chartPoints = computed(() => {
    if (!chartData.value.length) return []
    
    const width = 900
    const height = 400
    const padding = 100
    const chartWidth = width - (padding * 2)
    const chartHeight = height - (padding * 2)
    
    const maxAmount = Math.max(...chartData.value.map(d => d.amount))
    const minAmount = Math.min(...chartData.value.map(d => d.amount))
    const amountRange = maxAmount - minAmount || 1
    
    console.log('Chart range:', { maxAmount, minAmount, amountRange })
    
    return chartData.value.map((point, index) => {
        const x = padding + (index / (chartData.value.length - 1)) * chartWidth
        const y = height - padding - ((point.amount - minAmount) / amountRange) * chartHeight
        
        console.log(`Point ${index}:`, { date: point.date, amount: point.amount, x, y })
        
        return {
            x,
            y,
            date: point.date,
            label: `${point.date}: R${point.amount.toFixed(2)}`
        }
    })
})

const chartPath = computed(() => {
    if (chartPoints.value.length < 2) return ''
    
    return chartPoints.value
        .map((point, index) => 
            index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
        )
        .join(' ')
})

const areaPath = computed(() => {
    if (chartPoints.value.length < 2) return ''
    
    const height = 400
    const padding = 100
    const bottomY = height - padding
    
    const linePath = chartPoints.value
        .map((point, index) => 
            index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
        )
        .join(' ')
    
    const closePath = `L ${chartPoints.value[chartPoints.value.length - 1].x} ${bottomY} L ${chartPoints.value[0].x} ${bottomY} Z`
    
    return linePath + closePath
})

const maxAmount = computed(() => {
    if (!chartData.value.length) return 0
    return Math.max(...chartData.value.map(d => d.amount))
})

const formatDateLabel = (dateString) => {
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            console.warn('Invalid date string:', dateString)
            return 'Invalid Date'
        }
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        })
    } catch (error) {
        console.error('Error formatting date:', dateString, error)
        return 'Invalid Date'
    }
}

// Lifecycle
onMounted(async () => {
    const today = new Date()
    const lastMonth = new Date()
    lastMonth.setDate(today.getDate() - 30)
    dateRange.value = {
        start: lastMonth.toISOString(),
        end: today.toISOString()
    }
    // Initialize date inputs for the UI
    startDate.value = lastMonth.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
    
    await getMeterActivity()
})

// Watchers
watch(dateRange, () => {
    getMeterActivity()
})

watch(meterNumber, () => {
    getMeterInfo()
})
</script>

<style scoped>
/* Custom Scrollbar Styles */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
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
    min-height: 40px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:horizontal {
    min-width: 40px;
}
</style>