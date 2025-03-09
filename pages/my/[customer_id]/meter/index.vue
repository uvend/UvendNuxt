<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-1">
                <div class="flex gap-1">
                <Button @click="toggleSearch()" variant="secondary">
                    <Icon name="lucide:search"/>
                </Button>
                <Input v-if="searchActive" type="text" placeholder="Search" v-model="search" @input="debouncedSearch"/>
            </div>
            <div>
                <Select  v-model="selectedUtility">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue placeholder="Utility type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="utility in utilityType" :value="utility.value">
                            {{ utility.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
            <div class="flex flex-row w-fit gap-1">
                <div class="flex gap-1">
                    <Button variant="secondary" v-if="selectedMeterComplex != null" @click="selectedMeterComplex = null">
                        <Icon name="lucide:circle-x" class="w-5 h-5"/>
                    </Button>
                    <Select v-model="selectedMeterComplex">
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="Select complex" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="complex in meterComplexes" :value="complex">
                                {{ complex }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
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
    <MySkeletenCardList v-if="isLoading"/>
    <div v-else>
        <MyMeterCard v-for="meter in paginated" :meter="meter"/>
    </div>
</template>
<script>
import _ from 'lodash';
const { debounce } = _;
definePageMeta({
    layout: 'my'
})
export default{
    data(){
        return{
            customer: null,
            meters: [],
            startDate: '',
            endDate: '',
            isLoading: true,
            currentPage: 1,
            pageSize: 10,
            pageSizeSelect: [
                10,50,100,200
            ],
            selectedUtility: -1,
            utilityType: [
                {
                    label: "Any",
                    value: -1
                },
                {
                    label: "Electricity",
                    value: 0
                },
                {
                    label: "Water",
                    value: 1
                }
            ],
            search: null,
            searchActive: false,
            meterComplexes: [],
            selectedMeterComplex: null,
        }
    },
    methods:{
        async getMeterActivity(){
            this.isLoading = true;
            const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetSummarisedMeterActivity`,{
                method: "GET",
                params:{
                    IncludeMetersWithNoActivity : true,
                    StartDate : this.startDate,
                    EndDate: this.endDate,
                    ReportParentType: 4,  // customer
                    ResponseFormatType: 0,
                    ParentUniqueID: this.$route.params.customer_id,
                    UtilityType: this.selectedUtility
                },
            })
            this.meters = result.responseData.transactionData
            console.log(result)
            this.isLoading = false
        },
        changePage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        filterMeters() {
            // If selectedMeterComplex is null, return all meters
            let filteredMeters = this.selectedMeterComplex === null ? this.meters : this.meters.filter(meter => {
                return meter.complexName === this.selectedMeterComplex; // Filter by complex name
            });

            // If search phrase is provided, filter by meter number
            if (this.search) {
                filteredMeters = filteredMeters.filter(meter => {
                    return meter.meterNumber.includes(this.search); // Adjust 'meterNumber' to the correct property name
                });
            }

            return filteredMeters; // Return the filtered list of meters
        },
        toggleSearch(){
            this.searchActive = !this.searchActive
            this.search = null
        },
        getMeterComplex(){
            this.meters.forEach((meter)=>{
                const complexName = meter.complexName
                if (!this.meterComplexes.includes(complexName)) {
                    this.meterComplexes.push(complexName); // Add the complex if not present
                    //console.log(`Added meter complex: ${complexName}`);
                }
            })
        },
        removeMetersByComplex(complexName) {
            this.meters = this.meters.filter(meter => meter.complexName !== complexName); // Remove meters with matching complex name
        },
        debouncedSearch: debounce(function () {
            this.currentPage = 1;
            console.log(this.search);
            //this._search(this.search);
        }, 500),
    },
    computed:{
        totalPages() {
            return Math.ceil(this.filterMeters().length / this.pageSize);
        },
        paginated(){
            const filtered = this.filterMeters()
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filtered.slice(startIndex, endIndex); // Paginate filtered payments
        }
    },
    async mounted(){
        const today = new Date();
        let currentDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        this.startDate = this.endDate = currentDate;
        await this.getMeterActivity()
        await this.getMeterComplex()
    },
    watch:{
        selectedUtility(newValue){
            this.search = null
            this.getMeterActivity()
        },
        selectedMeterComplex(newValue){
            console.log(newValue)
        }
    }
}
</script>