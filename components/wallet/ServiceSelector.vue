<template>
  <div class="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden group">
    <!-- Header with gradient background -->
    <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon name="lucide:layers" class="w-5 h-5 text-white"/>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Select Service</h3>
            <p class="text-sm text-white/90">Choose the utility service you need</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Options -->
    <div class="p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Electricity Service -->
        <div 
          class="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
          @click="selectService('Electricity')"
        >
          <div 
            class="relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300"
            :class="selectedService === 'Electricity' 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400 shadow-2xl' 
              : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300 hover:shadow-xl'"
          >
            <!-- Background pattern -->
            <div class="absolute inset-0 opacity-5">
              <div class="w-full h-full" style="background-image: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 1px, transparent 1px); background-size: 20px 20px;"></div>
            </div>
            
            <div class="relative z-10 flex flex-col items-center text-center">
              <!-- Icon Container -->
              <div 
                class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
                :class="selectedService === 'Electricity' 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'bg-gradient-to-br from-orange-200 to-orange-300 group-hover:from-orange-300 group-hover:to-orange-400'"
              >
                <Icon 
                  name="lucide:zap" 
                  class="w-8 h-8 transition-all duration-300"
                  :class="selectedService === 'Electricity' ? 'text-white' : 'text-orange-600'"
                />
              </div>
              
              <!-- Service Name -->
              <h4 
                class="text-lg font-bold mb-1 transition-colors duration-300"
                :class="selectedService === 'Electricity' ? 'text-white' : 'text-gray-800'"
              >
                Electricity
              </h4>
              
              <!-- Description -->
              <p 
                class="text-sm font-medium transition-colors duration-300"
                :class="selectedService === 'Electricity' ? 'text-white/90' : 'text-gray-600'"
              >
                Prepaid tokens
              </p>
              
              <!-- Selection indicator -->
              <div 
                v-if="selectedService === 'Electricity'"
                class="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Icon name="lucide:check" class="w-4 h-4 text-orange-600" />
              </div>
              
              <!-- Hover effect overlay -->
              <div class="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          </div>
        </div>

        <!-- Water Service -->
        <div 
          class="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
          @click="selectService('Water')"
        >
          <div 
            class="relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300"
            :class="selectedService === 'Water' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 shadow-2xl' 
              : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300 hover:shadow-xl'"
          >
            <!-- Background pattern -->
            <div class="absolute inset-0 opacity-5">
              <div class="w-full h-full" style="background-image: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 1px, transparent 1px); background-size: 20px 20px;"></div>
            </div>
            
            <div class="relative z-10 flex flex-col items-center text-center">
              <!-- Icon Container -->
              <div 
                class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
                :class="selectedService === 'Water' 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'bg-gradient-to-br from-blue-200 to-blue-300 group-hover:from-blue-300 group-hover:to-blue-400'"
              >
                <Icon 
                  name="lucide:droplet" 
                  class="w-8 h-8 transition-all duration-300"
                  :class="selectedService === 'Water' ? 'text-white' : 'text-blue-600'"
                />
              </div>
              
              <!-- Service Name -->
              <h4 
                class="text-lg font-bold mb-1 transition-colors duration-300"
                :class="selectedService === 'Water' ? 'text-white' : 'text-gray-800'"
              >
                Water
              </h4>
              
              <!-- Description -->
              <p 
                class="text-sm font-medium transition-colors duration-300"
                :class="selectedService === 'Water' ? 'text-white/90' : 'text-gray-600'"
              >
                Water credits
              </p>
              
              <!-- Selection indicator -->
              <div 
                v-if="selectedService === 'Water'"
                class="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Icon name="lucide:check" class="w-4 h-4 text-blue-600" />
              </div>
              
              <!-- Hover effect overlay -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Additional Info -->
      <div class="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="lucide:info" class="w-4 h-4 text-blue-600"/>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700">Instant Service</p>
            <p class="text-xs text-gray-600">Your tokens will be delivered immediately after payment</p>
          </div>
        </div>
      </div>
    </div>
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
      
      // Navigate to meters page with service type
      this.$router.push({
        path: '/meters',
        query: { service: service.toLowerCase() }
      })
    }
  }
}
</script>

