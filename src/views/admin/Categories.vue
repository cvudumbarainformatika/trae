<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import CategoryForm from '../../components/admin/CategoryForm.vue'

// Store initialization
const themeStore = useThemeStore()

// Modal state
const showCategoryForm = ref(false)
const editingCategory = ref(null)

// Search query
const searchQuery = ref('')

// Mock categories data (to be replaced with actual API calls)
const categories = ref([
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    isActive: true
  },
  {
    id: 2,
    name: 'Clothing',
    description: 'Apparel and fashion items',
    isActive: true
  }
])

// Computed property for filtered categories
const filteredCategories = computed(() => {
  return categories.value.filter(category => {
    if (!searchQuery.value) return true
    
    const query = searchQuery.value.toLowerCase()
    return (
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    )
  })
})

// Category form handlers
const handleAddCategory = () => {
  editingCategory.value = null
  showCategoryForm.value = true
}

const handleEditCategory = (category) => {
  editingCategory.value = { ...category }
  showCategoryForm.value = true
}

const handleSaveCategory = (category) => {
  if (editingCategory.value) {
    // Update existing category
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value[index] = category
    }
  } else {
    // Add new category
    category.id = categories.value.length + 1
    categories.value.push(category)
  }
  showCategoryForm.value = false
}

const handleDeleteCategory = (category) => {
  if (confirm('Are you sure you want to delete this category?')) {
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
  }
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
          <SearchIcon class="w-5 h-5 text-gray-400" />
        </template>
      </BaseInput>
    </div>

    <!-- Categories Table -->
    <Card>
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="category in filteredCategories" :key="category.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ category.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ category.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="handleEditCategory(category)"
                class="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
              >
                Edit
              </button>
              <button
                @click="handleDeleteCategory(category)"
                class="text-red-600 hover:text-red-900 dark:hover:text-red-400"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>

    <!-- Category Form Modal -->
    <Modal
      v-model="showCategoryForm"
      :title="editingCategory ? 'Edit Category' : 'Add Category'"
    >
      <CategoryForm
        :category="editingCategory || {}"
        @save="handleSaveCategory"
        @cancel="showCategoryForm = false"
      />
    </Modal>
  </div>
</template>