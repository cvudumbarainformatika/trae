<template>
  <div>
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            :class="header.class"
          >
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <template v-if="loading">
          <tr>
            <td :colspan="headers.length" class="px-3 py-4 text-sm text-gray-500 text-center">
              Loading...
            </td>
          </tr>
        </template>
        <template v-else-if="!items || items.length === 0">
          <tr>
            <td :colspan="headers.length" class="px-3 py-4 text-sm text-gray-500 text-center">
              No data available
            </td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td
              v-for="header in headers"
              :key="header.value"
              class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
              :class="header.class"
            >
              <slot :name="header.value" :item="item">
                {{ item[header.value] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="pagination" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          :disabled="pagination.page <= 1"
          @click="handlePageChange(pagination.page - 1)"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.page <= 1 }"
        >
          Previous
        </button>
        <button
          :disabled="pagination.page >= totalPages"
          @click="handlePageChange(pagination.page + 1)"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.page >= totalPages }"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ startItem }}</span>
            to
            <span class="font-medium">{{ endItem }}</span>
            of
            <span class="font-medium">{{ pagination.totalItems }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              :disabled="pagination.page <= 1"
              @click="handlePageChange(pagination.page - 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.page <= 1 }"
            >
              Previous
            </button>
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="handlePageChange(page)"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
              :class="page === pagination.page ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
            <button
              :disabled="pagination.page >= totalPages"
              @click="handlePageChange(pagination.page + 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.page >= totalPages }"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  headers: {
    type: Array,
    required: true,
    default: () => []
  },
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:pagination'])

// Pagination computeds
const totalPages = computed(() => {
  if (!props.pagination) return 0
  return Math.ceil(props.pagination.totalItems / props.pagination.itemsPerPage)
})

const startItem = computed(() => {
  if (!props.pagination || props.pagination.totalItems === 0) return 0
  return ((props.pagination.page - 1) * props.pagination.itemsPerPage) + 1
})

const endItem = computed(() => {
  if (!props.pagination) return 0
  return Math.min(startItem.value + props.pagination.itemsPerPage - 1, props.pagination.totalItems)
})

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = props.pagination.page
  const delta = 2
  const range = []
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < total - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (total > 1) {
    range.push(total)
  }
  
  return range
})

// Methods
const handlePageChange = (page) => {
  if (page === '...') return
  emit('update:pagination', { ...props.pagination, page })
}
</script>