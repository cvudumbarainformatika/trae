# BaseSelect Component

A customizable select component with support for single and multiple selections, search functionality, and custom option rendering.

## Features

- Single and multiple selection modes
- Searchable options
- Custom option rendering with slots
- Validation states (error, success)
- Keyboard navigation
- Customizable styling
- Dark mode support

## Basic Usage

```vue
<template>
  <BaseSelect
    v-model="selectedValue"
    :options="options"
    label="Select an option"
    placeholder="Choose an option"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedValue = ref('')
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `String`, `Number`, `Array` | `''` | The selected value(s) (v-model binding) |
| `options` | `Array` | `[]` | Array of options to display in the dropdown |
| `label` | `String` | `''` | Label text for the select |
| `placeholder` | `String` | `'Select...'` | Placeholder text when no option is selected |
| `disabled` | `Boolean` | `false` | Whether the select is disabled |
| `readonly` | `Boolean` | `false` | Whether the select is readonly |
| `error` | `Boolean` | `false` | Whether to show error state |
| `success` | `Boolean` | `false` | Whether to show success state |
| `errorMessage` | `String` | `''` | Error message to display |
| `helpText` | `String` | `''` | Help text to display below the select |
| `multiple` | `Boolean` | `false` | Whether multiple options can be selected |
| `searchable` | `Boolean` | `false` | Whether to enable search functionality |
| `clearable` | `Boolean` | `false` | Whether to show a clear button |
| `id` | `String` | `null` | HTML id attribute (auto-generated if not provided) |
| `name` | `String` | `''` | HTML name attribute |
| `required` | `Boolean` | `false` | Whether the select is required |
| `valueKey` | `String` | `'value'` | Property name to use as option value |
| `labelKey` | `String` | `'label'` | Property name to use as option label |
| `size` | `String` | `'md'` | Select size ('sm', 'md', 'lg') |
| `loading` | `Boolean` | `false` | Whether to show loading state |
| `noOptionsText` | `String` | `'No options available'` | Text to display when no options are available |
| `noResultsText` | `String` | `'No results found'` | Text to display when search returns no results |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `update:modelValue` | `(value: string\|number\|array)` | Emitted when the selected value changes |
| `focus` | `(event: FocusEvent)` | Emitted when the select is focused |
| `blur` | `(event: FocusEvent)` | Emitted when the select loses focus |
| `change` | `(value: string\|number\|array)` | Emitted when the selected value changes |
| `search` | `(query: string)` | Emitted when the search query changes |
| `open` | None | Emitted when the dropdown opens |
| `close` | None | Emitted when the dropdown closes |
| `clear` | None | Emitted when the selection is cleared |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `label` | None | Custom label content |
| `option` | `{ option, index, isSelected }` | Custom option content |
| `selected` | `{ value, option }` | Custom selected value content |
| `prepend` | None | Content to prepend before the select |
| `append` | None | Content to append after the select |
| `error` | None | Custom error message content |
| `help` | None | Custom help text content |
| `no-options` | None | Content to display when no options are available |
| `no-results` | `{ query }` | Content to display when search returns no results |

## Methods

These methods are exposed and can be accessed using template refs:

| Method | Parameters | Description |
|--------|------------|-------------|
| `focus` | None | Focus the select |
| `blur` | None | Remove focus from the select |
| `open` | None | Open the dropdown |
| `close` | None | Close the dropdown |
| `clear` | None | Clear the selection |

## Keyboard Navigation

The component supports the following keyboard shortcuts:

- **Space/Enter**: Open dropdown (if closed) or select the highlighted option
- **Arrow Down**: Open dropdown (if closed) or navigate to next option
- **Arrow Up**: Navigate to previous option
- **Escape**: Close the dropdown
- **Tab**: Move focus to the next focusable element
- **Backspace**: Clear selection (if clearable)

## Examples

### Basic Single Select

```vue
<template>
  <BaseSelect
    v-model="selectedCountry"
    :options="countries"
    label="Country"
    placeholder="Select a country"
    searchable
    clearable
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedCountry = ref('')
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' }
]
</script>
```

### Multiple Select

```vue
<template>
  <BaseSelect
    v-model="selectedTags"
    :options="tags"
    label="Tags"
    placeholder="Select tags"
    multiple
    searchable
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedTags = ref([])
const tags = [
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' }
]
</script>
```

### Custom Option Rendering

```vue
<template>
  <BaseSelect
    v-model="selectedUser"
    :options="users"
    label="Assign to"
    placeholder="Select a user"
    searchable
  >
    <template #option="{ option, isSelected }">
      <div class="flex items-center space-x-3">
        <img :src="option.avatar" class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-medium">{{ option.label }}</div>
          <div class="text-sm text-gray-500">{{ option.email }}</div>
        </div>
        <div v-if="isSelected" class="ml-auto text-green-500">
          <i class="ri-check-line"></i>
        </div>
      </div>
    </template>
    
    <template #selected="{ option }">
      <div class="flex items-center space-x-2">
        <img v-if="option" :src="option.avatar" class="