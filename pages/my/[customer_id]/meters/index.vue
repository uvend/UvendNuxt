<template>
    <div>
        <!-- Page Header -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Meters</h1>
        </div>
        
        <!-- Search and Filter Controls -->
        <div class="mb-6 flex flex-wrap gap-4 items-center">
            <div class="flex gap-2">
                <Button @click="toggleSearch()" variant="secondary">
                    <Icon name="lucide:search"/>
                </Button>
                <Input v-if="searchActive" type="text" placeholder="Search meters..." v-model="search" @input="debouncedSearch" class="w-64"/>
            </div>
            
            <Select v-model="selectedUtility" class="w-48">
                <SelectTrigger>
                    <SelectValue placeholder="Utility type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="utility in utilityType" :value="utility.value">
                        {{ utility.label }}
                    </SelectItem>
                </SelectContent>
            </Select>
            
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Total Meters:</span>
                <Badge variant="secondary">{{ totalMeters }}</Badge>
            </div>
        </div>
        
        <!-- Loading State -->
        <MySkeletenCardList v-if="isLoading" :columns="4"/>
        
        <!-- Meters Grouped by Complex -->
        <div v-else class="space-y-6">
            <div v-for="complex in groupedMeters" :key="complex.name" class="border rounded-lg overflow-hidden">
                <!-- Complex Header -->
                <div 
                    class="bg-gray-50 px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    @click="toggleComplex(complex.name)"
                >
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <Icon name="lucide:building" class="w-5 h-5 text-gray-600" />
                            <h3 class="text-lg font-semibold text-gray-900">{{ complex.name }}</h3>
                            <Badge variant="outline">{{ complex.meters.length }} meters</Badge>
                        </div>
                        <Icon 
                            :name="expandedComplexes.includes(complex.name) ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                            class="w-5 h-5 text-gray-600 transition-transform"
                        />
                    </div>
                </div>
                
                <!-- Meters List -->
                <div v-if="expandedComplexes.includes(complex.name)" class="divide-y">
                    <div 
                        v-for="meter in complex.meters" 
                        :key="meter.installationUniqueId"
                        class="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        @click="navigateTo(`/my/${$route.params.customer_id}/meters/${meter.installationUniqueId}`)"
                    >
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="flex items-center gap-2">
                                    <Icon 
                                        :name="meter.utilityType === 'Water' ? 'lucide:droplet' : 'lucide:zap'" 
                                        :class="meter.utilityType === 'Water' ? 'w-5 h-5 text-blue-500' : 'w-5 h-5 text-yellow-500'"
                                    />
                                    <span class="font-medium text-gray-900">{{ meter.meterNumber }}</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    {{ formatAddress(meter.installationAdress) }}
                                </div>
                            </div>
                            <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="groupedMeters.length === 0" class="text-center py-12">
                <Icon name="lucide:search-x" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">No meters found</h3>
                <p class="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
        </div>
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
            expandedComplexes: [], // Track which complexes are expanded
        }
    },
    methods:{
        async getAdminMeterActivity(){
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
        async getVendMeterActivity(){
            this.isLoading = true;
            const result = await useAuthFetch(`${VEND_URL}/user/VendUserFunctions/GetMeterList`,{
                method: "GET",
                params:{
                    StartDate : this.startDate,
                    EndDate: this.endDate,
                    UtilityType: this.selectedUtility,
                    VendTransactionReportType: 0
                },
            })
            console.log(result)
            const customerList = result.customerList
            customerList.forEach( c => {
                const meterComplexGroup = c.meterComplexGroupList
                meterComplexGroup.forEach( mcg => {
                    const meterComplexList = mcg.meterComplexList
                    meterComplexList.forEach( complex => {
                        const meterList = complex.meterInstallationList
                        meterList.forEach( meter => {
                            const mymeter = {
                                installationAdress : meter.address,
                                meterNumber : meter.meterNumber,
                                installationUniqueId : meter.uniqueIdentification,
                                utilityType: meter.vendMeterParameters.utilityType,
                                complexName: complex.descriptor
                            }
                            this.meters.push(mymeter)
                        })
                    })
                })
            })
            this.isLoading = false;
        },
        async getMeterActivity(){
            if(localStorage.getItem('customer') === 'admin'){
                await this.getAdminMeterActivity()
            }else{
                await this.getVendMeterActivity()
            }
        },
        filterMeters() {
            let filteredMeters = this.meters;

            // Filter by utility type
            if (this.selectedUtility !== -1) {
                const utilityType = this.selectedUtility === 0 ? 'Electricity' : 'Water';
                filteredMeters = filteredMeters.filter(meter => meter.utilityType === utilityType);
            }

            // Filter by search
            if (this.search) {
                filteredMeters = filteredMeters.filter(meter => {
                    const searchLower = this.search.toLowerCase();
                    return meter.meterNumber.toLowerCase().includes(searchLower) ||
                           this.formatAddress(meter.installationAdress).toLowerCase().includes(searchLower) ||
                           meter.complexName.toLowerCase().includes(searchLower);
                });
            }

            return filteredMeters;
        },
        toggleSearch(){
            this.searchActive = !this.searchActive
            this.search = null
        },
        toggleComplex(complexName) {
            const index = this.expandedComplexes.indexOf(complexName);
            if (index > -1) {
                this.expandedComplexes.splice(index, 1);
            } else {
                this.expandedComplexes.push(complexName);
            }
        },
        formatAddress(addressArray) {
            if (!addressArray || !Array.isArray(addressArray)) return 'Address not available';
            return addressArray.filter(part => part && part.trim()).join(', ');
        },
        debouncedSearch: debounce(function () {
            // Reset expanded complexes when searching
            this.expandedComplexes = [];
        }, 500),
    },
    computed:{
        filteredMeters() {
            return this.filterMeters();
        },
        groupedMeters() {
            const groups = {};
            
            this.filteredMeters.forEach(meter => {
                const complexName = meter.complexName || 'Unknown Complex';
                if (!groups[complexName]) {
                    groups[complexName] = {
                        name: complexName,
                        meters: []
                    };
                }
                groups[complexName].meters.push(meter);
            });
            
            // Sort complexes alphabetically and meters by meter number
            return Object.values(groups)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(group => ({
                    ...group,
                    meters: group.meters.sort((a, b) => a.meterNumber.localeCompare(b.meterNumber))
                }));
        },
        totalMeters() {
            return this.filteredMeters.length;
        }
    },
    async mounted(){
        const today = new Date();
        let currentDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        this.startDate = this.endDate = currentDate;
        await this.getMeterActivity();
        
        // Expand first complex by default
        if (this.groupedMeters.length > 0) {
            this.expandedComplexes = [this.groupedMeters[0].name];
        }
    },
    watch:{
        selectedUtility(newValue){
            this.search = null;
            this.getMeterActivity();
        }
    }
}
</script>