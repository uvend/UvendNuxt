<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                <MyDateRangePicker v-model="dateRange" :months="2" v-if="dateRange" />
            </div>
        </div>
            <div class="flex flex-row w-fit gap-1">
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
    <MyMeterTransactionCard v-else v-for="transaction in paginated" :transaction="transaction" />
</template>
<script>
definePageMeta({
    layout: 'my'
})
export default{
    data(){
        return{
            isLoading: true,
            meterTransactions: [],
            dateRange: null,
            pageSize: 10,
            pageSizeSelect: [
                10,50,100,200
            ],
            currentPage: 1,
        }
    },
    methods:{
        async getMeterActivity(){
            this.isLoading = true;
            const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetMeterActivity`,{
                method: "GET",
                params: {
                    StartDate: this.dateRange.start,
                    EndDate: this.dateRange.end,
                    ResponseFormatType: 0,
                    ReportParentType: 7, //specific meter
                    ParentUniqueID: this.$route.params.meter_id
                }
            })
            this.meterTransactions = result.responseData.transactionData
            console.log(result)
            this.isLoading = false;
        },
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
    },
    async mounted(){
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(today.getDate()-30)
        this.dateRange = {
            start : lastMonth.toISOString(),
            end : today.toISOString()
        }
    },
    computed:{
        totalPages() {
            return Math.ceil(this.meterTransactions.length / this.pageSize);
        },
        paginated(){
            const filtered = this.meterTransactions
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filtered.slice(startIndex, endIndex); // Paginate filtered payments
        },
    },
    watch:{
        dateRange(){
            this.getMeterActivity();
        }
    }
}
</script>