<template>
    <Card class="p-2 card-grid">
        <div>
            {{ data.meterNumber }}
        </div>
        <div>
            {{ data.amount }}
        </div>
        <div>
            {{ data.utilityType }}
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
    mounted(){
    },
    methods:{
        formattedDate(dateString){
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
    }
}
</script>
<style scoped>
.card-grid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>