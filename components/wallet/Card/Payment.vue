<template>
    <Card class="p-2 card-grid">
        <div>
            <div>
                {{ data.payvault_data_1 }}
            </div>
            <div>
                {{ data.result_desc }}
            </div>
        </div>
        <div>
            {{ formatAmount(data.amount) }}
        </div>
        <div>
            {{ formattedDate(data.created) }}
        </div>
    </Card>
</template>
<script>
export default{
    props: {
        data: Object
    },
    methods:{
        formattedDate(dateString){
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        },
        formatAmount(amount){
            return (parseFloat(amount) / 100).toFixed(2);
        }
    }
}
</script>
<style>
.card-grid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
</style>