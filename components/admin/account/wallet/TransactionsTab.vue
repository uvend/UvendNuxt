<template>
  <div class="flex-1 min-h-0 overflow-auto custom-scrollbar">
    <table v-if="transactions.length > 0" class="w-full">
      <thead class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-b border-gray-200">
        <tr>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Date</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Meter</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Token</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Utility</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Amount</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tx in transactions"
          :key="tx.id"
          class="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200"
        >
          <td class="py-2 px-4 text-sm text-gray-600">{{ formatDateTime(tx.created) }}</td>
          <td class="py-2 px-4 text-sm font-medium text-gray-900">{{ tx.details?.meterNumber || tx.reference || '—' }}</td>
          <td class="py-2 px-4 text-xs text-gray-600 font-mono max-w-[220px]">
            <div class="truncate" :title="getTokenNumber(tx)">{{ getTokenNumber(tx) }}</div>
          </td>
          <td class="py-2 px-4 text-sm text-gray-700">{{ tx.details?.utilityType || '—' }}</td>
          <td class="py-2 px-4 text-sm font-semibold text-green-600">{{ formatMoney(tx.amount) }}</td>
          <td class="py-2 px-4 text-sm capitalize text-gray-600">{{ tx.status || '—' }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="p-12 text-center text-gray-500">
      <p class="font-medium text-gray-600">No transactions found</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  formatDateTime: {
    type: Function,
    required: true,
  },
  formatMoney: {
    type: Function,
    required: true,
  },
})

function getTokenNumber(tx) {
  return (
    tx?.details?.vendResponse?.listOfTokenTransactions?.[0]?.tokens?.[0]?.delimitedTokenNumber ||
    tx?.details?.vendResponse?.listOfTokenTransactions?.[0]?.token?.delimitedTokenNumber ||
    tx?.details?.vendResponse?.token ||
    tx?.details?.token ||
    '—'
  )
}
</script>
