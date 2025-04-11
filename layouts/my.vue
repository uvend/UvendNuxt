<template>
    <div class="grid-container">
        <aside class="hidden md:block p-4 bg-blue-500 min-h-screen" :style="{ backgroundColor: bgColor, color: fontColor }">
            <nav>
                <MyLogo />
                <NuxtLink class="menu-item  flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium" @click="navigateTo(`/my/${$route.params.customer_id}/transactions`)">
                    <Icon name="lucide:credit-card" class="mr-2 h-5 w-5"/>
                    <p class="">Transactions</p>
                </NuxtLink>
                <NuxtLink class="menu-item flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium" @click="navigateTo(`/my/${$route.params.customer_id}/meters`)">
                    <Icon name="lucide:gauge" class="mr-2 h-5 w-5"/>
                    <p class="">Meters</p>
                </NuxtLink>
                <NuxtLink class="menu-item flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium" @click="navigateTo(`/my/${$route.params.customer_id}/statement`)">
                    <Icon name="lucide:chart-bar-big" class="mr-2 h-5 w-5"/>
                    <p class="">Statement</p>
                </NuxtLink>
            </nav>
            <ul>
            </ul>
        </aside>
        <main class="hide-scrollbar">
            <header class="flex justify-between items-center py-2 px-4">
                <div>
                    <div>
                        <p class="title font-bold">
                            {{ title }}
                        </p>
                    </div>
                </div>
                <MyUserMenu />
            </header>
            <div class="scroll hide-scrollbar bg-gray-50">
                <slot />
            </div>
        </main>
    </div>
</template>
<script>
export default{
    data(){
        return {
        }
    },
    computed:{
        title(){
            const route = this.$route.path.split('/')
            if(route.at(-2) === 'meters'){
                return this.$store.pageTitle;
            }
            return route.at(-1)
        },
        bgColor(){
            return `#${APP_BG_2?.replace('#', '') || '1287c9'}`
        },
        fontColor(){
            return `#${APP_FONT_COLOR_2?.replace('#', '') || 'ffffff'}`
        }
    }

}
</script>

<style scoped>
.title{
    text-transform: capitalize;
}
.sidebar {
    padding: 10px; /* Padding for sidebar content */
}

.scroll {
    padding: 20px; /* Padding for main content */
    overflow: scroll;
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
</style>