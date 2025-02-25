<template>
    <DropdownMenu>
    <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="rounded-full px-2 py-3">
            <Icon name="lucide:user" class="w-5 h-5"/>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Change Profile</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="useLogout()">Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>