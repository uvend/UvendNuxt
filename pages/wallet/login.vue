<template>
    <div class="w-full h-[100vh] flex items-center justify-center">
        <WalletSignin v-if="login && !resetPassword" @changeState="signUp(false)" @forgotPassword="toggleResetPassword()"/>
        <WalletSignup v-if="!login && !resetPassword" @changeState="signUp(true)"/>
        <WalletForgotPassword v-if="resetPassword" @backToLogin="toggleResetPassword()"/>
    </div>
</template>
<script>
export default{
    data(){
        return{
            login: true,
            resetPassword: false
        }
    },
    methods:{
        signUp(state){
            this.login = state
        },
        toggleResetPassword(){
            this.resetPassword = !this.resetPassword
        },
        isAlreadyLoggedin(){
            if(localStorage.getItem('wallet-access-token')) return navigateTo("/wallet");
        }
    },
    mounted(){
        this.isAlreadyLoggedin();
    }
}
</script>