# UI Components Documentation

## Table of Contents

- [Base Components](#base-components)
  - [BaseSelect](#baseselect)
  - [BasePagination](#basepagination)
  - [IconButton](#iconbutton)
  - [Icon](#icon)
  - [Card](#card)
  - [Modal](#modal)
  - [BaseInput](#baseinput)
- [Admin Components](#admin-components)
  - [ProductForm](#productform)
  - [ProductCard](#productcard)
  - [ProductTable](#producttable)
  - [BarcodeScanner](#barcodescanner)
  - [CategoryForm](#categoryform)

## Base Components

### BaseSelect

A customizable select component with search functionality.

#### Props

- `modelValue` (any): The selected value
- `options` (Array): Array of options to display
- `optionLabel` (String): Property name for option label when options are objects
- `optionValue` (String): Property name for option value when options are objects
- `placeholder` (String): Placeholder text
- `disabled` (Boolean): Whether the select is disabled
- `error` (Boolean): Whether to show error state
- `clearable` (Boolean): Whether to show clear button

#### Events

- `update:modelValue`: Emitted when selection changes

### IconButton

A button component with icon support.

#### Props

- `variant` (String): Button style variant ('primary', 'secondary', 'danger', 'ghost', 'info')
- `size` (String): Button size ('sm', 'md', 'lg')
- `disabled` (Boolean): Whether the button is disabled
- `tooltip` (String): Tooltip text
- `tooltip-position` (String): Tooltip position ('top', 'bottom', 'left', 'right')

#### Events

- `click`: Emitted when button is clicked

### Card

A container component for content organization.

#### Props

- `noPadding` (Boolean): Whether to remove default padding

### Modal

A modal dialog component.

#### Props

- `modelValue` (Boolean): Controls modal visibility
- `title` (String): Modal title

#### Events

- `update:modelValue`: Emitted when modal visibility changes
- `close`: Emitted when modal is closed

## Admin Components

### ProductForm

Form component for creating and editing products.

#### Props

- `product` (Object): Product data for editing
  ```js
  {
    barcode: '',
    name: '',
    unit: '',
    category: '',
    buyPrice: 0,
    regularPrice: 0,
    customerPrice: 0,
    wholesalePrice: 0,
    initialStock: 0,
    minStock: 0,
    rack: '',
    image: null
  }
  ```
- `isEdit` (Boolean): Whether form is in edit mode

#### Events

- `submit`: Emitted with form data when submitted
- `cancel`: Emitted when form is cancelled

### ProductCard

Card component for displaying product information in grid view.

#### Props

- `product` (Object): Product data to display
- `searchQuery` (String): Current search query for highlighting

#### Events

- `edit`: Emitted when edit button is clicked
- `delete`: Emitted when delete button is clicked

### ProductTable

Table component for displaying products in list view.

#### Props

- `products` (Array): Array of products to display
- `searchQuery` (String): Current search query for highlighting

#### Events

- `edit`: Emitted when edit button is clicked
- `delete`: Emitted when delete button is clicked

### BarcodeScanner

Component for scanning product barcodes.

#### Events

- `scan-success`: Emitted with scan result when successful
- `scan-error`: Emitted when scanning fails
- `close`: Emitted when scanner is closed

### CategoryForm

Form component for creating and editing categories.

#### Props

- `category` (Object): Category data for editing
- `isEdit` (Boolean): Whether form is in edit mode

#### Events

- `submit`: Emitted with form data when submitted
- `cancel`: Emitted when form is cancelled

## Usage Examples

### Using BaseSelect

```vue
<BaseSelect
  v-model="selectedCategory"
  :options="categories"
  option-label="name"
  option-value="id"
  placeholder="Select Category"
  clearable
/>
```

### Using ProductForm

```vue
<ProductForm
  :product="selectedProduct"
  :is-edit="isEdit"
  @submit="handleProductSubmit"
  @cancel="handleProductCancel"
/>
```

### Using Modal with ProductForm

```vue
<Modal
  v-model="showProductForm"
  :title="isEdit ? 'Edit Product' : 'Add New Product'"
  @close="showProductForm = false"
>
  <ProductForm
    :product="selectedProduct"
    :is-edit="isEdit"
    @submit="handleProductSubmit"
    @cancel="handleProductCancel"
  />
</Modal>
```