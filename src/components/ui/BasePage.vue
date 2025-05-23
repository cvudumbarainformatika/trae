<template>
  <div class="flex flex-col h-full space-y-4 md:space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {{ subtitle }}
        </p>
        <slot name="subtitle"></slot>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Search Section -->
    <div v-if="$slots.search" class="max-w-full">
      <slot name="search"></slot>
    </div>

    <!-- Main Content Section -->
    <div class="flex-1 flex overflow-hidden w-full relative">
      <div class="flex flex-col h-full w-full space-y-4">
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
