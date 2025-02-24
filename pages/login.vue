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
            try{
                const credentials = btoa(`${this.username}:${this.password}`);
                const result = await $fetch(`${API_URL}/AdminSystem/LoginAdminBackOffice`,{
                    method: "GET",
                    headers: {
                        "Authorization" : `Basic ${credentials}`,
                        "Content-Type": "application/json",
                    }
                })
                
                localStorage.setItem('user',btoa(result))
                localStorage.setItem('token',credentials)

                if(result.userInfo.userType == "Administration"){
                    navigateTo('/admin/account/payments');
                }
            }catch(e){
                console.log(e)
            }
        }
    }
}
</script>