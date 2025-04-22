<template>
    <div class="flex flex-col p-4 gap-4 overflow-hidden">
        <!-- Filter buttons in a scrollable container on mobile -->
        <div class="flex justify-between flex-wrap gap-2">
            <WalletUtilitySelector v-model="filterOptions" @update="console.log"/>
            <WalletDateRangeSelector @update="console.log"/>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3">
            <WalletCardBalance :addMoney="true"/>
            
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
        <Card class="bg-white border shadow-sm w-full">              
              <CardContent class="p-0">
                <div>
                    <div v-if="isLoading" class="py-8 flex justify-center">
                        <MyLoader />
                    </div>
                    <div v-else class="py-8 text-center text-gray-500">
                        No transactions found
                    </div>
                  </div>
              </CardContent>
          </Card>
        <BarGraph />
    </div>
</template>
<script>
import BarGraph from '~/components/wallet/BarGraph.vue';
definePageMeta({
    layout: 'wallet'
})
export default {
  data() {
    return {
      walletBalance: null,
      isLoading: true,
      isLoadingTransactions: true,
      statsData: {
        dashboard: null,
        outbox: null,
        favorites: null,
        monthlyTotal: null
      },
      chartData: [],
      labels: [
        { name: null, value: null },
        { name: null, value: null },
        { name: null, value: null }
      ],
      transactions: [],
      filterOptions: [
        { key : "all", value: "All Transactions"},
        { key : "elect", value: "Electricity"},
        { key : "water", value: "Water"},
        { key : "payments", value: "Payments"},
      ]
    }
  },
  computed: {
    currentMonthYear() {
      const date = new Date();
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
  },
  methods: {
    setDateRange(range) {
      this.dateRange = range;
    },
    async fetchDashboardData() {
      this.isLoading = true;
      try {
        // API calls will be implemented later
        await Promise.all([
            new Promise(resolve => setTimeout(resolve, 3000))
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        this.isLoading = false;
      }
      
    },
  },
  mounted() {
    this.fetchDashboardData();
  },
  components: {
    BarGraph,
  }
}
</script> 