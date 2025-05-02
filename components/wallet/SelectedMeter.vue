<template>
    <div class="flex justify-between -mt-4 mb-7">
        <Button @click="$emit('deselect')" variant="secondary">
            <Icon name="lucide:arrow-left" class="h-4 w-4"/>
        </Button>
        <WalletPopup buttonLabel="Edit Meter" @click="console.log(meter)">
          <WalletEditMeter />
        </WalletPopup>
    </div>
    <WalletCardMeter :meter="meter" @click="$emit('deselect')" :open="true"/>
    
    <!-- Meter info section -->
    <Card class="mt-6">
        <CardHeader>
            <CardTitle>Meter Information</CardTitle>
            <CardDescription>
                Meter #{{ meter.meterNumber }}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div v-if="isLoadingInfo" class="flex justify-center py-6">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div v-else-if="meterInfo" class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-muted-foreground">Type</p>
                    <p class="font-medium">{{ getMeterType(meter.type) }}</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Status</p>
                    <div class="flex items-center space-x-2">
                        <div class="h-2 w-2 rounded-full" :class="{
                            'bg-green-500': meterInfo.status === 'Active' || !meterInfo.status,
                            'bg-red-500': meterInfo.status === 'Inactive',
                            'bg-yellow-500': meterInfo.status === 'Pending'
                        }"></div>
                        <span>{{ meterInfo.status || 'Active' }}</span>
                    </div>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Customer Name</p>
                    <p class="font-medium">{{ meterInfo.customerName || 'Not available' }}</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Installation Date</p>
                    <p class="font-medium">{{ formatDate(meterInfo.installationDate) }}</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Location</p>
                    <p class="font-medium">{{ meterInfo.location || 'Not specified' }}</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Balance</p>
                    <p class="font-medium">{{ formatCurrency(meterInfo.balance) }}</p>
                </div>
            </div>
            <div v-else class="py-4 text-center text-muted-foreground">
                No meter information available
            </div>
        </CardContent>
    </Card>

    <!-- Token history section -->
    <Card class="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
                <CardTitle>Token History</CardTitle>
                <CardDescription>Recent token purchases and usage</CardDescription>
            </div>
            <div class="flex gap-2">
                <Button variant="ghost" size="sm" @click="fetchTokenHistory">
                    <Icon name="lucide:refresh-cw" class="h-4 w-4" />
                </Button>
                <Button 
                    v-if="tokenHistory.length > 10"
                    variant="outline" 
                    size="sm" 
                    @click="showAllTransactions = !showAllTransactions"
                >
                    {{ showAllTransactions ? 'Show Less' : 'View All' }}
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div v-if="isLoadingTokens" class="flex justify-center py-6">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div v-else-if="tokenHistory && tokenHistory.length > 0" class="space-y-2">
                <div v-for="(token, index) in displayedTransactions" :key="index" class="flex items-center justify-between py-3 border-b last:border-0">
                    <div class="flex items-center space-x-4">
                        <div class="rounded-full p-2" :class="getTokenStatusClass(token.status)">
                            <Icon :name="getTokenStatusIcon(token.status)" class="h-4 w-4" />
                        </div>
                        <div>
                            <p class="font-medium">{{ token.tokenNumber || 'Token ' + (index + 1) }}</p>
                            <p class="text-xs text-muted-foreground">{{ formatDate(token.date) }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <p class="text-sm font-medium">{{ formatCurrency(token.amount) }}</p>
                        <Badge :variant="getTokenBadgeVariant(token.status)">
                            {{ token.status || 'Generated' }}
                        </Badge>
                    </div>
                </div>
            </div>
            <div v-else class="py-8 text-center text-muted-foreground">
                <p>No token history available</p>
                <p class="text-sm">Token history will appear here once purchases are made</p>
            </div>
        </CardContent>
    </Card>

    <!-- Purchase token section -->
    <div class="mt-6 flex justify-end">
        <Button @click="showTokenDialog = true">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Purchase Token
        </Button>
    </div>

    <!-- Purchase token dialog -->
    <Dialog v-model:open="showTokenDialog">
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Purchase Token</DialogTitle>
                <DialogDescription>Purchase a new token for this meter</DialogDescription>
            </DialogHeader>
            <div v-if="!tokenResponse" class="space-y-4 py-4">
                <div class="space-y-2">
                    <Label for="amount">Amount</Label>
                    <Input id="amount" v-model="tokenAmount" type="number" placeholder="Enter amount" />
                </div>
                <div class="space-y-2">
                    <Label for="payment-method">Payment Method</Label>
                    <Select v-model="paymentMethod">
                        <SelectTrigger id="payment-method">
                            <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                            <SelectItem value="wallet">Wallet Balance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <!-- Token response display -->
            <div v-else class="py-4">
                <div class="mb-4">
                    <h3 class="font-medium text-center mb-2">Token Generated</h3>
                    <div v-for="(transaction, idx) in tokenResponse.listOfTokenTransactions" :key="idx" 
                         class="bg-muted p-3 rounded-md mb-2">
                        <div v-for="(tokens, tokenIdx) in transaction.tokens" :key="tokenIdx">
                            <div class="flex flex-wrap gap-2 justify-center">
                                <span v-for="(key, keyIdx) in tokens.tokenKeys" :key="keyIdx" 
                                      class="bg-primary-foreground px-2 py-1 rounded text-primary font-mono text-sm">
                                    {{ key }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center text-sm text-muted-foreground">
                    <p>New Balance: {{ formatCurrency(tokenResponse.balance) }}</p>
                </div>
            </div>
            
            <DialogFooter>
                <Button v-if="!tokenResponse" variant="outline" @click="showTokenDialog = false">Cancel</Button>
                <Button v-if="!tokenResponse" @click="purchaseToken" :disabled="isPurchasing">
                    {{ isPurchasing ? 'Processing...' : 'Purchase' }}
                </Button>
                <Button v-else @click="finishPurchase">Done</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script>
export default{
    props:{
        meter: Object,
    },
    data() {
        return {
            isLoadingInfo: true,
            isLoadingTokens: true,
            isPurchasing: false,
            meterInfo: null,
            tokenHistory: [],
            showTokenDialog: false,
            tokenAmount: '',
            paymentMethod: 'card',
            tokenResponse: null,
            showAllTransactions: false
        }
    },
    computed: {
        displayedTransactions() {
            if (this.showAllTransactions) {
                return this.tokenHistory;
            }
            return this.tokenHistory.slice(0, 10);
        }
    },
    mounted(){
        this.$store.selectedMeter = this.meter;
        this.fetchMeterInfo();
        this.fetchTokenHistory();
    },
    methods: {
        async fetchMeterInfo() {
            this.isLoadingInfo = true;
            try {
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/${this.meter.meterNumber}/info`);
                this.meterInfo = response;
            } catch (error) {
                console.error('Error fetching meter info:', error);
                // Fallback to existing data
                this.meterInfo = {
                    ...this.meter,
                    status: 'Active',
                    balance: this.meter.balance || 0
                };
            } finally {
                this.isLoadingInfo = false;
            }
        },
        async fetchTokenHistory() {
            this.isLoadingTokens = true;
            try {
                const params = new URLSearchParams({
                    utilityType: this.meter.utilityType || 'Electricity',
                    startDate: this.formatDateForAPI(new Date()),
                    endDate: this.formatDateForAPI(new Date()),
                    meterNumber: this.meter.meterNumber
                });

                const url = `${WALLET_API_URL}/meter/token/history?${params.toString()}`;
                console.log('Fetching token history from:', url); // Debug log

                const response = await useWalletAuthFetch(url);
                
                // Check if response is HTML (indicating a redirect)
                if (typeof response === 'string' && response.includes('<!DOCTYPE html>')) {
                    console.error('Received HTML response instead of JSON. Authentication may have failed.');
                    this.tokenHistory = [];
                    this.$toast({
                        title: 'Error',
                        description: 'Failed to fetch token history. Please try logging in again.',
                        variant: 'destructive'
                    });
                    return;
                }

                console.log('Token history response:', response); // Debug log

                // Validate response structure
                if (!Array.isArray(response)) {
                    console.error('Expected array response, got:', typeof response);
                    this.tokenHistory = [];
                    return;
                }

                // Filter out empty or invalid tokens
                this.tokenHistory = response.filter(token => {
                    return token && (token.tokenNumber || token.amount || token.date);
                });

                console.log('Processed token history:', this.tokenHistory); // Debug log
            } catch (error) {
                console.error('Error fetching token history:', error);
                this.$toast({
                    title: 'Error',
                    description: 'Failed to fetch token history. Please try again.',
                    variant: 'destructive'
                });
                this.tokenHistory = [];
            } finally {
                this.isLoadingTokens = false;
            }
        },
        async purchaseToken() {
            this.isPurchasing = true;
            try {
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/token/${this.meter.id}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        amount: parseFloat(this.tokenAmount),
                        paymentMethod: this.paymentMethod,
                        meterNumber: this.meter.meterNumber,
                        preview: false
                    })
                });
                
                if (!response || !response.token) {
                    throw new Error('Failed to generate token');
                }
                
                // Store token response
                this.tokenResponse = response.token;
                
                // Update balance in store if provided
                if (response.balance !== undefined) {
                    this.$store.balance = response.balance;
                }
                
                // Show success message
                this.$toast({
                    title: 'Success',
                    description: 'Token purchased successfully',
                    variant: 'default'
                });
            } catch (error) {
                console.error('Error purchasing token:', error);
                // Show error message
                this.$toast({
                    title: 'Error',
                    description: error.message || 'Failed to purchase token. Please try again.',
                    variant: 'destructive'
                });
            } finally {
                this.isPurchasing = false;
            }
        },
        finishPurchase() {
            // Reset token response
            this.tokenResponse = null;
            // Close dialog
            this.showTokenDialog = false;
            // Reset form
            this.tokenAmount = '';
            // Refresh token history to show the new token
            this.fetchTokenHistory();
            // Also refresh meter info to get updated balance
            this.fetchMeterInfo();
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
                minimumFractionDigits: 2
            }).format(amount || 0);
        },
        formatDate(dateString) {
            if (!dateString) return 'Not available';
            
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        getMeterType(type) {
            if (!type) return 'Not specified';
            
            const types = {
                'elect': 'Electricity',
                'water': 'Water',
                'gas': 'Gas'
            };
            
            return types[type] || type;
        },
        getTokenStatusClass(status) {
            switch(status) {
                case 'Applied':
                    return 'bg-green-100 text-green-600';
                case 'Pending':
                    return 'bg-yellow-100 text-yellow-600';
                case 'Expired':
                    return 'bg-red-100 text-red-600';
                default:
                    return 'bg-blue-100 text-blue-600';
            }
        },
        getTokenStatusIcon(status) {
            switch(status) {
                case 'Applied':
                    return 'lucide:check';
                case 'Pending':
                    return 'lucide:clock';
                case 'Expired':
                    return 'lucide:x';
                default:
                    return 'lucide:ticket';
            }
        },
        getTokenBadgeVariant(status) {
            switch(status) {
                case 'Applied':
                    return 'success';
                case 'Pending':
                    return 'warning';
                case 'Expired':
                    return 'destructive';
                default:
                    return 'outline';
            }
        },
        formatDateForAPI(date) {
            return date.toISOString().split('T')[0];  // Returns YYYY-MM-DD format
        }
    }
}
</script>