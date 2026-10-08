<template>
    <div class="logo-container">
        <img :src="logoSrc" alt="SSSM — Service Solutions Smart Metering" />
    </div>
</template>
<script>
export default{
    props: {
        variant: {
            type: String,
            default: 'transparent'
        }
    },
    computed:{
        logoSrc(){
            if (APP_LOGO) return APP_LOGO
            return this.variant === 'solid' ? '/sssm-logo.png' : '/sssm-logo-transparent.png'
        }
    }
}
</script>
<style scoped>

</style>
