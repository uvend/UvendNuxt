<template>
    <div class="w-full">
        <div 
            class="group relative overflow-hidden rounded-2xl p-4 md:p-6 shadow-xl text-white transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
            :style="{ background: cardBackground }"
        >
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <!-- top row -->
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-white/90 shadow-sm"></div>
                    <p class="text-base font-bold tracking-wide">Uvend Prepaid Utilities</p>
                </div>
                <div class="h-8 w-12 rounded-lg bg-gradient-to-br from-yellow-300 to-amber-500 shadow-inner flex items-center justify-center">
                    <div class="w-6 h-4 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-md shadow-inner"></div>
                </div>
            </div>

            <!-- balance section -->
            <div class="mb-6">
                <p class="text-xs text-white/90 mb-1 font-medium">Available balance</p>
                <p class="text-3xl md:text-4xl font-black tracking-tight">{{ currency }} {{ formattedBalance }}</p>
                <div class="mt-2 flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                    <p class="text-xs text-white/80">Active account</p>
                </div>
            </div>

            <!-- account + action -->
            <div class="flex items-center justify-between">
                <div class="space-y-1">
                    <p class="text-xs text-white/90 font-medium">Account</p>
                    <p class="text-sm tracking-widest font-bold">{{ maskedAccount }}</p>
                </div>
                <button 
                    class="group/btn relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-white/95 text-blue-700 hover:bg-white transition-all duration-300 px-4 py-2 text-xs font-bold shadow-md hover:shadow-lg"
                    @click="handleTopUp"
                >
                    <span class="relative z-10">Top up</span>
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>

            <!-- Enhanced decorative elements -->
            <div class="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
            <div class="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5 blur-2xl"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WalletDebitCard',
    props: {
        balance: { type: Number, default: 1250.75 },
        currency: { type: String, default: 'R' },
        accountLast4: { type: String, default: '3456' },
        bgPrimary: { type: String, default: () => `#${APP_BG_2?.replace('#','') || '1287c9'}` },
        bgSecondary: { type: String, default: () => '#3b5bdb' }
    },
    computed: {
        cardBackground(){
            return `linear-gradient(135deg, ${this.bgPrimary} 0%, ${this.bgSecondary} 70%)`;
        },
        formattedBalance(){
            try{
                return this.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }catch(e){
                return this.balance
            }
        },
        maskedAccount(){
            return `1234 •••• •••• ${this.accountLast4}`
        }
    },
    methods: {
        handleTopUp(){
            // Navigate to payments screen by default
            this.$router.push('/wallet/payments')
        }
    }
}
</script>

<style scoped>
/* Ensure the card looks great on mobile */
</style>
