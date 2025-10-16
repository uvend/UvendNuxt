<template>
<div class="flex flex-col p-4 gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
    <!-- Header Section -->
    <div class="space-y-4">
      <!-- Simple Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Icon name="lucide:home" class="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">My Meters</h1>
            <p class="text-sm text-gray-600">
              {{ selectedServiceType ? `${selectedServiceType} meters` : 'Manage your utility meters' }}
            </p>
          </div>
        </div>
        
        <!-- Service Type Badge -->
        <div v-if="selectedServiceType" class="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-xl">
          <Icon :name="getServiceIcon(selectedServiceType)" class="w-4 h-4 text-blue-600"/>
          <span class="text-sm font-semibold text-blue-700 capitalize">{{ selectedServiceType }}</span>
        </div>
      </div>

      <!-- Controls Section -->
      <div v-if="!selectedMeter" class="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-2xl p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">
              {{ selectedServiceType ? `${selectedServiceType.charAt(0).toUpperCase() + selectedServiceType.slice(1)} Meters` : 'All Meters' }}
            </h2>
            <p class="text-sm text-gray-600">
              {{ filteredMeters ? filteredMeters.length : 0 }} meter{{ (filteredMeters ? filteredMeters.length : 0) !== 1 ? 's' : '' }} found
            </p>
          </div>
          
          <!-- Add Meter Button -->
          <WalletPopup buttonLabel="Add Meter">
            <WalletAddMeter @success="fetchMeters()"/>
          </WalletPopup>
        </div>
        
        <!-- Service Type Filter Display -->
        <div v-if="selectedServiceType" class="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon :name="getServiceIcon(selectedServiceType)" class="w-3 h-3 text-blue-600"/>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-700">
                Showing {{ selectedServiceType }} meters only
              </p>
              <p class="text-xs text-gray-600">Filtered by service type from navigation</p>
            </div>
            <Button 
              @click="clearServiceFilter" 
              variant="ghost" 
              size="sm"
              class="text-gray-500 hover:text-gray-700"
            >
              <Icon name="lucide:x" class="w-4 h-4"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <!-- Selected Meter View -->
    <div v-if="selectedMeter" class="space-y-6">
      <WalletSelectedMeter :meter="selectedMeter" @deselect="selectedMeter = null"/>
      
      <!-- Transaction History Section -->
      <div class="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
          <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Icon name="lucide:bar-chart-3" class="w-5 h-5 text-white"/>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Transaction History</h3>
                <p class="text-sm text-white/90">Daily vending amounts for {{ selectedMeter.name }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="h-[400px]">
            <MyBarChart 
              :data="graphTransactions" 
              index="date" 
              :categories="['amount']"
            />
          </div>
        </div>
      </div>
      
      <!-- Transaction List -->
      <div class="space-y-4">
        <WalletCardTransaction 
          v-if="meterTransactions.length > 0" 
          v-for="payment in meterTransactions" 
          :data="payment" 
        />
      </div>
    </div>

    <!-- Meters List View -->
    <div v-else class="space-y-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
        <div class="p-12 flex flex-col items-center justify-center">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="lucide:loader-2" class="w-8 h-8 text-blue-600 animate-spin"/>
          </div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Loading Meters</h3>
          <p class="text-sm text-gray-500">Fetching your utility meters...</p>
        </div>
      </div>
      
      <!-- Meters List -->
      <div v-else-if="filteredMeters && filteredMeters.length > 0" class="space-y-4">
        <div 
          v-for="meter in filteredMeters" 
          :key="meter.meterNumber"
          class="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
        >
          <div class="p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <!-- Meter Info -->
              <div class="flex items-center gap-4">
                <!-- Service Icon -->
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                     :class="getServiceIconBg(meter.utilityType || 'all')">
                  <Icon :name="getServiceIcon(meter.utilityType || 'all')" 
                        :class="getServiceIconColor(meter.utilityType || 'all')"
                        class="w-5 h-5 sm:w-6 sm:h-6"/>
                </div>
                
                <!-- Meter Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                    <h3 class="text-base sm:text-lg font-bold text-gray-900 truncate">{{ meter.name }}</h3>
                    <!-- <div class="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg w-fit">
                      <div class="w-2 h-2 rounded-full bg-green-500"></div>
                      <span class="text-xs font-medium text-green-700">Active</span>
                    </div> -->
                  </div>
                  <p class="text-sm font-medium text-gray-600 mb-1">{{ meter.meterNumber }}</p>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500">Service Type:</span>
                    <span class="text-xs font-semibold text-gray-700 capitalize">{{ meter.utilityType || 'General' }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <Button 
                  @click="selectedMeter = meter"
                  variant="outline" 
                  size="sm"
                  class="px-3 py-2 text-xs sm:text-sm border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
                >
                  <Icon name="lucide:eye" class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"/>
                  <span class="hidden sm:inline">View Details</span>
                  <span class="sm:hidden">View</span>
                </Button>
                
                <Button 
                  @click="purchaseTokens(meter)"
                  size="sm"
                  class="px-3 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Icon name="lucide:credit-card" class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"/>
                  <span class="hidden sm:inline">Purchase Token</span>
                  <span class="sm:hidden">Buy</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
        <div class="p-12 text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:home" class="w-8 h-8 text-gray-400"/>
          </div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">No Meters Found</h3>
          <p class="text-sm text-gray-500 mb-6">
            {{ selectedServiceType ? `No ${selectedServiceType} meters found.` : 'You don\'t have any meters set up yet.' }}
          </p>
          <WalletPopup buttonLabel="Add Your First Meter">
            <WalletAddMeter @success="fetchMeters()"/>
          </WalletPopup>
        </div>
      </div>
    </div>
    
</div>    
</template>
<script>
 definePageMeta({
    layout: 'wallet'
})
  export default {
    data() {
      return {
        isLoading: true,
        meters: null,
        searchQuery: '',
        walletBalance: null,
        selectedMeter: null,
        meterTransactions: [],
        graphTransactions: [],
        meterInfo: null,
        selectedServiceType: null
      }
    },
    computed: {
      filteredMeters() {
        if (!this.meters) return [];
        
        if (this.selectedServiceType) {
          return this.meters.filter(meter => 
            meter.utilityType && meter.utilityType.toLowerCase() === this.selectedServiceType.toLowerCase()
          );
        }
        
        return this.meters;
      }
    },
    methods: {
      getServiceIcon(serviceType) {
        const iconMap = {
          'electricity': 'lucide:zap',
          'elect': 'lucide:zap',
          'water': 'lucide:droplet',
          'all': 'lucide:grid-3x3',
          'gas': 'lucide:flame',
          'internet': 'lucide:wifi',
          'mobile': 'lucide:smartphone'
        };
        return iconMap[serviceType?.toLowerCase()] || 'lucide:home';
      },
      getServiceIconBg(serviceType) {
        const bgMap = {
          'electricity': 'bg-gradient-to-br from-orange-100 to-orange-200',
          'elect': 'bg-gradient-to-br from-orange-100 to-orange-200',
          'water': 'bg-gradient-to-br from-blue-100 to-blue-200',
          'all': 'bg-gradient-to-br from-gray-100 to-gray-200',
          'gas': 'bg-gradient-to-br from-red-100 to-red-200',
          'internet': 'bg-gradient-to-br from-purple-100 to-purple-200',
          'mobile': 'bg-gradient-to-br from-green-100 to-green-200'
        };
        return bgMap[serviceType?.toLowerCase()] || 'bg-gradient-to-br from-gray-100 to-gray-200';
      },
      getServiceIconColor(serviceType) {
        const colorMap = {
          'electricity': 'text-orange-600',
          'elect': 'text-orange-600',
          'water': 'text-blue-600',
          'all': 'text-gray-600',
          'gas': 'text-red-600',
          'internet': 'text-purple-600',
          'mobile': 'text-green-600'
        };
        return colorMap[serviceType?.toLowerCase()] || 'text-gray-600';
      },
      purchaseTokens(meter) {
        // Navigate to buy now page with selected meter
        this.$store.selectedMeter = meter;
        this.$router.push('/wallet/payments');
      },
      clearServiceFilter() {
        this.selectedServiceType = null;
        this.$router.replace({ path: '/meters' });
      },
      async fetchMeters() {
        this.isLoading = true;
        try {
          const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter`)
          //console.log(response)
          
          // Reset when API integrations are ready
          this.meters = response.meters; // Will be populated by API in the future
          
        } catch (error) {
          console.error('Error fetching meters:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to load meters',
            variant: 'destructive'
          });
        } finally {
          this.isLoading = false;
        }
      },
      async getMeterTransactions(){
        this.graphTransactions = []
        const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/history`,{
          params: {
            meterNumber: this.selectedMeter.meterNumber
          }
        })
        
        // Group transactions by date and count transactions per date
        const transactionsByDate = new Map()
        response.transactions.forEach(transaction => {
          const date = transaction.created.split('T')[0]
          const amount = parseFloat(transaction.amount)
          
          if (transactionsByDate.has(date)) {
            const existing = transactionsByDate.get(date)
            existing.amount += amount
            existing.transactionCount++
          } else {
            transactionsByDate.set(date, {
              date: date,
              amount: amount,
              transactionCount: 1
            })
          }
        })

        // Convert to array and sort by date
        this.graphTransactions = Array.from(transactionsByDate.values())
          .sort((a, b) => new Date(a.date) - new Date(b.date))

        this.meterTransactions = response.transactions.reverse()
      },
      async getMeterInfo(){
        const meterNumber = this.selectedMeter.meterNumber;
        const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/${meterNumber}/info`)
        console.log(response)
        this.meterInfo = response;
      }
    },
    watch:{
      selectedMeter(newValue){
        if(newValue){
          this.getMeterInfo();
          this.getMeterTransactions();
        }else{
          this.meterTransactions = []
          this.meterInfo = null
        }

      }
    },
    mounted() {
      // Check for service type in URL query parameters
      const serviceQuery = this.$route.query.service;
      if (serviceQuery) {
        this.selectedServiceType = serviceQuery;
      }
      
      this.fetchMeters();
    }
  }
  </script>