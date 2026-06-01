<template>
    <InactiveMetersPopup 
        :visible="showPopup" 
        :meters="inactive40List"
    />
</template>

<script setup>
const route = useRoute()
const { fetchAndCompute, inactive40Days } = useMeterActivity()
const { shouldShow, showPopup } = useInactiveMetersPopup()

const inactive40List = computed(() => inactive40Days.value || [])

async function checkAndShow() {
    const customerId = route.params.customer_id
    if (!customerId) return
    await fetchAndCompute(customerId)
    if (shouldShow(inactive40Days.value)) {
        showPopup.value = true
    }
}

onMounted(async () => {
    await checkAndShow()
})

watch(() => route.params.customer_id, () => checkAndShow())
</script>
