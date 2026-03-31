<template>
    <div class="flex h-screen">
        <aside 
            class="hidden md:block min-h-screen transition-all duration-300 ease-in-out flex-shrink-0 relative flex flex-col shadow-xl" 
            :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'w-64' : 'w-20'"
            style="background-color: #1a1a5e; color: #ffffff;"
            @mouseenter="handleSidebarHover(true)"
            @mouseleave="handleSidebarHover(false)"
        >
            <!-- Logo Section -->
            <div class="flex items-center justify-center p-4 border-b border-yellow-500/20">
                <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex items-center justify-center w-full">
                    <img src="/Dethro.jpg" alt="Dethro Technology" class="h-20 w-auto rounded" />
                </div>
                <div v-else class="flex items-center justify-center w-full">
                    <img src="/Dethro.jpg" alt="Dethro Technology" class="h-12 w-12 rounded object-cover" />
                </div>
            </div>
            
            <!-- Navigation Menu -->
            <nav class="flex-1 p-4 space-y-2">
                <!-- Dashboard -->
                <NuxtLink 
                    class="menu-item group flex items-center py-3 rounded-xl text-white hover:bg-yellow-500/10 hover:shadow-lg font-medium transition-all duration-200" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/dashboard`)"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-yellow-500/15 rounded-lg group-hover:bg-yellow-500/25 transition-colors">
                        <Icon name="lucide:layout-dashboard" class="h-5 w-5 text-yellow-400"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Dashboard</span>
                        <span class="text-xs text-yellow-300/70">Overview</span>
                    </div>
                </NuxtLink>
                
                <!-- Transactions -->
                <NuxtLink 
                    class="menu-item group flex items-center py-3 rounded-xl text-white hover:bg-yellow-500/10 hover:shadow-lg font-medium transition-all duration-200" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/transactions`)"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-yellow-500/15 rounded-lg group-hover:bg-yellow-500/25 transition-colors">
                        <Icon name="lucide:receipt" class="h-5 w-5 text-yellow-400"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Transactions</span>
                        <span class="text-xs text-yellow-300/70">Payment History</span>
                    </div>
                </NuxtLink>
                
                <!-- Meters -->
                <NuxtLink 
                    class="menu-item group flex items-center px-4 py-3 rounded-xl text-white hover:bg-yellow-500/10 hover:shadow-lg font-medium transition-all duration-200" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start' : 'justify-center'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/meters`)"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-yellow-500/15 rounded-lg group-hover:bg-yellow-500/25 transition-colors">
                        <Icon name="lucide:gauge" class="h-5 w-5 text-yellow-400"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Meters</span>
                        <span class="text-xs text-yellow-300/70">Manage Devices</span>
                    </div>
                </NuxtLink>
                
                <!-- Statement -->
                <NuxtLink 
                    class="menu-item group flex items-center py-3 rounded-xl text-white hover:bg-yellow-500/10 hover:shadow-lg font-medium transition-all duration-200" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/statement`)"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-yellow-500/15 rounded-lg group-hover:bg-yellow-500/25 transition-colors">
                        <Icon name="lucide:bar-chart-3" class="h-5 w-5 text-yellow-400"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Statement</span>
                        <span class="text-xs text-yellow-300/70">Reports & Analytics</span>
                    </div>
                </NuxtLink>
                
                <!-- Admin Navigation - Only show for admin users -->
                <div 
                    v-if="isAdmin"
                    class="menu-item group flex items-center py-3 rounded-xl text-white hover:bg-yellow-500/10 hover:shadow-lg font-medium transition-all duration-200 cursor-pointer" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                    @click="goToAdmin"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-yellow-500/15 rounded-lg group-hover:bg-yellow-500/25 transition-colors">
                        <Icon name="lucide:shield-check" class="h-5 w-5 text-yellow-400"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Admin</span>
                        <span class="text-xs text-yellow-300/70">System Management</span>
                    </div>
                </div>
            </nav>
            
            <!-- Customer Support Section -->
            <div class="p-4 border-t border-yellow-500/20">
                <NuxtLink 
                    href="https://wa.me/27833147484" 
                    target="_blank" 
                    rel="noopener"
                    class="menu-item group flex items-center py-3 rounded-xl text-white bg-green-600/20 hover:bg-green-500/30 hover:shadow-lg font-medium transition-all duration-200 w-full" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-green-500/30 rounded-lg group-hover:bg-green-400/40 transition-colors">
                        <Icon name="lucide:message-circle" class="h-5 w-5"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Customer Support</span>
                        <span class="text-xs text-green-200">WhatsApp Chat</span>
                    </div>
                </NuxtLink>
            </div>
            
            <!-- User Section at Bottom -->
            <div v-if="isAdmin" class="p-4 border-t border-yellow-500/20">
                <!-- User Info (when expanded) -->
                <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="mb-3 p-3 bg-white/5 rounded-lg hover:cursor-pointer"
                    @click="goToCustomerSelection"
                >
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-yellow-500/20 rounded-full flex justify-center items-center">
                            <Icon name="lucide:user" class="h-4 w-4 text-yellow-400" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-white truncate">Customer Portal</p>
                            <p class="text-xs text-yellow-300/70 truncate">Utility Management</p>
                        </div>
                    </div>
                </div>
                
                <!-- Logout Button -->
            </div>
            <button 
                class="menu-item group flex items-center py-3 rounded-xl text-white hover:bg-red-500/20 hover:shadow-lg font-medium transition-all duration-200 w-full" 
                :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                @click="logout"
            >
                <div class="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                    <Icon name="lucide:log-out" class="h-5 w-5"/>
                </div>
                <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                    <span class="text-sm font-medium">Logout</span>
                    <span class="text-xs text-yellow-300/70">Sign out</span>
                </div>
            </button>
        </aside>
        <main class="flex-1 flex flex-col bg-gray-50">
            <div class="flex-1 overflow-auto">
                <slot />
            </div>
            <InactiveMetersPopupTrigger v-if="$route.params.customer_id" />
        </main>
    </div>
</template>
<script>
export default{
    data(){
        return {
            sidebarExpanded: true,
            isPinned: true,
            isHovered: false
        }
    },
    methods:{
        toggleSidebar(){
            this.sidebarExpanded = !this.sidebarExpanded;
        },
        togglePin(){
            this.isPinned = !this.isPinned;
        },
        handleSidebarHover(hovered){
            console.log('Hover state:', hovered, 'Pinned:', this.isPinned);
            this.isHovered = hovered;
            if (!this.isPinned) {
                if (hovered) {
                    this.sidebarExpanded = true;
                } else {
                    this.sidebarExpanded = false;
                }
            }
            console.log('Sidebar expanded:', this.sidebarExpanded);
        },
        goToAdmin() {
            // Store the current customer ID before navigating to admin
            const currentCustomerId = this.$route.params.customer_id;
            if (currentCustomerId) {
                localStorage.setItem('lastCustomerId', currentCustomerId);
            }
            this.$router.push('/admin/account');
        },
        goToCustomerSelection(){
            this.$router.push('/')
        },
        logout() {
            // Clear customer data and navigate to login
            localStorage.removeItem('customer');
            localStorage.removeItem('lastCustomerId');
            this.$router.push('/login');
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
        },
        isAdmin(){
            if (process.client) {
                const customer = localStorage.getItem('customer')
                return customer === 'admin'
            }
            return false
        }
    },
    

}
</script>

<style scoped>
.title{
    text-transform: capitalize;
}

.menu-item{
    width: 100%;
    cursor: pointer;
    align-items: center;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.menu-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    transition: width 0.2s ease;
}

.menu-item:hover::before {
    width: 100%;
}

.menu-item:hover {
    transform: translateX(2px);
}

/* Active state for current page */
.menu-item.router-link-active {
    background: rgba(212, 175, 55, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-item.router-link-active::before {
    width: 100%;
}

/* Smooth transitions for sidebar expansion */
aside {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

/* Custom scrollbar for nav if needed */
nav {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

nav::-webkit-scrollbar {
    width: 4px;
}

nav::-webkit-scrollbar-track {
    background: transparent;
}

nav::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}
</style>