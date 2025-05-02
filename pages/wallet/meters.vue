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
        <MyBarChart :data="graphTransactions" index="date" :categories="['amount']"/>
        <WalletCardTransaction v-if="meterTransactions.length > 0" v-for="payment in meterTransactions" :data="payment" />
      </div>
    </div>
    <div v-else>
      <Card v-if="isLoading" class="bg-white border shadow-sm w-full">              
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
        <Card v-else class="py-8 text-center text-gray-500">
            No meters found
        </Card>
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
        meterInfo: null
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
        response.transactions.forEach(transaction => {
          let element = {}
          element.amount = parseFloat(transaction.amount)
          element.date = transaction.created.split('T')[0]
          this.graphTransactions.push(element)
        });
        this.meterTransactions = response.transactions
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
      this.fetchMeters()
    }
  }
  </script>