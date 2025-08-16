<template>
    <Card class="w-full p-2 my-2" :class="statement ? 'statement-card' : 'transaction-card'" @click="getTransaction()">
        <div class="flex flex-col justify-center">
            <p class="font-bold">
                {{ transaction.meternumber }}
            </p>
            <p class="text-sm font-light">
                {{ transaction.complexDescription }}
            </p>
        </div>
        <div v-if="statement || transactionType == 'VendingToken'" :class="statement || transactionType == 'VendingToken' ? 'credit-token' : ''">
        <div>
            <p class="font-bold">
                {{ transaction.tenderedamountexvat }}
            </p>
            <p class="text-sm font-light">Amount</p>
        </div>
        <div>
            <p class="font-bold">
                {{ transaction.surchargeAmount }}
            </p>
            <p class="text-sm font-light">Surcharge</p>
            <p class="text-sm font-light">
                {{ transaction.surcharge }} %
            </p>
        </div>
        <div>
            <p class="font-bold">
                {{ transaction.vendamountexvat }}
            </p>
            <p class="text-sm font-light">Tendered</p>
            <p class="text-sm font-light">
                {{ transaction.totalunitsissued }} {{ transaction.utilitytype == 1 ? 'KWh' : 'KL' }}
            </p>

        </div>
        <div>
            <div>
                <p class="font-bold">
                    {{ transaction.vendfeeAmount }} <span class="text-sm font-light">(ex VAT)</span>
                </p>
                <p class="text-sm font-light">Service Fee</p>
            </div>
            <div>
                <p class="text-sm font-light">
                {{ transaction.vendfee }} %
            </p>
            </div>
        </div>
        <!-- <div>
            <p class="font-bold">
                {{ transaction.commissionAmount }}
            </p>
            <p class="text-sm font-light">Service Fee<br>(inc VAT)</p>
        </div>
        <div>
            <p class="font-bold">
                {{ refund }}
            </p>
            <p class="text-sm font-light">Refund</p>
        </div> -->
        </div>
        <div v-if="!statement && transactionType != 'VendingToken'">
            <p class="font-bold">{{ transactionType }}</p>
        </div>
        <div class="text-center" v-if="!statement">
            {{ formattedTime(transaction.row_creation_date) }}<br>
            {{ formatedDate(transaction.row_creation_date) }}
        </div>
    </Card>
    <Dialog v-model:open="ticketOpen">
        <DialogContent>
        <DialogHeader>
            <DialogTitle>{{ ticket.meterNumber }}</DialogTitle>
            <DialogDescription>
                {{ ticket.transactionDate.replace('T',' ') }}
            </DialogDescription>
        </DialogHeader>
        <div class="formatted-text">
            <div class="flex justify-between">
                <p class="font-bold">Vendor</p>
                <p>{{ ticket.vendorName }}</p>
            </div>
            <div class="flex justify-between">
                <p class="font-bold">Utility</p>
                <p>{{ ticket.utilityType }}</p>
            </div>
            <div v-if="ticket.meterTokenType === 'VendingToken'">
                <div class="flex justify-between">
                    <p class="font-bold">Amount</p>
                    <p>{{ ticket.tenderedAmount }}</p>
                </div>
                <hr>
                <div class="flex justify-between">
                    <p class="font-bold">Units</p>
                    <p>{{ ticket.paidUnits }}</p>
                </div>
                <div class="flex justify-between">
                    <p class="font-bold">Free</p>
                    <p>{{ ticket.freeUnits }}</p>
                </div>
                <div class="flex justify-between">
                    <p class="font-bold">Other</p>
                    <p>{{ ticket.otherUnits }}</p>
                </div>
                <hr>
                <div class="flex justify-between">
                    <p class="font-bold">Total</p>
                    <p>{{ ticket.totalUnitsIssued }}</p>
                </div>
                <hr>
            </div>
            <div v-else class="flex justify-between">
                <p class="font-bold">Token Type</p>
                <p>{{ ticket.meterTokenType }}</p>
            </div>
            <div class="flex justify-between">
                <p class="font-bold">Token</p>
                <p>
                    <span v-for="token in ticket.tokenNumbers" class="pt-2">
                        {{  addHyphens(token) }}
                    </span>
                </p>
            </div>
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
            this.ticket = this.transaction
            console.log(this.ticket)
            this.ticketOpen = true;
        },
        addHyphens(str){
            return str.replace(/(.{4})/g, '$1-').slice(0, -1); // Removes last extra hyphen
        }
    },
    computed:{
        transactionType(){
            if(this.transaction.metertokentype == 16385){
                return 'VendingToken';
            }
            return 'Unknown';
        },
        refund: {
            get(){
                var refund = this.transaction.refund || 0
                return refund
            }
        }
    }
}
</script>
<style>
.statement-card{
    display: grid;
    grid-template-columns: 1fr 3fr;
}
.transaction-card{
    display: grid;
    grid-template-columns: 1.5fr 3fr 0.5fr;
    cursor: pointer;
}
.credit-token{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}
.formatted-text {
  white-space: pre; /* Preserves formatting exactly as in the string */
}
</style>