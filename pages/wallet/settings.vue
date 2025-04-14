<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Wallet Settings</h1>
      <div class="flex items-center space-x-4">
        <Button @click="showAddCard = true">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add New Card
        </Button>
        <Button variant="outline" @click="logout">
          <LogOutIcon class="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>

    <!-- Cards List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="card in cards" :key="card.id" class="relative">
        <CardHeader>
          <CardTitle>{{ card.cardName }}</CardTitle>
          <CardDescription>{{ card.cardType }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <p class="font-mono">**** **** **** {{ card.cardNumber.slice(-4) }}</p>
            <p class="text-sm text-muted-foreground">Expires: {{ card.expiryDate }}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" size="sm" @click="removeCard(card.id)">
            Remove Card
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Add Card Dialog -->
    <AddCardDialog
      v-model:open="showAddCard"
      @submit="handleAddCard"
    />
  </div>
</template>

<script>
definePageMeta({
    layout: 'wallet'
})
export default{
    methods:{
        logout(){
            localStorage.clear()
            navigateTo("/");
        }
    }
}
</script>