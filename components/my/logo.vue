<template>
    <div class="logo-container">
        <img :src="logoSrc"/>
    </div>
</template>
<script>
export default{
    mounted(){
    },
    computed:{
        logoSrc(){
            return APP_LOGO || '/UVendlogo-Better.png';
        }
    }
}
</script>
<style scoped>

</style>