<template>
    <!-- Main content -->
    <div class="flex flex-col p-4 gap-4">
        <div class="flex justify-between">
            <div></div>
            <WalletDateRangeSelector @update="console.log"/>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3">
            <Card class="p-4 bg-white border shadow-sm">
                <WalletBalance />
          </Card>
            
            <Card class="p-4 bg-white border shadow-sm">
                <div class="flex flex-col">
                    <p class="text-gray-600 text-sm">Total</p>
                    <p class="text-2xl font-bold">0.00</p>
                    <div class="flex items-center text-sm mt-1" :class=" 0 ? 'text-red-500' : 'text-green-500'">
                        <Icon :name=" 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
                        <span>% vs previous</span>
                    </div>
            </div>
            </Card>
            
            <Card class="p-4 bg-white border shadow-sm">
                <div class="flex flex-col">
                    <p class="text-gray-600 text-sm">Transactions</p>
                    <p class="text-2xl font-bold">0</p>
                    <div class="flex items-center text-sm mt-1" :class=" 0 ? 'text-red-500' : 'text-green-500'">
                        <Icon :name=" 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
                        <span>% vs previous</span>
            </div>
          </div>
        </Card>
      </div>
        <Card class="bg-white border shadow-sm overflow-x-auto">
          <CardContent class="p-0">
                <div v-if="isLoading" class="py-8 flex justify-center">
                    <MyLoader />
            </div>
            <div v-else-if="fundingHistory.length === 0" class="py-8 text-center text-gray-500">
                    No payments found
                    </div>
          </CardContent>
        </Card>
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
      historyFilter: 'all',
      fundingHistory: []
    }
  },
  methods: {
    async fetchData() {
        this.isLoading = true;
      try {
        // API call will be implemented later
        // Simulate API delay
          await Promise.all([
            new Promise(resolve => setTimeout(resolve, 3000))
        ]);
          
          // Reset when API integrations are ready
          this.meters = []; // Will be populated by API in the future
        
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
    
  },
  mounted() {
    this.fetchData()
  },
  watch: {

  }
}
</script>