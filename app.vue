<template>
  <div>
    <Toaster />
    <NuxtLayout v-if="shouldRenderRoute">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
const route = useRoute()

const shouldRenderRoute = computed(() => {
  if (import.meta.client) return true
  return route.meta.layout === 'noauth'
})
</script>
