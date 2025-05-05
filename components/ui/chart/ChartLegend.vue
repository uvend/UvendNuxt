<script setup lang="ts">
import type { BulletLegendItemInterface } from '@unovis/ts'
import type { PropType } from 'vue'

const props = defineProps({
  items: {
    type: Array as PropType<BulletLegendItemInterface[]>,
    required: true,
  },
})

const emit = defineEmits<{
  'update:items': [items: BulletLegendItemInterface[]]
  'legend-item-click': [item: BulletLegendItemInterface, index: number]
}>()

function handleItemClick(item: BulletLegendItemInterface, index: number) {
  const newItems = [...props.items]
  newItems[index] = { ...item, inactive: !item.inactive }
  emit('update:items', newItems)
  emit('legend-item-click', item, index)
}
</script>

<template>
  <div class="flex flex-wrap gap-4 mb-4">
    <button
      v-for="(item, i) in items"
      :key="item.name"
      class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
      :class="{ 'opacity-50': item.inactive }"
      @click="handleItemClick(item, i)"
    >
      <span
        class="w-3 h-3 rounded-full"
        :style="{ backgroundColor: item.color }"
      />
      <span class="text-sm font-medium">{{ item.name }}</span>
    </button>
  </div>
</template>
