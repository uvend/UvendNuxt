<template>
    <div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <!-- Main Content Area -->
        <div class="flex-1 p-6 lg:p-8 flex flex-col">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Meters</h1>
                <p class="text-gray-600">Overview of meters and their vending totals</p>
            </div>

            <!-- Search Bar -->
            <div class="mb-8 flex items-center gap-4">
                <div class="relative w-1/2">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                        <Icon name="lucide:search" class="w-5 h-5" />
                    </div>
                    <Input 
                        type="text" 
                        placeholder="Search meters..." 
                        class="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                        v-model="search"
                        @input="debouncedSearch"
                    />
                </div>
                <Button 
                    @click="getStatementPDF()"
                    :disabled="isGeneratingPDF"
                    class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Icon v-if="!isGeneratingPDF" name="lucide:eye" class="w-4 h-4" />
                    <Icon v-else name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                    {{ isGeneratingPDF ? 'Generating PDF...' : 'View Report' }}
                </Button>
            </div>

            <!-- Meters Table View -->
            <div class="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                <!-- Table Header -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-xl font-semibold text-gray-800">Meter Summary</h2>
                            <p class="text-gray-600 text-sm">Totals per meter for the selected period</p>
                            <!-- Activity Status Legend -->
                            <div class="flex items-center gap-4 mt-2">
                                <div class="flex items-center gap-1">
                                    <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500" />
                                    <span class="text-xs text-gray-600">Active (Has vended)</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Icon name="lucide:x-circle" class="w-4 h-4 text-red-500" />
                                    <span class="text-xs text-gray-600">Inactive (No vending)</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-gray-600">Total Meters</div>
                            <div class="text-2xl font-bold text-blue-600">{{ filteredMeters.length }}</div>
                            <div class="text-xs text-gray-500 mt-1">Currently Shown: {{ displayedMeters.length }}</div>
                        </div>
                    </div>
                </div>

                <!-- Table Content -->
                <div class="overflow-auto custom-scrollbar" style="max-height: 600px;">
                    <table class="w-full">
                        <thead class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-b border-gray-200">
                            <tr>
                                <th class="text-left py-4 px-6 font-semibold text-gray-700">Meter</th>
                                <th class="text-left py-4 px-6 font-semibold text-gray-700">Complex</th>
                                <th class="text-left py-4 px-6 font-semibold text-gray-700">Utility</th>
                                <th class="text-left py-4 px-6 font-semibold text-gray-700">Units Issued</th>
                                <th class="text-left py-4 px-6 font-semibold text-gray-700">Amount Vended</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="meter in displayedMeters" :key="meter.meterNumber" class="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 group" @click="navigateTo(`/my/${$route.params.customer_id}/meters/${meter.installationUniqueId || meter.meterinstallationuniqueid || meter.meterinstallationuniqueid}`)">
                                <td class="py-4 px-6 text-sm font-medium text-gray-900 group-hover:text-gray-700">
                                    <div class="flex items-center gap-2">
                                        <span>{{ meter.meterNumber }}</span>
                                        <Icon 
                                            :name="meter.isActive ? 'lucide:check-circle' : 'lucide:x-circle'" 
                                            :class="meter.isActive ? 'text-green-500' : 'text-red-500'"
                                            class="w-4 h-4"
                                            :title="meter.isActive ? 'Active (Has vended)' : 'Inactive (No vending)'"
                                        />
                                    </div>
                                </td>
                                <td class="py-4 px-6 text-sm text-gray-700 group-hover:text-gray-700">
                                    {{ meter.complexName || 'N/A' }}
                                    <p class="text-gray-500">{{ meter.address || 'N/A' }}</p>
                                </td>
                                <td class="py-4 px-6 text-sm text-gray-600 group-hover:text-gray-700">{{ meter.utilityType }}</td>
                                <td class="py-4 px-6 text-sm text-gray-600 group-hover:text-gray-700">
                                    <span class="font-medium">{{ meter.totalUnitsIssued }}</span>
                                    <span v-if="meter.utilityType === 'Water'" class="text-blue-600">KL</span>
                                    <span v-else-if="meter.utilityType === 'Electricity'" class="text-yellow-600">KWh</span>
                                </td>
                                <td class="py-4 px-6 text-sm font-semibold text-green-600 group-hover:text-green-700">R {{ meter.managedTenderAmount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Load More Button -->
                <div v-if="hasMoreMeters" class="p-6 border-t border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div class="flex justify-center">
                        <Button @click="loadMore" class="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2">
                            <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                            Load More ({{ remainingMeters }} remaining)
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Sidebar -->
        <div class="w-64 bg-white/90 backdrop-blur-sm border-l border-gray-200 p-6 overflow-y-auto custom-scrollbar shadow-lg">
            <!-- Filters Section -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

                <!-- Date Range -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Date Range</Label>
                    <div class="space-y-2">
                        <Select v-model="selectedDateRange" @update:model-value="onDateRangeChange">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Select date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lastDay">Last Day</SelectItem>
                                <SelectItem value="lastWeek">Last Week</SelectItem>
                                <SelectItem value="lastMonth">Last Month</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>
                        <div v-if="selectedDateRange === 'custom'" class="space-y-2">
                            <div>
                                <Label class="text-xs text-gray-500 mb-1 block">Start Date</Label>
                                <Input 
                                    type="date" 
                                    v-model="startDate"
                                    class="w-full"
                                    @change="updateDateRange"
                                />
                            </div>
                            <div>
                                <Label class="text-xs text-gray-500 mb-1 block">End Date</Label>
                                <Input 
                                    type="date" 
                                    v-model="endDate"
                                    class="w-full"
                                    @change="updateDateRange"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Type -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Type</Label>
                    <Select v-model="selectedUtility">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Electricity & Water" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="utility in utilityType" :key="utility.value" :value="utility.value">
                                {{ utility.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Complex -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Complex</Label>
                    <Select v-model="selectedMeterComplex">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select complex" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="complex in meterComplexes" :key="complex" :value="complex">
                                {{ complex }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Activity Status -->
                <div class="mb-4">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Activity Status</Label>
                    <Select v-model="selectedActivityStatus">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="All meters" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="status in activityStatusOptions" :key="status.value" :value="status.value">
                                {{ status.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Load More Amount -->
                <div class="mb-6">
                    <Label class="text-sm font-medium text-gray-700 mb-2 block">Load More Amount</Label>
                    <Select v-model="pageSize">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="25 records" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="size in pageSizeSelect" :key="size" :value="size">
                                {{ size }} records
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2">
                    <Button variant="outline" @click="clearFilters" class="flex-1">
                        Clear
                    </Button>
                    <Button @click="applyFilters" class="flex-1 bg-blue-600 hover:bg-blue-700">
                        Apply
                    </Button>
                </div>
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
            isLoading: true,
            // data sets
            metersTotals: [],
            originalMetersTotals: [],
            filteredMeters: [],
            displayedMeters: [],
            meterComplexes: [],
            selectedMeterComplex: null,
            // pagination
            currentPage: 1,
            pageSize: 25,
            pageSizeSelect: [10,25,50,100],
            // filters
            selectedUtility: -1,
            utilityType: [
                { label: 'Any', value: -1 },
                { label: 'Electricity', value: 0 },
                { label: 'Water', value: 1 }
            ],
            selectedActivityStatus: -1,
            activityStatusOptions: [
                { label: 'All', value: -1 },
                { label: 'Active', value: 1 },
                { label: 'Inactive', value: 0 }
            ],
            search: null,
            // dates
            dateRange: null,
            startDate: null,
            endDate: null,
            selectedDateRange: 'lastMonth'
            ,
            // report export
            transactionResponseData: null,
            isGeneratingPDF: false
        }
    },
    methods:{
        async getAdminMeters(){
            try{
                this.isLoading = true
                const result = await useAuthFetch(`${STATEMENT_API}/statement/GetDBMeterActivitySummarised`,{
                    method: 'GET',
                    params:{
                        IncludeMetersWithNoActivity : true,
                        StartDate : this.dateRange.start,
                        EndDate: this.dateRange.end,
                        ReportParentType: 4,  // customer
                        ResponseFormatType: 0,
                        ParentUniqueID: this.$route.params.customer_id,
                        UtilityType: this.selectedUtility
                    }
                })
                // keep response for report
                this.transactionResponseData = {
                    transactionData: result.data.transactionData,
                    startDate: this.dateRange.start,
                    endDate: this.dateRange.end,
                    reportParentName: 'Meters Summary'
                }
                this._buildFromTransactionData(result.data.transactionData)
                await this.getMeterComplex()
                this.isLoading = false
            }catch(e){
                console.error('Admin meters fetch failed', e)
                this.metersTotals = []
                this.originalMetersTotals = []
                this.filteredMeters = []
                this.displayedMeters = []
                this.isLoading = false
            }
        },
        async getVendMeters(){
            try{
                this.isLoading = true
                const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterReport`,{
                    method: 'GET',
                    params:{
                        StartDate : this.dateRange.start,
                        EndDate: this.dateRange.end,
                        VendTransactionReportType: 0,
                        UtilityType: this.selectedUtility
                    }
                })
                // keep response for report
                this.transactionResponseData = {
                    transactionData: result.responseData.transactionData,
                    startDate: this.dateRange.start,
                    endDate: this.dateRange.end,
                    reportParentName: 'Meters Summary'
                }
                this._buildFromTransactionData(result.responseData.transactionData)
                await this.getMeterComplex()
                this.isLoading = false
            }catch(e){
                console.error('Vend meters fetch failed', e)
                this.metersTotals = []
                this.originalMetersTotals = []
                this.filteredMeters = []
                this.displayedMeters = []
                this.isLoading = false
            }
        },
        async getStatementPDF(){
            this.isGeneratingPDF = true
            try{
                const payload = { data: this.transactionResponseData }
                const blob = await useAuthFetch(`${STATEMENT_API}/export/pdf?template=statement`,{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    responseType: 'blob',
                    body: JSON.stringify(payload)
                })
                if (blob instanceof Blob === false) {
                    console.error('Unexpected response type')
                    return
                }
                const url = URL.createObjectURL(blob)
                const newTab = window.open(url, '_blank')
                setTimeout(() => URL.revokeObjectURL(url), 1000)
                if(!newTab){
                    const link = document.createElement('a')
                    link.href = url
                    const start = (this.dateRange && this.dateRange.start) ? this.dateRange.start : ''
                    const end = (this.dateRange && this.dateRange.end) ? this.dateRange.end : ''
                    link.download = `Statement_${start}_${end}.pdf`
                    document.body.appendChild(link)
                    link.click()
                    link.remove()
                    URL.revokeObjectURL(url)
                }
            }catch(err){
                console.error('Failed to generate report', err)
            }finally{
                this.isGeneratingPDF = false
            }
        },
        _buildFromTransactionData(transactionData){
            // Reset
            this.metersTotals = []
            this.originalMetersTotals = []

            for(const [meterKey, meterData] of Object.entries(transactionData || {})){
                let totalAmount = 0
                let totalUnits = 0
                let utilityType = null
                let meterNumber = meterKey
                let installationId = null
                let complexName = null
                let firstTxn = null
                let isActive = false
                let address0 = null
                if(meterData && Array.isArray(meterData.transactions)){
                    meterData.transactions.forEach(txn => {
                        totalAmount += parseFloat(txn.tenderedamount || txn.transactionAmount || txn.amount || 0) || 0
                        totalUnits += parseFloat(txn.totalunitsissued || txn.unitsIssued || txn.units || 0) || 0
                        if(!firstTxn) firstTxn = txn
                        // Check if meter has vended by looking for start and end dates
                        if(txn.StartDate && txn.EndDate){
                            isActive = true
                        }
                    })
                }
                if(firstTxn){
                    utilityType = firstTxn.utilitytype === 1 ? 'Water' : 'Electricity'
                    meterNumber = firstTxn.meternumber || meterNumber
                    installationId = firstTxn.meterinstallationuniqueid || firstTxn.installationUniqueId || null
                    complexName = firstTxn.complexDescription || firstTxn.complexName || null
                    address0 = firstTxn.address0 || null
                }
                const row = {
                    meterNumber: meterNumber,
                    complexName: complexName || 'N/A',
                    utilityType: utilityType || 'Unknown',
                    address: address0 || 'N/A',
                    totalUnitsIssued: Number(totalUnits.toFixed(1)),
                    managedTenderAmount: totalAmount.toFixed(2),
                    installationUniqueId: installationId,
                    isActive: isActive
                }
                this.metersTotals.push(row)
                this.originalMetersTotals.push(row)
            }
            this.filteredMeters = JSON.parse(JSON.stringify(this.originalMetersTotals))
            // sort by complex name first, then by address, then by meter number
            this.filteredMeters.sort((a, b) => {
                // First sort by complex name
                const complexA = (a.complexName || '').toLowerCase()
                const complexB = (b.complexName || '').toLowerCase()
                if (complexA !== complexB) {
                    return complexA.localeCompare(complexB, undefined, { numeric: true, sensitivity: 'base' })
                }
                
                // Then sort by address
                const addressA = (a.address || '').toLowerCase()
                const addressB = (b.address || '').toLowerCase()
                if (addressA !== addressB) {
                    return addressA.localeCompare(addressB, undefined, { numeric: true, sensitivity: 'base' })
                }
                
                // Finally sort by meter number
                return (a.meterNumber || '').localeCompare(b.meterNumber || '', undefined, { numeric: true, sensitivity: 'base' })
            })
            this.displayedMeters = this.filteredMeters.slice(0, this.pageSize)
        },
        getMeters(){
            this.getAdminMeters()
            // if(localStorage.getItem('customer') === 'admin'){
            // }else{
            //     this.getVendMeters()
            // }
        },
        async getMeterComplex(){
            const complexSet = new Set()
            if(this.originalMetersTotals && this.originalMetersTotals.length > 0){
                this.originalMetersTotals.forEach(m => {
                    if(m.complexName){
                        complexSet.add(m.complexName)
                    }
                })
            }
            this.meterComplexes = Array.from(complexSet).sort()
        },
        loadMore(){
            const startIndex = this.displayedMeters.length
            const endIndex = startIndex + this.pageSize
            const next = this.filteredMeters.slice(startIndex, endIndex)
            this.displayedMeters = [...this.displayedMeters, ...next]
        },
        clearFilters(){
            this.selectedUtility = -1
            this.selectedMeterComplex = null
            this.selectedActivityStatus = -1
            this.search = ''
            this.currentPage = 1
            // reset dates to last 30 days
            this.selectedDateRange = 'lastMonth'
            const today = new Date()
            const lastMonth = new Date()
            lastMonth.setDate(today.getDate() - 30)
            this.startDate = lastMonth.toISOString().split('T')[0]
            this.endDate = today.toISOString().split('T')[0]
            this.updateDateRange()
            // reset data
            this.filteredMeters = []
            this.$nextTick(() => {
                this.filteredMeters = JSON.parse(JSON.stringify(this.originalMetersTotals))
                // sort by complex name first, then by address, then by meter number
                this.filteredMeters.sort((a, b) => {
                    // First sort by complex name
                    const complexA = (a.complexName || '').toLowerCase()
                    const complexB = (b.complexName || '').toLowerCase()
                    if (complexA !== complexB) {
                        return complexA.localeCompare(complexB, undefined, { numeric: true, sensitivity: 'base' })
                    }
                    
                    // Then sort by address
                    const addressA = (a.address || '').toLowerCase()
                    const addressB = (b.address || '').toLowerCase()
                    if (addressA !== addressB) {
                        return addressA.localeCompare(addressB, undefined, { numeric: true, sensitivity: 'base' })
                    }
                    
                    // Finally sort by meter number
                    return (a.meterNumber || '').localeCompare(b.meterNumber || '', undefined, { numeric: true, sensitivity: 'base' })
                })
                this.displayedMeters = this.filteredMeters.slice(0, this.pageSize)
            })
        },
        applyFilters(){
            this.currentPage = 1
            this.filteredMeters = []
            this.$nextTick(() => {
                this.performFiltering()
            })
        },
        performFiltering(){
            let data = JSON.parse(JSON.stringify(this.originalMetersTotals))

            // complex
            if(this.selectedMeterComplex){
                data = data.filter(m => m.complexName === this.selectedMeterComplex)
            }
            // utility type
            if(this.selectedUtility !== -1){
                data = data.filter(m => {
                    if(this.selectedUtility === 0) return m.utilityType === 'Electricity'
                    if(this.selectedUtility === 1) return m.utilityType === 'Water'
                    return true
                })
            }
            // activity status
            if(this.selectedActivityStatus !== -1){
                data = data.filter(m => {
                    if(this.selectedActivityStatus === 1) return m.isActive === true
                    if(this.selectedActivityStatus === 0) return m.isActive === false
                    return true
                })
            }
            // search by meter number or complex
            if(this.search && this.search.trim() !== ''){
                const s = this.search.toLowerCase()
                data = data.filter(m => (m.meterNumber || '').toLowerCase().includes(s) || (m.complexName || '').toLowerCase().includes(s))
            }

            // sort by complex name first, then by address, then by meter number
            data.sort((a, b) => {
                // First sort by complex name
                const complexA = (a.complexName || '').toLowerCase()
                const complexB = (b.complexName || '').toLowerCase()
                if (complexA !== complexB) {
                    return complexA.localeCompare(complexB, undefined, { numeric: true, sensitivity: 'base' })
                }
                
                // Then sort by address
                const addressA = (a.address || '').toLowerCase()
                const addressB = (b.address || '').toLowerCase()
                if (addressA !== addressB) {
                    return addressA.localeCompare(addressB, undefined, { numeric: true, sensitivity: 'base' })
                }
                
                // Finally sort by meter number
                return (a.meterNumber || '').localeCompare(b.meterNumber || '', undefined, { numeric: true, sensitivity: 'base' })
            })

            this.filteredMeters = []
            this.$nextTick(() => {
                this.filteredMeters = JSON.parse(JSON.stringify(data))
                this.displayedMeters = this.filteredMeters.slice(0, this.pageSize)
            })
        },
        debouncedSearch: debounce(function(){
            this.currentPage = 1
            this.performFiltering()
        }, 300),
        // Date handling
        updateDateRange(){
            if(this.startDate && this.endDate){
                this.dateRange = {
                    start: new Date(this.startDate).toISOString(),
                    end: new Date(this.endDate).toISOString()
                }
            }
        },
        onDateRangeChange(value){
            const today = new Date()
            let startDate, endDate
            switch(value){
                case 'lastDay':
                    startDate = new Date(today)
                    startDate.setDate(today.getDate() - 1)
                    endDate = new Date(today)
                    break
                case 'lastWeek':
                    startDate = new Date(today)
                    startDate.setDate(today.getDate() - 7)
                    endDate = new Date(today)
                    break
                case 'lastMonth':
                    startDate = new Date(today)
                    startDate.setDate(today.getDate() - 30)
                    endDate = new Date(today)
                    break
                case 'custom':
                    return
                default:
                    return
            }
            this.startDate = startDate.toISOString().split('T')[0]
            this.endDate = endDate.toISOString().split('T')[0]
            this.updateDateRange()
        }
    },
    async mounted(){
        const today = new Date()
        const lastMonth = new Date()
        lastMonth.setDate(today.getDate() - 30)
        // init dates
        this.startDate = lastMonth.toISOString().split('T')[0]
        this.endDate = today.toISOString().split('T')[0]
        this.dateRange = { start: lastMonth.toISOString(), end: today.toISOString() }
        await this.getMeters()
    },
    computed:{
        hasMoreMeters(){
            return this.displayedMeters.length < this.filteredMeters.length
        },
        remainingMeters(){
            return this.filteredMeters.length - this.displayedMeters.length
        }
    },
    watch:{
        dateRange: {
            handler(newVal, oldVal){
                if(newVal && oldVal && (newVal.start !== oldVal.start || newVal.end !== oldVal.end)){
                    this.getMeters()
                }
            },
            deep: true
        },
        selectedUtility(){
            // refetch when utility changes to reflect API-level filter
            this.getMeters()
        }
    }
}
</script>
<style scoped>
/* Custom Scrollbar Styles */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Firefox scrollbar styles */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}

/* Hide scrollbar when not needed */
.custom-scrollbar::-webkit-scrollbar-thumb:vertical {
    min-height: 40px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:horizontal {
    min-width: 40px;
}
</style>