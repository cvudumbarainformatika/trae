<template>
  <div id="app">
    <!-- Use BaseNotification component -->
    <BaseNotification />
    <router-view />
  </div>
</template>

<script setup>
import BaseNotification from '@/components/ui/BaseNotification.vue'
</script>
