<template>
    <Card class="batch-payment-card w-full p-2 my-2">
        <div class="flex flex-col justify-center p-2">
            <p class="text-base font-bold">{{ payment.payeeInfo.description }}</p>
            <p class="text-sm font-light">{{ payment.payeeInfo.address[0] }} {{ payment.payeeInfo.address[1] }}</p>
            <p class="text-sm font-light">{{ payment.payeeInfo.address[2] }}</p>
        </div>
        <div class="flex flex-col justify-center items-center">
            <p class="text-sm">{{ formattedStartDate }}</p>
            <p class="text-sm">{{ formattedEndDate }}</p>
        </div>
        <div class="flex items-center">
            <Icon name="lucide:credit-card" class="w-5 h-5" v-if="payment.payeeBankingInfo.hasValidBankDetails"/>
        </div>
        <div class="flex items-center">
            <Icon name="lucide:mail" class="w-5 h-5" v-if="payment.payeeInfo.isValidEmailAddress"/>
        </div>
        <div class="flex flex-col justify-center items-center">
            <div>
                <p class="text-sm flex justify-end">Total</p>
                <p class="text-base font-bold">R {{ payment.periodTotals.totalIncomeFromVending.toFixed(2) }}</p>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center">
            <div>
                <p class="text-sm flex justify-end">{{ payment.periodTotals.vendCommissionPercentage }}%</p>
                <p class="font-bold">R {{ payment.periodTotals.totalDeductionInclVat.toFixed(2) }}</p>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center">
            <div>
                <Badge :class="[payment.periodTotals.batchPaymentState == 'Settled' ? 'bg-green-500' : '' ]">{{ payment.periodTotals.batchPaymentState }}</Badge>
                <p class="w-full text-center font-bold">R {{ payment.periodTotals.payeePayOutAmount.toFixed(2) }}</p>
            </div>
        </div>
        <div class="flex flex-row justify-center items-center text-center">
            <div v-if="payment.periodTotals.batchPaymentState == 'Settled'">
                <p class="text-sm">{{ setteledTime }}</p>
                <p class="text-sm">{{ settledDate }}</p>
            </div>
            <MyBatchRollBackDialog :batch="[payment]" :all="false" v-if="payment.periodTotals.batchPaymentState != 'Settled'"/>
        </div>
    </Card>

</template>
<script>
export default{
    props:{
        payment: Object
    },
    computed:{
        formattedStartDate() {
            return new Date(this.payment.periodTotals.transactionPeriodStartDate).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        formattedEndDate() {
            return new Date(this.payment.periodTotals.transactionPeriodEndDate).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        settledDate(){
            return new Date(this.payment.periodTotals.batchCompletionDate).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        setteledTime(){
            const date = new Date(this.payment.periodTotals.batchCompletionDate);
            const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
            const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
            const seconds = String(date.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero
            return `${hours}:${minutes}`;
        },
    }
}
</script>
<style>
hidden{
    display: none;
}
.batch-payment-card{
    display: grid;
    grid-template-columns: 3fr 2fr 0.5fr 0.5fr 1fr 1fr 1fr 1fr;
}
</style>