<template>
    <Card class="p-4 m-4 w-[400px] max-w-full">
        <CardHeader>
            <h1 class="font-bold text-2xl">Sign in</h1>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
            <div v-if="authError" class="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {{ authError }}
            </div>
            <div>
                <Label>Email</Label>
                <Input type="text" v-model="email"/>
                <p v-if="invalid.includes('email')" class="text-sm text-red-500">Email is required</p>
            </div>
            <div>
                <Label>Password</Label>
                <div class="relative">
                    <Input :type="showPassword ? 'text' : 'password'" v-model="password"/>
                    <button 
                        type="button" 
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" 
                        @click="togglePasswordVisibility"
                    >
                        {{ showPassword ? 'Hide' : 'Show' }}
                    </button>
                </div>
                <p v-if="invalid.includes('password')" class="text-sm text-red-500">
                    {{ passwordErrorMessage }}
                </p>
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
            email: null,
            password: null,
            invalid: [],
            passwordErrorMessage: "Password is required",
            authError: null,
            showPassword: false
        }
    },
    methods:{
        async signIn(){
            // Clear previous auth errors
            this.authError = null;
            
            if(!this.valid()) return
            try{
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/auth/sign-in`,{
                    method: "POST",
                    body: {
                        "email": this.email,
                        "password": this.password
                    }
                });
                
                if(!response.access_token){
                    // Handle specific error responses
                    if(response.error === 'invalid_credentials') {
                        this.authError = "Invalid email or password";
                    } else if(response.error === 'user_not_found') {
                        this.authError = "No account found with this email";
                    } else {
                        this.authError = "Please enter correct Details";
                    }
                    throw new Error(response.error || 'Authentication failed');
                }
                
                const access_token = response.access_token;
                const refresh_token = response.refresh_token;
                localStorage.setItem('wallet-access-token', access_token);
                localStorage.setItem('wallet-refresh-token', refresh_token);
                return navigateTo('/');
            }catch(e){
                // Only show toast for non-auth errors
                if(!this.authError) {
                    this.$toast({
                        title: 'Uh oh! Something went wrong.',
                        description: 'There was a problem with your request.',
                        variant: "destructive"
                    });
                }
            }
        },
        valid(){
            this.invalid = []
            
            // Email validation
            if(!this.email) this.invalid.push('email')
            
            // Password validation
            if(!this.password) {
                this.passwordErrorMessage = "Password is required"
                this.invalid.push('password')
            } else if(this.password.length < 8) {
                this.passwordErrorMessage = "Password must contain minimum of 8 characters"
                this.invalid.push('password')
            }
            
            if(this.invalid.length > 0) return false
            return true
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        }
    },
    created() {
        this.debounceSignIn = _.debounce(this.signIn, 300);
    }
}
</script>