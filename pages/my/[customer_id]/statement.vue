<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-2">
                <Select v-model="selectedStatementType">
                    <SelectTrigger class="w-[150px]">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="type in statementType" :value="type.value">
                            {{ type.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <MyDateRangePicker  v-if="selectedStatementType" v-model="dateRange" :months="2"/>
                <div v-else class="flex gap-1">
                    <Select v-model="selectedMonth" @update:model-value="monthUpdated">
                        <SelectTrigger class="w-[150px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="month in monthArr" :value="monthArr.indexOf(month)">
                                {{ month }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select v-model="selectedYear" @update:model-value="yearUpdated">
                        <SelectTrigger class="w-[100px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="year in yearArr" :value="parseInt(year)">
                                {{ year }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button @click="getStatementPDF()" variant="secondary">
                    <Icon name="lucide:printer" />
                </Button>
                <!--<Button @click="toggleSearch()" variant="secondary">
                    <Icon name="lucide:search"/>
                </Button>
                <Input v-if="searchActive" type="text" placeholder="Search" v-model="search" @input="debouncedSearch"/>-->
            </div>
            <div>
                <Select  v-model="selectedUtility">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue placeholder="Utility type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="utility in utilityType" :value="utility.value">
                            {{ utility.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
            <div class="flex flex-row w-fit gap-1">
                <div class="flex gap-1">
                    <Button variant="secondary" v-if="selectedMeterComplex != null" @click="selectedMeterComplex = null">
                        <Icon name="lucide:x" class="w-5 h-5"/>
                    </Button>
                    <Select v-model="selectedMeterComplex">
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="Select complex" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="complex in meterComplexes" :value="complex.complexUniqueId">
                                {{ complex.complexName }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Select  v-model="pageSize">
                    <SelectTrigger class="w-[80px]">
                        <SelectValue placeholder="Page Size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="size in pageSizeSelect" :value="size">
                            {{ size }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <div>
                    <Button variant="secondary" @click="changePage(currentPage-1)"><Icon name="lucide:chevron-left" class="w-5 h-5"/></Button>
                    <Button variant="secondary" @click="changePage(currentPage+1)"><Icon name="lucide:chevron-right" class="w-5 h-5"/></Button>
                </div>
            </div>
        </div>
    </div>
    <MySkeletenCardList v-if="isLoading"/>
    <div v-else>
        <div class="my-2" v-if="transactions.length > 0">
            <div class="flex justify-between">
                <p>Statement</p>
                <p>{{ statement.name }}</p>
            </div>
            <div class="flex justify-between">
                <p>Statement Period</p>
                <p>{{ statement.startDate }} - {{ statement.endDate }}</p>
            </div>
            <div class="flex justify-between">
                <p>Managed Tendered Amount</p>
                <p>{{ statement.managedAmount }}</p>
            </div>
            <div class="flex justify-between">
                <p>Non Managed Tendered Amount</p>
                <p>{{ statement.nonManagedAmount }}</p>
            </div>
            <hr>
            <div v-for="stat in statement.stats" :key="stat.utilityType" class="flex justify-between">
                <p>{{ stat.utilityType }}</p>
                <p>{{ stat.totalPaidValue }}</p>
            </div>
            <hr>
            <div class="flex justify-between">
                <p>Total Tendered Amount</p>
                <p>{{ statement.totalValue }}</p>
            </div>
            <hr>
            <div class="flex justify-between">
                <p>Service Percentage</p>
                <p>{{ statement.commissionPerc }}%</p>
            </div>
            <div class="flex justify-between">
                <p>Service Fee</p>
                <p>{{ statement.commissionAmount }}</p>
            </div>
            <div class="flex justify-between">
                <p>Tenant Fee</p>
                <p>{{ statement.surchargeAmount }}</p>
            </div>
            <hr>
            <div class="flex justify-between">
                <p>Refund</p>
                <p>{{ statement.refund }}</p>
            </div>
        </div>
        <MyMeterTransactionCard v-for="transaction in paginated" :transaction="transaction" :statement="true"/>
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
                10,50,100,200
            ],
            selectedMonth: 0,
            selectedYear: 0,
            monthArr: [
                'January','February','March','April','May','June','July','August','September','October','November','December'
            ],
            yearArr: [],
            dateRange: null,
            customerStatementPeriod: 0,
            searchActive: false

        }
    },
    methods:{
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
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
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
        }
    },
    async mounted(){
        this.generateYearArr();
        await this.getCustomerDefinition();
        //console.log(this.customerStatementPeriod)
        this.dateRange = this.calculateStatementPeriod(this.customerStatementPeriod);
    },
    computed:{
        totalPages() {
            return Math.ceil(this.filteredTransactions().length / this.pageSize);
        },
        paginated(){
            const filtered = this.filteredTransactions()
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filtered.slice(startIndex, endIndex); 
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