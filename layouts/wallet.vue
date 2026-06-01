<template>
    <div v-if="isNavOpen"
        @click="toggleNav"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300">
    </div>
    <div class="flex min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-orange-50">
        <aside class="flex flex-col justify-between bg-gradient-to-b from-blue-600 to-blue-700 min-h-screen shadow-xl"
            :class="[
                !isMobile ? 'w-64 p-4' : '',
                isMobile && !isNavOpen ? 'w-0 p-0 overflow-hidden' : '',
                isMobile && isNavOpen ? 'w-64 p-4 fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : ''
            ]">
            <nav class="space-y-1">
                <MyLogo />
                <NuxtLink to="/" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-500/80 font-semibold transition-colors duration-200" @click="toggleNav">
                    <Icon name="lucide:layout-dashboard" class="mr-2 h-5 w-5" />
                    Dashboard
                </NuxtLink>
                <NuxtLink to="/transactions" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-500/80 font-semibold transition-colors duration-200" @click="toggleNav">
                    <Icon name="lucide:credit-card" class="mr-2 h-5 w-5" />
                    Transaction History
                </NuxtLink>
                <NuxtLink to="/meters" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-500/80 font-semibold transition-colors duration-200" @click="toggleNav">
                    <Icon name="lucide:gauge" class="mr-2 h-5 w-5" />
                    Meters
                </NuxtLink>
                <NuxtLink to="/payments" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-500/80 font-semibold transition-colors duration-200" @click="toggleNav">
                    <Icon name="lucide:wallet" class="mr-2 h-5 w-5" />
                    Payments
                </NuxtLink>
            </nav>
            <nav>
                <NuxtLink to="/settings" class="flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-500/80 font-semibold transition-colors duration-200" @click="toggleNav">
                    <Icon name="lucide:settings" class="mr-2 h-5 w-5" />
                    Settings
                </NuxtLink>
            </nav>
        </aside>
        <div class="flex-1" >
            <main class="">
                <header class="flex justify-between items-center py-4 px-6 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-200">
                    <div>
                        <div>
                            <p class="title font-black text-xl text-gray-800 flex items-center">
                                <Button v-if="isMobile" @click="toggleNav" variant="secondary" class="mr-2" size="sm">
                                    <Icon name="lucide:menu"/>
                                </Button>
                                {{ title }}
                            </p>
                        </div>
                    </div>
                    <WalletPopup buttonLabel="Purchase Token">
                        <WalletBuyNow />
                    </WalletPopup>
                </header>
                <div class="scroll hide-scrollbar" style="max-width: 100vw">
                    <slot class="overflow-y-scroll overflow-x hide-scrollbar w-full max-h-screen"/>
                </div>
            </main>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return {
            isMobile: false,
            isNavOpen: false
        }
    },
    computed:{
        title(){
            const route = this.$route.path.split('/')
            if(route.at(-2) === 'meters'){
                return this.$store.pageTitle;
            }
            if(route.length == 2 && route.at(-1) == 'wallet'){
                return "Dashboard";
            }
            if(route.at(-1) === 'transactions'){
                return "Transaction History";
            }
            return route.at(-1)
        },
        bgColor(){
            return `#${APP_BG_2?.replace('#', '') || '1287c9'}`
        },
        fontColor(){
            return `#${APP_FONT_COLOR_2?.replace('#', '') || 'ffffff'}`
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkMobile)
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth <= 768
        },
        toggleNav(){
            this.isNavOpen = !this.isNavOpen;
        }
    },
    mounted() {
        this.checkMobile()
        window.addEventListener('resize', this.checkMobile)
    },

}
</script>
<style scoped>
.title{
    text-transform: capitalize;
}
</style>