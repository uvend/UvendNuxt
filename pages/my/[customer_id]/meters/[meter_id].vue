<template>
    <div>
        <!-- Page Header with Back Button -->
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button 
                    variant="outline" 
                    @click="navigateTo(`/my/${$route.params.customer_id}/meters`)"
                    class="flex items-center gap-2"
                >
                    <Icon name="lucide:arrow-left" class="w-4 h-4" />
                    Back to Meters
                </Button>
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Meter Details</h1>
                    <p class="text-gray-600" v-if="meterNumber">Meter: {{ meterNumber }}</p>
                </div>
            </div>
            
            <!-- Date Range Picker -->
            <div class="flex items-center gap-2">
                <MyDateRangePicker v-model="dateRange" :months="2" v-if="dateRange" />
            </div>
        </div>

        <!-- Loading State -->
        <MySkeletenCardList v-if="isLoading" :columns="4"/>
        
        <div v-else>
            <!-- Meter Information Card -->
            <Card class="mb-6" v-if="meterInfo">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Icon 
                            :name="meterInfo.vendMeterParameters?.utilityType === 'Water' ? 'lucide:droplet' : 'lucide:zap'" 
                            :class="meterInfo.vendMeterParameters?.utilityType === 'Water' ? 'w-6 h-6 text-blue-500' : 'w-6 h-6 text-yellow-500'"
                        />
                        Meter Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-500">Utility Type</label>
                            <p class="text-lg font-semibold">{{ meterInfo.vendMeterParameters?.utilityType || 'Unknown' }}</p>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-500">Tariff Name</label>
                            <p class="text-lg font-semibold">{{ meterInfo.vendAccountParameters?.tariffName || 'Unknown' }}</p>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-500">Meter Status</label>
                            <div class="flex items-center gap-2">
                                <Badge :variant="meterStatus === 'Ok' ? 'default' : 'destructive'">
                                    {{ meterStatus || 'Unknown' }}
                                </Badge>
                                <Button 
                                    v-if="meterStatus === 'Ok'" 
                                    variant="outline" 
                                    size="sm"
                                    @click="blockMeter(true)"
                                >
                                    <Icon name="lucide:lock-open" class="w-4 h-4" />
                                </Button>
                                <Button 
                                    v-else 
                                    variant="outline" 
                                    size="sm"
                                    @click="blockMeter(false)"
                                >
                                    <Icon name="lucide:lock" class="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" @click="resetTamper">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Vending Patterns Chart -->
            <Card class="mb-6" v-if="chartData.length > 0 && maxAmount > 0">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Icon name="lucide:bar-chart-3" class="w-5 h-5 text-emerald-500" />
                        Vending Patterns
                    </CardTitle>
                    <CardDescription>Transaction activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="h-96 relative bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                        <!-- Chart Container -->
                        <svg class="w-full h-full" viewBox="0 0 900 400" preserveAspectRatio="xMidYMid meet">
                            <!-- Definitions -->
                            <defs>
                                <!-- Gradient for the line -->
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#10b981" />
                                    <stop offset="50%" style="stop-color:#059669" />
                                    <stop offset="100%" style="stop-color:#047857" />
                                </linearGradient>
                                
                                <!-- Gradient for area fill -->
                                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.2" />
                                    <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.05" />
                                </linearGradient>
                                
                                <!-- Drop shadow filter -->
                                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.1"/>
                                </filter>
                                
                                <!-- Glow effect -->
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                    <feMerge> 
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            <!-- Background -->
                            <rect width="100%" height="100%" fill="#fafafa" rx="12" />
                            
                            <!-- Subtle background pattern -->
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" rx="12" />
                            
                            <!-- Chart area background -->
                            <rect x="100" y="60" width="700" height="280" fill="white" rx="8" stroke="#e2e8f0" stroke-width="1" />
                            
                            <!-- Grid lines -->
                            <g stroke="#f1f5f9" stroke-width="1">
                                <!-- Horizontal grid lines -->
                                <line x1="100" y1="120" x2="800" y2="120" />
                                <line x1="100" y1="180" x2="800" y2="180" />
                                <line x1="100" y1="240" x2="800" y2="240" />
                                <line x1="100" y1="300" x2="800" y2="300" />
                                <!-- Vertical grid lines -->
                                <line x1="200" y1="60" x2="200" y2="340" />
                                <line x1="300" y1="60" x2="300" y2="340" />
                                <line x1="400" y1="60" x2="400" y2="340" />
                                <line x1="500" y1="60" x2="500" y2="340" />
                                <line x1="600" y1="60" x2="600" y2="340" />
                                <line x1="700" y1="60" x2="700" y2="340" />
                            </g>
                            
                            <!-- Y-Axis -->
                            <line x1="100" y1="60" x2="100" y2="340" stroke="#64748b" stroke-width="2" />
                            <text x="50" y="200" text-anchor="middle" fill="#64748b" font-size="16" font-weight="600" transform="rotate(-90, 50, 200)">
                                Amount (R)
                            </text>
                            
                            <!-- Y-Axis Labels -->
                            <text x="95" y="340" text-anchor="end" fill="#64748b" font-size="12" font-weight="500">R0</text>
                            <text x="95" y="300" text-anchor="end" fill="#64748b" font-size="12" font-weight="500">R{{ (maxAmount / 4).toFixed(0) }}</text>
                            <text x="95" y="240" text-anchor="end" fill="#64748b" font-size="12" font-weight="500">R{{ (maxAmount / 2).toFixed(0) }}</text>
                            <text x="95" y="180" text-anchor="end" fill="#64748b" font-size="12" font-weight="500">R{{ (maxAmount * 3 / 4).toFixed(0) }}</text>
                            <text x="95" y="120" text-anchor="end" fill="#64748b" font-size="12" font-weight="500">R{{ maxAmount.toFixed(0) }}</text>
                            
                            <!-- X-Axis -->
                            <line x1="100" y1="340" x2="800" y2="340" stroke="#64748b" stroke-width="2" />
                            <text x="450" y="380" text-anchor="middle" fill="#64748b" font-size="16" font-weight="600">
                                Time Period
                            </text>
                            
                            <!-- X-Axis Labels -->
                            <text 
                                v-for="(point, index) in chartPoints" 
                                :key="`x-label-${index}`"
                                :x="point.x" 
                                y="360" 
                                text-anchor="middle" 
                                fill="#64748b" 
                                font-size="11"
                                font-weight="500"
                                :transform="`rotate(-45, ${point.x}, 360)`"
                            >
                                {{ formatDateLabel(point.date) }}
                            </text>
                            
                            <!-- Area fill under the line -->
                            <path 
                                :d="areaPath" 
                                fill="url(#areaGradient)" 
                                opacity="0.8"
                            />
                            
                            <!-- Main chart line -->
                            <path 
                                :d="chartPath" 
                                fill="none" 
                                stroke="url(#lineGradient)" 
                                stroke-width="4"
                                filter="url(#shadow)"
                                class="transition-all duration-500"
                            />
                            
                            <!-- Data points with enhanced styling -->
                            <circle 
                                v-for="(point, index) in chartPoints" 
                                :key="index"
                                :cx="point.x" 
                                :cy="point.y" 
                                r="8" 
                                fill="white"
                                stroke="url(#lineGradient)"
                                stroke-width="3"
                                filter="url(#shadow)"
                                class="cursor-pointer hover:r-12 transition-all duration-300"
                                @mouseenter="showTooltip(point, $event)"
                                @mouseleave="hideTooltip"
                            />
                            
                            <!-- Enhanced tooltip -->
                            <g v-if="tooltipVisible" :transform="`translate(${tooltipX}, ${tooltipY})`">
                                <!-- Tooltip background -->
                                <rect 
                                    x="-70" 
                                    y="-40" 
                                    width="140" 
                                    height="35" 
                                    fill="#1f2937" 
                                    rx="8"
                                    opacity="0.95"
                                    filter="url(#shadow)"
                                />
                                <!-- Tooltip arrow -->
                                <polygon points="0,0 -8,-8 8,-8" fill="#1f2937" opacity="0.95" transform="translate(0, -40)" />
                                <!-- Tooltip text -->
                                <text x="0" y="-20" text-anchor="middle" fill="white" font-size="13" font-weight="600">
                                    {{ tooltipValue }}
                                </text>
                            </g>
                        </svg>
                    </div>
                </CardContent>
            </Card>

            <!-- No Chart Data Message -->
            <Card class="mb-6" v-else>
                <CardHeader>
                    <CardTitle>Vending Patterns</CardTitle>
                    <CardDescription>Transaction activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="text-center py-8">
                        <Icon name="lucide:bar-chart-3" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p class="text-gray-600 mb-2">No transaction data available for charting.</p>
                        <p class="text-sm text-gray-500">
                            {{ meterTransactions.length > 0 ? 'Transactions found but no valid amounts to display.' : 'No transactions found for this period.' }}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <!-- Transactions Section -->
            <Card>
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>{{ meterTransactions.length }} transactions found</CardDescription>
                        </div>
                        <div class="flex items-center gap-2">
                            <Select v-model="pageSize">
                                <SelectTrigger class="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="size in pageSizeSelect" :value="size">
                                        {{ size }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <div class="flex gap-1">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    @click="changePage(currentPage-1)"
                                    :disabled="currentPage <= 1"
                                >
                                    <Icon name="lucide:chevron-left" class="w-4 h-4"/>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    @click="changePage(currentPage+1)"
                                    :disabled="currentPage >= totalPages"
                                >
                                    <Icon name="lucide:chevron-right" class="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div v-if="paginated.length === 0" class="text-center py-8">
                        <Icon name="lucide:receipt" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p class="text-gray-600">No transactions found for this period.</p>
                    </div>
                    <div v-else class="space-y-2">
                        <MyMeterTransactionCard 
                            v-for="transaction in paginated" 
                            :key="transaction.transactionId || transaction.id"
                            :transaction="transaction" 
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Print Job Dialog -->
        <Dialog :open="isOpen" @update:open="isOpen = $event">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset Token</DialogTitle>
                    <DialogDescription>Copy the token below to reset the meter</DialogDescription>
                </DialogHeader>
                <div class="bg-gray-100 p-4 rounded-md">
                    <pre class="text-center font-mono text-sm">{{ printJob }}</pre>
                </div>
                <DialogFooter>
                    <Button @click="copy" class="w-full">
                        <Icon name="lucide:copy" class="w-4 h-4 mr-2" />
                        Copy to Clipboard
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import _ from 'lodash';

definePageMeta({
    layout: 'my'
})

const route = useRoute()
const { $toast } = useNuxtApp()

// Reactive data
const isLoading = ref(true)
const meterTransactions = ref([])
const dateRange = ref(null)
const pageSize = ref(10)
const pageSizeSelect = ref([10, 50, 100, 200])
const currentPage = ref(1)
const meterNumber = ref(null)
const meterInfo = ref(null)
const meterStatus = ref(null)
const isOpen = ref(false)
const printJob = ref(null)
const tooltipVisible = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)
const tooltipValue = ref('')

// Methods
const getAdminMeterActivity = async () => {
    try {
        isLoading.value = true
        const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetMeterActivity`, {
            method: "GET",
            params: {
                StartDate: dateRange.value.start,
                EndDate: dateRange.value.end,
                ResponseFormatType: 0,
                ReportParentType: 7, //specific meter
                ParentUniqueID: route.params.meter_id
            }
        })
        meterTransactions.value = result.responseData.transactionData
        console.log('Admin meter transactions:', result)
        meterNumber.value = result.responseData.transactionData[0]?.meterNumber ?? ''
        isLoading.value = false
    } catch (error) {
        console.error('Error fetching admin meter activity:', error)
        // Show user-friendly error message
        $toast({
            title: 'API Error',
            description: 'Unable to fetch meter data. Please try again later.',
            variant: "destructive"
        })
        meterTransactions.value = []
        isLoading.value = false
    }
}

const getVendMeterActivity = async () => {
    try {
        isLoading.value = true
        const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterReport`, {
            method: "GET",
            params: {
                StartDate: dateRange.value.start,
                EndDate: dateRange.value.end,
                HasMeterIdentifier: true,
                SpecificMeterIdentifier: route.params.meter_id
            }
        })
        meterTransactions.value = result.responseData.transactionData
        isLoading.value = false
    } catch (error) {
        console.error('Error fetching vend meter activity:', error)
        isLoading.value = false
    }
}

const getMeterActivity = async () => {
    if (localStorage.getItem('customer') === 'admin') {
        await getAdminMeterActivity()
    } else {
        await getVendMeterActivity()
    }
}

const getMeterInfo = async () => {
    try {
        // Only try to get meter info if we have a meter number and we're not in admin mode
        if (!meterNumber.value || localStorage.getItem('customer') === 'admin') {
            return
        }
        
        const result = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterInfo`, {
            method: "GET",
            params: {
                "MeterNumber": meterNumber.value,
                "ApiUserParams.TerminalID": VEND_TerminalID,
                "ApiUserParams.OperatorID": VEND_OperatorID,
                "ApiUserParams.RequestID": new Date()
            }
        })
        console.log('Meter info:', result)
        meterInfo.value = result
        meterStatus.value = result.requestedMeterState
    } catch (error) {
        console.error('Error fetching meter info:', error)
        // Don't show error toast for CORS issues, just log it
    }
}

const blockMeter = async (state = true) => {
    try {
        const response = await useAuthFetch(`${VEND_URL}/MeterVend/SetMeterBlockState`, {
            method: "GET",
            params: {
                "Block": state,
                "MeterNumber": meterNumber.value,
                "ApiUserParams.TerminalID": VEND_TerminalID,
                "ApiUserParams.OperatorID": VEND_OperatorID,
                "ApiUserParams.RequestID": new Date()
            }
        })
        meterStatus.value = response.requestedMeterState
    } catch (error) {
        console.error('Error blocking meter:', error)
    }
}

const resetTamper = _.debounce(async () => {
    try {
        const response = await useAuthFetch(`${VEND_URL}/MeterVend/GetMeterTamperToken`, {
            method: "GET",
            params: {
                "MeterNumber": meterNumber.value,
                "ApiUserParams.TerminalID": VEND_TerminalID,
                "ApiUserParams.OperatorID": VEND_OperatorID,
                "ApiUserParams.RequestID": new Date()
            }
        })
        console.log('Reset response:', response)
        printJob.value = response.listOfTokenTransactions[0].tokens[0].delimitedTokenNumber
        isOpen.value = true
    } catch (error) {
        console.error('Error resetting tamper:', error)
    }
}, 300)

const copy = async () => {
    try {
        await navigator.clipboard.writeText(printJob.value)
        $toast({
            title: 'Copied!',
            description: 'Token copied to clipboard',
            variant: "success"
        })
    } catch (err) {
        console.error('Failed to copy: ', err)
        $toast({
            title: 'Copy Failed',
            description: 'Failed to copy token to clipboard',
            variant: "destructive"
        })
    }
}

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const showTooltip = (point, event) => {
    tooltipVisible.value = true
    tooltipX.value = point.x
    tooltipY.value = point.y - 40
    tooltipValue.value = point.label
}

const hideTooltip = () => {
    tooltipVisible.value = false
}

// Computed properties
const totalPages = computed(() => {
    return Math.ceil(meterTransactions.value.length / pageSize.value)
})

const paginated = computed(() => {
    const filtered = meterTransactions.value
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return filtered.slice(startIndex, endIndex)
})

const chartData = computed(() => {
    if (!meterTransactions.value.length) return []
    
    console.log('Raw transactions:', meterTransactions.value)
    
    // Log the first transaction to see its structure
    if (meterTransactions.value.length > 0) {
        console.log('First transaction structure:', JSON.stringify(meterTransactions.value[0], null, 2))
    }
    
    // Group transactions by date and sum amounts
    const grouped = {}
    meterTransactions.value.forEach((transaction, index) => {
        console.log(`Processing transaction ${index}:`, transaction)
        
        // Handle different date field names and formats
        let dateStr = null
        if (transaction.transactionDate) {
            dateStr = new Date(transaction.transactionDate).toLocaleDateString()
            console.log(`Using transactionDate: ${transaction.transactionDate} -> ${dateStr}`)
        } else if (transaction.date) {
            dateStr = new Date(transaction.date).toLocaleDateString()
            console.log(`Using date: ${transaction.date} -> ${dateStr}`)
        } else if (transaction.createdDate) {
            dateStr = new Date(transaction.createdDate).toLocaleDateString()
            console.log(`Using createdDate: ${transaction.createdDate} -> ${dateStr}`)
        } else {
            console.log('No date field found in transaction:', Object.keys(transaction))
        }
        
        // Handle different amount field names
        let amount = 0
        if (transaction.tenderedAmount) {
            amount = parseFloat(transaction.tenderedAmount) || 0
            console.log(`Using tenderedAmount: ${transaction.tenderedAmount} -> ${amount}`)
        } else if (transaction.transactionAmount) {
            amount = parseFloat(transaction.transactionAmount) || 0
            console.log(`Using transactionAmount: ${transaction.transactionAmount} -> ${amount}`)
        } else if (transaction.amount) {
            amount = parseFloat(transaction.amount) || 0
            console.log(`Using amount: ${transaction.amount} -> ${amount}`)
        } else if (transaction.vendAmount) {
            amount = parseFloat(transaction.vendAmount) || 0
            console.log(`Using vendAmount: ${transaction.vendAmount} -> ${amount}`)
        } else {
            console.log('No amount field found in transaction:', Object.keys(transaction))
        }
        
        if (dateStr && amount > 0) {
            if (!grouped[dateStr]) {
                grouped[dateStr] = 0
            }
            grouped[dateStr] += amount
            console.log(`Added to grouped data: ${dateStr} += ${amount} = ${grouped[dateStr]}`)
        } else {
            console.log(`Skipping transaction: dateStr=${dateStr}, amount=${amount}`)
        }
    })
    
    console.log('Grouped data:', grouped)
    
    // Convert to array and sort by date
    const result = Object.entries(grouped)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    
    console.log('Final chart data:', result)
    return result
})

const chartPoints = computed(() => {
    if (!chartData.value.length) return []
    
    const width = 900
    const height = 400
    const padding = 100
    const chartWidth = width - (padding * 2)
    const chartHeight = height - (padding * 2)
    
    const maxAmount = Math.max(...chartData.value.map(d => d.amount))
    const minAmount = Math.min(...chartData.value.map(d => d.amount))
    const amountRange = maxAmount - minAmount || 1
    
    console.log('Chart range:', { maxAmount, minAmount, amountRange })
    
    return chartData.value.map((point, index) => {
        const x = padding + (index / (chartData.value.length - 1)) * chartWidth
        const y = height - padding - ((point.amount - minAmount) / amountRange) * chartHeight
        
        console.log(`Point ${index}:`, { date: point.date, amount: point.amount, x, y })
        
        return {
            x,
            y,
            date: point.date,
            label: `${point.date}: R${point.amount.toFixed(2)}`
        }
    })
})

const chartPath = computed(() => {
    if (chartPoints.value.length < 2) return ''
    
    return chartPoints.value
        .map((point, index) => 
            index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
        )
        .join(' ')
})

const areaPath = computed(() => {
    if (chartPoints.value.length < 2) return ''
    
    const height = 400
    const padding = 100
    const bottomY = height - padding
    
    const linePath = chartPoints.value
        .map((point, index) => 
            index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
        )
        .join(' ')
    
    const closePath = `L ${chartPoints.value[chartPoints.value.length - 1].x} ${bottomY} L ${chartPoints.value[0].x} ${bottomY} Z`
    
    return linePath + closePath
})

const maxAmount = computed(() => {
    if (!chartData.value.length) return 0
    return Math.max(...chartData.value.map(d => d.amount))
})

const formatDateLabel = (dateString) => {
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            console.warn('Invalid date string:', dateString)
            return 'Invalid Date'
        }
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        })
    } catch (error) {
        console.error('Error formatting date:', dateString, error)
        return 'Invalid Date'
    }
}

// Lifecycle
onMounted(async () => {
    const today = new Date()
    const lastMonth = new Date()
    lastMonth.setDate(today.getDate() - 30)
    dateRange.value = {
        start: lastMonth.toISOString(),
        end: today.toISOString()
    }
    
    await getMeterActivity()
})

// Watchers
watch(dateRange, () => {
    getMeterActivity()
})

watch(meterNumber, () => {
    getMeterInfo()
})
</script>