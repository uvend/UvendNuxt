<template>
    <div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <!-- Main Content Area -->
        <div class="flex-1 p-6 lg:p-8 flex flex-col">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Statement</h1>
                <p class="text-gray-600">View and manage your utility statements and reports</p>
            </div>

            <!-- Search Bar and Controls -->
            <div class="mb-6 flex items-center gap-4">
                <div class="relative w-1/2">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                        <Icon name="lucide:search" class="w-5 h-5" />
                    </div>
                    <Input 
                        type="text" 
                        placeholder="Search statements..." 
                        class="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                        v-model="search"
                        @input="debouncedSearch"
                    />
                </div>
                <Button 
                    @click="getStatementPDF()" 
                    :disabled="isGeneratingPDF"
                    class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Icon v-if="!isGeneratingPDF" name="lucide:eye" class="w-4 h-4" />
                    <Icon v-else name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                    {{ isGeneratingPDF ? 'Generating PDF...' : 'Print and Preview Statement' }}
                </Button>
                <Button 
                    @click="toggleStatementSummary" 
                    variant="outline" 
                    class="flex items-center gap-2 rounded-xl"
                >
                    <Icon :name="showStatementSummary ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
                    {{ showStatementSummary ? 'Show Statement Details' : 'Show Statement Summary' }} 
                </Button>
            </div>

            <!-- Statement Summary Card -->
            <Card v-if="transactions.length > 0 && showStatementSummary" class="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <CardTitle class="text-xl font-semibold text-gray-800">Statement Summary</CardTitle>
                    <p class="text-gray-600 text-sm">{{ statement.name }} - {{ statement.startDate }} to {{ statement.endDate }}</p>
                </CardHeader>
                <CardContent class="p-6">
                    <!-- Detailed Statement Information -->
                    <div class="bg-gray-50 rounded-xl p-6">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">Statement Details</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Left Column -->
                            <div class="space-y-4">
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Statement</span>
                                    <span class="text-sm font-semibold text-gray-900">{{ statement.name }}</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Statement Period</span>
                                    <span class="text-sm font-semibold text-gray-900">{{ statement.startDate }} - {{ statement.endDate }}</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Managed Tendered Amount</span>
                                    <span class="text-sm font-semibold text-gray-900">R {{ formatCurrency(statement.managedAmount) }}</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Non Managed Tendered Amount</span>
                                    <span class="text-sm font-semibold text-gray-900">R {{ formatCurrency(statement.nonManagedAmount) }}</span>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="space-y-4">
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Service Percentage</span>
                                    <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(statement.commissionPerc) }}%</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Service Fee</span>
                                    <span class="text-sm font-semibold text-gray-900">R {{ formatCurrency(statement.commissionAmount) }}</span>
                                </div>
                                <!-- <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Tenant Fee</span>
                                    <span class="text-sm font-semibold text-gray-900">R {{ Math.round(statement.surchargeAmount) }}</span>
                                </div> -->
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Total Tendered Amount</span>
                                    <span class="text-sm font-semibold text-gray-900">R {{ formatCurrency(statement.totalValue) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Utility Statistics -->
                        <div v-if="statement.stats && statement.stats.length > 0" class="mt-6">
                            <h5 class="text-md font-semibold text-gray-800 mb-3">Utility Breakdown</h5>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div v-for="stat in statement.stats" :key="stat.utilityType" class="bg-white rounded-lg p-3 border border-gray-200">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm font-medium text-gray-700">{{ stat.utilityType }}</span>
                                        <span class="text-sm font-semibold text-gray-900">R {{ formatCurrency(stat.tenderedamount) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Statement Table View -->
            <div v-if="!showStatementSummary" class="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden flex-1">
                <!-- Table Header -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-xl font-semibold text-gray-800">Statement Details</h2>
                            <p class="text-gray-600 text-sm">Detailed breakdown of your utility transactions</p>
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
                                <th class="text-left py-4 px-6 font-semibold text-gray-700">Utility Type</th>
                                <th class="text-left py-4 px-6 font-semibold text-gray-700">Units</th>
                                <th class="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                                <th class="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="transaction in displayedTransactions" :key="transaction.transactionUniqueId" class="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 group">
                                <td class="py-4 px-6 text-sm font-medium text-gray-900 group-hover:text-gray-700">{{ transaction.transactionUniqueId }}</td>
                                <td class="py-4 px-6 text-sm font-medium text-gray-900 group-hover:text-gray-700">{{ transaction.meterNumber }}</td>
                                <td class="py-4 px-6 text-sm text-gray-700 group-hover:text-gray-700">
                                    {{ transaction.complexName }}
                                    <p class="text-gray-500">{{ transaction.address0 }}</p>
                                </td>
                                <td class="py-4 px-6 text-sm text-gray-600 group-hover:text-gray-700">
                                    <span v-if="transaction.utilityType === 'Water'" class="text-blue-600 font-medium">Water</span>
                                    <span v-else-if="transaction.utilityType === 'Electricity'" class="text-yellow-600 font-medium">Electricity</span>
                                    <span v-else class="text-gray-600">{{ transaction.utilityType }}</span>
                                </td>
                                <td class="py-4 px-6 text-sm text-gray-600 group-hover:text-gray-700">
                                    <span class="font-medium">{{ transaction.totalUnitsIssued }}</span>
                                    <span v-if="transaction.utilityType === 'Water'" class="text-blue-600">KL</span>
                                    <span v-else-if="transaction.utilityType === 'Electricity'" class="text-yellow-600">KWh</span>
                                </td>
                                <td class="py-4 px-6 text-sm font-semibold text-green-600 group-hover:text-green-700">R {{ formatCurrency(transaction.managedTenderAmount) }}</td>
                                <td class="py-4 px-6 text-sm text-gray-500 group-hover:text-gray-600">
                                    <div class="font-medium">{{ formattedTime(transaction.transactionDate) }}</div>
                                    <div class="text-xs text-gray-400">{{ formattedDate(transaction.transactionDate) }}</div>
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
        <div class="w-64 bg-white/90 backdrop-blur-sm border-l border-gray-200 p-6 overflow-y-auto custom-scrollbar shadow-lg">
            <!-- Filters Section -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                
                <!-- Statement Type -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Statement Type</Label>
                    <Select v-model="selectedStatementType">
                        <SelectTrigger class="w-full bg-white border-gray-200 rounded-lg">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="type in statementType" :value="type.value">
                                {{ type.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Date Range -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Date Range</Label>
                    <div v-if="selectedStatementType" class="space-y-3">
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
                            <input 
                                type="date" 
                                v-model="startDateInput" 
                                @change="onStartDateChange"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
                            <input 
                                type="date" 
                                v-model="endDateInput" 
                                @change="onEndDateChange"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div v-else class="space-y-2">
                        <Select v-model="selectedMonth" @update:model-value="monthUpdated">
                            <SelectTrigger class="w-full bg-white border-gray-200 rounded-lg">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="month in monthArr" :value="monthArr.indexOf(month)">
                                    {{ month }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select v-model="selectedYear" @update:model-value="yearUpdated">
                            <SelectTrigger class="w-full bg-white border-gray-200 rounded-lg">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="year in yearArr" :value="parseInt(year)">
                                    {{ year }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <!-- Utility Type -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Utility Type</Label>
                    <Select v-model="selectedUtility">
                        <SelectTrigger class="w-full bg-white border-gray-200 rounded-lg">
                            <SelectValue placeholder="Select utility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="utility in utilityType" :value="utility.value">
                                {{ utility.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Complex
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Complex</Label>
                    <div class="flex gap-2">
                        <Button 
                            v-if="selectedMeterComplex != null" 
                            @click="selectedMeterComplex = null"
                            variant="outline" 
                            size="sm"
                            class="rounded-lg"
                        >
                            <Icon name="lucide:x" class="w-4 h-4"/>
                        </Button>
                        <Select v-model="selectedMeterComplex" class="flex-1">
                            <SelectTrigger class="w-full bg-white border-gray-200 rounded-lg">
                                <SelectValue placeholder="Select complex" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="complex in meterComplexes" :value="complex.complexUniqueId">
                                    {{ complex.complexName }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div> -->

                <!-- Sort Order -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Sort Order</Label>
                    <Select v-model="sortOrder" @update:model-value="onSortOrderChange">
                        <SelectTrigger class="w-full bg-white border-gray-200 rounded-lg">
                            <SelectValue placeholder="Latest to Oldest" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Latest to Oldest</SelectItem>
                            <SelectItem value="oldest">Oldest to Newest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Load More Amount -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Load More Amount</Label>
                    <Select v-model="pageSize">
                        <SelectTrigger class="w-full bg-white border-gray-200 rounded-lg">
                            <SelectValue placeholder="25 records" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="size in pageSizeSelect" :value="size">
                                {{ size }} records
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2">
                    <Button variant="outline" @click="clearFilters" class="flex-1 rounded-lg">
                        Clear
                    </Button>
                    <Button @click="applyFilters" class="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg">
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
const { debounce } = _;
definePageMeta({
    layout: 'my'
})
export default{
    data(){
        return {
            transactions: [],
            originalTransactions: [],
            filteredTransactions: [],
            displayedTransactions: [],
            statement: {
                name: null,
                startDate: null,
                endDate: null,
                totalValue: null,
                managedAmount: null,
                nonManagedAmount: null,
                commissionPerc: null,
                commissionAmount: null,
                surchargePerc: null,
                surchargeAmount: null,
                refund: null,
                stats: []
            },
            transactionResponseData: null,
            isLoading: true,
            utilityType: [
                {
                    label: "Any",
                    value: -1
                },
                {
                    label: "Electricity",
                    value: 0
                },
                {
                    label: "Water",
                    value: 1
                }
            ],
            statementType: [
                {
                    label : 'Payment Date',
                    value: 0
                },
                {
                    label : 'Calendar',
                    value: 1
                }
            ],
            selectedStatementType: 0,
            selectedUtility: -1,
            meterComplexes: [],
            selectedMeterComplex: null,
            currentPage: 1,
            pageSize: 10,
            pageSizeSelect: [
                10,25,50,100
            ],
            selectedMonth: 0,
            selectedYear: 0,
            monthArr: [
                'January','February','March','April','May','June','July','August','September','October','November','December'
            ],
            yearArr: [],
            dateRange: null,
            startDateInput: '',
            endDateInput: '',
            customerStatementPeriod: 0,
            customer:null,
            searchActive: true,
            search: null,
            response: null,
            showStatementSummary: true,
            isGeneratingPDF: false,
            sortOrder: 'latest' // Default to latest to oldest
        }
    },
    methods:{
        toggleSearch(){
            //this.searchActive = !this.searchActive;
        },
        async getAdminTransactions(){
            this.isLoading = true;
            const result = await useAuthFetch(`${STATEMENT_API}/statement/GetDBMeterActivitySummarised`,{
                method: "GET",
                params:{
                    IncludeMetersWithNoActivity : false,
                    StartDate : this.dateRange.start,
                    EndDate: this.dateRange.end,
                    ReportParentType: this.selectedMeterComplex ? 6 : 4,  // customer
                    ResponseFormatType: 0,
                    ParentUniqueID: this.selectedMeterComplex ? this.selectedMeterComplex : this.$route.params.customer_id,
                    UtilityType: this.selectedUtility
                },
            })
            
            // Store the complete API response
            this.transactionResponseData = result.data
            this.summary = result.data.summary
            
            // Clear existing transactions
            this.transactions = []
            this.originalTransactions = []
            
            // Extract all transactions from all meters (same pattern as transactions.vue)
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
                            transactionUniqueId: transaction.uniqueidentification || Date.now(),
                            commissionAmount: transaction.vendCommissionAmount || 0,
                            commissionAmountEx: transaction.vendCommissionAmount || 0
                        }
                        this.transactions.push(flattenedTransaction)
                        this.originalTransactions.push(flattenedTransaction)
                    })
                }
            }
            
            // Initialize filtered transactions with deep copy
            this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions))
            // Sort by date based on selected sort order
            this.filteredTransactions.sort((a, b) => {
                const dateA = new Date(a.transactionDate || 0);
                const dateB = new Date(b.transactionDate || 0);
                return this.sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
            });
            this.displayedTransactions = this.filteredTransactions.slice(0, this.pageSize)
            
            // Apply search filter if exists
            if(this.search && this.search != ''){
                this.performFiltering()
            }
            
            // TODO: CUSTOM STATEMENT DATA - Add your custom fields here
            // You can access the raw API data through this.transactionResponseData
            // Example:
            // this.statement.customField = this.transactionResponseData.someField
            // this.statement.anotherField = this.transactionResponseData.anotherField
            this.statement.managedAmount = this.summary.managedTenredAmount
            this.statement.nonManagedAmount = this.summary.nonManagedTenredAmount
            this.statement.totalValue = this.summary.tenderedamount
            this.statement.surchargeAmount = this.summary.surcharge0AmountInclVat
            this.statement.commissionAmount = this.summary.vendCommissionAmountIncVat
            this.statement.commissionPerc = this.summary.vendCommission.percentage
            this.statement.startDate = this.dateRange.start
            this.statement.endDate = this.dateRange.end
            this.statement.name = this.customer

            // Clear existing stats before adding new ones
            this.statement.stats = []
            for (const [utilityType,data] of Object.entries(this.summary.utilities)) {
                let newSet = {...data}
                newSet.utilityType = utilityType
                this.statement.stats.push(newSet)
            }
            


            // Get meter complexes for filtering
            this.getMeterComplex();
            this.isLoading = false;
        },
        async getVendTransactions(){
            this.isLoading = true;
            const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterReport`, {
                params : {
                    StartDate : this.dateRange.start,
                    EndDate: this.dateRange.end,
                    VendTransactionReportType: 1
                }
            });
            await this.hydrateStatementData(result)
            this.isLoading = false;
        },
        async getTransactions(){
            await this.getAdminTransactions()
            // if(localStorage.getItem('customer') === 'admin'){
            // }else{
            //     await this.getVendTransactions()
            // }

        },
        async hydrateStatementData(result){
            console.log('hydrate')
            this.transactionResponseData = result.responseData

            // Flatten vend transactions to match admin structure
            this.transactions = []
            this.originalTransactions = []
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
                            transactionUniqueId: transaction.uniqueidentification || Date.now(),
                            commissionAmount: transaction.vendCommissionAmount || 0,
                            commissionAmountEx: transaction.vendCommissionAmount || 0
                        }
                        this.transactions.push(flattenedTransaction)
                        this.originalTransactions.push(flattenedTransaction)
                    })
                }
            }

            // Initialize filtered list
            this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions))
            // Sort by date based on selected sort order
            this.filteredTransactions.sort((a, b) => {
                const dateA = new Date(a.transactionDate || 0);
                const dateB = new Date(b.transactionDate || 0);
                return this.sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
            });
            this.displayedTransactions = this.filteredTransactions.slice(0, this.pageSize)
            if(this.search && this.search != ''){
                this.performFiltering()
            }
            this.statement.name = this.transactionResponseData.reportParentName
            this.statement.startDate = this.transactionResponseData.startDate,
            this.statement.endDate = this.transactionResponseData.endDate
            this.statement.totalValue = this.transactionResponseData.totalAmountTendered
            this.statement.managedAmount = this.transactionResponseData.managedTenderAmount
            this.statement.nonManagedAmount = this.transactionResponseData.nonManagedTenderAmount
            this.statement.commissionPerc = this.transactionResponseData.commissionPercentage
            this.statement.commissionAmount = this.transactionResponseData.commissionAmount
            this.statement.surchargePerc = this.transactionResponseData.surchargeToCustomer
            this.statement.surchargeAmount = this.transactionResponseData.surchargeToServiceProvider
            this.statement.refund = this.transactionResponseData.amountPayableToCustomer
            this.statement.stats = this.transactionResponseData.tokenStatistics

            this.getMeterComplex();

        },
        async getCustomerDefinition(){
            const result = await useAuthFetch(`${API_URL}/AdminSystem/Customer/GetCustomerMeterInstallationList`,{
                method: "GET",
                params: {
                    CustomerUnique: this.$route.params.customer_id
                },
                headers:{
                    Authorization : `Basic ${ADMIN_AUTH}`
                }
            })
            this.customer =  result.customer.description
            this.customerStatementPeriod = result.customer.billingStartDays[0] - 1;
            //console.log(this.customerStatementPeriod);
        },
        filteredTransactions(){
            try {
                const term = (this.search || '').toString().trim().toLowerCase()
                if (!term) return this.transactions
                return this.transactions.filter(t => {
                    const meter = (t.meterNumber || '').toString().toLowerCase()
                    const complex = (t.complexName || '').toString().toLowerCase()
                    const id = (t.transactionUniqueId || t.transactionID || '').toString().toLowerCase()
                    return meter.includes(term) || complex.includes(term) || id.includes(term)
                })
            } catch (e) {
            return this.transactions
            }
        },
        loadMore(){
            // Add more transactions to the displayed list
            const startIndex = this.displayedTransactions.length;
            const endIndex = startIndex + this.pageSize;
            const newTransactions = this.filteredTransactions.slice(startIndex, endIndex);
            
            // Append new transactions to the displayed list
            this.displayedTransactions = [...this.displayedTransactions, ...newTransactions];
        },
        calculateStatementPeriod(statementDay, statmentMonth = null, statmentYear = null) {
            const today = new Date();
            var currentYear, currentMonth;
            
            if(!statmentYear) {
                currentYear = today.getFullYear();
            } else {
                currentYear = statmentYear;
            }
            
            if(!statmentMonth && statmentMonth !== 0) { // Important: check for 0 as well
                currentMonth = today.getMonth(); // getMonth() zero-indexed
            } else {
                currentMonth = statmentMonth; // Use the exact month selected
            }
            
            // Always use 26th to 25th pattern regardless of statement day or month selection
            if(statmentMonth !== null) {
                // For a selected month, set range from 26th of previous month to 25th of selected month
                var start = new Date(currentYear, currentMonth - 1, 26); // 26th of previous month
                var end = new Date(currentYear, currentMonth, 25); // 25th of selected month
            } else {
                // For auto calculation, always use 26th to 25th pattern
                const currentDate = today.getDate();
                
                if (currentDate >= 26) {
                    // If current date is 26th or later, show current period (26th of current month to 25th of next month)
                    var start = new Date(currentYear, currentMonth, 26);
                    var end = new Date(currentYear, currentMonth + 1, 25);
                } else {
                    // If current date is before 26th, show previous period (26th of previous month to 25th of current month)
                    var start = new Date(currentYear, currentMonth - 1, 26);
                    var end = new Date(currentYear, currentMonth, 25);
                }
            }

            return {
                start: this.returnFormatDate(start),
                end: this.returnFormatDate(end)
            };
        },
        returnFormatDate(date){
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(new Date(date));

            // Replace slashes with hyphens
            return formattedDate.replace(/\//g, '-');
        },
        async getStatementPDF(){
            this.isGeneratingPDF = true;
            try {
                const payload = {
                    data: this.transactionResponseData
                }
                
                // Request PDF as a blob with proper headers
                const response = await fetch(`${STATEMENT_API}/export/pdf?template=statement`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/pdf'
                    },
                    body: JSON.stringify(payload)
                })

                // Check if the response is ok
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Get the blob from the response
                const blob = await response.blob();
                
                // Validate that we actually got a PDF blob
                if (!blob || blob.size === 0) {
                    throw new Error('Received empty or invalid PDF blob');
                }

                // Check if it's actually a PDF by looking at the content type
                if (!blob.type.includes('pdf') && !blob.type.includes('application/octet-stream')) {
                    console.warn('Unexpected content type:', blob.type);
                }

                // Create a blob URL
                const url = URL.createObjectURL(blob);
                
                // Try to open in new tab first
                const newTab = window.open(url, '_blank');
                
                // If popup was blocked or failed, fallback to download
                if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
                    console.log('Popup blocked, falling back to download');
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Statement_${this.statement.startDate}_${this.statement.endDate}.pdf`;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Clean up the blob URL after download
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 100);
                } else {
                    // Clean up the blob URL after a longer delay for new tab
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 10000); // 10 seconds should be enough for the PDF to load
                }
                
            } catch (err) {
                console.error('Failed to generate PDF:', err);
                // You might want to show a user-friendly error message here
                alert('Failed to generate PDF. Please try again or check your internet connection.');
            } finally {
                this.isGeneratingPDF = false;
            }
        },
        getMeterComplex(){
            if(this.selectedMeterComplex != null) return
            const source = this.originalTransactions && this.originalTransactions.length > 0 ? this.originalTransactions : this.transactions
            source.forEach(meter=>{
                const complex = {
                    complexName : meter.complexName,
                    complexUniqueId: meter.complexUniqueId
                }
                //console.log(complex)
                if(!this.meterComplexes.some(listComplex => listComplex.complexUniqueId === complex.complexUniqueId)){
                    this.meterComplexes.push(complex);
                }
            })
        },
        generateYearArr(){
            const currentYear = new Date().getFullYear();
            for (let i = currentYear; i >= currentYear - 5; i--) {
                this.yearArr.push(i)
            }
        },
        monthUpdated(value) {
            // When a month is selected from dropdown, show the full month
            this.dateRange = this.calculateStatementPeriod(null, value, this.selectedYear);
        },
        yearUpdated(value) {
            this.dateRange = this.calculateStatementPeriod(this.customerStatementPeriod, this.selectedMonth, value);
        },
        debouncedSearch: debounce(function () {
            this.currentPage = 1
            this.performFiltering()
        }, 300), // Client-side debounce
        clearFilters() {
            this.selectedUtility = -1;
            this.selectedMeterComplex = null;
            this.search = '';
            this.currentPage = 1;
            this.sortOrder = 'latest'; // Reset to default sort order
            // Reset filtered transactions to show all original transactions with deep copy
            this.filteredTransactions = []
            this.$nextTick(() => {
                this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions))
                // Sort by date (latest to oldest)
                this.filteredTransactions.sort((a, b) => {
                    const dateA = new Date(a.transactionDate || 0);
                    const dateB = new Date(b.transactionDate || 0);
                    return dateB - dateA; // Latest first
                });
                this.displayedTransactions = this.filteredTransactions.slice(0, this.pageSize)
            })
        },
        applyFilters() {
            this.currentPage = 1;
            // Re-run filtering locally matching transactions.vue behavior
            this.performFiltering();
        },
        formattedTime(dateString) {
            const date = new Date(dateString);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        },
        formattedDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        toggleStatementSummary() {
            this.showStatementSummary = !this.showStatementSummary;
        },
        performFiltering() {
            // Start with deep copy of originals
            let filtered = JSON.parse(JSON.stringify(this.originalTransactions || []))

            // Filter by complex
            if (this.selectedMeterComplex) {
                filtered = filtered.filter(t => t.complexUniqueId === this.selectedMeterComplex || t.complexName === this.selectedMeterComplex)
            }

            // Filter by utility type
            if (this.selectedUtility !== -1) {
                filtered = filtered.filter(t => {
                    if (this.selectedUtility === 0) return t.utilityType === 'Electricity'
                    if (this.selectedUtility === 1) return t.utilityType === 'Water'
                    return true
                })
            }

            // Search phrase across id, meter, complex, address
            if (this.search && this.search.trim() !== '') {
                const term = this.search.toLowerCase()
                filtered = filtered.filter(t => {
                    const id = (t.transactionUniqueId || t.transactionID || '').toString().toLowerCase()
                    const meter = (t.meterNumber || '').toString().toLowerCase()
                    const complex = (t.complexName || '').toString().toLowerCase()
                    const address = t.installationAdress && t.installationAdress[0] ? t.installationAdress[0].toLowerCase() : ''
                    return id.includes(term) || meter.includes(term) || complex.includes(term) || address.includes(term)
                })
            }

            // Sort by date based on selected sort order
            filtered.sort((a, b) => {
                const dateA = new Date(a.transactionDate || 0);
                const dateB = new Date(b.transactionDate || 0);
                return this.sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
            });

            // Replace filtered list
            this.filteredTransactions = []
            this.$nextTick(() => {
                this.filteredTransactions = JSON.parse(JSON.stringify(filtered))
                this.displayedTransactions = this.filteredTransactions.slice(0, this.pageSize)
            })
        },
        onStartDateChange() {
            if (this.startDateInput) {
                this.updateDateRange();
            }
        },
        onEndDateChange() {
            if (this.endDateInput) {
                this.updateDateRange();
            }
        },
        updateDateRange() {
            if (this.startDateInput && this.endDateInput) {
                this.dateRange = {
                    start: this.returnFormatDate(new Date(this.startDateInput)),
                    end: this.returnFormatDate(new Date(this.endDateInput))
                };
            }
        },
        formatDateForInput(date) {
            if (!date) return '';
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        
        onSortOrderChange() {
            // Reset displayed transactions and re-sort
            this.displayedTransactions = [];
            this.currentPage = 1;
            // Force a complete reset by clearing filtered transactions first
            this.filteredTransactions = [];
            this.$nextTick(() => {
                this.performFiltering();
            });
        },
        formatCurrency(amount) {
            // Format amount to show exactly 2 decimal places
            return parseFloat(amount || 0).toFixed(2);
        }
    },
    async mounted(){
        this.generateYearArr();
        await this.getCustomerDefinition();
        //console.log(this.customerStatementPeriod)
        this.dateRange = this.calculateStatementPeriod(this.customerStatementPeriod);
        
        // Initialize date inputs if dateRange exists
        if (this.dateRange && this.dateRange.start && this.dateRange.end) {
            this.startDateInput = this.formatDateForInput(new Date(this.dateRange.start));
            this.endDateInput = this.formatDateForInput(new Date(this.dateRange.end));
        }
    },
    computed:{
        paginated(){
            const filtered = this.filteredTransactions
            const endIndex = this.currentPage * this.pageSize;
            return filtered.slice(0, endIndex); 
        },
        hasMoreTransactions() {
            return this.displayedTransactions.length < this.filteredTransactions.length;
        },
        remainingTransactions() {
            return this.filteredTransactions.length - this.displayedTransactions.length;
        },
    },
    watch:{
        dateRange(newValue) {
            // Parse the END date to get the correct month (since billing period ends on 25th of the target month)
            const dateParts = this.dateRange.end.split('-');
            // Month in dateParts is 1-indexed, convert to 0-indexed for JavaScript
            this.selectedMonth = parseInt(dateParts[0]) - 1;
            this.selectedYear = parseInt(dateParts[2]);
            
            // Update date inputs when dateRange changes
            if (newValue && newValue.start && newValue.end) {
                this.startDateInput = this.formatDateForInput(new Date(newValue.start));
                this.endDateInput = this.formatDateForInput(new Date(newValue.end));
            }
            
            this.getTransactions();
        },
        selectedMeterComplex(newValue){
            console.log('selected complex',newValue)
            this.getTransactions()
        },
        selectedUtility(newValue){
            console.log('selected utlity', newValue)
            this.getTransactions()
        },
        selectedStatementType(newValue){
            console.log('dateType', newValue)
            this.dateRange = this.calculateStatementPeriod(this.customerStatementPeriod);
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