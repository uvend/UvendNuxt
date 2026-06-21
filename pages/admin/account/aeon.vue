<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 p-6">
        <div class="mx-auto max-w-7xl space-y-6">
            <section class="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
                <div class="flex flex-col gap-6">
                    <div class="space-y-3">
                        <div class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
                            <Icon name="lucide:zap" class="h-4 w-4" />
                            Aeon Validation
                        </div>
                        <div class="w-full">
                            <ClientOnly>
                                <FilePond
                                    :files="filePondFiles"
                                    :server="filePondServer"
                                    name="file"
                                    class="aeon-filepond"
                                    label-idle="Upload an Aeon export file up to 25MB and validate against meter activity or <span class='filepond--label-action'>browse</span>"
                                    :allow-multiple="false"
                                    :instant-upload="true"
                                    :credits="false"
                                    @updatefiles="handleFilePondUpdate"
                                />
                            </ClientOnly>
                        </div>
                    </div>
                </div>
            </section>

            <section class="space-y-6">
                <div class="space-y-6">
                    <Card v-if="summaryEntries.length" class="border-slate-200 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle class="text-slate-900">Summary</CardTitle>
                            <CardDescription>
                                Summary values returned by the Aeon validation endpoint.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <button
                                    v-for="entry in nonAmountSummaryEntries"
                                    :key="entry.key"
                                    type="button"
                                    class="rounded-2xl border p-4 text-left transition-colors"
                                    :class="getSummaryCardClass(entry.key)"
                                    @click="toggleSummaryFilter(entry.key)"
                                >
                                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{{ formatLabel(entry.key) }}</p>
                                    <p class="mt-2 break-words text-base font-bold text-slate-900">{{ formatSummaryValue(entry.key, entry.value) }}</p>
                                </button>
                            </div>
                            <Card v-if="summaryEntries.length && amountSummaryEntries.length" class="mt-4 border-slate-200 bg-slate-50 shadow-none">
                                <CardHeader>
                                    <CardTitle class="text-base text-slate-900">Amount</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div class="grid gap-4 md:grid-cols-3">
                                        <div v-for="entry in amountSummaryEntries" :key="entry.key" class="rounded-xl border border-slate-200 bg-white p-4">
                                            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{{ formatLabel(entry.key) }}</p>
                                            <p class="mt-2 text-base font-bold text-slate-900">{{ formatSummaryValue(entry.key, entry.value) }}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>

                    <Card v-if="errors.length" class="border-red-200 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle class="text-slate-900">Errors</CardTitle>
                            <CardDescription>
                                Validation issues returned by the Aeon endpoint.
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-3">
                            <div
                                v-for="(error, index) in errors"
                                :key="`error-${index}`"
                                class="rounded-2xl border border-red-200 bg-red-50 p-4"
                            >
                                <pre class="whitespace-pre-wrap break-words font-sans text-sm text-red-800">{{ formatValue(error) }}</pre>
                            </div>
                        </CardContent>
                    </Card>

                    <Card v-if="hasUploadedFile" class="border-slate-200 bg-white shadow-sm">
                        <CardHeader>
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div class="flex flex-wrap items-center gap-3">
                                    <div class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                                        {{ listItemLabel }}
                                    </div>
                                    <Button
                                        v-if="canDownloadCurrentView"
                                        variant="outline"
                                        size="sm"
                                        @click="downloadCurrentViewExcel"
                                    >
                                        <Icon name="lucide:download" class="mr-2 h-4 w-4" />
                                        Download Excel
                                    </Button>
                                </div>
                                <div v-if="displayedListItemCount > pageSize" class="ml-auto flex items-center gap-2">
                                    <Button variant="outline" size="sm" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                                        Previous
                                    </Button>
                                    <div class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                                        Page {{ currentPage }} of {{ totalPages }}
                                    </div>
                                    <Button variant="outline" size="sm" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div v-if="isUploading" class="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-slate-500">
                                <Icon name="lucide:loader-2" class="mr-3 h-5 w-5 animate-spin" />
                                Waiting for Aeon response...
                            </div>

                            <div v-else-if="isViewingDuplicateGroups">
                                <div v-if="!duplicateGroups.length" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                    <p class="text-base font-semibold text-slate-900">No duplicate groups found</p>
                                    <p class="mt-2 text-sm text-slate-500">No Aeon rows with multiple related Suzie vend records were returned.</p>
                                </div>

                                <div v-else class="space-y-4">

                                    <div class="grid gap-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 md:grid-cols-3">
                                        <div>
                                            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Total requested</p>
                                            <p class="mt-2 text-base font-bold text-slate-900">{{ formatAmountValue(duplicateAmountTotals.requestedTotal) }}</p>
                                        </div>
                                        <div>
                                            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Total vended</p>
                                            <p class="mt-2 text-base font-bold text-slate-900">{{ formatAmountValue(duplicateAmountTotals.vendedTotal) }}</p>
                                        </div>
                                        <div>
                                            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Duplication overage</p>
                                            <p class="mt-2 text-base font-bold" :class="getDuplicationDifferenceClass(duplicateAmountTotals.overage)">
                                                {{ formatSignedAmountValue(duplicateAmountTotals.overage) }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="space-y-3">
                                        <div
                                            v-for="(group, index) in paginatedDuplicateGroups"
                                            :key="getDuplicateGroupKey(group, index + pageStartIndex)"
                                            class="overflow-hidden rounded-2xl border transition-colors"
                                            :class="isDuplicateGroupSelected(group, index + pageStartIndex) ? 'border-amber-300 bg-amber-50/40 ring-2 ring-amber-200' : 'border-slate-200 bg-white'"
                                        >
                                            <button
                                                type="button"
                                                class="w-full p-4 text-left transition-colors hover:bg-amber-50/50"
                                                @click="selectDuplicateGroup(group, index + pageStartIndex)"
                                            >
                                                <div class="flex flex-wrap items-start justify-between gap-3">
                                                    <div class="space-y-1">
                                                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Duplicate group</p>
                                                        <p class="text-sm font-bold text-slate-900">Meter {{ group.meterNumber || 'N/A' }}</p>
                                                        <p class="text-sm text-slate-600">
                                                            {{ group.count ?? group.records?.length ?? 0 }} vend record{{ (group.count ?? group.records?.length ?? 0) === 1 ? '' : 's' }}
                                                            <span v-if="getLinkedAeonRow(group)"> · Row {{ getLinkedAeonRow(group).rowNumber }} · {{ getLinkedAeonRow(group).transId || 'N/A' }}</span>
                                                        </p>
                                                    </div>
                                                    <div class="flex items-start gap-3">
                                                        <div class="grid grid-cols-3 gap-3 text-right">
                                                            <div>
                                                                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Requested</p>
                                                                <p class="text-sm font-bold text-slate-900">{{ formatAmountValue(group.requestedAmount) }}</p>
                                                            </div>
                                                            <div>
                                                                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Vended</p>
                                                                <p class="text-sm font-bold text-slate-900">{{ formatAmountValue(group.vendedAmount) }}</p>
                                                            </div>
                                                            <div>
                                                                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Overage</p>
                                                                <p class="text-sm font-bold" :class="getDuplicationDifferenceClass(group.duplicationOverage)">
                                                                    {{ formatSignedAmountValue(group.duplicationOverage) }}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Icon
                                                            :name="isDuplicateGroupSelected(group, index + pageStartIndex) ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                                                            class="mt-1 h-4 w-4 shrink-0 text-slate-500"
                                                        />
                                                    </div>
                                                </div>
                                            </button>

                                            <div
                                                v-if="isDuplicateGroupSelected(group, index + pageStartIndex)"
                                                class="space-y-3 border-t border-amber-200 px-4 pb-4 pt-3"
                                            >
                                                <div class="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
                                                    <div>
                                                        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Requested amount</p>
                                                        <p class="mt-1 text-sm font-bold text-slate-900">{{ formatAmountValue(group.requestedAmount) }}</p>
                                                        <p class="mt-1 text-xs text-slate-500">From linked Aeon row</p>
                                                    </div>
                                                    <div>
                                                        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Actually vended</p>
                                                        <p class="mt-1 text-sm font-bold text-slate-900">{{ formatAmountValue(group.vendedAmount) }}</p>
                                                        <p class="mt-1 text-xs text-slate-500">{{ group.count ?? getGroupRecords(group).length }} vend record{{ (group.count ?? getGroupRecords(group).length) === 1 ? '' : 's' }}</p>
                                                    </div>
                                                    <div>
                                                        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Duplication overage</p>
                                                        <p class="mt-1 text-sm font-bold" :class="getDuplicationDifferenceClass(group.duplicationOverage)">
                                                            {{ formatSignedAmountValue(group.duplicationOverage) }}
                                                        </p>
                                                        <p class="mt-1 text-xs text-slate-500">Vended minus requested</p>
                                                    </div>
                                                </div>

                                                <div v-if="getLinkedAeonRow(group)" class="rounded-xl border border-slate-200 bg-white p-4">
                                                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Linked Aeon row</p>
                                                    <button
                                                        type="button"
                                                        class="mt-2 flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
                                                        @click.stop="openLinkedAeonRow(group)"
                                                    >
                                                        <div>
                                                            <p class="text-sm font-bold text-slate-900">Row {{ getLinkedAeonRow(group).rowNumber }} · {{ getLinkedAeonRow(group).transId || 'N/A' }}</p>
                                                            <p class="mt-1 text-xs text-slate-500">Meter {{ getLinkedAeonRow(group).meterNumber || group.meterNumber || 'N/A' }}</p>
                                                        </div>
                                                        <div class="flex items-center gap-3">
                                                            <span class="text-sm font-bold text-slate-900">{{ formatAmountValue(getLinkedAeonRow(group).fullAmount) }}</span>
                                                            <span class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                                                {{ formatStatusValue(getLinkedAeonRow(group).status) }}
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>

                                                <template v-if="getPrimaryGroupRecord(group)">
                                                    <div class="w-full rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                                                        <div>
                                                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Primary vend record</p>
                                                            <p class="mt-1 text-sm font-bold text-slate-900">{{ getPrimaryGroupRecord(group).transactionId || 'N/A' }}</p>
                                                        </div>
                                                        <div class="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                                            <div>
                                                                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Meter</p>
                                                                <p class="text-sm text-slate-900">{{ getPrimaryGroupRecord(group).meterNumber || 'N/A' }}</p>
                                                            </div>
                                                            <div>
                                                                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Date</p>
                                                                <p class="text-sm text-slate-900">{{ formatPossibleDateTime(getPrimaryGroupRecord(group).transactionDate) }}</p>
                                                            </div>
                                                            <div>
                                                                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Receipt</p>
                                                                <p class="text-sm text-slate-900">{{ getPrimaryGroupRecord(group).receipt || 'N/A' }}</p>
                                                            </div>
                                                            <div>
                                                                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Amount</p>
                                                                <p class="text-sm font-bold text-slate-900">{{ formatAmountValue(getPrimaryGroupRecord(group).amount) }}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div v-if="getSiblingGroupRecords(group).length" class="space-y-3">
                                                        <div
                                                            v-for="(record, recordIndex) in getSiblingGroupRecords(group)"
                                                            :key="getVendRecordKey(record, recordIndex)"
                                                            class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4"
                                                        >
                                                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Duplicate record {{ recordIndex + 1 }}</p>
                                                            <div class="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                                                <div>
                                                                    <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Transaction ID</p>
                                                                    <p class="text-sm font-bold text-slate-900">{{ record.transactionId || 'N/A' }}</p>
                                                                </div>
                                                                <div>
                                                                    <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Date</p>
                                                                    <p class="text-sm text-slate-900">{{ formatPossibleDateTime(record.transactionDate) }}</p>
                                                                </div>
                                                                <div>
                                                                    <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Receipt</p>
                                                                    <p class="text-sm text-slate-900">{{ record.receipt || 'N/A' }}</p>
                                                                </div>
                                                                <div>
                                                                    <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Amount</p>
                                                                    <p class="text-sm font-bold text-slate-900">{{ formatAmountValue(record.amount) }}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>

                                                <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                                                    No vend records were returned for this group.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else-if="!displayedTransactions.length" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                <p class="text-base font-semibold text-slate-900">No records found for this filter</p>
                                <p class="mt-2 text-sm text-slate-500">Try another summary card or click the active one again to clear the filter.</p>
                            </div>

                            <div v-else class="space-y-3">
                                <div
                                    v-if="isViewingMissingTransactions"
                                    class="grid gap-4 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4 md:grid-cols-2"
                                >
                                    <div>
                                        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Missing records</p>
                                        <p class="mt-2 text-base font-bold text-slate-900">{{ missingRecordCount }}</p>
                                    </div>
                                    <div>
                                        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Total missing amount</p>
                                        <p class="mt-2 text-base font-bold text-slate-900">{{ formatAmountValue(missingAmountTotal) }}</p>
                                    </div>
                                </div>

                                <div class="aeon-table-header hidden rounded-2xl bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 xl:grid">
                                    <p>Aeon ID</p>
                                    <p>Meter</p>
                                    <p>Date</p>
                                    <p class="text-right">Amount</p>
                                    <p>Status</p>
                                </div>

                                <Card
                                    v-for="(transaction, index) in paginatedTransactions"
                                    :key="getTransactionKey(transaction, index + pageStartIndex)"
                                    class="aeon-transaction-card border-slate-200 bg-white p-4 shadow-none cursor-pointer transition-colors hover:bg-slate-50"
                                    @click="openRawDataDialog(transaction)"
                                >
                                    <div>
                                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 xl:hidden">Aeon ID</p>
                                        <p class="text-sm font-bold text-slate-900">{{ getAeonIdValue(transaction, index + pageStartIndex) }}</p>
                                    </div>

                                    <div>
                                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 xl:hidden">Meter</p>
                                        <p class="text-sm font-semibold text-slate-900">{{ getPreferredValue(transaction, meterKeyCandidates, 'N/A') }}</p>
                                    </div>

                                    <div>
                                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 xl:hidden">Date</p>
                                        <p class="text-sm text-slate-900">{{ formatPossibleDateTime(getPreferredValue(transaction, dateKeyCandidates, 'N/A')) }}</p>
                                    </div>

                                    <div class="xl:text-right">
                                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 xl:hidden">Amount</p>
                                        <p class="text-sm font-bold text-slate-900">{{ formatAmountValue(getPreferredValue(transaction, amountKeyCandidates, 'N/A')) }}</p>
                                    </div>

                                    <div>
                                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 xl:hidden">Status</p>
                                        <div class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {{ formatStatusValue(transaction.status || transaction.outcome || responseStatus || 'Processed') }}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>

        <Dialog :open="isRawDataDialogOpen" @update:open="handleRawDialogOpenChange">
            <DialogContent class="max-w-4xl">
                <DialogHeader>
                    <DialogDescription>
                        Full payload for the selected Aeon record.
                    </DialogDescription>
                </DialogHeader>
                <div class="rounded-xl bg-slate-900 p-4">
                    <pre class="max-h-[70vh] overflow-auto whitespace-pre-wrap break-words text-xs text-slate-100">{{ selectedRawTransaction ? stringifyRow(selectedRawTransaction) : 'No row selected.' }}</pre>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'

definePageMeta({
    layout: 'account'
})

const FilePond = vueFilePond()
const selectedFile = ref(null)
const filePondFiles = ref([])
const isUploading = ref(false)
const uploadError = ref('')
const responseStatus = ref('')
const summary = ref({})
const duplicates = ref({})
const errors = ref([])
const transactions = ref([])
const hasUploadedFile = ref(false)
const currentPage = ref(1)
const activeSummaryFilter = ref('')
const selectedDuplicateGroupKey = ref('')
const isRawDataDialogOpen = ref(false)
const selectedRawTransaction = ref(null)
const pageSize = 20
const meterKeyCandidates = ['meterNumber', 'meter', 'meterNo', 'meter_number', 'accountNumber', 'account_number']
const nameKeyCandidates = ['customerName', 'name', 'customer', 'description', 'accountName']
const dateKeyCandidates = ['transDate', 'transactionDate', 'date', 'createdAt', 'created_at', 'trxDate', 'postingDate']
const amountKeyCandidates = ['fullAmount', 'amount', 'totalAmount', 'value', 'transactionAmount', 'paidAmount']
const statusKeyCandidates = ['status', 'result', 'outcome', 'matchStatus', 'validationStatus']
const referenceKeyCandidates = ['transId', 'reference', 'transactionReference', 'transactionId', 'id', 'receiptNumber', 'receipt']
const secondaryReferenceCandidates = ['token', 'transactionType', 'channel', 'source']
const duplicateKeyCandidates = ['key', 'duplicateKey', 'compositeKey']
const phoneKeyCandidates = ['phoneNumber', 'phone', 'mobileNumber', 'msisdn', 'cellphone', 'cellNumber']
const acceptedAeonExtensions = ['.csv', '.txt', '.xlsx', '.xls', '.pdf']
const maxFileSize = 25 * 1024 * 1024
const hiddenSummaryKeys = [
    'invalidRows',
    'importTotalsMatch',
    'duplicateMeterRecordCount',
    'duplicateRequestedAmount',
    'duplicateVendedAmount',
    'duplicateOverageAmount'
]
const filterableSummaryKeys = new Set([
    'totalRows',
    'matchedCount',
    'missingCount',
    'duplicateGroupCount'
])
const summaryFilterLabels = {
    totalRows: 'Total rows',
    matchedCount: 'Matched count',
    missingCount: 'Missing count',
    duplicateGroupCount: 'Duplicate count'
}

const summaryEntries = computed(() => toDisplayEntries(summary.value))
const amountSummaryKeys = ['aeonReportAmount', 'reportRowAmount', 'importAmountDifference']
const amountSummaryEntries = computed(() =>
    amountSummaryKeys.map((key) => ({
        key,
        value: summary.value?.[key]
    }))
)
const nonAmountSummaryEntries = computed(() =>
    summaryEntries.value.filter((entry) =>
        !amountSummaryKeys.includes(entry.key) &&
        !hiddenSummaryKeys.includes(entry.key)
    )
)
const duplicateGroups = computed(() => {
    const groups = duplicates.value?.meterActivity
    return Array.isArray(groups) ? groups : []
})
const transactionsByRowNumber = computed(() => {
    const map = new Map()

    for (const transaction of transactions.value) {
        if (transaction?.rowNumber != null) {
            map.set(transaction.rowNumber, transaction)
        }
    }

    return map
})
const isViewingDuplicateGroups = computed(() =>
    activeSummaryFilter.value === 'duplicateGroupCount'
)
const isViewingMissingTransactions = computed(() =>
    activeSummaryFilter.value === 'missingCount'
)
const transactionsByFilter = computed(() => {
    const all = transactions.value
    const matched = []
    const missing = []

    for (const transaction of all) {
        const status = getTransactionStatus(transaction)

        if (status === 'matched') {
            matched.push(transaction)
        } else if (status === 'missing') {
            missing.push(transaction)
        }
    }

    return {
        totalRows: all,
        matchedCount: matched,
        missingCount: missing
    }
})
const missingTransactions = computed(() => transactionsByFilter.value.missingCount)
const missingRecordCount = computed(() => {
    const summaryCount = Number(summary.value?.missingCount)
    if (Number.isFinite(summaryCount)) {
        return summaryCount
    }

    return missingTransactions.value.length
})
const missingAmountTotal = computed(() => {
    const summaryAmount = summary.value?.missingAmount
    if (summaryAmount !== undefined && summaryAmount !== null) {
        const numeric = Number(summaryAmount)
        if (Number.isFinite(numeric)) {
            return numeric
        }
    }

    let total = 0
    let hasAmount = false

    for (const transaction of missingTransactions.value) {
        const numeric = Number(transaction.fullAmount ?? getPreferredValue(transaction, amountKeyCandidates, NaN))
        if (Number.isFinite(numeric)) {
            total += numeric
            hasAmount = true
        }
    }

    return hasAmount ? total : null
})
const displayedTransactions = computed(() => {
    if (isViewingDuplicateGroups.value) {
        return []
    }

    const filterKey = activeSummaryFilter.value
    if (!filterKey || filterKey === 'totalRows') {
        return transactions.value
    }

    if (!filterableSummaryKeys.has(filterKey)) {
        return transactions.value
    }

    return transactionsByFilter.value[filterKey] ?? transactions.value
})
const displayedListItemCount = computed(() =>
    isViewingDuplicateGroups.value ? duplicateGroups.value.length : displayedTransactions.value.length
)
const listItemLabel = computed(() => {
    if (isViewingDuplicateGroups.value) {
        const count = duplicateGroups.value.length
        return `${count} duplicate group${count === 1 ? '' : 's'}`
    }

    const count = displayedTransactions.value.length
    return `${count} row${count === 1 ? '' : 's'}`
})
const totalPages = computed(() => Math.max(1, Math.ceil(displayedListItemCount.value / pageSize)))
const pageStartIndex = computed(() => (currentPage.value - 1) * pageSize)
const paginatedTransactions = computed(() =>
    displayedTransactions.value.slice(pageStartIndex.value, pageStartIndex.value + pageSize)
)
const paginatedDuplicateGroups = computed(() =>
    duplicateGroups.value.slice(pageStartIndex.value, pageStartIndex.value + pageSize)
)
const duplicateAmountTotals = computed(() => ({
    requestedTotal: summary.value?.duplicateRequestedAmount ?? null,
    vendedTotal: summary.value?.duplicateVendedAmount ?? null,
    overage: summary.value?.duplicateOverageAmount ?? null
}))
const canDownloadCurrentView = computed(() => {
    if (!hasUploadedFile.value || isUploading.value) {
        return false
    }

    if (isViewingDuplicateGroups.value) {
        return duplicateGroups.value.length > 0
    }

    const filterKey = activeSummaryFilter.value
    if (!filterKey || filterKey === 'totalRows' || filterKey === 'matchedCount' || filterKey === 'missingCount') {
        return displayedTransactions.value.length > 0
    }

    return false
})
const filePondServer = {
    process: (_fieldName, file, _metadata, load, onError, progress, abort) => {
        const validationMessage = validateAeonFile(file)
        if (validationMessage) {
            uploadError.value = validationMessage
            onError(validationMessage)
            return {
                abort: () => {}
            }
        }

        const controller = new AbortController()
        void processAeonFile(file, load, onError, progress, controller)

        return {
            abort: () => {
                controller.abort()
                isUploading.value = false
                abort()
            }
        }
    }
}

function toDisplayEntries(value) {
    if (!value || Array.isArray(value) || typeof value !== 'object') {
        return []
    }

    return Object.entries(value).map(([key, entryValue]) => ({
        key,
        value: entryValue
    }))
}

function resetResults() {
    selectedFile.value = null
    filePondFiles.value = []
    hasUploadedFile.value = false
    currentPage.value = 1
    activeSummaryFilter.value = ''
    uploadError.value = ''
    responseStatus.value = ''
    summary.value = {}
    duplicates.value = {}
    errors.value = []
    transactions.value = []
    selectedRawTransaction.value = null
    isRawDataDialogOpen.value = false
    selectedDuplicateGroupKey.value = ''
}

async function processAeonFile(file, load, onError, progress, controller) {
    uploadError.value = ''
    selectedFile.value = file
    hasUploadedFile.value = true
    resetResponseState()

    isUploading.value = true
    progress(true, 0, file.size || 1)

    try {
        const formData = new FormData()
        formData.append('file', file)

        const result = await useAuthFetch(`${normalizeBaseUrl(STATEMENT_API)}/aeon/check`, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        })

        applyAeonResponse(result)
        progress(true, file.size || 1, file.size || 1)
        load(JSON.stringify({
            name: file.name,
            status: result?.status ?? 'success'
        }))
    } catch (caughtError) {
        console.error('Aeon upload failed:', caughtError)
        if (caughtError?.name === 'AbortError') {
            uploadError.value = 'Upload cancelled.'
            return
        }

        uploadError.value = caughtError?.data?.message || caughtError?.message || 'Aeon validation failed.'
        resetResponseState()
        onError(uploadError.value)
    } finally {
        isUploading.value = false
    }
}

function applyAeonResponse(result) {
    const payload = result?.data ?? {}

    responseStatus.value = result?.status ?? ''
    summary.value = payload.summary ?? {}
    duplicates.value = payload.duplicates ?? {}
    errors.value = Array.isArray(payload.errors) ? payload.errors : []
    transactions.value = normalizeTransactions(payload.transactions)
    currentPage.value = 1
    activeSummaryFilter.value = 'totalRows'
    selectedDuplicateGroupKey.value = ''
}

function resetResponseState() {
    responseStatus.value = ''
    summary.value = {}
    duplicates.value = {}
    errors.value = []
    transactions.value = []
}

function handleFilePondUpdate(fileItems) {
    uploadError.value = ''

    if (!fileItems.length) {
        selectedFile.value = null
        filePondFiles.value = []
        hasUploadedFile.value = false
        activeSummaryFilter.value = ''
        resetResponseState()
        return
    }

    const file = fileItems[0]?.file ?? null
    if (!file) {
        selectedFile.value = null
        filePondFiles.value = []
        hasUploadedFile.value = false
        activeSummaryFilter.value = ''
        resetResponseState()
        return
    }

    const validationMessage = validateAeonFile(file)
    if (validationMessage) {
        selectedFile.value = null
        filePondFiles.value = []
        uploadError.value = validationMessage
        hasUploadedFile.value = false
        activeSummaryFilter.value = ''
        resetResponseState()
        return
    }

    selectedFile.value = file
    filePondFiles.value = [file]
}

function openRawDataDialog(transaction) {
    selectedRawTransaction.value = transaction
    isRawDataDialogOpen.value = true
}

function downloadCurrentViewExcel() {
    if (!import.meta.client) {
        return
    }

    const payload = buildExcelExportPayload()
    if (!payload.rows.length) {
        return
    }

    downloadSpreadsheet(payload.rows, payload.columns, payload.filename)
}

function buildExcelExportPayload() {
    if (isViewingDuplicateGroups.value) {
        return {
            filename: `aeon-duplicates-${buildExportTimestamp()}.xls`,
            columns: duplicateExportColumns,
            rows: buildDuplicateExportRows()
        }
    }

    const filterSlug = getExportFilterSlug()
    return {
        filename: `aeon-${filterSlug}-${buildExportTimestamp()}.xls`,
        columns: transactionExportColumns,
        rows: buildTransactionExportRows(displayedTransactions.value)
    }
}

const transactionExportColumns = [
    { label: 'Row Number', value: (row) => row['Row Number'] },
    { label: 'Aeon ID', value: (row) => row['Aeon ID'] },
    { label: 'Meter', value: (row) => row.Meter },
    { label: 'Date', value: (row) => row.Date },
    { label: 'Amount', value: (row) => row.Amount },
    { label: 'Status', value: (row) => row.Status },
    { label: 'Receipt', value: (row) => row.Receipt },
    { label: 'Reference', value: (row) => row.Reference }
]

const duplicateExportColumns = [
    { label: 'Aeon Row', value: (row) => row['Aeon Row'] },
    { label: 'Aeon Trans ID', value: (row) => row['Aeon Trans ID'] },
    { label: 'Aeon Status', value: (row) => row['Aeon Status'] },
    { label: 'Meter', value: (row) => row.Meter },
    { label: 'Requested Amount', value: (row) => row['Requested Amount'] },
    { label: 'Vended Amount', value: (row) => row['Vended Amount'] },
    { label: 'Duplication Overage', value: (row) => row['Duplication Overage'] },
    { label: 'Record Type', value: (row) => row['Record Type'] },
    { label: 'Vend Transaction ID', value: (row) => row['Vend Transaction ID'] },
    { label: 'Vend Date', value: (row) => row['Vend Date'] },
    { label: 'Vend Receipt', value: (row) => row['Vend Receipt'] },
    { label: 'Vend Amount', value: (row) => row['Vend Amount'] }
]

function buildTransactionExportRows(transactionList) {
    return transactionList.map((transaction) => ({
        'Row Number': transaction.rowNumber ?? '',
        'Aeon ID': transaction.transId ?? '',
        Meter: transaction.meterNumber ?? '',
        Date: formatExportDateTime(transaction.transDate),
        Amount: toExportNumber(transaction.fullAmount),
        Status: transaction.status ?? '',
        Receipt: transaction.receipt ?? '',
        Reference: transaction.reference ?? ''
    }))
}

function buildDuplicateExportRows() {
    const rows = []

    for (const group of duplicateGroups.value) {
        const linked = getLinkedAeonRow(group)
        const records = getGroupRecords(group)

        records.forEach((record, index) => {
            rows.push({
                'Aeon Row': linked?.rowNumber ?? '',
                'Aeon Trans ID': linked?.transId ?? '',
                'Aeon Status': linked?.status ?? '',
                Meter: group.meterNumber ?? record.meterNumber ?? '',
                'Requested Amount': toExportNumber(group.requestedAmount),
                'Vended Amount': toExportNumber(group.vendedAmount),
                'Duplication Overage': toExportNumber(group.duplicationOverage),
                'Record Type': index === 0 ? 'Primary' : 'Duplicate',
                'Vend Transaction ID': record.transactionId ?? '',
                'Vend Date': formatExportDateTime(record.transactionDate),
                'Vend Receipt': record.receipt ?? '',
                'Vend Amount': toExportNumber(record.amount)
            })
        })
    }

    return rows
}

function getExportFilterSlug() {
    switch (activeSummaryFilter.value) {
        case 'matchedCount':
            return 'matched'
        case 'missingCount':
            return 'missing'
        default:
            return 'total'
    }
}

function buildExportTimestamp() {
    const now = new Date()
    const pad = (value) => String(value).padStart(2, '0')

    return [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
        pad(now.getHours()),
        pad(now.getMinutes())
    ].join('')
}

function toExportNumber(value) {
    if (value === null || value === undefined || value === '') {
        return ''
    }

    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : String(value)
}

function formatExportDateTime(value) {
    if (!value) {
        return ''
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return String(value)
    }

    return date.toISOString()
}

function escapeSpreadsheetXml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function buildSpreadsheetCell(value) {
    if (value === null || value === undefined || value === '') {
        return '<Cell><Data ss:Type="String"></Data></Cell>'
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        return `<Cell><Data ss:Type="Number">${value}</Data></Cell>`
    }

    return `<Cell><Data ss:Type="String">${escapeSpreadsheetXml(value)}</Data></Cell>`
}

function downloadSpreadsheet(rows, columns, filename) {
    const headerRow = `<Row>${columns.map((column) => buildSpreadsheetCell(column.label)).join('')}</Row>`
    const dataRows = rows
        .map((row) => `<Row>${columns.map((column) => buildSpreadsheetCell(column.value(row))).join('')}</Row>`)
        .join('')
    const worksheetName = escapeSpreadsheetXml(filename.replace(/\.xls$/i, '').slice(0, 31) || 'Export')
    const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="${worksheetName}">
<Table>
${headerRow}
${dataRows}
</Table>
</Worksheet>
</Workbook>`

    const blob = new Blob(['\uFEFF', xml], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
}

function handleRawDialogOpenChange(isOpen) {
    isRawDataDialogOpen.value = isOpen
    if (!isOpen) {
        selectedRawTransaction.value = null
    }
}

function changePage(page) {
    currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

function toggleSummaryFilter(key) {
    if (!isFilterableSummaryKey(key)) return

    const nextFilter = activeSummaryFilter.value === key ? '' : key
    activeSummaryFilter.value = nextFilter
    currentPage.value = 1
    selectedDuplicateGroupKey.value = ''
}

function selectDuplicateGroup(group, index) {
    const groupKey = getDuplicateGroupKey(group, index)
    const isSameGroup = selectedDuplicateGroupKey.value === groupKey

    selectedDuplicateGroupKey.value = isSameGroup ? '' : groupKey
}

function isDuplicateGroupSelected(group, index) {
    return selectedDuplicateGroupKey.value === getDuplicateGroupKey(group, index)
}

function getGroupRecords(group) {
    const records = group?.records
    return Array.isArray(records) ? records : []
}

function getPrimaryGroupRecord(group) {
    return getGroupRecords(group)[0] ?? null
}

function getSiblingGroupRecords(group) {
    return getGroupRecords(group).slice(1)
}

function getLinkedAeonRow(group) {
    const linkedRows = group?.linkedAeonRows
    return Array.isArray(linkedRows) && linkedRows.length ? linkedRows[0] : null
}

function openLinkedAeonRow(group) {
    const linkedRow = getLinkedAeonRow(group)
    if (linkedRow?.rowNumber == null) {
        return
    }

    const transaction = transactionsByRowNumber.value.get(linkedRow.rowNumber)
    if (transaction) {
        openRawDataDialog(transaction)
    }
}

function getDuplicationDifferenceClass(value) {
    const numeric = Number(value)
    if (!Number.isFinite(numeric) || numeric === 0) {
        return 'text-slate-900'
    }

    return numeric > 0 ? 'text-red-700' : 'text-emerald-700'
}

function formatSignedAmountValue(value) {
    if (value === null || value === undefined || value === '') {
        return 'N/A'
    }

    const numeric = Number(value)
    if (!Number.isFinite(numeric)) {
        return String(value)
    }

    const formatted = Math.abs(numeric).toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    if (numeric > 0) {
        return `+${formatted}`
    }

    if (numeric < 0) {
        return `-${formatted}`
    }

    return formatted
}

function getDuplicateGroupKey(group, index) {
    return group?.key || `duplicate-group-${group?.meterNumber || 'unknown'}-${index}`
}

function getVendRecordKey(record, index) {
    return record?.transactionId || `duplicate-record-${index}`
}

function isFilterableSummaryKey(key) {
    return filterableSummaryKeys.has(key)
}

function getSummaryCardClass(key) {
    if (!isFilterableSummaryKey(key)) {
        return 'border-slate-200 bg-slate-50'
    }

    if (activeSummaryFilter.value === key) {
        return 'border-cyan-300 bg-cyan-50 ring-2 ring-cyan-200'
    }

    return 'border-slate-200 bg-slate-50 hover:border-cyan-200 hover:bg-cyan-50/60'
}

function getTransactionKey(row, index) {
    if (row?.rowNumber != null) {
        return `aeon-row-${row.rowNumber}`
    }

    const preferred = getPreferredValue(row, [...referenceKeyCandidates, ...meterKeyCandidates], '')
    return preferred ? `${preferred}-${index}` : `aeon-row-${index}`
}

function getTransactionStatus(transaction) {
    return normalizeObjectKey(transaction?.status ?? '')
}

function normalizeAeonTransactionResult(result) {
    if (!result || typeof result !== 'object') {
        return result
    }

    if (result.importedTransaction == null) {
        return result
    }

    const imported = result.importedTransaction ?? {}

    return {
        rowNumber: result.rowNumber ?? imported.rowNumber,
        status: result.status ?? '',
        outcome: result.outcome ?? '',
        transId: imported.transId,
        meterNumber: imported.meterNumber,
        transDate: imported.transDate,
        fullAmount: imported.fullAmount,
        receipt: imported.receipt,
        reference: imported.reference,
        meterActivityMatches: result.meterActivityMatches ?? [],
        mismatches: result.mismatches ?? [],
        notes: result.notes ?? [],
        _raw: result
    }
}

function normalizeTransactions(value) {
    let list = []

    if (Array.isArray(value)) {
        list = value
    } else if (value && typeof value === 'object') {
        const nestedArray = Object.values(value).find((entry) => Array.isArray(entry))
        list = Array.isArray(nestedArray) ? nestedArray : []
    }

    return list.map(normalizeAeonTransactionResult)
}

function getPreferredValue(row, keys, fallback = '') {
    if (!row || typeof row !== 'object') {
        return fallback
    }

    for (const key of keys) {
        const value = getNestedValue(row, key)
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            return value
        }
    }

    return fallback
}

function getNestedValue(source, targetKey, depth = 0) {
    if (!source || typeof source !== 'object' || depth > 4) {
        return undefined
    }

    if (Object.prototype.hasOwnProperty.call(source, targetKey)) {
        return source[targetKey]
    }

    const normalizedTargetKey = normalizeObjectKey(targetKey)
    for (const [key, value] of Object.entries(source)) {
        if (normalizeObjectKey(key) === normalizedTargetKey) {
            return value
        }
    }

    for (const value of Object.values(source)) {
        if (!value || typeof value !== 'object') continue

        if (Array.isArray(value)) {
            for (const item of value) {
                const nested = getNestedValue(item, targetKey, depth + 1)
                if (nested !== undefined) return nested
            }
            continue
        }

        const nested = getNestedValue(value, targetKey, depth + 1)
        if (nested !== undefined) return nested
    }

    return undefined
}

function normalizeObjectKey(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[_\-\s]/g, '')
}

function getReferenceValue(row, index) {
    return getPreferredValue(row, referenceKeyCandidates, `Row ${index + 1}`)
}

function getAeonIdValue(row, index) {
    if (row?.transId) {
        return row.transId
    }

    return getPreferredValue(row, ['transId', ...referenceKeyCandidates], `Row ${row?.rowNumber ?? index + 1}`)
}

function formatLabel(label) {
    if (summaryFilterLabels[label]) {
        return summaryFilterLabels[label]
    }

    if (label === 'totalAmountFromVendTransactions' || label === 'vendTransactionAmount') {
        return 'Total matched vend amount'
    }

    if (label === 'aeonReportAmount') {
        return 'Report footer total'
    }

    if (label === 'reportRowAmount') {
        return 'Sum of row amounts'
    }

    if (label === 'importAmountDifference') {
        return 'Difference'
    }

    if (label === 'amountDifference') {
        return 'Amount difference'
    }

    return label
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/_/g, ' ')
        .trim()
}

function formatValue(value) {
    if (value === null || value === undefined || value === '') {
        return 'N/A'
    }

    if (Array.isArray(value) || typeof value === 'object') {
        return JSON.stringify(value, null, 2)
    }

    return String(value)
}

function formatSummaryValue(key, value) {
    const currencyKeys = [
        'totalAmountFromVendTransactions',
        'vendTransactionAmount',
        'aeonReportAmount',
        'reportRowAmount',
        'importAmountDifference',
        'amountDifference',
        'duplicateRequestedAmount',
        'duplicateVendedAmount',
        'duplicateOverageAmount'
    ]

    if (currencyKeys.includes(key)) {
        const numeric = Number(value)
        if (Number.isFinite(numeric)) {
            return numeric.toLocaleString('en-ZA', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        }
    }

    return formatValue(value)
}

function formatAmountValue(value) {
    if (value === null || value === undefined || value === '' || value === 'N/A') {
        return 'N/A'
    }

    const numeric = Number(value)
    if (Number.isFinite(numeric)) {
        return numeric.toLocaleString('en-ZA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    return String(value)
}

function formatStatusValue(value) {
    const raw = String(value ?? '').trim()
    if (!raw) {
        return 'Processed'
    }

    return raw
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim()
}

function formatPossibleDate(value) {
    if (!value || value === 'N/A') {
        return 'N/A'
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return String(value)
    }

    return date.toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

function formatPossibleDateTime(value) {
    if (!value || value === 'N/A') {
        return 'N/A'
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return String(value)
    }

    return date.toLocaleString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

function stringifyRow(row) {
    return JSON.stringify(row?._raw ?? row, null, 2)
}

function normalizeBaseUrl(value) {
    const raw = String(value || '').trim()
    const withoutDuplicateProtocol = raw.replace(/^(https?:\/\/)(https?:\/\/)+/i, '$1')
    return withoutDuplicateProtocol.replace(/\/+$/, '')
}

function validateAeonFile(file) {
    const fileName = String(file?.name || '').toLowerCase()
    const extensionMatches = acceptedAeonExtensions.some((extension) => fileName.endsWith(extension))

    if (!extensionMatches) {
        return 'File must be CSV, TXT, XLSX, XLS, or PDF.'
    }

    if (file.size > maxFileSize) {
        return 'File size must be less than 25MB.'
    }

    return ''
}

</script>

<style scoped>
.aeon-table-header {
    grid-template-columns: 1.2fr 1fr 1.1fr 0.95fr 1.05fr;
    column-gap: 1.25rem;
}

.aeon-transaction-card {
    display: grid;
    gap: 1rem;
}

:deep(.aeon-filepond .filepond--root) {
    margin-bottom: 0;
    font-family: inherit;
    width: 100%;
}

:deep(.aeon-filepond .filepond--panel-root) {
    background: rgba(248, 250, 252, 0.92);
    border: 2px dashed rgb(165 243 252);
    border-radius: 1.5rem;
}

:deep(.aeon-filepond .filepond--drop-label) {
    color: rgb(71 85 105);
}

:deep(.aeon-filepond .filepond--label-action) {
    color: rgb(8 145 178);
    text-decoration-color: rgb(8 145 178);
}

@media (min-width: 1280px) {
    .aeon-transaction-card {
        grid-template-columns: 1.2fr 1fr 1.1fr 0.95fr 1.05fr;
        column-gap: 1.25rem;
        align-items: start;
    }
}
</style>
