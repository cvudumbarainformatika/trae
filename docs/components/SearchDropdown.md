# SearchDropdown Component

A versatile search dropdown component with autocomplete functionality, keyboard navigation, and API integration.

## Features

- Debounced search input
- Customizable minimum search length
- API integration with dynamic response handling
- Keyboard navigation (arrow keys, enter, escape)
- Custom item rendering with slots
- Loading states
- "Add new" functionality
- Fully customizable styling

## Basic Usage

```vue
<template>
  <SearchDropdown
    v-model="searchQuery"
    placeholder="Search items..."
    :items="items"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
])

const handleSelect = (item) => {
  console.log('Selected item:', item)
}
</script>
```

## API Integration

```vue
<template>
  <SearchDropdown
    v-model="searchQuery"
    api-url="/api/v1/products/search"
    api-response-path="data.data"
    :use-api="true"
    @select="handleSelect"
    @items-loaded="onItemsLoaded"
  />
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const items = ref([])

const handleSelect = (item) => {
  console.log('Selected item:', item)
}

const onItemsLoaded = (loadedItems) => {
  items.value = loadedItems
}
</script>
```

## Custom Item Rendering

```vue
<template>
  <SearchDropdown
    v-model="searchQuery"
    :items="products"
    @select="handleSelect"
  >
    <template #item="{ item }">
      <div class="font-medium">{{ item.name }}</div>
      <div class="text-sm text-gray-500">
        {{ item.sku }} - {{ formatPrice(item.price) }}
      </div>
    </template>
  </SearchDropdown>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `String` | `''` | The search query value (v-model binding) |
| `items` | `Array` | `[]` | Array of items to display in the dropdown (when not using API) |
| `placeholder` | `String` | `'Search...'` | Placeholder text for the search input |
| `debounce` | `Number` | `300` | Debounce delay in milliseconds for search input |
| `minSearchLength` | `Number` | `3` | Minimum number of characters required to trigger search |
| `itemKey` | `String` | `'id'` | Property name to use as unique key for items |
| `itemLabel` | `String` | `'name'` | Property name to display as item label |
| `notFoundText` | `String` | `'No results found'` | Text to display when no results are found |
| `notFoundSubtext` | `String` | `'Try different keywords or add a new item'` | Subtext to display when no results are found |
| `addButtonText` | `String` | `'Add New Item'` | Text for the "add new" button |
| `showAddButton` | `Boolean` | `true` | Whether to show the "add new" button when no results are found |
| `loading` | `Boolean` | `false` | Whether to show loading state (when not using API) |
| `useApi` | `Boolean` | `false` | Whether to use internal API fetching |
| `apiUrl` | `String` | `''` | URL for API requests (when useApi is true) |
| `apiParams` | `Object` | `{}` | Additional parameters to include in API requests |
| `apiResponsePath` | `String` | `'data'` | Path to access data from API response (e.g., 'data' or 'data.data') |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `update:modelValue` | `(value: string)` | Emitted when the search query changes |
| `search` | `(query: string)` | Emitted when a search is triggered (when not using API) |
| `select` | `(item: any)` | Emitted when an item is selected |
| `add-new` | `(query: string)` | Emitted when the "add new" button is clicked |
| `items-loaded` | `(items: Array)` | Emitted when items are loaded from API |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | None | Custom content for the entire component |
| `item` | `{ item }` | Custom content for each item in the dropdown |
| `append` | None | Content to append to the search input |

## Methods

These methods are exposed and can be accessed using template refs:

| Method | Parameters | Description |
|--------|------------|-------------|
| `focus` | None | Focus the search input |
| `closeDropdown` | None | Close the dropdown |
| `fetchFromApi` | `(query: string)` | Manually trigger an API fetch |

## Keyboard Navigation

The component supports the following keyboard shortcuts:

- **Arrow Down**: Open dropdown (if closed) or navigate to next item
- **Arrow Up**: Navigate to previous item
- **Enter**: Select the currently highlighted item
- **Escape**: Close the dropdown

## Examples

### Basic Example with Local Data

```vue
<template>
  <SearchDropdown
    v-model="search"
    :items="filteredItems"
    placeholder="Search items..."
    @select="handleSelect"
  />
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' }
])

const filteredItems = computed(() => {
  if (!search.value) return []
  return items.value.filter(item => 
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const handleSelect = (item) => {
  console.log('Selected:', item)
}
</script>
```

### API Integration Example

```vue
<template>
  <SearchDropdown
    v-model="search"
    placeholder="Search products..."
    api-url="/api/v1/products/search"
    api-response-path="data"
    :api-params="{ category: selectedCategory }"
    :use-api="true"
    @select="selectProduct"
    @add-new="navigateToNewProduct"
  >
    <template #item="{ item }">
      <div class="font-medium">{{ item.name }}</div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">{{ item.sku }}</span>
        <span class="font-medium text-blue-600">{{ formatPrice(item.price) }}</span>
      </div>
    </template>
  </SearchDropdown>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const search = ref('')
const selectedCategory = ref('electronics')

const selectProduct = (product) => {
  console.log('Selected product:', product)
}

const navigateToNewProduct = () => {
  router.push({
    path: '/products/new',
    query: { name: search.value }
  })
}

const formatPrice = (price) => {
  return `$${price.toFixed(2)}`
}
</script>
```

### Form Integration Example

```vue
<template>
  <form @submit.prevent="submitForm">
    <div class="form-group">
      <label>Product</label>
      <SearchDropdown
        v-model="productSearch"
        ref="productSearchRef"
        api-url="/api/v1/products/search"
        api-response-path="data"
        :use-api="true"
        @select="selectProduct"
      />
      <div v-if="selectedProduct" class="mt-2 p-2 bg-gray-100 rounded">
        Selected: {{ selectedProduct.name }}
      </div>
    </div>
    
    <button type="submit" class="btn btn-primary mt-4">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const productSearch = ref('')
const selectedProduct = ref(null)
const productSearchRef = ref(null)

const selectProduct = (product) => {
  selectedProduct.value = product
  productSearch.value = product.name
}

const submitForm = () => {
  if (!selectedProduct.value) {
    alert('Please select a product')
    productSearchRef.value.focus()
    return
  }
  
  // Process form submission
  console.log('Submitting form with product:', selectedProduct.value)
}
</script>
```