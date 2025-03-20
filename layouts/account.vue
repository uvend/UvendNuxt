<template>
    <div class="grid-container">
        <aside class="flex flex-col sidebar hide-scrollbar justify-between bg-sky-900">
            <ul>
                <div class="logo-container">
                    <img src="/UVendlogo-Better.png"/>
                </div>
                <li class="menu-item" @click="navigateTo('/admin/account/payments')"><Icon name="lucide:wallet-cards"/><p class="text-sm">Payments</p></li>
                <li class="menu-item" @click="navigateTo('/admin/account/batch')"><Icon name="lucide:landmark"/><p class="text-sm">Bank Batch</p></li>
                <li class="menu-item" @click="navigateTo('/admin/account/rollback')"><Icon name="lucide:rotate-ccw"/><p class="text-sm">Rollback</p></li>
            </ul>
            <ul>
            </ul>
        </aside>
        <main class="">
            <header class="flex justify-between items-center py-2 px-4">
                <div></div>
                <MyUserMenu />
            </header>
            <div class="scroll hide-scrollbar bg-gray-50">
                <slot class="overflow-y hide-scrollbar bg-gray-100"/>
            </div>
            <!-- Main content goes here -->
        </main>
    </div>
</template>

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

.scroll {
    padding: 20px; /* Padding for main content */
    overflow-y: auto; /* Enable vertical scrolling */
    height: calc(100vh - var(--header-height)); /* Use the CSS variable */
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

.logo-container{
    padding: 10px;
}

</style>