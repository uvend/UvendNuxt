<template>
    <div class="logo-container flex items-center justify-center py-5 px-4 border-b border-yellow-500/20">
        <img :src="logoSrc" alt="Dethro Technology" class="h-28 w-auto object-contain" />
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