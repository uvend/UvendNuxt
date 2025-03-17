<template>
    <Card class="batch-card w-full p-2 my-2 items-center" @click="navigateTo('/admin/account/batch/'+batch.paymentBatchId)">
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
            <Badge :class="[batch.batchPaymentState == 'Settled' ? 'bg-green-500' : '' ]">{{ batch.batchPaymentState }}</Badge>
            <p class="font-bold flex flex-col">
                {{ batch.actualPayeePayOutAmount.toFixed(2) }}
            </p>
        </div>
        <div class="flex flex-col items-center" v-if="batch.batchPaymentState == 'Settled'">
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
        batch: Object
    },
    data(){
        return {
        }
    },
    computed:{
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