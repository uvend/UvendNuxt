<template>
<div class="flex flex-col p-4 gap-4 w-full">
    <div class="flex flex-col gap-4">
      <div class="flex justify-between flex-wrap gap-2 items-center">
        <WalletUtilitySelector v-model="filterOptions" @update="console.log"/>
        <Button @click="" class="w-full sm:w-auto">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Add New Meter
        </Button>
      </div>
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
        meters: [],
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
      this.fetchMeters()
    }
  }
  </script>