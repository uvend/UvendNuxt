<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                <MyDateRangePicker v-model="dateRange" :months="2" v-if="dateRange" />
            </div>
        </div>
            <div class="flex flex-row w-fit gap-1">
                <div>
                    <Button v-if="meterStatus === 'Ok'" variant="secondary" class="mx-1" @click="blockMeter(true)"><Icon name="lucide:lock-open" class="w-5 h-5"/></Button>
                    <Button v-else class="mx-1" @click="blockMeter(false)"><Icon name="lucide:lock" class="w-5 h-5"/></Button>
                </div>
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
                    <Button variant="secondary" @click="changePage(currentPage-1)"><Icon name="lucide:chevron-left" class="w-5 h-5"/></Button>
                    <Button variant="secondary" @click="changePage(currentPage+1)"><Icon name="lucide:chevron-right" class="w-5 h-5"/></Button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="meterInfo" class="pt-2">
        <div class="flex justify-between">
            <p>Utility Type</p>
            <p>{{ meterInfo.vendMeterParameters.utilityType }}</p>
        </div>
        <div class="flex justify-between">
            <p>Tariff Name</p>
            <p>{{ meterInfo.vendAccountParameters.tariffName }}</p>
        </div>
        <div class="flex justify-between">
            <p>Meter State</p>
            <div class="flex gap-2 items-center">
                <p>{{ this.meterStatus }}</p>
                <Button @click="resetTamper">Reset</Button>
            </div>
        </div>
    </div>
    <MySkeletenCardList v-if="isLoading"/>
    <MyMeterTransactionCard v-else v-for="transaction in paginated" :transaction="transaction" />
    <Dialog :open="isOpen" @update:open="isOpen = $event">
        <DialogContent>
            <pre class="text-center" v-if="printJob">{{ printJob }}</pre>
            <DialogFooter class="flex">
                <Button class="w-full" @click="copy">Copy</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
<script>
import _ from 'lodash';
definePageMeta({
    layout: 'my'
})
export default{
    data(){
        return{
            isLoading: true,
            meterTransactions: [],
            dateRange: null,
            pageSize: 10,
            pageSizeSelect: [
                10,50,100,200
            ],
            currentPage: 1,
            meterNumber: null,
            meterInfo: null,
            meterStatus: null,
            isOpen: false,
            printJob: null
        }
    },
    methods:{
        async getAdminMeterActivity(){
            this.isLoading = true;
            const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetMeterActivity`,{
                method: "GET",
                params: {
                    StartDate: this.dateRange.start,
                    EndDate: this.dateRange.end,
                    ResponseFormatType: 0,
                    ReportParentType: 7, //specific meter
                    ParentUniqueID: this.$route.params.meter_id
                }
            })
            this.meterTransactions = result.responseData.transactionData
            console.log(result)
            this.meterNumber = result.responseData.transactionData[0]?.meterNumber ?? ''
            this.$store.pageTitle = this.meterNumber;
            this.isLoading = false;
        },
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        async getVendMeterActivity(){
            this.isLoading = true
            const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterReport`,{
                method: "GET",
                params: {
                    StartDate: this.dateRange.start,
                    EndDate: this.dateRange.end,
                    //ResponseFormatType: 0,
                    //ReportParentType: 7, //specific meter
                    HasMeterIdentifier: true,
                    SpecificMeterIdentifier: this.$route.params.meter_id
                }
            })
            //console.log(result)
            this.meterTransactions = result.responseData.transactionData
            this.isLoading = false
        },
        async getMeterActivity(){
            if(localStorage.getItem('customer') === 'admin'){
                await this.getAdminMeterActivity()
            }else{
                await this.getVendMeterActivity()
            }
        },
        async getMeterInfo(){
            const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterInfo`,{
                method: "GET",
                params: {
                    "MeterNumber": this.meterNumber,
                    "ApiUserParams.TerminalID" : VEND_TerminalID,
                    "ApiUserParams.OperatorID" : VEND_OperatorID,
                    "ApiUserParams.RequestID" : new Date()
                }
            })
            console.log(result)
            this.meterInfo = result
            this.meterStatus = result.requestedMeterState
        },
        async blockMeter(state = true){
            const response = await useAuthFetch(`${VEND_URL}/MeterVend/SetMeterBlockState`,{
                method: "GET",
                params: {
                    "Block" : state,
                    "MeterNumber": this.meterNumber,
                    "ApiUserParams.TerminalID" : VEND_TerminalID,
                    "ApiUserParams.OperatorID" : VEND_OperatorID,
                    "ApiUserParams.RequestID" : new Date()
                }
            })
            this.meterStatus = response.requestedMeterState
            //console.log(response)
        },
        resetTamper: _.debounce( async function(){
            const response = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterTamperToken`,{
                method: "GET",
                params: {
                    "MeterNumber": this.meterNumber,
                    "ApiUserParams.TerminalID" : VEND_TerminalID,
                    "ApiUserParams.OperatorID" : VEND_OperatorID,
                    "ApiUserParams.RequestID" : new Date()
                }
            })
            console.log(response);
            this.printJob = response.listOfTokenTransactions[0].tokens[0].delimitedTokenNumber;
            this.isOpen = true;
        },300),
        async copy(){
            try {
                await navigator.clipboard.writeText(this.printJob)
                console.log('Copied to clipboard!')
            } catch (err) {
                console.error('Failed to copy: ', err)
            }
        }
    },
    async mounted(){
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(today.getDate()-30)
        this.dateRange = {
            start : lastMonth.toISOString(),
            end : today.toISOString()
        }
    },
    computed:{
        totalPages() {
            return Math.ceil(this.meterTransactions.length / this.pageSize);
        },
        paginated(){
            const filtered = this.meterTransactions
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filtered.slice(startIndex, endIndex); // Paginate filtered payments
        }
    },
    watch:{
        dateRange(){
            this.getMeterActivity();
        },
        meterNumber(){
            this.getMeterInfo();
        }
    }
}
</script>