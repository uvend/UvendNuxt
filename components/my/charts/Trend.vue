<template>
  <div class="w-full h-full flex flex-col">
    <Card class="h-full flex flex-col">
      <CardHeader class="pb-2 flex-shrink-0">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <CardTitle class="text-lg font-semibold">{{ title }}</CardTitle>
            <CardDescription>{{ description }}</CardDescription>
            
            <!-- Utility Selector -->
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
                  :variant="selectedUtility === 'Gas' ? 'default' : 'outline'" 
                  size="sm"
                  @click="selectedUtility = 'Gas'"
                >
                  Gas
                </Button>
                <Button 
                  :variant="selectedUtility === 'All' ? 'default' : 'outline'" 
                  size="sm"
                  @click="selectedUtility = 'All'"
                >
                  All
                </Button>
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
import { computed, ref } from 'vue'

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
  },
  startDate: {
    type: String,
    default: null
  },
  endDate: {
    type: String,
    default: null
  }
})

const { formatMoney, currencyCode } = useCurrency()

const selectedUtility = ref('All')
const chartRef = ref(null)

function parseRangeDate(value, endOfDay) {
  if (!value) return null
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2]) - 1
    const day = Number(match[3])
    return endOfDay
      ? new Date(year, month, day, 23, 59, 59, 999)
      : new Date(year, month, day, 0, 0, 0, 0)
  }
  return new Date(value)
}

const chartData = computed(() => {
  // console.log('Trend component received transactions:', props.transactions)
  if (!props.transactions || props.transactions.length === 0) {
    return { water: [], electricity: [], gas: [] }
  }

  // Filter transactions by date range
  const filteredTransactions = props.transactions.filter(transaction => {
    if (!props.startDate || !props.endDate) return true
    
    const transactionDate = new Date(transaction.transactionDate)
    const start = parseRangeDate(props.startDate, false)
    const end = parseRangeDate(props.endDate, true)
    
    return transactionDate >= start && transactionDate <= end
  })

  const waterGrouped = {}
  const electricityGrouped = {}
  const gasGrouped = {}
  
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
    } else if (transaction.utilityType === 'Gas') {
      if (!gasGrouped[dayKey]) {
        gasGrouped[dayKey] = 0
      }
      gasGrouped[dayKey] += amount
    }
  })
  
  // Get all unique days
  const allDays = new Set([
    ...Object.keys(waterGrouped),
    ...Object.keys(electricityGrouped),
    ...Object.keys(gasGrouped)
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

  const gasData = sortedDays.map(day => ({
    x: new Date(day),
    y: gasGrouped[day] || 0
  }))
  
  return {
    water: waterData,
    electricity: electricityData,
    gas: gasData
  }
})

const hasData = computed(() => {
  return (
    chartData.value.water.length > 0 ||
    chartData.value.electricity.length > 0 ||
    chartData.value.gas.length > 0
  )
})

const chartSeries = computed(() => {
  const series = []
  
  if (selectedUtility.value === 'Water' || selectedUtility.value === 'All') {
    series.push({
      name: 'Water',
      data: chartData.value.water,
      color: '#3b82f6'
    })
  }
  
  if (selectedUtility.value === 'Electricity' || selectedUtility.value === 'All') {
    series.push({
      name: 'Electricity',
      data: chartData.value.electricity,
      color: '#f59e0b'
    })
  }

  if (selectedUtility.value === 'Gas' || selectedUtility.value === 'All') {
    series.push({
      name: 'Gas',
      data: chartData.value.gas,
      color: '#ef4444'
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
  colors: ['#3b82f6', '#f59e0b', '#ef4444'], // Water (blue), Electricity (yellow), Gas (red)
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
      formatter: (value) => formatMoney(value),
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
      formatter: (value) => formatMoney(value)
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
  const headers = ['Date', `Water (${currencyCode})`, `Electricity (${currencyCode})`, `Total (${currencyCode})`]
  csvData.push(headers.join(','))
  
  // Get all unique dates
  const allDates = new Set()
  chartData.value.water.forEach(item => allDates.add(item.x))
  chartData.value.electricity.forEach(item => allDates.add(item.x))
  chartData.value.gas.forEach(item => allDates.add(item.x))
  
  // Sort dates
  const sortedDates = Array.from(allDates).sort()
  
  // Create CSV rows
  sortedDates.forEach(date => {
    const waterAmount = chartData.value.water.find(item => item.x.getTime() === date.getTime())?.y || 0
    const electricityAmount = chartData.value.electricity.find(item => item.x.getTime() === date.getTime())?.y || 0
    const gasAmount = chartData.value.gas.find(item => item.x.getTime() === date.getTime())?.y || 0
    const total = waterAmount + electricityAmount + gasAmount
    
    const row = [
      date.toISOString().split('T')[0],
      waterAmount.toFixed(2),
      electricityAmount.toFixed(2),
      gasAmount.toFixed(2),
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

</script>
