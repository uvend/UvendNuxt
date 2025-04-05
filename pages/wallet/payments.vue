<template>
  <div class="flex flex-col md:flex-row">
    <!-- Sidebar navigation - hide on mobile, show on md and up -->
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
          <NuxtLink to="/wallet/meters" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium">
            <Icon name="lucide:gauge" class="mr-2 h-5 w-5" />
            Meters
          </NuxtLink>
          <NuxtLink to="/wallet/payments" class="flex items-center px-3 py-2 rounded-md bg-yellow-500 text-white font-medium">
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
          <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="showAddCardDialog">
            <Icon name="lucide:plus-circle" class="mr-2 h-5 w-5" />
            Add Card
          </Button>
          <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="showLoadFundsDialog">
            <Icon name="lucide:credit-card" class="mr-2 h-5 w-5" />
            Load Funds
          </Button>
          <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="exportStatements">
            <Icon name="lucide:download" class="mr-2 h-5 w-5" />
            Export Statements
          </Button>
        </div>
      </div>
    </aside>

    <!-- Mobile top navigation bar -->
    <div class="md:hidden fixed top-0 left-0 right-0 z-40 bg-blue-700 border-b shadow-sm">
      <ScrollArea class="w-full whitespace-nowrap py-2">
        <div class="flex px-4 gap-2">
          <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
            <NuxtLink to="/wallet/dash">Dashboard</NuxtLink>
          </Button>
          <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
            <NuxtLink to="/wallet/transactions">Transactions</NuxtLink>
          </Button>
          <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
            <NuxtLink to="/wallet/meters">Meters</NuxtLink>
          </Button>
          <Button variant="secondary" size="sm" as-child class="bg-blue-800 text-white">
            <NuxtLink to="/wallet/payments">Payments</NuxtLink>
          </Button>
          <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
            <NuxtLink to="/wallet/settings">Settings</NuxtLink>
          </Button>
        </div>
      </ScrollArea>
    </div>
    
    <!-- Main content -->
    <div class="flex-1 p-4 md:p-6 md:pt-4 mt-14 md:mt-0">
      <!-- Header section -->
      <div class="mb-6">
        <h1 class="text-xl md:text-2xl font-bold mb-2">Payment Methods</h1>
        <p class="text-sm md:text-base text-gray-600">Manage your cards and view fund transfer history</p>
      </div>
      
      <!-- Card Management Section -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 class="text-lg font-semibold">Your Cards</h2>
          <Button size="sm" class="w-full sm:w-auto" @click="showAddCardDialog">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Add New Card
          </Button>
        </div>
        
        <div v-if="isLoadingCards" class="py-8 flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        
        <div v-else-if="cards.length === 0" class="bg-white rounded-lg border p-8 text-center">
          <div class="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <Icon name="lucide:credit-card" class="h-6 w-6 text-gray-500" />
          </div>
          <h3 class="text-lg font-medium mb-2">No Cards Added</h3>
          <p class="text-gray-500 mb-4">Add a credit or debit card to load funds to your wallet</p>
          <Button @click="showAddCardDialog">Add Card</Button>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card v-for="card in cards" :key="card.id" class="p-4 bg-white border shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center mb-2">
                  <Icon :name="getCardIcon(card.type)" class="mr-2 h-5 w-5" />
                  <span class="font-medium">{{ card.type }}</span>
                </div>
                <p class="text-xl mb-2">**** **** **** {{ card.last4 }}</p>
                <p class="text-sm text-gray-500">Expires {{ card.expiryMonth }}/{{ card.expiryYear }}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="sm">
                    <Icon name="lucide:more-vertical" class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="setDefaultCard(card.id)">
                    <Icon name="lucide:check" class="mr-2 h-4 w-4" />
                    <span>Set as Default</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="deleteCard(card.id)" class="text-red-500">
                    <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
                    <span>Remove Card</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Badge v-if="card.isDefault" class="mt-4">Default</Badge>
          </Card>
        </div>
      </div>
      
      <!-- Load Funds Section -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 class="text-lg font-semibold">Load Funds</h2>
          <Button size="sm" variant="secondary" class="w-full sm:w-auto" @click="showLoadFundsDialog">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Add Money
          </Button>
        </div>
        
        <Card class="bg-white border shadow-sm p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">Current Balance</p>
              <p class="text-xl md:text-2xl font-bold">R{{ currentBalance || '0.00' }}</p>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">Total Loaded</p>
              <p class="text-xl md:text-2xl font-bold">R{{ totalLoaded || '0.00' }}</p>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">Total Spent</p>
              <p class="text-xl md:text-2xl font-bold">R{{ totalSpent || '0.00' }}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <!-- Fund Loading History Section -->
      <div>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 class="text-lg font-semibold">Funding History</h2>
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select v-model="historyFilter" class="w-full sm:w-[150px]">
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" class="w-full sm:w-auto" @click="exportHistoryData">
              <Icon name="lucide:download" class="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Card class="mb-6 bg-white border shadow-sm overflow-x-auto">
          <CardContent class="p-0">
            <div v-if="isLoadingHistory" class="py-8 flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div v-else-if="fundingHistory.length === 0" class="py-8 text-center text-gray-500">
              No transaction history found
            </div>
            <Table>
              <TableHeader>
                <TableRow class="bg-gray-50">
                  <TableHead class="whitespace-nowrap">Date</TableHead>
                  <TableHead class="whitespace-nowrap">Card</TableHead>
                  <TableHead class="whitespace-nowrap">Amount</TableHead>
                  <TableHead class="whitespace-nowrap">Reference</TableHead>
                  <TableHead class="whitespace-nowrap">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="transaction in fundingHistory" :key="transaction.id">
                  <TableCell class="whitespace-nowrap">
                    <div>
                      <p class="font-medium">{{ formatDate(transaction.date) }}</p>
                      <p class="text-xs text-gray-500">{{ formatTime(transaction.date) }}</p>
                    </div>
                  </TableCell>
                  <TableCell class="whitespace-nowrap">
                    <div class="flex items-center">
                      <Icon :name="getCardIcon(transaction.cardType)" class="mr-2 h-4 w-4" />
                      <span>**** {{ transaction.cardLast4 }}</span>
                    </div>
                  </TableCell>
                  <TableCell class="whitespace-nowrap font-medium">R{{ transaction.amount.toFixed(2) }}</TableCell>
                  <TableCell class="whitespace-nowrap">{{ transaction.reference }}</TableCell>
                  <TableCell class="whitespace-nowrap">
                    <Badge :variant="transaction.status === 'Completed' ? 'success' : 'destructive'" 
                          :class="transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : ''">
                      {{ transaction.status }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  
  <!-- Dialogs -->
  <!-- Add Card Dialog -->
  <Dialog :open="showAddCard" @update:open="showAddCard = $event">
    <DialogContent class="w-[90vw] sm:max-w-md mx-auto">
      <DialogHeader>
        <DialogTitle>Add Payment Card</DialogTitle>
        <DialogDescription>
          Add a new credit or debit card to your wallet
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="addNewCard">
        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <Label for="cardName">Cardholder Name</Label>
            <Input id="cardName" v-model="newCard.name" placeholder="As it appears on card" />
          </div>
          <div class="space-y-2">
            <Label for="cardNumber">Card Number</Label>
            <Input id="cardNumber" v-model="newCard.number" placeholder="1234 5678 9012 3456" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="expiryDate">Expiry Date</Label>
              <Input id="expiryDate" v-model="newCard.expiry" placeholder="MM/YY" />
            </div>
            <div class="space-y-2">
              <Label for="cvv">CVV</Label>
              <Input id="cvv" v-model="newCard.cvv" type="password" placeholder="123" />
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox id="setDefault" v-model="newCard.setDefault" />
            <Label for="setDefault" class="text-sm">Set as default payment method</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="showAddCard = false">Cancel</Button>
          <Button type="submit">Add Card</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  
  <!-- Load Funds Dialog -->
  <Dialog :open="showLoadFunds" @update:open="showLoadFunds = $event">
    <DialogContent class="w-[90vw] sm:max-w-md mx-auto">
      <DialogHeader>
        <DialogTitle>Load Wallet Funds</DialogTitle>
        <DialogDescription>
          Add money to your wallet
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="loadFundsToWallet">
        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <Label for="amount">Amount</Label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R</span>
              <Input id="amount" v-model="loadAmount" class="pl-8" placeholder="0.00" />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="paymentMethod">Payment Method</Label>
            <Select v-model="selectedCardId">
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select a card" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="card in cards" :key="card.id" :value="card.id">
                  {{ card.type }} **** {{ card.last4 }} (Expires {{ card.expiryMonth }}/{{ card.expiryYear }})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="notes">Notes (Optional)</Label>
            <Textarea id="notes" v-model="loadNotes" placeholder="Add a note for this transaction" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="showLoadFunds = false">Cancel</Button>
          <Button type="submit">Load Funds</Button>
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
      // Card management
      isLoadingCards: true,
      cards: [],
      showAddCard: false,
      newCard: {
        name: '',
        number: '',
        expiry: '',
        cvv: '',
        setDefault: false
      },
      
      // Fund loading
      currentBalance: null,
      totalLoaded: null,
      totalSpent: null,
      showLoadFunds: false,
      loadAmount: '',
      selectedCardId: null,
      loadNotes: '',
      
      // Funding history
      isLoadingHistory: true,
      historyFilter: 'all',
      fundingHistory: []
    }
  },
  methods: {
    async fetchCards() {
      this.isLoadingCards = true;
      try {
        // API call will be implemented later
        // const response = await useAuthFetch(`${API_URL}/wallet/cards`);
        // this.cards = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.cards = []; // Will be populated by API
        
      } catch (error) {
        console.error('Error fetching cards:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to load cards',
          variant: 'destructive'
        });
      } finally {
        this.isLoadingCards = false;
      }
    },
    
    async fetchWalletSummary() {
      try {
        // API call will be implemented later
        // const response = await useAuthFetch(`${API_URL}/wallet/summary`);
        // this.currentBalance = response.currentBalance;
        // this.totalLoaded = response.totalLoaded;
        // this.totalSpent = response.totalSpent;
        
        // Simulate API delay - these will be populated by API
        await new Promise(resolve => setTimeout(resolve, 800));
        this.currentBalance = null;
        this.totalLoaded = null;
        this.totalSpent = null;
        
      } catch (error) {
        console.error('Error fetching wallet summary:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to load wallet summary',
          variant: 'destructive'
        });
      }
    },
    
    async fetchFundingHistory() {
      this.isLoadingHistory = true;
      try {
        // API call will be implemented later
        // const response = await useAuthFetch(`${API_URL}/wallet/funding-history`, {
        //   params: { filter: this.historyFilter }
        // });
        // this.fundingHistory = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        this.fundingHistory = []; // Will be populated by API
        
      } catch (error) {
        console.error('Error fetching funding history:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to load funding history',
          variant: 'destructive'
        });
      } finally {
        this.isLoadingHistory = false;
      }
    },
    
    showAddCardDialog() {
      this.newCard = {
        name: '',
        number: '',
        expiry: '',
        cvv: '',
        setDefault: false
      };
      this.showAddCard = true;
    },
    
    showLoadFundsDialog() {
      if (this.cards.length === 0) {
        this.$toast({
          title: 'No Payment Method',
          description: 'Please add a card before loading funds',
          variant: 'destructive'
        });
        return;
      }
      
      // Find default card if any
      const defaultCard = this.cards.find(card => card.isDefault);
      this.selectedCardId = defaultCard ? defaultCard.id : this.cards[0].id;
      
      this.loadAmount = '';
      this.loadNotes = '';
      this.showLoadFunds = true;
    },
    
    async addNewCard() {
      try {
        // Validate card details
        if (!this.newCard.name || !this.newCard.number || !this.newCard.expiry || !this.newCard.cvv) {
          this.$toast({
            title: 'Missing Information',
            description: 'Please fill in all card details',
            variant: 'destructive'
          });
          return;
        }
        
        // API call will be implemented later
        // const response = await useAuthFetch(`${API_URL}/wallet/cards`, {
        //   method: 'POST',
        //   body: this.newCard
        // });
        
        // Show success message
        this.$toast({
          title: 'Card Added',
          description: 'Your card has been successfully added',
          variant: 'success'
        });
        
        // Close dialog and refresh cards
        this.showAddCard = false;
        this.fetchCards();
        
      } catch (error) {
        console.error('Error adding card:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to add card',
          variant: 'destructive'
        });
      }
    },
    
    async loadFundsToWallet() {
      try {
        // Validate amount
        if (!this.loadAmount || isNaN(this.loadAmount) || parseFloat(this.loadAmount) <= 0) {
          this.$toast({
            title: 'Invalid Amount',
            description: 'Please enter a valid amount',
            variant: 'destructive'
          });
          return;
        }
        
        // API call will be implemented later
        // const response = await useAuthFetch(`${API_URL}/wallet/load-funds`, {
        //   method: 'POST',
        //   body: {
        //     amount: parseFloat(this.loadAmount),
        //     cardId: this.selectedCardId,
        //     notes: this.loadNotes
        //   }
        // });
        
        // Show success message
        this.$toast({
          title: 'Funds Added',
          description: `R${this.loadAmount} has been added to your wallet`,
          variant: 'success'
        });
        
        // Close dialog and refresh data
        this.showLoadFunds = false;
        this.fetchWalletSummary();
        this.fetchFundingHistory();
        
      } catch (error) {
        console.error('Error loading funds:', error);
        this.$toast({
          title: 'Transaction Failed',
          description: 'Failed to add funds to your wallet',
          variant: 'destructive'
        });
      }
    },
    
    async setDefaultCard(cardId) {
      try {
        // API call will be implemented later
        // await useAuthFetch(`${API_URL}/wallet/cards/${cardId}/set-default`, {
        //   method: 'PUT'
        // });
        
        this.$toast({
          title: 'Default Card Updated',
          description: 'Your default payment method has been updated',
          variant: 'success'
        });
        
        // Refresh cards
        this.fetchCards();
        
      } catch (error) {
        console.error('Error setting default card:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to update default card',
          variant: 'destructive'
        });
      }
    },
    
    async deleteCard(cardId) {
      try {
        // API call will be implemented later
        // await useAuthFetch(`${API_URL}/wallet/cards/${cardId}`, {
        //   method: 'DELETE'
        // });
        
        this.$toast({
          title: 'Card Removed',
          description: 'Your card has been removed',
          variant: 'success'
        });
        
        // Refresh cards
        this.fetchCards();
        
      } catch (error) {
        console.error('Error deleting card:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to remove card',
          variant: 'destructive'
        });
      }
    },
    
    exportHistoryData() {
      this.$toast({
        title: 'Export Initiated',
        description: 'Your funding history will be downloaded shortly',
        variant: 'default'
      });
      // Export functionality will be implemented later
    },
    
    exportStatements() {
      this.$toast({
        title: 'Statements',
        description: 'Statement export will be available soon',
        variant: 'default'
      });
      // Export functionality will be implemented later
    },
    
    getCardIcon(cardType) {
      const cardIcons = {
        'Visa': 'lucide:credit-card',
        'Mastercard': 'lucide:credit-card',
        'American Express': 'lucide:credit-card',
        'Discover': 'lucide:credit-card'
      };
      
      return cardIcons[cardType] || 'lucide:credit-card';
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },
    
    formatTime(dateString) {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  },
  mounted() {
    this.fetchCards();
    this.fetchWalletSummary();
    this.fetchFundingHistory();
  },
  watch: {
    historyFilter() {
      this.fetchFundingHistory();
    }
  }
}
</script>
