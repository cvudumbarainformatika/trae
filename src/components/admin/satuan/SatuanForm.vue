<template>
  <Modal
    :model-value="modelValue"
    :title="isEdit ? 'Edit Satuan' : 'Tambah Satuan'"
    @update:model-value="handleClose"
  >
    <div class="mt-4">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-1">
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nama Satuan <span class="text-red-500">*</span>
          </label>
          <BaseInput
            id="name"
            v-model="form.name"
            placeholder="Masukkan nama satuan"
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
            placeholder="Masukkan deskripsi satuan"
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
          {{ isEdit ? 'Perbarui' : 'Buat' }} Satuan
        </BaseButton>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  satuan: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'submit'])

const form = ref({
  name: '',
  description: ''
})

const errors = ref({
  name: '',
  description: ''
})

const isValid = computed(() => {
  return form.value.name.trim() !== ''
})

watch(() => props.satuan, (newValue) => {
  // console.log('watch',newValue)
  if (newValue) {
    form.value = {
      name: newValue.name || '',
      description: newValue.description || ''
    }
  } else {
    form.value = {
      name: '',
      description: ''
    }
  }
  // Reset errors when form data changes
  errors.value = {
    name: '',
    description: ''
  }
}, { immediate: true })

const handleSubmit = () => {
  // Validate before submit
  errors.value.name = form.value.name.trim() === '' ? 'Nama satuan harus diisi' : ''
  
  if (isValid.value) {
    emit('submit', { ...form.value })
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
  
}
</script>