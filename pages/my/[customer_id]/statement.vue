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
                <Button @click="getStatementPDF()" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <Icon name="lucide:download" class="w-4 h-4" />
                    Download PDF
                </Button>
                <Button 
                    @click="toggleStatementSummary" 
                    variant="outline" 
                    class="flex items-center gap-2 rounded-xl"
                >
                    <Icon :name="showStatementSummary ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
                    {{ showStatementSummary ? 'Hide' : 'Show' }} Summary
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
                                    <span class="text-sm font-semibold text-gray-900">R {{ statement.managedAmount }}</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Non Managed Tendered Amount</span>
                                    <span class="text-sm font-semibold text-gray-900">R {{ statement.nonManagedAmount }}</span>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="space-y-4">
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Service Percentage</span>
                                    <span class="text-sm font-semibold text-gray-900">{{ statement.commissionPerc }}%</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Service Fee</span>
                                    <span class="text-sm font-semibold text-gray-900">R {{ statement.commissionAmount }}</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Tenant Fee</span>
                                    <span class="text-sm font-semibold text-gray-900">R {{ statement.surchargeAmount }}</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span class="text-sm font-medium text-gray-700">Total Tendered Amount</span>
                                    <span class="text-sm font-semibold text-gray-900">R {{ statement.totalValue }}</span>
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
                                        <span class="text-sm font-semibold text-gray-900">R {{ stat.totalPaidValue }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Statement Table View -->
            <Card v-if="!showStatementSummary" class="flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden flex-1">
                <CardHeader class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <CardTitle class="text-xl font-semibold text-gray-800">Statement Details</CardTitle>
                    <p class="text-gray-600 text-sm">Detailed breakdown of your utility transactions</p>
                </CardHeader>
                <CardContent class="p-0 flex flex-col">
                    <div class="overflow-auto custom-scrollbar" style="max-height: 600px;">
                        <table class="w-full">
                            <thead class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-b border-gray-200">
                                <tr>
                                    <th class="text-left py-4 px-6 font-semibold text-gray-700">Meter Number</th>
                                    <th class="text-left py-4 px-6 font-semibold text-gray-700">Complex</th>
                                    <th class="text-left py-4 px-6 font-semibold text-gray-700">Utility Type</th>
                                    <th class="text-left py-4 px-6 font-semibold text-gray-700">Units</th>
                                    <th class="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                                    <th class="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="transaction in paginated" :key="transaction.transactionUniqueId" class="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 group">
                                    <td class="py-4 px-6 text-sm font-medium text-gray-900 group-hover:text-gray-700">{{ transaction.meterNumber }}</td>
                                    <td class="py-4 px-6 text-sm text-gray-600 group-hover:text-gray-700">{{ transaction.complexName }}</td>
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
                                    <td class="py-4 px-6 text-sm font-semibold text-green-600 group-hover:text-green-700">R {{ transaction.managedTenderAmount }}</td>
                                    <td class="py-4 px-6 text-sm text-gray-500 group-hover:text-gray-600">
                                        <div class="font-medium">{{ formattedTime(transaction.transactionDate) }}</div>
                                        <div class="text-xs text-gray-400">{{ formattedDate(transaction.transactionDate) }}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Load More Button -->
                    <div class="p-6 border-t border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div class="flex justify-center">
                            <Button @click="loadMore" class="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2">
                                <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                                Load More
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Right Sidebar -->
        <div class="max-w-96 bg-white/90 backdrop-blur-sm border-l border-gray-200 p-6 overflow-y-auto custom-scrollbar shadow-lg">
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
                    <MyDateRangePicker
                        v-if="selectedStatementType"
                        v-model="dateRange"
                        :months="2"
                        :selected-month.sync="selectedMonth"
                        :selected-year.sync="selectedYear"
                    />
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

                <!-- Complex -->
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
            customerStatementPeriod: 0,
            searchActive: true,
            search: null,
            response: null,
            showStatementSummary: true
        }
    },
    methods:{
        toggleSearch(){
            //this.searchActive = !this.searchActive;
        },
        async getAdminTransactions(){
            this.isLoading = true;
            const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetSummarisedMeterActivity`,{
                method: "GET",
                params:{
                    IncludeMetersWithNoActivity : true,
                    StartDate : this.dateRange.start,
                    EndDate: this.dateRange.end,
                    ReportParentType: this.selectedMeterComplex ? 6 : 4,  // customer
                    ResponseFormatType: 0,
                    ParentUniqueID: this.selectedMeterComplex ? this.selectedMeterComplex : this.$route.params.customer_id,
                    UtilityType: this.selectedUtility
                },
            })
            this.transactionResponseData = result.responseData
            this.transactions = result.responseData.transactionData
            if(this.search && this.search != ''){
                // filter this.transactions on meter number
                this.transactions = this.transactions.filter( transaction => {
                    return transaction.meterNumber.toLowerCase().includes(this.search.toLowerCase()) || transaction.complexName.toLowerCase().includes(this.search.toLowerCase())
                })
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
            //console.log(result)
            await this.hydrateStatementData(result)
            this.isLoading = false;
        },
        async getTransactions(){
            if(localStorage.getItem('customer') === 'admin'){
                await this.getAdminTransactions()
            }else{
                await this.getVendTransactions()
            }

        },
        async hydrateStatementData(result){
            console.log('hydrate')
            this.transactionResponseData = result.responseData
            this.transactions = result.responseData.transactionData
            if(this.search && this.search != ''){
                // filter this.transactions on meter number
                this.transactions = this.transactions.filter( transaction => {
                    return transaction.meterNumber.toLowerCase().includes(this.search.toLowerCase()) || transaction.complexName.toLowerCase().includes(this.search.toLowerCase())
                })
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
            this.customerStatementPeriod = result.customer.billingStartDays[0] - 1;
            //console.log(this.customerStatementPeriod);
        },
        filteredTransactions(){
            return this.transactions
        },
        loadMore(){
            this.currentPage += 1;
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
            
            // When a specific month is selected, we want to show that exact month
            // regardless of the current date
            if(statmentMonth !== null) {
                // For a selected month, show the full month range
                var start = new Date(currentYear, currentMonth, 1); // First day of selected month
                var end = new Date(currentYear, currentMonth + 1, 0); // Last day of selected month
            } else {
                // For auto calculation based on statement day
                const currentDate = today.getDate();
                
                if (currentDate > statementDay) {
                    var start = new Date(currentYear, currentMonth, statementDay + 1);
                    var end = new Date(currentYear, currentMonth + 1, statementDay);
                } else {
                    var start = new Date(currentYear, currentMonth - 1, statementDay + 1);
                    var end = new Date(currentYear, currentMonth, statementDay);
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
            console.log(`${JSREPORT_URL}`)
            const username = "admin";
            const password = "@Ezintsha0!$";
            const basicAuth = btoa(`${username}:${password}`);
            const response = await fetch(`${JSREPORT_URL}`,{
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    "template": {
                        "name": "vendease-pdf"
                    },
                    "data": this.transactionResponseData,
                    "options": {
                        "reports": { "save": true },
                        "Content-Disposition": "attachment; filename=myreport.pdf"
                    },
                })
            })
            //console.log(response)
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else {
                console.error('Failed to generate report');
            }
        },
        getMeterComplex(){
            if(this.selectedMeterComplex != null) return
            this.transactions.forEach(meter=>{
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
        debouncedSearch: debounce(async function () {
            this.getTransactions()
        }, 500), // Delay of 500ms after the user stops typing
        clearFilters() {
            this.selectedUtility = -1;
            this.selectedMeterComplex = null;
            this.search = '';
            this.currentPage = 1;
        },
        applyFilters() {
            this.currentPage = 1;
            this.getTransactions();
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
    },
    async mounted(){
        this.generateYearArr();
        await this.getCustomerDefinition();
        //console.log(this.customerStatementPeriod)
        this.dateRange = this.calculateStatementPeriod(this.customerStatementPeriod);
    },
    computed:{
        paginated(){
            const filtered = this.filteredTransactions()
            const endIndex = this.currentPage * this.pageSize;
            return filtered.slice(0, endIndex); 
        },
    },
    watch:{
        dateRange(newValue) {
            // Fix: Parse the date properly to get the correct month
            const dateParts = this.dateRange.start.split('-');
            // Month in dateParts is 1-indexed, convert to 0-indexed for JavaScript
            this.selectedMonth = parseInt(dateParts[0]) - 1;
            this.selectedYear = parseInt(dateParts[2]);
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