
<template>
    <Card class="p-2 m-2">
        <p class="font-bold">
            {{ customer.description === '' ? 'None' : customer.description }}
        </p>
        <p>
            C{{ customer.uniqueIdentification }}
        </p>
    </Card>

</template>
<script>
export default{
    props:{
        customer: Object
    },
    data(){

    },
}
</script>