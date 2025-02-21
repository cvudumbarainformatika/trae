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
  <div class="flex-row">
    <template v-if="showCard">
      <Card padding="p-2" class="border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-2 bg-white dark:bg-dark-800">
          <slot name="content">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ paginationContent.start }}</span>
              to
              <span class="font-medium">{{ paginationContent.end }}</span>
              of
              <span class="font-medium">{{ pagination.totalItems }}</span>
              results
            </div>
          </slot>
          <div class="flex items-center space-x-1">
            <IconButton
              @click="changePage(1)"
              :disabled="pagination.currentPage === 1"
              variant="ghost"
              size="sm"
            >
              <template #icon>
                <Icon name="chevrons-left" class="w-4 h-4" />
              </template>
            </IconButton>
            <IconButton
              @click="changePage(pagination.currentPage - 1)"
              :disabled="pagination.currentPage === 1"
              variant="ghost"
              size="sm"
            >
              <template #icon>
                <Icon name="chevron-left" class="w-4 h-4" />
              </template>
            </IconButton>
            
            <div class="hidden sm:flex space-x-1">
              <template v-for="page in pagination.totalPages" :key="page">
                <IconButton
                  v-if="page >= pagination.startPage && page <= pagination.endPage"
                  @click="changePage(page)"
                  :variant="pagination.currentPage === page ? 'primary' : 'ghost'"
                  size="sm"
                >
                  {{ page }}
                </IconButton>
              </template>
            </div>

            <IconButton
              @click="changePage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.totalPages"
              variant="ghost"
              size="sm"
            >
              <template #icon>
                <Icon name="chevron-right" class="w-4 h-4" />
              </template>
            </IconButton>
            <IconButton
              @click="changePage(pagination.totalPages)"
              :disabled="pagination.currentPage >= pagination.totalPages"
              variant="ghost"
              size="sm"
            >
              <template #icon>
                <Icon name="chevrons-right" class="w-4 h-4" />
              </template>
            </IconButton>
          </div>
        </div>
      </Card>
    </template>
    <template v-else>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <slot name="content">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-medium">{{ paginationContent.start }}</span>
            to
            <span class="font-medium">{{ paginationContent.end }}</span>
            of
            <span class="font-medium">{{ pagination.totalItems }}</span>
            results
          </div>
        </slot>
        <div class="flex items-center space-x-1">
          <IconButton
            @click="changePage(1)"
            :disabled="pagination.currentPage === 1"
            variant="ghost"
            size="sm"
          >
            <template #icon>
              <Icon name="chevrons-left" class="w-4 h-4" />
            </template>
          </IconButton>
          <IconButton
            @click="changePage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            variant="ghost"
            size="sm"
          >
            <template #icon>
              <Icon name="chevron-left" class="w-4 h-4" />
            </template>
          </IconButton>
          
          <div class="hidden sm:flex space-x-1">
            <template v-for="page in pagination.totalPages" :key="page">
              <Button
                v-if="page >= pagination.startPage && page <= pagination.endPage"
                @click="changePage(page)"
                :variant="pagination.currentPage === page ? 'primary' : 'ghost'"
                size="sm"
              >
                {{ page }}
              </Button>
            </template>
          </div>

          <IconButton
            @click="changePage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage >= pagination.totalPages"
            variant="ghost"
            size="sm"
          >
            <template #icon>
              <Icon name="chevron-right" class="w-4 h-4" />
            </template>
          </IconButton>
          <IconButton
            @click="changePage(pagination.totalPages)"
            :disabled="pagination.currentPage >= pagination.totalPages"
            variant="ghost"
            size="sm"
          >
            <template #icon>
              <Icon name="chevrons-right" class="w-4 h-4" />
            </template>
          </IconButton>
        </div>
      </div>
    </template>
  </div>
</template>