# Checklist Pengembangan Fitur

## Sebelum Memulai Pengembangan

- [ ] Pahami kebutuhan fitur secara menyeluruh
- [ ] Pecah fitur menjadi komponen-komponen logis
- [ ] **Periksa komponen yang sudah ada di `docs/components/`**
- [ ] **Periksa implementasi UI yang ada di `src/components/ui/`**
- [ ] **Periksa komponen global yang terdaftar di `src/plugins/ui.js`**

## Saat Pengembangan

- [ ] Prioritaskan penggunaan komponen base yang sudah ada:
  - [ ] `BaseInput` untuk input teks, angka, email, dll.
  - [ ] `BaseSelect` untuk dropdown dan multi-select
  - [ ] `BaseButton` untuk tombol
  - [ ] `BaseDialog` untuk modal/dialog
  - [ ] `BasePage` untuk layout halaman
  - [ ] Cek komponen lain yang mungkin relevan
- [ ] Gunakan props, slots, dan events yang sudah didokumentasikan
- [ ] Jika perlu kustomisasi, gunakan slot yang disediakan sebelum membuat komponen baru
- [ ] Pastikan fitur baru mengikuti tema dan gaya yang konsisten

## Jika Perlu Membuat Komponen Baru

- [ ] Pastikan tidak ada komponen serupa yang sudah ada
- [ ] Ikuti konvensi penamaan yang sama (`Base*` untuk komponen dasar)
- [ ] Dokumentasikan komponen baru dengan format yang konsisten
- [ ] Pertimbangkan reusabilitas untuk penggunaan di masa depan

## Sebelum Pull Request

- [ ] Pastikan tidak ada duplikasi kode atau komponen
- [ ] Verifikasi penggunaan komponen yang tepat
- [ ] Dokumentasikan komponen baru (jika ada)