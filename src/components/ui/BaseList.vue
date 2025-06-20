<template>
  <div class="flex-1 overflow-auto relative mt-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!items || items.length === 0"
      class="flex flex-col items-center justify-center h-64 text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <Icon :name="emptyIcon" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ emptyTitle }}</h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-md">
        {{ emptyDescription }}
      </p>
    </div>

    <!-- Item List -->
    <div v-else class="grid gap-4">
      <slot name="item" v-for="(item, index) in items" :item="item" :index="index"></slot>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && items.length > 0" class="mt-6">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing
          <span class="font-medium">{{ ((pagination.page - 1) * pagination.itemsPerPage) + 1 }}</span>
          to
          <span class="font-medium">{{ Math.min(pagination.page * pagination.itemsPerPage, pagination.totalItems)
            }}</span>
          of
          <span class="font-medium">{{ pagination.totalItems }}</span>
          results
        </div>

        <div class="flex space-x-2">
          <button @click="$emit('page-change', pagination.page - 1)" :disabled="pagination.page <= 1"
            class="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': pagination.page <= 1 }">
            <Icon name="ChevronLeft" class="w-4 h-4 mr-1" />
            Previous
          </button>

          <button @click="$emit('page-change', pagination.page + 1)"
            :disabled="pagination.page >= Math.ceil(pagination.totalItems / pagination.itemsPerPage)"
            class="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': pagination.page >= Math.ceil(pagination.totalItems / pagination.itemsPerPage) }">
            Next
            <Icon name="ChevronRight" class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from '@/components/ui/Icon.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: null
  },
  emptyIcon: {
    type: String,
    default: 'AlertCircle'
  },
  emptyTitle: {
    type: String,
    default: 'No Data Available'
  },
  emptyDescription: {
    type: String,
    default: 'There are no items to display at this time.'
  }
})

defineEmits(['page-change'])
</script>

<style scoped>
/* Animasi loading */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
