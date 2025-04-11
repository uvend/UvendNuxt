<template>
    <div v-if="show" class="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        class="w-full h-full object-cover"
        :autoplay="config.autoplay"
        :muted="config.muted"
        playsinline
        @ended="hideSplash"
      >
        <source :src="config.videoUrl" type="video/mp4" />
      </video>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import config from '~/assets/splash-config.json'
  
  const show = ref(true)
  
  function hideSplash() {
    show.value = false
  }
  
  onMounted(() => {
    if (!config.showOnFirstLoad) {
      hideSplash()
    }
  })
  </script>
  
  <style scoped>
  video {
    pointer-events: none;
  }
  </style>
  