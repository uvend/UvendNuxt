<template>
  <div class="mining-page flex flex-col min-h-0 overflow-hidden bg-gray-50">
    <div class="mining-toolbar flex-shrink-0 pb-2">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div class="min-w-0">
          <h1 class="text-xl font-bold tracking-tight text-gray-900 leading-tight">Mining Portal</h1>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ selectedCustomerLabel }}<span v-if="selectedCustomerCode"> ({{ selectedCustomerCode }})</span>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="filteredTransactions.length === 0"
            @click="exportCsv"
          >
            <Icon name="lucide:download" class="w-4 h-4 mr-1" />
            Export CSV
          </Button>
          <Button
            size="sm"
            class="bg-blue-600 hover:bg-blue-700"
            :disabled="isLoading || !selectedCustomerCode"
            @click="fetchTransactions"
          >
            <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
        <div class="space-y-1">
          <Label class="text-xs font-medium text-gray-600">Customer</Label>
          <select
            v-model="selectedCustomerCode"
            class="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm"
          >
            <option v-for="customer in enabledMiningCustomers" :key="customer.code" :value="String(customer.code)">
              {{ customer.label }} ({{ customer.code }})
            </option>
          </select>
        </div>
        <div class="space-y-1">
          <Label class="text-xs font-medium text-gray-600">Start Date</Label>
          <Input v-model="startDate" type="date" class="h-9" />
        </div>
        <div class="space-y-1">
          <Label class="text-xs font-medium text-gray-600">End Date</Label>
          <Input v-model="endDate" type="date" class="h-9" />
        </div>
        <div class="space-y-1 xl:col-span-2">
          <Label class="text-xs font-medium text-gray-600">Search</Label>
          <div class="relative">
            <Icon name="lucide:search" class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input v-model="search" type="text" placeholder="Search meter, transaction, complex" class="h-9 pl-9" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 py-2 text-xs text-gray-600">
      <span class="pill">
        <span class="pill-label">Rows</span>
        <span class="pill-value">{{ filteredTransactions.length }}</span>
      </span>
      <span class="pill">
        <span class="pill-label">Vend</span>
        <span class="pill-value">{{ formatMoney(totalVendAmount) }}</span>
      </span>
      <span class="pill">
        <span class="pill-label">Units</span>
        <span class="pill-value">{{ totalUnitsIssued.toFixed(2) }}</span>
      </span>
    </div>

    <div class="table-shell flex-1 min-h-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div v-if="isLoading" class="h-full flex items-center justify-center text-sm text-gray-500">
        Loading transactions...
      </div>
      <div v-else-if="filteredTransactions.length === 0" class="h-full flex items-center justify-center text-sm text-gray-500">
        No transactions found for selected filters.
      </div>
      <div v-else class="h-full overflow-auto custom-scrollbar">
        <table class="w-full">
          <thead class="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Transaction ID</th>
              <th class="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Meter</th>
              <th class="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Complex</th>
              <th class="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Utility</th>
              <th class="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Units</th>
              <th class="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Amount</th>
              <th class="text-left py-2.5 px-3 text-xs font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in filteredTransactions"
              :key="`${transaction.transactionUniqueId}-${transaction.meterNumber}`"
              class="border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
            >
              <td class="py-2 px-3 text-sm text-gray-800">{{ transaction.transactionUniqueId }}</td>
              <td class="py-2 px-3 text-sm text-gray-800">{{ transaction.meterNumber }}</td>
              <td class="py-2 px-3 text-sm text-gray-700">{{ transaction.complexName }}</td>
              <td class="py-2 px-3 text-sm text-gray-700">{{ transaction.utilityType }}</td>
              <td class="py-2 px-3 text-sm text-gray-700">{{ transaction.totalUnitsIssued }}</td>
              <td class="py-2 px-3 text-sm font-semibold text-green-700">{{ formatMoney(transaction.managedTenderAmount) }}</td>
              <td class="py-2 px-3 text-sm text-gray-600">{{ formatDateTime(transaction.transactionDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { miningCustomers } from '~/config/miningCustomers'
import { summarisedPayload } from '~/composables/summarisedPayload.js'

definePageMeta({
  layout: 'account'
})

const { formatMoney } = useCurrency()

const enabledMiningCustomers = computed(() => miningCustomers.filter((customer) => customer.enabled))
const selectedCustomerCode = ref(enabledMiningCustomers.value.length > 0 ? String(enabledMiningCustomers.value[0].code) : '')
const search = ref('')
const transactions = ref([])
const isLoading = ref(false)
const selectedCustomerLabel = computed(() => {
  const customer = enabledMiningCustomers.value.find((item) => String(item.code) === selectedCustomerCode.value)
  return customer?.label || 'No customer selected'
})

const today = new Date()
const last30Days = new Date()
last30Days.setDate(today.getDate() - 30)

const startDate = ref(formatDateInput(last30Days))
const endDate = ref(formatDateInput(today))

function formatDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function fetchTransactions() {
  if (!selectedCustomerCode.value) return
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return
  isLoading.value = true
  try {
    const result = await useAuthFetch(`${STATEMENT_API}${STATEMENT_SUMMARISED_PATH}`, {
      method: 'GET',
      params: {
        IncludeMetersWithNoActivity: false,
        StartDate: start.toISOString(),
        EndDate: end.toISOString(),
        ReportParentType: 4,
        ResponseFormatType: 0,
        ParentUniqueID: Number(selectedCustomerCode.value),
        UtilityType: -1
      }
    })

    const payload = summarisedPayload(result)
    const flattened = []
    const txMap = payload?.transactionData || {}

    for (const [meterNumber, meterData] of Object.entries(txMap)) {
      const list = meterData?.transactions || []
      if (!Array.isArray(list)) continue
      list.forEach((transaction) => {
        flattened.push({
          transactionUniqueId: transaction.uniqueidentification || transaction.transactionUniqueId || '',
          meterNumber: transaction.meternumber || transaction.meterNumber || meterNumber,
          complexName: transaction.complexDescription || transaction.complexName || 'Unknown',
          utilityType: transaction.utilitytype === 1
            ? 'Water'
            : transaction.utilitytype === 2
              ? 'Gas'
              : (transaction.utilityType || 'Electricity'),
          totalUnitsIssued: Number(transaction.totalunitsissued || transaction.totalUnitsIssued || 0),
          managedTenderAmount: Number(transaction.tenderedamount || transaction.managedTenderAmount || 0),
          transactionDate: transaction.row_creation_date || transaction.transactionDate || new Date().toISOString()
        })
      })
    }

    flattened.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    transactions.value = flattened
  } catch (error) {
    console.error('Failed to fetch mining transactions', error)
    transactions.value = []
  } finally {
    isLoading.value = false
  }
}

const filteredTransactions = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return transactions.value
  return transactions.value.filter((transaction) => {
    const txId = String(transaction.transactionUniqueId || '').toLowerCase()
    const meter = String(transaction.meterNumber || '').toLowerCase()
    const complex = String(transaction.complexName || '').toLowerCase()
    return txId.includes(term) || meter.includes(term) || complex.includes(term)
  })
})

const totalVendAmount = computed(() => {
  return filteredTransactions.value.reduce((sum, transaction) => {
    return sum + (Number(transaction.managedTenderAmount) || 0)
  }, 0)
})

const totalUnitsIssued = computed(() => {
  return filteredTransactions.value.reduce((sum, transaction) => {
    return sum + (Number(transaction.totalUnitsIssued) || 0)
  }, 0)
})

function exportCsv() {
  if (filteredTransactions.value.length === 0) return

  const headers = ['Transaction ID', 'Meter Number', 'Complex', 'Utility Type', 'Units Issued', 'Amount', 'Transaction Date']
  const rows = filteredTransactions.value.map((transaction) => [
    transaction.transactionUniqueId,
    transaction.meterNumber,
    transaction.complexName,
    transaction.utilityType,
    Number(transaction.totalUnitsIssued || 0).toFixed(2),
    Number(transaction.managedTenderAmount || 0).toFixed(2),
    transaction.transactionDate
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `mining-transactions-${selectedCustomerCode.value}-${startDate.value}-to-${endDate.value}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  if (selectedCustomerCode.value) {
    fetchTransactions()
  }
})

watch(selectedCustomerCode, () => {
  if (selectedCustomerCode.value) {
    fetchTransactions()
  } else {
    transactions.value = []
  }
})
</script>

<style scoped>
.mining-page {
  height: calc(100vh - 3.25rem - 2rem);
  max-height: calc(100vh - 3.25rem - 2rem);
}

.mining-toolbar {
  flex-shrink: 0;
}

.table-shell {
  min-height: 0;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background: #ffffff;
  padding: 3px 10px;
}

.pill-label {
  color: #6b7280;
}

.pill-value {
  color: #111827;
  font-weight: 600;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 225, 0.8);
  border-radius: 4px;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(203, 213, 225, 0.8) rgba(241, 245, 249, 0.5);
}
</style>
