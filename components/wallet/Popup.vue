<template>
  <div>
    <Button @click="handleClick" :class="buttonClass" :variant="buttonVariant" >
        {{ buttonLabel }}
    </Button>
    <Drawer v-if="isMobile" v-model:open="isOpen">
        <DrawerContent class="h-5/6 overflow-y">
            <slot />
        </DrawerContent>
    </Drawer>
    <Dialog v-else v-model:open="isOpen">
        <DialogContent class="p-3">
            <slot />
        </DialogContent>
    </Dialog>
  </div>
</template>
<script>
export default{
    emits: ['click'],
    props:{
        buttonClass: "",
        buttonLabel: "",
        buttonVariant: "primary"
    },
    data(){
        return {
            isMobile: false,
            isOpen:  false
        }
    },
    methods:{
        handleClick(event) {
            this.$emit('click', event);
            this.toggleOpen();
        },
        toggleOpen(){
            this.isOpen = !this.isOpen;
        },
        checkMobile() {
            this.isMobile = window.innerWidth <= 768
        },
    },
    mounted(){
        this.checkMobile()
        window.addEventListener('resize', this.checkMobile)
    }
}
</script>