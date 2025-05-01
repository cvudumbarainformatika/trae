# Referensi Komponen UI

## Komponen Base

| Komponen | Kegunaan | Dokumentasi |
|----------|----------|-------------|
| `BaseInput` | Input teks, angka, email, password, dll. | [Dokumentasi](./components/BaseInput.md) |
| `BaseSelect` | Dropdown, multi-select dengan pencarian | [Dokumentasi](./components/BaseSelect.md) |
| `BaseButton` | Tombol dengan berbagai varian dan ukuran | [Dokumentasi](./components/BaseButton.md) |
| `BaseDialog` | Modal/dialog dengan berbagai ukuran | [Dokumentasi](./components/BaseDialog.md) |
| `BasePage` | Layout halaman dengan header dan actions | [Dokumentasi](./components/BasePage.md) |
| `SearchDropdown` | Dropdown dengan fungsi pencarian | [Dokumentasi](./components/SearchDropdown.md) |

## Contoh Penggunaan Umum

### Form dengan Validasi
```vue
<template>
  <form @submit.prevent="submitForm">
    <BaseInput
      v-model="form.name"
      label="Nama"
      :error="errors.name"
      required
    />
    
    <BaseSelect
      v-model="form.category"
      :options="categories"
      label="Kategori"
      :error="errors.category"
      required
    />
    
    <BaseButton type="submit">Simpan</BaseButton>
  </form>
</template>
```

### Dialog Konfirmasi
```vue
<template>
  <BaseDialog v-model="showDialog" title="Konfirmasi">
    <p>Apakah Anda yakin ingin melanjutkan?</p>
    
    <template #footer>
      <BaseButton @click="showDialog = false" variant="ghost">
        Batal
      </BaseButton>
      <BaseButton @click="confirm" variant="primary">
        Konfirmasi
      </BaseButton>
    </template>
  </BaseDialog>
</template>
```