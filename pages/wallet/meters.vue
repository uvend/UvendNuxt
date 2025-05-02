<template>
<div class="flex flex-col p-4 gap-4 w-full">
    <div class="flex flex-col gap-4">
      <div class="flex justify-between flex-wrap gap-2 items-center">
        <WalletUtilitySelector v-model="selectedUtility" :options="filterOptions" v-if="!selectedMeter"/>
        <DateRangeSelector v-model="selectedDateRange" v-if="!selectedMeter" class="ml-2"/>
        <div v-else></div>
        <WalletPopup buttonLabel="Add Meter" v-if="!selectedMeter">
          <WalletAddMeter @success="fetchMeters()"/>
        </WalletPopup>
      </div>
    </div>
    <div v-if="selectedMeter">
      <WalletSelectedMeter ref="selectedMeter" :meter="selectedMeter" @deselect="selectedMeter = null"/>
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
            No transactions found
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
    name: 'meters',
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
        selectedUtility: 'all',
        selectedDateRange: '30days',
        selectedMeter: null
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
          const params = {};
          if (this.selectedUtility && this.selectedUtility !== 'all') params.utilityType = this.selectedUtility;
          if (this.selectedDateRange && this.selectedDateRange !== 'all') params.dateRange = this.selectedDateRange;
          const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter`, { params });
          this.meters = response.meters;
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
      handleTokenPurchase() {
        if (this.$refs.selectedMeter) {
          this.$refs.selectedMeter.fetchTokenHistory();
        }
        this.fetchMeters();
      }
    },
    mounted() {
      this.fetchMeters()
    },
    watch: {
      selectedUtility() { this.fetchMeters(); },
      selectedDateRange() { this.fetchMeters(); }
    }
  }
  </script>