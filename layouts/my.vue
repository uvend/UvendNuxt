<template>
    <div class="grid-container">
        <aside class="flex flex-col sidebar hide-scrollbar justify-between">
            <ul>
                <div>
                </div>
                <li class="menu-item" @click="navigateTo(`/my/${customer}/meter`)">Meters</li>
                <li class="menu-item" @click="navigateTo(`/my/${customer}/transaction`)">Transactions</li>
                <li class="menu-item" @click="navigateTo(`/my/${customer}/statement`)">Statement</li>
            </ul>
            <ul>
                <li class="menu-item" @click="useLogout()">Logout</li>
            </ul>
        </aside>
        <main class="content hide-scrollbar">
            <!-- Main content goes here -->
            <slot />
        </main>
    </div>
</template>
<script>
export default{
    data(){
        return {
            customer: null
        }
    },
    mounted(){
        this.customer = this.$route.params.customer_id;
    }
}
</script>

<style scoped>
.grid-container {
    display: grid;
    grid-template-columns: 250px 1fr; /* Sidebar width and main content */
    grid-template-rows: auto; /* Adjusts to content height */
    height: 100vh; /* Full viewport height */
}

.sidebar {
    background-color: #f4f4f4; /* Light gray background for sidebar */
    padding: 10px; /* Padding for sidebar content */
}

.content {
    padding: 20px; /* Padding for main content */
    background-color: #fff; /* White background for content */
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
}
.menu-item:hover{
    background: #d4d4d4;
}
</style>