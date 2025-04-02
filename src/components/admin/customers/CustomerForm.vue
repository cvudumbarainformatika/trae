<template>
  <Modal
    :modelValue="modelValue"
    :title="isEdit ? 'Edit Pelanggan' : 'Tambah Pelanggan'"
    @update:modelValue="$emit('update:modelValue', $event)"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Grid layout for desktop, stack on mobile -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <BaseInput
            v-model="form.name"
            label="Nama"
            placeholder="Masukkan nama pelanggan"
            :error="errors.name"
            required
          />
        </div>

        <div>
          <BaseInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Masukkan email pelanggan"
            :error="errors.email"
          />
        </div>

        <div>
          <BaseInput
            v-model="form.phone"
            label="Telepon"
            placeholder="Masukkan nomor telepon"
            :error="errors.phone"
          />
        </div>

        <div>
          <BaseInput
            v-model.number="form.initial_amount"
            label="Piutang Awal"
            type="number"
            :show-rupiah-hint="true"
            placeholder="Masukkan piutang awal"
            :error="errors.initial_amount"
          />
        </div>
      </div>

      <!-- Full width textareas -->
      <div>
        <BaseTextarea
          v-model="form.address"
          label="Alamat"
          placeholder="Masukkan alamat pelanggan"
          :error="errors.address"
          :rows="3"
        />
      </div>

      <div>
        <BaseTextarea
          v-model="form.notes"
          label="Catatan"
          placeholder="Masukkan catatan tentang piutang"
          :error="errors.notes"
          :rows="3"
        />
      </div>

      <div>
        <BaseTextarea
          v-model="form.description"
          label="Deskripsi"
          placeholder="Masukkan deskripsi pelanggan"
          :error="errors.description"
          :rows="3"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton
          variant="secondary"
          @click="$emit('close')"
        >
          Batal
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ isEdit ? 'Perbarui' : 'Simpan' }}
        </BaseButton>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  customer: {
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
  email: '',
  phone: '',
  address: '',
  description: '',
  initial_amount: 0,
  notes: ''
})

const errors = ref({})
const loading = ref(false)

onMounted(() => {
  if (props.customer) {
    form.value = { 
      ...props.customer,
      // Pastikan field-field ini diinisialisasi dengan benar
      initial_amount: props.customer.initial_amount || 0,
      notes: props.customer.notes || ''
    }
  }
})

const validate = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.name.trim()) {
    errors.value.name = 'Nama wajib diisi'
    isValid = false
  }

  if (form.value.email && !/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = 'Masukkan alamat email yang valid'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  loading.value = true
  try {
    await emit('submit', { ...form.value })
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    loading.value = false
  }
}
</script>