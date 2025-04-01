<template>
  <div class="flex">
    <!-- Sidebar navigation - blue with white text -->
    <aside class="hidden md:block w-64 p-4 bg-blue-500 min-h-screen">
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-4 text-white">Wallet</h2>
        <nav class="space-y-1">
          <NuxtLink to="/wallet/dash" class="flex items-center px-3 py-2 rounded-md bg-yellow-500 text-white font-medium">
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
          <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="addNewMeter">
            <Icon name="lucide:plus-circle" class="mr-2 h-5 w-5" />
            Add Meter
          </Button>
          <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="createPayment">
            <Icon name="lucide:credit-card" class="mr-2 h-5 w-5" />
            New Payment
          </Button>
          <Button variant="outline" class="w-full justify-start bg-blue-600 text-white hover:bg-blue-500 border-blue-500" @click="exportData">
            <Icon name="lucide:download" class="mr-2 h-5 w-5" />
            Export Data
          </Button>
        </div>
      </div>
    </aside>

    <!-- Mobile navigation - only visible on small screens -->
    <div class="md:hidden w-full fixed top-0 left-0 z-40 bg-blue-700 border-b shadow-sm">
      <ScrollArea class="w-full whitespace-nowrap py-2">
        <div class="flex px-4 gap-2">
          <Button variant="secondary" size="sm" as-child class="bg-blue-800 text-white">
            <NuxtLink to="/wallet/dash">Dashboard</NuxtLink>
          </Button>
          <Button variant="outline" size="sm" as-child class="text-white border-blue-500">
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
    <div class="flex-1 p-4 md:p-6 md:pt-4 mt-12 md:mt-0">
      <!-- Header with wallet balance and filters -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div class="bg-white rounded-lg shadow-sm p-4 w-full md:w-auto">
          <p class="text-gray-600 text-sm">Wallet Funds</p>
          <p class="text-2xl font-bold">{{ walletBalance || 'R0.00' }}</p>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" class="bg-white" @click="setDateRange('12months')">12 Months</Button>
          <Button size="sm" variant="outline" class="bg-white" @click="setDateRange('6months')">6 Months</Button>
          <Button size="sm" variant="outline" class="bg-white" @click="setDateRange('30days')">30 Days</Button>
          <Button size="sm" :variant="dateRange === '7days' ? 'secondary' : 'outline'" 
                  class="bg-white" @click="setDateRange('7days')">7 Days</Button>
        </div>
      </div>
      
      <!-- Stats and chart section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- Stats boxes -->
        <Card class="p-4 bg-white border shadow-sm">
          <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Dashboard</p>
            <p class="text-2xl font-bold">{{ statsData.dashboard || '0' }}</p>
          </div>
        </Card>
        
        <Card class="p-4 bg-white border shadow-sm">
          <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Outbox</p>
            <p class="text-2xl font-bold">{{ statsData.outbox || '0' }}</p>
          </div>
        </Card>
        
        <Card class="p-4 bg-white border shadow-sm">
          <div class="flex flex-col">
            <p class="text-gray-600 text-sm">Favorites</p>
            <p class="text-2xl font-bold">{{ statsData.favorites || '0' }}</p>
          </div>
        </Card>
        
        <Card class="p-4 bg-white border shadow-sm">
          <div class="flex flex-col">
            <p class="text-gray-600 text-sm">{{ currentMonthYear }}</p>
            <p class="text-2xl font-bold">{{ statsData.monthlyTotal || 'R0.00' }}</p>
          </div>
        </Card>
      </div>
      
      <!-- Chart section -->
      <Card class="p-4 mb-6 bg-white border shadow-sm">
        <CardHeader class="px-0 pt-0 pb-2">
          <CardTitle>Monthly Transactions</CardTitle>
        </CardHeader>
        <div v-if="isLoading" class="h-[200px] flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div v-else class="h-[200px] w-full">
          <div v-if="chartData.length > 0" class="flex justify-between items-end h-full">
            <div v-for="month in chartData" :key="month.name" class="flex flex-col items-center w-full">
              <div class="bg-primary rounded-t-sm w-6" :style="`height: ${month.value}px`"></div>
              <p class="text-xs mt-2">{{ month.name }}</p>
            </div>
          </div>
          <div v-else class="flex justify-center items-center h-full">
            <p class="text-gray-500">No data available</p>
          </div>
        </div>
      </Card>
      
      <!-- Labels section -->
      <div class="flex flex-wrap gap-4 mb-6">
        <Card v-for="(label, index) in labels" :key="index" class="p-4 w-full md:w-auto flex-1 bg-white border shadow-sm">
          <div class="flex flex-col">
            <p class="text-gray-600 text-sm">{{ label.name || 'Label' }}</p>
            <p class="text-2xl font-bold">{{ label.value || '0' }}</p>
          </div>
        </Card>
      </div>
      
      <!-- Transactions table -->
      <Card class="mb-6 bg-white border shadow-sm">
        <CardHeader class="flex flex-col sm:flex-row justify-between pb-2">
          <CardTitle>Recent Transactions</CardTitle>
          <div class="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" @click="addNewMeter">
              <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
              Add new meter
            </Button>
            <Button size="sm" variant="outline" @click="exportData">
              <Icon name="lucide:download" class="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" variant="secondary" @click="createPayment">
              <Icon name="lucide:credit-card" class="mr-2 h-4 w-4" />
              Create payment
            </Button>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <div v-if="isLoadingTransactions" class="py-8 flex justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <div v-else-if="transactions.length === 0" class="py-8 text-center text-gray-500">
            No transactions found
          </div>
          <Table v-else>
            <TableHeader>
              <TableRow class="bg-gray-50">
                <TableHead>Amount</TableHead>
                <TableHead>Meter Number</TableHead>
                <TableHead>Username/Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="transaction in transactions" :key="transaction.id">
                <TableCell class="font-medium">{{ transaction.amount }}</TableCell>
                <TableCell>{{ transaction.invoice }}</TableCell>
                <TableCell>{{ transaction.email }}</TableCell>
                <TableCell>{{ transaction.date }}</TableCell>
                <TableCell>
                  <Badge :variant="transaction.status === 'Succeeded' ? 'success' : 'destructive'" 
                        :class="transaction.status === 'Succeeded' ? 'bg-green-100 text-green-800' : ''">
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
</template>

<script>
definePageMeta({
  layout: 'default'
})

export default {
  data() {
    return {
      walletBalance: null,
      dateRange: '7days',
      isLoading: true,
      isLoadingTransactions: true,
      statsData: {
        dashboard: null,
        outbox: null,
        favorites: null,
        monthlyTotal: null
      },
      chartData: [],
      labels: [
        { name: null, value: null },
        { name: null, value: null },
        { name: null, value: null }
      ],
      transactions: []
    }
  },
  computed: {
    currentMonthYear() {
      const date = new Date();
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
  },
  methods: {
    setDateRange(range) {
      this.dateRange = range;
      this.fetchDashboardData();
    },
    async fetchDashboardData() {
      this.isLoading = true;
      
      try {
        // API calls will be implemented later
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reset when API integrations are ready
        this.walletBalance = null;
        this.statsData = {
          dashboard: null,
          outbox: null,
          favorites: null,
          monthlyTotal: null
        };
        this.chartData = [];
        this.labels = [
          { name: null, value: null },
          { name: null, value: null },
          { name: null, value: null }
        ];
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        this.isLoading = false;
      }
      
      // Fetch transactions separately
      this.fetchTransactions();
    },
    async fetchTransactions() {
      this.isLoadingTransactions = true;
      
      try {
        // API calls will be implemented later
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.transactions = [];
        
      } catch (error) {
        console.error('Error fetching transactions:', error);
        this.$toast({
          title: 'Error',
          description: 'Failed to load transactions',
          variant: 'destructive'
        });
      } finally {
        this.isLoadingTransactions = false;
      }
    },
    addNewMeter() {
      navigateTo('/wallet/register');
    },
    exportData() {
      this.$toast({
        title: 'Export',
        description: 'Export functionality will be available soon',
        variant: 'default'
      });
    },
    createPayment() {
      this.$toast({
        title: 'Create Payment',
        description: 'Payment creation will be available soon',
        variant: 'default'
      });
    }
  },
  mounted() {
    this.fetchDashboardData();
  }
}
</script>
