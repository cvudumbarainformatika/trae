<script setup>
import { ref } from 'vue'
import { useSupplierStore } from '@/stores/admin/supplier'

const props = defineProps({
  supplier: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const supplierStore = useSupplierStore()
const formData = ref({
  name: props.supplier?.name || '',
  address: props.supplier?.address || '',
  phone: props.supplier?.phone || '',
  email: props.supplier?.email || '',
  description: props.supplier?.description || ''
})

const handleSubmit = async () => {
  try {
    if (props.isEdit) {
      await supplierStore.updateSupplier({ ...formData.value, id: props.supplier.id })
    } else {
      await supplierStore.addSupplier(formData.value)
    }
    emit('submit')
  } catch (error) {
    console.error('Error submitting supplier:', error)
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="relative max-w-4xl mx-auto bg-gray-300 dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300">
    <div class="p-4 space-y-4 pb-[100px]">
      <!-- Form Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Supplier {{ isEdit ? 'Edit' : 'Baru' }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Isi informasi di bawah untuk {{ isEdit ? 'memperbarui' : 'membuat' }} supplier.</p>
      </div>

      <!-- Basic Information Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
          <span class="material-icons text-primary-500">info</span>
          <span>Informasi Supplier</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <BaseInput
            v-model="formData.name"
            label="Nama Supplier"
            type="text"
            required
            clearable
            placeholder="Masukkan nama supplier"
          />

          <BaseInput
            v-model="formData.email"
            label="Email"
            type="email"
            clearable
            placeholder="Masukkan email supplier"
          />

          <BaseInput
            v-model="formData.phone"
            label="Nomor Telepon"
            type="tel"
            clearable
            placeholder="Masukkan nomor telepon"
          />

          <BaseInput
            v-model="formData.address"
            label="Alamat"
            type="text"
            clearable
            placeholder="Masukkan alamat supplier"
          />

          <div class="col-span-2">
            <BaseTextarea
              v-model="formData.description"
              label="Deskripsi"
              placeholder="Masukkan deskripsi supplier"
              rows="4"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gray-100 dark:bg-dark-900 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-end space-x-2">
        <BaseButton
          type="button"
          variant="secondary"
          @click="handleCancel"
        >
          Batal
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :loading="supplierStore.loading"
        >
          {{ isEdit ? 'Perbarui' : 'Simpan' }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>