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
| `Icon` | Komponen untuk menampilkan ikon Lucide | [Dokumentasi](./components/Icon.md) |

## Penggunaan Ikon

Selalu gunakan komponen `Icon` untuk menampilkan ikon:

```vue
<Icon name="Plus" class="w-4 h-4" />
```

Ukuran standar:
- Kecil: `w-4 h-4`
- Sedang: `w-6 h-6`
- Besar: `w-8 h-8`

Daftar ikon yang tersedia dapat dilihat di [dokumentasi Lucide](https://lucide.dev/icons/).

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
