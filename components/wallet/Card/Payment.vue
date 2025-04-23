<template>
    <Card class="p-2">
        <div>
            {{data.payvault_data_1 }}
        </div>
        <div>
            {{ data.amount }}
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