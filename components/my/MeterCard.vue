<template>
<Card class="meter-card w-full p-2 my-2 items-center" @click="navigateTo(`/my/${$route.params.customer_id}/meter/${meter.installationUniqueId}`)">
    <div class="flex flex-col items center">
        <p class="font-bold">
            {{ meter.meterNumber }}
        </p>
        <p class="text-sm font-light">
            {{ meter.installationAdress[0] }} {{ meter.installationAdress[1] }}<br>
            {{ meter.installationAdress[2] }} {{ meter.installationAdress[3] }}<br>
            {{ meter.installationAdress[4] }}
        </p>
    </div>
    <div>
        {{ meter.complexName}}
    </div>
    <div>
        <Icon name="lucide:droplet" class="w-5 h-5" v-if="meter.utilityType == 'Water'"/>
        <Icon name="lucide:zap" class="w-5 h-5" v-if="meter.utilityType == 'Electricity'"/>
    </div>
</Card>
</template>
<script>
export default{
    props:{
        meter: Object
    }
}
</script>
<style>
.meter-card{
    display: grid;
    grid-template-columns: 2fr 2fr 0.5fr;
    cursor: pointer;
}
</style>