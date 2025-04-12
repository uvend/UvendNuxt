<template>
    <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto relative">
        <!-- Close Button -->
        <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">
          ✕
        </button>
  
        <!-- Scrollable content -->
        <div class="p-6 max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Purchase Utility Tokens</h2>
  
          <!-- Progress steps -->
          <div class="flex items-center mb-8">
            <div v-for="(step, index) in steps" :key="index" class="flex items-center">
              <div class="flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium"
                :class="currentStep >= index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'">
                {{ index + 1 }}
              </div>
              <div v-if="index < steps.length - 1" class="h-1 w-10 mx-2"
                :class="currentStep > index ? 'bg-blue-600' : 'bg-gray-200'"></div>
            </div>
          </div>
  
          <!-- Steps go here (unchanged from your code) -->
          <!-- ... Start of Dynamic Steps Section ... -->
          <!-- Insert full dynamic step code from original version here -->
          <!-- ... End of Dynamic Steps Section ... -->
  
          <!-- For brevity, skipping full step blocks but keep them identical from your current file -->
          <!-- Just make sure everything remains inside this scrollable <div class="p-6 ..."> -->
  
          <!-- Navigation buttons -->
          <div class="flex justify-between mt-8">
            <button v-if="currentStep > 0" @click="currentStep--"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Back
            </button>
            <div v-else></div>
  
            <button v-if="currentStep < steps.length - 1" @click="nextStep"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="!canProceed">
              Continue
            </button>
  
            <button v-else-if="!transactionComplete" @click="confirmPurchase"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Confirm Purchase
            </button>
  
            <button v-else @click="resetForm"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Purchase Another
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Card from '../ui/card/Card.vue'
  
  export default {
    name: 'NewTransactions',
    emits: ['close'],
    components: {
      Card
    },
    data() {
      return {
        steps: ['Select Meter', 'Select Utility', 'Enter Amount', 'Payment Method', 'Confirmation'],
        currentStep: 0,
        selectedMeter: null,
        selectedUtility: null,
        amount: 0,
        selectedWallet: null,
        transactionComplete: false,
        meters: [
          { id: 1, name: 'Home Meter', meterNumber: '14455895319', active: 1 },
          { id: 2, name: 'Office Meter', meterNumber: '14455895320', active: 1 },
          { id: 3, name: 'Vacation Property', meterNumber: '14455895321', active: 0 }
        ],
        wallets: [
          { id: 1, name: 'Main Wallet', balance: 250.75 },
          { id: 2, name: 'Savings', balance: 1000.0 }
        ]
      }
    },
    computed: {
      canProceed() {
        switch (this.currentStep) {
          case 0: return this.selectedMeter !== null
          case 1: return this.selectedUtility !== null
          case 2: return this.amount > 0
          case 3: return this.selectedWallet !== null
          default: return true
        }
      }
    },
    methods: {
      selectMeter(meter) {
        this.selectedMeter = meter
      },
      nextStep() {
        if (this.canProceed) this.currentStep++
      },
      formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)
      },
      confirmPurchase() {
        setTimeout(() => {
          this.transactionComplete = true
        }, 1000)
      },
      resetForm() {
        this.currentStep = 0
        this.selectedMeter = null
        this.selectedUtility = null
        this.amount = 0
        this.selectedWallet = null
        this.transactionComplete = false
      },
      generateMockToken() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let token = ''
        for (let i = 0; i < 16; i++) {
          if (i > 0 && i % 4 === 0) token += '-'
          token += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return token
      }
    }
  }
  </script>
  