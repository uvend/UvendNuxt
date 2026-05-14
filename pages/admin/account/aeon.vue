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
                                    label-idle="Upload an Aeon export file and validate against meter activity or <span class='filepond--label-action'>browse</span>"
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
                            <Card v-if="amountSummaryEntries.length" class="mt-4 border-slate-200 bg-slate-50 shadow-none">
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
                                <div class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                                    {{ displayedTransactions.length }} row{{ displayedTransactions.length === 1 ? '' : 's' }}
                                </div>
                                <div v-if="displayedTransactions.length > pageSize" class="ml-auto flex items-center gap-2">
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

                            <div v-else-if="!displayedTransactions.length" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                <p class="text-base font-semibold text-slate-900">No records found for this filter</p>
                                <p class="mt-2 text-sm text-slate-500">Try another summary card or click the active one again to clear the filter.</p>
                            </div>

                            <div v-else class="space-y-3">
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
                                            {{ formatStatusValue(getPreferredValue(transaction, statusKeyCandidates, responseStatus || 'Processed')) }}
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
const maxFileSize = 10 * 1024 * 1024
const summaryFilterLabels = {
    totalRows: 'Total rows',
    validRows: 'Valid rows',
    invalidRows: 'Invalid rows',
    matchedCount: 'Matched count',
    mismatchedCount: 'Mismatched count',
    missingInMeterActivityCount: 'Missing meter activity',
    duplicateInImportCount: 'Duplicate import',
    duplicateInMeterActivityCount: 'Duplicate meter activity'
}

const summaryEntries = computed(() => toDisplayEntries(summary.value))
const amountSummaryKeys = ['totalAmountFromVendTransactions', 'aeonReportAmount', 'amountDifference']
const amountSummaryEntries = computed(() =>
    summaryEntries.value.filter((entry) => amountSummaryKeys.includes(entry.key))
)
const nonAmountSummaryEntries = computed(() =>
    summaryEntries.value.filter((entry) => !amountSummaryKeys.includes(entry.key))
)
const duplicateKeys = computed(() => extractDuplicateKeys(duplicates.value))
const duplicateTransactions = computed(() =>
    transactions.value.filter((transaction) => isDuplicateInImportTransaction(transaction))
)
const validTransactions = computed(() =>
    transactions.value.filter((transaction) =>
        !isDuplicateInImportTransaction(transaction) &&
        !isInvalidTransaction(transaction)
    )
)
const invalidTransactions = computed(() =>
    transactions.value.filter((transaction) => isInvalidTransaction(transaction))
)
const matchedTransactions = computed(() =>
    validTransactions.value.filter((transaction) => isMatchedTransaction(transaction))
)
const mismatchedTransactions = computed(() =>
    validTransactions.value.filter((transaction) => isMismatchedTransaction(transaction))
)
const missingTransactions = computed(() =>
    validTransactions.value.filter((transaction) => isMissingInMeterActivityTransaction(transaction))
)
const duplicateInMeterActivityTransactions = computed(() =>
    transactions.value.filter((transaction) => isDuplicateInMeterActivityTransaction(transaction))
)
const displayedTransactions = computed(() => getTransactionsForFilter(activeSummaryFilter.value))
const totalPages = computed(() => Math.max(1, Math.ceil(displayedTransactions.value.length / pageSize)))
const pageStartIndex = computed(() => (currentPage.value - 1) * pageSize)
const paginatedTransactions = computed(() =>
    displayedTransactions.value.slice(pageStartIndex.value, pageStartIndex.value + pageSize)
)
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

    activeSummaryFilter.value = activeSummaryFilter.value === key ? '' : key
    currentPage.value = 1
}

function isFilterableSummaryKey(key) {
    return Object.prototype.hasOwnProperty.call(summaryFilterLabels, key)
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

function getTransactionsForFilter(filterKey) {
    switch (filterKey) {
        case 'totalRows':
            return transactions.value
        case 'validRows':
            return validTransactions.value
        case 'invalidRows':
            return invalidTransactions.value
        case 'matchedCount':
            return matchedTransactions.value
        case 'mismatchedCount':
            return mismatchedTransactions.value
        case 'missingInMeterActivityCount':
            return missingTransactions.value
        case 'duplicateInImportCount':
            return duplicateTransactions.value
        case 'duplicateInMeterActivityCount':
            return duplicateInMeterActivityTransactions.value
        default:
            return transactions.value
    }
}

function extractDuplicateKeys(value) {
    const keys = new Set()

    const visit = (entry) => {
        if (!entry) return

        if (Array.isArray(entry)) {
            for (const item of entry) visit(item)
            return
        }

        if (typeof entry !== 'object') return

        for (const signature of buildTransactionSignatures(entry)) {
            if (signature) keys.add(signature)
        }

        for (const nestedValue of Object.values(entry)) {
            if (nestedValue && typeof nestedValue === 'object') visit(nestedValue)
        }
    }

    visit(value)
    return keys
}

function isDuplicateTransaction(transaction, index) {
    const signatures = buildTransactionSignatures(transaction, index)
    return signatures.some((signature) => duplicateKeys.value.has(signature))
}

function normalizeKey(value) {
    const raw = String(value ?? '').trim().toLowerCase()
    return raw || ''
}

function buildTransactionSignatures(transaction, index = -1) {
    const key = getPreferredValue(transaction, duplicateKeyCandidates, '')
    const reference = getPreferredValue(transaction, referenceKeyCandidates, index >= 0 ? getReferenceValue(transaction, index) : '')
    const meter = getPreferredValue(transaction, meterKeyCandidates, '')
    const phone = getPreferredValue(transaction, phoneKeyCandidates, '')

    const parts = [key, reference, meter, phone, transaction?.id ?? '']
    const signatures = new Set()

    for (const part of parts) {
        const normalized = normalizeKey(part)
        if (normalized) signatures.add(normalized)
    }

    const compositeCandidates = [
        [meter, reference, phone],
        [meter, reference],
        [meter, phone],
        [reference, phone]
    ]

    for (const candidateParts of compositeCandidates) {
        const normalizedParts = candidateParts.map(normalizeKey).filter(Boolean)
        if (normalizedParts.length >= 2) {
            signatures.add(normalizedParts.join('|'))
        }
    }

    return [...signatures]
}

function getTransactionTextBlob(transaction) {
    return JSON.stringify(transaction ?? {}).toLowerCase()
}

function hasTruthyFlag(transaction, keys) {
    return keys.some((key) => transaction?.[key] === true || transaction?.[key] === 1 || transaction?.[key] === 'true')
}

function isInvalidTransaction(transaction) {
    const blob = getTransactionTextBlob(transaction)
    return hasTruthyFlag(transaction, ['invalid', 'isInvalid', 'is_invalid']) || /\binvalid\b/.test(blob)
}

function isMatchedTransaction(transaction) {
    return hasNormalizedStatus(transaction, ['matched'])
}

function isMismatchedTransaction(transaction) {
    return hasNormalizedStatus(transaction, ['mismatched', 'mismatch'])
}

function isMissingInMeterActivityTransaction(transaction) {
    return hasNormalizedStatus(transaction, ['missinginmeteractivity'])
}

function isDuplicateInImportTransaction(transaction) {
    return hasNormalizedStatus(transaction, ['duplicateinimport']) || isDuplicateTransaction(transaction)
}

function isDuplicateInMeterActivityTransaction(transaction) {
    return hasNormalizedStatus(transaction, ['duplicateinmeteractivity'])
}

function normalizeTransactions(value) {
    if (Array.isArray(value)) {
        return value
    }

    if (value && typeof value === 'object') {
        const nestedArray = Object.values(value).find((entry) => Array.isArray(entry))
        return Array.isArray(nestedArray) ? nestedArray : []
    }

    return []
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
    return getPreferredValue(row, ['transId', ...referenceKeyCandidates], `Row ${index + 1}`)
}

function getTransactionKey(row, index) {
    const preferred = getPreferredValue(row, [...referenceKeyCandidates, ...meterKeyCandidates], '')
    return preferred ? `${preferred}-${index}` : `aeon-row-${index}`
}

function formatLabel(label) {
    if (summaryFilterLabels[label]) {
        return summaryFilterLabels[label]
    }

    if (label === 'totalAmountFromVendTransactions') {
        return 'Total vend amount'
    }

    if (label === 'aeonReportAmount') {
        return 'Aeon report amount'
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
    if (['totalAmountFromVendTransactions', 'aeonReportAmount', 'amountDifference'].includes(key)) {
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

function getNormalizedStatus(transaction) {
    const rawStatus = getPreferredValue(transaction, statusKeyCandidates, '')
    return normalizeObjectKey(rawStatus)
}

function hasNormalizedStatus(transaction, allowedStatuses) {
    const normalizedStatus = getNormalizedStatus(transaction)
    if (!normalizedStatus) {
        return false
    }

    return allowedStatuses.some((status) => normalizedStatus === normalizeObjectKey(status))
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
        minute: '2-digit'
    })
}

function stringifyRow(row) {
    return JSON.stringify(row, null, 2)
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
        return 'File size must be less than 10MB.'
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
