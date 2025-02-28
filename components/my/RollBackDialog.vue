<template>
<Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
        <Button variant="outline">
            <Icon name="lucide:undo-2"/>
        </Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Rollback comment</DialogTitle>
        <DialogDescription>
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <Input type="text" placeholder="Comment" v-model="comment"/>
      </div>
      <DialogFooter>
        <Button @click="rollback()">
          Rollback
        </Button>
      </DialogFooter>
    </DialogContent>
</Dialog>
</template>
<script>

export default{
    props:{
        batch: Array,
        all: Boolean
    },
    data(){
        return {
            comment: null,
            isOpen: false
        }
    },
    methods:{
        async rollback(){
            console.log(this.comment)
            try{
                this.comment ? this.comment.trim() : '';
                if(this.comment == null || this.comment == ''){
                    //throw new Error("comment is required")
                }
                const batch_id = this.$route.params.batch_id
                let uniqueIdentifications = [];
                this.batch.forEach((payment)=>{
                    console.log(payment)
                    uniqueIdentifications.push(payment.periodTotals.uniqueIdentification)
                })
                //console.log(batch_id, uniqueIdentifications)
                const result = await useAuthFetch(`${API_URL}/AdminSystem/TransactionBatchPayment/RollBackSubmittedPaymentBatch`,{
                    method: "POST",
                    body:{
                        paymentBatchID: batch_id,
                        uniqueIdentifications: uniqueIdentifications,
                        comment: this.comment
                    }
                })
                console.log(result)
                if(this.all){
                    return navigateTo('/admin/account/batch');
                }
                //this.isOpen = false;
                this.refresh()
            }catch(e){
                console.log(e);
                return this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                })
            }
        },
        refresh(){
            //console.log('refresh')
            //this.$emit('refresh')
            this.$router.go(0)
        }
    },
}
</script>