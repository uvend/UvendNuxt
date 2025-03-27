<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                <MyDateRangePicker v-model="dateRange" :months="2" v-if="dateRange" />
            </div>
        </div>
            <div class="flex flex-row w-fit gap-1">
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
                <div>
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
        <Dialog v-for="request in requests">
            <DialogTrigger as-child>
                <Card  class="p-2 my-2 mpesa-request-card items-center">
                    <div v-if="request.endpoint == 'v'" class="text-center">
                        <Icon name="lucide:shield" />
                    </div>
                    <div v-if="request.endpoint == 'c'" class="text-center">
                        <Icon name="lucide:shield-check" />
                    </div>
                    <div class="font-bold">{{ request.transID }}</div>
                    <div class="flex flex-col justify-center items-center">
                        <div>
                            <p class="text-sm flex">Business Code</p>
                            <p class="text-base font-bold">{{ request.businessShortCode }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center">
                        <div>
                            <p class="text-sm flex">Bill Ref</p>
                            <p class="text-base font-bold">{{ request.billRefNumber }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center">
                        <div>
                            <p class="text-sm flex">Phone</p>
                            <p class="text-base font-bold">{{ request.msisdn }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center">
                        <div>
                            <p class="text-sm flex justify-end">Amount</p>
                            <p class="text-base font-bold">{{ request.transAmount.toFixed(2) }}</p>
                        </div>
                    </div>
                    <div class="text-center">
                        {{ formattedTime(request.createdAt)}}<br>
                        {{ formatedDate(request.createdAt) }}
                    </div>
                    <div class="font-bold">{{ request.statusCode }}</div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{ request.transID }}</DialogTitle>
                    <DialogDescription>
                        {{ formattedTime(request.createdAt) }} {{ formatedDate(request.createdAt) }}
                    </DialogDescription>
                </DialogHeader>
                <div class="formatted-text">
                    <div class="flex justify-between">
                        <p class="font-bold">Business Code</p>
                        <p>{{ request.businessShortCode }}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold">Bill Reference</p>
                        <p>{{ request.billRefNumber }}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold">Phone Number</p>
                        <p>{{ request.msisdn }}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold">Amount</p>
                        <p>{{ request.transAmount.toFixed(2) }}</p>
                    </div>
                    <!--<div class="flex justify-between">
                        <p class="font-bold">Status Code</p>
                        <p>{{ request.statusCode }}</p>
                    </div>-->
                    <div class="flex justify-between">
                        <p class="font-bold">Endpoint</p>
                        <p>{{ request.endpoint === 'v' ? 'Validation' : 'Confirmation' }}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold">Message</p>
                        <p>{{ request.message || 'No message available' }}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button @click="ressend(request.id)" v-if="request.message">
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
                10,50,100,200
            ],
            isLoading: true,
            requests: [],
            totalPages: 0,
            dateRange: null,
            smsBalance: null
        }
    },
    methods:{
        async getRequests(){
            await this.getSMSBalance()
            this.isLoading = true
            const response = await $fetch(`${MPESA_URL}/getallrequest`,{
                method: "GET",
                options: {
                    'Content-Type': 'application/json'
                },
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    fromDate: this.dateRange.start,
                    toDate: this.dateRange.end
                },
                //mode: 'no-cors'
            })
            console.log(response)
            this.requests = response.data
            this.totalPages = response.totalPages
            this.isLoading = false
        },
        async getSMSBalance(){
            this.smsBalance = null;
            const response = await $fetch(`${MPESA_URL}/checkbalance`,{
                method: "GET"
            })
            console.log(response)
            this.smsBalance = response.balance;
        },
        ressend: debounce(async function (id){
            try{
                const response = await $fetch(`${MPESA_URL}/resend`,{
                    params : {
                        id : id
                    }
                })
                this.$toast({
                    title: 'Success',
                    variant: "success"
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
            if(page > this.totalPages || page < 1){
                return;
            }
            this.page = page
        }
    },
    mounted(){
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(today.getDate()-30)
        this.dateRange = {
            start : lastMonth.toISOString(),
            end : today.toISOString()
        }
        this.getRequests()
    },
    watch:{
        dateRange(){
            this.getRequests()
        },
        page(){
            this.getRequests()
        }
    }
}
</script>
<style>
.mpesa-request-card{
    display: grid;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    cursor: pointer;
}
</style>