<template>
    <Card class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <CardHeader class="p-6">
            <CardTitle class="text-2xl font-semibold leading-none tracking-tight">Payment Details</CardTitle>
        </CardHeader>
        <CardContent class="p-6 pt-0 space-y-4">
            <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-muted-foreground">Payvault Data</p>
                <p class="text-sm font-medium">{{ data.payvault_data_1 }}</p>
            </div>
            <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-muted-foreground">Amount</p>
                <p class="text-base font-semibold">{{ data.amount }}</p>
            </div>
            <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-muted-foreground">Date</p>
                <p class="text-sm">{{ data.created }}</p>
            </div>
        </CardContent>
    </Card>
</template>

<script>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default {
    components: {
        Card,
        CardHeader,
        CardTitle,
        CardContent
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    }
}
</script>