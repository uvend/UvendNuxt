<template>
    <Card class="payment-card w-full p-2 my-2" :class="[payment.periodTotals.cancellationComment != '' ? 'bg-slate-300' : '']">
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
                <p class="text-base font-bold">{{ payment.periodTotals.totalIncomeFromVending.toFixed(2) }}</p>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center">
            <div>
                <p class="text-sm flex justify-end">{{ payment.periodTotals.vendCommissionPercentage }}%</p>
                <p class="font-bold">{{ payment.periodTotals.totalDeductionInclVat.toFixed(2) }}</p>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center">
            <div>
                <p class="text-sm flex justify-end">Due</p>
                <p class="w-full text-center font-bold">{{ payment.periodTotals.payeePayOutAmount.toFixed(2) }}</p>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center">
            <Icon name="lucide:undo-2" v-if="payment.periodTotals.cancellationComment != ''" class="w-h h-5"/>
        </div>
    </Card>
</template>
<script>
export default{
    props: {
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
    }
}
</script>
<style>
.payment-card{
    display: grid;
    grid-template-columns: 3fr 2fr 0.5fr 0.5fr 1fr 1fr 1fr 0.5fr;

}
</style>