<template>
    <div class="grid-container">
        <aside class="flex flex-col sidebar hide-scrollbar justify-between" :style="{ backgroundColor: bgColor, color: fontColor }">
            <nav>
                <MyLogo />
                <NuxtLink class="menu-item">
                    <Icon name="lucide:shield" class="mr-2 h-5 w-5" />
                    <p class="">Accounts</p>
                </NuxtLink>
                <nav class="sub-group">
                    <NuxtLink class="menu-item flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium" @click="navigateTo('/admin/account/payments')">
                        <Icon name="lucide:wallet-cards" class="mr-2 h-5 w-5" />
                        <p class="">Payments</p>
                    </NuxtLink>
                    <NuxtLink class="menu-item flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium" @click="navigateTo('/admin/account/batch')">
                        <Icon name="lucide:layers" class="mr-2 h-5 w-5" />
                        <p class="">Payment Batch</p>
                    </NuxtLink>
                </nav>
                <nav v-if="mpesaUrl">
                    <NuxtLink class="menu-item flex items-center px-3 py-2 rounded-md text-white font-medium" >
                        <Icon name="lucide:smartphone-charging" class="mr-2 h-5 w-5" />
                        <p class="">Mpesa</p>
                    </NuxtLink>
                    <nav class="sub-group">
                        <!--<li class="menu-item" @click="navigateTo('/admin/mpesa/transactions')"><Icon name="lucide:arrow-right-left"/><p class="text-sm">Transactions</p></li>-->
                        <NuxtLink class="menu-item flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium" @click="navigateTo('/admin/mpesa/requests')">
                            <Icon name="lucide:arrow-right-left" class="mr-2 h-5 w-5" />
                            <p class="">Requests</p>
                        </NuxtLink>
                    </nav>
                </nav>
            </nav>
            <ul>
            </ul>
        </aside>
        <main class="">
            <header class="flex justify-between items-center py-2 px-4">
                <div></div>
                <MyUserMenu />
            </header>
            <div class="scroll hide-scrollbar bg-gray-50 p-4">
                <slot class="overflow-y hide-scrollbar bg-gray-100"/>
            </div>
            <!-- Main content goes here -->
        </main>
    </div>
</template>
<script>
export default{
    data(){
        return{
            mpesaUrl: false
        }
    },
    mounted(){
        if(MPESA_URL != ""){
            this.mpesaUrl = true;
        }
    },
    computed:{
        bgColor(){
            return `#${APP_BG_3?.replace('#', '') || '0c4a6e'}`
        },
        fontColor(){
            return `#${APP_FONT_COLOR_1?.replace('#', '') || 'ffffff'}`
        }
    }

}
</script>
<style scoped>
:root {
    --header-height: 60px; /* Define the header height */
}

main {
    display: grid;
    grid-template-rows: auto 1fr; /* Adjusted to allow content to take remaining space */
    height: 100vh; /* Full viewport height */
}
.grid-container {
    display: grid;
    grid-template-columns: 250px 1fr; /* Sidebar width and main content */ /* Adjusts to content height */
    height: 100vh; /* Full viewport height */
    overflow: hidden;
}

.sidebar {
    padding: 10px; /* Padding for sidebar content */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
.hide-scrollbar {
    scrollbar-width: none; /* Firefox */
}
.menu-item{
    width: 100%;
    border-radius: 0.25rem;
    padding: 8px 10px;
    cursor: pointer;
    display: grid;
    grid-template-columns: auto 1fr; /* 1 part first column, 3 parts second column */
    gap:10px;
    align-items: center;
}

.logo-container{
    padding: 10px;
}
.sub-group{
    padding-left: 25px;
}
</style>