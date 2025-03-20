<template>
    <MySkeletenCardList v-if="isLoading"/>
    <MyMeterTransactionCard v-else v-for="transaction in meterTransactions" :transaction="transaction" />

    <button v-if="!isLoading" @click="blockMeter()">Block Meter</button>


</template>
<script>
definePageMeta({
    layout: 'my'
})
export default{
    data(){
        return{
            isLoading: true,
            meterTransactions: [],
            startDate: null,
            endDate: null

        }
    },
    methods:{
        async getMeterActivity(){
            this.isLoading = true;
            const result = await useAuthFetch(`${API_URL}/AdminSystem/MeterStatement/GetMeterActivity`,{
                method: "GET",
                params: {
                    StartDate: this.startDate,
                    EndDate: this.endDate,
                    ResponseFormatType: 0,
                    ReportParentType: 7, //specific meter
                    ParentUniqueID: this.$route.params.meter_id
                },
                headers: {
                    'authorization' : 'Basic amFyZWRsZWVAYWRtaW46amFyZWQx'
                },

                blockMeter(){
                    console.log('Meter Blocked')
                }

            })
            this.meterTransactions = result.responseData.transactionData
            console.log(result)
            this.isLoading = false;
        }

    },
    async mounted(){
        const today = new Date();
        this.endDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        this.startDate = `${today.getFullYear()}-${(today.getMonth()).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        await this.getMeterActivity();
    }
}
</script>