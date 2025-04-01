<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1.5">
                <div class="flex gap-1.5 w-fit items-bottom">
                    <MyDateRangePicker v-model="dateRange" :months="2" v-if="dateRange" />
                    <div class="flex flex-row gap-1">
                        <Button variant="secondary" @click="toggleSearch"><Icon name="lucide:search"/></Button>
                        <Input type="text" placeholder="Search" v-if="searchActive" v-model="search" @input="debouncedSearch"/>
                    </div>
                </div>
                <!-- Filter buttons in dropdown -->
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="ghost" class="rounded-full px-2 py-3">
                            <Icon name="lucide:sliders-horizontal" class="w-5 h-5"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="toggleFilter('validation')" class="flex justify-between">
                            <p>Validation</p>
                            <Icon v-if="filters.validation" name="lucide:check" class="mr-1 h-4 w-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="toggleFilter('confirmation')" class="flex justify-between">
                            <p>Confirmation</p>
                            <Icon v-if="filters.confirmation" name="lucide:check" class="mr-1 h-4 w-4" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div class="flex flex-row w-fit gap-1">
                <Select v-model="pageSize">
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
                <!-- Filter indicators -->
                <div class="flex gap-2" v-if="anyFilterActive">
                    <Badge v-if="filters.validation" variant="outline" class="flex gap-1 items-center">
                        Validation
                        <button @click="toggleFilter('validation')" class="ml-1">
                            <Icon name="lucide:x" class="h-3 w-3" />
                        </button>
                    </Badge>
                    <Badge v-if="filters.confirmation" variant="outline" class="flex gap-1 items-center">
                        Confirmation
                        <button @click="toggleFilter('confirmation')" class="ml-1">
                            <Icon name="lucide:x" class="h-3 w-3" />
                        </button>
                    </Badge>
                </div>
            </div>
            <div>
                <div v-if="smsBalance" class="flex flex-col justify-end">
                    <p class="text-sm">SMS Balance</p>
                    <p class="text-base font-bold text-right">{{ smsBalance }}</p>
                </div>
            </div>
        </div>
        <Dialog v-for="request in filteredRequests" :key="request.id">
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
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Business Code</p>
                        <p class="ml-4">{{ request.businessShortCode }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Bill Reference</p>
                        <p class="ml-4">{{ request.billRefNumber }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Phone Number</p>
                        <p class="ml-4">{{ request.msisdn }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Amount</p>
                        <p class="ml-4">{{ request.transAmount.toFixed(2) }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Status Code</p>
                        <p class="ml-4">{{ request.statusCode }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Endpoint</p>
                        <p class="ml-4">{{ request.endpoint === 'v' ? 'Validation' : 'Confirmation' }}</p>
                    </div>
                    <div class="dialog-mpesa-request-grid">
                        <p class="font-bold">Message</p>
                        <p class="ml-4">{{ request.message || 'No message available' }}</p>
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
            filteredData: [],
            totalPages: 0,
            dateRange: null,
            smsBalance: null,
            searchActive: false,
            search: '',
            filters: {
                validation: false,
                confirmation: false
            }
        }
    },
    methods:{
        async getRequests(){
            await this.getSMSBalance()
            this.isLoading = true
            
            // Create params object
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                fromDate: this.dateRange.start,
                toDate: this.dateRange.end
            };
            
            // Only add search param if it's not empty
            if (this.search && this.search.trim() !== '') {
                params.search = this.search.trim();
            }
            
            try {
                const response = await $fetch(`${MPESA_URL}/getallrequest`, {
                    method: "GET",
                    params: params
                });
                
                console.log('API Response:', response);
                this.requests = response.data;
                this.totalPages = response.totalPages;
            } catch (error) {
                console.error('Error fetching requests:', error);
                this.$toast({
                    title: 'Error',
                    description: 'Failed to load requests',
                    variant: "destructive"
                });
            } finally {
                this.isLoading = false;
            }
        },
        async getSMSBalance(){
            this.smsBalance = null;
            const response = await $fetch(`${MPESA_URL}/checkbalance`,{
                method: "GET"
            })
            console.log(response)
            this.smsBalance = response.balance;
        },
        toggleSearch() {
            this.searchActive = !this.searchActive;
            if (!this.searchActive) {
                this.search = '';
                this.getRequests();
            }
        },
        debouncedSearch: debounce(function() {
            this.page = 1; // Reset to first page when searching
            this.getRequests();
        }, 500),
        toggleFilter(filterName) {
            this.filters[filterName] = !this.filters[filterName];
            this.page = 1; // Reset to first page when filter changes
        },
        ressend: debounce(async function (id){
            try{
                // Show a loading toast
                this.$toast({
                    title: 'Sending SMS...',
                    description: 'Please wait while we resend the SMS',
                    variant: "default"
                });
                
                const response = await $fetch(`${MPESA_URL}/resend`,{
                    params : {
                        id : id
                    }
                })
                
                this.$toast({
                    title: 'SMS Sent',
                    description: 'SMS has been successfully sent',
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
    computed: {
        filteredRequests() {
            if (!this.anyFilterActive) {
                return this.requests;
            }
            
            return this.requests.filter(request => {
                // Check if request matches any of the active filters
                if (this.filters.validation && request.endpoint === 'v') {
                    return true;
                }
                if (this.filters.confirmation && request.endpoint === 'c') {
                    return true;
                }
                // If no filter matches and filters are active, exclude this item
                return false;
            });
        },
        anyFilterActive() {
            return this.filters.validation || this.filters.confirmation;
        }
    },
    watch:{
        dateRange(){
            this.getRequests()
        },
        page(){
            this.getRequests()
        },
        pageSize() {
            this.page = 1; // Reset to first page when changing page size
            this.getRequests();
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
    grid-template-columns: 1fr 3fr;
}
</style>