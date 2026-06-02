<template>
  <div class="flex-1 min-h-0 overflow-auto custom-scrollbar">
    <table v-if="payments.length > 0" class="w-full">
      <thead class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-b border-gray-200">
        <tr>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Date</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Type</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Channel</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Amount</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Transaction ID</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Status</th>
          <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="payment in payments"
          :key="`${payment.recordType}-${payment.type}-${payment.id}`"
          class="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 align-top"
        >
          <td class="py-2 px-4 text-sm text-gray-600 whitespace-nowrap">{{ formatDateTime(payment.created) }}</td>
          <td class="py-2 px-4 text-sm text-gray-700">
            <div class="font-medium">{{ formatRecordType(payment.recordType) }}</div>
            <div class="text-xs text-gray-500">{{ payment.provider }}</div>
          </td>
          <td class="py-2 px-4 text-sm text-gray-700">{{ payment.channel || payment.paymentMethod || '—' }}</td>
          <td class="py-2 px-4 text-sm font-semibold text-emerald-600 whitespace-nowrap">{{ formatMoney(payment.amount) }}</td>
          <td class="py-2 px-4 text-xs text-gray-600 font-mono max-w-[160px]">
            <div class="truncate" :title="paymentDisplayId(payment)">{{ paymentDisplayId(payment) }}</div>
            <div
              v-if="paymentSecondaryRef(payment)"
              class="truncate text-gray-400 mt-0.5"
              :title="paymentSecondaryRef(payment)"
            >
              {{ paymentSecondaryRef(payment) }}
            </div>
          </td>
          <td class="py-2 px-4 text-sm">
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize"
              :class="paymentStatusClass(payment.status)"
            >
              {{ formatPaymentStatus(payment.status) }}
            </span>
            <p v-if="payment.resultCode" class="text-xs text-gray-400 mt-0.5">Code {{ payment.resultCode }}</p>
          </td>
          <td class="py-2 px-4 text-xs text-gray-600 max-w-[220px]">
            <p
              v-if="paymentNotes(payment)"
              class="line-clamp-2"
              :class="isFailureStatus(payment.status) ? 'text-red-600' : payment.status === 'completed' ? 'text-emerald-600' : 'text-gray-600'"
              :title="paymentNotes(payment)"
            >
              {{ paymentNotes(payment) }}
            </p>
            <span v-else>—</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="p-12 text-center text-gray-500">
      <p class="font-medium text-gray-600">No payments found</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  payments: {
    type: Array,
    default: () => [],
  },
  formatDateTime: { type: Function, required: true },
  formatMoney: { type: Function, required: true },
  formatRecordType: { type: Function, required: true },
  paymentDisplayId: { type: Function, required: true },
  paymentSecondaryRef: { type: Function, required: true },
  paymentStatusClass: { type: Function, required: true },
  formatPaymentStatus: { type: Function, required: true },
  paymentNotes: { type: Function, required: true },
  isFailureStatus: { type: Function, required: true },
})
</script>
