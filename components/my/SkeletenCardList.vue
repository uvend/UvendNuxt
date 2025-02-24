<template>
    <Card v-for="row in 8" class="my-2 p-2 flex flex-row skeleton-grid">
        <div class="flex flex-col gap-2 p-2" v-for="row in 7">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-20" />
        </div>
    </Card>
</template>
<script>

</script>
<style>
.skeleton-grid{
    display: grid;
    grid-template-columns: 3fr 2fr 0.5fr 0.5fr 1fr 1fr 1fr 0.5fr;
    width: 100%;
}
</style>