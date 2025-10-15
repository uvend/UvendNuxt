<template>
<div class="flex flex-col p-4 gap-6">
    <!-- Wallet Card -->
    <WalletDebitCard />

    <!-- Summary Statistics -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Deposits -->
        <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:wallet" class="w-4 h-4 text-blue-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Total Deposits</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">R {{ totalDeposits }}</p>
                <p class="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
        </Card>

        <!-- Successful Payments -->
        <Card class="bg-white/95 backdrop-blur-sm border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:check-circle" class="w-4 h-4 text-green-600" />
        </div>
                    <span class="text-xs font-medium text-gray-600">Successful</span>
                </div>
                <p class="text-2xl font-bold text-green-600">{{ successfulCount }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ successRate }}% success rate</p>
            </CardContent>
            </Card>
            
        <!-- Failed Payments -->
        <Card class="bg-white/95 backdrop-blur-sm border border-red-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:x-circle" class="w-4 h-4 text-red-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Failed</span>
                </div>
                <p class="text-2xl font-bold text-red-600">{{ failedCount }}</p>
                <p class="text-xs text-gray-500 mt-1">R {{ failedAmount }}</p>
            </CardContent>
        </Card>

        <!-- Average Deposit -->
        <Card class="bg-white/95 backdrop-blur-sm border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent class="p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon name="lucide:trending-up" class="w-4 h-4 text-purple-600" />
                    </div>
                    <span class="text-xs font-medium text-gray-600">Average</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">R {{ averageDeposit }}</p>
                <p class="text-xs text-gray-500 mt-1">Per deposit</p>
            </CardContent>
            </Card>
        </div>

    <!-- Deposit Trends Chart -->
    <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
                <div>
                    <CardTitle class="text-lg font-semibold text-gray-800">Deposit Trends</CardTitle>
                    <CardDescription class="text-sm">Last 7 days deposit activity</CardDescription>
                </div>
                <div class="flex items-center gap-3 text-xs">
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        <span class="text-gray-600">Successful</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-gray-600">Failed</span>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent class="p-4 sm:p-6">
            <div v-if="isLoading" class="py-8 flex justify-center">
                <MyLoader />
            </div>
            <div v-else class="w-full">
                <!-- Chart Container -->
                <div class="relative h-[250px] sm:h-[300px]">
                    <!-- Y-axis labels -->
                    <div class="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 pr-2">
                        <span>R{{ maxChartAmount }}</span>
                        <span>R{{ Math.round(maxChartAmount * 0.75) }}</span>
                        <span>R{{ Math.round(maxChartAmount * 0.5) }}</span>
                        <span>R{{ Math.round(maxChartAmount * 0.25) }}</span>
                        <span>R0</span>
                    </div>
                    
                    <!-- Chart area -->
                    <div class="absolute left-12 right-0 top-0 bottom-8 border-l border-b border-gray-200">
                        <!-- Grid lines -->
                        <div class="absolute inset-0">
                            <div class="absolute top-0 left-0 right-0 border-t border-gray-100"></div>
                            <div class="absolute top-1/4 left-0 right-0 border-t border-gray-100"></div>
                            <div class="absolute top-1/2 left-0 right-0 border-t border-gray-100"></div>
                            <div class="absolute top-3/4 left-0 right-0 border-t border-gray-100"></div>
                        </div>
                        
                        <!-- Line Chart SVG -->
                        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <!-- Gradients -->
                            <defs>
                                <linearGradient id="successGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:rgb(34, 197, 94);stop-opacity:0.3" />
                                    <stop offset="100%" style="stop-color:rgb(34, 197, 94);stop-opacity:0.05" />
                                </linearGradient>
                                <linearGradient id="failedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:rgb(239, 68, 68);stop-opacity:0.3" />
                                    <stop offset="100%" style="stop-color:rgb(239, 68, 68);stop-opacity:0.05" />
                                </linearGradient>
                            </defs>
                            
                            <!-- Success area fill -->
                            <path 
                                v-if="successLinePath"
                                :d="successAreaPath" 
                                fill="url(#successGradient)"
                                class="transition-all duration-300"
                            />
                            
                            <!-- Failed area fill -->
                            <path 
                                v-if="failedLinePath"
                                :d="failedAreaPath" 
                                fill="url(#failedGradient)"
                                class="transition-all duration-300"
                            />
                            
                            <!-- Success line -->
                            <path 
                                v-if="successLinePath"
                                :d="successLinePath" 
                                fill="none" 
                                stroke="rgb(34, 197, 94)" 
                                stroke-width="0.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="transition-all duration-300"
                            />
                            
                            <!-- Failed line -->
                            <path 
                                v-if="failedLinePath"
                                :d="failedLinePath" 
                                fill="none" 
                                stroke="rgb(239, 68, 68)" 
                                stroke-width="0.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="transition-all duration-300"
                            />
                            
                            <!-- Data points for Success -->
                            <g v-if="successLinePath">
                                <circle 
                                    v-for="(point, index) in successPoints" 
                                    :key="'s-' + index"
                                    :cx="point.x" 
                                    :cy="point.y" 
                                    r="1"
                                    fill="rgb(34, 197, 94)"
                                    class="cursor-pointer hover:r-1.5 transition-all"
                                    @mouseenter="showLineTooltip(index, 'success', dailyChartData[index])"
                                    @mouseleave="hideTooltip"
                                >
                                    <title>R{{ dailyChartData[index].success }}</title>
                                </circle>
                            </g>
                            
                            <!-- Data points for Failed -->
                            <g v-if="failedLinePath">
                                <circle 
                                    v-for="(point, index) in failedPoints" 
                                    :key="'f-' + index"
                                    :cx="point.x" 
                                    :cy="point.y" 
                                    r="1"
                                    fill="rgb(239, 68, 68)"
                                    class="cursor-pointer hover:r-1.5 transition-all"
                                    @mouseenter="showLineTooltip(index, 'failed', dailyChartData[index])"
                                    @mouseleave="hideTooltip"
                                >
                                    <title>R{{ dailyChartData[index].failed }}</title>
                                </circle>
                            </g>
                        </svg>
                        
                        <!-- Tooltip -->
                        <div 
                            v-if="tooltipVisible" 
                            class="absolute px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10 pointer-events-none"
                            :style="{ left: tooltipX + '%', top: tooltipY + '%', transform: 'translate(-50%, -120%)' }"
                        >
                            {{ tooltipType === 'success' ? 'Successful' : 'Failed' }}: R{{ tooltipValue }}
                        </div>
                    </div>
                    
                    <!-- X-axis labels -->
                    <div class="absolute left-12 right-0 bottom-0 h-8 flex items-center justify-around text-xs text-gray-500">
                        <span v-for="(day, index) in dailyChartData" :key="index">{{ day.label }}</span>
                    </div>
                </div>
                
                <!-- Empty state when no data -->
                <div v-if="dailyChartData.length === 0" class="text-center py-8">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="lucide:bar-chart-3" class="w-8 h-8 text-gray-400" />
                    </div>
                    <p class="text-gray-600 font-medium">No payment data available</p>
                    <p class="text-xs text-gray-400 mt-1">Chart will appear when payments are made</p>
                </div>
            </div>
        </CardContent>
            </Card>

    <!-- Payments Table -->
    <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader>
            <CardTitle class="text-lg font-semibold text-gray-800">Payment History</CardTitle>
            <CardDescription class="text-sm">{{ fundingHistory.length }} payments found</CardDescription>
        </CardHeader>
        <CardContent class="p-0">
            <div v-if="isLoading" class="py-8 flex justify-center">
                <MyLoader />
            </div>
            <div v-else-if="fundingHistory.length > 0">
                <!-- Desktop Table - Scrollable -->
                <div class="hidden md:block overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                        <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <table class="min-w-[900px] w-full">
                                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[150px]">Date & Time</th>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[200px]">Reference</th>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700 w-[150px]">Method</th>
                                        <th class="text-right py-3 px-4 text-xs font-semibold text-gray-700 w-[120px]">Amount</th>
                                        <th class="text-center py-3 px-4 text-xs font-semibold text-gray-700 w-[100px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100 bg-white">
                                    <tr v-for="payment in fundingHistory" 
                                        :key="payment.id"
                                        class="hover:bg-blue-50/50 transition-colors duration-200"
                                    >
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <p class="text-sm font-medium text-gray-900">{{ formatDate(payment.created) }}</p>
                                            <p class="text-xs text-gray-500">{{ formatTime(payment.created) }}</p>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <p class="text-sm text-gray-600 font-mono">{{ payment.reference || 'N/A' }}</p>
                                        </td>
                                        <td class="py-3 px-4 whitespace-nowrap">
                                            <div class="flex items-center gap-2">
                                                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Icon name="lucide:credit-card" class="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span class="text-sm font-medium text-gray-900">Card</span>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-right whitespace-nowrap">
                                            <p class="text-sm font-semibold text-blue-600">
                                                R {{ formatAmount(payment.amount) }}
                                            </p>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <span 
                                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                                                :class="getStatusClass(payment.result_desc)"
                                            >
                                                {{ getStatusText(payment.result_desc) }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Mobile Cards -->
                <div class="md:hidden divide-y divide-gray-100">
                    <div v-for="payment in fundingHistory" 
                         :key="payment.id"
                         class="p-4"
                    >
                        <!-- Collapsed View -->
                        <div 
                            class="flex items-center justify-between cursor-pointer"
                            @click="toggleExpand(payment.id)"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                                    <Icon name="lucide:credit-card" class="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">Deposit</p>
                                    <p class="text-xs text-gray-500">{{ formatDate(payment.created) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <p class="text-sm font-bold text-blue-600">
                                    R {{ formatAmount(payment.amount) }}
                                </p>
                                <Icon 
                                    :name="expandedRows.includes(payment.id) ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                                    class="w-5 h-5 text-gray-400"
                                />
            </div>
      </div>
    
                        <!-- Expanded View -->
                        <div v-if="expandedRows.includes(payment.id)" class="mt-4 space-y-3 bg-gray-50 p-3 rounded-lg">
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Reference</span>
                                <span class="text-xs font-medium text-gray-900 font-mono">{{ payment.payvault_data_1 || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Time</span>
                                <span class="text-xs font-medium text-gray-900">{{ formatTime(payment.created) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Method</span>
                                <span class="text-xs font-medium text-gray-900">Card Payment</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs text-gray-600">Status</span>
                                <span 
                                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                    :class="getStatusClass(payment.result_desc)"
                                >
                                    {{ getStatusText(payment.result_desc) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="lucide:wallet" class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-gray-600 font-medium">No payments found</p>
                <p class="text-gray-400 text-sm mt-1">Payments will appear here when deposits are made</p>
            </div>
        </CardContent>
    </Card>
</div>
  </template>

<script>
definePageMeta({
    layout: 'wallet'
})

export default {
  data() {
    return {
      isLoading: false,
      fundingHistory: [
        {
          id: 1,
          created: '2025-10-09T14:30:00Z',
          payvault_data_1: 'REF-PAY-20251009-001',
          amount: 50000, // R500.00
          result_desc: 'Auth Done'
        },
        {
          id: 2,
          created: '2025-10-08T09:15:00Z',
          payvault_data_1: 'REF-PAY-20251008-002',
          amount: 30000, // R300.00
          result_desc: 'Auth Done'
        },
        {
          id: 3,
          created: '2025-10-07T16:45:00Z',
          payvault_data_1: 'REF-PAY-20251007-003',
          amount: 20000, // R200.00
          result_desc: 'Declined'
        },
        {
          id: 4,
          created: '2025-10-07T11:20:00Z',
          payvault_data_1: 'REF-PAY-20251007-004',
          amount: 15000, // R150.00
          result_desc: 'Auth Done'
        },
        {
          id: 5,
          created: '2025-10-06T08:30:00Z',
          payvault_data_1: 'REF-PAY-20251006-005',
          amount: 40000, // R400.00
          result_desc: 'Auth Done'
        },
        {
          id: 6,
          created: '2025-10-05T13:10:00Z',
          payvault_data_1: 'REF-PAY-20251005-006',
          amount: 25000, // R250.00
          result_desc: 'Insufficient Funds'
        },
        {
          id: 7,
          created: '2025-10-04T10:45:00Z',
          payvault_data_1: 'REF-PAY-20251004-007',
          amount: 35000, // R350.00
          result_desc: 'Auth Done'
        },
        {
          id: 8,
          created: '2025-10-03T15:20:00Z',
          payvault_data_1: 'REF-PAY-20251003-008',
          amount: 10000, // R100.00
          result_desc: 'Auth Done'
        },
        {
          id: 9,
          created: '2025-10-02T12:00:00Z',
          payvault_data_1: 'REF-PAY-20251002-009',
          amount: 50000, // R500.00
          result_desc: 'Auth Done'
        },
        {
          id: 10,
          created: '2025-10-01T09:30:00Z',
          payvault_data_1: 'REF-PAY-20251001-010',
          amount: 30000, // R300.00
          result_desc: 'Card Expired'
        },
        {
          id: 11,
          created: '2025-09-30T14:15:00Z',
          payvault_data_1: 'REF-PAY-20250930-011',
          amount: 45000, // R450.00
          result_desc: 'Auth Done'
        },
        {
          id: 12,
          created: '2025-09-29T11:00:00Z',
          payvault_data_1: 'REF-PAY-20250929-012',
          amount: 20000, // R200.00
          result_desc: 'Auth Done'
        }
      ],
      expandedRows: [],
      tooltipVisible: false,
      tooltipIndex: null,
      tooltipType: null,
      tooltipX: 0,
      tooltipY: 0,
      tooltipValue: 0
    }
  },
  methods: {
    async fetchData() {
        this.isLoading = true;
        try {
          const response = await useWalletAuthFetch(`${WALLET_API_URL}/pay/history`)
          this.fundingHistory = response.payments.reverse();
        } catch (error) {
          console.error('Error fetching payments:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to load payments',
            variant: 'destructive'
          });
        } finally {
          this.isLoading = false;
        }
      },
    
    formatAmount(amount) {
        return (parseFloat(amount) / 100).toFixed(2);
    },

    formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    },

    formatTime(dateString) {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-ZA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    },

    getStatusClass(status) {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'auth done') {
            return 'bg-green-100 text-green-700';
        }
        return 'bg-red-100 text-red-700';
    },

    getStatusText(status) {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'auth done') {
            return 'Successful';
        }
        return status || 'Failed';
    },

    toggleExpand(paymentId) {
        const index = this.expandedRows.indexOf(paymentId)
        if (index > -1) {
            this.expandedRows.splice(index, 1)
        } else {
            this.expandedRows.push(paymentId)
        }
    },
    
    showLineTooltip(index, type, day) {
        this.tooltipVisible = true;
        this.tooltipIndex = index;
        this.tooltipType = type;
        
        // Calculate tooltip position
        const dataLength = this.dailyChartData.length;
        this.tooltipX = (index / (dataLength - 1)) * 100;
        
        const value = parseFloat(type === 'success' ? day.success : day.failed);
        this.tooltipValue = value.toFixed(2);
        this.tooltipY = 100 - ((value / this.maxChartAmount) * 100);
    },
    
    hideTooltip() {
        this.tooltipVisible = false;
        this.tooltipIndex = null;
        this.tooltipType = null;
    }
  },
  
  mounted() {
    // Uncomment below to fetch real data
    this.fetchData()
  },
  
  computed: {
    totalDeposits() {
        return this.fundingHistory.reduce((sum, p) => sum + parseFloat(p.amount), 0) / 100;
    },

    successfulPayments() {
        return this.fundingHistory.filter(p => p.result_desc?.toLowerCase() === 'auth done');
    },

    failedPayments() {
        return this.fundingHistory.filter(p => p.result_desc?.toLowerCase() !== 'auth done');
    },

    successfulCount() {
        return this.successfulPayments.length;
    },

    failedCount() {
        return this.failedPayments.length;
    },

    successRate() {
        if (this.fundingHistory.length === 0) return 0;
        return ((this.successfulCount / this.fundingHistory.length) * 100).toFixed(1);
    },

    failedAmount() {
        return (this.failedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0) / 100).toFixed(2);
    },

    averageDeposit() {
        if (this.successfulPayments.length === 0) return '0.00';
        const total = this.successfulPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        return (total / this.successfulPayments.length / 100).toFixed(2);
    },

    dailyChartData() {
        // Group payments by date
        const groupedByDate = {};
        
        this.fundingHistory.forEach(payment => {
            const date = new Date(payment.created);
            const dateKey = date.toISOString().split('T')[0];
            
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = {
                    date: dateKey,
                    success: 0,
                    failed: 0
                };
            }
            
            const amount = parseFloat(payment.amount) / 100;
            if (payment.result_desc?.toLowerCase() === 'auth done') {
                groupedByDate[dateKey].success += amount;
            } else {
                groupedByDate[dateKey].failed += amount;
            }
        });
        
        // Convert to array and sort by date
        const chartData = Object.values(groupedByDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(day => ({
                label: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                success: day.success.toFixed(2),
                failed: day.failed.toFixed(2),
                date: day.date
            }));
        
        // Show last 7 days for better readability
        return chartData.slice(-7);
    },
    
    maxChartAmount() {
        if (this.dailyChartData.length === 0) return 100;
        
        const maxSuccess = Math.max(...this.dailyChartData.map(d => parseFloat(d.success)));
        const maxFailed = Math.max(...this.dailyChartData.map(d => parseFloat(d.failed)));
        const max = Math.max(maxSuccess, maxFailed);
        
        // Round up to nearest 50
        return Math.ceil(max / 50) * 50;
    },
    
    successPoints() {
        return this.dailyChartData.map((day, index) => {
            const x = (index / (this.dailyChartData.length - 1)) * 100;
            const y = 100 - ((parseFloat(day.success) / this.maxChartAmount) * 100);
            return { x, y };
        });
    },
    
    failedPoints() {
        return this.dailyChartData.map((day, index) => {
            const x = (index / (this.dailyChartData.length - 1)) * 100;
            const y = 100 - ((parseFloat(day.failed) / this.maxChartAmount) * 100);
            return { x, y };
        });
    },
    
    successLinePath() {
        if (this.successPoints.length === 0) return '';
        return this.successPoints.map((point, index) => {
            return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
        }).join(' ');
    },
    
    failedLinePath() {
        if (this.failedPoints.length === 0) return '';
        return this.failedPoints.map((point, index) => {
            return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
        }).join(' ');
    },
    
    successAreaPath() {
        if (this.successPoints.length === 0) return '';
        const linePath = this.successLinePath;
        const firstPoint = this.successPoints[0];
        const lastPoint = this.successPoints[this.successPoints.length - 1];
        return `${linePath} L ${lastPoint.x} 100 L ${firstPoint.x} 100 Z`;
    },
    
    failedAreaPath() {
        if (this.failedPoints.length === 0) return '';
        const linePath = this.failedLinePath;
        const firstPoint = this.failedPoints[0];
        const lastPoint = this.failedPoints[this.failedPoints.length - 1];
        return `${linePath} L ${lastPoint.x} 100 L ${firstPoint.x} 100 Z`;
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for payment table */
.scrollbar-thin::-webkit-scrollbar {
    height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    transition: background 0.2s ease;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Firefox scrollbar */
.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>