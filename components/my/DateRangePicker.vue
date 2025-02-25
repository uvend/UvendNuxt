<template>
<Popover>
    <PopoverTrigger as-child>
    <Button variant="outline"
            :class="[!value ? 'w-[280px] justify-start text-left font-normal' : '']"
            class="text-muted-foreground"
        >
        <Icon name="lucide:calendar-days" class="mr-2 h-4 w-4" />
        <template v-if="value.start">
        <template v-if="value.end">
            {{ formatDate(value.start) }} - {{ formatDate(value.end) }}
        </template>

        <template v-else>
            {{ formatDate(value.start) }}
        </template>
        </template>
        <template v-else>
        Pick a date
        </template>
    </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
    <RangeCalendar v-model="value" initial-focus :number-of-months="2" @update:start-value="(startDate) => value.start = startDate" />
    </PopoverContent>
</Popover>
</template>
<script>

export default{
    data(){
        return {
            value: {}
        }
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' });
        }
    },
}
</script>