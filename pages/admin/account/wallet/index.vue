<template>
    <div class="wallet-page flex flex-col min-h-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <div class="wallet-page-toolbar flex-shrink-0 z-20 pb-2">
                <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                            <Icon name="lucide:wallet" class="h-5 w-5 text-white" />
                        </div>
                        <div class="min-w-0">
                            <h1 class="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                                Wallet Accounts
                            </h1>
                            <p class="text-xs text-gray-500 mt-0.5 truncate">
                                <template v-if="searchQuery.trim()">Filtered results</template>
                                <template v-else>Overview of wallet balances</template>
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <div class="inline-flex items-center gap-2 rounded-lg border border-gray-200/80 bg-white/90 px-3 py-1.5 shadow-sm">
                            <span class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Total</span>
                            <span class="text-base font-bold tabular-nums text-blue-600">{{ total }}</span>
                        </div>
                        <div
                            v-if="total > 0"
                            class="inline-flex items-center gap-2 rounded-lg border border-gray-200/80 bg-white/90 px-3 py-1.5 shadow-sm"
                        >
                            <span class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Showing</span>
                            <span class="text-sm font-semibold tabular-nums text-gray-800">
                                {{ rangeStart }}–{{ rangeEnd }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <div class="relative flex-1 min-w-[200px] max-w-md">
                        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search account, email, or name..."
                            class="pl-9 h-9 bg-white/80 border-gray-200 rounded-lg text-sm"
                            @input="debouncedSearch"
                        />
                    </div>
                    <Button
                        v-if="searchQuery.trim()"
                        variant="outline"
                        size="sm"
                        class="rounded-lg"
                        @click="clearSearch"
                    >
                        Clear
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="outline" size="sm" class="rounded-lg gap-1.5">
                                <Icon name="lucide:columns-3" class="w-4 h-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-48">
                            <DropdownMenuItem
                                v-for="col in toggleableColumns"
                                :key="col.key"
                                class="flex justify-between cursor-pointer"
                                @click="toggleColumn(col.key)"
                            >
                                <span>{{ col.label }}</span>
                                <Icon v-if="columnVisibility[col.key]" name="lucide:check" class="h-4 w-4" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Select v-model="pageSize" @update:model-value="onPageSizeChange">
                        <SelectTrigger class="w-[72px] h-9 rounded-lg bg-white/80 text-sm">
                            <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="size in pageSizeSelect" :key="size" :value="size">
                                {{ size }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <MySkeletenCardList v-if="isLoading" class="flex-1 min-h-0 overflow-hidden" :columns="5" />

            <div
                v-else
                class="wallet-table-card flex-1 min-h-0 flex flex-col bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-lg rounded-xl overflow-hidden"
            >
                <div v-if="accounts.length > 0" class="flex-1 min-h-0 overflow-auto custom-scrollbar">
                    <table class="w-full">
                        <thead class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-b border-gray-200">
                            <tr>
                                <th
                                    v-if="isColumnVisible('account')"
                                    class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm"
                                >
                                    Account
                                </th>
                                <th
                                    v-if="isColumnVisible('email')"
                                    class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm"
                                >
                                    Email
                                </th>
                                <th
                                    v-if="isColumnVisible('display_name')"
                                    class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm"
                                >
                                    Display Name
                                </th>
                                <th
                                    v-if="isColumnVisible('balance')"
                                    class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm"
                                >
                                    Balance
                                </th>
                                <th
                                    v-if="isColumnVisible('created')"
                                    class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm"
                                >
                                    Created
                                </th>
                                <th
                                    v-if="isColumnVisible('updated')"
                                    class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm"
                                >
                                    Updated
                                </th>
                                <th class="text-left py-2.5 px-4 font-semibold text-gray-700 text-sm">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="account in accounts"
                                :key="account.account"
                                class="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 group"
                            >
                                <td
                                    v-if="isColumnVisible('account')"
                                    class="py-2 px-4 text-sm font-medium text-gray-900 group-hover:text-gray-700"
                                >
                                    {{ account.account }}
                                </td>
                                <td
                                    v-if="isColumnVisible('email')"
                                    class="py-2 px-4 text-sm text-gray-700 group-hover:text-gray-700"
                                >
                                    {{ account.email || '—' }}
                                </td>
                                <td
                                    v-if="isColumnVisible('display_name')"
                                    class="py-2 px-4 text-sm text-gray-700 group-hover:text-gray-700"
                                >
                                    {{ account.display_name || '—' }}
                                </td>
                                <td
                                    v-if="isColumnVisible('balance')"
                                    class="py-2 px-4 text-sm font-semibold text-green-600 group-hover:text-green-700"
                                >
                                    {{ formatBalance(account.balance) }}
                                </td>
                                <td
                                    v-if="isColumnVisible('created')"
                                    class="py-2 px-4 text-sm text-gray-500 group-hover:text-gray-600"
                                >
                                    {{ formatDate(account.created) }}
                                </td>
                                <td
                                    v-if="isColumnVisible('updated')"
                                    class="py-2 px-4 text-sm text-gray-500 group-hover:text-gray-600"
                                >
                                    {{ formatDate(account.updated) }}
                                </td>
                                <td class="py-2 px-4 text-sm">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="rounded-lg h-8"
                                        @click="viewAccount(account.account)"
                                    >
                                        View Account
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="flex-1 min-h-0 flex items-center justify-center p-12 text-center text-gray-500">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="lucide:wallet" class="w-8 h-8 text-gray-400" />
                    </div>
                    <p class="text-gray-600 font-medium">
                        {{ searchQuery.trim() ? 'No accounts match your search' : 'No accounts found' }}
                    </p>
                </div>

                <div
                    v-if="total > 0"
                    class="flex-shrink-0 px-4 py-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 bg-gray-50"
                >
                    <p class="text-xs text-gray-600">
                        Page {{ currentPage }} of {{ totalPages || 1 }} · {{ limit }} per page
                    </p>
                    <div class="flex items-center gap-1.5">
                        <Button
                            variant="secondary"
                            size="sm"
                            class="rounded-lg h-8"
                            :disabled="currentPage <= 1"
                            @click="changePage(currentPage - 1)"
                        >
                            <Icon name="lucide:chevron-left" class="w-4 h-4" />
                            Prev
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            class="rounded-lg h-8"
                            :disabled="currentPage >= totalPages"
                            @click="changePage(currentPage + 1)"
                        >
                            Next
                            <Icon name="lucide:chevron-right" class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
    </div>
</template>

<script setup>
import { debounce } from 'lodash'

definePageMeta({
    layout: 'account'
})

const { formatMoney } = useCurrency()

const searchQuery = ref('')

const accounts = ref([])
const total = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const limit = ref(10)
const pageSize = ref(10)
const pageSizeSelect = [10, 25, 50, 100]
const isLoading = ref(true)

const toggleableColumns = [
    { key: 'account', label: 'Account' },
    { key: 'email', label: 'Email' },
    { key: 'display_name', label: 'Display Name' },
    { key: 'balance', label: 'Balance' },
    { key: 'created', label: 'Created' },
    { key: 'updated', label: 'Updated' }
]

const columnVisibility = ref({
    account: true,
    email: true,
    display_name: true,
    balance: true,
    created: true,
    updated: true
})

const rangeStart = computed(() => {
    if (total.value === 0) return 0
    return (currentPage.value - 1) * limit.value + 1
})

const rangeEnd = computed(() => {
    if (total.value === 0) return 0
    return Math.min(currentPage.value * limit.value, total.value)
})

function isColumnVisible(key) {
    return columnVisibility.value[key]
}

function toggleColumn(key) {
    columnVisibility.value[key] = !columnVisibility.value[key]
}

function formatBalance(value) {
    if (value == null) return '—'
    return formatMoney(value)
}

function formatDate(value) {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

async function fetchAccounts() {
    isLoading.value = true
    try {
        const trimmedSearch = searchQuery.value.trim()
        const params = {
            page: currentPage.value,
            limit: pageSize.value
        }

        const url = trimmedSearch
            ? `${WALLET_API_URL}/admin/accounts/search`
            : `${WALLET_API_URL}/admin/accounts`

        if (trimmedSearch) {
            params.search = trimmedSearch
        }

        const response = await useWalletAuthFetch(url, { params })

        if (response?.accounts) {
            accounts.value = response.accounts
            total.value = response.total ?? 0
            totalPages.value = response.totalPages ?? 0
            currentPage.value = response.currentPage ?? currentPage.value
            limit.value = response.limit ?? pageSize.value
        } else {
            accounts.value = []
            total.value = 0
            totalPages.value = 0
        }
    } catch (error) {
        console.error('Error fetching wallet accounts:', error)
        accounts.value = []
        total.value = 0
        totalPages.value = 0
    } finally {
        isLoading.value = false
    }
}

const debouncedSearch = debounce(() => {
    currentPage.value = 1
    fetchAccounts()
}, 300)

function clearSearch() {
    searchQuery.value = ''
    currentPage.value = 1
    fetchAccounts()
}

function changePage(page) {
    if (page < 1) return
    if (totalPages.value > 0 && page > totalPages.value) return
    if (totalPages.value === 0 && page > 1) return
    currentPage.value = page
    fetchAccounts()
}

function onPageSizeChange() {
    currentPage.value = 1
    fetchAccounts()
}

function viewAccount(accountNumber) {
    if (!accountNumber) return
    navigateTo(`/admin/account/wallet/${accountNumber}`)
}

onMounted(() => {
    fetchAccounts()
})
</script>

<style scoped>
.wallet-page {
    /* Full main column: viewport minus layout header and slot padding */
    height: calc(100vh - 3.25rem - 2rem);
    min-height: 0;
    max-height: calc(100vh - 3.25rem - 2rem);
}

.wallet-page-toolbar {
    flex-shrink: 0;
}

.wallet-table-card {
    flex: 1 1 auto;
    min-height: 0;
}
</style>
