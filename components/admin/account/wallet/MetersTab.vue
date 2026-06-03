<template>
  <div class="flex-1 min-h-0 overflow-auto custom-scrollbar">
    <table v-if="meters.length > 0" class="w-full">
      <thead class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-b border-gray-200">
        <tr>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Meter Number</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Name</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Utility</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Favourite</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Added</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="meter in meters"
          :key="meter.id"
          class="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200"
        >
          <td class="py-2 px-4 text-sm font-medium text-gray-900">{{ meter.meterNumber || '—' }}</td>
          <td class="py-2 px-4 text-sm text-gray-700">{{ meter.name || '—' }}</td>
          <td class="py-2 px-4 text-sm text-gray-700">{{ meter.utilityType || '—' }}</td>
          <td class="py-2 px-4 text-sm text-gray-600">
            <Icon
              v-if="meter.favourite"
              name="lucide:star"
              class="w-4 h-4 text-amber-500"
            />
            <span v-else>—</span>
          </td>
          <td class="py-2 px-4 text-sm text-gray-600">{{ formatDateTime(meter.created) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="p-12 text-center text-gray-500">
      <p class="font-medium text-gray-600">No meters found</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  meters: {
    type: Array,
    default: () => [],
  },
  formatDateTime: {
    type: Function,
    required: true,
  },
})
</script>
