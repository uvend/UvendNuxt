<template>
    <div class="flex h-screen">
        <aside 
            class="hidden md:block p-4 bg-blue-500 min-h-screen transition-all duration-300 ease-in-out flex-shrink-0 relative" 
            :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'w-64' : 'w-16'"
            :style="{ backgroundColor: bgColor, color: fontColor }"
            @mouseenter="handleSidebarHover(true)"
            @mouseleave="handleSidebarHover(false)"
        >
            <nav>
                <div class="flex items-center justify-between mb-6">
                    <!-- <MyLogo v-if="(sidebarExpanded || (isHovered && !isPinned))" />
                    <div v-else class="w-8 h-8 bg-white rounded flex items-center justify-center">
                        <span class="text-blue-500 font-bold text-sm">U</span>
                    </div> -->
                    <div v-if="(sidebarExpanded || (isHovered && !isPinned))" class="flex items-center gap-1">
                        <button 
                            @click="togglePin"
                            class="text-white hover:bg-blue-600 p-1 rounded transition-colors"
                            :title="isPinned ? 'Unpin sidebar' : 'Pin sidebar'"
                        >
                            <Icon 
                                :name="isPinned ? 'lucide:pin' : 'lucide:pin-off'" 
                                class="h-4 w-4"
                            />
                        </button>
                        <!-- <button 
                            @click="toggleSidebar" 
                            class="text-white hover:bg-blue-600 p-1 rounded transition-colors"
                            :title="sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'"
                        >
                            <Icon 
                                :name="sidebarExpanded ? 'lucide:chevron-left' : 'lucide:chevron-right'" 
                                class="h-4 w-4"
                            />
                        </button> -->
                    </div>
                </div>
                
                <NuxtLink 
                    class="menu-item flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium transition-all" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start' : 'justify-center'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/dashboard`)"
                >
                    <Icon name="lucide:layout-dashboard" :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'mr-2 h-5 w-5' : 'h-5 w-5'"/>
                    <p v-if="(sidebarExpanded || (isHovered && !isPinned))" class="whitespace-nowrap">Dashboard</p>
                </NuxtLink>
                
                <NuxtLink 
                    class="menu-item flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium transition-all" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start' : 'justify-center'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/transactions`)"
                >
                    <Icon name="lucide:credit-card" :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'mr-2 h-5 w-5' : 'h-5 w-5'"/>
                    <p v-if="(sidebarExpanded || (isHovered && !isPinned))" class="whitespace-nowrap">Transactions</p>
                </NuxtLink>
                
                <NuxtLink 
                    class="menu-item flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium transition-all" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start' : 'justify-center'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/meters`)"
                >
                    <Icon name="lucide:gauge" :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'mr-2 h-5 w-5' : 'h-5 w-5'"/>
                    <p v-if="(sidebarExpanded || (isHovered && !isPinned))" class="whitespace-nowrap">Meters</p>
                </NuxtLink>
                
                <NuxtLink 
                    class="menu-item flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 font-medium transition-all" 
                    :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'justify-start' : 'justify-center'"
                    @click="navigateTo(`/my/${$route.params.customer_id}/statement`)"
                >
                    <Icon name="lucide:chart-bar-big" :class="(sidebarExpanded || (isHovered && !isPinned)) ? 'mr-2 h-5 w-5' : 'h-5 w-5'"/>
                    <p v-if="(sidebarExpanded || (isHovered && !isPinned))" class="whitespace-nowrap">Statement</p>
                </NuxtLink>
            </nav>
            <ul>
            </ul>
        </aside>
        <main class="flex-1 flex flex-col bg-gray-50">
            <!-- <header class="flex justify-between items-center py-2 px-4 bg-white border-b">
                <div>
                    <div>
                        <p class="title font-bold">
                            {{ title }}
                        </p>
                    </div>
                </div>
                <MyUserMenu />
            </header> -->
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
            isPinned: false,
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
    },
    

}
</script>

<style scoped>
.title{
    text-transform: capitalize;
}
.menu-item{
    width: 100%;
    border-radius: 0.25rem;
    padding: 8px 10px;
    cursor: pointer;
    align-items: center;
    transition: all 0.3s ease;
}
.menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>