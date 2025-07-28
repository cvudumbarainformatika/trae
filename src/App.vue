<template>
  <div id="app">
    <!-- Use BaseNotification component -->
    <BaseNotification />
    <router-view v-if="isReady" />
  </div>
</template>

<script setup>
// import BaseNotification from '@/components/ui/BaseNotification.vue'
import { useMenuStore } from '@/stores/menu'
import { useCompanyStore } from '@/stores/settings/company'
import { onMounted, ref } from 'vue'

const menu = useMenuStore()
const company = useCompanyStore()
const isReady = ref(false)
onMounted(async () => {
  // menu.fetchData()

  if (!menu.items.length && !company.item) {
    Promise.all([
      menu.fetchData(),
      company.fetchData()
    ])
  }
  isReady.value = true
})

</script>
