<script setup>
import { ref } from 'vue'
import { useThemeStore } from '../../stores/theme'
import BaseInput from '../ui/BaseInput.vue'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({
      barcode: '',
      name: '',
      unit: '',
      category: '',
      buyPrice: 0,
      regularPrice: 0,
      customerPrice: 0,
      wholesalePrice: 0,
      initialStock: 0,
      minStock: 0,
      rack: '',
      image: null
    })
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({ ...props.product })
const imagePreview = ref(null)

const units = ['pcs', 'kg', 'box', 'pack']
const categories = ['Electronics', 'Fashion', 'Food & Beverage', 'Home & Living']

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
    formData.value.image = file
  }
}

const handleSubmit = () => {
  emit('submit', formData.value)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Basic Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        v-model="formData.barcode"
        label="Barcode"
        type="text"
      />

      <BaseInput
        v-model="formData.name"
        label="Product Name"
        type="text"
        required
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
        <select
          v-model="formData.unit"
          class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
        >
          <option value="">Select Unit</option>
          <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select
          v-model="formData.category"
          class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
        >
          <option value="">Select Category</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
    </div>

    <!-- Pricing Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BaseInput
        v-model.number="formData.buyPrice"
        label="Buy Price"
        type="number"
        min="0"
      />

      <BaseInput
        v-model.number="formData.regularPrice"
        label="Regular Price"
        type="number"
        min="0"
      />

      <BaseInput
        v-model.number="formData.customerPrice"
        label="Customer Price"
        type="number"
        min="0"
      />

      <BaseInput
        v-model.number="formData.wholesalePrice"
        label="Wholesale Price"
        type="number"
        min="0"
      />
    </div>

    <!-- Stock Information -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseInput
        v-model.number="formData.initialStock"
        label="Initial Stock"
        type="number"
        min="0"
      />

      <BaseInput
        v-model.number="formData.minStock"
        label="Minimum Stock"
        type="number"
        min="0"
      />

      <BaseInput
        v-model="formData.rack"
        label="Rack Location"
        type="text"
      />
    </div>

    <!-- Image Upload -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Image</label>
      <div class="mt-1 flex items-center space-x-4">
        <div
          class="h-32 w-32 overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center"
        >
          <img
            v-if="imagePreview || formData.image"
            :src="imagePreview || formData.image"
            class="h-full w-full object-cover"
            alt="Product preview"
          >
          <span v-else class="text-gray-400 dark:text-gray-500">
            <span class="material-icons text-4xl">image</span>
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          @change="handleImageChange"
          class="block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4 file:rounded-md
            file:border-0 file:text-sm file:font-medium
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100
            dark:file:bg-primary-900 dark:file:text-primary-300"
        >
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        {{ isEdit ? 'Update' : 'Create' }} Product
      </button>
    </div>
  </form>
</template>