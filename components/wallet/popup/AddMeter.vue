<template>
    <Dialog>
    <DialogTrigger as-child>
      <Button>
        {{ label }}
      </Button>
    </DialogTrigger>
    <DialogContent class="h-full sm:max-w-[425px] sm:h-auto">
      <div v-if="!isValid" class="">
        <div class="flex flex-col gap-2">
          <Label for="name" class="">
            Meter Number
          </Label>
          <Input v-model="meterNumber" class="col-span-3" />
        </div>
      </div>
      <div v-else>
        <div class="flex flex-col gap-2">
          <Label for="name" class="">
            Name
          </Label>
          <Input v-model="meterNumber" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button @click="validateMeterNumber()">
          Next
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
            isValid: true,
            meterNumber: null
        } 
    },
    methods:{
        async validateMeterNumber(){
            const response = await useWalletAuthFetch(`${WALLET_API_URL}/meter/valid`,{
                params: {
                    meterNumber : this.meterNumber
                }
            })
            if(response.status){
                console.log("ok")
            }
        }
    }
}
</script>
<style>
</style>