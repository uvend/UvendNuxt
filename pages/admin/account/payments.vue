<template>
    <div class="h-screen">
        <div class="flex flex-row justify-between items-center">
            <div class="">
                <div class="flex flex-row gap-1.5 w-fit items-bottom">
                    <NumberField class="w-24" v-model="monthsBack">
                        <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
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
            <div class="flex flex-row gap-x-1.5 items-center">
                <p :class="[disableBatch ? 'text-red-500' : 'text-green-500']">{{ selectedDifference }}</p>                
                <div class="relative w-full max-w-sm items-center">
                    <Input id="search" type="text" placeholder="Max" class="pl-10" v-model="maxBatch"/>
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                    <p>R</p>
                    </span>
                </div>
                <Button :disabled="disableBatch" @click="batch()">Batch</Button>
                <div class="flex flex-row w-fit">
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
                            <p class="text-sm flex justify-end">Selected</p>
                            <p class="w-full text-center font-bold"><Badge>{{ totalSelected  }}</Badge> R {{ totalSelectedAmount }}</p>
                        </div>
                        <div>
                            <p class="text-sm flex justify-end">Due</p>
                            <p class="w-full text-center font-bold"><Badge>{{ totalRepsonse  }}</Badge>
                                R {{ totalAmount }}</p>
                        </div>
                    </div>
            <div class="">
                <MyPaymentCard v-for="payment in paginatedPayments" :key="payment.uniqueIdentification" :payment="payment" @click="toggleSelectedCard(payment)" :class="[ selectedPayments.includes(payment) ? 'bg-blue-100 shadow' : '' ]" class="cursor-pointer"/>
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
        return {
            payments: [],
            selectedPayments: [],
            currentPage: 1,
            pageSize: 10,
            searchActive: false,
            search: '',
            totalAmount: 0,
            totalSelectedAmount: 0,
            totalSelected: 0,
            totalRepsonse: 0,
            disableBatch: true,
            maxBatch: null,
            monthsBack: 1,
            isLoading: true,
            disableBatch: true,
            selectedDifference: "0.00",
        }
    },
    methods:{
        toggleSearch(){
            this.searchActive = !this.searchActive;
            this.search = '';
        },
        _search(value) {
            //console.log("Search term:", value);
        },
        debouncedSearch: debounce(function () {
            this.currentPage = 1;
            this._search(this.search);
        }, 500), // Delay of 500ms after the user stops typing
        async getPayments(){
            this.isLoading = true
            const result = await useAuthFetch(`${API_URL}/AdminSystem/TransactionPeriod/GetCurrentTransactionPeriodTotals`,{
                method: "GET",
                params: {
                    "GoBackMonths" : this.monthsBack
                }
            });
            console.log(result)
            this.payments = result.value.listOfPeriodTotalsEntry

            this.totalRepsonse = this.payments.length;

            // Calculate total payments
            this.totalAmount = this.payments.reduce((total, payment) => {
                return total + (parseFloat(payment.periodTotals?.payeePayOutAmount) || 0);
            }, 0).toFixed(2); // Format to two decimal places

            // Sort payments
            this.payments.sort((a, b) => {
                if (a.payeeInfo.description < b.payeeInfo.description) {
                    return -1; // a comes before b
                }
                if (a.payeeInfo.description > b.payeeInfo.description) {
                    return 1;  // b comes before a
                }
                return 0; // a and b are equal
            });
            this.isLoading = false
        },
        toggleSelectedCard(uid) {
            if (this.selectedPayments.includes(uid)) {
                this.selectedPayments = this.selectedPayments.filter(id => id !== uid);
                //console.log('Payment removed:', uid);
            } else {
                this.selectedPayments.push(uid);
                //console.log('Payment added:', uid);
            }
            //console.log('Selected Payments:', this.selectedPayments);
            this.isBatchDisabled()
        },
        changePage(page) {
            // Ensure the page stays within valid range
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        filterPayments() {
            return this.payments.filter(payment => {
                if (payment.payeeInfo && payment.payeeInfo.description) {
                    //console.log(payment)
                    return payment.payeeInfo.description.toLowerCase().startsWith(this.search.toLowerCase());
                }
                return false; // If description doesn't exist, skip the payment
            });
        },
        isBatchDisabled(){
            let total = 0;
            this.selectedPayments.forEach((payment)=>{
                total += payment.periodTotals.payeePayOutAmount
            })

            if(isNaN(this.maxBatch)){
                this.disableBatch = true;
                this.maxBatch = 0;
                this.selectedDifference = 0;
                return 
            }

            this.maxBatch = parseFloat(this.maxBatch);
            //console.log(parseFloat(this.maxBatch), total)
            if(this.maxBatch >= total && this.selectedPayments.length > 0){
                this.disableBatch = false;
            }else{
                this.disableBatch = true;
            }

            this.selectedDifference = (this.maxBatch - total).toFixed(2);
        },
        async batch(){
            let preparedPayments = [];
            this.selectedPayments.forEach((payment)=>{
                let p = {
                    UniqueIdentification : payment.periodTotals.uniqueIdentification,
                    ActualTotalDeductionExVat: payment.periodTotals.totalDeductionExVat,
                    ActualTotalVatOnDeduction: payment.periodTotals.totalVatOnDeduction,
                    ActualPayeePayOutAmount: payment.periodTotals.payeePayOutAmount,
                    ActualPaymentComment: "",
                }
                preparedPayments.push(p);
            })
            try{
                const result = await useAuthFetch(`${API_URL}/AdminSystem/TransactionBatchPayment/SubmitPaymentBatch`,{
                    method: "POST",
                    body : {
                        batchPaymentDataCollection: preparedPayments
                    }
                })
                this.$toast({
                    title: 'Success',
                    description: result.paymentBatchID,
                    variant: "success"
                })
                //console.log(result);
                this.selectedPayments = []
                this.maxBatch = '0.00'
                await this.getPayments()
            }catch(e){
                console.log(e)
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                })
            }
        }
    },
    async mounted(){
        await this.getPayments()
    },
    watch: {
        monthsBack(newValue) {
            if (newValue < 1) {
                this.monthsBack = 1; // Reset to 1 if the new value is less than 1
            } else {
                this.getPayments(); // Call getPayments whenever monthsBack changes and is valid
            }
        },
        maxBatch(newValue){
            this.isBatchDisabled();
        }
    },
    computed: {
        totalPages() {
            // Calculate total pages based on the length of filtered payments and page size
            return Math.ceil(this.filterPayments().length / this.pageSize);
        },
        paginatedPayments() {
            const filtered = this.filterPayments();
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filtered.slice(startIndex, endIndex); // Paginate filtered payments
        },
        totalSelectedAmount() {
            return this.selectedPayments.reduce((total, payment) => {
                return total + (parseFloat(payment.periodTotals?.payeePayOutAmount) || 0);
            }, 0).toFixed(2); // Format to two decimal places
        },
        totalSelected() {
            return this.selectedPayments.length; // Count of selected payments
        },
    },
}
</script>
<style>
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
.hide-scrollbar {
scrollbar-width: none; /* Firefox */
}
hidden{
    display: none;
}
</style>