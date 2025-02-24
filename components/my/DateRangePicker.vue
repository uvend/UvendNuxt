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
            {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{ df.format(value.end.toDate(getLocalTimeZone())) }}
        </template>

        <template v-else>
            {{ df.format(value.start.toDate(getLocalTimeZone())) }}
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
const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

export default{
    data(){
        return {
            value: {}
        }
    }
}
</script>