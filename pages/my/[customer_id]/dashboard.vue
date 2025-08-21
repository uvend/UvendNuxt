<template>
    <div class="flex h-full">
        <!-- Main Content Area -->
        <div class="flex-1 p-6 flex flex-col overflow-hidden">
            <!-- Header -->
            <!-- <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">Transactions</h1>
            </div> -->

            <!-- KPI Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <!-- Water Spending -->
                <Card class="relative">
                    <CardHeader class="pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:droplets" class="w-5 h-5 text-blue-500" />
                                <CardTitle class="text-sm font-medium text-gray-600">Water Spending</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" class="h-6 w-6 p-0">
                                <Icon name="lucide:expand" class="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                                         <CardContent>
                         <div class="text-2xl font-bold text-gray-900">R {{ waterSpending }}</div>
                     </CardContent>
                </Card>

                <!-- Electricity Spending -->
                <Card class="relative">
                    <CardHeader class="pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:zap" class="w-5 h-5 text-yellow-500" />
                                <CardTitle class="text-sm font-medium text-gray-600">Electricity Spending</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" class="h-6 w-6 p-0">
                                <Icon name="lucide:expand" class="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                                         <CardContent>
                         <div class="text-2xl font-bold text-gray-900">R {{ electricitySpending }}</div>
                     </CardContent>
                </Card>

                <!-- Total Refunds -->
                <Card class="relative">
                    <CardHeader class="pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:refresh-cw" class="w-5 h-5 text-orange-500" />
                                <CardTitle class="text-sm font-medium text-gray-600">Total Refunds</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" class="h-6 w-6 p-0">
                                <Icon name="lucide:expand" class="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                                         <CardContent>
                         <div class="text-2xl font-bold text-orange-500">R {{ totalRefunds }}</div>
                     </CardContent>
                </Card>

                <!-- KL Vended -->
                <Card class="relative">
                    <CardHeader class="pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:droplets" class="w-5 h-5 text-blue-500" />
                                <CardTitle class="text-sm font-medium text-gray-600">KL Vended</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" class="h-6 w-6 p-0">
                                <Icon name="lucide:expand" class="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                                         <CardContent>
                         <div class="text-2xl font-bold text-blue-500">{{ klVended }} KL</div>
                     </CardContent>
                </Card>

                <!-- Electricity Vended -->
                <Card class="relative">
                    <CardHeader class="pb-2">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:zap" class="w-5 h-5 text-yellow-500" />
                                <CardTitle class="text-sm font-medium text-gray-600">Electricity Vended</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" class="h-6 w-6 p-0">
                                <Icon name="lucide:expand" class="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                                         <CardContent>
                         <div class="text-2xl font-bold text-blue-500">{{ electricityVended }} KWh</div>
                     </CardContent>
                </Card>
            </div>

            <!-- Search Bar -->
            <div class="mb-6">
                <div class="relative">
                    <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                        type="text" 
                        placeholder="Search transactions..." 
                        class="pl-10"
                        v-model="search"
                        @input="debouncedSearch"
                    />
                </div>
            </div>

                         <!-- Transaction Table -->
             <Card class="flex-1 flex flex-col">
                 <CardHeader>
                     <CardTitle>Recent Transactions</CardTitle>
                 </CardHeader>
                                                                       <CardContent class="p-0 flex-1 flex flex-col">
                      <div class="flex-1 overflow-auto custom-scrollbar" style="max-height: calc(100vh - 400px);">
                          <table class="w-full">
                              <thead class="sticky top-0 bg-white z-10">
                                  <tr class="border-b">
                                     <th class="text-left py-3 px-4 font-medium text-gray-600">Meter ID</th>
                                     <th class="text-left py-3 px-4 font-medium text-gray-600">Complex</th>
                                     <!-- <th class="text-left py-3 px-4 font-medium text-gray-600">Free</th> -->
                                     <!-- <th class="text-left py-3 px-4 font-medium text-gray-600">Purchase</th> -->
                                     <th class="text-left py-3 px-4 font-medium text-gray-600">Units Issued</th>
                                     <th class="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                                     <th class="text-left py-3 px-4 font-medium text-gray-600">Service Fee</th>
                                     <th class="text-left py-3 px-4 font-medium text-gray-600">Refund</th>
                                     <th class="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                                 </tr>
                             </thead>
                             <tbody>
                                     <tr v-for="transaction in paginated" :key="transaction.meterNumber" :data-transaction-id="transaction.meterNumber" :class="['border-b hover:bg-gray-50 cursor-pointer transition-colors', selectedTransaction && selectedTransaction.meterNumber === transaction.meterNumber ? 'bg-blue-50 border-blue-200' : '']" @click="selectTransaction(transaction)">
                                     <td class="py-3 px-4 text-sm">{{ transaction.meterNumber }}</td>
                                     <td class="py-3 px-4 text-sm">{{ transaction.complexName }}</td>
                                     <!-- <td class="py-3 px-4 text-sm">{{ transaction.freeUnits }}</td> -->
                                     <!-- <td class="py-3 px-4 text-sm">{{ transaction.totalUnitsIssued }}</td> -->
                                     <td class="py-3 px-4 text-sm">
                                         {{ transaction.totalUnitsIssued }}
                                         <span v-if="transaction.utilityType === 'Water'">KL</span>
                                         <span v-else-if="transaction.utilityType === 'Electricity'">KWh</span>
                                     </td>
                                     <td class="py-3 px-4 text-sm">R {{ transaction.managedTenderAmount }}</td>
                                     <td class="py-3 px-4 text-sm">R {{ transaction.commissionAmountEx }}</td>
                                     <td class="py-3 px-4 text-sm text-orange-500">R {{ (parseFloat(transaction.managedTenderAmount) - parseFloat(transaction.commissionAmount)).toFixed(2) }}</td>
                                     <td class="py-3 px-4 text-sm">
                                         {{ formattedTime(transaction.transactionDate) }}<br>
                                         {{ formatedDate(transaction.transactionDate) }}
                                     </td>
                                 </tr>
                             </tbody>
                         </table>
                     </div>
                     
                     <!-- Load More Button -->
                     <div class="p-4 border-t flex-shrink-0">
                         <div class="flex justify-center">
                             <Button @click="loadMore" class="bg-blue-600 hover:bg-blue-700">
                                 + Load More
                             </Button>
                         </div>
                     </div>
                 </CardContent>
            </Card>
        </div>

        <!-- Right Sidebar -->
        <div class="max-w-96 bg-white border-l border-gray-200 p-6 overflow-auto custom-scrollbar">
            <!-- Filters Section -->
            <div v-if="!showTransactionDetails" class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                
                <!-- Date Range -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Date Range</Label>
                    <MyDateRangePicker v-model="dateRange" :months="2" v-if="dateRange"/>
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
                 searchActive: false,
                 meterComplexes: [],
                 selectedMeterComplex: null,
                          dateRange: null,
                 selectedTransaction: null,
                 showTransactionDetails: false
             }
         },
    methods:{
                 async getAdminTransactions(){
             this.isLoading = true;
             const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetMeterActivity`,{
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
             this.transactions = result.responseData.transactionData
             this.originalTransactions = JSON.parse(JSON.stringify(result.responseData.transactionData)); // Store original data with deep copy
             this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions)); // Initialize with deep copy of original data
             await this.getMeterComplex()
             //console.log(result)
             this.isLoading = false;
         },
                 async getVendTransactions(){
             this.isLoading = true;
             const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterReport`,{
                 method: "GET",
                 params:{
                     //IncludeMetersWithNoActivity : false,
                     StartDate : this.dateRange.start,
                     EndDate: this.dateRange.end,
                     VendTransactionReportType: 0,  // customer
                     //ResponseFormatType: 0,
                     //ParentUniqueID: this.$route.params.customer_id,
                     UtilityType: this.selectedUtility
                 }
             })
             this.transactions = result.responseData.transactionData
             this.originalTransactions = JSON.parse(JSON.stringify(result.responseData.transactionData)); // Store original data with deep copy
             this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions)); // Initialize with deep copy of original data
             await this.getMeterComplex()
             //console.log(result)
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
        toggleSearch(){
            this.searchActive = !this.searchActive
            this.search = null
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
            this.currentPage += 1;
        },
                                   clearFilters(){
             this.selectedUtility = -1;
             this.selectedMeterComplex = null;
             this.search = '';
             this.currentPage = 1;
             // Reset filtered transactions to show all original transactions with deep copy
             this.filteredTransactions = [];
             this.$nextTick(() => {
                 this.filteredTransactions = JSON.parse(JSON.stringify(this.originalTransactions));
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

             // If search phrase is provided, filter by meter number or address
             if (this.search && this.search.trim() !== '') {
                 filteredTransactions = filteredTransactions.filter(transaction => {
                     const searchLower = this.search.toLowerCase();
                     const meterNumber = transaction.meterNumber ? transaction.meterNumber.toLowerCase() : '';
                     const address = transaction.installationAdress && transaction.installationAdress[0] ? transaction.installationAdress[0].toLowerCase() : '';
                     
                     return meterNumber.includes(searchLower) || address.includes(searchLower);
                 });
             }
             
             // Completely replace the filtered transactions array with a fresh copy
             this.filteredTransactions = [];
             this.$nextTick(() => {
                 this.filteredTransactions = JSON.parse(JSON.stringify(filteredTransactions));
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
         }
    },
    async mounted(){
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(today.getDate()-30)
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
                 waterSpending() {
             // Always use full dataset for KPI calculations
             return this.originalTransactions
                 .filter(t => t.utilityType === 'Water')
                 .reduce((sum, t) => sum + (parseFloat(t.managedTenderAmount) || 0), 0)
                 .toFixed(2);
         },
         electricitySpending() {
             // Always use full dataset for KPI calculations
             return this.originalTransactions
                 .filter(t => t.utilityType === 'Electricity')
                 .reduce((sum, t) => sum + (parseFloat(t.managedTenderAmount) || 0), 0)
                 .toFixed(2);
         },
         totalRefunds() {
             // Always use full dataset for KPI calculations
             return this.originalTransactions
                 .reduce((sum, t) => sum + (parseFloat(t.managedTenderAmount) - parseFloat(t.commissionAmount) || 0), 0)
                 .toFixed(2);
         },
         klVended() {
             // Always use full dataset for KPI calculations
             return this.originalTransactions
                 .filter(t => t.utilityType === 'Water')
                 .reduce((sum, t) => sum + (parseFloat(t.totalUnitsIssued) || 0), 0)
                 .toFixed(1);
         },
         electricityVended() {
             // Always use full dataset for KPI calculations
             return this.originalTransactions
                 .filter(t => t.utilityType === 'Electricity')
                 .reduce((sum, t) => sum + (parseFloat(t.totalUnitsIssued) || 0), 0)
                 .toFixed(1);
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