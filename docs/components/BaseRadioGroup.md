# BaseRadioGroup Component

A component for grouping radio buttons with support for labels, validation, and various display options.

## Features

- Group multiple radio buttons
- Inline or stacked layout
- Validation states (error)
- Customizable styling
- Dark mode support
- Accessibility features

## Basic Usage

```vue
<template>
  <BaseRadioGroup
    v-model="selectedOption"
    :options="options"
    label="Select an option"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedOption = ref('')
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
| `modelValue` | `String/Number/Boolean` | `''` | The current value (use with v-model) |
| `options` | `Array` | `[]` | Array of options to display |
| `name` | `String` | Auto-generated | The name attribute for the radio buttons |
| `label` | `String` | `''` | The label text for the group |
| `optionLabel` | `String` | `'label'` | The property to use for option labels |
| `optionValue` | `String` | `'value'` | The property to use for option values |
| `disabled` | `Boolean` | `false` | Whether all radio buttons are disabled |
| `required` | `Boolean` | `false` | Whether selection is required |
| `inline` | `Boolean` | `false` | Whether to display options inline |
| `error` | `String` | `''` | Error message to display |

## Events

| Event | Description |
|-------|-------------|
| `update:modelValue` | Emitted when a radio button is selected |

## Examples

### Stacked Radio Group

```vue
<template>
  <BaseRadioGroup
    v-model="paymentMethod"
    :options="paymentOptions"
    label="Payment Method"
    required
  />
</template>

<script setup>
import { ref } from 'vue'

const paymentMethod = ref('')
const paymentOptions = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' }
]
</script>
```

### Inline Radio Group

```vue
<template>
  <BaseRadioGroup
    v-model="size"
    :options="sizeOptions"
    label="Size"
    inline
  />
</template>

<script setup>
import { ref } from 'vue'

const size = ref('medium')
const sizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
]
</script>
```

### With Validation Error

```vue
<template>
  <BaseRadioGroup
    v-model="consent"
    :options="consentOptions"
    label="Consent"
    required
    :error="consentError"
  />
</template>

<script setup>
import { ref, computed } from 'vue'

const consent = ref('')
const consentOptions = [
  { value: 'yes', label: 'Yes, I consent' },
  { value: 'no', label: 'No, I do not consent' }
]

const consentError = computed(() => {
  return !consent.value ? 'Please select an option' : ''
})
</script>
```