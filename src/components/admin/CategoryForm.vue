<script setup>
import { ref } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    default: () => ({
      id: null,
      name: '',
      description: '',
      isActive: true
    })
  }
})

const emit = defineEmits(['save', 'cancel'])

const formData = ref({
  name: props.category.name,
  description: props.category.description,
  isActive: props.category.isActive
})

const handleSubmit = () => {
  emit('save', {
    ...props.category,
    ...formData.value
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="formData.name"
      label="Category Name"
      placeholder="Enter category name"
      required
    />
    
    <BaseInput
      v-model="formData.description"
      label="Description"
      placeholder="Enter category description"
      type="textarea"
    />
    
    <div class="flex items-center space-x-2">
      <input
        type="checkbox"
        id="isActive"
        v-model="formData.isActive"
        class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      >
      <label for="isActive" class="text-sm text-gray-700 dark:text-gray-300">
        Active
      </label>
    </div>

    <div class="flex justify-end space-x-2">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Save
      </button>
    </div>
  </form>
</template>