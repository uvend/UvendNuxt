<template>
<BarChart
    :index="index"
    :data="data"
    :categories=categories
    :y-formatter="(tick, i) => {
      return typeof tick === 'number'
        ? `${new Intl.NumberFormat('us').format(tick).toString()}`
        : ''
    }"
    :rounded-corners="4"
  />
</template>
<script>
export default{
    props:{
        data: Object,
        categories: Array,
        index: String
    }
}
</script>