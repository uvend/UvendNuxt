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
import { batchService } from '~/services/batch'

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
        async mail(){
            this.sending = true
            try {
                const result = await batchService.sendBatchEmail(this.batch, { logOnly: false })

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
