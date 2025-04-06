<template>
<div class="flex flex-col p-4 gap-4">
    <div>
        <Button @click="logout" >Logout</Button>
    </div>
</div>
</template>
<script>
definePageMeta({
    layout: 'wallet'
})
export default{
    methods:{
        logout(){
            localStorage.removeItem('wallet-access-token');
            localStorage.removeItem('wallet-refresh-token');
            navigateTo("/wallet");
        }
    }
}
</script>