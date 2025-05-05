# Standar Pengkodean (Coding Standards)

Dokumen ini berisi standar pengkodean yang harus diikuti oleh semua pengembang yang bekerja pada proyek ini. Tujuannya adalah untuk memastikan konsistensi, keterbacaan, dan pemeliharaan kode yang lebih baik.

## Prinsip Umum

1. **Keterbacaan**: Kode harus mudah dibaca dan dipahami oleh pengembang lain.
2. **Konsistensi**: Gunakan pola dan konvensi yang sama di seluruh codebase.
3. **Modularitas**: Pisahkan kode menjadi modul yang kohesif dan dapat digunakan kembali.
4. **Dokumentasi**: Dokumentasikan kode dengan jelas, terutama untuk API dan logika kompleks.
5. **Testability**: Tulis kode yang mudah diuji.

## Struktur Proyek

### Organisasi Folder

- `/src/components/ui/` - Komponen UI dasar yang dapat digunakan kembali
- `/src/components/admin/` - Komponen khusus untuk panel admin
- `/src/views/` - Komponen halaman utama
- `/src/composables/` - Logika yang dapat digunakan kembali
- `/src/stores/` - State management dengan Pinia
- `/src/constants/` - Nilai konstan yang digunakan di seluruh aplikasi
- `/src/utils/` - Fungsi utilitas umum
- `/src/services/` - Layanan API dan integrasi eksternal
- `/src/assets/` - Aset statis (gambar, font, dll)
- `/src/router/` - Konfigurasi router
- `/docs/` - Dokumentasi proyek

## Konvensi Penamaan

- **Komponen**: PascalCase (BaseButton, UserProfile)
- **Composables**: camelCase dengan awalan "use" (useNotification, useValidation)
- **Stores**: camelCase dengan nama domain (userStore, productStore)
- **Konstanta**: UPPER_SNAKE_CASE (USER_ROLES, PAYMENT_STATUS)
- **File CSS**: kebab-case (button-styles.css, user-profile.css)
- **File Vue**: PascalCase (UserProfile.vue, ProductList.vue)
- **File JavaScript**: camelCase (apiService.js, formUtils.js)

## Standar Vue

### Komponen

- Gunakan `<script setup>` untuk semua komponen baru
- Dokumentasikan props, emits, dan slots dengan JSDoc
- Pisahkan logika bisnis dari komponen ke stores atau composables
- Gunakan computed properties untuk nilai yang dihitung
- Hindari operasi berat dalam template
- **WAJIB menggunakan komponen UI dasar yang tersedia di `/src/components/ui/` untuk semua elemen UI**
  - Gunakan `BaseInput` untuk semua input teks, angka, tanggal, dll.
  - Gunakan `BaseSelect` untuk semua dropdown selection
  - Gunakan `BaseButton` untuk semua tombol
  - Gunakan `BaseDialog` untuk semua dialog/modal
  - Gunakan `BasePage` untuk layout halaman
  - Lihat dokumentasi komponen di `/docs/components/` untuk referensi lengkap
  - Jika perlu membuat komponen baru, pastikan tidak ada komponen serupa yang sudah ada

```vue
<script setup>
import { ref, computed } from 'vue'

/**
 * Komponen untuk menampilkan informasi produk
 * @prop {Object} product - Data produk yang akan ditampilkan
 * @emits {select} - Dipancarkan saat produk dipilih
 */
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(props.product.price)
})

const handleSelect = () => {
  emit('select', props.product.id)
}
</script>
```

### State Management

- Gunakan Pinia untuk state management
- Selalu gunakan `storeToRefs` untuk mengakses state dengan reaktivitas
- Pisahkan store berdasarkan domain/fitur
- Implementasikan actions untuk semua operasi yang mengubah state

```js
// stores/product.js
import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),

  getters: {
    availableProducts: (state) => state.products.filter(p => p.stock > 0)
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/products')
        this.products = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
```

### Composables

- Ekstrak logika yang dapat digunakan kembali ke composables
- Dokumentasikan parameter dan return values dengan JSDoc
- Gunakan composables untuk fungsionalitas umum (notifikasi, validasi, dll)

```js
// composables/useNotification.js
import { ref } from 'vue'

/**
 * Composable untuk mengelola notifikasi
 * @returns {Object} Fungsi dan state untuk mengelola notifikasi
 */
export function useNotification() {
  const notifications = ref([])

  /**
   * Tambahkan notifikasi baru
   * @param {Object} notification - Notifikasi yang akan ditambahkan
   * @param {string} notification.title - Judul notifikasi
   * @param {string} notification.message - Pesan notifikasi
   * @param {string} notification.type - Tipe notifikasi (success, error, warning, info)
   * @param {number} [notification.timeout=5000] - Timeout untuk auto-close dalam ms
   * @returns {string} ID notifikasi yang dibuat
   */
  const notify = ({ title, message, type = 'info', timeout = 5000 }) => {
    // Implementasi
  }

  // Fungsi lainnya

  return {
    notifications,
    notify,
    // Fungsi lainnya
  }
}
```

## Error Handling

- Tangani error secara konsisten dengan try/catch
- Gunakan sistem notifikasi terpusat
- Berikan pesan error yang informatif dan user-friendly

```js
try {
  await store.submitForm()
  notify({
    title: 'Berhasil',
    message: 'Data berhasil disimpan',
    type: 'success'
  })
} catch (error) {
  notify({
    title: 'Gagal',
    message: error.message || 'Terjadi kesalahan saat menyimpan data',
    type: 'error'
  })
}
```

## Aksesibilitas dan Responsivitas

- Pastikan semua komponen responsif
- Tambahkan atribut aksesibilitas (aria-label, role, dll)
- Uji tampilan di berbagai ukuran layar

```vue
<button
  @click="handleDelete"
  aria-label="Hapus item"
  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
>
  <Icon name="Trash" class="w-4 h-4" />
</button>
```

## Dokumentasi

- Dokumentasikan semua fungsi, komponen, dan API dengan JSDoc
- Tambahkan komentar untuk kode yang kompleks
- Buat dokumentasi referensi untuk komponen yang sering digunakan

## Testing

- Tulis unit test untuk logika bisnis penting
- Pastikan semua edge cases ditangani
- Implementasikan component testing untuk komponen UI kritis

## Commit dan Version Control

- Gunakan Conventional Commits (feat:, fix:, docs:, style:, refactor:, test:, chore:)
- Buat branch terpisah untuk setiap fitur atau perbaikan
- Lakukan code review sebelum merge ke branch utama

## Performance

- Lakukan lazy loading untuk komponen besar
- Optimalkan rendering dengan Vue's reactivity system
- Hindari computed properties yang mahal di dalam loop

## Keamanan

- Validasi semua input pengguna
- Hindari penggunaan `v-html` kecuali benar-benar diperlukan
- Gunakan HTTPS untuk semua permintaan API

## Checklist Pengembangan

Sebelum menyelesaikan fitur atau perbaikan, pastikan:

- [ ] Kode mengikuti semua standar yang disebutkan di atas
- [ ] Dokumentasi telah diperbarui
- [ ] Tests telah ditulis dan dijalankan
- [ ] Kode telah di-review oleh pengembang lain
- [ ] Tidak ada warning atau error dari linter
- [ ] Fitur berfungsi di semua browser target
- [ ] Fitur responsif di semua ukuran layar target

## Konsistensi UI

### Penggunaan Komponen UI

- **DILARANG KERAS** menggunakan elemen HTML dasar secara langsung untuk UI yang sudah memiliki komponen dasar
- Semua elemen form HARUS menggunakan komponen dari `/src/components/ui/`:
  - Input teks/angka/tanggal: `BaseInput`
  - Dropdown/select: `BaseSelect`
  - Checkbox: `BaseCheckbox`
  - Radio button: `BaseRadio`
  - Tombol: `BaseButton`
  - Dialog/modal: `BaseDialog`
  - Tabel: `BaseTable`
- Jika ada kebutuhan khusus yang tidak dapat dipenuhi oleh komponen yang ada:
  1. Diskusikan dengan tim UI/UX
  2. Pertimbangkan untuk memperluas komponen yang ada
  3. Jika perlu membuat komponen baru, ikuti pola penamaan dan struktur yang sama
  4. Dokumentasikan komponen baru di `/docs/components/`

### Checklist Konsistensi UI

Sebelum menyelesaikan fitur, pastikan:

- [ ] Semua elemen UI menggunakan komponen dasar yang sesuai
- [ ] Tidak ada penggunaan elemen HTML dasar yang sudah memiliki komponen UI
- [ ] Styling konsisten dengan bagian lain dari aplikasi
- [ ] Komponen mendukung dark mode
- [ ] Komponen responsif di semua ukuran layar target

## Code Review

### Checklist Review

Saat melakukan code review, pastikan untuk memeriksa:

- [ ] Kode mengikuti semua standar yang disebutkan di atas
- [ ] Semua elemen UI menggunakan komponen dasar yang sesuai
- [ ] Tidak ada duplikasi kode atau komponen
- [ ] Dokumentasi telah diperbarui (jika diperlukan)
- [ ] Tests telah ditulis dan dijalankan (jika diperlukan)
- [ ] Kode responsif dan mendukung dark mode
- [ ] Kode mengikuti praktik aksesibilitas

### Otomatisasi

- Gunakan script `component-check.js` untuk memverifikasi penggunaan komponen dasar
- Jalankan `npm run component-check` sebelum commit untuk memastikan konsistensi
- Pertimbangkan untuk menambahkan aturan ESLint kustom untuk memeriksa penggunaan komponen dasar
