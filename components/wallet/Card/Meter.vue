<template>
    <Card class="p-2 my-3 cursor-pointer flex justify-between items-center">
        <div>
            <p class="font-bold">{{ meter.meterNumber }}</p>
            <p class="text-sm">{{ meter.name }}</p>
        </div>
        <div>
            <Icon v-if="open" name="lucide:chevron-down" class="w-5 h-5 mt-2"/>
            <Icon v-else name="lucide:chevron-right" class="w-5 h-5"/>
        </div>
    </Card>
</template>
<script>
export default{
    props: {
        meter: Object,
        open: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style>
</style>