<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>
        {{ label }}
      </Button>
    </DialogTrigger>
    <DialogContent class="h-full sm:max-w-[425px] sm:h-auto">
      <DialogHeader>
        <DialogTitle>{{ isValid ? 'Meter Details' : 'Verify Meter' }}</DialogTitle>
        <DialogDescription>
          {{ isValid ? 'Enter meter details' : 'Please enter your meter number to verify' }}
        </DialogDescription>
      </DialogHeader>
      
      <div v-if="!isValid" class="">
        <div class="flex flex-col gap-2">
          <Label for="meterNumber">Meter Number</Label>
          <Input 
            id="meterNumber"
            v-model="meterNumber" 
            class="col-span-3" 
            placeholder="Enter your meter number"
            :disabled="isLoading"
          />
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        </div>
      </div>
      
      <div v-else>
        <div class="flex flex-col gap-2">
          <Label for="name">Name</Label>
          <Input 
            id="name"
            v-model="name" 
            class="col-span-3" 
            placeholder="Enter name"
          />
          <!-- You can add more fields for the meter details here -->
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          @click="isValid ? saveDetails() : validateMeterNumber()" 
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="mr-2">
            <!-- You can add a loading spinner here -->
            Loading...
          </span>
          {{ isValid ? 'Save' : 'Verify' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
// Import your components and utilities
import { ref } from 'vue'

export default {
  props: {
    label: {
      type: String,
      default: "Add Meter"
    }
  },
  data() {
    return {
      isLoading: false,
      isValid: false,
      meterNumber: null,
      name: '',
      error: null,
      meterDetails: null
    }
  },
  methods: {
    async validateMeterNumber() {
      if (!this.meterNumber) {
        this.error = 'Please enter a meter number';
        return;
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        // Make sure WALLET_API_URL and useWalletAuthFetch are properly defined or imported
        const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/valid`, {
          params: {
            meterNumber: this.meterNumber
          }
        });
        
        if (response.status) {
          this.isValid = true;
          this.meterDetails = response.data; // Store the meter details if returned
          
          // Pre-fill the name if it's included in the response
          if (response.data && response.data.name) {
            this.name = response.data.name;
          }
        } else {
          this.error = response.message || 'Invalid meter number';
        }
      } catch (error) {
        console.error('Error validating meter:', error);
        this.error = 'Failed to validate meter number. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    
    async saveDetails() {
      this.isLoading = true;
      
      try {
        // Add code to save the meter details
        const saveResponse = await useWalletAuthFetch(`${WALLET_API_URL}/meter/save`, {
          method: 'POST',
          body: {
            meterNumber: this.meterNumber,
            name: this.name,
            // Add other fields as needed
          }
        });
        
        if (saveResponse.status) {
          // Emit an event to notify the parent component
          this.$emit('meter-added', {
            meterNumber: this.meterNumber,
            name: this.name
          });
          
          // Close the dialog or reset the form
          // You might need to implement a way to close the dialog
        } else {
          this.error = saveResponse.message || 'Failed to save meter details';
        }
      } catch (error) {
        console.error('Error saving meter details:', error);
        this.error = 'Failed to save meter details. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>