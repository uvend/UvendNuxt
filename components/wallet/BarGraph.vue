<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Usage Metrics</CardTitle>
      <CardDescription>Comparison between Water and Electricity consumption</CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Legend -->
      <div class="flex items-center justify-center space-x-4 mb-4">
        <div class="flex items-center space-x-2">
          <div class="h-3 w-3 rounded-full bg-blue-500"></div>
          <span class="text-sm text-muted-foreground">Water Meters</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="h-3 w-3 rounded-full bg-red-500"></div>
          <span class="text-sm text-muted-foreground">Electricity Meters</span>
        </div>
      </div>

      <!-- Grid lines -->
      <div class="relative h-[200px]">
        <div class="absolute inset-0 flex flex-col justify-between">
          <div v-for="i in 5" :key="i" class="h-px bg-border"></div>
        </div>

        <!-- Bars -->
        <div class="relative h-full flex items-end justify-around">
          <div v-for="(value, index) in data" :key="index" 
               class="relative w-[40px] transition-all duration-300"
               :style="{ height: value + '%' }">
            <div class="absolute inset-x-0 bottom-0 rounded-t-md"
                 :class="index % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'"
                 :style="{ height: '100%' }">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs">
                {{ value }}%
              </span>
            </div>
          </div>
        </div>

        <!-- X-axis labels -->
        <div class="absolute bottom-0 left-0 right-0 flex justify-around mt-4">
          <div v-for="(value, index) in data" :key="index" class="text-xs text-muted-foreground">
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#components';
import { useFetch } from '@vueuse/core';

const data = ref([]);
const useSampleData = true; // Set to true to use sample data for development

// Sample data for development
const sampleData = [30, 50, 70, 90, 60];

// Fetch data from an external API
onMounted(async () => {
  if (useSampleData) {
    console.log('Using sample data:', sampleData);
    data.value = sampleData;
  } else {
    try {
      const { data: apiData, error } = await useFetch('https://api.example.com/data').json();
      if (!error.value) {
        console.log('Fetched data:', apiData.value);
        data.value = apiData.value;
      } else {
        console.error('Failed to fetch data:', error.value);
        // Fallback to sample data if API fails
        data.value = sampleData;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to sample data if API fails
      data.value = sampleData;
    }
  }
});
</script>

<style scoped>
/* Additional custom styles if needed */
.bg-border {
  @apply bg-gray-200 dark:bg-gray-800;
}

.text-muted-foreground {
  @apply text-gray-500 dark:text-gray-400;
}
</style> 