<template>
  <Card class="relative bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden py-3 px-4 flex-1 min-w-0">
    <div class="flex items-start gap-2 mb-2">
      <div class="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
        <Icon name="lucide:receipt" class="w-3.5 h-3.5 text-indigo-600" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-xs font-semibold text-gray-800 leading-tight">Total vends</p>
        <p class="text-[10px] text-gray-500 leading-tight mt-0.5">Value and number of vends in the loaded period</p>
      </div>
    </div>

    <div v-if="loading" class="space-y-2">
      <div class="h-7 rounded-lg bg-gray-200 animate-pulse" />
      <div class="h-4 w-24 rounded bg-gray-200 animate-pulse" />
    </div>
    <div v-else class="space-y-1">
      <div class="text-2xl font-bold tabular-nums text-indigo-700 leading-tight">
        {{ formattedAmount }}
      </div>
      <div class="text-[11px] text-gray-600">
        <span class="font-semibold tabular-nums text-gray-800">{{ formattedCount }}</span>
        transactions
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  loading: { type: Boolean, default: true }
})

const { formatMoney } = useCurrency()

const formattedCount = computed(() =>
  new Intl.NumberFormat('en-ZA').format(props.count || 0)
)

const formattedAmount = computed(() => formatMoney(props.totalAmount ?? 0))
</script>
