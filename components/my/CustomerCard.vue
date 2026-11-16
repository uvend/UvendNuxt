
<template>
    <Card class="p-2 m-2">
        <p class="font-bold">
            {{ customer.description === '' ? 'None' : customer.description }}
        </p>
        <p> {{ customer.firstname }} {{ customer.surname }}</p>
        <p>
            {{ customer.id }}
        </p>
    </Card>

</template>
<script>
export default{
    props:{
        customer: Object
    },
    data() {
        return {}
    },
}
</script>