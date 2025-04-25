<template>
    <Card class="p-4 m-4 w-[400px] max-w-full">
        <CardHeader>
            <h1 class="font-bold text-2xl">Sign up</h1>
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
                <p v-if="password && password.length > 0" class="text-sm mt-1" :class="passwordStrengthClass">
                    {{ passwordStrengthMessage }}
                </p>
            </div>
            <div>
                <Label>Confirm Password</Label>
                <div class="relative">
                    <Input :type="showPassword ? 'text' : 'password'" v-model="confirmPassword" @input="checkPasswordMatch"/>
                    <button 
                        type="button" 
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" 
                        @click="togglePasswordVisibility"
                    >
                        {{ showPassword ? 'Hide' : 'Show' }}
                    </button>
                </div>
                <p v-if="confirmPassword && !passwordsMatch" class="text-sm text-red-500">
                    Passwords don't match
                </p>
                <p v-if="confirmPassword && passwordsMatch" class="text-sm text-green-500">
                    Passwords match
                </p>
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
            email: null,
            password: null,
            confirmPassword: null,
            invalid: [],
            passwordErrorMessage: "Password is required",
            authError: null,
            showPassword: false,
            passwordsMatch: false
        }
    },
    watch: {
        password() {
            // Check password match whenever password changes
            this.checkPasswordMatch();
        }
    },
    computed: {
        passwordStrength() {
            if (!this.password) return 0;
            
            let strength = 0;
            
            // Add length score
            if (this.password.length >= 8) strength += 1;
            if (this.password.length >= 12) strength += 1;
            
            // Add character variety score
            if (/[0-9]/.test(this.password)) strength += 1; // Has numbers
            if (/[a-z]/.test(this.password)) strength += 1; // Has lowercase
            if (/[A-Z]/.test(this.password)) strength += 1; // Has uppercase
            if (/[^a-zA-Z0-9]/.test(this.password)) strength += 1; // Has special chars
            
            return Math.min(strength, 5); // 0-5 scale
        },
        passwordStrengthMessage() {
            if (!this.password) return "";
            
            const messages = [
                "Very weak password",
                "Weak password",
                "Fair password",
                "Good password",
                "Strong password",
                "Very strong password"
            ];
            
            return messages[this.passwordStrength];
        },
        passwordStrengthClass() {
            if (!this.password) return "";
            
            const classes = [
                "text-red-600",
                "text-red-500",
                "text-orange-500",
                "text-yellow-500",
                "text-green-500",
                "text-green-600"
            ];
            
            return classes[this.passwordStrength];
        }
    },
    methods: {
        checkPasswordMatch() {
            if (!this.confirmPassword) {
                this.passwordsMatch = false;
                return;
            }
            
            this.passwordsMatch = this.password === this.confirmPassword;
        },
        async signUp(){
            // Clear previous auth errors
            this.authError = null;
            
            if(!this.valid()) return
            try{
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/auth/create`,{
                    method: "POST",
                    body: {
                        email: this.email,
                        password: this.password
                    }
                });
                
                if(!response.access_token){
                    // Handle specific error responses
                    if(response.error === 'email_already_exists') {
                        this.authError = "An account with this email already exists";
                    } else if(response.error === 'invalid_email') {
                        this.authError = "Please enter a valid email address";
                    } else {
                        this.authError = "Account creation failed";
                    }
                    throw new Error(response.error || 'Account creation failed');
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
            if(!this.email) {
                this.invalid.push('email');
            } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
                this.authError = "Please enter a valid email address";
                this.invalid.push('email');
            }
            
            // Password validation
            if(!this.password) {
                this.passwordErrorMessage = "Password is required";
                this.invalid.push('password');
            } else if(this.password.length < 8) {
                this.passwordErrorMessage = "Password must contain minimum of 8 characters";
                this.invalid.push('password');
            }
            
            // Confirm password validation
            if(!this.confirmPassword) {
                this.invalid.push('confirmPassword');
            } else if(!this.passwordsMatch) {
                this.invalid.push('confirmPassword');
            }
            
            return this.invalid.length === 0;
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        }
    },
    created() {
        this.debounceSignUp = _.debounce(this.signUp, 300);
    }
}
</script>