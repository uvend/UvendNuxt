<template>
    <Button @click="toggleOpen()" :class="buttonClass" :variant="buttonVariant" v-if="hasButton">
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
    
</template>
<script>
export default{
    props:{
        buttonClass: "",
        buttonLabel: "",
        buttonVariant: "primary",
        hasButton: {
            type: Boolean,
            default: true
        },
        modelValue: {
            type: Boolean,
            default: false
        },
    },
    data(){
        return {
            isMobile: false,
            localOpen: this.modelValue
        }
    },
    computed: {
        isOpen: {
            get() {
                return this.localOpen; // Return the local state
            },
            set(value) {
                this.localOpen = value; // Update local state
                this.$emit('update:modelValue', value); // Emit the updated value to the parent
            }
        }
    },
    methods:{
        toggleOpen(){
            console.log(this.isOpen); // Log the current state
            this.isOpen = !this.isOpen; // Toggle the computed property
        },
        checkMobile() {
            this.isMobile = window.innerWidth <= 768
        },
    },
    mounted(){
        this.checkMobile()
        window.addEventListener('resize', this.checkMobile)
    },
    watch: {
        modelValue(newValue) {
            this.localOpen = newValue; // Sync local state with prop changes
        }
    },
}
</script>