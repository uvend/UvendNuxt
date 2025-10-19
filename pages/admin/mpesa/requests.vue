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
                        <p class="ml-4" v-html="(request.Message || 'No message available').replace(/\n/g, '<br>')"></p>
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
        async getSMSBalance(){
            this.smsBalance = null;
            const response = await $fetch(`${MPESA_URL}/status`,{
                method: "GET"
            })
            console.log(response)
            this.smsBalance = response.checks.sms_balance;
        },
        debouncedSearch: debounce(async function(){
            this.page = 1
            this.getRequests()
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
        formattedTime(dateString){
            const date = new Date(dateString);
            const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
            const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
            const seconds = String(date.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero
            return `${hours}:${minutes}`;
        },
        changePage(page){
            console.log('changePage',page)
            if(page > this.totalPages || page < 1){
                return;
            }
            this.page = page
        },
        async getAllTransactions(){
            this.isLoading = true
             const response = await $fetch(`${MPESA_URL}/api/admin/transactions`,{
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
             this.requests = response.transactions
             this.isLoading = false
        }
    },
    mounted(){
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(today.getDate()-30)
        this.dateRange = {
            start: lastMonth.toISOString(),
            end: today.toISOString()
        }
        this.getSMSBalance();
       // this.getRequests()
    },
    watch:{
        dateRange:{
            handler(value,newValue){
                if(value && value !== newValue){
                    this.getAllTransactions()
                }
            },
            deep: true,
            immediate: true
        },
        page:{
            handler(value,newValue){
                if(value && value !== newValue){
                    this.getAllTransactions()
                }
            },
            deep: true,
            immediate: true
        },
        pageSize:{
            handler(value,newValue){
                if(value && value !== newValue){
                    this.getAllTransactions()
                }
            },
            deep: true,
            immediate: true
        },
        search:{
            handler(value,newValue){
                if(value && value !== newValue){
                    this.getAllTransactions()
                }
            },
            deep: true,
            immediate: true
        }
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