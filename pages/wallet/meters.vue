<template>
    <div class="flex">
      <!-- Sidebar navigation - blue with white text (consistent with other wallet pages) -->
      <aside class="hidden md:block w-64 p-4 bg-blue-500 min-h-screen">
        <div class="mb-8">
          <h2 class="text-xl font-bold mb-4 text-white">Wallet</h2>
          <nav class="space-y-1">
            <NuxtLink to="/wallet/dash" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium">
              <Icon name="lucide:layout-dashboard" class="mr-2 h-5 w-5" />
              Dashboard
            </NuxtLink>
            <NuxtLink to="/wallet/transactions" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium">
              <Icon name="lucide:credit-card" class="mr-2 h-5 w-5" />
              Transactions
            </NuxtLink>
            <NuxtLink to="/wallet/meters" class="flex items-center px-3 py-2 rounded-md bg-yellow-500 text-white font-medium">
              <Icon name="lucide:gauge" class="mr-2 h-5 w-5" />
              Meters
            </NuxtLink>
            <NuxtLink to="/wallet/payments" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium">
              <Icon name="lucide:wallet" class="mr-2 h-5 w-5" />
              Payments
            </NuxtLink>
            <NuxtLink to="/wallet/settings" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium">
              <Icon name="lucide:settings" class="mr-2 h-5 w-5" />
              Settings
            </NuxtLink>
          </nav>
        </div>
        
        <!-- Quick Actions -->
        <div>
          <h3 class="text-sm uppercase text-blue-200 font-medium mb-3">Quick Actions</h3>
          <div class="space-y-1">
            <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="openAddMeterDialog">
              <Icon name="lucide:plus-circle" class="mr-2 h-5 w-5" />
              Add Meter
            </Button>
            <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="buyUtility">
              <Icon name="lucide:credit-card" class="mr-2 h-5 w-5" />
              Buy Utility
            </Button>
            <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="exportMeters">
              <Icon name="lucide:download" class="mr-2 h-5 w-5" />
              Export Meters
            </Button>
          </div>
        </div>
      </aside>
  
      <!-- Mobile navigation - only visible on small screens -->
      <div class="md:hidden w-full fixed top-0 left-0 z-40 bg-blue-700 border-b shadow-sm">
        <ScrollArea class="w-full whitespace-nowrap py-2">
          <div class="flex px-4 gap-2">
            <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
              <NuxtLink to="/wallet/dash">Dashboard</NuxtLink>
            </Button>
            <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
              <NuxtLink to="/wallet/transactions">Transactions</NuxtLink>
            </Button>
            <Button variant="secondary" size="sm" as-child class="bg-blue-800 text-white">
              <NuxtLink to="/wallet/meters">Meters</NuxtLink>
            </Button>
            <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
              <NuxtLink to="/wallet/payments">Payments</NuxtLink>
            </Button>
            <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
              <NuxtLink to="/wallet/settings">Settings</NuxtLink>
            </Button>
          </div>
        </ScrollArea>
      </div>
      
      <!-- Main content -->
      <div class="flex-1 p-4 md:p-6 md:pt-4 mt-12 md:mt-0">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold mb-2">My Meters</h1>
            <p class="text-gray-600">Manage your utility meters and purchase utilities</p>
          </div>
          <Button @click="openAddMeterDialog" class="mt-4 sm:mt-0">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Add New Meter
          </Button>
        </div>
        
        <!-- Filter and Search -->
        <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div class="flex flex-wrap gap-2">
            <Button 
              :variant="activeFilter === 'all' ? 'secondary' : 'outline'" 
              size="sm" 
              @click="filterMeters('all')"
            >
              All Meters
            </Button>
            <Button 
              :variant="activeFilter === 'electricity' ? 'secondary' : 'outline'" 
              size="sm" 
              @click="filterMeters('electricity')"
            >
              <Icon name="lucide:zap" class="mr-2 h-4 w-4" />
              Electricity
            </Button>
            <Button 
              :variant="activeFilter === 'water' ? 'secondary' : 'outline'" 
              size="sm" 
              @click="filterMeters('water')"
            >
              <Icon name="lucide:droplets" class="mr-2 h-4 w-4" />
              Water
            </Button>
            <Button 
              :variant="activeFilter === 'favorite' ? 'secondary' : 'outline'" 
              size="sm" 
              @click="filterMeters('favorite')"
            >
              <Icon name="lucide:star" class="mr-2 h-4 w-4" />
              Favorites
            </Button>
          </div>
          
          <div class="relative w-full sm:w-64">
            <Input 
              type="search" 
              placeholder="Search meters" 
              v-model="searchQuery"
              class="pr-8"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Icon name="lucide:search" class="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        <!-- Meters Grid -->
        <div v-if="isLoading" class="py-8 flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        
        <div v-else-if="filteredMeters.length === 0" class="bg-white rounded-lg border p-8 text-center">
          <div class="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <Icon name="lucide:gauge" class="h-6 w-6 text-gray-500" />
          </div>
          <h3 class="text-lg font-medium mb-2">No Meters Found</h3>
          <p class="text-gray-500 mb-4">You haven't added any meters yet or no meters match your current filters.</p>
          <Button @click="openAddMeterDialog">Add Your First Meter</Button>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card v-for="meter in filteredMeters" :key="meter.id" :class="`p-4 bg-white border shadow-sm hover:shadow-md transition-shadow ${meter.isFavorite ? 'border-yellow-400' : ''}`">
            <div class="flex justify-between items-start">
              <div class="flex items-center">
                <div :class="`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${getUtilityClass(meter.type)}`">
                  <Icon :name="getUtilityIcon(meter.type)" class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 class="font-medium">{{ meter.name }}</h3>
                  <p class="text-gray-500 text-sm">{{ meter.location }}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" @click="toggleFavorite(meter)" :class="meter.isFavorite ? 'text-yellow-500' : 'text-gray-400'">
                <Icon :name="meter.isFavorite ? 'lucide:star' : 'lucide:star'" class="h-5 w-5" />
              </Button>
            </div>
            
            <div class="mt-4 pt-4 border-t">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <p class="text-sm text-gray-500">Meter Number</p>
                  <p class="font-mono">{{ meter.number }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Property ID</p>
                  <p>{{ meter.propertyId }}</p>
                </div>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <p class="text-sm text-gray-500">Last Purchase</p>
                  <p>{{ meter.lastPurchase ? formatDate(meter.lastPurchase) : 'Never' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Amount</p>
                  <p>{{ meter.lastAmount ? `R${meter.lastAmount.toFixed(2)}` : '-' }}</p>
                </div>
              </div>
            </div>
            
            <div class="mt-4 flex gap-2">
              <Button variant="outline" class="w-full" @click="buyForMeter(meter)">
                Buy {{ meter.type }}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon">
                    <Icon name="lucide:more-vertical" class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="viewMeterHistory(meter)">
                    <Icon name="lucide:history" class="mr-2 h-4 w-4" />
                    View History
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="editMeter(meter)">
                    <Icon name="lucide:pencil" class="mr-2 h-4 w-4" />
                    Edit Meter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="removeMeter(meter)" class="text-red-500">
                    <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
                    Remove Meter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Meter Dialog -->
    <Dialog :open="showMeterDialog" @update:open="showMeterDialog = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{{ editingMeter ? 'Edit Meter' : 'Add New Meter' }}</DialogTitle>
          <DialogDescription>
            {{ editingMeter ? 'Update your meter information' : 'Enter your meter details to add it to your account' }}
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="saveMeter">
          <div class="grid gap-4 py-4">
            <div class="space-y-2">
              <Label for="meterName">Meter Name</Label>
              <Input id="meterName" v-model="meterForm.name" placeholder="e.g. Home Electricity" />
              <p v-if="formErrors.name" class="text-sm text-red-500">{{ formErrors.name }}</p>
            </div>
            
            <div class="space-y-2">
              <Label for="meterType">Meter Type</Label>
              <Select v-model="meterForm.type">
                <SelectTrigger id="meterType">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electricity">Electricity</SelectItem>
                  <SelectItem value="Water">Water</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="formErrors.type" class="text-sm text-red-500">{{ formErrors.type }}</p>
            </div>
            
            <div class="space-y-2">
              <Label for="meterNumber">Meter Number</Label>
              <Input id="meterNumber" v-model="meterForm.number" placeholder="Enter meter number" />
              <p v-if="formErrors.number" class="text-sm text-red-500">{{ formErrors.number }}</p>
            </div>
            
            <div class="space-y-2">
              <Label for="propertyId">Property ID</Label>
              <Input id="propertyId" v-model="meterForm.propertyId" placeholder="Enter property ID" />
              <p v-if="formErrors.propertyId" class="text-sm text-red-500">{{ formErrors.propertyId }}</p>
            </div>
            
            <div class="space-y-2">
              <Label for="location">Location</Label>
              <Input id="location" v-model="meterForm.location" placeholder="e.g. Main House, Apartment 2B" />
              <p v-if="formErrors.location" class="text-sm text-red-500">{{ formErrors.location }}</p>
            </div>
            
            <div class="flex items-center space-x-2">
              <Checkbox id="setFavorite" v-model="meterForm.isFavorite" />
              <Label for="setFavorite" class="text-sm">Add to favorites</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="closeMeterDialog">Cancel</Button>
            <Button type="submit">{{ editingMeter ? 'Update Meter' : 'Add Meter' }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    
    <!-- Confirm Remove Dialog -->
    <Dialog :open="showConfirmRemove" @update:open="showConfirmRemove = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove Meter</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this meter? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <div v-if="meterToRemove" class="flex items-center p-4 bg-gray-50 rounded-md">
            <div :class="`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${getUtilityClass(meterToRemove.type)}`">
              <Icon :name="getUtilityIcon(meterToRemove.type)" class="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 class="font-medium">{{ meterToRemove.name }}</h3>
              <p class="text-gray-500 text-sm">{{ meterToRemove.number }}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="showConfirmRemove = false">Cancel</Button>
          <Button variant="destructive" @click="confirmRemoveMeter">Remove Meter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- Buy Utility Dialog -->
    <Dialog :open="showBuyDialog" @update:open="showBuyDialog = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy {{ selectedMeter?.type || 'Utility' }}</DialogTitle>
          <DialogDescription>
            Purchase {{ selectedMeter?.type?.toLowerCase() || 'utility' }} for {{ selectedMeter?.name }}
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="processPurchase">
          <div class="grid gap-4 py-4">
            <div v-if="selectedMeter" class="flex items-center p-4 bg-gray-50 rounded-md">
              <div :class="`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${getUtilityClass(selectedMeter.type)}`">
                <Icon :name="getUtilityIcon(selectedMeter.type)" class="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 class="font-medium">{{ selectedMeter.name }}</h3>
                <p class="text-gray-500 text-sm">{{ selectedMeter.number }}</p>
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="purchaseAmount">Amount</Label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R</span>
                <Input id="purchaseAmount" v-model="purchaseAmount" class="pl-8" placeholder="0.00" />
              </div>
              <p v-if="purchaseError" class="text-sm text-red-500">{{ purchaseError }}</p>
            </div>
            
            <div v-if="walletBalance !== null" class="p-3 bg-gray-50 rounded-md">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Wallet Balance:</span>
                <span class="font-medium">R{{ walletBalance.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between text-sm" :class="sufficientFunds ? 'text-green-600' : 'text-red-500'">
                <span>Status:</span>
                <span>{{ sufficientFunds ? 'Sufficient funds' : 'Insufficient funds' }}</span>
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="paymentMethod">Payment Method</Label>
              <Select v-model="paymentMethod">
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet">Wallet Balance</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showBuyDialog = false">Cancel</Button>
            <Button type="submit" :disabled="!isValidPurchase">Buy Now</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </template>
  
  <script>
  definePageMeta({
    layout: 'default'
  })
  
  export default {
    data() {
      return {
        isLoading: true,
        meters: [],
        activeFilter: 'all',
        searchQuery: '',
        
        // Meter dialog
        showMeterDialog: false,
        editingMeter: null,
        meterForm: {
          name: '',
          type: '',
          number: '',
          propertyId: '',
          location: '',
          isFavorite: false
        },
        formErrors: {},
        
        // Remove meter dialog
        showConfirmRemove: false,
        meterToRemove: null,
        
        // Buy utility dialog
        showBuyDialog: false,
        selectedMeter: null,
        purchaseAmount: '',
        purchaseError: '',
        paymentMethod: 'wallet',
        walletBalance: null
      }
    },
    computed: {
      filteredMeters() {
        let result = [...this.meters];
        
        // Apply type filter
        if (this.activeFilter === 'electricity') {
          result = result.filter(m => m.type === 'Electricity');
        } else if (this.activeFilter === 'water') {
          result = result.filter(m => m.type === 'Water');
        } else if (this.activeFilter === 'favorite') {
          result = result.filter(m => m.isFavorite);
        }
        
        // Apply search filter
        if (this.searchQuery.trim()) {
          const query = this.searchQuery.toLowerCase();
          result = result.filter(m => 
            m.name.toLowerCase().includes(query) ||
            m.number.toLowerCase().includes(query) ||
            m.location.toLowerCase().includes(query) ||
            m.propertyId.toLowerCase().includes(query)
          );
        }
        
        return result;
      },
      isValidPurchase() {
        if (!this.purchaseAmount || isNaN(this.purchaseAmount) || parseFloat(this.purchaseAmount) <= 0) {
          return false;
        }
        
        // If using wallet, check if there are enough funds
        if (this.paymentMethod === 'wallet' && this.walletBalance !== null) {
          return this.sufficientFunds;
        }
        
        return true;
      },
      sufficientFunds() {
        if (this.walletBalance === null || !this.purchaseAmount) return true;
        
        return parseFloat(this.walletBalance) >= parseFloat(this.purchaseAmount);
      }
    },
    methods: {
      async fetchMeters() {
        this.isLoading = true;
        
        try {
          // API call will be implemented later
          
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
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
      
      async fetchWalletBalance() {
        try {
          // API call will be implemented later
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Reset when API integrations are ready
          this.walletBalance = null; // Will be populated by API
          
        } catch (error) {
          console.error('Error fetching wallet balance:', error);
        }
      },
      
      filterMeters(filter) {
        this.activeFilter = filter;
      },
      
      getUtilityClass(type) {
        return type === 'Electricity' ? 'bg-blue-500' : 'bg-teal-500';
      },
      
      getUtilityIcon(type) {
        return type === 'Electricity' ? 'lucide:zap' : 'lucide:droplets';
      },
      
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ZA', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      },
      
      openAddMeterDialog() {
        this.editingMeter = null;
        this.meterForm = {
          name: '',
          type: '',
          number: '',
          propertyId: '',
          location: '',
          isFavorite: false
        };
        this.formErrors = {};
        this.showMeterDialog = true;
      },
      
      editMeter(meter) {
        this.editingMeter = meter;
        this.meterForm = {
          name: meter.name,
          type: meter.type,
          number: meter.number,
          propertyId: meter.propertyId,
          location: meter.location,
          isFavorite: meter.isFavorite
        };
        this.formErrors = {};
        this.showMeterDialog = true;
      },
      
      closeMeterDialog() {
        this.showMeterDialog = false;
        this.editingMeter = null;
        this.formErrors = {};
      },
      
      validateMeterForm() {
        this.formErrors = {};
        let isValid = true;
        
        if (!this.meterForm.name || this.meterForm.name.trim() === '') {
          this.formErrors.name = 'Meter name is required';
          isValid = false;
        }
        
        if (!this.meterForm.type) {
          this.formErrors.type = 'Please select a meter type';
          isValid = false;
        }
        
        if (!this.meterForm.number || this.meterForm.number.trim() === '') {
          this.formErrors.number = 'Meter number is required';
          isValid = false;
        }
        
        if (!this.meterForm.propertyId || this.meterForm.propertyId.trim() === '') {
          this.formErrors.propertyId = 'Property ID is required';
          isValid = false;
        }
        
        if (!this.meterForm.location || this.meterForm.location.trim() === '') {
          this.formErrors.location = 'Location is required';
          isValid = false;
        }
        
        return isValid;
      },
      
      async saveMeter() {
        if (!this.validateMeterForm()) {
          return;
        }
        
        try {
          if (this.editingMeter) {
            
            
            this.$toast({
              title: 'Meter Updated',
              description: 'Your meter has been updated successfully',
              variant: 'success'
            });
          } else {
            // API call to add meter will be implemented later
            
            
            this.$toast({
              title: 'Meter Added',
              description: 'Your new meter has been added successfully',
              variant: 'success'
            });
          }
          
          // Close dialog and refresh meters
          this.showMeterDialog = false;
          this.fetchMeters();
          
        } catch (error) {
          console.error('Error saving meter:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to save meter',
            variant: 'destructive'
          });
        }
      },
      
      removeMeter(meter) {
        this.meterToRemove = meter;
        this.showConfirmRemove = true;
      },
      
      async confirmRemoveMeter() {
        try {
          // API call to remove meter will be implemented later
          
          
          this.$toast({
            title: 'Meter Removed',
            description: 'Your meter has been removed successfully',
            variant: 'success'
          });
          
          // Close dialog and refresh meters
          this.showConfirmRemove = false;
          this.meterToRemove = null;
          this.fetchMeters();
          
        } catch (error) {
          console.error('Error removing meter:', error);
          this.$toast({
            title: 'Error',
            description: 'Failed to remove meter',
            variant: 'destructive'
          });
        }
      },
      
      toggleFavorite(meter) {
        const updatedMeter = { ...meter, isFavorite: !meter.isFavorite };
        
        // API call to toggle favorite will be implemented later
        
        
        // Update local state immediately for better UX
        this.meters = this.meters.map(m => m.id === meter.id ? updatedMeter : m);
      },
      
      viewMeterHistory(meter) {
        // Redirect to transactions page with meter filter
        navigateTo(`/wallet/transactions?meter=${meter.id}`);
      },
      
      buyForMeter(meter) {
        this.selectedMeter = meter;
        this.purchaseAmount = '';
        this.purchaseError = '';
        this.paymentMethod = 'wallet';
        this.showBuyDialog = true;
        this.fetchWalletBalance();
      },
      
      buyUtility() {
        // If no meter is selected, prompt to select
        if (this.meters.length === 0) {
          this.$toast?.({
            title: 'No Meters Found',
            description: 'Please add a meter first before purchasing utility',
            variant: 'default'
          });
          this.openAddMeterDialog();
          return;
        }
        
        this.selectedMeter = null;
        this.purchaseAmount = '';
        this.purchaseError = '';
        this.paymentMethod = 'wallet';
        this.showBuyDialog = true;
        this.fetchWalletBalance();
      },
      
      async processPurchase() {
        if (!this.isValidPurchase) {
          return;
        }
        
        if (!this.purchaseAmount || isNaN(this.purchaseAmount) || parseFloat(this.purchaseAmount) <= 0) {
          this.purchaseError = 'Please enter a valid amount';
          return;
        }
        
        // If no meter is selected
        if (!this.selectedMeter) {
          this.purchaseError = 'Please select a meter';
          return;
        }
        
        try {
          const amount = parseFloat(this.purchaseAmount);
          
          // API call will be implemented later
          
          
          // For demonstration - update local state
          const meterIndex = this.meters.findIndex(m => m.id === this.selectedMeter.id);
          if (meterIndex !== -1) {
            this.meters[meterIndex] = {
              ...this.meters[meterIndex],
              lastPurchase: new Date().toISOString().split('T')[0],
              lastAmount: amount
            };
            
            // Update wallet balance if using wallet
            if (this.paymentMethod === 'wallet' && this.walletBalance !== null) {
              this.walletBalance -= amount;
            }
          }
          
          this.$toast?.({
            title: 'Purchase Successful',
            description: `You have successfully purchased ${this.selectedMeter.type.toLowerCase()} for R${amount.toFixed(2)}`,
            variant: 'success'
          });
          
          // Close dialog
          this.showBuyDialog = false;
          
        } catch (error) {
          console.error('Error processing purchase:', error);
          this.purchaseError = 'Failed to process your purchase. Please try again.';
          this.$toast?.({
            title: 'Purchase Failed',
            description: 'There was an error processing your purchase',
            variant: 'destructive'
          });
        }
      },
      
      exportMeters() {
        // API call will be implemented later
        
        
        this.$toast?.({
          title: 'Export Initiated',
          description: 'Your meters data is being prepared for export',
          variant: 'default'
        });
      }
    },
    mounted() {
      this.fetchMeters();
      this.fetchWalletBalance();
    }
  }
  </script>