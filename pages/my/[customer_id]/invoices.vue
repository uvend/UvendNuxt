<template>
    <div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div class="flex-1 p-6 lg:p-8 flex flex-col max-w-3xl">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Invoices</h1>
                <p class="text-gray-600">Generate VAT invoices for a selected date range</p>
            </div>

            <Card class="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <CardTitle class="text-xl font-semibold text-gray-800">Generate Invoice</CardTitle>
                    <p class="text-gray-600 text-sm">Enter the period and your VAT number, then preview the invoice</p>
                </CardHeader>
                <CardContent class="p-6 space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label class="text-sm font-medium text-gray-700 mb-2 block">Start Date</Label>
                            <Input
                                type="date"
                                v-model="startDate"
                                class="bg-white border-gray-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <Label class="text-sm font-medium text-gray-700 mb-2 block">End Date</Label>
                            <Input
                                type="date"
                                v-model="endDate"
                                class="bg-white border-gray-200 rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <Label class="text-sm font-medium text-gray-700 mb-2 block">Customer VAT Number</Label>
                        <Input
                            type="text"
                            v-model="customerVatNumber"
                            placeholder="e.g. 4123456789"
                            class="bg-white border-gray-200 rounded-lg"
                        />
                    </div>

                    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

                    <div class="flex justify-end pt-2">
                        <Button
                            @click="generateInvoice"
                            :disabled="isGenerating"
                            class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon v-if="!isGenerating" name="lucide:eye" class="w-4 h-4" />
                            <Icon v-else name="lucide:loader-2" class="w-4 h-4 animate-spin" />
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
    layout: 'my'
})

const route = useRoute()

const today = new Date()
const defaultStart = new Date(today.getFullYear(), today.getMonth() - 1, 26)
const defaultEnd = new Date(today.getFullYear(), today.getMonth(), 25)

const startDate = ref(formatDateInput(defaultStart))
const endDate = ref(formatDateInput(defaultEnd))
const customerVatNumber = ref('')
const isGenerating = ref(false)
const errorMessage = ref('')

function formatDateInput(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function statementBase() {
    return (typeof STATEMENT_API === 'string' ? STATEMENT_API : '').replace(/\/$/, '')
}

function openHtmlInNewTab(html) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const newTab = window.open(url, '_blank')
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        const link = document.createElement('a')
        link.href = url
        link.download = `Invoice_${startDate.value}_${endDate.value}.html`
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(url), 100)
    } else {
        setTimeout(() => URL.revokeObjectURL(url), 10000)
    }
}

async function generateInvoice() {
    errorMessage.value = ''
    if (!startDate.value || !endDate.value) {
        errorMessage.value = 'Please select a start and end date.'
        return
    }
    if (!customerVatNumber.value?.trim()) {
        errorMessage.value = 'Please enter your VAT number.'
        return
    }

    isGenerating.value = true
    try {
        const result = await useAuthFetch(`${statementBase()}/invoices`, {
            method: 'GET',
            responseType: 'text',
            params: {
                CustomerID: route.params.customer_id,
                StartDate: startDate.value,
                EndDate: endDate.value,
                CustomerVatNumber: customerVatNumber.value.trim(),
                html: true,
            },
        })

        const html = typeof result === 'string'
            ? result
            : (result?.html || result?.data || String(result ?? ''))

        if (!html || (typeof html === 'string' && html.trim() === '')) {
            throw new Error('Empty invoice response')
        }

        openHtmlInNewTab(html)
    } catch (e) {
        console.error('generateInvoice', e)
        errorMessage.value = 'Failed to generate invoice. Please check your details and try again.'
    } finally {
        isGenerating.value = false
    }
}
</script>
