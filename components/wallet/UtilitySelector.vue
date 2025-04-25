<template>
    <ScrollArea class="w-full">
        <div class="flex space-x-2 pb-2">
            <Button
                v-for="option in options"
                :key="option.key"
                size="sm"
                :variant="modelValue === option.key ? 'default' : 'outline'"
                class="whitespace-nowrap"
                @click="handleSelect(option.key)"
            >
                {{ option.value }}
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
            default: 'all'
        },
        options: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        handleSelect(value) {
            this.$emit('update:modelValue', value);
        }
    }
}
</script>