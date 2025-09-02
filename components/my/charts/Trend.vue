<template>
  <div class="w-full h-full flex flex-col">
    <Card class="h-full flex flex-col">
      <CardHeader class="pb-2 flex-shrink-0">
        <CardTitle class="text-lg font-semibold">{{ title }}</CardTitle>
        <CardDescription>{{ description }}</CardDescription>
        <div class="flex gap-2 mt-2">
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
      </CardHeader>
      <CardContent class="flex-1 min-h-0">
        <div v-if="hasData" class="w-full h-full">
          <apexchart
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
  }
})

const selectedUtility = ref('Both')

const chartData = computed(() => {
  console.log('Trend component received transactions:', props.transactions)
  if (!props.transactions || props.transactions.length === 0) {
    return { water: [], electricity: [] }
  }

  const waterGrouped = {}
  const electricityGrouped = {}
  
  props.transactions.forEach(transaction => {
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
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      }
    },
    zoom: {
      enabled: true,
      type: 'x',
      autoScaleYaxis: true
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
</script>
