<template>
    <Card class="p-4 m-4 w-[400px] max-w-full">
        <CardHeader>
            <h1 class="font-bold text-2xl">Sign in</h1>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
            <div>
                <Label>Email</Label>
                <Input type="text" v-model="email"/>
            </div>
            <div>
                <Label>Password</Label>
                <Input type="password" v-model="password"/>
                <p class="text-sm pt-2 cursor-pointer" @click="$emit('forgotPassword')">Forgot Password?</p>
            </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
            <Button class="w-full" @click="debounceSignIn">Sign in</Button>
            <Button class="w-full" variant="ghost" @click="$emit('changeState')">Create account</Button>
        </CardFooter>
    </Card>
</template>
<script>
import _ from 'lodash';
export default{
    data(){
        return {
            email : null,
            password: null,
            invalid: []
        }
    },
    methods:{
        async signIn(){
            if(!this.valid()) return
            try{
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/auth/sign-in`,{
                    method: "POST",
                    body : {
                        "email" : this.email,
                        "password" : this.password
                    }
                });
                if(!response.access_token){
                    throw new Error(response)
                }
                const access_token = response.access_token;
                const refresh_token = response.refresh_token;
                localStorage.setItem('wallet-access-token',access_token);
                localStorage.setItem('wallet-refresh-token',refresh_token);
                // console.log(response)
                return navigateTo('/');
            }catch(e){
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                });
            }
        },
        valid(){
            this.invalid = []
            if(!this.email) this.invalid.push('email')
            if(!this.password) this.invalid.push('password')
            if(this.invalid.length > 0) return false
            return true
        }
    },
    created() {
        this.debounceSignIn = _.debounce(this.signIn, 300);
    }
}
</script>