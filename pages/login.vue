<template>
<div class="h-screen w-full flex flex-row justify-center items-center">
    <Card class="flex flex-col gap-2 m-4 p-8 w-96">
        <Label class="text-sm">Username</Label>
        <Input type="text" v-model="username"/>
        <Label class="text-sm">Password</Label>
        <Input type="password" v-model="password"/>
        <Button @click="login()">Submit</Button>
    </Card>
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
            password: ""
        }
    },
    methods:{
        async login(){
            if(this.username.trim() == '' || this.password.trim() == ""){
                return;
            }
            try{
                const credentials = btoa(`${this.username}:${this.password}`);
                const result = await $fetch(`${HOSTNAME}/my/api/user/VendUserFunctions/ValidateUser`,{
                    method: "GET",
                    headers: {
                        "Authorization" : `Basic ${credentials}`,
                        "Content-Type": "application/json",
                    }
                })
                const customer = this.username.split('@')[1];
                console.log(customer);
                
                localStorage.setItem('user',btoa(result))
                localStorage.setItem('token',credentials)
                localStorage.setItem('customer',customer)

                if(result.userInfo.userType){
                    navigateTo('/');
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