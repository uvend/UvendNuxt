<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                    
                <Button @click="toggleSearch()" variant="secondary">
                    <Icon name="lucide:search"/>
                </Button>    
                
                <Input v-if="searchActive" type="text" placeholder="Search" v-model="search" @input="debouncedSearch"/>
            </div> 
             <!-- Date Range Filters -->
                <div class="flex gap-2">
                   
                    <DateRangePicker v-model="dateRange" /> 
                   <Input type="date" v-model="applyDateRange.startDate" class="border p-2" /> 
                   <Input type="date" v-model="applyDateRange.endDate" class="border p-2" />
                   <button variant="primary" @click="applyDateRange">Apply</button>

                
                </div>

                <div class="flex gap-2 mt-4">
                    <button variant="secondary" @click="printStatement">
                        <Icon name="lucide:printer" class="w-5 h-5"/> Print
                    </button>

                    <button variant="secondary" @click="downloadPDF">
                        <icon name="lucide:file" class="w-5 h-5"/> Download PDF
                    </button>





                </div>



            

            <div>
                <Select  v-model="selectedUtility">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue :placeholder="'Utility type'" :value="selectedUtility?.label || 'Utility type'" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="utility in utilityType" :key="utility.value" :value="utility">
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
            isLoading: true,
            dateRange: { start: "", end: "" }, // Store the selected date range
            startDate: "",
            endDate:  "",
            utilityType: [
                {
                    label: "Any", value: -1
                },
                {
                    label: "Electricity", value: 0
                },
                {
                    label: "Water", value: 1
                },
                {
                    label: "Gas", value: 2
                }
            ],
            meterComplexes: [],
            selectedMeterComplex: null,
            currentPage: 1,
            pageSize: 10

        }
    },
    methods:{
        async getTransactions(){
            this.isLoading = true;
            const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetSummarisedMeterActivity`,{
                method: "GET",
                
                params:{
                    IncludeMetersWithNoActivity : true,
                    StartDate : this.startDate,
                    EndDate: this.endDate,
                    ReportParentType: 4,  // customer
                    ResponseFormatType: 0,
                    ParentUniqueID: this.$route.params.customer_id
                },
                headers: {
                    'authorization' : 'Basic amFyZWRsZWVAYWRtaW46amFyZWQx'
                }
            })
            this.transactions = result.responseData.transactionData
            console.log(this.transactions)
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
        applyDateRange(){
            
            if (this.dateRange.start && this.dateRange.end) {
                this.startDate = this.dateRange.start;
                this.endDate = this.dateRange.end;
                this.getTransactions(); //fetch selected transactions for the selected range
            } else {
                alert("Please select a valid date range")
            }
        },
        printStatement(){
            window.print();
        },
        downloadPDF(){
            const doc = new jsPDF();
            doc.text("Meter Transaction Statement", 14, 10);

            // Define table columns and rows
            const tableColumn = ["Date", "Utility Type", "Complex", "Amount"];
            const tableRows = this.transactions.map(transaction => [
                transaction.date,
                transaction.utilityType,
                transaction.complexName,
                transaction.amount 
            ]);

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 20
            });

            doc.save("meter_statement.pdf");
                 
        }       
    },
    async mounted(){
        const today = new Date();
        this.endDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        this.startDate = `${today.getFullYear()}-${(today.getMonth()).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        await this.getTransactions()
        await this.getMeterComplex();
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
        }
    }
}
</script>