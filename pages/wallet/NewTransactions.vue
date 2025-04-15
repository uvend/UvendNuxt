<template>
  <div class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">Uvend Meter Fund</h1>
    
    <!-- Meter Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Meter</label>
      <select 
        v-model="selectedMeter" 
        class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option disabled value="">Please select a meter</option>
        <option v-for="meter in meters" :key="meter.id" :value="meter">
          {{ meter.name }} - {{ meter.meterNumber }}
        </option>
      </select>
    </div>
    
    <!-- Amount Input -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R</span>
        <input 
          v-model.number="amount" 
          type="number" 
          min="0" 
          step="1" 
          placeholder="0.00" 
          class="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <p v-if="amountError" class="mt-1 text-sm text-red-600">{{ amountError }}</p>
    </div>
    
    <!-- Meter Details (if selected) -->
    <div v-if="selectedMeter" class="mb-6 p-4 bg-gray-50 rounded-md">
      <h3 class="font-medium text-gray-800">Meter Details</h3>
      <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
        <div class="text-gray-600">Name:</div>
        <div>{{ selectedMeter.name }}</div>
        <div class="text-gray-600">Meter Number:</div>
        <div>{{ selectedMeter.meterNumber }}</div>
        <div class="text-gray-600">Status:</div>
        <div class="text-green-600">Active</div>
      </div>
    </div>
    
    <!-- Fund Button -->
    <button 
      @click="processTransaction" 
      :disabled="!isFormValid || isLoading" 
      class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md transition-colors flex items-center justify-center"
    >
      <span v-if="isLoading" class="mr-2">
        <!-- Loading spinner -->
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
      {{ isLoading ? 'Processing...' : 'Fund Meter' }}
    </button>
    
    <!-- Transaction Result Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black opacity-50" @click="showModal = false"></div>
      
      <!-- Modal Content -->
      <div class="bg-white rounded-lg shadow-xl p-6 z-10 max-w-md w-full mx-4">
        <div class="text-center">
          <!-- Success Icon -->
          <div v-if="transactionSuccess" class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <!-- Error Icon -->
          <div v-else class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg class="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          <h3 class="text-xl font-medium mb-2">
            {{ transactionSuccess ? 'Transaction Successful' : 'Transaction Failed' }}
          </h3>
          
          <p class="text-gray-600 mb-4">
            {{ transactionMessage }}
          </p>
          
          <div v-if="transactionSuccess" class="mb-4 p-3 bg-gray-50 rounded text-left">
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Amount:</span>
              <span class="font-medium">R{{ amount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Meter:</span>
              <span class="font-medium">{{ selectedMeter.meterNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Transaction ID:</span>
              <span class="font-medium">{{ transactionId }}</span>
            </div>
          </div>
          
          <div class="flex space-x-3">
            <button @click="closeModal" class="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">
              Close
            </button>
            <button v-if="transactionSuccess" @click="startNewTransaction" class="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              New Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
    layout: 'wallet'
})
export default {
  components: {
    WalletBalance: () => import('/components/wallet/WalletBalance.vue') // Import the WalletBalance component
  },
  data() {
    return {
      // Form data
      selectedMeter: null,
      amount: '',
      amountError: '',
      isLoading: false,
      
      // Modal data
      showModal: false,
      transactionSuccess: false,
      transactionMessage: '',
      transactionId: '',
      
      // Mock data (replace with actual API data)
      meters: [
        { id: 1, name: 'Home Meter', meterNumber: '12345678901' },
        { id: 2, name: 'Office Meter', meterNumber: '98765432109' },
        { id: 3, name: 'Shop Meter', meterNumber: '45678901234' }
      ],
      walletBalance: 5000 // Mock wallet balance (replace with actual component data)
    }
  },
  computed: {
    isFormValid() {
      return this.selectedMeter && this.amount > 0 && !this.amountError;
    }
  },
  methods: {
    async processTransaction() {
      // Validate amount
      if (!this.validateAmount()) return;
      
      this.isLoading = true;
      
      try {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get actual wallet balance from WalletBalance component
        // const walletBalance = this.$refs.walletBalance.balance;
        const walletBalance = this.walletBalance; // Using mock data for now
        
        // Check if balance is sufficient
        if (walletBalance >= this.amount) {
          // Success case
          this.transactionSuccess = true;
          this.transactionMessage = `Your meter funding of ₦${this.amount.toFixed(2)} was successful.`;
          this.transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
        } else {
          // Insufficient funds case
          this.transactionSuccess = false;
          this.transactionMessage = `Transaction failed due to insufficient wallet balance. Please fund your wallet and try again.`;
        }
      } catch (error) {
        // Error case
        console.error('Transaction error:', error);
        this.transactionSuccess = false;
        this.transactionMessage = 'An error occurred while processing your transaction. Please try again later.';
      } finally {
        this.isLoading = false;
        this.showModal = true;
      }
    },
    
    validateAmount() {
      this.amountError = '';
      
      if (!this.amount) {
        this.amountError = 'Please enter an amount';
        return false;
      }
      
      if (this.amount <= 0) {
        this.amountError = 'Amount must be greater than zero';
        return false;
      }
      
      return true;
    },
    
    closeModal() {
      this.showModal = false;
    },
    
    startNewTransaction() {
      this.selectedMeter = null;
      this.amount = '';
      this.showModal = false;
    }
  },
  mounted() {
    // You might want to fetch meters from an API here
    // this.fetchMeters();
    
    // If you need to get the wallet balance from an API or store
    // this.fetchWalletBalance();
  }
}
</script>