<template>
<div class="h-screen w-full flex flex-row justify-center items-center relative overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
        <img src="~/assets/css/login/Background.jpg" alt="City Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/20"></div>
    </div>
    
    <!-- Main Card Container -->
    <div class="relative z-10 flex w-[900px] h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden">
        <!-- Left Panel - Branding/Features -->
        <div class="w-2/5 bg-gray-800 p-8 flex flex-col justify-center">
            <!-- Logo -->
            <div class="flex flex-col items-center mb-8">
                <div class="relative mb-4">
                    <!-- Logo Container with Checkerboard Background -->
                    <div class="relative bg-gray-900 p-4 rounded-lg shadow-lg">
                        <!-- Checkerboard Pattern Background -->
                        <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50 rounded-lg"></div>
                        
                        <!-- Logo Content -->
                        <div class="relative z-10 flex items-center space-x-3">
                            <!-- U-Vend Text -->
                            <div class="text-white font-bold text-2xl tracking-wide">
                                U-Vend
                            </div>
                            
                            <!-- Vertical Separator -->
                            <div class="w-px h-8 bg-orange-500"></div>
                            
                            <!-- PREPAID UTILITIES MANAGEMENT Text -->
                            <div class="flex flex-col text-orange-500 font-bold text-xs leading-tight">
                                <span>PREPAID</span>
                                <span>UTILITIES</span>
                                <span>MANAGEMENT</span>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            
            <!-- Feature List -->
            <div class="space-y-4">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span class="text-white text-sm">Instant power purchases</span>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span class="text-white text-sm">Smart meter management</span>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span class="text-white text-sm">Real-time usage monitoring</span>
                </div>
            </div>
        </div>
        
        <!-- Right Panel - Login Form -->
        <div class="w-3/5 bg-white p-8 flex flex-col justify-center">
            <div class="max-w-sm mx-auto w-full">
                <h2 class="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome back!</h2>
                <p class="text-gray-600 text-center mb-8">Sign in to access your dashboard</p>
                
                <form @submit.prevent="login" class="space-y-6">
                    <div>
                        <Label class="text-sm font-medium text-gray-700 mb-2 block">Username</Label>
                        <Input 
                            type="text" 
                            v-model="username"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter your username"
                        />
                    </div>
                    
                    <div>
                        <Label class="text-sm font-medium text-gray-700 mb-2 block">Password</Label>
                        <div class="relative">
                            <Input 
                                :type="showPassword ? 'text' : 'password'" 
                                v-model="password"
                                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                        class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
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
                    return navigateTo(`/my/${result.userInfo.userParent.uniqueIdentification}/transactions`)
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