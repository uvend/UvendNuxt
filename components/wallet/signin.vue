<template>
    <Card class="p-4 m-4 w-[400px] max-w-full">
        <CardHeader>
            <h1 class="font-bold text-2xl">Sign in</h1>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
            <div>
                <Label>Email</Label>
                <Input type="text"/>
            </div>
            <div>
                <Label>Password</Label>
                <Input type="password"/>
            </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
            <Button class="w-full">Sign in</Button>
            <p @click="$emit('changeState')">New? Create account</p>
        </CardFooter>
    </Card>
</template>
<script>

</script>