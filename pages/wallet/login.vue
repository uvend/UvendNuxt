<template>
    <div class="w-full h-[100vh] flex flex-col items-center justify-center" style="background-color: #0d0d3b;">
        <div class="mb-6">
            <img src="/Dethro.jpg" alt="Dethro Technology" class="w-36 rounded-xl shadow-lg" />
        </div>
        <WalletSignin v-if="login && !resetPassword" @changeState="signUp(false)" @forgotPassword="toggleResetPassword()"/>
        <WalletSignup v-if="!login && !resetPassword" @changeState="signUp(true)"/>
        <WalletForgotPassword v-if="resetPassword" @backToLogin="toggleResetPassword()"/>
    </div>
</template>
<script>
definePageMeta({
    layout: 'noauth'
})
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
            if(localStorage.getItem('wallet-access-token')) return navigateTo("/");
        }
    },
    mounted(){
        this.isAlreadyLoggedin();
    }
}
</script>