<template>
  
</template>
<script>
export default{
    data(){
        return{
            meters: [],
            isLoading: false,
            value: null
        }
    },
    methods:{
        async fetchMeters() {
        this.isLoading = true;
        try {
          const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter`)
          console.log(response)
          
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
      }
    },
    async mounted(){
        await this.fetchMeters()
    }
}
</script>
<style>
</style>