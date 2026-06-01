<template>
<AlertDialog>
    <AlertDialogTrigger as-child>
        <Button class="flex items-center gap-2">
            <Icon name="lucide:shield-check" class="w-5 h-5"/>
            Finalise
        </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently settle the batch.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="settle()">Continue</AlertDialogAction>
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
            comment: null,
            isOpen: false
        }
    },
    methods:{
        async settle(){
            const result = await useAuthFetch(`${API_URL}/AdminSystem/TransactionBatchPayment/FinalisePaymentBatch`,{
                method: "POST",
                body: {
                    "settlementComment": "",
                    "paymentBatchID": this.batch
                }
            })
            console.log(result);
            this.$router.go(0)
        }
    }
}
</script>