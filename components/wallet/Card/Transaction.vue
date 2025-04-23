<template>
    <Card class="p-2">
        <div>
            {{ data.meterNumber }}
        </div>
        <div>
            {{ data.utilityType }}
        </div>
        <div>
            {{ data.created }}
        </div>
    </Card>
</template>
<script>
export default{
    props: {
        data: Object
    }
}
</script>