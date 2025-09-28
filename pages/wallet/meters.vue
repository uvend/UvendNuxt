<template>
<div class="flex flex-col p-4 gap-4 w-full">
    <div class="flex flex-col gap-4">
      <div class="flex justify-between flex-wrap gap-2 items-center">
        <WalletUtilitySelector v-model="filterOptions" v-if="!selectedMeter"/>
        <div v-else></div>
        <WalletPopup buttonLabel="Add Meter" v-if="!selectedMeter">
          <WalletAddMeter @success="fetchMeters()"/>
        </WalletPopup>
      </div>
    </div>
    <div v-if="selectedMeter">
      <WalletSelectedMeter :meter="selectedMeter" @deselect="selectedMeter = null"/>
      <div>
      </div>
      <div class="flex flex-col gap-2">
        <!-- Debug SmartData -->
      
        
        <SmartData :waterData="waterData" :isloading="isWaterDataLoading" v-if="waterData" />
        <Card class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 p-4">
          <CardHeader>
            <CardTitle class="text-xl font-black">Transaction History</CardTitle>
            <CardDescription class="text-base font-semibold">Daily vending amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="h-[400px]">
              <MyBarChart 
                :data="graphTransactions" 
                index="date" 
                :categories="['amount']"
              />
            </div>
          </CardContent>
        </Card>
        <WalletCardTransaction 
          v-if="meterTransactions.length > 0" 
          v-for="payment in meterTransactions" 
          :data="payment" 
        />
      </div>
    </div>
    <div v-else>
      <Card v-if="isLoading" class="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg w-full">              
        <CardContent class="p-0">
              <div  class="py-8 flex justify-center">
                  <MyLoader />
              </div>
        </CardContent>
      </Card>
      <div v-else>
      <div v-if="meters" v-for="meter in meters">
        <WalletCardMeter :meter="meter" @click="selectedMeter = meter"/>
      </div>
        <Card v-else class="py-8 text-center text-gray-500 text-base font-semibold bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg">
            No meters found
        </Card>
      </div>
    </div>
    
</div>    
</template>
<script>
import SmartData from '~/components/wallet/SmartData.vue'

definePageMeta({
    layout: 'wallet'
})
  export default {
    components: {
      SmartData
    },
    data() {
      return {
        isLoading: true,
        meters: null,
        searchQuery: '',
        walletBalance: null,
        filterOptions: [
            { key : "all", value: "All Transactions"},
            { key : "elect", value: "Electricity"},
            { key : "water", value: "Water"},
            { key : "favorites", value: "Favorites"},

        ],
        selectedFilterOption: null,
        selectedMeter: null,
        meterTransactions: [],
        graphTransactions: [],
        meterInfo: null,
        waterData: null,
        isWaterDataLoading: false
      }
    },
    created() {
      this.selectedFilterOption = this.filterOptions[0];
    },
    computed: {
    },
    methods: {
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
        this.isWaterDataLoading = true;
        //Current Time in milliseconds
        const endTime = Date.now()

        //24 hours ago
        const startTime = endTime - (24*60*60*1000);
        try {
          const meterNumber = this.selectedMeter.meterNumber;
          const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/${meterNumber}/info`,{
            params:{
                startTime:startTime,
                endTime:endTime,
                page:0,
                size:10,
            }
          })
          console.log('Meter info response:', response)
          this.meterInfo = response;
          
          // Handle waterData - check if it exists and is an array
          if (response.waterData && Array.isArray(response.waterData) && response.waterData.length > 0) {
            this.waterData = response.waterData[0];
            console.log('Water data loaded:', this.waterData);
          } else {
            console.log('No water data available');
            this.waterData = null;
          }
        } catch (error) {
          console.error('Error fetching meter info:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to load meter information',
            variant: 'destructive'
          });
          this.waterData = null;
        } finally {
          this.isWaterDataLoading = false;
        }
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
          this.waterData = null
          this.isWaterDataLoading = false
        }

      }
    },
    mounted() {
      this.fetchMeters()
    }
  }
  </script>