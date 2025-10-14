<template>
  <div class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
    <CardHeader class="pb-4">
      <CardTitle class="text-lg font-semibold text-gray-800">Select Service</CardTitle>
      <CardDescription class="text-sm">Choose the service you want to purchase</CardDescription>
    </CardHeader>
    <CardContent class="p-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- Electricity Service -->
        <div 
          class="relative group cursor-pointer"
          @click="selectService('Electricity')"
        >
          <Card 
            class="h-24 w-full bg-gradient-to-br from-orange-50 to-orange-100 border-2 transition-all duration-300 hover:shadow-lg"
            :class="selectedService === 'Electricity' ? 'border-orange-400 shadow-lg scale-105' : 'border-orange-200 hover:border-orange-300'"
          >
            <CardContent class="h-full flex flex-col items-center justify-center p-3">
              <!-- Electricity Icon -->
              <div class="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-300 transition-colors duration-300">
                <Icon name="lucide:zap" class="w-4 h-4 text-orange-600" />
              </div>
              
              <!-- Service Name -->
              <h3 class="text-xs font-semibold text-gray-800 text-center">Electricity</h3>
              
              <!-- Selection indicator -->
              <div 
                v-if="selectedService === 'Electricity'"
                class="absolute top-1 right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"
              >
                <Icon name="lucide:check" class="w-3 h-3 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Water Service -->
        <div 
          class="relative group cursor-pointer"
          @click="selectService('Water')"
        >
          <Card 
            class="h-24 w-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 transition-all duration-300 hover:shadow-lg"
            :class="selectedService === 'Water' ? 'border-blue-400 shadow-lg scale-105' : 'border-blue-200 hover:border-blue-300'"
          >
            <CardContent class="h-full flex flex-col items-center justify-center p-3">
              <!-- Water Icon -->
              <div class="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-300 transition-colors duration-300">
                <Icon name="lucide:droplet" class="w-4 h-4 text-blue-600" />
              </div>
              
              <!-- Service Name -->
              <h3 class="text-xs font-semibold text-gray-800 text-center">Water</h3>
              
              <!-- Selection indicator -->
              <div 
                v-if="selectedService === 'Water'"
                class="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Icon name="lucide:check" class="w-3 h-3 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CardContent>
  </div>
</template>

<script>
export default {
  name: 'ServiceSelector',
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'service-selected'],
  data() {
    return {
      selectedService: this.modelValue
    }
  },
  watch: {
    modelValue(newValue) {
      this.selectedService = newValue
    }
  },
  methods: {
    selectService(service) {
      this.selectedService = service
      this.$emit('update:modelValue', service)
      this.$emit('service-selected', service)
    }
  }
}
</script>

<style scoped>
/* Custom hover effects */
.group:hover .group-hover\:bg-orange-300 {
  background-color: rgb(253 186 116);
}

.group:hover .group-hover\:bg-blue-300 {
  background-color: rgb(147 197 253);
}
</style>
