<template>
  <div class="w-full h-full">
    <Card class="h-full flex flex-col">
      <CardHeader class="pb-2">
        <CardTitle class="text-lg font-semibold">Spending Distribution</CardTitle>
        <CardDescription>Breakdown of your utility spending</CardDescription>
      </CardHeader>
      <CardContent class="flex-1 min-h-0">
        <div v-if="chartData.length > 0" class="w-full h-full">
          <apexchart
            type="pie"
            :options="chartOptions"
            :series="chartSeries"
            height="100%"
          />
        </div>
        <div v-else class="flex items-center justify-center h-full text-gray-500">
          <div class="text-center">
            <Icon name="lucide:pie-chart" class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No data available</p>
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
  }
})

const chartData = computed(() => {
  if (!props.transactions || props.transactions.length === 0) {
    return []
  }

  const waterSpending = props.transactions
    .filter(t => t.utilityType === 'Water')
    .reduce((sum, t) => sum + (parseFloat(t.managedTenderAmount) || 0), 0)

  const electricitySpending = props.transactions
    .filter(t => t.utilityType === 'Electricity')
    .reduce((sum, t) => sum + (parseFloat(t.managedTenderAmount) || 0), 0)

  return [
    {
      name: 'Water',
      value: waterSpending
    },
    {
      name: 'Electricity',
      value: electricitySpending
    }
  ].filter(item => item.value > 0)
})

const chartSeries = computed(() => chartData.value.map(item => item.value))

const chartOptions = computed(() => ({
  chart: {
    type: 'pie',
    toolbar: {
      show: false
    },
    height: '100%'
  },
  colors: ['#3b82f6', '#f59e0b'],
  labels: chartData.value.map(item => item.name),
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.globals.seriesTotals[opts.seriesIndex].toFixed(2)
    },
    style: {
      fontSize: '12px',
      fontWeight: 'bold'
    }
  },
  legend: {
    position: 'bottom',
    fontSize: '12px',
    markers: {
      width: 10,
      height: 10
    }
  },
  tooltip: {
    y: {
      formatter: function (value) {
        return `R ${value.toFixed(2)}`
      }
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '50%'
      },
      offsetY: 0
    }
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ]
}))
</script>
