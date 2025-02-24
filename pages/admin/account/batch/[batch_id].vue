<template>
    <div class="h-screen">
        <div class="flex flex-row justify-between items-center">
            <div class="">
                <div class="flex flex-row gap-1.5 w-fit items-bottom">
                    <div class="flex flex-row gap-1">
                        <Button variant="secondary" @click="toggleSearch"><Icon name="lucide:search"/></Button>
                        <Input type="text" placeholder="Search" v-if="searchActive" v-model="search" @input="debouncedSearch"/>
                    </div>
                </div>
                <div>
                    <hidden>
                        search pages {{ totalPages }} current page {{ currentPage }} page size {{ pageSize }}
                    </hidden>    
                </div>
            </div>
            <div class="flex flex-row gap-x-1.5 mb-2 items-center">
                <div>
                    <Button variant="secondary" @click="changePage(currentPage-1)"><Icon name="lucide:chevron-left" class="w-5 h-5"/></Button>
                    <Button variant="secondary" @click="changePage(currentPage+1)"><Icon name="lucide:chevron-right" class="w-5 h-5"/></Button>
                </div>
                <MyPaymentSortPopover />
            </div>
        </div>
        <MySkeletenCardList v-if="isLoading"/>
        <div v-else>
            <div class="flex flex-row justify-between w-full items-center bg-gray-50 p-1 my-1 rounded">
                <div class="flex flex-col items-start gap-1.5">
                    <div class="flex flex-row justify-center items-center text-center">
                    <div v-if="paymentState != 'Settled'">
                        <Button variant="outline">
                            <Icon name="lucide:undo-2"/>
                        </Button>
                    </div>
                </div>
                </div>
                <div>
                    <p class="text-sm flex justify-end">{{ paymentState }}</p>
                    <p class="w-full text-center font-bold"><Badge>{{ totalBatch  }}</Badge>
                        R {{ totalBatchPayment }}</p>
                </div>
            </div>
            <div class="">
                <div v-for="payment in paginatedBatch">
                    <MyBatchPaymentCard :payment="payment" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
definePageMeta({
    layout: 'account'
})
export default{
    data(){
        return{
            uid: null,
            totalBatch: 0,
            batch: [],
            paymentState: 0,
            totalBatchPayment: 0,
            searchActive: false,
            search: null,
            pageSize: 10,
            currentPage: 1,
            isLoading: true
        }
    },
    methods:{
        async getBatch(id){
            this.isLoading = true
            const result = await useAuthFetch(`${API_URL}/AdminSystem/TransactionBatchPayment/GetPaymentBatch`,{
                method: "GET",
                params: {
                    PaymentBatchID : id
                },
            })
            this.batch = result.listOfPeriodTotalsEntry;
            this.totalBatch = result.listOfPeriodTotalsEntry.length
            this.paymentState = this.batch[0].periodTotals.batchPaymentState
            this.isLoading = false;
        },
        toggleSearch(){
            this.searchActive = !this.searchActive;
        },
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        }
    },
    async mounted() {
        const routeId = this.$route.params.batch_id;
        this.uid = routeId;
        console.log('Route ID:', routeId);
        await this.getBatch(this.uid);
    },
    computed:{
        totalBatchPayment() {
            return this.batch.reduce((total, payment) => {
                return total + (parseFloat(payment.periodTotals.payeePayOutAmount) || 0); 
            }, 0).toFixed(2);
        },
        totalPages() {
            return Math.ceil(this.batch.length / this.pageSize);
        },
        paginatedBatch() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.batch.slice(startIndex, endIndex); // Paginate filtered payments
        },
    }
}
</script>