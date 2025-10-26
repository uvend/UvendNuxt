<template>
    <DropdownMenu>
    <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="rounded-full px-2 py-3">
            <Icon name="lucide:user" class="w-5 h-5"/>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <div v-if="isAdmin">
        <DropdownMenuItem @click="navigateTo('/admin/account')">
          <Icon name="lucide:shield" class="mr-2 h-4 w-4" />
          Administration
        </DropdownMenuItem>
        <DropdownMenuItem @click="changeCustomer">
          <Icon name="lucide:users" class="mr-2 h-4 w-4" />
          Change Customer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </div>
      <DropdownMenuItem @click="useLogout()">Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<script>
export default{
  methods: {
    changeCustomer() {
      // Navigate to customer selection page
      this.$router.push('/')
    }
  },
  computed:{
    isAdmin(){
      const customer = localStorage.getItem('customer')
      if(customer === 'admin') return true;
      return false
    }
  }
}
</script>