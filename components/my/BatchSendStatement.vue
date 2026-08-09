<template>
<AlertDialog>
    <AlertDialogTrigger as-child>
        <Button class="flex items-center gap-2" :disabled="sending">
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
            <AlertDialogCancel :disabled="sending">Cancel</AlertDialogCancel>
            <AlertDialogAction :disabled="sending" @click.prevent="mail()">Continue</AlertDialogAction>
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
            sending: false,
        }
    },
    methods:{
        statementApiBase() {
            return (typeof STATEMENT_API === 'string' ? STATEMENT_API : '').replace(/\/$/, '')
        },
        async mail(){
            const base = this.statementApiBase()
            if (!base) {
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'Statement API is not configured.',
                    variant: 'destructive'
                })
                return
            }

            this.sending = true
            try {
                const result = await useAuthFetch(`${base}/statement/send-batch-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        batchId: this.batch,
                        logOnly: false
                    }
                })

                this.$toast({
                    title: 'Success',
                    description: `Queued ${result?.queuedCount ?? 0} statement emails.`,
                    variant: 'success'
                })
            } catch (error) {
                const message = error?.data?.message || error?.message || 'There was a problem with your request.'
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: message,
                    variant: 'destructive'
                })
            } finally {
                this.sending = false
            }
        }
    }
}
</script>
