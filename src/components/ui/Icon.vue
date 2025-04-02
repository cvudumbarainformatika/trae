<script setup>
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  strokeWidth: {
    type: [String, Number],
    default: 2
  }
})

const isPascalCase = (str) => {
  // Check if string starts with uppercase and contains no spaces, hyphens or underscores
  return /^[A-Z][a-zA-Z0-9]*$/.test(str)
}

const toPascalCase = (str) => {
  if (isPascalCase(str)) return str
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

const icon = computed(() => {
  const iconName = toPascalCase(props.name)
  // Check if the icon exists in LucideIcons
  if (LucideIcons[iconName]) {
    return LucideIcons[iconName]
  }
  console.warn(`Icon '${iconName}' not found in Lucide icons`)
  // Return null if icon not found to prevent rendering errors
  return null
})
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
  />
</template>