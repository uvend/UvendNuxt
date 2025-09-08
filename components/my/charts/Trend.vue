<template>
  <div class="w-full h-full flex flex-col">
    <Card class="h-full flex flex-col">
      <CardHeader class="pb-2 flex-shrink-0">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <CardTitle class="text-lg font-semibold">{{ title }}</CardTitle>
            <CardDescription>{{ description }}</CardDescription>
            
            <!-- Date Range Selector -->
            <div class="flex flex-col lg:flex-row gap-4 mt-3">
              <div class="flex gap-2">
                <Button 
                  :variant="selectedUtility === 'Water' ? 'default' : 'outline'" 
                  size="sm"
                  @click="selectedUtility = 'Water'"
                >
                  Water
                </Button>
                <Button 
                  :variant="selectedUtility === 'Electricity' ? 'default' : 'outline'" 
                  size="sm"
                  @click="selectedUtility = 'Electricity'"
                >
                  Electricity
                </Button>
                <Button 
                  :variant="selectedUtility === 'Both' ? 'default' : 'outline'" 
                  size="sm"
                  @click="selectedUtility = 'Both'"
                >
                  Both
                </Button>
              </div>
              
              <!-- Date Range Controls -->
              <div class="flex flex-col lg:flex-row gap-2">
                <Select v-model="selectedDateRange" @update:model-value="onDateRangeChange">
                  <SelectTrigger class="w-32 bg-white border-gray-200 rounded-lg">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastDay">Last Day</SelectItem>
                    <SelectItem value="lastWeek">Last Week</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                
                <!-- Custom Date Inputs -->
                <div v-if="selectedDateRange === 'custom'" class="flex gap-2">
                  <Input 
                    type="date" 
                    v-model="startDate"
                    class="w-32 bg-white border-gray-200 rounded-lg"
                    @change="updateCustomDateRange"
                  />
                  <Input 
                    type="date" 
                    v-model="endDate"
                    class="w-32 bg-white border-gray-200 rounded-lg"
                    @change="updateCustomDateRange"
                  />
                </div>
                
                <!-- Current Range Display -->
                <div class="flex items-center">
                  <div class="bg-gray-50 rounded-lg px-2 py-1">
                    <div class="text-xs text-gray-500">{{ formattedDateRange }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Custom Chart Controls -->
          <div class="flex gap-1 ml-4">
            <Button
              variant="outline"
              size="sm"
              @click="downloadCSV"
              title="Download CSV"
            >
              <Icon name="lucide:download" class="w-4 h-4" />
              Export To CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent class="flex-1 min-h-0">
        <div v-if="hasData" class="w-full h-full">
          <apexchart
            ref="chartRef"
            type="area"
            :options="chartOptions"
            :series="chartSeries"
            height="100%"
          />
        </div>
        <div v-else class="flex items-center justify-center h-full text-gray-500">
          <div class="text-center">
            <Icon name="lucide:bar-chart-3" class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No data available for the selected period</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['dateRangeChanged'])

const selectedUtility = ref('Both')
const chartRef = ref(null)
const selectedDateRange = ref('lastMonth')
const startDate = ref(null)
const endDate = ref(null)

const chartData = computed(() => {
  console.log('Trend component received transactions:', props.transactions)
  if (!props.transactions || props.transactions.length === 0) {
    return { water: [], electricity: [] }
  }

  // Filter transactions by date range
  const filteredTransactions = props.transactions.filter(transaction => {
    if (!startDate.value || !endDate.value) return true
    
    const transactionDate = new Date(transaction.transactionDate)
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    
    return transactionDate >= start && transactionDate <= end
  })

  const waterGrouped = {}
  const electricityGrouped = {}
  
  filteredTransactions.forEach(transaction => {
    const date = new Date(transaction.transactionDate)
    // Get the start of the day (midnight)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayKey = dayStart.toISOString()
    
    const amount = parseFloat(transaction.managedTenderAmount) || 0
    
    if (transaction.utilityType === 'Water') {
      if (!waterGrouped[dayKey]) {
        waterGrouped[dayKey] = 0
      }
      waterGrouped[dayKey] += amount
    } else if (transaction.utilityType === 'Electricity') {
      if (!electricityGrouped[dayKey]) {
        electricityGrouped[dayKey] = 0
      }
      electricityGrouped[dayKey] += amount
    }
  })
  
  // Get all unique days
  const allDays = new Set([
    ...Object.keys(waterGrouped),
    ...Object.keys(electricityGrouped)
  ])
  
  // Sort days
  const sortedDays = Array.from(allDays).sort()
  
  // Convert to chart data format
  const waterData = sortedDays.map(day => ({
    x: new Date(day),
    y: waterGrouped[day] || 0
  }))
  
  const electricityData = sortedDays.map(day => ({
    x: new Date(day),
    y: electricityGrouped[day] || 0
  }))
  
  return {
    water: waterData,
    electricity: electricityData
  }
})

const hasData = computed(() => {
  return chartData.value.water.length > 0 || chartData.value.electricity.length > 0
})

const chartSeries = computed(() => {
  const series = []
  
  if (selectedUtility.value === 'Water' || selectedUtility.value === 'Both') {
    series.push({
      name: 'Water',
      data: chartData.value.water
    })
  }
  
  if (selectedUtility.value === 'Electricity' || selectedUtility.value === 'Both') {
    series.push({
      name: 'Electricity',
      data: chartData.value.electricity
    })
  }
  
  return series
})

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    autoSelected:'pan',
    toolbar: {
      show: true,
      tools:{
        pan:true,
        zoom:false,
        zoomin:false,
        zoomout:false,
        reset:false,
        download:false
      }
      
    },
    // zoom: {
    //   enabled: true,
    //   type: 'x',
    //   autoScaleYaxis: true
    // },
    pan: {
      enabled: true,
      type: 'x'
    },
    
    height: '100%'
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  colors: ['#3b82f6', '#f59e0b'], // Blue for Water, Yellow for Electricity
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 90, 100]
    }
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    borderColor: '#e2e8f0',
    strokeDashArray: 4
  },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'MMM dd',
      style: {
        colors: '#64748b',
        fontSize: '11px'
      }
    }
  },
  yaxis: {
    labels: {
      formatter: (value) => `R ${value.toFixed(2)}`,
      style: {
        colors: '#64748b',
        fontSize: '11px'
      }
    }
  },
  tooltip: {
    x: {
      format: 'MMM dd, yyyy'
    },
    y: {
      formatter: (value) => `R ${value.toFixed(2)}`
    }
  },
  markers: {
    size: 3,
    strokeColors: '#ffffff',
    strokeWidth: 2
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '12px',
    markers: {
      width: 10,
      height: 10
    },
    itemMargin: {
      horizontal: 10
    }
  }
}))

// Custom chart control methods
const downloadCSV = () => {
  if (!hasData.value) return
  
  const csvData = []
  const headers = ['Date', 'Water (R)', 'Electricity (R)', 'Total (R)']
  csvData.push(headers.join(','))
  
  // Get all unique dates
  const allDates = new Set()
  chartData.value.water.forEach(item => allDates.add(item.x))
  chartData.value.electricity.forEach(item => allDates.add(item.x))
  
  // Sort dates
  const sortedDates = Array.from(allDates).sort()
  
  // Create CSV rows
  sortedDates.forEach(date => {
    const waterAmount = chartData.value.water.find(item => item.x.getTime() === date.getTime())?.y || 0
    const electricityAmount = chartData.value.electricity.find(item => item.x.getTime() === date.getTime())?.y || 0
    const total = waterAmount + electricityAmount
    
    const row = [
      date.toISOString().split('T')[0],
      waterAmount.toFixed(2),
      electricityAmount.toFixed(2),
      total.toFixed(2)
    ]
    csvData.push(row.join(','))
  })
  
  // Create and download file
  const csvContent = csvData.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `trend-data-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const zoomIn = () => {
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.zoomX(0.8, 1.2)
  }
}

const zoomOut = () => {
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.zoomX(1.2, 0.8)
  }
}

const resetZoom = () => {
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.resetSeries()
  }
}

// Date range methods
const onDateRangeChange = (value) => {
  const today = new Date();
  let newStartDate, newEndDate;
  
  switch (value) {
    case 'lastDay':
      newStartDate = new Date(today);
      newStartDate.setDate(today.getDate() - 1);
      newEndDate = new Date(today);
      break;
      
    case 'lastWeek':
      newStartDate = new Date(today);
      newStartDate.setDate(today.getDate() - 7);
      newEndDate = new Date(today);
      break;
      
    case 'lastMonth':
      newStartDate = new Date(today);
      newStartDate.setDate(today.getDate() - 30);
      newEndDate = new Date(today);
      break;
      
    case 'custom':
      // Keep existing dates for custom range
      return;
      
    default:
      return;
  }
  
  // Update the date inputs
  startDate.value = newStartDate.toISOString().split('T')[0];
  endDate.value = newEndDate.toISOString().split('T')[0];
  
  // Emit the date range change to parent
  emit('dateRangeChanged', {
    start: newStartDate.toISOString(),
    end: newEndDate.toISOString()
  });
}

const updateCustomDateRange = () => {
  // This method is called when custom date inputs change
  // The chartData computed property will automatically update
  
  // Emit the custom date range change to parent
  if (startDate.value && endDate.value) {
    emit('dateRangeChanged', {
      start: new Date(startDate.value).toISOString(),
      end: new Date(endDate.value).toISOString()
    });
  }
}

const formattedDateRange = computed(() => {
  if (!startDate.value || !endDate.value) {
    return 'No date range selected';
  }
  
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  
  // Check if it's the same day
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  
  // Check if it's the same month
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })}`;
  }
  
  // Different months/years
  return `${start.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}`;
})

// Initialize date range on component mount
onMounted(() => {
  const today = new Date()
  const lastMonth = new Date()
  lastMonth.setDate(today.getDate() - 30)
  
  startDate.value = lastMonth.toISOString().split('T')[0];
  endDate.value = today.toISOString().split('T')[0];
  
  // Emit initial date range to parent
  emit('dateRangeChanged', {
    start: lastMonth.toISOString(),
    end: today.toISOString()
  });
})

</script>
