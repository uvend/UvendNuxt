<template>
    <MySkeletonCardList v-if=isLoading />
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
            toDate: '2024-12-04',
            isLoading: true,
            requests: [],
            totalPages: 0
        }
    },
    methods:{
        async getRequests(){
            this.isLoading = true
            const response = await $fetch(`${MPESA_URL}/getallrequest`,{
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
            this.requests = response.data
            this.totalPages = response.totalPages
            this.isLoading = false
        }
    },
    mounted(){
        this.getRequests()
    }
}
</script>