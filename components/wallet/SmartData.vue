<template>
    <div class="w-full">
        <!-- Loading State -->
        <div v-if="isloading" class="flex items-center justify-center py-6">
            <div class="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mr-2"></div>
            <span class="text-gray-600 text-sm">Loading water data...</span>
        </div>

        <!-- Water Data Widget -->
        <div v-else-if="waterData" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <!-- Widget Header -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900">Water Meter Status</h3>
                </div>
                <div class="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-xs font-medium text-green-700">Live</span>
                </div>
            </div>

            <!-- Data Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <!-- Current Flow -->
                <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex items-center gap-2 mb-2">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 3v5h-5"/>
                        </svg>
                        <span class="text-xs font-medium text-gray-600">Current Flow</span>
                    </div>
                    <div class="text-lg font-bold text-gray-900">{{ formatWaterFlow(waterData.WaterFlow) }}</div>
                    <div class="text-xs text-gray-500">{{ formatWaterFlowCubic(waterData.WaterFlow) }}</div>
                </div>

                <!-- Remaining Water -->
                <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex items-center gap-2 mb-2">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
                        </svg>
                        <span class="text-xs font-medium text-gray-600">Remaining</span>
                    </div>
                    <div class="text-lg font-bold text-gray-900">{{ formatRemainingWater(waterData.RemainingWater) }}</div>
                    <div class="text-xs text-gray-500">{{ formatRemainingWaterCubic(waterData.RemainingWater) }}</div>
                </div>

                <!-- Battery -->
                <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex items-center gap-2 mb-2">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="1" y="6" width="18" height="10" rx="2" ry="2"/>
                            <line x1="23" y1="13" x2="23" y2="11"/>
                        </svg>
                        <span class="text-xs font-medium text-gray-600">Battery</span>
                    </div>
                    <div class="text-lg font-bold text-gray-900">{{ formatBattery(waterData.Battery) }}</div>
                    <div class="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                        <div 
                            class="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
                            :style="{ width: getBatteryPercentage(waterData.Battery) + '%' }"
                        ></div>
                    </div>
                </div>

                <!-- Valve State -->
                <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex items-center gap-2 mb-2">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h8"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8"/>
                        </svg>
                        <span class="text-xs font-medium text-gray-600">Valve</span>
                    </div>
                    <div 
                        class="text-lg font-bold"
                        :class="{
                            'text-green-700': waterData.Valve === 1,
                            'text-red-700': waterData.Valve === 0
                        }"
                    >
                        {{ formatValveState(waterData.Valve) }}
                    </div>
                </div>
            </div>

            <!-- Additional Info -->
            <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Positive Flow:</span>
                        <span class="font-medium">{{ formatNumber(waterData.PositiveWaterFlow) }} L</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Back Flow:</span>
                        <span class="font-medium">{{ formatNumber(waterData.BackWaterFlow) }} L</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Last Updated:</span>
                        <span class="font-medium text-xs">{{ formatDateTime(waterData.LocaDateTime) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Data State -->
        <div v-else class="bg-gray-50 rounded-xl p-6 text-center">
            <div class="text-gray-400 mb-2">
                <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">No Water Data Available</h3>
            <p class="text-xs text-gray-500">Unable to retrieve water meter information</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        waterData: {
            type: Object,
            default: null
        },
        isloading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        formatWaterFlow(flow) {
            if (!flow) return '0 L/min'
            return `${this.formatNumber(flow)} L/min`
        },
        formatWaterFlowCubic(flow) {
            if (!flow) return '0 m³/min'
            const cubic = (flow / 1000).toFixed(4)
            return `${cubic} m³/min`
        },
        formatRemainingWater(water) {
            if (!water) return '0 L'
            return `${this.formatNumber(water)} L`
        },
        formatRemainingWaterCubic(water) {
            if (!water) return '0 m³'
            const cubic = (water / 1000).toFixed(1)
            return `${cubic} m³`
        },
        formatBattery(battery) {
            if (!battery) return '0V'
            return `${battery}V`
        },
        getBatteryPercentage(battery) {
            if (!battery) return 0
            // Assuming 3.0V is low and 4.2V is full charge
            const minVoltage = 3.0
            const maxVoltage = 4.2
            const percentage = Math.max(0, Math.min(100, ((battery - minVoltage) / (maxVoltage - minVoltage)) * 100))
            return Math.round(percentage)
        },
        formatValveState(valve) {
            if (valve === 1) return 'Open'
            if (valve === 0) return 'Closed'
            return 'Unknown'
        },
        formatNumber(num) {
            if (!num) return '0'
            return new Intl.NumberFormat('en-US').format(num)
        },
        formatDateTime(dateTimeString) {
            if (!dateTimeString) return 'Unknown'
            
            // Parse YYMMDDHHMMSS format
            const year = 2000 + parseInt(dateTimeString.substring(0, 2))
            const month = parseInt(dateTimeString.substring(2, 4)) - 1 // JavaScript months are 0-indexed
            const day = parseInt(dateTimeString.substring(4, 6))
            const hour = parseInt(dateTimeString.substring(6, 8))
            const minute = parseInt(dateTimeString.substring(8, 10))
            const second = parseInt(dateTimeString.substring(10, 12))
            
            const date = new Date(year, month, day, hour, minute, second)
            
            return new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Africa/Johannesburg'
            }).format(date)
        }
    }
}
</script>