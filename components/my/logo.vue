<template>
    <div class="logo-container flex items-center justify-center p-4 border-b border-yellow-500/20">
        <img :src="logoSrc" alt="Dethro Technology" class="h-20 w-auto object-contain" />
    </div>
</template>
<script>
export default{
    computed:{
        logoSrc(){
            return APP_LOGO || '/Dethro.jpg';
        }
    }
}
</script>