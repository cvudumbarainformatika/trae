<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { useCategoryStore } from '../../stores/admin/category'
import CategoryForm from '../../components/admin/CategoryForm.vue'

// Store initialization
const themeStore = useThemeStore()
const categoryStore = useCategoryStore()

// State management
const selectedCategory = ref(null)
const isEdit = ref(false)

// Computed properties
const showCategoryForm = computed({
  get: () => categoryStore.showCategoryForm,
  set: (value) => categoryStore.setShowCategoryForm(value)
})

const searchQuery = computed({
  get: () => categoryStore.searchQuery,
  set: (value) => categoryStore.setSearchQuery(value)
})

// Pagination
const currentPage = ref(1)
const pagination = ref({
  itemsPerPage: 10
})

// Get paginated items
const getPageItems = computed(() => {
  const start = (currentPage.value - 1) * pagination.value.itemsPerPage
  const end = start + pagination.value.itemsPerPage
  return filteredCategories.value.slice(start, end)
})

// Categories data from store
const categories = computed(() => categoryStore.categories)

// Filtered categories from store
const filteredCategories = computed(() => categoryStore.filteredCategories)

// Category form handlers
const handleAddCategory = () => {
  selectedCategory.value = null
  isEdit.value = false
  showCategoryForm.value = true
}

const handleEditCategory = (category) => {
  selectedCategory.value = { ...category }
  isEdit.value = true
  showCategoryForm.value = true
}

const handleSaveCategory = (categoryData) => {
  if (isEdit.value) {
    categoryStore.updateCategory({ ...categoryData, id: selectedCategory.value.id })
  } else {
    categoryStore.addCategory(categoryData)
  }
  showCategoryForm.value = false
  selectedCategory.value = null
  isEdit.value = false
}

const handleDeleteCategory = (category) => {
  selectedCategory.value = category
  categoryStore.showDeleteConfirm = true
}

const confirmDelete = () => {
  if (selectedCategory.value) {
    categoryStore.deleteCategory(selectedCategory.value.id)
    categoryStore.showDeleteConfirm = false
    selectedCategory.value = null
  }
}
// Add view mode state
const isMobileView = ref(false)

// Add resize handler
onMounted(() => {
  checkMobileView()
  window.addEventListener('resize', checkMobileView)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobileView)
})

const checkMobileView = () => {
  isMobileView.value = window.innerWidth < 768
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h1>
      <button
        @click="handleAddCategory"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Add Category
      </button>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <BaseInput
        v-model="searchQuery"
        placeholder="Search categories..."
        type="search"
      >
        <template #prefix>
          <Icon name="SearchIcon" class="w-5 h-5 text-gray-400" />
        </template>
      </BaseInput>
    </div>

    <!-- Mobile View: Category Cards -->
    <div v-if="isMobileView" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="category in getPageItems"
        :key="category.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3"
      >
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ category.name }}</h3>
          <span
            :class="[
              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
              category.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            ]"
          >
            {{ category.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.description }}</p>
        <div class="flex justify-end space-x-2">
          <IconButton
            @click="handleEditCategory(category)"
            variant="ghost"
            size="sm"
            class="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
          >
            <template #icon>
              <Icon name="Edit2" class="w-4 h-4" />
            </template>
          </IconButton>
          <IconButton
            @click="handleDeleteCategory(category)"
            variant="ghost"
            size="sm"
            class="text-red-600 hover:text-red-900 dark:hover:text-red-400"
          >
            <template #icon>
              <Icon name="Trash2" class="w-4 h-4" />
            </template>
          </IconButton>
        </div>
      </div>
    </div>

    <!-- Desktop View: Categories Table -->
    <div v-else class="overflow-x-auto rounded-lg shadow relative">
      <table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="category in getPageItems" :key="category.id">
            <td class="px-6 py-4 lg:whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ category.name }}</td>
            <td class="hidden md:table-cell px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ category.description }}</td>
            <td class="px-6 py-4 lg:whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  category.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                ]"
              >
                {{ category.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 lg:whitespace-nowrap text-right text-sm font-medium space-x-2">
              <IconButton
                @click="handleEditCategory(category)"
                variant="ghost"
                size="sm"
                class="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
              >
                <template #icon>
                  <Icon name="Edit2" class="w-4 h-4" />
                </template>
              </IconButton>
              <IconButton
                @click="handleDeleteCategory(category)"
                variant="ghost"
                size="sm"
                class="text-red-600 hover:text-red-900 dark:hover:text-red-400"
              >
                <template #icon>
                  <Icon name="Trash2" class="w-4 h-4" />
                </template>
              </IconButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Category Form Modal -->
    <Modal
      v-model="showCategoryForm"
      :title="isEdit ? 'Edit Category' : 'Add Category'"
      @close="showCategoryForm = false"
    >
      <CategoryForm
        :category="selectedCategory"
        :is-edit="isEdit"
        @submit="handleSaveCategory"
        @cancel="showCategoryForm = false"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal
      v-model="categoryStore.showDeleteConfirm"
      title="Delete Category"
      @close="categoryStore.showDeleteConfirm = false"
    >
      <div class="p-6">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="categoryStore.showDeleteConfirm = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>

    <!-- Pagination -->
    <div class="mt-6">
      <BasePagination
        v-model:currentPage="currentPage"
        :total-items="filteredCategories.length"
        :items-per-page="pagination.itemsPerPage"
        :max-visible-pages="5"
      />
    </div>
  </div>
</template>