# Panduan Pengguna: Fitur Order Pembelian (Purchase Order)

## Pendahuluan

Fitur Order Pembelian (Purchase Order) memungkinkan Anda untuk membuat, mengelola, dan melacak pesanan pembelian ke supplier. Dengan fitur ini, Anda dapat memantau seluruh siklus pembelian dari pembuatan draft hingga penerimaan barang.

## Mengakses Fitur Order Pembelian

1. Login ke sistem dengan akun Anda
2. Pada menu navigasi, pilih **Transaksi** > **Order Pembelian**
3. Anda akan melihat halaman daftar order pembelian

## Daftar Order Pembelian

Halaman ini menampilkan semua order pembelian yang telah dibuat dengan informasi penting seperti:

- Nama supplier
- Nomor order (kode unik)
- Tanggal order
- Jumlah item
- Total nilai order
- Status order (Draft, Ordered, Received, Cancelled)

### Filter dan Pencarian

Untuk menemukan order pembelian tertentu, Anda dapat menggunakan:

1. **Pencarian**: Masukkan kata kunci pada kotak pencarian untuk mencari berdasarkan nama supplier atau nomor order
2. **Filter Status**: Pilih status order (Draft, Ordered, Received, Cancelled, atau Semua) untuk melihat order dengan status tertentu
3. **Filter Tanggal**: Gunakan filter rentang tanggal untuk melihat order pada periode tertentu
   - Klik pada filter tanggal untuk membuka panel pemilihan tanggal
   - Pilih periode yang telah ditentukan (Hari Ini, Minggu Ini, Bulan Ini, Tahun Ini) atau pilih tanggal kustom
   - Klik "Terapkan" untuk menerapkan filter tanggal

### Navigasi Halaman

Jika daftar order pembelian memiliki banyak entri, gunakan navigasi halaman di bagian bawah untuk berpindah antar halaman.

## Membuat Order Pembelian Baru

1. Klik tombol **Tambah Order** di bagian atas halaman
2. Form pembuatan order pembelian akan terbuka dengan beberapa bagian:

### Informasi Supplier
1. Pilih supplier dari dropdown atau gunakan fitur pencarian untuk menemukan supplier
2. Informasi supplier akan ditampilkan setelah dipilih

### Informasi Order
1. Tanggal order akan otomatis diisi dengan tanggal hari ini (dapat diubah)
2. Isi tanggal jatuh tempo (opsional)
3. Tambahkan catatan jika diperlukan

### Menambahkan Item
1. Klik tombol **Tambah Item**
2. Pilih produk dari dropdown atau gunakan fitur pencarian
3. Masukkan jumlah dan harga per unit
4. Total harga akan dihitung otomatis
5. Ulangi langkah ini untuk menambahkan lebih banyak item

### Menyimpan Order
1. Setelah semua informasi diisi, klik tombol **Simpan**
2. Order akan disimpan dengan status "Draft"
3. Untuk mengonfirmasi order, ubah status menjadi "Ordered" pada halaman detail

## Melihat Detail Order Pembelian

1. Pada daftar order pembelian, klik ikon **Lihat Detail** pada order yang ingin dilihat
2. Halaman detail akan menampilkan:
   - Informasi supplier
   - Nomor dan tanggal order
   - Status order
   - Daftar item yang dipesan (produk, jumlah, harga)
   - Total nilai order

## Mengubah Status Order

1. Buka halaman detail order pembelian
2. Klik tombol status yang sesuai:
   - **Ordered**: Mengonfirmasi order telah dikirim ke supplier
   - **Received**: Menandai bahwa semua barang telah diterima
   - **Cancelled**: Membatalkan order

## Mengedit Order Pembelian

Order pembelian hanya dapat diedit jika statusnya masih "Draft":

1. Pada daftar order pembelian, klik ikon **Edit** pada order dengan status "Draft"
2. Form edit akan terbuka dengan data yang sudah ada
3. Ubah informasi yang diperlukan
4. Klik **Simpan** untuk menyimpan perubahan

## Menyalin Order Pembelian

Untuk membuat order baru berdasarkan order yang sudah ada:

1. Pada daftar order pembelian, klik ikon **Copy Order**
2. Form pembuatan order baru akan terbuka dengan data dari order yang disalin
3. Ubah informasi yang diperlukan
4. Klik **Simpan** untuk membuat order baru

## Status Order Pembelian

- **Draft**: Order baru dibuat, belum dikonfirmasi untuk dipesan ke supplier
- **Ordered**: Order sudah dikonfirmasi dan dikirim ke supplier, menunggu kedatangan barang
- **Received**: Seluruh barang pada order sudah diterima
- **Cancelled**: Order dibatalkan sebelum seluruh barang diterima

## Tips Penggunaan

1. **Autosave**: Sistem secara otomatis menyimpan draft order jika Anda telah memilih supplier dan menambahkan minimal satu item
2. **Filter Tanggal**: Gunakan filter tanggal untuk melihat order pada periode tertentu (hari ini, minggu ini, bulan ini)
3. **Pencarian Cepat**: Gunakan fitur pencarian untuk menemukan supplier atau produk dengan cepat
4. **Pemantauan Status**: Perhatikan status order untuk memantau progres pembelian

## Integrasi dengan Fitur Lain

Fitur Order Pembelian terintegrasi dengan:
- **Pembelian Aktual**: Order dengan status "Ordered" atau "Received" dapat diproses menjadi transaksi pembelian aktual
- **Manajemen Stok**: Stok produk akan diperbarui saat barang diterima
- **Hutang Supplier**: Saldo hutang supplier akan diperbarui saat pembelian aktual dilakukan

## Gambar dan Ilustrasi

![Halaman Daftar Order Pembelian](../images/po_list.png)
*Gambar 1: Halaman daftar order pembelian dengan filter dan pencarian*

![Form Pembuatan Order](../images/po_create.png)
*Gambar 2: Form pembuatan order pembelian baru*

![Detail Order Pembelian](../images/po_detail.png)
*Gambar 3: Halaman detail order pembelian*

## Pertanyaan Umum (FAQ)

### Bagaimana cara mengubah status order?
Buka halaman detail order, kemudian klik tombol status yang sesuai (Ordered, Received, atau Cancelled).

### Apakah saya bisa mengedit order yang sudah berstatus "Ordered"?
Tidak, order hanya dapat diedit jika statusnya masih "Draft". Untuk order dengan status lain, Anda dapat menggunakan fitur "Copy Order" untuk membuat order baru berdasarkan order yang sudah ada.

### Bagaimana cara mencetak order pembelian?
Pada halaman detail order, klik tombol "Cetak" untuk menghasilkan dokumen PDF yang dapat dicetak.

### Apakah supplier akan otomatis menerima notifikasi saat order dibuat?
Fitur notifikasi otomatis ke supplier saat ini belum tersedia. Anda perlu mengirimkan order secara manual ke supplier.