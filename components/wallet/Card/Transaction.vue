<template>
    <Card class="bg-white hover:bg-gray-50/50 transition-colors">
        <CardContent class="p-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <div class="h-10 w-10 rounded-full flex items-center justify-center"
                    :class="getUtilityClass(data.type)">
                    <Icon 
                        :name="getUtilityIcon(data.type)"
                        class="h-5 w-5 text-white"
                    />
                </div>
                <div class="space-y-1">
                    <h3 class="font-medium leading-none">{{ data.type }}</h3>
                    <p class="text-sm text-muted-foreground">
                        {{ new Date(data.created).toLocaleDateString() }}
                    </p>
                    <p v-if="data.meter_number" class="text-xs text-muted-foreground">
                        Meter: {{ data.meter_number }}
                    </p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-medium" :class="data.type === 'Funding' ? 'text-green-600' : ''">
                    {{ data.type === 'Funding' ? '+' : '-' }} {{ Number(data.amount).toFixed(2) }}
                </p>
                <Badge 
                    :variant="getStatusVariant(data.status)"
                    class="mt-1"
                >
                    {{ data.status }}
                </Badge>
            </div>
        </CardContent>
    </Card>
</template>

<script>
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default {
    components: {
        Card,
        CardContent,
        Badge
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    methods: {
        getUtilityClass(type) {
            const classes = {
                'Electricity': 'bg-blue-500',
                'Water': 'bg-teal-500',
                'Funding': 'bg-emerald-500',
                'Withdrawal': 'bg-gray-500'
            };
            return classes[type] || 'bg-gray-500';
        },
        getUtilityIcon(type) {
            const icons = {
                'Electricity': 'lucide:zap',
                'Water': 'lucide:droplets',
                'Funding': 'lucide:wallet',
                'Withdrawal': 'lucide:credit-card'
            };
            return icons[type] || 'lucide:circle';
        },
        getStatusVariant(status) {
            const variants = {
                'completed': 'success',
                'pending': 'warning',
                'failed': 'destructive',
                'processing': 'secondary'
            };
            return variants[status.toLowerCase()] || 'secondary';
        }
    }
}
</script>