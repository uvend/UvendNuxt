<template>
  <div class="container mx-auto py-4 px-4 sm:px-6 sm:py-8 max-w-3xl">
    <Card class="p-4 sm:p-6">
      <CardHeader>
        <CardTitle class="text-xl sm:text-2xl font-bold">Register Wallet</CardTitle>
        <CardDescription>Enter your details to register a new wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="saveWallet">
          <!-- Personal Information Section -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-3">Personal Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="name">Name</Label>
                <Input id="name" v-model="form.name" placeholder="Enter your name" />
                <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
              </div>
              
              <div class="space-y-2">
                <Label for="surname">Surname</Label>
                <Input id="surname" v-model="form.surname" placeholder="Enter your surname" />
                <p v-if="errors.surname" class="text-sm text-red-500">{{ errors.surname }}</p>
              </div>
              
              <div class="space-y-2">
                <Label for="cell">Cell Number</Label>
                <Input id="cell" v-model="form.cell" placeholder="Enter your cell number" />
                <p v-if="errors.cell" class="text-sm text-red-500">{{ errors.cell }}</p>
              </div>
              
              <div class="space-y-2">
                <Label for="idNumber">ID Number</Label>
                <Input id="idNumber" v-model="form.idNumber" placeholder="Enter your ID number" />
                <p v-if="errors.idNumber" class="text-sm text-red-500">{{ errors.idNumber }}</p>
              </div>
            </div>
            
            <!-- Address in its own row with improved mobile spacing -->
            <div class="space-y-2 mt-4">
              <Label for="address" class="mb-2 block">
                Address
              </Label>
              <Textarea id="address" v-model="form.address" placeholder="Enter your address" rows="3" />
              <p v-if="errors.address" class="text-sm text-red-500">{{ errors.address }}</p>
            </div>
          </div>
          
          
          
          <!-- Meter Information Section -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-medium">Meter Information</h3>
              <Button type="button" variant="outline" size="sm" @click="addMeter">
                <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
                Add Meter
              </Button>
            </div>
            
            <div v-for="(meter, index) in form.meters" :key="index" class="border rounded-md p-3 mb-3">
              <div class="flex justify-between mb-2">
                <h4 class="font-medium">Meter #{{ index + 1 }}</h4>
                <Button type="button" variant="ghost" size="sm" @click="removeMeter(index)" class="text-red-500">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </Button>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-2">
                  <Label :for="`meterDescription-${index}`">Description</Label>
                  <Input :id="`meterDescription-${index}`" v-model="meter.description" placeholder="Enter meter description" />
                  <p v-if="errors[`meters[${index}].description`]" class="text-sm text-red-500">
                    {{ errors[`meters[${index}].description`] }}
                  </p>
                </div>
                
                <div class="space-y-2">
                  <Label :for="`meterValue-${index}`">Value</Label>
                  <Input :id="`meterValue-${index}`" v-model="meter.value" placeholder="Enter meter value" />
                  <p v-if="errors[`meters[${index}].value`]" class="text-sm text-red-500">
                    {{ errors[`meters[${index}].value`] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end gap-3">
            <Button type="button" variant="outline" class="w-full sm:w-auto" @click="goToDashboard">
              Dashboard
            </Button>
            <Button type="submit" class="w-full sm:w-auto">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script>
definePageMeta({
  layout: 'default'
})

export default {
  data() {
    return {
      form: {
        name: '',
        surname: '',
        cell: '',
        idNumber: '',
        address: '',
        cardNumber: '',
        cvv: '',
        meters: [
          {
            description: '',
            value: ''
          }
        ]
      },
      errors: {}
    }
  },
  methods: {
    goToDashboard() {
      navigateTo('/wallet/dash');
    },
    addMeter() {
      this.form.meters.push({
        description: '',
        value: ''
      });
    },
    removeMeter(index) {
      if (this.form.meters.length > 1) {
        this.form.meters.splice(index, 1);
      }
    },
    validateForm() {
      this.errors = {};
      let isValid = true;
      
      // Personal Information Validation
      if (!this.form.name) {
        this.errors.name = 'Name is required';
        isValid = false;
      }
      
      if (!this.form.surname) {
        this.errors.surname = 'Surname is required';
        isValid = false;
      }
      
      if (!this.form.cell) {
        this.errors.cell = 'Cell number is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(this.form.cell)) {
        this.errors.cell = 'Please enter a valid 10-digit cell number';
        isValid = false;
      }
      
      if (!this.form.idNumber) {
        this.errors.idNumber = 'ID number is required';
        isValid = false;
      }
      
      if (!this.form.address) {
        this.errors.address = 'Address is required';
        isValid = false;
      }
      
      // Card Details Validation
      if (this.form.cardNumber && !/^\d{16}$/.test(this.form.cardNumber)) {
        this.errors.cardNumber = 'Please enter a valid 16-digit card number';
        isValid = false;
      }
      
      if (this.form.cvv && !/^\d{3}$/.test(this.form.cvv)) {
        this.errors.cvv = 'Please enter a valid 3-digit CVV';
        isValid = false;
      }
      
      // Meter Validation
      this.form.meters.forEach((meter, index) => {
        if (!meter.description) {
          this.errors[`meters[${index}].description`] = 'Meter description is required';
          isValid = false;
        }
        
        if (!meter.value) {
          this.errors[`meters[${index}].value`] = 'Meter value is required';
          isValid = false;
        }
      });
      
      return isValid;
    },
    async saveWallet() {
      if (!this.validateForm()) {
        // Show toast error
        this.$toast({
          title: 'Validation Error',
          description: 'Please correct the errors in the form',
          variant: 'destructive'
        });
        return;
      }
      
      try {
        // Here you would make an API call to save the wallet data
        // const response = await useAuthFetch(`${API_URL}/wallet/register`, {
        //   method: 'POST',
        //   body: this.form
        // });
        
        // For now, just show a success message
        this.$toast({
          title: 'Wallet Registered',
          description: 'Your wallet has been successfully registered',
          variant: 'success'
        });
        
        // Redirect to wallet dashboard or wherever appropriate
        await navigateTo('/wallet/dash');
      } catch (error) {
        console.error('Error registering wallet:', error);
        this.$toast({
          title: 'Registration Failed',
          description: 'There was a problem registering your wallet',
          variant: 'destructive'
        });
      }
    }
  }
}
</script>
