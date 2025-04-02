<template>
  <Modal
    :model-value="modelValue"
    :title="isEdit ? 'Edit Kategori' : 'Tambah Kategori'"
    @update:model-value="handleClose"
  >
    <div class="mt-4">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-1">
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nama Kategori <span class="text-red-500">*</span>
          </label>
          <BaseInput
            id="name"
            v-model="form.name"
            placeholder="Masukkan nama kategori"
            :error="errors.name"
            required
          />
        </div>
        <div class="space-y-1">
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Deskripsi
          </label>
          <BaseTextarea
            id="description"
            v-model="form.description"
            placeholder="Masukkan deskripsi kategori"
            :error="errors.description"
            :rows="Number(3)"
          />
        </div>
      </form>
    </div>
    
    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton
          @click="handleClose"
          variant="secondary"
          type="button"
        >
          Batal
        </BaseButton>
        <BaseButton
          @click="handleSubmit"
          :disabled="!isValid"
          variant="primary"
          type="button"
        >
          {{ isEdit ? 'Perbarui' : 'Buat' }} Kategori
        </BaseButton>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  category: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit', 'update:modelValue'])

const form = ref({
  name: '',
  description: ''
})

const errors = ref({
  name: '',
  description: ''
})

const resetForm = () => {
  form.value = {
    name: '',
    description: ''
  }
  errors.value = {
    name: '',
    description: ''
  }
}

const validateForm = () => {
  errors.value.name = form.value.name.trim() === '' ? 'Name is required' : ''
  return Object.values(errors.value).every(error => error === '')
}

const isValid = computed(() => {
  return form.value.name.trim() !== ''
})

onMounted(() => {
  if (props.category) {
    form.value = {
      name: props.category.name || '',
      description: props.category.description || ''
    }
  }
})

const handleSubmit = () => {
  if (!validateForm()) return
  
  emit('submit', {
    name: form.value.name.trim(),
    description: form.value.description.trim()
  })
}

const handleClose = () => {
  resetForm()
  emit('close')
  emit('update:modelValue', false)
}

// Reset form when category prop changes
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    form.value = {
      name: newCategory.name || '',
      description: newCategory.description || ''
    }
  } else {
    resetForm()
  }
}, { deep: true })
</script>