<template>
<Form class="flex flex-col gap-2 p-4" @submit.prevent>
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
        <div class="flex gap-2 justify-end mt-4">
            <Button 
              type="button"
              @click="handleUpdate"
              :disabled="isLoading"
            >
                {{ isLoading && action === 'update' ? 'Updating...' : 'Update' }}
            </Button>
            <Button 
              type="button"
              :disabled="isLoading" 
              class="bg-red-600 hover:bg-red-600"
              @click="handleDelete"
            >
                {{ isLoading && action === 'delete' ? 'Deleting...' : 'Delete' }}
            </Button>
        </div>
      </Form>
</template>
<script>
export default{
    props:{
        label: {
            type: String,
            default: 'Edit meter'
        },
        dialogOpen: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String,
            default: 'edit'
        },
        meter: {
            type: Object,
            default: null
        }
    },
    data(){
        return {
            isValid: true,
            isLoading: false,
            action: null,
            meterNumber: null,
            meterName: null,
            meterId: null,
            isFavourite: null,
            active: null
        }
    },
    mounted(){
        const meter = this.meter || this.$store?.selectedMeter;
        if (!meter) return;
        this.setFromMeter(meter);
    },
    watch: {
        meter: {
            immediate: true,
            handler(newMeter) {
                if (!newMeter) return;
                this.setFromMeter(newMeter);
            }
        }
    },
    methods: {
        setFromMeter(meter) {
            this.meterName = meter.name;
            this.meterNumber = meter.meterNumber;
            this.meterId = meter.id;
            this.isFavourite = meter.favourite;
            this.active = meter.active;
        },
        async patchMeter(payload) {
            if (!this.meterNumber) return;

            this.isLoading = true;
            try {
                await useWalletAuthFetch(`${WALLET_API_URL}/meter/${this.meterNumber}`, {
                    method: 'PATCH',
                    body: payload
                });

                this.$toast({
                    title: 'Success',
                    description: 'Meter updated successfully'
                });

                this.$emit('updated');
                this.$emit('close');
            } catch (error) {
                console.error('Error updating meter:', error);
                this.$toast({
                    title: 'Error',
                    description: 'Failed to update meter',
                    variant: 'destructive'
                });
            } finally {
                this.isLoading = false;
                this.action = null;
            }
        },
        async handleUpdate() {
            this.action = 'update';
            const payload = {
                name: this.meterName,
                favourite: this.isFavourite,
                active: this.active ?? 1
            };
            await this.patchMeter(payload);
        },
        async handleDelete() {
            this.action = 'delete';
            const payload = {
                name: this.meterName,
                favourite: this.isFavourite,
                active: 0
            };
            await this.patchMeter(payload);
        }
    }
}
</script>
<style>
</style>