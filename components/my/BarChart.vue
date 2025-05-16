<template>
<BarChart
    :index="index"
    :data="data"
    :categories="categories"
    :colors="['#3b82f6']"
    type="grouped"
    :rounded-corners="6"
    :y-formatter="formatAmount"
    :show-legend="false"
    :grid="true"
    :y-axis="true"
    :x-axis="true"
    :tooltip="true"
    :animate="true"
    :show-values="true"
    class="[&>svg]:stroke-border [&>svg]:stroke-[1]"
    :attributes="{
        'vis-grouped-bar__bar': {
            width: (d) => d.transactionCount === 1 ? 0.4 : 0.8
        }
    }"
/>
</template>
<script>
export default {
    props: {
        data: Object,
        categories: Array,
        index: String
    },
    methods: {
        formatAmount(amount) {
            return new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                notation: amount > 999999 ? 'compact' : 'standard'
            }).format(amount)
        }
    }
}
</script>