<template>
<div class="flex flex-col p-4 gap-4">
    <div class="flex justify-between">
        <div></div>
        <WalletDateRangeSelector @update="console.log"/>
     </div>
    <!-- Transactions Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card class="p-4 bg-white border shadow-sm">
        <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Total Spent</p>
            <p class="text-2xl font-bold">0.00</p>
            <p class="text-sm text-gray-500">{{ period === 'year' ? 'Past year' : `Last ${period.replace('days', ' days')}` }}</p>
        </div>
        </Card>
        
        <Card class="p-4 bg-white border shadow-sm">
        <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Electricity</p>
            <p class="text-2xl font-bold">0.00</p>
            <div class="flex items-center text-sm mt-1" :class="0 ? 'text-red-500' : 'text-green-500'">
            <Icon :name="0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
            <span>% vs previous</span>
            </div>
        </div>
        </Card>
        
        <Card class="p-4 bg-white border shadow-sm">
        <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Water</p>
            <p class="text-2xl font-bold">0.00</p>
            <div class="flex items-center text-sm mt-1" :class=" 0 ? 'text-red-500' : 'text-green-500'">
            <Icon :name="0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
            <span>% vs previous</span>
            </div>
        </div>
        </Card>
        
        <Card class="p-4 bg-white border shadow-sm">
        <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Transactions</p>
            <p class="text-2xl font-bold">0</p>
            <p class="text-sm text-gray-500"></p>
        </div>
        </Card>
    </div>
    <!-- Filters and Period Selector -->
    <div class="flex flex-col gap-4 w-full sm:w-auto ">
        <!-- Filter buttons in a scrollable container -->
        <WalletUtilitySelector v-model="filterOptions" @update="console.log"/>
    </div>
    <Card v-if="isLoading" class="py-8 flex justify-center">
        <MyLoader />
    </Card>
    <div v-else>
      <WalletCardPayment v-if="transactions.length > 0" v-for="payment in transactions" :data="payment"/>
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
        activeFilter: 'all',
        period: '30days',
        searchQuery: '',
        currentPage: 1,
        pageSize: 10,
        transactions: [],
        monthlyData: [],
        summary: {
          totalSpent: null,
          electricity: null,
          electricityTrend: null,
          water: null,
          waterTrend: null,
          transactionCount: null
        },
        showReceipt: false,
        selectedTransaction: null,
        filterOptions: [
            { key : "all", value: "All Transactions"},
            { key : "elect", value: "Electricity"},
            { key : "water", value: "Water"},
        ]
      }
    },
    computed: {
      filteredTransactions() {
        return [];
      },
    },
    methods: {
      async fetchTransactionsData() {
        this.isLoading = true;        
        try {
          const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/history`)
          this.transactions = response.transactions;
         
        } catch (error) {
          console.error('Error fetching transactions data:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to load transactions data',
            variant: 'destructive'
          });
        } finally {
          this.isLoading = false;
        }
      },
      
      getUtilityClass(type) {
        const classes = {
          'Electricity': 'bg-blue-500',
          'Water': 'bg-teal-500',
          'Funding': 'bg-purple-500',
          'Withdrawal': 'bg-gray-500'
        };
        
        return classes[type] || 'bg-gray-500';
      },
    },
    mounted() {
      this.fetchTransactionsData();
    },
    watch: {
      period() {
        this.fetchTransactionsData();
      },
      searchQuery() {
        this.currentPage = 1; // Reset to first page when search changes
      }
    }
  }
  </script>
  