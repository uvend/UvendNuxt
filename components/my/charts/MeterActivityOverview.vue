<template>
  <Card class="relative bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden py-3 px-4 h-full">
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
          <Icon name="lucide:gauge" class="w-3.5 h-3.5 text-slate-600" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-gray-800 leading-tight">Meter activity</p>
          <p class="text-[10px] text-gray-500 leading-tight mt-0.5">Active = vended within 30 days</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="h-2 rounded-full bg-gray-200 animate-pulse mb-2" />
    <template v-else>
      <!-- Single stacked bar: green | red -->
      <div class="flex h-2 w-full rounded-full overflow-hidden bg-gray-100 mb-2.5">
        <template v-if="total > 0">
          <div
            class="h-full bg-emerald-500 shrink-0 transition-[width] duration-300 ease-out"
            :style="{ width: activePct + '%' }"
            title="Active"
          />
          <div
            class="h-full bg-rose-500 shrink-0 transition-[width] duration-300 ease-out"
            :style="{ width: inactivePct + '%' }"
            title="Inactive"
          />
        </template>
        <div v-else class="h-full w-full bg-gray-200" />
      </div>

      <!-- Counts on same KPI -->
      <div
        v-if="total > 0"
        class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[11px] text-gray-600"
      >
        <span>
          <span class="font-semibold text-emerald-600 tabular-nums">{{ activeCount }}</span>
          active
        </span>
        <span class="text-gray-300">·</span>
        <span>
          <span class="font-semibold text-rose-600 tabular-nums">{{ inactiveCount }}</span>
          inactive
        </span>
        <span class="text-gray-300">·</span>
        <span class="text-gray-500">
          <span class="font-semibold text-gray-800 tabular-nums">{{ total }}</span>
          total
        </span>
      </div>
      <p v-else class="text-[11px] text-gray-500">No meter data yet</p>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeCount: { type: Number, default: 0 },
  inactiveCount: { type: Number, default: 0 },
  loading: { type: Boolean, default: true }
})

const total = computed(() => props.activeCount + props.inactiveCount)

const activePct = computed(() => {
  const t = total.value
  if (!t) return 0
  return (props.activeCount / t) * 100
})

const inactivePct = computed(() => {
  const t = total.value
  if (!t) return 0
  return (props.inactiveCount / t) * 100
})
</script>
