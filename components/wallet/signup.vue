<template>
    <Card class="p-4 m-4 w-[400px] max-w-full">
        <CardHeader>
            <h1 class="font-bold text-2xl">Sign up</h1>
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
            <Button class="w-full">Create account</Button>
            <p @click="$emit('changeState')">Back to login</p>
        </CardFooter>
    </Card>
</template>
<script>

</script>