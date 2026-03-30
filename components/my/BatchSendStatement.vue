<template>
<AlertDialog>
    <AlertDialogTrigger as-child>
        <Button class="flex items-center gap-2">
            <Icon name="lucide:send" class="w-5 h-5"/>
            Send Statement
        </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will mail the statement to all payments on the batch.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="mail()">Continue</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
</template>
<script>
export default{
    props:{
        batch: String
    },
    data(){
        return {
        }
    },
    methods:{
        async mail(){
            const result = await useAuthFetch(`https://9xcqber3p3.execute-api.af-south-1.amazonaws.com/prod/qstatement`,{
                method: "POST",
                body: {
                    "batchId": this.batch
                }
            })
            console.log(result);
            this.$toast({
                title: 'Success',
                variant: "success"
            });

        }
    }
}
</script>