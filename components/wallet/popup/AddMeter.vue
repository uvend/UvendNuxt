<template>
    <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <Button class="w-full sm:w-auto">
        {{ label }}
      </Button>
    </DialogTrigger>
    <DialogContent class="h-full sm:max-w-[425px] sm:h-auto">
      <div>
        <div class="">
          <div class="flex flex-col gap-2">
            <Label for="name" class="text-sm">
              Meter Number
            </Label>
            <Input v-model="meterNumber" class="col-span-3" :disabled="isValid"/>
          </div>
        </div>
        <div v-if="isValid">
          <div class="gap-2">
            <Label for="name" class="text-sm">
              Name
            </Label>
            <Input v-model="meterName" class="col-span-3" />
          </div>
        </div>
      </div>
      <DialogFooter v-if="!isValid" class="gap-2">
        <Button @click="validateMeterNumber()" :disabled="isLoading">
          Next
        </Button>
      </DialogFooter>
      <DialogFooter v-else class="gap-2">
        <Button @click="isValid = false">
          Back
        </Button>
        <Button @click="saveMeter()">
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script>
export default{
    props: {
        label : {
            type: String,
            default: "add"
        }
    },
    data(){
        return{
            isLoading: false,
            isValid: false,
            meterNumber: null,
            meterName: null,
            dialogOpen: false
        } 
    },
    methods:{
        async validateMeterNumber(){
            this.isLoading = true
            const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/valid`,{
                params: {
                    meterNumber : this.meterNumber
                }
            })
            if(!response){
              this.isValid = true;
            }else{
              this.$toast({
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem with your request.',
                variant: "destructive"
              })
            }
            this.isLoading = false
        },
        async saveMeter(){
          this.isLoading = true
          const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter`, {
            method: "POST",
            body: {
              meterNumber : this.meterNumber,
              name: this.meterName
            }
          })
          if(response.id){
            this.dialogOpen = false;
            this.$emit('success')
          }
          this.isLoading = false
        }
    },
    watch: {
    dialogOpen(newVal) {
      if (!newVal) {
        // Reset form when dialog closes
        this.meterNumber = null;
        this.meterName = null;
        this.isValid = false;
      }
    }
  }
}
</script>
<style>
</style>