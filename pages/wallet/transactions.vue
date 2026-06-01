<template>
<div class="flex flex-col p-4 gap-4">
    <div class="flex justify-between">
        <div></div>
        <WalletDateRangeSelector @update=""/>
     </div>
    <!-- Transactions Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card class="p-4 bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex flex-col">
            <p class="text-gray-600 text-base font-semibold">Total Spent</p>
            <Skeleton class="w-16 h-9" v-if="isLoading"/>
            <p class="text-4xl font-black" v-else>{{ summary.totalSpent }}</p>
            <p class="text-base font-semibold text-gray-500" v-if="$store.dateRange">{{ $store.dateRange }}</p>
        </div>
        </Card>
        
        <Card class="p-4 bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex flex-col">
            <p class="text-gray-600 text-base font-semibold">Electricity</p>
            <Skeleton class="w-16 h-9" v-if="isLoading"/>
            <p class="text-4xl font-black" v-else>{{electricity}}</p>
            <!-- <div class="flex items-center text-sm mt-1" :class="0 ? 'text-red-500' : 'text-green-500'">
            <Icon :name="0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
            <span>% vs previous</span> 
            </div> -->
        </div>
        </Card>
        
        <Card class="p-4 bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex flex-col">
            <p class="text-gray-600 text-base font-semibold">Water</p>
            <Skeleton class="w-16 h-9" v-if="isLoading"/>
            <p class="text-4xl font-black" v-else>{{water}}</p>
            <!-- <div class="flex items-center text-sm mt-1" :class=" 0 ? 'text-red-500' : 'text-green-500'">
            <Icon :name="0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
            <span>% vs previous</span>
            </div> -->
        </div>
        </Card>
        
        <Card class="p-4 bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex flex-col">
            <p class="text-gray-600 text-base font-semibold">Transaction History</p>
            <Skeleton class="w-16 h-9" v-if="isLoading"/>
            <p class="text-4xl font-black" v-else>{{summary.transactionCount}}</p>
            <p class="text-base font-semibold text-gray-500"></p>
        </div>
        </Card>
    </div>
    <!-- Filters and Period Selector -->
    <div class="flex flex-col gap-4 w-full sm:w-auto ">
        <!-- Filter buttons in a scrollable container -->
        <WalletUtilitySelector v-model="filterOptions" @update="console.log"/>
    </div>
    <Card v-if="isLoading" class="py-8 flex justify-center bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg">
        <MyLoader />
    </Card>
    <div v-else class="flex flex-col gap-2">
      <WalletCardTransaction v-if="transactions.length > 0" v-for="payment in transactions" :data="payment"/>
        <Card v-else class="py-8 text-center text-gray-500 text-base font-semibold bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg">
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
        activeFilter: null,
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
            { key : null, value: "All Transactions"},
            { key : "Electricity", value: "Electricity"},
            { key : "Water", value: "Water"},
        ],
        startDate: null,
        endDate: null
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
          const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/history`,{
            params: {
              startDate: this.startDate,
              endDate: this.endDate,
              utilityType: this.activeFilter
            }
          })
          this.transactions = response.transactions.reverse();
          this.summary.totalSpent = Number(response.totalAmount).toFixed(2)
          this.summary.transactionCount = response.totalCount
         
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
      formatDate(rawDate){
        return rawDate.toISOString().split('T')[0];
      },
      setDateRange(newValue){
        const startDate = new Date();
        const endDate = new Date();
        if(newValue == '7days'){
          startDate.setDate(endDate.getDate() - 7);
        }
        if(newValue == '30days'){
          startDate.setDate(endDate.getDate() - 30);
        }
        if(newValue == '6months'){
          startDate.setDate(endDate.getDate() - 182);
        }
        if(newValue == '12months'){
          startDate.setDate(endDate.getDate() - 265);
        }
        this.startDate = this.formatDate(startDate);
        endDate.setDate(endDate.getDate() + 1);
        this.endDate = this.formatDate(endDate);
      }
    },
    async mounted() {
      this.setDateRange('7days');
      await this.fetchTransactionsData();
    },
    watch: {
      '$store.dateRange'(newValue){
        this.setDateRange(newValue)
        this.fetchTransactionsData();
      },
      '$store.utilityType'(newValue){
        this.activeFilter = newValue;
        this.fetchTransactionsData();
      },
      searchQuery() {
        this.currentPage = 1;
      }
    },
    computed:{
      electricity(){
        let amount = 0
        if(this.transactions){
          this.transactions.forEach(transaction => {
            if(transaction.utilityType == 'Electricity'){
              amount += parseFloat(transaction.amount)
            }
          })
        }
        return amount.toFixed(2)
      },
      water(){
        let amount = 0
        if(this.transactions){
          this.transactions.forEach(transaction => {
            if(transaction.utilityType == 'Water'){
              amount += parseFloat(transaction.amount)
            }
          })
        }
        return amount.toFixed(2)
      }
    }
  }
  </script>
  