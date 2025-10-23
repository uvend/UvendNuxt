<template>
  <div class="relative">
    <!-- User Icon Button -->
    <button 
      @click="toggleDropdown"
      class="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
    >
      <Icon name="lucide:user" class="w-5 h-5" />
    </button>

    <!-- Dropdown Menu - Using fixed positioning -->
    <Teleport to="body">
      <div 
        v-if="isOpen"
        class="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48"
        :style="dropdownStyle"
      >
        <!-- User Info Section -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-900">User Account</p>
          <p class="text-xs text-gray-500">Manage your account</p>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <!-- Logout Option -->
          <button
            @click="handleLogout"
            class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            <Icon name="lucide:log-out" class="w-4 h-4 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Overlay to close dropdown when clicking outside -->
    <Teleport to="body">
      <div 
        v-if="isOpen"
        @click="closeDropdown"
        class="fixed inset-0 z-[9998]"
      ></div>
    </Teleport>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      buttonRect: null
    }
  },
  
  computed: {
    dropdownStyle() {
      if (!this.buttonRect) return {}
      
      return {
        top: `${this.buttonRect.bottom + 8}px`,
        right: `${window.innerWidth - this.buttonRect.right}px`,
        zIndex: 9999
      }
    }
  },
  methods: {
    toggleDropdown(event) {
      if (!this.isOpen) {
        // Capture button position when opening
        this.buttonRect = event.target.closest('button').getBoundingClientRect()
      }
      this.isOpen = !this.isOpen
    },
    
    closeDropdown() {
      this.isOpen = false
    },
    
    async handleLogout() {
      try {
        // Clear local storage
        localStorage.removeItem('wallet-access-token')
        localStorage.removeItem('wallet-refresh-token')
        
        // Show success message
        this.$toast({
          title: 'Logged out successfully',
          description: 'You have been logged out of your account',
          variant: 'default'
        })
        
        // Close dropdown
        this.closeDropdown()
        
        // Navigate to login page
        await navigateTo('/wallet/login')
        
      } catch (error) {
        console.error('Logout error:', error)
        this.$toast({
          title: 'Error',
          description: 'There was an error logging out. Please try again.',
          variant: 'destructive'
        })
      }
    }
  },
  
  mounted() {
    // Close dropdown when pressing escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown()
      }
    })
  },
  
  beforeUnmount() {
    // Clean up event listener
    document.removeEventListener('keydown', this.closeDropdown)
  }
}
</script>

<style scoped>
/* Custom dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
