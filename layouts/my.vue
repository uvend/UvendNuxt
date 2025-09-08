<template>
    <div class="flex h-screen">
        <aside 
            class="hidden md:block bg-gradient-to-b from-blue-600 to-blue-700 min-h-screen transition-all duration-300 ease-in-out flex-shrink-0 relative flex flex-col shadow-xl" 
            :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'w-64' : 'w-20'"
            :style="{ backgroundColor: bgColor, color: fontColor }"
            @mouseenter="handleSidebarHover(true)"
            @mouseleave="handleSidebarHover(false)"
        >
            <!-- Logo Section -->
            <div class="flex items-center justify-between p-6 border-b border-blue-500/30">
                <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex items-center gap-4">
                    <!-- U-Vend Logo Text -->
                    <div class="flex items-center gap-3">
                        <h1 class="text-white font-bold text-xl leading-tight tracking-wide" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                            U-Vend
                        </h1>
                        <div class="text-orange-400 font-semibold text-xs leading-tight tracking-wider">
                            <div>PREPAID</div>
                            <div>UTILITIES</div>
                            <div>MANAGEMENT</div>
                        </div>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center mx-auto">
                    <h1 class="text-white font-bold text-lg leading-tight tracking-wide" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        U-Vend
                    </h1>
                </div>
                
                <!-- Pin/Unpin Button -->
                <!-- <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex items-center">
                    <button 
                        @click="togglePin"
                        class="text-blue-100 hover:text-white hover:bg-blue-500/50 p-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        :title="isPinned ? 'Unpin sidebar' : 'Pin sidebar'"
                    >
                        <Icon 
                            :name="isPinned ? 'lucide:pin' : 'lucide:pin-off'" 
                            class="h-4 w-4"
                        />
                    </button>
                </div> -->
            </div>
            
            <!-- Navigation Menu -->
            <nav class="flex-1 p-4 space-y-2">
                <!-- Dashboard -->
                <NuxtLink 
                    class="menu-item group flex items-center py-3 rounded-xl text-white hover:bg-white/10 hover:shadow-lg font-medium transition-all duration-200" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/dashboard`)"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                        <Icon name="lucide:layout-dashboard" class="h-5 w-5"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Dashboard</span>
                        <span class="text-xs text-blue-200">Overview</span>
                    </div>
                </NuxtLink>
                
                <!-- Transactions -->
                <NuxtLink 
                    class="menu-item group flex items-center py-3 rounded-xl text-white hover:bg-white/10 hover:shadow-lg font-medium transition-all duration-200" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/transactions`)"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                        <Icon name="lucide:receipt" class="h-5 w-5"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Transactions</span>
                        <span class="text-xs text-blue-200">Payment History</span>
                    </div>
                </NuxtLink>
                
                <!-- Meters -->
                <NuxtLink 
                    class="menu-item group flex items-center px-4 py-3 rounded-xl text-white hover:bg-white/10 hover:shadow-lg font-medium transition-all duration-200" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start' : 'justify-center'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/meters`)"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                        <Icon name="lucide:gauge" :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'h-5 w-5' : 'h-5 w-5'"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Meters</span>
                        <span class="text-xs text-blue-200">Manage Devices</span>
                    </div>
                </NuxtLink>
                
                <!-- Statement -->
                <NuxtLink 
                    class="menu-item group flex items-center py-3 rounded-xl text-white hover:bg-white/10 hover:shadow-lg font-medium transition-all duration-200" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/statement`)"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                        <Icon name="lucide:bar-chart-3" class="h-5 w-5"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Statement</span>
                        <span class="text-xs text-blue-200">Reports & Analytics</span>
                    </div>
                </NuxtLink>
                
                <!-- Admin Navigation - Only show for admin users -->
                <div 
                    v-if="isAdmin"
                    class="menu-item group flex items-center py-3 rounded-xl text-white hover:bg-white/10 hover:shadow-lg font-medium transition-all duration-200 cursor-pointer" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start px-4' : 'justify-center px-2'"
                    @click="goToAdmin"
                >
                    <div class="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                        <Icon name="lucide:shield-check" class="h-5 w-5"/>
                    </div>
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex flex-col ml-3">
                        <span class="text-sm font-medium">Admin</span>
                        <span class="text-xs text-blue-200">System Management</span>
                    </div>
                </div>
            </nav>
            
                         <!-- Customer Support Section -->
             <div class="p-4 border-t border-blue-500/30">
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
            <div v-if="isAdmin" class="p-4 border-t border-blue-500/30">
                <!-- User Info (when expanded) -->
                <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="mb-3 p-3 bg-white/5 rounded-lg hover:cursor-pointer"
                    @click="goToCustomerSelection"
                >
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-white/20 rounded-full flex justify-center items-center">
                            <Icon name="lucide:user" class="h-4 w-4 text-white" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-white truncate">Customer Portal</p>
                            <p class="text-xs text-blue-200 truncate">Utility Management</p>
                        </div>
                    </div>
                </div>
                
                <!-- Logout Button -->
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
                        <span class="text-xs text-blue-200">Sign out</span>
                    </div>
                </button>
            </div>
        </aside>
        <main class="flex-1 flex flex-col bg-gray-50">
            <div class="flex-1 overflow-auto">
                <slot />
            </div>
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
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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