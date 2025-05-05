# BaseRadio Component

A customizable radio button component with support for labels and disabled states.

## Features

- Customizable styling
- Support for labels
- Disabled state
- Dark mode support
- Accessibility features

## Basic Usage

```vue
<template>
  <BaseRadio
    v-model="selectedOption"
    value="option1"
    label="Option 1"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedOption = ref('')
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `String/Number/Boolean` | `''` | The current value (use with v-model) |
| `value` | `String/Number/Boolean` | Required | The value of this radio button |
| `name` | `String` | `''` | The name attribute for the radio button |
| `label` | `String` | `''` | The label text |
| `disabled` | `Boolean` | `false` | Whether the radio button is disabled |
| `required` | `Boolean` | `false` | Whether the radio button is required |
| `id` | `String` | Auto-generated | The ID for the radio button |

## Events

| Event | Description |
|-------|-------------|
| `update:modelValue` | Emitted when the radio button is selected |

## Examples

### Basic Radio Button

```vue
<template>
  <BaseRadio
    v-model="agree"
    :value="true"
    label="I agree to the terms and conditions"
    required
  />
</template>

<script setup>
import { ref } from 'vue'

const agree = ref(false)
</script>
```

### Disabled Radio Button

```vue
<template>
  <BaseRadio
    v-model="option"
    value="disabled"
    label="This option is disabled"
    disabled
  />
</template>

<script setup>
import { ref } from 'vue'

const option = ref('')
</script>
```

### Custom Content

```vue
<template>
  <BaseRadio
    v-model="plan"
    value="premium"
  >
    <div class="ml-2">
      <div class="font-medium text-gray-900 dark:text-white">Premium Plan</div>
      <div class="text-sm text-gray-500 dark:text-gray-400">$29/month</div>
    </div>
  </BaseRadio>
</template>

<script setup>
import { ref } from 'vue'

const plan = ref('')
</script>
```