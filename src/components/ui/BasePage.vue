<template>
  <div class="flex flex-col h-full space-y-2 md:space-y-4">
    <!-- Header Section -->
    <div class="flex flex-row">
      <div class="flex flex-1">
        <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</div>
        <!-- <p v-if="subtitle" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {{ subtitle }}
        </p> -->
        <!-- <slot name="subtitle"></slot> -->
      </div>
      <div class="mt-0 ">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Search Section -->
    <div v-if="$slots.search" class="max-w-full">
      <slot name="search"></slot>

    </div>

    <!-- Main Content Section -->
    <div class="flex-1 flex overflow-hidden w-full relative">
      <div class="flex flex-col h-full w-full space-y-2 overflow-y-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>
