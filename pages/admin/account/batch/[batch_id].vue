<template>
    <div class="h-screen">
        <div class="flex flex-row justify-between items-center">
            <div class="flex items-center gap-2">
                <Button variant="outline" @click="goBack" class="flex items-center gap-2">
                    <Icon name="lucide:arrow-left" class="w-5 h-5"/>
                    Return
                </Button>
                <div class="flex flex-row gap-1.5 w-fit items-bottom">
                    <div class="flex flex-row gap-1">
                        <Button variant="secondary" @click="toggleSearch" class="flex items-center gap-2">
                            <Icon name="lucide:search" class="w-5 h-5"/>
                            Search
                        </Button>
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
                <div class="flex flex-row gap-2">
                    <Button variant="secondary" @click="changePage(currentPage-1)" class="flex items-center gap-1">
                        <Icon name="lucide:chevron-left" class="w-5 h-5"/>
                        Previous
                    </Button>
                    <Button variant="secondary" @click="changePage(currentPage+1)" class="flex items-center gap-1">
                        <Icon name="lucide:chevron-right" class="w-5 h-5"/>
                        Next
                    </Button>
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
                            <Badge :class="batchStateBadgeClass(displayBatchState)">{{ displayBatchState }}</Badge>
                        </div>
                        <Badge>{{ totalBatch  }}</Badge>
                        <div>
                            {{ totalBatchPayment }}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <Button @click="getBankFile()" class="flex items-center gap-2">
                            <Icon name="lucide:landmark" class="w-5 h-5"/>
                            Bank File
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
                    <MyBatchPaymentCard
                        :payment="payment"
                        :display-state="batchPaymentDisplayState(payment)"
                        @refresh="getBatch()"
                    />
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
            isLoading: true,
            bankFileCreatedLocal: false,
            /** Survives refetch/reload in-session; cleared when API settles or confirms BankFileCreated */
            bankFilePersisted: false
        }
    },
    methods:{
        bankFileSessionKey(batchId) {
            return `uvend:batchBankFileCreated:${batchId}`;
        },
        readBankFilePersisted(batchId) {
            if (!import.meta.client) return false;
            try {
                return sessionStorage.getItem(this.bankFileSessionKey(batchId)) === '1';
            } catch {
                return false;
            }
        },
        persistBankFileCreated(batchId) {
            if (!import.meta.client) return;
            try {
                sessionStorage.setItem(this.bankFileSessionKey(batchId), '1');
            } catch { /* ignore quota */ }
            this.bankFilePersisted = true;
        },
        clearBankFilePersisted() {
            const batchId = this.$route.params.batch_id;
            if (import.meta.client && batchId) {
                try {
                    sessionStorage.removeItem(this.bankFileSessionKey(batchId));
                } catch { /* ignore */ }
            }
            this.bankFilePersisted = false;
            this.bankFileCreatedLocal = false;
        },
        shouldShowBankFileCreatedOverride() {
            return (
                (this.bankFileCreatedLocal || this.bankFilePersisted) &&
                this.paymentState === 'SubmittedToBatch'
            );
        },
        batchStateBadgeClass(state) {
            if (state === 'Settled') return 'bg-green-500 text-white border-transparent';
            if (state === 'SubmittedToBatch') return 'bg-orange-500 text-white border-transparent';
            if (state === 'BankFileCreated') return 'bg-blue-500 text-white border-transparent';
            return '';
        },
        batchPaymentDisplayState(payment) {
            const actual = payment?.periodTotals?.batchPaymentState;
            if (this.shouldShowBankFileCreatedOverride() && actual === 'SubmittedToBatch') {
                return 'BankFileCreated';
            }
            return actual;
        },
        async getBatch(silent = false){
            const batch_id = this.$route.params.batch_id
            if (!silent) this.isLoading = true
            const result = await useAuthFetch(`${API_URL}/AdminSystem/TransactionBatchPayment/GetPaymentBatch`,{
                method: "GET",
                params: {
                    PaymentBatchID : batch_id
                },
            })
            if(result.numberOfRecords == 0){
                if (!silent) this.isLoading = false
                return navigateTo('/admin/account/payments')
            }
            console.log(result)
            this.batch = result.listOfPeriodTotalsEntry;
            this.totalBatch = result.listOfPeriodTotalsEntry.length
            this.paymentState = this.batch[0].periodTotals.batchPaymentState
            // Persist when API confirms bank file so a later flaky SubmittedToBatch response still shows blue
            if (this.paymentState === 'BankFileCreated') {
                this.bankFileCreatedLocal = false;
                this.persistBankFileCreated(batch_id);
            } else if (this.paymentState === 'Settled') {
                this.clearBankFilePersisted();
            } else if (this.paymentState === 'SubmittedToBatch') {
                this.bankFilePersisted = this.readBankFilePersisted(batch_id);
            } else {
                this.clearBankFilePersisted();
            }
            if (!silent) this.isLoading = false;
        },
        goBack() {
            const params = new URLSearchParams()
            const q = this.$route.query || {}
            const page = parseInt(q.fromPage, 10)
            const months = parseInt(q.fromMonths, 10)
            const pageSize = parseInt(q.fromPageSize, 10)
            const fromStatus = q.fromStatus
            if (page >= 1) params.set('page', page)
            if (months >= 1) params.set('monthsBack', months)
            if (pageSize >= 1) params.set('pageSize', pageSize)
            if (fromStatus !== undefined && fromStatus !== '') params.set('status', String(fromStatus))
            const query = params.toString() ? '?' + params.toString() : ''
            this.$router.push('/admin/account/batch' + query)
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
                await this.getBatch(true);
                if (this.paymentState !== 'BankFileCreated') {
                    this.bankFileCreatedLocal = true;
                    this.persistBankFileCreated(this.$route.params.batch_id);
                }
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
        displayBatchState() {
            if (this.shouldShowBankFileCreatedOverride()) {
                return 'BankFileCreated';
            }
            return this.paymentState;
        },
    },
    watch: {
        async '$route.params.batch_id'() {
            this.bankFileCreatedLocal = false;
            await this.getBatch();
        },
    },
}
</script>