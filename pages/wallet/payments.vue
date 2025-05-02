<template>
    <!-- Main content -->
    <div class="flex flex-col p-4 gap-4">
        <div class="flex justify-between">
            <div></div>
            <!--<WalletDateRangeSelector @update="console.log"/>-->
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3">
            <WalletCardBalance :addMoney="true"/>
            <Card class="p-4 bg-white border shadow-sm">
                <div class="flex flex-col">
                    <p class="text-gray-600 text-sm">Total</p>
                    <Skeleton class="w-16 h-9" v-if="isLoading"/>
                    <p class="text-2xl font-bold" v-else>{{ total }}</p>
                    <!--<div class="flex items-center text-sm mt-1" :class=" 0 ? 'text-red-500' : 'text-green-500'">
                        <Icon :name=" 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
                        <span>% vs previous</span>
                    </div>-->
                </div>
            </Card>
            
            <Card class="p-4 bg-white border shadow-sm">
                <div class="flex flex-col">
                    <p class="text-gray-600 text-sm">Transactions</p>
                    <Skeleton class="w-16 h-9" v-if="isLoading"/>
                    <p class="text-2xl font-bold" v-else>{{ transactions }}</p>
                    <!--<div class="flex items-center text-sm mt-1" :class=" 0 ? 'text-red-500' : 'text-green-500'">
                        <Icon :name=" 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
                        <span>% vs previous</span>
                    </div>-->
                </div>
            </Card>
        </div>
            <Card v-if="isLoading" class="py-8 flex justify-center">
                <MyLoader />
            </Card>
            <div v-else class="flex flex-col gap-2">
              <WalletCardPayment v-if="fundingHistory.length > 0" v-for="payment in fundingHistory" :data="payment" />
              <Card v-else class="py-8 text-center text-gray-500">
                No payments found
            </Card>
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
      historyFilter: 'all',
      fundingHistory: [],
      total: null,
      transactions: null
    }
  },
  methods: {
    async fetchData() {
        this.isLoading = true;
        try {
          const response = await useWalletAuthFetch(`${WALLET_API_URL}/pay/history`)
          this.fundingHistory = response.payments;
          this.total = (response.totalAmount / 100).toFixed(2)
          this.transactions = response.totalCount
          
        } catch (error) {
          console.error('Error fetching payments:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to load payments',
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