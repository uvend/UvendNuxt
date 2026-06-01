<template>
  <div v-if="meterAddedSuccessfully">
    Meter added succesfully
  </div>
  <div v-else>
    <Form class="flex flex-col gap-2 p-4">
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
    <DialogFooter class="gap-2" type="button">
    <Button v-if="!isValid" @click="validateMeterNumber()" :disabled="isLoading">
      Next
    </Button>
    <div v-else class="flex gap-2 justify-between">
      <Button @click="isValid = false" type="button">
        Back
      </Button>
      <Button @click="addNewMeter" type="button">
        Add
      </Button>
    </div>
    </DialogFooter>
  </Form>
  </div>
</template>
<script>
export default{
    props: {
        label : {
            type: String,
            default: "add"
        },
        userId: {
            type: String,
            default: null
        },
        accountNumber: {
            type: String,
            default: null
        }
    },
    data(){
        return{
            isLoading: false,
            isValid: false,
            meterNumber: null,
            meterName: null,
            dialogOpen: false,
            meterAddedSuccessfully: false
        } 
    },
    computed: {
        meterApiBase() {
            if (this.accountNumber) {
                return `${WALLET_API_URL}/admin/accounts/${encodeURIComponent(this.accountNumber)}/meter`
            }
            return `${WALLET_API_URL}/meter`
        },
        meterRequestOptions() {
            if (!this.userId) return {}
            return {
                headers: {
                    'X-Wallet-User-Id': this.userId,
                },
            }
        },
    },
    methods:{
        async validateMeterNumber(){
            this.isLoading = true
            const response = await useWalletAuthFetch(`${this.meterApiBase}/valid`, {
                ...this.meterRequestOptions,
                params: {
                    meterNumber : this.meterNumber
                }
            })
            if (response?.error || response?.statusCode >= 400) {
              this.$toast({
                title: 'Uh oh! Something went wrong.',
                description: response?.error || response?.statusText || 'There was a problem with your request.',
                variant: "destructive"
              })
            } else {
              this.isValid = true;
            }
            this.isLoading = false
        },
        async addNewMeter(){
          this.isLoading = true
          const response = await useWalletAuthFetch(this.meterApiBase, {
            ...this.meterRequestOptions,
            method: "POST",
            body: {
              meterNumber : this.meterNumber,
              name: this.meterName,
              favourite: 0
            }
          })
          if(response.id){
            this.dialogOpen = false;
            this.meterAddedSuccessfully = true;
            this.$emit('success')
          }
          this.isLoading = false
        },
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