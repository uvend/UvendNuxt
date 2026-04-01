<template>
    <div class="logo-container flex items-center justify-center py-6 px-4 border-b border-yellow-500/20">
        <img :src="logoSrc" alt="Dethro Technology" class="h-36 w-auto object-contain" />
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