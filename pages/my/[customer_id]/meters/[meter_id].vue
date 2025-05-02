<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                <MyDateRangePicker v-model="dateRange" :months="2" v-if="dateRange" />
            </div>
        </div>
            <div class="flex flex-row w-fit gap-1">
                <div>
                    <Button v-if="meterStatus === 'Ok'" variant="secondary" class="mx-1" @click="blockMeter(true)"><Icon name="lucide:lock-open" class="w-5 h-5"/></Button>
                    <Button v-else class="mx-1" @click="blockMeter(false)"><Icon name="lucide:lock" class="w-5 h-5"/></Button>
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
    <div v-if="meterInfo" class="pt-2">
        <div class="flex justify-between">
            <p>Utility Type</p>
            <p>{{ meterInfo.vendMeterParameters.utilityType }}</p>
        </div>
        <div class="flex justify-between">
            <p>Tariff Name</p>
            <p>{{ meterInfo.vendAccountParameters.tariffName }}</p>
        </div>
        <div class="flex justify-between">
            <p>Meter State</p>
            <p>{{ this.meterStatus }}</p>
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
            meterNumber: null,
            meterInfo: null,
            meterStatus: null
        }
    },
    methods:{
        async getMeterTransactions(){
            this.isLoading = true;
            try {
                const params = {
                    meterNumber: this.$route.params.meter_id,
                    startDate: this.dateRange?.start,
                    endDate: this.dateRange?.end
                };
                const response = await useAuthFetch(`${WALLET_API_URL}/token/history`, { params });
                this.meterTransactions = response.transactions || [];
                this.meterNumber = this.$route.params.meter_id;
                this.$store.pageTitle = this.meterNumber;
            } catch (error) {
                console.error('Error fetching meter transactions:', error);
                this.meterTransactions = [];
            } finally {
                this.isLoading = false;
            }
        },
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        async getMeterInfo(){
            const result = await useAuthFetch(`${WALLET_API_URL}/meter/${this.$route.params.meter_id}/info`);
            this.meterInfo = result;
            this.meterStatus = result?.requestedMeterState || null;
        },
        async blockMeter(state = true){
            // Implement if needed for new API
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
        await this.getMeterTransactions();
        await this.getMeterInfo();
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
        }
    },
    watch:{
        dateRange(){
            this.getMeterTransactions();
        },
        meterNumber(){
            this.getMeterInfo();
        }
    }
}
</script>