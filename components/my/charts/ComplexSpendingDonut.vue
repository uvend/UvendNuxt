<template>
  <div class="w-full h-full">
    <Card class="h-full flex flex-col">
      <CardHeader class="pb-2 flex-shrink-0">
        <CardTitle class="text-lg font-semibold">{{ title }}</CardTitle>
        <CardDescription>{{ description }}</CardDescription>
      </CardHeader>
      <CardContent class="flex-1 min-h-0">
        <div v-if="hasData" class="w-full h-full">
          <apexchart
            type="bar"
            :options="chartOptions"
            :series="chartSeries"
            height="100%"
          />
        </div>
        <div v-else class="flex items-center justify-center h-full text-gray-500">
          <div class="text-center">
            <Icon name="lucide:bar-chart-3" class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No spending data available</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const chartData = computed(() => {
  if (!props.transactions || props.transactions.length === 0) {
    return []
  }

  // Group transactions by complex and sum spending
  const complexSpending = {}
  
  props.transactions.forEach(transaction => {
    const complexName = transaction.complexName || 'Unknown Complex'
    const amount = parseFloat(transaction.managedTenderAmount) || 0
    
    if (!complexSpending[complexName]) {
      complexSpending[complexName] = 0
    }
    complexSpending[complexName] += amount
  })
  
  // Filter out complexes with zero spending and convert to array
  const spendingArray = Object.entries(complexSpending)
    .filter(([complex, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a) // Sort by amount descending
  
  return spendingArray.map(([complex, amount]) => ({
    name: complex,
    value: amount
  }))
})

const hasData = computed(() => {
  return chartData.value.length > 0
})

const chartSeries = computed(() => [
  {
    name: 'Spending',
    data: chartData.value.map(item => item.value)
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: '100%',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    }
  },
  colors: ['#3b82f6'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      borderRadius: 4,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return `R ${parseFloat(val).toFixed(2)}`
    },
    style: {
      fontSize: '11px',
      fontWeight: '500',
      colors: ['#374151']
    }
  },
  xaxis: {
    categories: chartData.value.map(item => item.name),
    labels: {
      style: {
        colors: '#64748b',
        fontSize: '11px'
      },
      rotate: -45,
      rotateAlways: false
    }
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return `R ${value.toFixed(2)}`
      },
      style: {
        colors: '#64748b',
        fontSize: '11px'
      }
    }
  },
  grid: {
    borderColor: '#e2e8f0',
    strokeDashArray: 4
  },
  tooltip: {
    y: {
      formatter: function (value) {
        return `R ${value.toFixed(2)}`
      }
    }
  },
  legend: {
    show: false
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '80%'
          }
        },
        xaxis: {
          labels: {
            rotate: -90
          }
        }
      }
    }
  ]
}))
</script>
