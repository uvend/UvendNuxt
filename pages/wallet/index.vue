<template>
    <div class="w-full h-[100vh] flex items-center justify-center">
        <WalletSignin v-if="login" @changeState="signUp(false)"/>
        <WalletSignup v-else @changeState="signUp(true)" />
    </div>
</template>
<script>
export default{
    data(){
        return{
            login: true
        }
    },
    methods:{
        signUp(state){
            this.login = state
        }
    }
}
</script>