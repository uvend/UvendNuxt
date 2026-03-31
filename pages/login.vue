<template>
<div class="h-screen w-full flex flex-row justify-center items-center relative overflow-hidden" style="background-color: #0d0d3b;">
    <!-- Subtle pattern overlay -->
    <div class="absolute inset-0 z-0 opacity-10" style="background-image: radial-gradient(circle at 25% 25%, #d4a843 1px, transparent 1px), radial-gradient(circle at 75% 75%, #d4a843 1px, transparent 1px); background-size: 50px 50px;"></div>
    
    <!-- Main Card Container -->
    <div class="relative z-10 flex w-[960px] max-w-[95vw] min-h-[560px] rounded-2xl shadow-2xl overflow-hidden border border-[#d4a843]/20">
        <!-- Left Panel - Branding -->
        <div class="w-1/2 p-10 flex flex-col justify-center items-center" style="background: linear-gradient(135deg, #0d0d3b 0%, #161659 50%, #1a1a6e 100%);">
            <!-- Logo -->
            <div class="mb-8">
                <img src="/Dethro.jpg" alt="Dethro Technology" class="w-56 rounded-xl shadow-lg" />
            </div>
            
            <!-- Feature List -->
            <div class="space-y-4 w-full max-w-xs">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: #d4a843;">
                        <svg class="w-3.5 h-3.5 text-[#0d0d3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span class="text-white/90 text-sm">Instant power purchases</span>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: #d4a843;">
                        <svg class="w-3.5 h-3.5 text-[#0d0d3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span class="text-white/90 text-sm">Smart meter management</span>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: #d4a843;">
                        <svg class="w-3.5 h-3.5 text-[#0d0d3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span class="text-white/90 text-sm">Real-time usage monitoring</span>
                </div>
            </div>
        </div>
        
        <!-- Right Panel - Login Form -->
        <div class="w-1/2 bg-white p-10 flex flex-col justify-center">
            <div class="max-w-sm mx-auto w-full">
                <h2 class="text-3xl font-bold mb-2 text-center" style="color: #0d0d3b;">Welcome back!</h2>
                <p class="text-gray-500 text-center mb-8">Sign in to access your dashboard</p>
                
                <form @submit.prevent="login" class="space-y-5">
                    <div>
                        <Label class="text-sm font-medium text-gray-700 mb-2 block">Username</Label>
                        <Input 
                            type="text" 
                            v-model="username"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a843] focus:border-transparent"
                            placeholder="Enter your username"
                        />
                    </div>
                    
                    <div>
                        <Label class="text-sm font-medium text-gray-700 mb-2 block">Password</Label>
                        <div class="relative">
                            <Input 
                                :type="showPassword ? 'text' : 'password'" 
                                v-model="password"
                                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a843] focus:border-transparent"
                                placeholder="Enter your password"
                            />
                            <button 
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                </svg>
                                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <Button 
                        type="submit"
                        class="w-full text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
                        style="background-color: #d4a843;"
                        onmouseover="this.style.backgroundColor='#c09838'"
                        onmouseout="this.style.backgroundColor='#d4a843'"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        <span>Log In</span>
                    </Button>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
definePageMeta({
    layout: 'noauth'
})
export default{
    data(){
        return {
            username: "",
            password: "",
            showPassword: false
        }
    },
    methods:{
        async login(){
            if(this.username.trim() == '' || this.password.trim() == ""){
                return;
            }
            try{
                const credentials = btoa(`${this.username}:${this.password}`);
                const result = await $fetch(`${VEND_URL}/user/VendUserFunctions/ValidateUser`,{
                    method: "GET",
                    headers: {
                        "Authorization" : `Basic ${credentials}`,
                        "Content-Type": "application/json",
                    }
                })

                console.log(result)

                localStorage.setItem('user',btoa(result))
                localStorage.setItem('token',credentials)

                const userType = result.userInfo.userType;

                if(userType === 'Customer'){
                    localStorage.setItem('customer',result.userInfo.userParent.uniqueIdentification);
                    return navigateTo(`/my/${result.userInfo.userParent.uniqueIdentification}/dashboard`)
                }
                
                if(userType == "Administration"){
                    localStorage.setItem('customer','admin');
                    return navigateTo('');
                }

            }catch(e){
                console.log(e)
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                });
            }
        }
    }
}
</script>