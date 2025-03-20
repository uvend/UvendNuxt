<template>
    <Card class="w-full p-2 my-2" :class="statement ? 'statement-card' : 'transaction-card'" @click="getTransaction()">
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
                {{ transaction.managedTenderAmount }}
            </p>
            <p class="text-sm font-light">Amount</p>
        </div>
        <div>
            <p class="font-bold">
                {{ transaction.commissionAmountEx }}
            </p>
            <p class="text-sm font-light">Service Fee<br>(ex VAT)</p>
        </div>
        <div>
            <p class="font-bold">
                {{ transaction.commissionAmount }}
            </p>
            <p class="text-sm font-light">Service Fee<br>(inc VAT)</p>
        </div>
        <div>
            <p class="font-bold">
                {{ (parseFloat(transaction.managedTenderAmount) - parseFloat(transaction.commissionAmount)).toFixed(2)}}
            </p>
            <p class="text-sm font-light">Refund</p>
        </div>
        <div class="text-center" v-if="!statement">
            {{ formattedTime(transaction.transactionDate) }}<br>
            {{ formatedDate(transaction.transactionDate) }}
        </div>
    </Card>
    <Dialog v-model:open="ticketOpen">
        <DialogContent>
        <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
            </DialogDescription>
        </DialogHeader>
        <div class="formatted-text">
            {{ ticket.listOfTokenTransactions[0].printJob }}
        </div>
        <DialogFooter>
        </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
<script>
export default{
    props:{
        transaction: Object,
        statement: {
            type: Boolean,
            value: false
        }
    },
    data(){
        return {
            ticket: null,
            ticketOpen: false
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
        },
        async getTransaction(){
            if(this.statement) return;
            const response = await useAuthFetch(`${VEND_URL}/MeterVend/GetTransactionInfo`,{
                method: "GET",
                params: {
                    "MeterNumber" : this.transaction.meterNumber,
                    "ApiUserParams.TerminalID" : this.transaction.merchantPosTerminalID,
                    "ApiUserParams.OperatorID" : this.transaction.merchantOperatorID,
                    "ApiUserParams.RequestID" : this.transaction.transactionUniqueId
                }
            })
            console.log(response)
            this.ticket = response
            this.ticketOpen = true;
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
.formatted-text {
  white-space: pre; /* Preserves formatting exactly as in the string */
  font-family: monospace; /* Ensures consistent spacing */
  text-align: center;
  font-size: 12px;
}
</style>