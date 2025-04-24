<template>
    <Card class="p-4 m-4 w-[400px] max-w-full">
        <CardHeader>
            <h1 class="font-bold text-2xl">Forgot Password</h1>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
            <div>
                <Label>Email</Label>
                <Input type="text" v-model="email"/>
            </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
            <Button class="w-full" @click="resetPassword">Send Email</Button>
            <Button class="w-full" variant="ghost" @click="$emit('backToLogin')">Back to login</Button>
        </CardFooter>
    </Card>
</template>
<script>
import _ from 'lodash';
export default{
    data(){
        return{
            email: null
        }
    },
    mounted(){
    },
    methods:{
        async resetPassword(){
            try{
                if(!this.email) return
                await useWalletAuthFetch(`${WALLET_API_URL}/auth/send-reset-code`,{
                    method : "POST",
                    body: {
                        email : this.email,
                        callback_url: `${window.location.origin}/handler/reset-password`
                    }
                })
                this.$toast({
                    title: 'Success!',
                    description: 'maybe, only if user with e-mail exists',
                    variant: "success"
                });
            }catch(e){
                console.log(e)
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