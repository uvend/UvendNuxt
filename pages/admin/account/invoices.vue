<template>
    <div class="flex flex-col min-h-0 overflow-hidden bg-gray-50">
        <div class="flex-shrink-0 pb-4">
            <div class="mb-4">
                <h1 class="text-xl font-bold tracking-tight text-gray-900 leading-tight">Invoices</h1>
                <p class="text-xs text-gray-500 mt-0.5">Generate customer invoices via the statement API</p>
            </div>

            <Card class="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent class="p-4 space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        <div class="space-y-1">
                            <Label class="text-xs font-medium text-gray-600">Customer ID</Label>
                            <Input v-model="customerId" type="text" placeholder="e.g. 44" class="h-9" />
                        </div>
                        <div class="space-y-1">
                            <Label class="text-xs font-medium text-gray-600">Start Date</Label>
                            <Input v-model="startDate" type="date" class="h-9" />
                        </div>
                        <div class="space-y-1">
                            <Label class="text-xs font-medium text-gray-600">End Date</Label>
                            <Input v-model="endDate" type="date" class="h-9" />
                        </div>
                        <div class="space-y-1">
                            <Label class="text-xs font-medium text-gray-600">Customer VAT Number</Label>
                            <Input v-model="customerVatNumber" type="text" placeholder="e.g. 4123456789" class="h-9" />
                        </div>
                        <div class="space-y-1 flex items-end">
                            <label class="inline-flex items-center gap-2 h-9 text-sm text-gray-700 cursor-pointer">
                                <input v-model="asHtml" type="checkbox" class="rounded border-gray-300" />
                                Return HTML preview
                            </label>
                        </div>
                    </div>

                    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
                    <p v-if="successMessage" class="text-sm text-green-700">{{ successMessage }}</p>

                    <div class="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            :disabled="isGenerating"
                            @click="resetForm"
                        >
                            Clear
                        </Button>
                        <Button
                            size="sm"
                            class="bg-blue-600 hover:bg-blue-700"
                            :disabled="isGenerating"
                            @click="generateInvoice"
                        >
                            <Icon v-if="!isGenerating" name="lucide:file-text" class="w-4 h-4 mr-1" />
                            <Icon v-else name="lucide:loader-2" class="w-4 h-4 mr-1 animate-spin" />
                            {{ isGenerating ? 'Generating…' : 'Generate Invoice' }}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'account'
})

const today = new Date()
const defaultStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)

const customerId = ref('')
const startDate = ref(formatDateInput(defaultStart))
const endDate = ref(formatDateInput(today))
const customerVatNumber = ref('')
const asHtml = ref(true)
const isGenerating = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function formatDateInput(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function statementBase() {
    return (typeof STATEMENT_API === 'string' ? STATEMENT_API : '').replace(/\/$/, '')
}

function resetForm() {
    customerId.value = ''
    customerVatNumber.value = ''
    startDate.value = formatDateInput(defaultStart)
    endDate.value = formatDateInput(today)
    asHtml.value = true
    errorMessage.value = ''
    successMessage.value = ''
}

function openHtmlInNewTab(html) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const newTab = window.open(url, '_blank')
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        const link = document.createElement('a')
        link.href = url
        link.download = `Invoice_${customerId.value}_${startDate.value}_${endDate.value}.html`
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(url), 100)
    } else {
        setTimeout(() => URL.revokeObjectURL(url), 10000)
    }
}

function downloadPayload(data, filename) {
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    const type = typeof data === 'string' ? 'text/plain;charset=utf-8' : 'application/json;charset=utf-8'
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 100)
}

async function generateInvoice() {
    errorMessage.value = ''
    successMessage.value = ''

    if (!customerId.value?.trim()) {
        errorMessage.value = 'Customer ID is required.'
        return
    }
    if (!startDate.value || !endDate.value) {
        errorMessage.value = 'Start and end dates are required.'
        return
    }
    if (!customerVatNumber.value?.trim()) {
        errorMessage.value = 'Customer VAT number is required.'
        return
    }

    isGenerating.value = true
    try {
        const params = {
            CustomerID: customerId.value.trim(),
            StartDate: startDate.value,
            EndDate: endDate.value,
            CustomerVatNumber: customerVatNumber.value.trim(),
        }
        if (asHtml.value) {
            params.html = true
        }

        const result = await useAuthFetch(`${statementBase()}/invoices`, {
            method: 'GET',
            ...(asHtml.value ? { responseType: 'text' } : {}),
            params,
        })

        if (asHtml.value) {
            const html = typeof result === 'string'
                ? result
                : (result?.html || result?.data || String(result ?? ''))

            if (!html || (typeof html === 'string' && html.trim() === '')) {
                throw new Error('Empty invoice response')
            }
            openHtmlInNewTab(html)
            successMessage.value = 'Invoice opened in a new tab.'
        } else {
            downloadPayload(result, `Invoice_${customerId.value}_${startDate.value}_${endDate.value}.json`)
            successMessage.value = 'Invoice response downloaded.'
        }
    } catch (e) {
        console.error('generateInvoice', e)
        errorMessage.value = 'Failed to generate invoice. Please check the parameters and try again.'
    } finally {
        isGenerating.value = false
    }
}
</script>
