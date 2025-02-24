<template>
    <Card class="transaction-card w-full p-2 my-2">
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
    </Card>
</template>
<script>
export default{
    props:{
        transaction: Object 
    }
}
</script>
<style>
.transaction-card{
    display: grid;
    grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr;
    cursor: pointer;
}
</style>