<template>
    <div class="grid-container">
        <aside class="flex flex-col sidebar hide-scrollbar justify-between">
            <ul>
                <div class="logo-container">
                    <img src="/UVendlogo-Better.png"/>
                </div>
                <li class="menu-item" @click="navigateTo(`/my/${$route.params.customer_id}/transaction`)">
                    <Icon name="lucide:credit-card" />
                    <p class="text-sm">Transactions</p>
                </li>
                <li class="menu-item" @click="navigateTo(`/my/${$route.params.customer_id}/meter`)">
                    <Icon name="lucide:parking-meter"/>
                    <p class="text-sm">Meters</p>
                </li>
                <li class="menu-item" @click="navigateTo(`/my/${$route.params.customer_id}/statement`)">
                    <Icon name="lucide:file-chart-column"/>
                    <p class="text-sm">Statement</p>
                </li>
            </ul>
            <ul>
            </ul>
        </aside>
        <main class="hide-scrollbar">
            <header class="flex justify-between items-center py-2 px-4">
                <div></div>
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

}
</script>

<style scoped>

.sidebar {
    background-color: #1287c9; /* Light gray background for sidebar */
    padding: 10px; /* Padding for sidebar content */
    color: white
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
    color: white;
    display: grid;
    grid-template-columns: auto 1fr; /* 1 part first column, 3 parts second column */
    gap:10px;
    align-items: center;
}
</style>