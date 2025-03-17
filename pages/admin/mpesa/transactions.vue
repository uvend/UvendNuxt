<template>
    {{ smsBalance }}
    <MySkeletonCardList v-if=isLoading />
    <div>
        <Card v-for="transaction in transactions">

        </Card>
    </div>
</template>
<script>
definePageMeta({
    layout: 'account'
})
export default{
    data(){
        return{
            page: 1,
            pageSize: 10,
            fromDate: '2024-09-24',
            toDate: '2025-12-04',
            smsBalance: null,
            isLoading: false,
            transactions: []
        }
    },
    methods:{
        async getTransactions(){
            this.isLoading = true;
            const response = await $fetch(`${MPESA_URL}/getalltransactions`,{
                method: "GET",
                options: {
                    'Content-Type': 'application/json'
                },
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    fromDate: this.fromDate,
                    toDate: this.toDate
                },
                //mode: 'no-cors'
            })
            console.log(response)
            this.transactions = response.data;
            this.isLoading = false;
        },
        async getSMSBalance(){
            const response = await $fetch(`${MPESA_URL}/checkbalance`,{
                method: "GET"
            })
            console.log(response)
            this.smsBalance = response.balance;
        }
    },
    mounted(){
        this.getSMSBalance();
        this.getTransactions()
    }
}
</script>