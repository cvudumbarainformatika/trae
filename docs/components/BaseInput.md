# BaseInput Component

A flexible and customizable input component that supports various input types, validation states, and slot-based customization.

## Features

- Support for all HTML input types
- Validation states (error, success)
- Prefix and suffix slots
- Debounced input
- Customizable styling
- Dark mode support

## Basic Usage

```vue
<template>
  <BaseInput
    v-model="inputValue"
    placeholder="Enter your name"
    label="Full Name"
  />
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `String`, `Number` | `''` | The input value (v-model binding) |
| `type` | `String` | `'text'` | Input type (text, number, email, password, etc.) |
| `label` | `String` | `''` | Label text for the input |
| `placeholder` | `String` | `''` | Placeholder text |
| `disabled` | `Boolean` | `false` | Whether the input is disabled |
| `readonly` | `Boolean` | `false` | Whether the input is readonly |
| `error` | `Boolean` | `false` | Whether to show error state |
| `success` | `Boolean` | `false` | Whether to show success state |
| `errorMessage` | `String` | `''` | Error message to display |
| `helpText` | `String` | `''` | Help text to display below the input |
| `debounce` | `Number` | `0` | Debounce delay in milliseconds |
| `id` | `String` | `null` | HTML id attribute (auto-generated if not provided) |
| `name` | `String` | `''` | HTML name attribute |
| `autocomplete` | `String` | `'off'` | HTML autocomplete attribute |
| `required` | `Boolean` | `false` | Whether the input is required |
| `min` | `[Number, String]` | `null` | Minimum value (for number inputs) |
| `max` | `[Number, String]` | `null` | Maximum value (for number inputs) |
| `step` | `[Number, String]` | `null` | Step value (for number inputs) |
| `pattern` | `String` | `null` | HTML pattern attribute for validation |
| `maxlength` | `[Number, String]` | `null` | Maximum input length |
| `minlength` | `[Number, String]` | `null` | Minimum input length |
| `autofocus` | `Boolean` | `false` | Whether to autofocus the input |
| `size` | `String` | `'md'` | Input size ('sm', 'md', 'lg') |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `update:modelValue` | `(value: string\|number)` | Emitted when the input value changes |
| `focus` | `(event: FocusEvent)` | Emitted when the input is focused |
| `blur` | `(event: FocusEvent)` | Emitted when the input loses focus |
| `input` | `(event: InputEvent)` | Emitted on input |
| `change` | `(event: Event)` | Emitted when the input value changes |
| `keydown` | `(event: KeyboardEvent)` | Emitted on keydown |
| `keyup` | `(event: KeyboardEvent)` | Emitted on keyup |
| `keypress` | `(event: KeyboardEvent)` | Emitted on keypress |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `label` | None | Custom label content |
| `prepend` | None | Content to prepend before the input |
| `append` | None | Content to append after the input |
| `prefix` | None | Content to place inside the input at the start |
| `suffix` | None | Content to place inside the input at the end |
| `error` | None | Custom error message content |
| `help` | None | Custom help text content |

## Methods

These methods are exposed and can be accessed using template refs:

| Method | Parameters | Description |
|--------|------------|-------------|
| `focus` | None | Focus the input |
| `blur` | None | Remove focus from the input |
| `select` | None | Select the input content |
| `setSelectionRange` | `(start: number, end: number)` | Set the selection range |

## Examples

### Basic Input with Label

```vue
<template>
  <BaseInput
    v-model="username"
    label="Username"
    placeholder="Enter your username"
    help-text="Username must be at least 3 characters"
  />
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
</script>
```

### Input with Validation

```vue
<template>
  <BaseInput
    v-model="email"
    type="email"
    label="Email Address"
    placeholder="your@email.com"
    :error="!isValidEmail && email !== ''"
    error-message="Please enter a valid email address"
    required
  />
</template>

<script setup>
import { ref, computed } from 'vue'

const email = ref('')
const isValidEmail = computed(() => {
  if (!email.value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})
</script>
```

### Input with Icons

```vue
<template>
  <BaseInput
    v-model="search"
    placeholder="Search..."
  >
    <template #prefix>
      <i class="ri-search-line text-gray-400"></i>
    </template>
    <template #suffix>
      <button v-if="search" @click="search = ''" class="text-gray-400 hover:text-gray-600">
        <i class="ri-close-line"></i>
      </button>
    </template>
  </BaseInput>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
</script>
```

### Password Input with Toggle

```vue
<template>
  <BaseInput
    v-model="password"
    :type="showPassword ? 'text' : 'password'"
    label="Password"
    placeholder="Enter your password"
  >
    <template #suffix>
      <button 
        type="button"
        @click="showPassword = !showPassword" 
        class="text-gray-400 hover:text-gray-600"
      >
        <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
      </button>
    </template>
  </BaseInput>
</template>

<script setup>
import { ref } from 'vue'

const password = ref('')
const showPassword = ref(false)
</script>
```

### Debounced Input

```vue
<template>
  <BaseInput
    v-model="searchQuery"
    placeholder="Search products..."
    :debounce="500"
    @update:model-value="performSearch"
  />
  <div v-if="loading" class="mt-2">Loading...</div>
  <div v-else-if="results.length > 0" class="mt-2">
    Found {{ results.length }} results
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const results = ref([])
const loading = ref(false)

const performSearch = async (query) => {
  if (!query || query.length < 3) {
    results.value = []
    return
  }
  
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    results.value = ['Result 1', 'Result 2', 'Result 3'].filter(r => 
      r.toLowerCase().includes(query.toLowerCase())
    )
  } catch (error) {
    console.error('Search error:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}
</script>
```

### Number Input with Min/Max

```vue
<template>
  <BaseInput
    v-model="quantity"
    type="number"
    label="Quantity"
    :min="1"
    :max="100"
    :step="1"
    help-text="Enter a value between 1 and 100"
  />
</template>

<script setup>
import { ref } from 'vue'

const quantity = ref(1)
</script>
```

### Form Integration

```vue
<template>
  <form @submit.prevent="submitForm">
    <div class="space-y-4">
      <BaseInput
        v-model="formData.name"
        label="Full Name"
        required
        :error="errors.name"
        :error-message="errors.name"
      />
      
      <BaseInput
        v-model="formData.email"
        type="email"
        label="Email Address"
        required
        :error="errors.email"
        :error-message="errors.email"
      />
      
      <BaseInput
        v-model="formData.phone"
        type="tel"
        label="Phone Number"
        :error="errors.phone"
        :error-message="errors.phone"
      />
      
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formData = reactive({
  name: '',
  email: '',
  phone: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: ''
})

const submitForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Validate
  let isValid = true
  
  if (!formData.name) {
    errors.name = 'Name is required'
    isValid = false
  }
  
  if (!formData.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (formData.phone && !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }
  
  if (isValid) {
    // Submit form
    console.log('Form submitted:', formData)
  }
}
</script>
```
