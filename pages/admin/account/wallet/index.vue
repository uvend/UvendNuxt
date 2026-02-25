<template>
    <div class="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <!-- Header Section with Search -->
        <div class="flex-shrink-0 p-6 bg-white border-b border-gray-200">
            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Wallet Support Dashboard</h1>
                        <p class="text-sm text-gray-600 mt-1">Search transactions by meter number</p>
                    </div>
                </div>
                
                <!-- Date Range and Search Bar -->
                <div class="flex flex-col gap-4">
                    <!-- Date Range Inputs -->
                    <div class="flex gap-2 items-center">
                        <div class="flex items-center gap-2">
                            <Label class="text-sm font-medium whitespace-nowrap">Date Range:</Label>
                            <Input 
                                type="date" 
                                v-model="startDateInput" 
                                @change="updateDateRangeFromInputs"
                                class="w-40"
                            />
                            <span class="text-gray-500">to</span>
                            <Input 
                                type="date" 
                                v-model="endDateInput" 
                                @change="updateDateRangeFromInputs"
                                class="w-40"
                            />
                            <Button 
                                variant="outline" 
                                size="sm"
                                @click="setLastWeek"
                            >
                                Last Week
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                @click="setLastMonth"
                            >
                                Last Month
                            </Button>
                        </div>
                    </div>
                    <div class="flex gap-2 items-center">
                        <div class="flex-1 relative">
                            <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input 
                                type="text" 
                                placeholder="Enter meter number to search transactions..." 
                                v-model="searchMeter" 
                                @input="debouncedSearch"
                                @keyup.enter="searchTransactions"
                                class="pl-10 w-full"
                            />
                        </div>
                        <Button 
                            @click="searchTransactions" 
                            :disabled="isLoading"
                            class="px-6"
                        >
                            <Icon name="lucide:search" class="w-4 h-4 mr-2" v-if="!isLoading" />
                            <Icon name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" v-else />
                            Search
                        </Button>
                        <Button 
                            variant="outline" 
                            @click="checkMeterBalance"
                            :disabled="!searchMeter || isLoading"
                            v-if="searchMeter"
                        >
                            <Icon name="lucide:wallet" class="w-4 h-4 mr-2" />
                            Check Balance
                        </Button>
                        <div v-if="searchMeter" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200">
                            <span class="text-sm text-gray-600">Wallet balance:</span>
                            <span v-if="meterBalanceLoading" class="text-sm text-gray-500 flex items-center gap-1">
                                <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                                Loading...
                            </span>
                            <span v-else-if="meterBalance !== null" class="text-sm font-semibold text-gray-900">
                                R {{ formatCurrency(meterBalance) }}
                                <span v-if="meterBalanceSource === 'calculated'" class="text-xs text-gray-500 font-normal">(from loaded transactions)</span>
                            </span>
                            <span v-else class="text-sm text-gray-500">Click "Check Balance"</span>
                        </div>
                        <Button 
                            variant="outline" 
                            @click="clearSearch"
                            v-if="searchMeter"
                        >
                            Clear
                        </Button>
                        <Button 
                            variant="outline" 
                            @click="loadAllTransactions"
                            :disabled="isLoading"
                        >
                            <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
                            Load All
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 overflow-y-auto p-6">
            <!-- Loading State -->
            <div v-if="isLoading && transactions.length === 0" class="flex items-center justify-center h-full">
                <div class="text-center">
                    <Icon name="lucide:loader-2" class="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p class="text-gray-600 font-medium">Loading transactions...</p>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!hasSearched && transactions.length === 0 && !isLoading" class="flex items-center justify-center h-full">
                <div class="text-center max-w-md">
                    <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="lucide:wallet" class="w-12 h-12 text-blue-600" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">Search Wallet Transactions</h2>
                    <p class="text-gray-600">Enter a meter number above to search for transactions, or click "Load All" to view all transactions.</p>
                </div>
            </div>

            <!-- No Results State -->
            <div v-else-if="hasSearched && transactions.length === 0 && !isLoading" class="flex items-center justify-center h-full">
                <div class="text-center max-w-md">
                    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="lucide:file-x" class="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">No Transactions Found</h2>
                    <p class="text-gray-600 mb-4">No transactions found for meter: <span class="font-semibold">{{ searchMeter }}</span></p>
                    <Button variant="outline" @click="clearSearch">Try Another Search</Button>
                </div>
            </div>

            <!-- Transactions List -->
            <div v-else-if="transactions.length > 0" class="max-w-7xl mx-auto space-y-4">
                <!-- Transaction Type Toggle -->
                <Card class="bg-white border border-gray-200 shadow-lg">
                    <CardContent class="pt-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-semibold text-gray-700">Transaction Type:</span>
                                <div class="flex gap-2">
                                    <Button 
                                        :variant="transactionTypeFilter === 'all' ? 'default' : 'outline'"
                                        size="sm"
                                        @click="transactionTypeFilter = 'all'"
                                    >
                                        All
                                    </Button>
                                    <Button 
                                        :variant="transactionTypeFilter === 'meter' ? 'default' : 'outline'"
                                        size="sm"
                                        @click="transactionTypeFilter = 'meter'"
                                    >
                                        <Icon name="lucide:zap" class="w-4 h-4 mr-1" />
                                        Meter Vending
                                    </Button>
                                    <Button 
                                        :variant="transactionTypeFilter === 'funding' ? 'default' : 'outline'"
                                        size="sm"
                                        @click="transactionTypeFilter = 'funding'"
                                    >
                                        <Icon name="lucide:wallet" class="w-4 h-4 mr-1" />
                                        Wallet Funding
                                    </Button>
                                </div>
                            </div>
                            <div class="text-sm text-gray-600">
                                Showing {{ filteredTransactions.length }} of {{ transactions.length }} transactions
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="md:col-span-4 text-sm text-gray-500 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                        <span>
                            Showing transactions from {{ startDateInput }} to {{ endDateInput }}
                        </span>
                        <span class="italic">
                            Totals are based on currently loaded transactions only.
                        </span>
                    </div>
                    <Card class="bg-white border border-gray-200 shadow-lg">
                        <CardContent class="pt-6">
                            <div class="flex flex-col">
                                <p class="text-sm text-gray-600 font-semibold mb-1">Total Transactions</p>
                                <p class="text-3xl font-black text-gray-900">{{ filteredTransactions.length }}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card class="bg-white border border-gray-200 shadow-lg" v-if="transactionTypeFilter === 'all' || transactionTypeFilter === 'meter'">
                        <CardContent class="pt-6">
                            <div class="flex flex-col">
                                <p class="text-sm text-gray-600 font-semibold mb-1">Total Vending</p>
                                <p class="text-3xl font-black text-gray-900">R {{ formatCurrency(meterTotal) }}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card class="bg-white border border-gray-200 shadow-lg" v-if="transactionTypeFilter === 'all' || transactionTypeFilter === 'funding'">
                        <CardContent class="pt-6">
                            <div class="flex flex-col">
                                <p class="text-sm text-gray-600 font-semibold mb-1">Total Funding</p>
                                <p class="text-3xl font-black text-green-600">R {{ formatCurrency(fundingTotal) }}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card class="bg-white border border-gray-200 shadow-lg" v-if="transactionTypeFilter === 'all' || transactionTypeFilter === 'meter'">
                        <CardContent class="pt-6">
                            <div class="flex flex-col">
                                <p class="text-sm text-gray-600 font-semibold mb-1">Electricity</p>
                                <p class="text-3xl font-black text-yellow-600">R {{ formatCurrency(electricityTotal) }}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card class="bg-white border border-gray-200 shadow-lg" v-if="transactionTypeFilter === 'all' || transactionTypeFilter === 'meter'">
                        <CardContent class="pt-6">
                            <div class="flex flex-col">
                                <p class="text-sm text-gray-600 font-semibold mb-1">Water</p>
                                <p class="text-3xl font-black text-blue-600">R {{ formatCurrency(waterTotal) }}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Transactions Table -->
                <Card class="bg-white border border-gray-200 shadow-lg">
                    <CardHeader>
                        <CardTitle class="flex items-center">
                            <Icon name="lucide:list" class="w-5 h-5 mr-2" />
                            Transactions
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="p-0">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Account</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Meter/Reference</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr 
                                        v-for="transaction in paginatedTransactions" 
                                        :key="transaction.id || transaction.transactionId"
                                        class="hover:bg-gray-50 transition-colors cursor-pointer"
                                        @click="viewTransactionDetails(transaction)"
                                    >
                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {{ formatDate(transaction.created || transaction.transactionDate || transaction.date) }}
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            <div class="flex flex-col">
                                                <span class="font-medium">{{ transaction.email || transaction.userEmail || transaction.accountNumber || 'N/A' }}</span>
                                                <span class="text-xs text-gray-500" v-if="transaction.userId">{{ transaction.userId }}</span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap">
                                            <Badge :variant="getTransactionTypeVariant(transaction.type || transaction.transactionType)">
                                                {{ formatTransactionType(transaction.type || transaction.transactionType || transaction.utilityType) }}
                                            </Badge>
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {{ transaction.meterNumber || transaction.reference || transaction.payvault_data_1 || 'N/A' }}
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold" :class="getAmountColor(transaction.type || transaction.transactionType)">
                                            {{ getAmountPrefix(transaction.type || transaction.transactionType) }}R {{ formatCurrency(getTransactionAmount(transaction)) }}
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap">
                                            <Badge :variant="getStatusVariant(transaction.status || transaction.result_desc)">
                                                {{ formatStatus(transaction.status || transaction.result_desc) }}
                                            </Badge>
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                @click.stop="viewTransactionDetails(transaction)"
                                            >
                                                <Icon name="lucide:eye" class="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                            <div class="text-sm text-gray-700">
                                Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredTransactions.length) }} of {{ filteredTransactions.length }} transactions
                            </div>
                            <div class="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    @click="currentPage = Math.max(1, currentPage - 1)"
                                    :disabled="currentPage === 1"
                                >
                                    <Icon name="lucide:chevron-left" class="w-4 h-4" />
                                </Button>
                                <div class="flex items-center gap-1">
                                    <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    @click="currentPage = Math.min(totalPages, currentPage + 1)"
                                    :disabled="currentPage === totalPages"
                                >
                                    <Icon name="lucide:chevron-right" class="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <!-- Transaction Details Dialog -->
        <Dialog v-model:open="showDetailsDialog">
            <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle class="flex items-center">
                        <Icon name="lucide:file-text" class="w-5 h-5 mr-2" />
                        Transaction Details
                    </DialogTitle>
                    <DialogDescription>
                        Transaction ID: {{ selectedTransaction?.id || selectedTransaction?.transactionId || 'N/A' }}
                    </DialogDescription>
                </DialogHeader>
                <div v-if="selectedTransaction" class="space-y-4">
                    <!-- Transaction Info Grid -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <p class="text-xs text-gray-500 mb-1">Date</p>
                            <p class="font-semibold text-gray-900">{{ formatDate(selectedTransaction.created || selectedTransaction.transactionDate || selectedTransaction.date) }}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <p class="text-xs text-gray-500 mb-1">Amount</p>
                            <p class="font-semibold text-gray-900 text-lg">{{ getAmountPrefix(selectedTransaction.type || selectedTransaction.transactionType) }}R {{ formatCurrency(getTransactionAmount(selectedTransaction)) }}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <p class="text-xs text-gray-500 mb-1">Type</p>
                            <p class="font-semibold text-gray-900">{{ formatTransactionType(selectedTransaction.type || selectedTransaction.transactionType || selectedTransaction.utilityType) }}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <p class="text-xs text-gray-500 mb-1">Status</p>
                            <Badge :variant="getStatusVariant(selectedTransaction.status || selectedTransaction.result_desc)">
                                {{ formatStatus(selectedTransaction.status || selectedTransaction.result_desc) }}
                            </Badge>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg" v-if="selectedTransaction.email || selectedTransaction.userEmail">
                            <p class="text-xs text-gray-500 mb-1">Account Email</p>
                            <p class="font-semibold text-gray-900 break-all">{{ selectedTransaction.email || selectedTransaction.userEmail }}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg" v-if="selectedTransaction.userId">
                            <p class="text-xs text-gray-500 mb-1">User ID</p>
                            <p class="font-semibold text-gray-900">{{ selectedTransaction.userId }}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg" v-if="selectedTransaction.meterNumber">
                            <p class="text-xs text-gray-500 mb-1">Meter Number</p>
                            <p class="font-semibold text-gray-900">{{ selectedTransaction.meterNumber }}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg" v-if="selectedTransaction.reference || selectedTransaction.payvault_data_1">
                            <p class="text-xs text-gray-500 mb-1">Reference</p>
                            <p class="font-semibold text-gray-900">{{ selectedTransaction.reference || selectedTransaction.payvault_data_1 }}</p>
                        </div>
                    </div>

                    <!-- Additional Details -->
                    <div v-if="selectedTransaction.vendResponse" class="bg-gray-50 p-4 rounded-lg">
                        <p class="text-xs text-gray-500 mb-2 font-semibold">Vend Response</p>
                        <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ formatJSON(selectedTransaction.vendResponse) }}</pre>
                    </div>

                    <!-- Full Transaction Data (for debugging) -->
                    <details class="bg-gray-50 p-4 rounded-lg">
                        <summary class="cursor-pointer text-sm font-semibold text-gray-700 mb-2">View Raw Data</summary>
                        <pre class="text-xs text-gray-600 mt-2 overflow-auto max-h-60">{{ JSON.stringify(selectedTransaction, null, 2) }}</pre>
                    </details>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showDetailsDialog = false">
                        <Icon name="lucide:x" class="w-4 h-4 mr-2" />
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script>
import _ from 'lodash';
const { debounce } = _;

definePageMeta({
    layout: 'account'
})

export default {
    data() {
        // Set default date range to last week
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        return {
            searchMeter: '',
            transactions: [],
            isLoading: false,
            hasSearched: false,
            selectedTransaction: null,
            showDetailsDialog: false,
            currentPage: 1,
            pageSize: 20,
            transactionTypeFilter: 'all', // 'all', 'meter', 'funding'
            dateRange: {
                start: lastWeek.toISOString(),
                end: today.toISOString()
            },
            startDateInput: lastWeek.toISOString().split('T')[0],
            endDateInput: today.toISOString().split('T')[0],
            meterBalance: null,
            meterBalanceLoading: false,
            meterBalanceSource: null
        }
    },
    methods: {
        async searchTransactions() {
            console.log('🔍 [SEARCH] searchTransactions() called');
            console.log('🔍 [SEARCH] searchMeter value:', this.searchMeter);
            console.log('🔍 [SEARCH] searchMeter type:', typeof this.searchMeter);
            console.log('🔍 [SEARCH] searchMeter trimmed:', this.searchMeter?.trim());
            
            if (!this.searchMeter || this.searchMeter.trim() === '') {
                console.warn('⚠️ [SEARCH] Invalid search - empty meter number');
                this.$toast({
                    title: 'Invalid Search',
                    description: 'Please enter a meter number',
                    variant: "destructive"
                });
                return;
            }

            console.log('✅ [SEARCH] Starting search for meter:', this.searchMeter.trim());
            this.isLoading = true;
            this.hasSearched = true;
            this.currentPage = 1;

            try {
                await this.fetchTransactions(this.searchMeter);
            } catch (error) {
                console.error('❌ [SEARCH] Error in searchTransactions:', error);
                this.$toast({
                    title: 'Search Failed',
                    description: 'There was a problem searching for transactions.',
                    variant: "destructive"
                });
            } finally {
                this.isLoading = false;
            }
        },
        async loadAllTransactions() {
            console.log('📂 [LOAD] loadAllTransactions() called');
            this.isLoading = true;
            this.hasSearched = true;
            this.currentPage = 1;
            this.searchMeter = '';
            console.log('📂 [LOAD] Cleared searchMeter, now:', this.searchMeter);

            try {
                await this.fetchTransactions(null);
            } catch (error) {
                console.error('❌ [LOAD] Error in loadAllTransactions:', error);
                this.$toast({
                    title: 'Load Failed',
                    description: 'There was a problem loading transactions.',
                    variant: "destructive"
                });
            } finally {
                this.isLoading = false;
            }
        },
        async fetchTransactions(meterNumber) {
            console.log('📡 [FETCH] fetchTransactions() called');
            console.log('📡 [FETCH] meterNumber parameter:', meterNumber);
            console.log('📡 [FETCH] meterNumber type:', typeof meterNumber);
            
            this.transactions = [];
            
            // Use date range from component state
            const startDate = this.dateRange?.start ? new Date(this.dateRange.start).toISOString().split('T')[0] : null;
            const endDate = this.dateRange?.end ? new Date(this.dateRange.end).toISOString().split('T')[0] : null;

            console.log('📡 [FETCH] Date range:', { start: startDate, end: endDate });
            console.log('📡 [FETCH] dateRange object:', this.dateRange);

            // Build params object
            const params = {};
            if (meterNumber) {
                params.meterNumber = meterNumber.trim();
                console.log('📡 [FETCH] Added meterNumber to params:', params.meterNumber);
            } else {
                console.log('📡 [FETCH] No meterNumber provided - fetching all transactions');
            }
            if (startDate) {
                params.startDate = startDate;
            }
            if (endDate) {
                params.endDate = endDate;
            }
            // Add pagination params - try to get all records
            params.page = 1;
            params.pageSize = 1000; // Request large page size to get more records

            console.log('📡 [FETCH] Final params object:', params);
            console.log('📡 [FETCH] API URL:', `${WALLET_API_URL}/admin/getalltransactions`);

            try {
                // If meter number is provided, try using /meter/token/history endpoint which properly supports meter filtering
                let allTransactionsPromise;
                if (meterNumber) {
                    console.log('📡 [FETCH] Using /meter/token/history endpoint for meter-specific search...');
                    const meterHistoryParams = {};
                    if (startDate) meterHistoryParams.startDate = startDate;
                    if (endDate) meterHistoryParams.endDate = endDate;
                    meterHistoryParams.meterNumber = meterNumber.trim();
                    
                    console.log('📡 [FETCH] Meter history params:', meterHistoryParams);
                    allTransactionsPromise = useAuthFetch(`${WALLET_API_URL}/meter/token/history`, {
                        method: "GET",
                        params: meterHistoryParams
                    }).catch((error) => {
                        console.error('❌ [FETCH] Error fetching meter token history:', error);
                        console.error('❌ [FETCH] Error details:', {
                            message: error?.message,
                            status: error?.response?.status,
                            statusText: error?.response?.statusText,
                            data: error?.response?.data
                        });
                        // Fallback to admin endpoint if meter history fails
                        console.log('📡 [FETCH] Falling back to /admin/getalltransactions...');
                        return useAuthFetch(`${WALLET_API_URL}/admin/getalltransactions`, {
                            method: "GET",
                            params: params
                        }).catch(() => ({ transactions: [], data: [] }));
                    });
                } else {
                    // Fetch all transactions with date range
                    console.log('📡 [FETCH] Calling getalltransactions API...');
                    allTransactionsPromise = useAuthFetch(`${WALLET_API_URL}/admin/getalltransactions`, {
                        method: "GET",
                        params: params
                    }).catch((error) => {
                        console.error('❌ [FETCH] Error fetching all transactions:', error);
                        console.error('❌ [FETCH] Error details:', {
                            message: error?.message,
                            status: error?.response?.status,
                            statusText: error?.response?.statusText,
                            data: error?.response?.data
                        });
                        return { transactions: [], data: [] };
                    });
                }

                // Fetch payment/paygate requests with date range
                console.log('📡 [FETCH] Calling paygate/requests API...');
                const paygateRequestsPromise = useAuthFetch(`${WALLET_API_URL}/admin/paygate/requests`, {
                    method: "GET",
                    params: params
                }).catch((error) => {
                    console.error('❌ [FETCH] Error fetching paygate requests:', error);
                    console.error('❌ [FETCH] Paygate error details:', {
                        message: error?.message,
                        status: error?.response?.status,
                        statusText: error?.response?.statusText,
                        data: error?.response?.data
                    });
                    return { requests: [], data: [] };
                });

                const [allTransactionsResponse, paygateResponse] = await Promise.all([
                    allTransactionsPromise,
                    paygateRequestsPromise
                ]);

                console.log('📥 [RESPONSE] Raw allTransactionsResponse:', allTransactionsResponse);
                console.log('📥 [RESPONSE] Response type:', typeof allTransactionsResponse);
                console.log('📥 [RESPONSE] Response keys:', Object.keys(allTransactionsResponse || {}));
                console.log('📥 [RESPONSE] Is array?', Array.isArray(allTransactionsResponse));
                
                console.log('📥 [RESPONSE] Raw paygateResponse:', paygateResponse);
                console.log('📥 [RESPONSE] Paygate response type:', typeof paygateResponse);
                console.log('📥 [RESPONSE] Paygate response keys:', Object.keys(paygateResponse || {}));

                // Extract transactions from response (handle different response structures)
                let allTxns = [];
                if (Array.isArray(allTransactionsResponse)) {
                    console.log('✅ [EXTRACT] Response is array, length:', allTransactionsResponse.length);
                    allTxns = allTransactionsResponse;
                } else if (allTransactionsResponse?.transactions) {
                    console.log('✅ [EXTRACT] Found transactions property, length:', allTransactionsResponse.transactions?.length);
                    allTxns = Array.isArray(allTransactionsResponse.transactions) 
                        ? allTransactionsResponse.transactions 
                        : [];
                } else if (allTransactionsResponse?.data) {
                    console.log('✅ [EXTRACT] Found data property, length:', allTransactionsResponse.data?.length);
                    allTxns = Array.isArray(allTransactionsResponse.data) 
                        ? allTransactionsResponse.data 
                        : [];
                } else if (allTransactionsResponse?.results) {
                    console.log('✅ [EXTRACT] Found results property, length:', allTransactionsResponse.results?.length);
                    allTxns = Array.isArray(allTransactionsResponse.results) 
                        ? allTransactionsResponse.results 
                        : [];
                } else {
                    console.warn('⚠️ [EXTRACT] Unknown response structure:', allTransactionsResponse);
                }

                console.log('📊 [EXTRACT] Extracted meter transactions:', allTxns.length);
                if (allTxns.length > 0) {
                    console.log('📊 [EXTRACT] Sample meter transaction:', allTxns[0]);
                    console.log('📊 [EXTRACT] Sample meter transaction keys:', Object.keys(allTxns[0]));
                    console.log('📊 [EXTRACT] Sample meter transaction meterNumber:', allTxns[0]?.meterNumber || allTxns[0]?.meter_number || allTxns[0]?.meternumber);
                    console.log('📊 [EXTRACT] Sample meter transaction - checking all possible meter fields:', {
                        meterNumber: allTxns[0]?.meterNumber,
                        meter_number: allTxns[0]?.meter_number,
                        meternumber: allTxns[0]?.meternumber,
                        meter: allTxns[0]?.meter,
                        meterId: allTxns[0]?.meterId,
                        meter_id: allTxns[0]?.meter_id,
                        utilityMeterNumber: allTxns[0]?.utilityMeterNumber,
                        utility_meter_number: allTxns[0]?.utility_meter_number
                    });
                }

                // Extract paygate requests
                let paygateRequests = [];
                if (Array.isArray(paygateResponse)) {
                    console.log('✅ [EXTRACT] Paygate response is array, length:', paygateResponse.length);
                    paygateRequests = paygateResponse;
                } else if (paygateResponse?.requests) {
                    console.log('✅ [EXTRACT] Found requests property, length:', paygateResponse.requests?.length);
                    paygateRequests = Array.isArray(paygateResponse.requests) 
                        ? paygateResponse.requests 
                        : [];
                } else if (paygateResponse?.data) {
                    console.log('✅ [EXTRACT] Found data property, length:', paygateResponse.data?.length);
                    paygateRequests = Array.isArray(paygateResponse.data) 
                        ? paygateResponse.data 
                        : [];
                } else if (paygateResponse?.results) {
                    console.log('✅ [EXTRACT] Found results property, length:', paygateResponse.results?.length);
                    paygateRequests = Array.isArray(paygateResponse.results) 
                        ? paygateResponse.results 
                        : [];
                } else {
                    console.warn('⚠️ [EXTRACT] Unknown paygate response structure:', paygateResponse);
                }

                console.log('📊 [EXTRACT] Extracted paygate requests:', paygateRequests.length);

                // Check if pagination is needed
                const totalTransactions = allTransactionsResponse?.total || allTransactionsResponse?.totalCount || allTransactionsResponse?.totalRecords || 0;
                const totalPages = allTransactionsResponse?.totalPages || 1;
                const currentPage = allTransactionsResponse?.page || allTransactionsResponse?.currentPage || 1;
                
                if (totalPages > 1 && currentPage === 1) {
                    this.$toast({
                        title: 'Pagination Detected',
                        description: `Showing page 1 of ${totalPages} (${allTxns.length} of ${totalTransactions} transactions). Fetching all pages...`,
                        variant: "default"
                    });
                    
                    // Fetch all remaining pages
                    const allPagesTxns = [...allTxns];
                    for (let page = 2; page <= totalPages; page++) {
                        try {
                            const pageParams = { ...params, page, pageSize: params.pageSize || 100 };
                            const pageResponse = await useAuthFetch(`${WALLET_API_URL}/admin/getalltransactions`, {
                                method: "GET",
                                params: pageParams
                            });
                            const pageTxns = pageResponse?.transactions || pageResponse?.data || 
                                           (Array.isArray(pageResponse) ? pageResponse : []);
                            allPagesTxns.push(...pageTxns);
                        } catch (error) {
                            // Silently continue if page fetch fails
                        }
                    }
                    allTxns = allPagesTxns;
                }

                // Format meter/utility transactions
                console.log('🔄 [FORMAT] Formatting meter transactions...');
                if (allTxns.length > 0) {
                    console.log('🔄 [FORMAT] First raw transaction before formatting:', JSON.stringify(allTxns[0], null, 2));
                    console.log('🔄 [FORMAT] First raw transaction keys:', Object.keys(allTxns[0]));
                    // Log all field names that might contain "meter" (case insensitive)
                    const meterFields = Object.keys(allTxns[0]).filter(key => 
                        key.toLowerCase().includes('meter') || 
                        key.toLowerCase().includes('metr')
                    );
                    console.log('🔄 [FORMAT] Fields containing "meter":', meterFields);
                    if (meterFields.length > 0) {
                        meterFields.forEach(field => {
                            console.log(`🔄 [FORMAT] ${field}:`, allTxns[0][field]);
                        });
                    }
                }
                const meterTxns = allTxns.map(tx => {
                    // Try to find meter number in various possible fields
                    // Priority: 
                    // 1. Top-level fields (meterNumber, meter_number, meternumber)
                    // 2. Nested in details (details.meterNumber)
                    // 3. Reference field (often contains meter number)
                    // 4. Other variations
                    const meterNumber = tx.meterNumber || 
                                      tx.meter_number || 
                                      tx.meternumber ||
                                      (tx.details && (tx.details.meterNumber || tx.details.meter_number || tx.details.meternumber)) ||
                                      tx.reference || // Reference field often contains meter number
                                      tx.meter || 
                                      tx.meterId || 
                                      tx.meter_id ||
                                      tx.utilityMeterNumber || 
                                      tx.utility_meter_number || null;
                    
                    // Only log first few to avoid console spam
                    if (allTxns.indexOf(tx) < 3) {
                        console.log('🔄 [FORMAT] Extracting meter number for transaction:', {
                            id: tx.id,
                            topLevel: tx.meterNumber,
                            details: tx.details?.meterNumber,
                            reference: tx.reference,
                            extracted: meterNumber
                        });
                    }
                    
                    const formatted = {
                        ...tx,
                        transactionType: 'meter',
                        type: tx.utilityType || (tx.details && tx.details.utilityType) || tx.type || 'meter',
                        accountNumber: tx.email || tx.userEmail || tx.accountNumber || null,
                        userId: tx.userId || tx.user_id || tx.user || null,
                        meterNumber: meterNumber, // Ensure meterNumber is set
                        created: tx.created || tx.transactionDate || tx.date || tx.created_at,
                        amount: tx.amount || tx.totalAmount || 0
                    };
                    return formatted;
                });
                console.log('🔄 [FORMAT] Formatted meter transactions:', meterTxns.length);
                if (meterTxns.length > 0) {
                    console.log('🔄 [FORMAT] Sample formatted meter transaction:', meterTxns[0]);
                    console.log('🔄 [FORMAT] Sample meter number in formatted:', meterTxns[0]?.meterNumber);
                    console.log('🔄 [FORMAT] All meter numbers in formatted:', meterTxns.map(tx => tx.meterNumber || tx.meter_number || tx.meternumber));
                }

                // Format paygate/payment transactions
                // Payment amounts are stored in cents, so divide by 100
                const paymentTxns = paygateRequests.map(tx => {
                    // Handle amount conversion - amounts are in cents
                    let amount = 0;
                    if (tx.amount) {
                        // If amount is already in rands (less than 1000), it might be incorrectly formatted
                        // Otherwise, divide by 100 to convert from cents
                        const rawAmount = parseFloat(tx.amount);
                        amount = rawAmount >= 1000 ? rawAmount / 100 : rawAmount;
                    } else if (tx.amountInCents) {
                        amount = parseFloat(tx.amountInCents) / 100;
                    }
                    
                    return {
                        ...tx,
                        transactionType: 'payment',
                        type: 'funding',
                        accountNumber: tx.email || tx.userEmail || tx.accountNumber || null,
                        userId: tx.userId || tx.user_id,
                        created: tx.created || tx.transactionDate || tx.date || tx.created_at,
                        amount: amount, // Store in rands
                        amountInCents: amount * 100, // Keep cents version for reference
                        status: tx.status || tx.result_desc || tx.resultDesc,
                        reference: tx.reference || tx.payvault_data_1 || tx.referenceNumber
                    };
                });

                // Combine transactions
                console.log('🔗 [COMBINE] Combining transactions...');
                console.log('🔗 [COMBINE] Meter transactions:', meterTxns.length);
                console.log('🔗 [COMBINE] Payment transactions:', paymentTxns.length);
                let combinedTxns = [...meterTxns, ...paymentTxns];
                console.log('🔗 [COMBINE] Total combined before filtering:', combinedTxns.length);

                // Filter by meter number if provided (strict client-side filtering)
                if (meterNumber && meterNumber.trim() !== '') {
                    const searchMeterStr = meterNumber.trim().toString();
                    console.log('🔍 [FILTER] Filtering by meter number:', searchMeterStr);
                    console.log('🔍 [FILTER] Search meter type:', typeof searchMeterStr);
                    
                    const beforeFilter = combinedTxns.length;
                    combinedTxns = combinedTxns.filter(tx => {
                        const txMeterNumber = (tx.meterNumber || tx.meter_number || tx.meternumber || '').toString();
                        const matches = txMeterNumber === searchMeterStr || txMeterNumber.includes(searchMeterStr);
                        
                        if (combinedTxns.indexOf(tx) < 5) { // Log first 5 for debugging
                            console.log('🔍 [FILTER] Transaction check:', {
                                txMeterNumber,
                                searchMeterStr,
                                matches,
                                txMeterNumberType: typeof txMeterNumber,
                                searchMeterStrType: typeof searchMeterStr
                            });
                        }
                        
                        return matches;
                    });
                    console.log('🔍 [FILTER] After filtering:', combinedTxns.length, 'of', beforeFilter);
                    console.log('🔍 [FILTER] Filtered transactions:', combinedTxns);
                } else {
                    console.log('🔍 [FILTER] No meter number provided - showing all transactions');
                }

                // Sort by date (newest first)
                console.log('📅 [SORT] Sorting transactions by date...');
                this.transactions = combinedTxns.sort((a, b) => {
                    const dateA = new Date(a.created || a.transactionDate || a.date || 0);
                    const dateB = new Date(b.created || b.transactionDate || b.date || 0);
                    return dateB - dateA;
                });
                console.log('✅ [FINAL] Final transactions array length:', this.transactions.length);
                console.log('✅ [FINAL] First transaction:', this.transactions[0]);
                console.log('✅ [FINAL] All transaction meter numbers:', this.transactions.map(tx => tx.meterNumber || tx.meter_number || tx.meternumber));

                if (this.transactions.length === 0 && meterNumber) {
                    this.$toast({
                        title: 'No Transactions Found',
                        description: `No transactions found for meter: ${meterNumber} in the selected date range`,
                        variant: "default"
                    });
                } else if (this.transactions.length > 0) {
                    this.$toast({
                        title: 'Transactions Loaded',
                        description: `Found ${this.transactions.length} transaction(s)${meterNumber ? ` for meter ${meterNumber}` : ''} from ${startDate} to ${endDate}`,
                        variant: "success"
                    });
                }
                if (meterNumber) {
                    this.loadMeterBalance(meterNumber.trim());
                }
            } catch (error) {
                this.$toast({
                    title: 'Error Loading Transactions',
                    description: error.message || 'Failed to load transactions. Please try again.',
                    variant: "destructive"
                });
            }
        },
        viewTransactionDetails(transaction) {
            this.selectedTransaction = transaction;
            this.showDetailsDialog = true;
        },
        clearSearch() {
            this.searchMeter = '';
            this.transactions = [];
            this.hasSearched = false;
            this.currentPage = 1;
            this.meterBalance = null;
            this.meterBalanceSource = null;
        },
        formatCurrency(amount) {
            if (!amount && amount !== 0) return '0.00';
            // Handle amounts that might be in cents
            const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
            return new Intl.NumberFormat('en-ZA', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(Math.abs(numAmount));
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        formatTransactionType(type) {
            const types = {
                'Electricity': 'Electricity',
                'Water': 'Water',
                'elect': 'Electricity',
                'water': 'Water',
                'meter': 'Meter Transaction',
                'payment': 'Payment',
                'funding': 'Wallet Funding',
                'withdrawal': 'Withdrawal'
            };
            return types[type] || type || 'Unknown';
        },
        formatStatus(status) {
            if (!status) return 'Unknown';
            const statusLower = status.toLowerCase();
            if (statusLower.includes('done') || statusLower.includes('success') || statusLower === 'active') {
                return 'Success';
            }
            if (statusLower.includes('fail') || statusLower.includes('error')) {
                return 'Failed';
            }
            return status;
        },
        getTransactionAmount(transaction) {
            if (transaction.amount !== undefined && transaction.amount !== null) {
                const rawAmount = parseFloat(transaction.amount);
                return isNaN(rawAmount) ? 0 : rawAmount;
            }
            return 0;
        },
        getAmountPrefix(type) {
            return (type === 'funding' || type === 'payment') ? '+' : '';
        },
        getAmountColor(type) {
            if (type === 'funding' || type === 'payment') {
                return 'text-green-600';
            }
            return 'text-gray-900';
        },
        getTransactionTypeVariant(type) {
            if (type === 'Electricity' || type === 'elect') return 'default';
            if (type === 'Water' || type === 'water') return 'secondary';
            if (type === 'funding' || type === 'payment') return 'outline';
            return 'default';
        },
        getStatusVariant(status) {
            if (!status) return 'default';
            const statusLower = status.toLowerCase();
            if (statusLower.includes('done') || statusLower.includes('success') || statusLower === 'active') {
                return 'default';
            }
            if (statusLower.includes('fail') || statusLower.includes('error')) {
                return 'destructive';
            }
            return 'secondary';
        },
        formatJSON(jsonString) {
            try {
                if (typeof jsonString === 'string') {
                    return JSON.stringify(JSON.parse(jsonString), null, 2);
                }
                return JSON.stringify(jsonString, null, 2);
            } catch {
                return jsonString;
            }
        },
        updateDateRangeFromInputs() {
            if (this.startDateInput && this.endDateInput) {
                this.dateRange = {
                    start: new Date(this.startDateInput).toISOString(),
                    end: new Date(this.endDateInput).toISOString()
                };
            }
        },
        setLastWeek() {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            this.startDateInput = lastWeek.toISOString().split('T')[0];
            this.endDateInput = today.toISOString().split('T')[0];
            this.updateDateRangeFromInputs();
        },
        setLastMonth() {
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setDate(today.getDate() - 30);
            this.startDateInput = lastMonth.toISOString().split('T')[0];
            this.endDateInput = today.toISOString().split('T')[0];
            this.updateDateRangeFromInputs();
        },
        isMeterNumber(input) {
            if (!input) return false;
            // Check if it looks like a meter number (typically numeric or alphanumeric, not an email)
            const trimmed = input.trim();
            return !trimmed.includes('@') && (trimmed.match(/^[A-Z0-9]+$/i) || trimmed.match(/^\d+$/));
        },
        async checkMeterBalance() {
            if (!this.searchMeter) return;
            const meterNumber = this.searchMeter.trim();
            this.isLoading = true;
            this.meterBalanceLoading = true;
            try {
                const { balance, source } = await this.fetchMeterBalance(meterNumber);
                if (balance !== null) {
                    this.meterBalance = balance;
                    this.meterBalanceSource = source;
                    this.$toast({
                        title: source === 'api' ? 'Meter Balance' : 'Meter Balance (Calculated)',
                        description: `Meter ${meterNumber} balance: R ${this.formatCurrency(balance)}${source === 'calculated' ? ' (from loaded transactions)' : ''}`,
                        variant: "success"
                    });
                } else {
                    this.meterBalance = null;
                    this.meterBalanceSource = null;
                    this.$toast({
                        title: 'Balance Not Available',
                        description: `No admin endpoint available for meter balance. Load transactions and try again, or query the database directly.`,
                        variant: "default"
                    });
                }
            } catch (error) {
                this.meterBalance = null;
                this.meterBalanceSource = null;
                this.$toast({
                    title: 'Balance Check Failed',
                    description: error?.message || `Could not fetch balance for meter: ${meterNumber}.`,
                    variant: "destructive"
                });
            } finally {
                this.isLoading = false;
                this.meterBalanceLoading = false;
            }
        },
        async loadMeterBalance(meterNumber) {
            if (!meterNumber || this.searchMeter?.trim() !== meterNumber) return;
            this.meterBalanceLoading = true;
            this.meterBalance = null;
            this.meterBalanceSource = null;
            try {
                const { balance, source } = await this.fetchMeterBalance(meterNumber);
                if (this.searchMeter?.trim() === meterNumber) {
                    this.meterBalance = balance;
                    this.meterBalanceSource = source;
                }
            } finally {
                if (this.searchMeter?.trim() === meterNumber) {
                    this.meterBalanceLoading = false;
                }
            }
        },
        async fetchMeterBalance(meterNumber) {
            if (!meterNumber) return { balance: null, source: null };
            try {
                let response = null;
                try {
                    response = await useAuthFetch(`${WALLET_API_URL}/admin/account/balance/${meterNumber}`, { method: "GET" });
                } catch {
                    response = await useAuthFetch(`${WALLET_API_URL}/admin/balance/${meterNumber}`, { method: "GET" });
                }
                const balance = response?.balance ?? response?.data?.balance ?? response?.amount ?? 0;
                return { balance: Number(balance), source: 'api' };
            } catch {
                const balance = this.calculateBalanceFromTransactions(meterNumber);
                return { balance: balance !== null ? balance : null, source: balance !== null ? 'calculated' : null };
            }
        },
        calculateBalanceFromTransactions(meterNumber) {
            // Calculate balance from loaded transactions for this meter
            if (!meterNumber || this.transactions.length === 0) {
                return null;
            }
            
            const meterTransactions = this.transactions.filter(tx => 
                (tx.meterNumber || tx.meter_number || '').toString() === meterNumber.toString()
            );
            
            if (meterTransactions.length === 0) {
                return null;
            }
            
            // Calculate: funding - spending
            let balance = 0;
            meterTransactions.forEach(tx => {
                if (tx.transactionType === 'payment' || tx.type === 'funding') {
                    balance += this.getTransactionAmount(tx); // Add funding
                } else if (tx.transactionType === 'meter') {
                    balance -= this.getTransactionAmount(tx); // Subtract spending
                }
            });
            
            return balance;
        },
        debouncedSearch: debounce(function() {
            // Auto-search can be enabled here if needed
        }, 500)
    },
    computed: {
        filteredTransactions() {
            console.log('🎯 [COMPUTED] filteredTransactions() called');
            console.log('🎯 [COMPUTED] this.transactions length:', this.transactions.length);
            console.log('🎯 [COMPUTED] this.searchMeter:', this.searchMeter);
            console.log('🎯 [COMPUTED] this.transactionTypeFilter:', this.transactionTypeFilter);
            
            let filtered = this.transactions;
            console.log('🎯 [COMPUTED] Initial filtered length:', filtered.length);
            
            // Filter by transaction type
            if (this.transactionTypeFilter === 'meter') {
                const beforeTypeFilter = filtered.length;
                filtered = filtered.filter(tx => tx.transactionType === 'meter');
                console.log('🎯 [COMPUTED] After meter type filter:', filtered.length, 'of', beforeTypeFilter);
            } else if (this.transactionTypeFilter === 'funding') {
                const beforeTypeFilter = filtered.length;
                filtered = filtered.filter(tx => tx.transactionType === 'payment' || tx.type === 'funding');
                console.log('🎯 [COMPUTED] After funding type filter:', filtered.length, 'of', beforeTypeFilter);
            }
            
            // Filter by search meter number if provided (strict matching)
            if (this.searchMeter && this.searchMeter.trim() !== '') {
                const searchMeterStr = this.searchMeter.trim().toString();
                console.log('🎯 [COMPUTED] Filtering by search meter:', searchMeterStr);
                console.log('🎯 [COMPUTED] Search meter type:', typeof searchMeterStr);
                
                const beforeMeterFilter = filtered.length;
                filtered = filtered.filter(tx => {
                    const txMeterNumber = (tx.meterNumber || tx.meter_number || tx.meternumber || '').toString();
                    const matches = txMeterNumber === searchMeterStr || txMeterNumber.includes(searchMeterStr);
                    
                    if (filtered.indexOf(tx) < 3) { // Log first 3 for debugging
                        console.log('🎯 [COMPUTED] Transaction filter check:', {
                            txMeterNumber,
                            searchMeterStr,
                            matches,
                            fullTx: tx
                        });
                    }
                    
                    // Only show transactions that match the searched meter number
                    return matches;
                });
                console.log('🎯 [COMPUTED] After meter filter:', filtered.length, 'of', beforeMeterFilter);
                console.log('🎯 [COMPUTED] Filtered meter numbers:', filtered.map(tx => tx.meterNumber || tx.meter_number || tx.meternumber));
            } else {
                console.log('🎯 [COMPUTED] No search meter - showing all transactions');
            }
            
            console.log('🎯 [COMPUTED] Final filtered length:', filtered.length);
            return filtered;
        },
        paginatedTransactions() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredTransactions.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredTransactions.length / this.pageSize);
        },
        meterTotal() {
            return this.filteredTransactions
                .filter(tx => tx.transactionType === 'meter')
                .reduce((sum, tx) => sum + this.getTransactionAmount(tx), 0);
        },
        fundingTotal() {
            return this.filteredTransactions
                .filter(tx => tx.transactionType === 'payment' || tx.type === 'funding')
                .reduce((sum, tx) => sum + this.getTransactionAmount(tx), 0);
        },
        totalAmount() {
            return this.filteredTransactions.reduce((sum, tx) => sum + this.getTransactionAmount(tx), 0);
        },
        electricityTotal() {
            return this.filteredTransactions
                .filter(tx => tx.transactionType === 'meter' && ((tx.utilityType || tx.type) === 'Electricity' || (tx.utilityType || tx.type) === 'elect'))
                .reduce((sum, tx) => sum + this.getTransactionAmount(tx), 0);
        },
        waterTotal() {
            return this.filteredTransactions
                .filter(tx => tx.transactionType === 'meter' && ((tx.utilityType || tx.type) === 'Water' || (tx.utilityType || tx.type) === 'water'))
                .reduce((sum, tx) => sum + this.getTransactionAmount(tx), 0);
        }
    },
    watch: {
        searchMeter(newVal, oldVal) {
            console.log('👀 [WATCH] searchMeter changed:', { from: oldVal, to: newVal });
            this.currentPage = 1;
        },
        transactionTypeFilter(newVal, oldVal) {
            console.log('👀 [WATCH] transactionTypeFilter changed:', { from: oldVal, to: newVal });
            this.currentPage = 1;
        },
        dateRange: {
            handler(newRange, oldRange) {
                console.log('👀 [WATCH] dateRange changed:', { from: oldRange, to: newRange });
                if (newRange && oldRange && 
                    (newRange.start !== oldRange.start || newRange.end !== oldRange.end)) {
                    // Reload transactions when date range changes
                    if (this.hasSearched || this.transactions.length > 0) {
                        console.log('👀 [WATCH] Reloading transactions due to date range change');
                        this.fetchTransactions(this.searchMeter || null);
                    }
                }
            },
            deep: true
        }
    },
    async mounted() {
        console.log('🚀 [MOUNT] Component mounted');
        console.log('🚀 [MOUNT] Initial searchMeter:', this.searchMeter);
        console.log('🚀 [MOUNT] Initial dateRange:', this.dateRange);
        
        // Initialize date range if not set
        if (!this.dateRange) {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            this.dateRange = {
                start: lastWeek.toISOString(),
                end: today.toISOString()
            };
            console.log('🚀 [MOUNT] Initialized dateRange:', this.dateRange);
        }
        // Auto-load all transactions on mount with default date range
        await this.loadAllTransactions();
    }
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.5);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(203, 213, 225, 0.8);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.9);
}
</style>
