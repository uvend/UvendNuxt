<template>
    <div class="w-full h-[100vh] flex items-center justify-center">
        <WalletForgotPassword v-if="resetPassword" @backToLogin="toggleResetPassword()"/>
        <WalletSignin v-if="login && !resetPassword" @changeState="signUp(false)" @forgotPassword="toggleResetPassword()"/>
        <WalletSignup v-if="!login && !resetPassword" @changeState="signUp(true)"/>
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
        }
    }
}
</script>