<template>
  <div class="p-4 rounded-md" :class="alertClasses">
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon :name="iconName" class="h-5 w-5" :class="iconClasses" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium" :class="titleClasses">{{ title }}</h3>
        <div class="mt-2 text-sm" :class="messageClasses">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'CheckCircle'
    case 'warning':
      return 'AlertTriangle'
    case 'error':
      return 'AlertCircle'
    case 'info':
    default:
      return 'Info' // Ubah dari 'InformationCircle' menjadi 'Info'
  }
})
</script>