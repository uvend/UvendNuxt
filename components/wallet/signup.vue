<template>
    <Card class="p-4 m-4 w-[400px] max-w-full">
        <CardHeader>
            <h1 class="font-bold text-2xl">Sign up</h1>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
            <div>
                <Label>Nickname</Label>
                <Input type="text" v-model="nickname" placeholder="Enter your nickname"/>
            </div>
            <div>
                <Label>Email</Label>
                <Input type="text" v-model="email"/>
            </div>
            <div>
                <Label>Password</Label>
                <Input type="password" v-model="password"/>
            </div>
            <div>
                <Label>Confirm Password</Label>
                <Input type="password" v-model="confirmPassword"/>
            </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
            <Button class="w-full" @click="debounceSignUp">Create account</Button>
            <Button class="w-full" variant="ghost" @click="$emit('changeState')">Back to login</Button>
        </CardFooter>
    </Card>
</template>
<script>
import _ from 'lodash';
export default{
    data(){
        return {
            nickname: null,
            email:null,
            password: null,
            confirmPassword: null,
            invalid: []
        }
    },
    methods: {
        async signUp(){
            console.log();
            if(!this.valid()) return
            try{
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/auth/create`,{
                    method: "POST",
                    body : {
                        nickname: this.nickname,
                        email : this.email,
                        password : this.password,
                        verification_callback_url: `${window.location.origin}/handler/email-verification`
                    }
                })
                const access_token = response.access_token;
                const refresh_token = response.refresh_token;
                localStorage.setItem('wallet-access-token',access_token);
                localStorage.setItem('wallet-refresh-token',refresh_token);
                // console.log(response)
                return navigateTo('/');
            }catch(e){
                console.log(e)
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                });
            }
        },
        valid(){
            this.invalid = []
            if(!this.nickname) this.invalid.push('nickname')
            if(!this.email) this.invalid.push('email')
            if(!this.password) this.invalid.push('password')
            if(!this.confirmPassword) this.invalid.push('confirmPassword')
            if(this.password !== this.confirmPassword) {
                this.invalid.push('passwordMismatch')
                this.$toast({
                    title: 'Password Mismatch',
                    description: 'Passwords do not match.',
                    variant: "destructive"
                });
                return false
            }
            console.log(this.invalid);
            if(this.invalid.length > 0) return false
            return true
        }
    },
    created() {
        this.debounceSignUp = _.debounce(this.signUp, 300);
    }
}
</script>