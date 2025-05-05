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

// Mapping untuk nama ikon yang sering salah
const iconNameMapping = {
  'InformationCircle': 'Info',
  'Information': 'Info',
  'InfoCircle': 'Info',
  'Trash2': 'Trash',
  'TrashCan': 'Trash',
  'Delete': 'Trash',
  'Save': 'Check',
  'Close': 'X',
  'Cancel': 'X',
  'Add': 'Plus',
  'New': 'Plus',
  'Create': 'Plus',
  'Update': 'Edit',
  'Modify': 'Edit',
  'Remove': 'Trash',
  'Back': 'ArrowLeft',
  'Next': 'ArrowRight',
  'Forward': 'ArrowRight',
  'Previous': 'ArrowLeft',
  'Print': 'Printer',
  'Download': 'DownloadCloud',
  'Upload': 'UploadCloud',
  'Settings': 'Settings',
  'Config': 'Settings',
  'Configuration': 'Settings',
  'User': 'User',
  'Profile': 'User',
  'Account': 'User',
  'Search': 'Search',
  'Find': 'Search',
  'Filter': 'Filter',
  'Sort': 'ArrowUpDown',
  'SortAsc': 'ArrowUp',
  'SortDesc': 'ArrowDown',
  'Calendar': 'Calendar',
  'Date': 'Calendar',
  'Time': 'Clock',
  'Clock': 'Clock',
  'Warning': 'AlertTriangle',
  'Error': 'AlertCircle',
  'Success': 'CheckCircle',
  'Info': 'Info'
}

const icon = computed(() => {
  let iconName = toPascalCase(props.name)

  // Cek apakah nama ikon perlu dipetakan ke nama yang benar
  if (iconNameMapping[iconName]) {
    iconName = iconNameMapping[iconName]
  }

  // Check if the icon exists in LucideIcons
  if (LucideIcons[iconName]) {
    return LucideIcons[iconName]
  }

  console.warn(`Icon '${iconName}' not found in Lucide icons. Using 'HelpCircle' as fallback.`)
  // Return a fallback icon if the requested icon is not found
  return LucideIcons.HelpCircle
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
