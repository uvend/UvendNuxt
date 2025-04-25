<template>
    <ScrollArea class="flex gap-2 w-full md:w-auto h-fit">
        <div class="flex gap-2">
            <Button 
                v-for="date in dateRangeOptions" 
                :key="date.key"
                size="sm" 
                :variant="modelValue === date.key ? 'default' : 'outline'" 
                class="flex-1 sm:flex-none bg-white" 
                @click="setDateRange(date.key)"
            >
                {{ date.value }}
            </Button>
        </div>
    </ScrollArea>
</template>

<script>
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

export default {
    components: {
        ScrollArea,
        Button
    },
    props: {
        modelValue: {
            type: String,
            default: '30days'
        }
    },
    data() {
        return {
            dateRangeOptions: [
                { key: "7days", value: "7 days" },
                { key: "30days", value: "30 days" },
                { key: "6months", value: "6 months" },
                { key: "12months", value: "12 months" },
                { key: "all", value: "All Time" }
            ]
        }
    },
    methods: {
        setDateRange(value) {
            this.$emit('update', value);
        }
    }
}
</script>