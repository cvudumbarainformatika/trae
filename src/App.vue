<template>
  <div id="app">
    <!-- Use BaseNotification component -->
    <BaseNotification />
    <router-view v-if="isReady" />
  </div>
</template>

<script setup>
import BaseNotification from '@/components/ui/BaseNotification.vue'
import { useMenuStore } from '@/stores/menu'
import { onMounted, ref } from 'vue'

const menu = useMenuStore()
const isReady = ref(false)
onMounted(async () => {
  // menu.fetchData()
  if (!menu.items.length) {
    await menu.fetchData()
  }
  isReady.value = true
})

</script>
