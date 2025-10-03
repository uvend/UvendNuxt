<template>
    <Card class="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50/20 border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
        <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                    <Icon name="lucide:repeat" class="h-4 w-4 text-purple-600"/>
                </div>
                <CardTitle class="text-lg font-bold text-gray-900">Buy Again</CardTitle>
            </div>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- Electricity Purchase -->
            <div class="group/item relative overflow-hidden bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                            <Icon name="lucide:zap" class="h-5 w-5 text-yellow-600"/>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm font-bold text-gray-900">Electricity</p>
                            <p class="text-xs text-gray-600 font-medium">Main House</p>
                            <p class="text-xs text-gray-500 font-mono">ELE-123456789</p>
                            <div class="flex items-center gap-1 mt-1">
                                <div class="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                <p class="text-xs font-semibold text-gray-700">Last: R 150.00</p>
                            </div>
                        </div>
                    </div>
                    <Button 
                        class="group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        @click="handlePurchase('electricity')"
                    >
                        <span class="relative z-10 flex items-center gap-1">
                            <Icon name="lucide:shopping-cart" class="h-3 w-3"/>
                            Purchase
                        </span>
                        <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                </div>
                <!-- Subtle gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-yellow-100/20 pointer-events-none"></div>
            </div>

            <!-- Water Purchase -->
            <div class="group/item relative overflow-hidden bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                            <Icon name="lucide:droplet" class="h-5 w-5 text-blue-600"/>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm font-bold text-gray-900">Water</p>
                            <p class="text-xs text-gray-600 font-medium">Main House</p>
                            <p class="text-xs text-gray-500 font-mono">WAT-111222333</p>
                            <div class="flex items-center gap-1 mt-1">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                <p class="text-xs font-semibold text-gray-700">Last: R 85.50</p>
                            </div>
                        </div>
                    </div>
                    <Button 
                        class="group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        @click="handlePurchase('water')"
                    >
                        <span class="relative z-10 flex items-center gap-1">
                            <Icon name="lucide:shopping-cart" class="h-3 w-3"/>
                            Purchase
                        </span>
                        <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                </div>
                <!-- Subtle gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-100/20 pointer-events-none"></div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup>
function handlePurchase(type) {
    // Navigate to payments screen with utility type
    navigateTo(`/wallet/payments?utility=${type}`)
}
</script>
