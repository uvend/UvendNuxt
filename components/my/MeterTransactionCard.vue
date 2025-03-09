<template>
    <Card class="w-full p-2 my-2" :class="statement ? 'statement-card' : 'transaction-card'">
        <div class="flex flex-col justify-center">
            <p class="font-bold">
                {{ transaction.meterNumber }}
            </p>
            <p class="text-sm font-light">
                {{ transaction.complexName }}
            </p>
        </div>
        <div>
            <p class="font-bold">
                {{ transaction.freeUnits }}
            </p>
            <p class="text-sm font-light">Free</p>
        </div>
        <div>
            <p class="font-bold">
                {{ transaction.totalUnitsIssued }}
            </p>
            <p class="text-sm font-light">Purchase</p>

        </div>
        <div>
            <p class="font-bold">
                {{ transaction.totalUnitsIssued }}
            </p>
            <div v-if="transaction.utilityType == 'Water'" class="flex">
                <p class="text-sm font-light">KL</p>
            </div>
            <div v-if="transaction.utilityType == 'Electricity'" class="flex">
                <p class="text-sm font-light">KWh</p>
            </div>
        </div>
        <div>
            <p class="font-bold">
                R{{ transaction.managedTenderAmount }}
            </p>
            <p class="text-sm font-light">Amount</p>
        </div>
        <div>
            <p class="font-bold">
                R{{ transaction.commissionAmountEx }}
            </p>
            <p class="text-sm font-light">Service Fee<br>(ex VAT)</p>
        </div>
        <div>
            <p class="font-bold">
                R{{ transaction.commissionAmount }}
            </p>
            <p class="text-sm font-light">Service Fee<br>(inc VAT)</p>
        </div>
        <div>
            <p class="font-bold">
                R{{ (parseFloat(transaction.managedTenderAmount) - parseFloat(transaction.commissionAmount)).toFixed(2)}}
            </p>
            <p class="text-sm font-light">Refund</p>
        </div>
        <div class="text-center" v-if="!statement">
            {{ formattedTime(transaction.transactionDate) }}<br>
            {{ formatedDate(transaction.transactionDate) }}
        </div>
    </Card>
</template>
<script>
import Statement from '~/pages/my/[customer_id]/statement.vue';

export default{
    props:{
        transaction: Object,
        statement: {
            type: Boolean,
            value: false
        }
    },
    methods:{
        formatedDate(dateString){
            return new Date(dateString).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        formattedTime(dateString){
            const date = new Date(dateString);
            const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
            const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
            const seconds = String(date.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero
            return `${hours}:${minutes}`;
        }
    }
}
</script>
<style>
.statement-card{
    display: grid;
    grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr;
}
.transaction-card{
    display: grid;
    grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr;
    cursor: pointer;
}
</style>