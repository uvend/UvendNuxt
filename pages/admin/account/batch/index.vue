<template>
    <div class="h-screen">
        <div class="flex flex-row justify-between items-center w-full">
            <div class="flex w-full">
                <div class="flex flex-row justify-between w-full">
                    <div class="flex items-center gap-1.5">
                        <NumberField class="w-24" v-model="monthsBack">
                            <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                            </NumberFieldContent>
                        </NumberField>
                        <Select v-model="selectedStatus">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="state in status" :value="state.value">
                                    {{ state.label }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <div>
                            <Button variant="secondary" @click="changePage(currentPage-1)"><Icon name="lucide:chevron-left" class="w-5 h-5"/></Button>
                            <Button variant="secondary" @click="changePage(currentPage+1)"><Icon name="lucide:chevron-right" class="w-5 h-5"/></Button>
                        </div>
                        <MyPaymentSortPopover />
                    </div>
                </div>
            </div>
        </div>
        <hidden>
            search pages {{ totalPages }} current page {{ currentPage }} page size {{ pageSize }}
        </hidden>
        <MySkeletenCardList v-if="isLoading"/>
        <div v-else>
            <div class="flex flex-row justify-between w-full items-center bg-gray-50 p-1 my-1 rounded">
                <p class="font-bold">
                    {{ rangeStart }} - {{ rangeEnd }}
                </p>
                <p class="w-fit text-center font-bold">
                    <Badge>{{ totalBatches  }}</Badge>
                    R {{ totalBatchesAmount }}
                </p>
            </div>
            <MyBatchCard v-for="batch in paginatedBatch" :batch="batch"/>
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
            isLoading: true,
            batches: [],
            monthsBack: 1,
            status: [
                {
                    label: "Any",
                    value: -1
                },{
                    label: "Submit",
                    value: 5,
                },{
                    label: "Settled",
                    value: 10
                },{
                    label: "Cancelled",
                    value: 99
                }
            ],
            selectedStatus: -1,
            pageSize: 10,
            currentPage: 1,
            totalBatches: 0,
            totalBatchesAmount: 0,
            rangeStart: '',
            rangeEnd: ''

        }
    },
    methods:{
        async getBatch(){
            this.isLoading = true
            const result = await $fetch(`https://admin-api.vendease.co.za/api/AdminSystem/TransactionBatchPayment/GetCurrentBatchList`,{
                method: "GET",
                params: {
                    "GoBackMonths" : this.monthsBack,
                    "BatchPaymentState" : this.selectedStatus
                },
                headers: {
                    'authorization' : 'Basic amFyZWRsZWVAYWRtaW46amFyZWQx'
                }
            });
            this.batches = result.batchList;
            this.totalBatches = this.batches.length
            this.rangeStart = this.dateFormatter(result.rangeSelectStartDate)
            this.rangeEnd = this.dateFormatter(result.rangeSelectEndDate)
            this.isLoading = false;
        },
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        dateFormatter(date){
            return new Date(date).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
    },
    async mounted(){
        await this.getBatch()
    },
    computed:{
        totalPages() {
            return Math.ceil(this.batches.length / this.pageSize);
        },
        paginatedBatch() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.batches.slice(startIndex, endIndex); // Paginate filtered payments
        },
        totalBatchesAmount() {
            return this.batches.reduce((total, batch) => {
                return total + (parseFloat(batch.payeePayOutAmount) || 0); // Replace 'amount' with the correct property name
            }, 0).toFixed(2); // Format to two decimal places
        },
    },
    watch: {
        async monthsBack(newValue) {
            if (newValue < 1) {
                this.monthsBack = 1; // Reset to 1 if the new value is less than 1
            } else {
                await this.getBatch(); // Call getPayments whenever monthsBack changes and is valid
            }
        },
        async selectedStatus(newValue){
            console.log(newValue)
            await this.getBatch()
        }
    },
}
</script>
<style>
hidden{
    display: none;
}
</style>