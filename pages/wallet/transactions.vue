<template>
  <div class="flex flex-col md:flex-row">
    <!-- Sidebar navigation - blue with white text (consistent with dash.vue) -->
    <aside class="hidden md:block w-64 p-4 bg-blue-500 min-h-screen">
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-4 text-white">Wallet</h2>
        <nav class="space-y-1">
          <NuxtLink to="/wallet/dash" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium">
            <Icon name="lucide:layout-dashboard" class="mr-2 h-5 w-5" />
            Dashboard
          </NuxtLink>
          <NuxtLink to="/wallet/transactions" class="flex items-center px-3 py-2 rounded-md bg-yellow-500 text-white font-medium">
            <Icon name="lucide:credit-card" class="mr-2 h-5 w-5" />
            Transactions
          </NuxtLink>
          <NuxtLink to="/wallet/meters" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium">
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
          <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="filterTransactions('electricity')">
            <Icon name="lucide:zap" class="mr-2 h-5 w-5" />
            Electricity Only
          </Button>
          <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="filterTransactions('water')">
            <Icon name="lucide:droplets" class="mr-2 h-5 w-5" />
            Water Only
          </Button>
          <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="exportTransactions">
            <Icon name="lucide:download" class="mr-2 h-5 w-5" />
            Export Transactions
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
          <Button variant="secondary" size="sm" as-child class="bg-blue-800 text-white">
            <NuxtLink to="/wallet/transactions">Transactions</NuxtLink>
          </Button>
          <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
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
    <div class="flex-1 p-4 md:p-6 md:pt-4 mt-14 md:mt-0">
      <!-- Header section - Optimized for mobile -->
      <div class="mb-6">
        <h1 class="text-xl md:text-2xl font-bold mb-2">Transaction History</h1>
        <p class="text-sm md:text-base text-gray-600">View your utility purchases and wallet transactions</p>
      </div>
      
      <!-- Filters and Period Selector - Reorganized for mobile -->
      <div class="flex flex-col gap-4 mb-6">
        <!-- Filter buttons in a scrollable container on mobile -->
        <ScrollArea class="w-full md:hidden">
          <div class="flex gap-2 pb-2">
            <Button 
              :variant="activeFilter === 'all' ? 'secondary' : 'outline'" 
              size="sm" 
              class="whitespace-nowrap"
              @click="filterTransactions('all')"
            >
              All Transactions
            </Button>
            <Button 
              :variant="activeFilter === 'electricity' ? 'secondary' : 'outline'" 
              size="sm" 
              class="whitespace-nowrap"
              @click="filterTransactions('electricity')"
            >
              <Icon name="lucide:zap" class="mr-2 h-4 w-4" />
              Electricity
            </Button>
            <Button 
              :variant="activeFilter === 'water' ? 'secondary' : 'outline'" 
              size="sm" 
              class="whitespace-nowrap"
              @click="filterTransactions('water')"
            >
              <Icon name="lucide:droplets" class="mr-2 h-4 w-4" />
              Water
            </Button>
            <Button 
              :variant="activeFilter === 'funding' ? 'secondary' : 'outline'" 
              size="sm" 
              class="whitespace-nowrap"
              @click="filterTransactions('funding')"
            >
              <Icon name="lucide:credit-card" class="mr-2 h-4 w-4" />
              Funding
            </Button>
          </div>
        </ScrollArea>

        <!-- Desktop filters - hidden on mobile -->
        <div class="hidden md:flex gap-2 flex-wrap">
          <Button 
            :variant="activeFilter === 'all' ? 'secondary' : 'outline'" 
            size="sm" 
            @click="filterTransactions('all')"
          >
            All Transactions
          </Button>
          <Button 
            :variant="activeFilter === 'electricity' ? 'secondary' : 'outline'" 
            size="sm" 
            @click="filterTransactions('electricity')"
          >
            <Icon name="lucide:zap" class="mr-2 h-4 w-4" />
            Electricity
          </Button>
          <Button 
            :variant="activeFilter === 'water' ? 'secondary' : 'outline'" 
            size="sm" 
            @click="filterTransactions('water')"
          >
            <Icon name="lucide:droplets" class="mr-2 h-4 w-4" />
            Water
          </Button>
          <Button 
            :variant="activeFilter === 'funding' ? 'secondary' : 'outline'" 
            size="sm" 
            @click="filterTransactions('funding')"
          >
            <Icon name="lucide:credit-card" class="mr-2 h-4 w-4" />
            Funding
          </Button>
        </div>
        
        <!-- Period selector and export - Full width on mobile -->
        <div class="flex flex-col sm:flex-row gap-2 w-full">
          <Select v-model="period" class="w-full sm:w-[150px]">
            <SelectTrigger>
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" class="w-full sm:w-auto" @click="exportTransactions">
            <Icon name="lucide:download" class="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <!-- Consumption Bar Chart - Adjusted for mobile -->
      <Card class="p-4 mb-6 bg-white border shadow-sm">
        <CardHeader class="px-0 pt-0 pb-2">
          <div class="flex flex-col sm:flex-row gap-2 justify-between">
            <CardTitle>Utility Consumption</CardTitle>
            <div class="flex items-center gap-4">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span class="text-sm">Electricity</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-teal-500 rounded-full mr-1"></div>
                <span class="text-sm">Water</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <div v-if="isLoading" class="h-[250px] md:h-[300px] flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div v-else class="h-[250px] md:h-[300px] w-full">
          <!-- Bar Chart -->
          <div class="flex h-full">
            <div class="w-14 flex flex-col justify-between text-xs text-gray-500 pb-6">
              <div>R{{ getMaxAmount() }}</div>
              <div>R{{ getMaxAmount() * 0.75 }}</div>
              <div>R{{ getMaxAmount() * 0.5 }}</div>
              <div>R{{ getMaxAmount() * 0.25 }}</div>
              <div>R0</div>
            </div>
            
            <div class="flex-1 flex items-end">
              <div v-for="(month, index) in monthlyData" :key="index" class="flex-1 flex flex-col items-center justify-end">
                <!-- Bar Group (Electricity + Water) -->
                <div class="w-full flex justify-center space-x-1 items-end">
                  <!-- Electricity Bar -->
                  <div 
                    class="w-6 bg-blue-500 rounded-t"
                    :style="{
                      height: `${(month.electricity / getMaxAmount()) * 250}px`,
                      minHeight: month.electricity > 0 ? '4px' : '0px'
                    }"
                    :title="`Electricity: R${month.electricity.toFixed(2)}`"
                  ></div>
                  
                  <!-- Water Bar -->
                  <div 
                    class="w-6 bg-teal-500 rounded-t" 
                    :style="{
                      height: `${(month.water / getMaxAmount()) * 250}px`,
                      minHeight: month.water > 0 ? '4px' : '0px'
                    }"
                    :title="`Water: R${month.water.toFixed(2)}`"
                  ></div>
                </div>
                
                <!-- Month Label -->
                <div class="text-xs mt-2 text-gray-600">{{ month.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <!-- Transactions Summary Cards - Stack on mobile -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card class="p-4 bg-white border shadow-sm">
          <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Total Spent</p>
            <p class="text-2xl font-bold">R{{ summary.totalSpent || '0.00' }}</p>
            <p class="text-sm text-gray-500">{{ period === 'year' ? 'Past year' : `Last ${period.replace('days', ' days')}` }}</p>
          </div>
        </Card>
        
        <Card class="p-4 bg-white border shadow-sm">
          <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Electricity</p>
            <p class="text-2xl font-bold">R{{ summary.electricity || '0.00' }}</p>
            <div class="flex items-center text-sm mt-1" :class="summary.electricityTrend > 0 ? 'text-red-500' : 'text-green-500'">
              <Icon :name="summary.electricityTrend > 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
              <span>{{ Math.abs(summary.electricityTrend || 0) }}% vs previous</span>
            </div>
          </div>
        </Card>
        
        <Card class="p-4 bg-white border shadow-sm">
          <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Water</p>
            <p class="text-2xl font-bold">R{{ summary.water || '0.00' }}</p>
            <div class="flex items-center text-sm mt-1" :class="summary.waterTrend > 0 ? 'text-red-500' : 'text-green-500'">
              <Icon :name="summary.waterTrend > 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="mr-1 h-4 w-4" />
              <span>{{ Math.abs(summary.waterTrend || 0) }}% vs previous</span>
            </div>
          </div>
        </Card>
        
        <Card class="p-4 bg-white border shadow-sm">
          <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Transactions</p>
            <p class="text-2xl font-bold">{{ summary.transactionCount || '0' }}</p>
            <p class="text-sm text-gray-500">{{ activeFilter === 'all' ? 'All types' : `${activeFilter} only` }}</p>
          </div>
        </Card>
      </div>
      
      <!-- Transaction List - Optimized for mobile -->
      <Card class="mb-6 bg-white border shadow-sm">
        <CardHeader class="flex flex-col gap-4">
          <CardTitle>Transactions</CardTitle>
          
          <!-- Search - Full width on mobile -->
          <div class="relative w-full">
            <Input 
              type="search" 
              placeholder="Search transactions" 
              v-model="searchQuery"
              class="w-full pr-8"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Icon name="lucide:search" class="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent class="p-0">
          <!-- Mobile Transaction List -->
          <div class="block md:hidden">
            <div v-if="isLoadingTransactions" class="py-8 flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div v-else-if="filteredTransactions.length === 0" class="py-8 text-center text-gray-500">
              No transactions found
            </div>
            <div v-else class="divide-y">
              <div v-for="transaction in paginatedTransactions" :key="transaction.id" 
                   class="p-4 hover:bg-gray-50" @click="viewReceipt(transaction)">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center">
                    <div :class="`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${getUtilityClass(transaction.type)}`">
                      <Icon :name="getUtilityIcon(transaction.type)" class="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p class="font-medium">{{ transaction.type }}</p>
                      <p class="text-sm text-gray-500">{{ transaction.reference }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-medium" :class="transaction.isCredit ? 'text-green-600' : ''">
                      {{ transaction.isCredit ? '+' : '' }}R{{ transaction.amount.toFixed(2) }}
                    </p>
                    <p class="text-xs text-gray-500">{{ formatDate(transaction.date) }}</p>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <Badge :variant="transaction.status === 'Completed' ? 'success' : transaction.status === 'Pending' ? 'outline' : 'destructive'" 
                         :class="transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : ''">
                    {{ transaction.status }}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Icon name="lucide:chevron-right" class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Transaction Table - Hidden on mobile -->
          <div class="hidden md:block">
            <Table v-if="filteredTransactions.length > 0">
              <TableHeader>
                <TableRow class="bg-gray-50">
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Meter/Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="transaction in paginatedTransactions" :key="transaction.id">
                  <TableCell>
                    <div>
                      <p class="font-medium">{{ formatDate(transaction.date) }}</p>
                      <p class="text-sm text-gray-500">{{ formatTime(transaction.date) }}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="flex items-center">
                      <div :class="`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${getUtilityClass(transaction.type)}`">
                        <Icon :name="getUtilityIcon(transaction.type)" class="h-4 w-4 text-white" />
                      </div>
                      <span>{{ transaction.type }}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{{ transaction.reference }}</p>
                      <p class="text-sm text-gray-500">{{ transaction.description }}</p>
                    </div>
                  </TableCell>
                  <TableCell class="font-medium">
                    <span :class="transaction.isCredit ? 'text-green-600' : ''">
                      {{ transaction.isCredit ? '+' : '' }}R{{ transaction.amount.toFixed(2) }}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge :variant="transaction.status === 'Completed' ? 'success' : transaction.status === 'Pending' ? 'outline' : 'destructive'" 
                           :class="transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : ''">
                      {{ transaction.status }}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" @click="viewReceipt(transaction)">
                      <Icon name="lucide:receipt" class="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <!-- Pagination - Simplified for mobile -->
          <div class="flex items-center justify-between px-4 py-3 border-t">
            <div class="flex justify-between w-full md:hidden">
              <Button 
                variant="outline" 
                size="sm" 
                :disabled="currentPage <= 1"
                @click="currentPage--"
              >
                Previous
              </Button>
              <span class="text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                :disabled="currentPage >= totalPages"
                @click="currentPage++"
              >
                Next
              </Button>
            </div>
            
            <!-- Desktop pagination - Hidden on mobile -->
            <div class="hidden md:flex md:flex-1 md:items-center md:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ startIndex + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(endIndex, filteredTransactions.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredTransactions.length }}</span>
                  results
                </p>
              </div>
              <div>
                <div class="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    :disabled="currentPage <= 1"
                    @click="currentPage = 1"
                  >
                    <Icon name="lucide:chevrons-left" class="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    :disabled="currentPage <= 1"
                    @click="currentPage--"
                  >
                    <Icon name="lucide:chevron-left" class="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    :disabled="currentPage >= totalPages"
                    @click="currentPage++"
                  >
                    <Icon name="lucide:chevron-right" class="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    :disabled="currentPage >= totalPages"
                    @click="currentPage = totalPages"
                  >
                    <Icon name="lucide:chevrons-right" class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  
  <!-- Receipt Dialog - Optimized for mobile -->
  <Dialog :open="showReceipt" @update:open="showReceipt = $event">
    <DialogContent class="w-[90vw] sm:max-w-md mx-auto">
      <DialogHeader>
        <DialogTitle>Transaction Receipt</DialogTitle>
        <DialogDescription>
          Transaction details and receipt information
        </DialogDescription>
      </DialogHeader>
      <div v-if="selectedTransaction" class="py-4">
        <div class="border-b pb-4 mb-4">
          <div class="text-center mb-4">
            <div :class="`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${getUtilityClass(selectedTransaction.type)}`">
              <Icon :name="getUtilityIcon(selectedTransaction.type)" class="h-6 w-6 text-white" />
            </div>
            <h3 class="text-lg font-bold">{{ selectedTransaction.type }} Payment</h3>
            <p class="text-2xl font-bold my-2">R{{ selectedTransaction.amount.toFixed(2) }}</p>
            <Badge :variant="selectedTransaction.status === 'Completed' ? 'success' : selectedTransaction.status === 'Pending' ? 'outline' : 'destructive'" 
                   :class="selectedTransaction.status === 'Completed' ? 'bg-green-100 text-green-800' : ''">
              {{ selectedTransaction.status }}
            </Badge>
          </div>
          
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500">Date</span>
              <span>{{ formatDate(selectedTransaction.date) }} {{ formatTime(selectedTransaction.date) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Reference</span>
              <span>{{ selectedTransaction.reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Description</span>
              <span>{{ selectedTransaction.description }}</span>
            </div>
            <div v-if="selectedTransaction.meterNumber" class="flex justify-between">
              <span class="text-gray-500">Meter Number</span>
              <span>{{ selectedTransaction.meterNumber }}</span>
            </div>
            <div v-if="selectedTransaction.units" class="flex justify-between">
              <span class="text-gray-500">Units Purchased</span>
              <span>{{ selectedTransaction.units }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="selectedTransaction.tokens" class="mb-4">
          <h4 class="font-medium mb-2">Tokens</h4>
          <div class="bg-gray-50 p-3 rounded text-center mb-2" v-for="(token, index) in selectedTransaction.tokens" :key="index">
            <p class="font-mono text-lg">{{ formatToken(token) }}</p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="showReceipt = false">Close</Button>
        <Button @click="downloadReceipt">
          <Icon name="lucide:download" class="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </DialogFooter>
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
      isLoadingTransactions: true,
      activeFilter: 'all',
      period: '30days',
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      transactions: [],
      monthlyData: [],
      summary: {
        totalSpent: null,
        electricity: null,
        electricityTrend: null,
        water: null,
        waterTrend: null,
        transactionCount: null
      },
      showReceipt: false,
      selectedTransaction: null
    }
  },
  computed: {
    filteredTransactions() {
      let result = [...this.transactions];
      
      // Apply type filter
      if (this.activeFilter !== 'all') {
        result = result.filter(t => t.type.toLowerCase() === this.activeFilter.toLowerCase());
      }
      
      // Apply search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(t => 
          t.reference.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.type.toLowerCase().includes(query) ||
          (t.meterNumber && t.meterNumber.toLowerCase().includes(query))
        );
      }
      
      return result;
    },
    paginatedTransactions() {
      this.startIndex = (this.currentPage - 1) * this.pageSize;
      this.endIndex = this.startIndex + this.pageSize;
      return this.filteredTransactions.slice(this.startIndex, this.endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredTransactions.length / this.pageSize);
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize;
    },
    endIndex() {
      return this.startIndex + this.pageSize;
    }
  },
  methods: {
    async fetchTransactionsData() {
      this.isLoading = true;
      this.isLoadingTransactions = true;
      
      try {
        // API call will be implemented later
        // const response = await useAuthFetch(`${API_URL}/wallet/transactions`, {
        //   params: { period: this.period }
        // });
        //
        // this.transactions = response.transactions;
        // this.monthlyData = response.monthlyData;
        // this.summary = response.summary;
        
        // Simulate API delay
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 1000)),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);
        
        // Reset when API integrations are ready
        this.transactions = [];
        this.monthlyData = [
          { label: 'Jan', electricity: 0, water: 0 },
          { label: 'Feb', electricity: 0, water: 0 },
          { label: 'Mar', electricity: 0, water: 0 },
          { label: 'Apr', electricity: 0, water: 0 },
          { label: 'May', electricity: 0, water: 0 },
          { label: 'Jun', electricity: 0, water: 0 }
        ];
        this.summary = {
          totalSpent: null,
          electricity: null,
          electricityTrend: null,
          water: null,
          waterTrend: null,
          transactionCount: null
        };
        
      } catch (error) {
        console.error('Error fetching transactions data:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to load transactions data',
          variant: 'destructive'
        });
      } finally {
        this.isLoading = false;
        this.isLoadingTransactions = false;
      }
    },
    
    filterTransactions(filter) {
      this.activeFilter = filter;
      this.currentPage = 1; // Reset to first page when filter changes
    },
    
    getMaxAmount() {
      if (!this.monthlyData || this.monthlyData.length === 0) return 1000;
      
      let max = 0;
      this.monthlyData.forEach(month => {
        const total = month.electricity + month.water;
        if (total > max) max = total;
      });
      
      // Round up to nice number
      return Math.ceil(max / 1000) * 1000 || 1000;
    },
    
    getUtilityClass(type) {
      const classes = {
        'Electricity': 'bg-blue-500',
        'Water': 'bg-teal-500',
        'Funding': 'bg-purple-500',
        'Withdrawal': 'bg-gray-500'
      };
      
      return classes[type] || 'bg-gray-500';
    },
    
    getUtilityIcon(type) {
      const icons = {
        'Electricity': 'lucide:zap',
        'Water': 'lucide:droplets',
        'Funding': 'lucide:credit-card',
        'Withdrawal': 'lucide:arrow-up-right'
      };
      
      return icons[type] || 'lucide:circle';
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
    },
    
    formatToken(token) {
      // Format token with spaces for readability (e.g., 1234 5678 9012 3456)
      if (!token) return '';
      return token.replace(/(.{4})/g, '$1 ').trim();
    },
    
    viewReceipt(transaction) {
      this.selectedTransaction = transaction;
      this.showReceipt = true;
    },
    
    downloadReceipt() {
      this.$toast({
        title: 'Download Started',
        description: 'Your receipt is being prepared for download',
        variant: 'default'
      });
      // Download functionality will be implemented later
    },
    
    exportTransactions() {
      this.$toast({
        title: 'Export Initiated',
        description: `Exporting ${this.activeFilter === 'all' ? 'all' : this.activeFilter} transactions`,
        variant: 'default'
      });
      // Export functionality will be implemented later
    }
  },
  mounted() {
    this.fetchTransactionsData();
  },
  watch: {
    period() {
      this.fetchTransactionsData();
    },
    searchQuery() {
      this.currentPage = 1; // Reset to first page when search changes
    }
  }
}
</script>
