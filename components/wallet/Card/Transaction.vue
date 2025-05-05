<template>
    <Card class="p-4 hover:bg-gray-50 transition-colors">
        <div class="card-grid gap-4">
            <div class="space-y-1">
                <p class="text-sm text-muted-foreground">Meter Number</p>
                <p class="font-medium">{{ data.meterNumber }}</p>
            </div>
            <div class="text-right space-y-1">
                <p class="text-sm text-muted-foreground">Amount</p>
                <p class="font-medium text-lg">R {{ formatAmount(data.amount) }}</p>
            </div>
            <div class="text-right space-y-1">
                <p class="text-sm text-muted-foreground">Type</p>
                <p class="font-medium">{{ formatUtilityType(data.utilityType) }}</p>
            </div>
            <div class="text-right space-y-1">
                <p class="text-sm text-muted-foreground">Date</p>
                <p class="font-medium">{{ formattedDate(data.created) }}</p>
            </div>
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
        },
        formatAmount(amount) {
            return parseFloat(amount).toFixed(2);
        },
        formatUtilityType(type) {
            const types = {
                'elect': 'Electricity',
                'water': 'Water',
                'gas': 'Gas'
            };
            return types[type] || type;
        }
    }
}
</script>
<style scoped>
.card-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    align-items: center;
}

@media (max-width: 768px) {
    .card-grid {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
}

@media (max-width: 640px) {
    .card-grid {
        grid-template-columns: 1fr;
    }
    
    .card-grid > div {
        text-align: left !important;
    }
}
</style>