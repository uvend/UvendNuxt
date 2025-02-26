<template>
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline" class="text-muted-foreground w-[280px] justify-start text-left font-normal">
          <Icon name="lucide:calendar-days" class="mr-2 h-4 w-4" />
          <template v-if="modelValue.start && modelValue.end">
            {{ formatDate(modelValue.start) }} - {{ formatDate(modelValue.end) }}
          </template>
          <template v-else>
            Pick a date range
          </template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <RangeCalendar 
          v-model="selectedRange" 
          initial-focus 
          :number-of-months="2"
          @update:modelValue="updateRange"
        />
        <div v-if="showManualInput" class="p-2">
          <p class="text-sm text-red-500">Please enter a valid date range:</p>
          <input type="date" v-model="selectedRange.start" class="border p-2 w-full mb-2" />
          <input type="date" v-model="selectedRange.end" class="border p-2 w-full" />
        </div>
        <div class="flex justify-end p-2">
          <Button variant="primary" @click="applyRange">Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: Object
    },
    data() {
      return {
        selectedRange: { start: this.modelValue.start, end: this.modelValue.end }, // Ensure reactivity
        showManualInput: false
      };
    },
    watch: {
      modelValue: {
        handler(newValue) {
          this.selectedRange = { start: newValue.start, end: newValue.end };
        },
        deep: true
      }
    },
    methods: {
      formatDate(date) {
        return date ? new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : "";
      },
      updateRange(newRange) {
        this.selectedRange = { ...this.selectedRange, ...newRange };
        this.showManualInput = false;
      },
      applyRange() {
        if (!this.selectedRange.start || !this.selectedRange.end) {
          this.showManualInput = true;
        } else {
          this.$emit("update:modelValue", this.selectedRange);
        }
      }
    }
  };
  </script>
  