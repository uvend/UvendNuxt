<template>
    <div class="logo-container py-1 px-3 flex justify-center">
        <img :src="logoSrc" class="w-full max-w-[72px] rounded-lg" alt="Logo"/>
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