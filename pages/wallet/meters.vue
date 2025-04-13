


<template>
  <WalletMeterHeader />
<div class="flex flex-col p-4 gap-4 w-full">
    <div class="flex flex-col gap-4">
      <div class="flex justify-between flex-wrap gap-2 items-center">
        <WalletUtilitySelector v-model="filterOptions" @update="console.log"/>
        <WalletPopupAddMeter label="Add New Meter"/>
      </div>
    </div>

    <!-- Meter Status -->
    <MeterStatus />

    
  </div>
    
  <WalletMeterCard v-if="meters" v-for="meter in meters" :key="meter.id" :meter="meter" />


 


    <Card v-else class="py-8 text-center text-gray-500">
        No transactions found
    </Card> 
</template>

<script>


import MeterCard from '@/components/wallet/MeterCard.vue';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
        selectedFilterOption: null
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
    },
    mounted() {
      this.fetchMeters()
    }
    
  }
  </script>