<template>
    <div class="grid-container">
        <aside class="flex flex-col sidebar hide-scrollbar justify-between">
            <ul>
                <div>
                </div>
                <li class="menu-item" @click="navigateTo(`/my/${$route.params.customer_id}/meter`)">Meters</li>
                <li class="menu-item" @click="navigateTo(`/my/${$route.params.customer_id}/transaction`)">Transactions</li>
                <li class="menu-item" @click="navigateTo(`/my/${$route.params.customer_id}/statement`)">Statement</li>
            </ul>
            <ul>
                <li class="menu-item" @click="useLogout()">Logout</li>
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
    background-color: #f4f4f4; /* Light gray background for sidebar */
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

.menu-item:hover{
    background: #d4d4d4;
}
</style>