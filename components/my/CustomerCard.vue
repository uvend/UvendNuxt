<template>
    <Card class="w-[300px] p-4">
        <div>
            {{ customer.description }}
        </div>
    </Card>
</template>
<script>
export default{
    props:{
        customer: Object
    }
}
</script>