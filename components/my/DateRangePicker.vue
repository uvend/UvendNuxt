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
    <RangeCalendar v-model="value" initial-focus :number-of-months="2" @update:start-value="(startDate) => value.start = startDate">
      <template #heading-value="{ headingValue }">
        <div class="flex items-center gap-2">
          <select v-model="internalSelectedMonth" @change="onMonthChange" class="border rounded px-2 py-1">
            <option v-for="(month, idx) in monthsList" :key="month" :value="idx">{{ month }}</option>
          </select>
          <select v-model="internalSelectedYear" @change="onYearChange" class="border rounded px-2 py-1">
            <option v-for="year in yearsList" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </template>
    </RangeCalendar>
    </PopoverContent>
</Popover>
</template>
<script>

export default{
    props: {
        modelValue: Object,
        months: Number,
        selectedMonth: {
            type: Number,
            default: null
        },
        selectedYear: {
            type: Number,
            default: null
        }
    },
    data(){
        const today = new Date();
        return {
            value : {
                start: null,
                end: null
            },
            internalSelectedMonth: this.selectedMonth !== null ? this.selectedMonth : today.getMonth(),
            internalSelectedYear: this.selectedYear !== null ? this.selectedYear : today.getFullYear(),
            monthsList: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ],
            yearsList: Array.from({length: 30}, (_, i) => today.getFullYear() - i)
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
        },
        onMonthChange() {
            const newDate = new Date(this.internalSelectedYear, this.internalSelectedMonth, 1);
            this.value.start = newDate;
        },
        onYearChange() {
            const newDate = new Date(this.internalSelectedYear, this.internalSelectedMonth, 1);
            this.value.start = newDate;
        }
    },
    mounted(){
    },
    watch:{
        internalSelectedMonth(newVal) {
            this.$emit('update:selectedMonth', newVal);
        },
        internalSelectedYear(newVal) {
            this.$emit('update:selectedYear', newVal);
        },
        selectedMonth(newVal) {
            if (newVal !== this.internalSelectedMonth) {
                this.internalSelectedMonth = newVal;
            }
        },
        selectedYear(newVal) {
            if (newVal !== this.internalSelectedYear) {
                this.internalSelectedYear = newVal;
            }
        },
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