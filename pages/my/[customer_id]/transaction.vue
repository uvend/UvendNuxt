<template>
    <h1 class="text-2xl font-bold">Transactions</h1>
     <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                <MyDateRangePicker v-model="dateRange" :months="1" v-if="dateRange"/>
                <Button @click="toggleSearch()" variant="secondary">
                    <Icon name="lucide:search"/>
                </Button>
                <Input v-if="searchActive" type="text" placeholder="Search" v-model="search" @input="debouncedSearch"/>
            </div>
            <div class="flex gap-1">
                <MySearchByAddress/>
                <Button @click="toggleSearch()" variant="secondary">
                    <Input type="text" placeholder="Search" v-model="search" @input="debouncedSearch"/>
                    <Icon name="lucide:search" />
                </Button>
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
    <MyMeterTransactionCard v-else v-for="transaction in paginated" :transaction="transaction"/>
</template>
<script>
definePageMeta({
    layout: 'my'
})
export default{
    data(){
        return {
            transactions: [],
            isLoading: true,
            currentPage: 1,
            pageSize: 10,
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
            dateRange: null
        }
    },
    methods:{
        async getTransactions(){
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
                },
                headers:{
                    'authorization' : 'Basic amFyZWRsZWVAYWRtaW46amFyZWQx'
                }
            })
            this.transactions = result.responseData.transactionData
            await this.getMeterComplex()
            //console.log(result)
            this.isLoading = false;
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
            this.transactions.forEach((meter)=>{
                const complexName = meter.complexName
                if (!this.meterComplexes.includes(complexName)) {
                    this.meterComplexes.push(complexName); // Add the complex if not present
                    //console.log(`Added meter complex: ${complexName}`);
                }
            })
        },
        filteredTransactions(){
            console.log(this.transactions);
            let filteredTransactions = this.selectedMeterComplex === null ? this.transactions : this.transactions.filter(transactions => {
                return transactions.complexName === this.selectedMeterComplex; // Filter by complex name
            });

            // If search phrase is provided, filter by meter number
            if (this.search) {
                filteredTransactions = filteredTransactions.filter(transaction => {
                    return transaction.meterNumber.includes(this.search); // Adjust 'meterNumber' to the correct property name
                });
            }
            return filteredTransactions
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
        //await this.getTransactions()
    },
    computed:{
        totalPages() {
            return Math.ceil(this.filteredTransactions().length / this.pageSize);
        },
        paginated(){
            const filtered = this.filteredTransactions()
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filtered.slice(startIndex, endIndex); // Paginate filtered payments
        },
    },
    watch:{
        selectedUtility(newValue){
            console.log(newValue)
            this.selectedUtility = newValue;
            this.getTransactions()
        },
        dateRange(newValue){
            this.getTransactions()
        }
    }
}
</script>