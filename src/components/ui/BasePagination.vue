<script setup>
import { computed } from 'vue'
import Card from './Card.vue'
import IconButton from './IconButton.vue'
import Icon from './Icon.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 12
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  },
  showCard: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:currentPage'])

const pagination = computed(() => {
  const totalPages = Math.ceil(props.totalItems / props.itemsPerPage)

  // Calculate visible page numbers
  let startPage = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + props.maxVisiblePages - 1)

  if (endPage - startPage + 1 < props.maxVisiblePages) {
    startPage = Math.max(1, endPage - props.maxVisiblePages + 1)
  }

  return {
    currentPage: props.currentPage,
    totalPages,
    startPage,
    endPage,
    totalItems: props.totalItems
  }
})

const changePage = (page) => {
  emit('update:currentPage', page)
}

const paginationContent = computed(() => {
  const start = ((props.currentPage - 1) * props.itemsPerPage) + 1
  const end = Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
  return {
    start,
    end
  }
})
</script>

<template>
  <div class="mt-6">
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing
        <span class="font-medium">{{ paginationContent.start }}</span>
        to
        <span class="font-medium">{{ paginationContent.end }}</span>
        of
        <span class="font-medium">{{ pagination.totalItems }}</span>
        results
      </div>

      <div class="flex space-x-2">
        <button
          @click="changePage(1)"
          :disabled="pagination.currentPage <= 1"
          class="inline-flex items-center px-2 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.currentPage <= 1 }"
        >
          <Icon name="chevrons-left" class="w-4 h-4" />
        </button>

        <button
          @click="changePage(pagination.currentPage - 1)"
          :disabled="pagination.currentPage <= 1"
          class="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.currentPage <= 1 }"
        >
          <Icon name="ChevronLeft" class="w-4 h-4 mr-1" />
          Previous
        </button>

        <div class="hidden md:flex space-x-1">
          <template v-for="page in pagination.totalPages" :key="page">
            <button
              v-if="page >= pagination.startPage && page <= pagination.endPage"
              @click="changePage(page)"
              class="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors"
              :class="pagination.currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
            >
              {{ page }}
            </button>
          </template>
        </div>

        <button
          @click="changePage(pagination.currentPage + 1)"
          :disabled="pagination.currentPage >= pagination.totalPages"
          class="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.currentPage >= pagination.totalPages }"
        >
          Next
          <Icon name="ChevronRight" class="w-4 h-4 ml-1" />
        </button>

        <button
          @click="changePage(pagination.totalPages)"
          :disabled="pagination.currentPage >= pagination.totalPages"
          class="inline-flex items-center px-2 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.currentPage >= pagination.totalPages }"
        >
          <Icon name="chevrons-right" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
