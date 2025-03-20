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
            <div v-if="modelValue">
                {{ formatDate(modelValue.start) }} - {{ formatDate(modelValue.end) }}
            </div>
            <div v-else>
            </div>
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
    props: {
        modelValue: Object,
        months: Number
    },
    data(){
        return {
            value : {
                start: null,
                end: null
            }
        }
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' });
        },
        returnFormatDate(date){
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(new Date(date));

            // Replace slashes with hyphens
            return formattedDate.replace(/\//g, '-');
        },
        updateValue(value) {
            this.$emit('update:modelValue', value);
        },
        setFormat(date){
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            }
        }
    },
    mounted(){
    },
    watch:{
        value(newValue){
            console.log(newValue)
            const value = {
                start : this.returnFormatDate(newValue.start),
                end : this.returnFormatDate(newValue.end)
            }
            this.updateValue(value)
        }
    }
}
</script>