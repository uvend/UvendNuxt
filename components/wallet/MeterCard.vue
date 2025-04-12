<template>
    <Card class="p-4">
      <div class="flex flex-col space-y-3">
        <!-- Header with name and status -->
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ meter.name }}</h3>
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
            :class="meter.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          >
            {{ meter.active ? 'Active' : 'Inactive' }}
          </span>
        </div>
        
        <!-- Meter details -->
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="text-gray-500">Meter Number:</div>
          <div class="font-medium">{{ meter.meterNumber }}</div>
          
          <div class="text-gray-500">ID:</div>
          <div class="font-medium">{{ meter.id }}</div>
          
          <div class="text-gray-500">Created:</div>
          <div class="font-medium">{{ formatDate(meter.created) }}</div>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-between items-center pt-2">
          <button class="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <svg 
              class="h-5 w-5 mr-1" 
              :class="meter.favourite ? 'text-yellow-400' : 'text-gray-400'" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {{ meter.favourite ? 'Favorited' : 'Add to favorites' }}
          </button>
          
          <button class="text-sm font-medium text-blue-600 hover:text-blue-800">
            View Details
          </button>
        </div>
      </div>
    </Card>
  </template>
  
  <script>
  import Card from '../ui/card/Card.vue';
  
  export default {
    name: 'MeterCard',
    components: {
      Card
    },
    props: {
      meter: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        });
      }
    }
  }
  </script>