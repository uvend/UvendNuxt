


<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Utility Meters</h1>
        <p class="text-muted-foreground">Manage and monitor your utility meters</p>
      </div>
      <div class="flex items-center space-x-4">
        <Button variant="outline" @click="refreshAllMeters">
          <RefreshCwIcon class="w-4 h-4 mr-2" />
          Refresh All
        </Button>
        <Button @click="showAddMeter = true">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Meter
        </Button>
      </div>
    </div>

    <!-- Meter Status -->
    <MeterStatus />

    
  </div>
    
  <WalletMeterCard v-if="meters" v-for="meter in meters" :key="meter.id" :meter="meter" />


 


    <Card v-else class="py-8 text-center text-gray-500">
        No transactions found
    </Card> 
    <!-- Meter Readings Chart -->
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Meter Readings</CardTitle>
        <CardDescription>Historical consumption data</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoadingReadings" class="flex justify-center py-4">
          <Loader2Icon class="h-6 w-6 animate-spin" />
        </div>
        <div v-else-if="readingsError" class="text-center py-4 text-red-500">
          {{ readingsError }}
        </div>
        <div v-else>
          <!-- Add your chart component here -->
          <div class="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart will be displayed here
          </div>
        </div>
      </CardContent>
    </Card>
    <div v-else>
      <Card v-if="meters" v-for="meter in meters" class="p-2 my-3">
          {{ meter }}
      </Card>
      <Card v-else class="py-8 text-center text-gray-500">
          No transactions found
      </Card>
    </div>
</div>    
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