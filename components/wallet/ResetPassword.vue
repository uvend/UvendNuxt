<template>
    <Card v-if="passwordResetComplete">
        <Button @click="navigateTo('/login')">Back to login</Button>
    </Card>
    <Card v-else class="p-4 m-4 w-[400px] max-w-full">
        <CardHeader>
            <h1 class="font-bold text-2xl">Reset Password</h1>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
            <div>
                <Label>Password</Label>
                <Input type="password" v-model="password"/>
            </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
            <Button class="w-full" @click="resetPassword">Update password</Button>
        </CardFooter>
    </Card>
</template>
<script>
import _ from 'lodash';
export default{
    props:{
        code: String
    },
    data(){
        return{
            password: null,
            passwordResetComplete: null
        }
    },
    methods:{
        async resetPassword(){
            try{
                console.log(this.code,this.password)
                if(!this.code && !this.password) return
                const response = await useWalletAuthFetch(`${WALLET_API_URL}/auth/reset`,{
                    method : "POST",
                    body: {
                        password : this.password,
                        code: this.code
                    }
                })
                if(response.success){
                    this.$toast({
                        title: 'Success!',
                        description: 'Password updated',
                        variant: "success"
                    })
                    this.passwordResetComplete = true;
                }
                else{
                    throw new Error();
                }
            }catch(e){
                console.log('toast',e)
                this.$toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    variant: "destructive"
                });
            }
        }
    },
    computed(){
        this.debounceResetPassword = _.debounce(this.resetPassword, 300);
    }
}
</script>