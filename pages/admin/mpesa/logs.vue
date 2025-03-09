<template>
        <MySkeletenCardList v-if=isLoading />
        <Card v-else v-for="log in logs" class="p-2 my-2">
            <div>
                <p>{{ log.transID }}</p>
            </div>
            <div>
                <p>{{ log.json.BillRefNumber}}</p>
            </div>
            <div>
                <p>{{ log.json.BusinessShortCode}}</p>
            </div>
            <div>
                <p>{{ parseFloat(log.json.TransAmount).toFixed(2)}}</p>
            </div>
            <div>
                <p>{{ log.statusCode }}</p>
            </div>
        </Card>

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
            logs: [],
            totalPages: 0
        }
    },
    methods:{
        async getLogs(){
            this.isLoading = true
            const response = await $fetch(`${MPESA_URL}/getalllogs`,{
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
            response.data.forEach((log)=>{
                //console.log("each",log)
                var formattedLog = log
                formattedLog['json'] = JSON.parse(log.data)
                this.logs.push(formattedLog)
            })
            console.log(this.logs)
            //this.logs = response.data
            this.totalPages = response.totalPages
            this.isLoading = false
            this.isLoading = false
        }
    },
    mounted(){
        this.getLogs()
    },
    computed:{
    }
}
</script>