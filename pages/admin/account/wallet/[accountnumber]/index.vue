<template>
    <div class="account-dashboard flex flex-col min-h-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div class="flex-1 p-4 lg:p-6 flex flex-col min-h-0 overflow-hidden">
            <div class="flex-shrink-0 mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    class="rounded-xl mb-3"
                    @click="navigateTo('/admin/account/wallet')"
                >
                    <Icon name="lucide:arrow-left" class="w-4 h-4 mr-1" />
                    Back to accounts
                </Button>

                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                            <Icon name="lucide:user-round" class="h-5 w-5 text-white" />
                        </div>
                        <div class="min-w-0">
                            <h1 class="text-xl font-bold tracking-tight text-gray-900 leading-tight truncate">
                                {{ account?.display_name || account?.email || 'Wallet Account' }}
                            </h1>
                            <p class="text-xs text-gray-500 mt-0.5 truncate">
                                Account {{ accountNumber }}
                                <span v-if="account?.email"> · {{ account.email }}</span>
                            </p>
                        </div>
                    </div>

                    <div v-if="account" class="flex flex-wrap items-center gap-2">
                        <div class="inline-flex items-center gap-2 rounded-lg border border-gray-200/80 bg-white/90 px-3 py-1.5 shadow-sm">
                            <span class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Balance</span>
                            <span class="text-base font-bold tabular-nums text-green-600">
                                {{ formatMoney(account.balance) }}
                            </span>
                        </div>
                        <WalletPopup
                            buttonLabel="Add Meter"
                            buttonVariant="outline"
                            buttonClass="rounded-lg h-9 gap-1.5"
                        >
                            <WalletAddMeter
                                :account-number="accountNumber"
                                @success="onMeterAdded"
                            />
                        </WalletPopup>
                    </div>
                </div>
            </div>

            <MySkeletenCardList v-if="isLoading" :columns="4" />

            <template v-else-if="account">
                <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4 flex-shrink-0">
                    <Card class="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardHeader class="pb-2 relative z-10">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                    <Icon name="lucide:banknote" class="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                                </div>
                                <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">Total Deposited</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent class="pt-0 relative z-10 space-y-2">
                            <div class="text-lg lg:text-2xl font-bold text-emerald-600">
                                {{ formatMoney(stats.totalDeposited) }}
                            </div>
                            <div class="text-xs text-gray-600">
                                {{ stats.depositCount }} payment{{ stats.depositCount === 1 ? '' : 's' }}
                            </div>
                        </CardContent>
                    </Card>

                    <Card class="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardHeader class="pb-2 relative z-10">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                                    <Icon name="lucide:zap" class="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
                                </div>
                                <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">Electricity</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent class="pt-0 relative z-10 space-y-2">
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-600">Purchased:</span>
                                <span class="text-sm font-semibold text-gray-900">{{ formatMoney(stats.electricitySpent) }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-600">Vends:</span>
                                <span class="text-sm font-semibold text-yellow-600">{{ stats.electricityTransactionCount }}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card class="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardHeader class="pb-2 relative z-10">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <Icon name="lucide:droplets" class="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                                </div>
                                <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">Water</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent class="pt-0 relative z-10 space-y-2">
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-600">Purchased:</span>
                                <span class="text-sm font-semibold text-gray-900">{{ formatMoney(stats.waterSpent) }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-600">Vends:</span>
                                <span class="text-sm font-semibold text-blue-600">{{ stats.waterTransactionCount }}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                    class="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
                >
                    <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader class="pb-2 relative z-10">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                <Icon name="lucide:flame" class="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                            </div>
                            <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">Gas</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent class="pt-0 relative z-10 space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-gray-600">Purchased:</span>
                            <span class="text-sm font-semibold text-gray-900">{{ formatMoney(stats.gasSpent) }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-gray-600">Vends:</span>
                            <span class="text-sm font-semibold text-emerald-600">{{ stats.gasTransactionCount }}</span>
                        </div>
                    </CardContent>
                </Card>

                    <Card class="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardHeader class="pb-2 relative z-10">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                    <Icon name="lucide:layers" class="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
                                </div>
                                <CardTitle class="text-xs lg:text-sm font-semibold text-gray-700">Combined Utilities</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent class="pt-0 relative z-10 space-y-2">
                            <div class="text-lg lg:text-2xl font-bold text-indigo-600">
                                {{ formatMoney(stats.utilitySpentTotal) }}
                            </div>
                            <div class="text-xs text-gray-600">
                                {{ stats.lifetimeMeterTransactions }} lifetime vends
                            </div>
                        </CardContent>
                    </Card>
                


                </div>

                <div class="flex-1 min-h-0 flex flex-col bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-lg rounded-xl overflow-hidden">
                    <div class="flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 pt-3">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div class="flex gap-1">
                                <button
                                    type="button"
                                    class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
                                    :class="activeTab === 'transactions'
                                        ? 'bg-white text-blue-600 shadow-sm border border-b-0 border-gray-200'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'"
                                    @click="activeTab = 'transactions'"
                                >
                                    Transactions
                                </button>
                                <button
                                    type="button"
                                    class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
                                    :class="activeTab === 'payments'
                                        ? 'bg-white text-blue-600 shadow-sm border border-b-0 border-gray-200'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'"
                                    @click="activeTab = 'payments'"
                                >
                                    Payments
                                </button>
                                <button
                                    type="button"
                                    class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
                                    :class="activeTab === 'meters'
                                        ? 'bg-white text-blue-600 shadow-sm border border-b-0 border-gray-200'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'"
                                    @click="activeTab = 'meters'"
                                >
                                    Meters
                                </button>
                            </div>

                            <Select
                                v-if="activeTab === 'payments' && availablePaymentMethods.length > 0"
                                v-model="paymentMethodFilter"
                                @update:model-value="onPaymentMethodChange"
                            >
                                <SelectTrigger class="w-[160px] h-8 rounded-lg bg-white/80 text-sm">
                                    <SelectValue placeholder="Payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All methods</SelectItem>
                                    <SelectItem
                                        v-for="method in availablePaymentMethods"
                                        :key="method.value"
                                        :value="method.value"
                                    >
                                        {{ method.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <MySkeletenCardList v-if="tableLoading" :columns="4" class="p-4" />

                    <template v-else>
                        <AdminAccountWalletTransactionsTab
                            v-if="activeTab === 'transactions'"
                            :transactions="transactions"
                            :format-date-time="formatDateTime"
                            :format-money="formatMoney"
                        />

                        <AdminAccountWalletMetersTab
                            v-else-if="activeTab === 'meters'"
                            :meters="meters"
                            :format-date-time="formatDateTime"
                        />

                        <AdminAccountWalletPaymentsTab
                            v-else
                            :payments="payments"
                            :format-date-time="formatDateTime"
                            :format-money="formatMoney"
                            :format-record-type="formatRecordType"
                            :payment-display-id="paymentDisplayId"
                            :payment-secondary-ref="paymentSecondaryRef"
                            :payment-status-class="paymentStatusClass"
                            :format-payment-status="formatPaymentStatus"
                            :payment-notes="paymentNotes"
                            :is-failure-status="isFailureStatus"
                        />

                        <div
                            v-if="tableTotal > 0 && activeTab !== 'meters'"
                            class="flex-shrink-0 px-4 py-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 bg-gray-50"
                        >
                            <p class="text-xs text-gray-600">
                                Page {{ tableCurrentPage }} of {{ tableTotalPages || 1 }} · {{ tableLimit }} per page
                            </p>
                            <div class="flex items-center gap-1.5">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    class="rounded-lg h-8"
                                    :disabled="tableCurrentPage <= 1"
                                    @click="changeTablePage(tableCurrentPage - 1)"
                                >
                                    <Icon name="lucide:chevron-left" class="w-4 h-4" />
                                    Prev
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    class="rounded-lg h-8"
                                    :disabled="tableCurrentPage >= tableTotalPages"
                                    @click="changeTablePage(tableCurrentPage + 1)"
                                >
                                    Next
                                    <Icon name="lucide:chevron-right" class="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </template>
                </div>
            </template>

            <div v-else class="flex-1 flex items-center justify-center text-gray-500">
                <div class="text-center">
                    <Icon name="lucide:wallet" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p class="font-medium text-gray-600">Account not found</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'account'
})

const route = useRoute()
const { formatMoney } = useCurrency()

const accountNumber = computed(() => String(route.params.accountnumber || ''))
const account = ref(null)
const isLoading = ref(true)
const tableLoading = ref(false)
const activeTab = ref('transactions')

const transactions = ref([])
const payments = ref([])
const meters = ref([])
const tableCurrentPage = ref(1)
const tableTotalPages = ref(0)
const tableTotal = ref(0)
const tableLimit = ref(10)
const paymentMethodFilter = ref('all')
const enabledPaymentMethods = ref({ paygate: false, payat: false, mpesa: false })

const paymentMethodLabels = {
    paygate: 'Paygate',
    payat: 'PayAt',
    mpesa: 'M-Pesa',
}

const availablePaymentMethods = computed(() =>
    Object.entries(enabledPaymentMethods.value)
        .filter(([, enabled]) => enabled)
        .map(([value]) => ({ value, label: paymentMethodLabels[value] }))
)

function applyAvailablePaymentMethods(methods) {
    if (!methods) return
    enabledPaymentMethods.value = {
        paygate: !!methods.paygate,
        payat: !!methods.payat,
        mpesa: !!methods.mpesa,
    }
}

const defaultStats = () => ({
    lifetimeTransactions: 0,
    lifetimeMeterTransactions: 0,
    totalDeposited: 0,
    depositCount: 0,
    electricitySpent: 0,
    waterSpent: 0,
    gasSpent: 0,
    utilitySpentTotal: 0,
    electricityTransactionCount: 0,
    waterTransactionCount: 0,
    gasTransactionCount: 0,
})

const stats = computed(() => account.value?.stats ?? defaultStats())

function formatDateTime(value) {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function formatRecordType(value) {
    if (value === 'request') return 'Request'
    if (value === 'auth') return 'Authorisation'
    if (value === 'transaction') return 'Payment'
    return value || '—'
}

function paymentDisplayId(payment) {
    return payment.externalTransactionId || payment.transactionId || payment.reference || '—'
}

function paymentSecondaryRef(payment) {
    if (payment.type === 'paygate') {
        if (payment.externalTransactionId && payment.transactionId) {
            return `Pay request ${payment.transactionId}`
        }
        if (payment.reference && payment.reference !== paymentDisplayId(payment)) {
            return payment.reference
        }
    }
    if (payment.type === 'payat' && payment.externalTransactionId && payment.transactionId) {
        return `Issuer ${payment.transactionId}`
    }
    if (payment.reference && payment.reference !== paymentDisplayId(payment)) {
        return payment.reference
    }
    return null
}

function paymentNotes(payment) {
    if (payment.resultDesc) return payment.resultDesc
    if (payment.recordType === 'auth' && payment.status === 'pending') {
        return 'Customer authorising payment'
    }
    if (payment.status === 'pending') {
        return 'Awaiting customer payment'
    }
    if (payment.status === 'completed') {
        return 'Payment successful'
    }
    return null
}

function formatPaymentStatus(status) {
    switch (status) {
        case 'completed':
            return 'Successful'
        case 'failed':
            return 'Failed'
        case 'voided':
            return 'Cancelled'
        case 'pending':
            return 'Pending'
        case 'incomplete':
            return 'Not completed'
        default:
            return status ? String(status) : 'Unknown'
    }
}

function paymentStatusClass(status) {
    switch (status) {
        case 'completed':
            return 'bg-emerald-100 text-emerald-700'
        case 'failed':
            return 'bg-red-100 text-red-700'
        case 'voided':
            return 'bg-orange-100 text-orange-700'
        case 'pending':
            return 'bg-amber-100 text-amber-700'
        case 'incomplete':
            return 'bg-gray-100 text-gray-500'
        default:
            return 'bg-gray-100 text-gray-600'
    }
}

function isFailureStatus(status) {
    return status === 'failed' || status === 'voided' || status === 'incomplete'
}

function onPaymentMethodChange() {
    tableCurrentPage.value = 1
    fetchTableData()
}

function onMeterAdded() {
    fetchAccount()
    if (activeTab.value === 'meters') {
        fetchMeters()
    }
}

async function fetchMeters() {
    if (!account.value) return
    tableLoading.value = true
    try {
        const response = await useWalletAuthFetch(
            `${WALLET_API_URL}/admin/accounts/${encodeURIComponent(accountNumber.value)}/meters`
        )
        meters.value = response?.meters ?? []
    } catch (error) {
        console.error('Error fetching account meters:', error)
        meters.value = []
    } finally {
        tableLoading.value = false
    }
}

async function fetchAccount() {
    isLoading.value = true
    account.value = null
    try {
        const response = await useWalletAuthFetch(
            `${WALLET_API_URL}/admin/accounts/${encodeURIComponent(accountNumber.value)}`
        )
        if (response?.account) {
            account.value = response
            applyAvailablePaymentMethods(response.availableMethods)
        }
    } catch (error) {
        console.error('Error fetching wallet account:', error)
    } finally {
        isLoading.value = false
    }
}

async function fetchTableData() {
    if (!account.value) return
    if (activeTab.value === 'meters') {
        return fetchMeters()
    }
    tableLoading.value = true
    try {
        const params = {
            page: tableCurrentPage.value,
            limit: tableLimit.value,
        }
        const base = `${WALLET_API_URL}/admin/accounts/${encodeURIComponent(accountNumber.value)}`

        if (activeTab.value === 'transactions') {
            const response = await useWalletAuthFetch(`${base}/transactions`, { params })
            transactions.value = response?.transactions ?? []
            tableTotal.value = response?.total ?? 0
            tableTotalPages.value = response?.totalPages ?? 0
            tableCurrentPage.value = response?.currentPage ?? tableCurrentPage.value
            tableLimit.value = response?.limit ?? tableLimit.value
        } else {
            if (paymentMethodFilter.value !== 'all') {
                params.method = paymentMethodFilter.value
            }
            const response = await useWalletAuthFetch(`${base}/payments`, { params })
            applyAvailablePaymentMethods(response?.availableMethods)
            payments.value = response?.payments ?? []
            tableTotal.value = response?.total ?? 0
            tableTotalPages.value = response?.totalPages ?? 0
            tableCurrentPage.value = response?.currentPage ?? tableCurrentPage.value
            tableLimit.value = response?.limit ?? tableLimit.value
        }
    } catch (error) {
        console.error('Error fetching account table data:', error)
        transactions.value = []
        payments.value = []
        tableTotal.value = 0
        tableTotalPages.value = 0
    } finally {
        tableLoading.value = false
    }
}

function changeTablePage(page) {
    if (page < 1) return
    if (tableTotalPages.value > 0 && page > tableTotalPages.value) return
    tableCurrentPage.value = page
    fetchTableData()
}

watch(activeTab, () => {
    tableCurrentPage.value = 1
    if (activeTab.value === 'payments' && paymentMethodFilter.value !== 'all') {
        const enabled = availablePaymentMethods.value.some((m) => m.value === paymentMethodFilter.value)
        if (!enabled) {
            paymentMethodFilter.value = 'all'
        }
    }
    if (activeTab.value === 'meters') {
        fetchMeters()
    } else {
        fetchTableData()
    }
})

watch(accountNumber, () => {
    fetchAccount()
})

watch(account, (value) => {
    if (value) {
        tableCurrentPage.value = 1
        fetchTableData()
    }
})

onMounted(() => {
    fetchAccount()
})
</script>

<style scoped>
.account-dashboard {
    height: calc(100vh - 3.25rem - 2rem);
    min-height: 0;
    max-height: calc(100vh - 3.25rem - 2rem);
}
</style>
