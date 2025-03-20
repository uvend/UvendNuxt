<template>
    <div class="p-4">
      <input 
        v-model="searchQuery" 
        @input="searchMeters" 
        placeholder="Search by Address"
        class="p-2 border rounded mb-4 w-full"
      />
      <ul v-if="filteredMeters.length">
        <li v-for="meter in filteredMeters" :key="meter.id" class="p-2 border-b">
          {{ meter.address }} - {{ meter.meterNumber }}
        </li>
      </ul>
      <p v-else>No meters found</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useFetch } from '#app'
  
  const searchQuery = ref('')
  const filteredMeters = ref([])
  
  const searchMeters = async () => {
    const { data } = await useFetch(`/api/search?address=${searchQuery.value}`)
    filteredMeters.value = data.value || []
  }
  </script>
  
  <style scoped>
  ul {
    list-style: none;
    padding: 0;
  }
  </style>
  