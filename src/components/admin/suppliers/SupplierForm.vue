<template>
  <Modal
    :modelValue="modelValue"
    :title="isEdit ? 'Edit Supplier' : 'Add Supplier'"
    @update:modelValue="$emit('update:modelValue', $event)"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Grid layout for desktop, stack on mobile -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <BaseInput
            v-model="form.name"
            label="Name"
            placeholder="Enter supplier name"
            :error="errors.name"
            required
          />
        </div>

        <div>
          <BaseInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Enter supplier email"
            :error="errors.email"
          />
        </div>

        <div>
          <BaseInput
            v-model="form.phone"
            label="Phone"
            placeholder="Enter supplier phone number"
            :error="errors.phone"
          />
        </div>

        <div>
          <BaseInput
            v-model.number="form.initial_amount"
            label="Initial Amount"
            type="number"
            :show-rupiah-hint="true"
            placeholder="Enter initial debt amount"
            :error="errors.initial_amount"
          />
        </div>
      </div>

      <!-- Full width textareas -->
      <div>
        <BaseTextarea
          v-model="form.notes"
          label="Notes"
          placeholder="Enter notes about this supplier"
          :error="errors.notes"
          :rows="3"
        />
      </div>

      <div>
        <BaseTextarea
          v-model="form.address"
          label="Address"
          placeholder="Enter supplier address"
          :error="errors.address"
          :rows="3"
        />
      </div>

      <div>
        <BaseTextarea
          v-model="form.description"
          label="Description"
          placeholder="Enter supplier description"
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
          Cancel
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ isEdit ? 'Update' : 'Save' }}
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
  supplier: {
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
  if (props.supplier) {
    form.value = { 
      ...props.supplier,
      // Ensure these fields are properly initialized
      initial_amount: props.supplier.initial_amount || 0,
      notes: props.supplier.notes || ''
    }
  }
})

const validate = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
    isValid = false
  }

  if (form.value.email && !/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
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