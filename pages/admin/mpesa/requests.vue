<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                    <MyDateRangePicker v-model="dateRange" :months="2" v-if="dateRange" />
                    <div class="flex flex-row gap-1">
                        <Button variant="secondary" @click="toggleSearch"><Icon name="lucide:search"/></Button>
                        <Input type="text" placeholder="Search" v-if="searchActive" v-model="search" @input="debouncedSearch"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-row w-fit gap-2">
                <Select  v-model="pageSize">
                    <SelectTrigger class="w-[80px]">
                        <SelectValue placeholder="Page Size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="size in pageSizeSelect" :value="size">
                            {{ size }}
                        </SelectItem>
                    </SelectContent>
                    </Select>
                <div class="flex flex-row gap-1">
                    <Button variant="secondary" @click="changePage(page-1)"><Icon name="lucide:chevron-left" class="w-5 h-5"/></Button>
                    <Button variant="secondary" @click="changePage(page+1)"><Icon name="lucide:chevron-right" class="w-5 h-5"/></Button>
                </div>
            </div>
        </div>
    </div>
    <MySkeletenCardList v-if=isLoading />
    <div v-else>
        <div class="flex justify-between pt-2">
            <div>
            </div>
            <div>
                <div v-if="smsBalance" class="flex flex-col justify-end">
                    <p class="text-sm">SMS Balance</p>
                    <p class="text-base font-bold text-right">{{ smsBalance }}</p>
                </div>
                <div v-else-if="smsBalanceMessage" class="flex flex-col justify-end">
                    <p class="text-sm text-muted-foreground">{{ smsBalanceMessage }}</p>
                </div>
            </div>
        </div>
        <Dialog v-for="request in requests"
                :open="activeDialogRequestId === request.id"
                @update:open="val => activeDialogRequestId = val ? request.id : null">
            <DialogTrigger as-child>
                <Card  class="p-2 my-2 mpesa-request-card items-center">
                    <div v-if="request.Endpoint == 'v'" class="text-center">
                        <Icon name="lucide:shield" />
                    </div>
                    <div v-if="request.Endpoint == 'c'" class="text-center">
                        <Icon name="lucide:shield-check" />
                    </div>
                    <div class="font-bold">{{ request.TransID }}</div>
                    <div class="flex flex-col justify-center items-center">
                        <div>
                            <p class="text-sm flex">Business Code</p>
                            <p class="text-base font-bold">{{ request.BusinessShortCode }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-left">
                        <div>
                            <p class="text-sm flex">Bill Ref</p>
                            <p class="text-base font-bold">{{ request.BillRefNumber }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-left">
                        <div>
                            <p class="text-sm flex">Phone</p>
                            <p class="text-base font-bold">{{ request.MSISDN }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center">
                        <div>
                            <p class="text-sm flex justify-end">Amount</p>
                            <p class="text-base font-bold">{{ request.TransAmount }}</p>
                        </div>
                    </div>
                    <div class="text-center">
                        {{ formattedTime(request.CreatedAt) }}<br>
                        {{ formatedDate(request.CreatedAt) }}
                    </div>
                    <div class="font-bold">{{ request.StatusCode }}</div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{ request.TransID }}</DialogTitle>
                    <DialogDescription>
                        {{ formattedTime(request.CreatedAt) }} {{ formatedDate(request.CreatedAt) }}
                    </DialogDescription>
                </DialogHeader>
                <div class="formatted-text">
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Business Code</p>
                        <p class="ml-4">{{ request.BusinessShortCode }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Bill Reference</p>
                        <p class="ml-4">{{ request.BillRefNumber }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Phone Number</p>
                        <p class="ml-4">{{ request.MSISDN }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Amount</p>
                        <p class="ml-4">{{ request.TransAmount }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid" v-if="request.StatusCode">
                        <p class="font-bold">Status Code</p>
                        <p class="ml-4">{{ request.StatusCode }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Endpoint</p>
                        <p class="ml-4">{{ request.Endpoint === 'v' ? 'Validation' : 'Confirmation' }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Message</p>
                        <p class="ml-4" v-html="getRequestMessage(request)"></p>
                    </div>
                    <div class="dialog-mpesa-request-grid" v-if="getRequestTokens(request)">
                        <p class="font-bold">Token</p>
                        <p class="ml-4">{{ getRequestTokens(request) }}</p>
                    </div>
                </div>
                <DialogFooter class="flex">
                    <Button @click="resend(request.id)" v-if="request.Message" class="w-full">
                        Resend SMS
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
        return{
            page: 1,
            pageSize: 10,
            pageSizeSelect: [
                10,50,100
            ],
            isLoading: true,
            requests: [],
            totalPages: 0,
            dateRange: {
                start: new Date(new Date().setDate(new Date().getDate()-30)).toISOString(),
                end: new Date().toISOString()
            },
            smsBalance: null,
            smsBalanceMessage: '',
            searchActive: false,
            search: '',
            hasNextPage: false,
            activeDialogRequestId: null,
        }
    },
    methods:{
        toggleSearch(){
            this.searchActive = !this.searchActive
        },
        formatDate(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        },
        /** Base URL for M-Pesa API (no trailing slash). */
        mpesaApiBase() {
            return (typeof MPESA_URL === 'string' ? MPESA_URL : '').replace(/\/$/, '');
        },
        /**
         * GET `/status` — balance lives at `checks.sms_balance`, e.g.
         * `{ status, service, timestamp, checks: { database, vendease, sms, sms_balance } }`
         */
        parseBalanceFromStatusResponse(data) {
            if (!data || typeof data !== 'object') return null;
            const checks = data.checks;
            if (!checks || typeof checks !== 'object') return null;
            const raw = checks.sms_balance ?? checks.smsBalance;
            if (raw == null || raw === '') return null;
            const n = Number(raw);
            return Number.isNaN(n) ? null : n;
        },
        /** SMS balance is read only from `GET /status` → `checks.sms_balance`. */
        async getSMSBalance(){
            this.smsBalance = null;
            this.smsBalanceMessage = '';
            const base = this.mpesaApiBase();
            if (!base) {
                this.smsBalanceMessage = 'MPESA_URL is not configured';
                return;
            }

            try {
                const data = await $fetch(`${base}/status`, { method: 'GET' });
                const balance = this.parseBalanceFromStatusResponse(data);
                if (balance != null) {
                    this.smsBalance = balance;
                    return;
                }
                this.smsBalanceMessage = 'Unable to load SMS balance';
            } catch (e) {
                this.smsBalanceMessage = 'Unable to load SMS balance';
                console.error('SMS balance: GET /status failed', base, e);
            }
        },
        debouncedSearch: debounce(async function(){
            this.page = 1
            this.getAllTransactions()
        }),
        resend: debounce(async function (id){
            try{
                const response = await $fetch(`${MPESA_URL}/api/admin/resend-sms`,{
                    params : {
                        id : id
                    }
                })
                this.activeDialogRequestId = null;
                this.$toast({
                    title: 'Success',
                    description: 'SMS sent successfully',
                });
                this.getSMSBalance();

            }catch(e){
                console.log(e);
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                });
            }
        }, 500),
        formatedDate(dateString){
            return new Date(dateString).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        getRequestMessage(request){
            return (request?.Message || 'No message available').replace(/\n/g, '<br>');
        },
        getRequestTokens(request){
            const relatedTransaction = request?.relatedTransaction || request?.RelatedTransaction;
            const jsonData = relatedTransaction?.JsonData || relatedTransaction?.jsonData;
            const tokenTxns = jsonData?.ListOfTokenTransactions || jsonData?.listOfTokenTransactions || [];

            const tokenNumbers = tokenTxns.flatMap((txn) => {
                const tokens = txn?.Tokens || txn?.tokens || [];
                return tokens
                    .map((token) => token?.DelimitedTokenNumber || token?.delimitedTokenNumber)
                    .filter(Boolean);
            });

            if (tokenNumbers.length > 0) {
                return tokenNumbers.join(', ');
            }

            return '';
        },
        formattedTime(dateString){
            const date = new Date(dateString);
            const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
            const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
            const seconds = String(date.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero
            return `${hours}:${minutes}`;
        },
        changePage(page){
            if (page < 1) return
            if (this.totalPages > 0 && page > this.totalPages) return
            this.page = page
        },
        async getAllTransactions(){
            this.isLoading = true
            try {
                const response = await $fetch(`${MPESA_URL}/api/admin/transactions`, {
                    params: {
                        page: this.page,
                        limit: this.pageSize,
                        fromDate: this.formatDate(this.dateRange.start),
                        toDate: this.formatDate(this.dateRange.end),
                        search: this.search
                    }
                })
                this.page = response.pagination.currentPage
                this.hasNextPage = response.pagination.hasNextPage
                this.pageSize = response.pagination.limit
                this.totalPages = response.pagination.totalPages
                this.requests = response.transactions || []
            } catch (e) {
                console.error('getAllTransactions', e)
                this.requests = []
                this.totalPages = 0
            } finally {
                this.isLoading = false
            }
        }
    },
    mounted(){
        this.getSMSBalance();
        this.getAllTransactions();
    },
    watch:{
        dateRange:{
            handler(newVal, oldVal){
                // Deep watch: new/old are often the same object reference; compare serialised range.
                if (oldVal === undefined) return;
                if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
                this.page = 1;
                this.getAllTransactions();
            },
            deep: true
        },
        page(newVal, oldVal){
            if (oldVal === undefined) return;
            if (newVal === oldVal) return;
            this.getAllTransactions();
        },
        pageSize(newVal, oldVal){
            if (oldVal === undefined) return;
            if (newVal === oldVal) return;
            this.page = 1;
            this.getAllTransactions();
        }
        // search: handled by debouncedSearch on input (avoids duplicate fetches vs v-model watcher)
    }
}
</script>
<style scoped>
.mpesa-request-card{
    display: grid;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    cursor: pointer;
}
.dialog-mpesa-request-grid{
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 100%;
}

.dialog-mpesa-request-grid p {
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
</style>