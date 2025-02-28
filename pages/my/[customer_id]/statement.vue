<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                <MyDateRangePicker v-model="dateRange" :months="2"/>
                <Select v-if="selectedMonth" class="hidden">
                    <SelectTrigger v-model="selectedMonth" class="w-[150px]">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="month in monthArr" :value="monthArr.indexOf(month)">
                            {{ month }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select v-if="selectedYear" class="hidden">
                    <SelectTrigger v-model="selectedYear"  class="w-[100px]">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="year in yearArr" :value="year">
                            {{ year }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Button @click="toggleSearch()" variant="secondary">
                    <Icon name="lucide:search"/>
                </Button>
                <Input v-if="searchActive" type="text" placeholder="Search" v-model="search" @input="debouncedSearch"/>
            </div>
            <div>
                <Select v-model="selectedUtility">
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
                        <Icon name="lucide:circle-x" class="w-5 h-5"/>
                    </Button>
                    <Select v-model="selectedMeterComplex">
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="Select complex" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="complex in meterComplexes" :value="complex">
                                {{ complex }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Button variant="secondary" @click="changePage(currentPage-1)"><Icon name="lucide:chevron-left" class="w-5 h-5"/></Button>
                    <Button variant="secondary" @click="changePage(currentPage+1)"><Icon name="lucide:chevron-right" class="w-5 h-5"/></Button>
                </div>
            </div>
        </div>
    </div>
    <MySkeletenCardList v-if="isLoading"/>
    <MyMeterTransactionCard v-for="transaction in paginated" :transaction="transaction"/>
</template>
<script>
definePageMeta({
    layout: 'my'
})
export default{
    data(){
        return {
            transactions: [],
            isLoading: false,
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
            meterComplexes: [],
            selectedMeterComplex: null,
            currentPage: 1,
            pageSize: 10,
            selectedMonth: 0,
            selectedYear: 0,
            monthArr: [
                'January','February','March','April','May','June','July','August','September','October','November','December'
            ],
            yearArr: [],
            dateRange: null,
            customerStatementPeriod: 26

        }
    },
    methods:{
        async getTransactions(){
            this.isLoading = true;
            if(!this.dateRange){
                return
            }
            const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetSummarisedMeterActivity`,{
                method: "GET",
                params:{
                    IncludeMetersWithNoActivity : true,
                    StartDate : this.dateRange.start,
                    EndDate: this.dateRange.end,
                    ReportParentType: 4,  // customer
                    ResponseFormatType: 0,
                    ParentUniqueID: this.$route.params.customer_id
                },
                headers: {
                    'authorization' : 'Basic amFyZWRsZWVAYWRtaW46amFyZWQx'
                }
            })
            this.transactions = result.responseData.transactionData
            console.log(result)
            this.isLoading = false;
        },
        filteredTransactions(){
            return this.transactions
        },
        getMeterComplex(){
            this.transactions.forEach((meter)=>{
                const complexName = meter.complexName
                if (!this.meterComplexes.includes(complexName)) {
                    this.meterComplexes.push(complexName); // Add the complex if not present
                    //console.log(`Added meter complex: ${complexName}`);
                }
            })
        },
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        generateYears() {
            const currentYear = new Date().getFullYear(); 
            this.selectedYear = currentYear;
            for (let i = 0; i <= 5; i++) { 
                this.yearArr.push(currentYear - i);
            }
        },
        calculateStatementPeriod(statementDay){
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth(); // getMonth() is zero-indexed
            const currentDate = today.getDate();

            if (currentDate > statementDay) {
                // Today is after the statement period day in the current month
                return {
                    start : new Date(currentYear, currentMonth, statementDay + 1),
                    end : new Date(currentYear, currentMonth + 1, statementDay)
                }
            } else {
                // Today is before or on the statement period day in the current month
                return {
                    start : new Date(currentYear, currentMonth - 1, statementDay + 1),
                    end : new Date(currentYear, currentMonth, statementDay)
                }
            }
    }
    },
    async mounted(){
        console.log(this.customerStatementPeriod)
        this.dateRange = this.calculateStatementPeriod(this.calculateStatementPeriod);
        console.log(this.dateRange)
        
        //this.endDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        //this.startDate = `${today.getFullYear()}-${(today.getMonth()).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        //await this.getTransactions()
        //await this.generateYears();
        //this.selectedMonth = today.getMonth() + 1;
        //this.selectedYear = this.monthArr[this.currentMonth]
        //await this.getMeterComplex();
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
        periodDateRange(){
            console.log(this.customerStatementPeriod)
        }
        
    },
    watch:{
        dateRange(newValue){
            console.log(newValue)
            this.getTransactions()
        }
    }
}
</script>