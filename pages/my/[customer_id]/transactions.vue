<template>
    <div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <!-- Main Content Area -->
        <div class="flex-1 p-6 lg:p-8 flex flex-col">
            <!-- Header -->
             <div class="mb-8">
                 <h1 class="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
                 <p class="text-gray-600">View and manage your utility transaction history</p>
             </div>

             <!-- Search Bar and View Toggle -->
             <div class="mb-8 flex items-center gap-4">
                 <div class="relative w-1/2">
                     <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                         <Icon name="lucide:search" class="w-5 h-5" />
                     </div>
                     <Input 
                         type="text" 
                         placeholder="Search transactions..." 
                         class="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                         v-model="search"
                         @input="debouncedSearch"
                     />
                 </div>
                <!-- <Button class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <Icon name="lucide:download" class="w-4 h-4" />
                    Download Report
                </Button> -->
             </div>


             <!-- Transaction Table View -->
             <div v-if="!showCharts" class="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                 <!-- Table Header -->
                 <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
                     <div class="flex justify-between items-center">
                         <div>
                             <h2 class="text-xl font-semibold text-gray-800">Recent Transactions</h2>
                             <p class="text-gray-600 text-sm">Your latest utility transactions and payments</p>
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
                                 <td class="py-4 px-6 text-sm text-gray-600 group-hover:text-gray-700">{{ transaction.complexName }}</td>
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
         <div class="w-80 bg-white/90 backdrop-blur-sm border-l border-gray-200 p-6 overflow-y-auto custom-scrollbar shadow-lg">
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
                        
                        <!-- Custom Date Inputs (only shown when custom is selected) -->
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
                                <Label class="text-xs text-gray-500">Meter Number</Label>
                                <p class="text-sm font-medium">{{ selectedTransaction.meterNumber }}</p>
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500">Transaction Date</Label>
                                <p class="text-sm">{{ selectedTransaction.transactionDate }}</p>
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500">Vendor</Label>
                                <p class="text-sm">{{ selectedTransaction.vendorName }}</p>
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500">Utility</Label>
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
                            <div v-if="selectedTransaction.tokenNumbers && selectedTransaction.tokenNumbers.length > 0">
                                <Label class="text-xs text-gray-500">Token</Label>
                                <div class="bg-gray-100 p-2 rounded text-xs font-mono">
                                    <span v-for="token in selectedTransaction.tokenNumbers" :key="token">
                                        {{ addHyphens(token) }}
                                    </span>
                                </div>
                            </div>
                            <div >
                                <Button @click="navigateTo(`/my/${$route.params.customer_id}/meters/${selectedTransaction.meterinstallationuniqueid}`)"  class="flex-1 bg-blue-600 hover:bg-blue-">
                                    View meter
                                </Button>
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

<script>
definePageMeta({
    layout: 'my'
})
export default{
             data(){
             return {
                 transactions: [],
                 originalTransactions: [], // Store original unfiltered data
                 filteredTransactions: [], // Store filtered results separately
                 displayedTransactions: [], // Store currently displayed transactions
                 isLoading: true,
                 currentPage: 1,
                 pageSize: 25,
                 pageSizeSelect: [
                     10,25,50,100
                 ],
                 selectedUtility: -1,
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
                 search: null,
                 meterComplexes: [],
                 selectedMeterComplex: null,
                          dateRange: null,
                 startDate: null,
                 endDate: null,
                 selectedDateRange: 'lastMonth',
                 selectedTransaction: null,
                 showTransactionDetails: false,
                 showCharts: false // Toggle between charts and transactions view
             }
         },
    methods:{
                 async getAdminTransactions(){
             this.isLoading = true;
             const result = await useAuthFetch(`${STATEMENT_API}/statement/GetDBMeterActivitySummarised`,{
                 method: "GET",
                 params:{
                     IncludeMetersWithNoActivity : false,
                     StartDate : this.dateRange.start,
                     EndDate: this.dateRange.end,
                     ReportParentType: 4,  // customer
                     ResponseFormatType: 0,
                     ParentUniqueID: this.$route.params.customer_id,
                     UtilityType: this.selectedUtility
                 }
             })
             
             // Clear existing transactions
             this.transactions = []
             this.originalTransactions = []
             
             // Extract all transactions from all meters
             for (const [meterNumber, meterData] of Object.entries(result.data.transactionData)) {
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
                         this.transactions.push(flattenedTransaction)
                         this.originalTransactions.push(flattenedTransaction)
                     })
                 }
             }
             
             this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions)); // Initialize with deep copy of original data
             this.displayedTransactions = this.filteredTransactions.slice(0, this.pageSize); // Initialize displayed transactions
             await this.getMeterComplex()
             this.isLoading = false;
         },
                 async getVendTransactions(){
             this.isLoading = true;
             const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterReport`,{
                 method: "GET",
                 params:{
                     StartDate : this.dateRange.start,
                     EndDate: this.dateRange.end,
                     VendTransactionReportType: 0,  // customer
                     UtilityType: this.selectedUtility
                 }
             })
             
             // Clear existing transactions
             this.transactions = []
             this.originalTransactions = []
             
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
                         this.transactions.push(flattenedTransaction)
                         this.originalTransactions.push(flattenedTransaction)
                     })
                 }
             }
             
             this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions)); // Initialize with deep copy of original data
             this.displayedTransactions = this.filteredTransactions.slice(0, this.pageSize); // Initialize displayed transactions
             await this.getMeterComplex()
             this.isLoading = false;
         },
        getTransactions(){
            if(localStorage.getItem('customer') === 'admin'){
                this.getAdminTransactions()
            }
            else{
                this.getVendTransactions()
            }
        },
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
         toggleView(){
             this.showCharts = !this.showCharts
         },
                          getMeterComplex(){
             // Use a Set to automatically handle duplicates
             const complexSet = new Set();
             if (this.originalTransactions && this.originalTransactions.length > 0) {
                 this.originalTransactions.forEach((meter)=>{
                     const complexName = meter.complexName;
                     if (complexName) {
                         complexSet.add(complexName);
                     }
                 });
             }
             // Convert Set back to array
             this.meterComplexes = Array.from(complexSet).sort();
         },
        loadMore(){
            // Add more transactions to the displayed list
            const startIndex = this.displayedTransactions.length;
            const endIndex = startIndex + this.pageSize;
            const newTransactions = this.filteredTransactions.slice(startIndex, endIndex);
            
            // Append new transactions to the displayed list
            this.displayedTransactions = [...this.displayedTransactions, ...newTransactions];
        },
                                   clearFilters(){
             this.selectedUtility = -1;
             this.selectedMeterComplex = null;
             this.search = '';
             this.currentPage = 1;
             
             // Reset date range dropdown and inputs to last month
             this.selectedDateRange = 'lastMonth';
             const today = new Date();
             const lastMonth = new Date();
             lastMonth.setDate(today.getDate()-30);
             this.startDate = lastMonth.toISOString().split('T')[0];
             this.endDate = today.toISOString().split('T')[0];
             this.updateDateRange();
             
             // Reset filtered transactions to show all original transactions with deep copy
             this.filteredTransactions = [];
             this.$nextTick(() => {
                 this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions));
                 this.displayedTransactions = this.filteredTransactions.slice(0, this.pageSize); // Reset displayed transactions
             });
             // Reset transactions to original state as well
             this.transactions = JSON.parse(JSON.stringify(this.originalTransactions));
         },
                                                                       applyFilters(){
             this.currentPage = 1;
             // Reset to original data first, then apply filters
             this.filteredTransactions = [];
             this.$nextTick(() => {
                 this.performFiltering();
             });
         },
                                                                               performFiltering(){
             console.log('Performing filtering:', {
                 total: this.originalTransactions.length,
                 selectedUtility: this.selectedUtility,
                 selectedMeterComplex: this.selectedMeterComplex,
                 search: this.search
             });
             
             // Always start with a deep copy of the original transactions to prevent any reference issues
             let filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions));

             // Apply all filters sequentially to the original data
             
             // Filter by complex name
             if (this.selectedMeterComplex) {
                 filteredTransactions = filteredTransactions.filter(transaction => {
                     return transaction.complexName === this.selectedMeterComplex;
                 });
             }

             // Filter by utility type
             if (this.selectedUtility !== -1) {
                 filteredTransactions = filteredTransactions.filter(transaction => {
                     if (this.selectedUtility === 0) {
                         return transaction.utilityType === 'Electricity';
                     } else if (this.selectedUtility === 1) {
                         return transaction.utilityType === 'Water';
                     }
                     return true;
                 });
             }

                           // If search phrase is provided, filter by transaction ID, meter number, complex name, or address
             if (this.search && this.search.trim() !== '') {
                 filteredTransactions = filteredTransactions.filter(transaction => {
                     const searchLower = this.search.toLowerCase();
                      const transactionId = transaction.transactionUniqueId ? transaction.transactionUniqueId.toString().toLowerCase() : '';
                     const meterNumber = transaction.meterNumber ? transaction.meterNumber.toLowerCase() : '';
                      const complexName = transaction.complexName ? transaction.complexName.toLowerCase() : '';
                     const address = transaction.installationAdress && transaction.installationAdress[0] ? transaction.installationAdress[0].toLowerCase() : '';
                     
                      return transactionId.includes(searchLower) || 
                             meterNumber.includes(searchLower) || 
                             complexName.includes(searchLower) || 
                             address.includes(searchLower);
                 });
             }
             
             // Completely replace the filtered transactions array with a fresh copy
             this.filteredTransactions = [];
             this.$nextTick(() => {
                 this.filteredTransactions = JSON.parse(JSON.stringify(filteredTransactions));
                 this.displayedTransactions = this.filteredTransactions.slice(0, this.pageSize); // Reset displayed transactions
                 console.log('Filtered results:', this.filteredTransactions.length);
                 console.log('Sample filtered transaction:', this.filteredTransactions[0]);
             });
         },
        debouncedSearch(){
            // Apply search filtering automatically as user types
            this.currentPage = 1;
            this.performFiltering();
        },
        
        formatedDate(dateString){
            return new Date(dateString).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        formattedTime(dateString){
            const date = new Date(dateString);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        },
                 selectTransaction(transaction){
            this.selectedTransaction = transaction;
            this.showTransactionDetails = true;
        },
         goToTransaction(){
             // Switch to transaction details view in the sidebar
             this.showTransactionDetails = true;
         },
                 addHyphens(str){
            return str.replace(/(.{4})/g, '$1-').slice(0, -1); // Removes last extra hyphen
        },
        
        // Helper method to ensure complete data reset
        resetFilteredData(){
            this.filteredTransactions = [];
            this.$nextTick(() => {
                this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions));
            });
        },
        
        // Date handling methods
        updateDateRange() {
            if (this.startDate && this.endDate) {
                this.dateRange = {
                    start: new Date(this.startDate).toISOString(),
                    end: new Date(this.endDate).toISOString()
                };
            }
        },
        
        onDateRangeChange(value) {
            const today = new Date();
            let startDate, endDate;
            
            switch (value) {
                case 'lastDay':
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 1);
                    endDate = new Date(today);
                    break;
                    
                case 'lastWeek':
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 7);
                    endDate = new Date(today);
                    break;
                    
                case 'lastMonth':
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 30);
                    endDate = new Date(today);
                    break;
                    
                case 'custom':
                    // Keep existing dates for custom range
                    return;
                    
                default:
                    return;
            }
            
            // Update the date inputs
            this.startDate = startDate.toISOString().split('T')[0];
            this.endDate = endDate.toISOString().split('T')[0];
            
            // Update the date range
            this.updateDateRange();
        },
        
        setToday() {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            
            this.startDate = todayStr;
            this.endDate = todayStr;
            this.updateDateRange();
        }
    },
    async mounted(){
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(today.getDate()-30)
        
        // Initialize date inputs
        this.startDate = lastMonth.toISOString().split('T')[0];
        this.endDate = today.toISOString().split('T')[0];
        
        // Set initial date range (lastMonth is already set as default in data)
        this.dateRange = {
            start : lastMonth.toISOString(),
            end : today.toISOString()
        }
        await this.getTransactions()
    },
         computed:{
         totalPages() {
             return Math.ceil(this.filteredTransactions.length / this.pageSize);
         },
         paginated(){
             const startIndex = (this.currentPage - 1) * this.pageSize;
             const endIndex = startIndex + this.pageSize;
             return this.filteredTransactions.slice(startIndex, endIndex); // Paginate filtered payments
         },
         hasMoreTransactions() {
             return this.displayedTransactions.length < this.filteredTransactions.length;
         },
         remainingTransactions() {
             return this.filteredTransactions.length - this.displayedTransactions.length;
         }

    },
         watch:{
         // Watch for date range changes to refresh data
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