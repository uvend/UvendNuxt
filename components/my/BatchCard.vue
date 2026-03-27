<template>
    <Card class="batch-card w-full p-2 my-2 items-center" @click="openBatch">
        <div>
            <p class="text-sm font-light">Batch</p>
            <p class="text-base font-bold">{{ batch.paymentBatchId }}</p>
        </div>
        <div class="flex flex-col items-center">
            <p>{{ formattedTime }}</p>
            <p>{{ formattedDate }}</p>
        </div>
        <div>
            <p class="flex justify-center font-bold truncate"> {{ batch.numberOfBatchRecords }}</p>
        </div>
        <div class="flex flex-col justify-end items-end">
            <Badge :class="batchStateBadgeClass(effectiveBatchState)">{{ effectiveBatchState }}</Badge>
            <p class="font-bold flex flex-col">
                {{ batch.actualPayeePayOutAmount.toFixed(2) }}
            </p>
        </div>
        <div class="flex flex-col items-center" v-if="batch.batchPaymentState === 'Settled'">
            <p>{{ formattedSettledTime }}</p>
            <p>{{ formattedSettledDate }}</p>
        </div>
        <div v-else>
        </div>
    </Card>
</template>
<script>
export default{
    props:{
        batch: Object,
        currentPage: { type: Number, default: 1 },
        monthsBack: { type: Number, default: 1 },
        pageSize: { type: Number, default: 10 },
        selectedStatus: { type: Number, default: -1 }
    },
    methods: {
        bankFileSessionKey(batchId) {
            return `uvend:batchBankFileCreated:${batchId}`;
        },
        isBankFilePersistedForBatch(batchId) {
            if (!import.meta.client || batchId == null) return false;
            try {
                return sessionStorage.getItem(this.bankFileSessionKey(batchId)) === '1';
            } catch {
                return false;
            }
        },
        batchStateBadgeClass(state) {
            if (state === 'Settled') return 'bg-green-500 text-white border-transparent';
            if (state === 'SubmittedToBatch') return 'bg-orange-500 text-white border-transparent';
            if (state === 'BankFileCreated') return 'bg-blue-500 text-white border-transparent';
            return '';
        },
        openBatch() {
            const url = '/admin/account/batch/' + this.batch.paymentBatchId
            const params = new URLSearchParams()
            if (this.currentPage >= 1) params.set('fromPage', this.currentPage)
            if (this.monthsBack >= 1) params.set('fromMonths', this.monthsBack)
            if (this.pageSize >= 1) params.set('fromPageSize', this.pageSize)
            params.set('fromStatus', String(this.selectedStatus))
            const query = params.toString() ? '?' + params.toString() : ''
            this.$router.push(url + query)
        }
    },
    data(){
        return {
        }
    },
    computed:{
        effectiveBatchState() {
            const actual = this.batch?.batchPaymentState;
            if (actual === 'SubmittedToBatch' && this.isBankFilePersistedForBatch(this.batch?.paymentBatchId)) {
                return 'BankFileCreated';
            }
            return actual;
        },
        formattedDate(){
            return new Date(this.batch.batchSubmissionDate).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                time: 'short'
            });
        },
        formattedTime(){
            const date = new Date(this.batch.batchSubmissionDate);
            const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
            const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
            const seconds = String(date.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero
            return `${hours}:${minutes}`;
        },
        formattedSettledDate(){
            return new Date(this.batch.batchCompletionDate).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                time: 'short'
            });

        },
        formattedSettledTime(){
            const date = new Date(this.batch.batchCompletionDate);
            const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
            const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
            const seconds = String(date.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero
            return `${hours}:${minutes}`;
        }
    }
}
</script>
<style>
.batch-card{
    display: grid;
    grid-template-columns: 3fr 2fr 1fr 1fr 2fr;
    cursor: pointer;
}
</style>