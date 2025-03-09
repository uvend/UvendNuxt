<template>
</template>
<script>
definePageMeta({
    layout: 'mpesa'
})
export default{
    data(){
        return{
            page: 1,
            pageSize: 10,
            fromDate: '2024-09-24',
            toDate: '2024-12-04'
        }
    },
    methods:{
        async getTransactions(){
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
        }
    },
    mounted(){
        this.getTransactions()
    }
}
</script>