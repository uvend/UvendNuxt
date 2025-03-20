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
                <!--<MyPaymentSortPopover />-->
            </div>
        </div>
        <MySkeletenCardList v-if="isLoading" :columns="8"/>
        <div v-else>
            <div class="flex flex-row justify-between w-full items-center bg-gray-50 p-1 my-1 rounded">
                <div class="flex flex-col items-start gap-1.5">
                    <div class="flex flex-row justify-center items-center text-center">
                    <div v-if="paymentState != 'Settled'">
                        <MyBatchRollBackDialog :batch="this.batch" :all="true" @refresh="getBatch()"/>
                    </div>
                </div>
                </div>
                <div class="flex flex-row items-center gap-4">
                    <div class="flex flex-row gap-2">
                        <div>
                            {{ paymentState }}
                        </div>
                        <Badge>{{ totalBatch  }}</Badge>
                        <div>
                            {{ totalBatchPayment }}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <Button @click="getBankFile()">
                            <Icon name="lucide:landmark"/>
                        </Button>
                        <div v-if="paymentState != 'Settled'">
                            <MyBatchFinaliseDialog :batch="this.$route.params.batch_id"/>
                        </div>
                        <div v-else>
                            <MyBatchSendStatement :batch="this.$route.params.batch_id"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="">
                <div v-for="payment in paginatedBatch">
                    <MyBatchPaymentCard :payment="payment" @refresh="getBatch()"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
const { debounce } = _;
definePageMeta({
    layout: 'account'
})
export default{
    data(){
        return{
            totalBatch: 0,
            batch: [],
            paymentState: 0,
            totalBatchPayment: 0,
            searchActive: false,
            search: '',
            pageSize: 10,
            pageSizeSelect: [
                10,50,100,200
            ],
            currentPage: 1,
            isLoading: true
        }
    },
    methods:{
        async getBatch(){
            const batch_id = this.$route.params.batch_id
            this.isLoading = true
            const result = await useAuthFetch(`${API_URL}/AdminSystem/TransactionBatchPayment/GetPaymentBatch`,{
                method: "GET",
                params: {
                    PaymentBatchID : batch_id
                },
            })
            if(result.numberOfRecords == 0){
                return navigateTo('/admin/account/payments')
            }
            console.log(result)
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
        },
        async getBankFile(){
            try{
                const result = await useAuthFetch(`https://9xcqber3p3.execute-api.af-south-1.amazonaws.com/prod/batch/capitec`,{
                    method: "POST",
                    body: {
                        batchId: this.$route.params.batch_id
                    },
                    cors: 'no-cors'
                    })
                console.log(result)
                this.$toast({
                    title: 'Success',
                    variant: "success"
                });
            }catch(e){
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                });
            }

        },
        filterPayments() {
            return this.batch.filter(payment => {
                console.log(payment)
                if (payment.payeeInfo && payment.payeeInfo.description) {
                    //console.log(payment)
                    return payment.payeeInfo.description.toLowerCase().startsWith(this.search.toLowerCase());
                }
                return false; // If description doesn't exist, skip the payment
            });
        },
    },
    async mounted() {
        await this.getBatch();
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
            const filteted = this.filterPayments()
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filteted.slice(startIndex, endIndex); // Paginate filtered payments
        },
    },
}
</script>