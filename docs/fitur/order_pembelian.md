# Dokumentasi Fitur Order Pembelian (Purchase Order)

## Deskripsi
Fitur Order Pembelian (PO) memungkinkan pengguna untuk membuat, mengelola, dan melacak pesanan pembelian ke supplier. Fitur ini mendukung alur kerja lengkap dari pembuatan draft hingga penerimaan barang.

## Alur Kerja
1. **Pembuatan Draft PO**
   - Pengguna memilih supplier
   - Pengguna menambahkan item produk ke daftar pesanan
   - Sistem otomatis menyimpan sebagai draft saat kriteria minimal terpenuhi

2. **Konfirmasi PO**
   - Pengguna mengisi tanggal order dan jatuh tempo
   - Pengguna menyimpan PO dengan status "ordered"
   - Sistem mengirimkan notifikasi ke supplier (jika fitur diaktifkan)

3. **Penerimaan Barang**
   - Pengguna mencatat penerimaan barang berdasarkan PO
   - Status PO berubah menjadi "received" jika semua item diterima
   - Stok produk diperbarui secara otomatis

## Status PO
- **draft**: PO baru dibuat, belum dikonfirmasi untuk dipesan ke supplier
- **ordered**: PO sudah dikonfirmasi dan dikirim ke supplier, menunggu kedatangan barang
- **received**: Seluruh barang pada PO sudah diterima
- **cancelled**: PO dibatalkan sebelum seluruh barang diterima

## Status Item PO
- **added**: Item baru ditambahkan ke dalam daftar PO, namun belum dikonfirmasi untuk dipesan
- **ordered**: Item sudah dikonfirmasi untuk dipesan ke supplier dan menunggu kedatangan barang
- **active**: Item sudah diterima sebagian/seluruhnya, siap diproses ke tahap pembelian aktual

## Fitur Utama

### 1. Autosave Draft
Sistem secara otomatis menyimpan PO sebagai draft ketika:
- Pengguna telah memilih supplier dan menambahkan minimal satu item
- Pengguna menutup form tanpa menyimpan
- Pengguna tidak aktif selama 30 detik

### 2. Pencarian Supplier dan Produk
- Pencarian supplier berdasarkan nama, email, atau nomor telepon
- Pencarian produk berdasarkan nama atau barcode
- Hasil pencarian ditampilkan secara real-time

### 3. Manajemen Item
- Penambahan produk ke daftar pesanan
- Pengaturan kuantitas dan harga per item
- Perhitungan otomatis subtotal dan total pesanan

### 4. Validasi Form
- Validasi data wajib sebelum penyimpanan final
- Pesan error yang informatif untuk data yang tidak valid

## Antarmuka Pengguna

### Form Order Pembelian
Form utama untuk membuat dan mengedit PO dengan bagian-bagian:
1. **Header**: Judul, nomor PO otomatis, dan status
2. **Informasi Supplier**: Pencarian dan detail supplier
3. **Tanggal Order**: Tanggal pemesanan dan jatuh tempo
4. **Item Order**: Daftar produk yang dipesan dengan kuantitas dan harga
5. **Ringkasan Order**: Total nilai pesanan
6. **Tombol Aksi**: Batal dan Simpan Order

### Daftar Order Pembelian
Tampilan tabel yang menampilkan semua PO dengan:
1. Nomor PO
2. Tanggal pemesanan
3. Supplier
4. Total nilai
5. Status
6. Tombol aksi (lihat detail, edit, hapus)

## Integrasi dengan Modul Lain
- **Modul Supplier**: Mengambil data supplier untuk pembuatan PO
- **Modul Produk**: Mengambil data produk untuk item PO
- **Modul Pembelian**: Memproses PO menjadi transaksi pembelian aktual
- **Modul Stok**: Memperbarui stok saat barang diterima

## API Endpoints
- `GET /api/v1/purchase-orders` - Mendapatkan daftar PO
- `POST /api/v1/purchase-orders` - Membuat PO baru
- `POST /api/v1/purchase-orders/draft` - Menyimpan PO sebagai draft
- `GET /api/v1/purchase-orders/{id}` - Mendapatkan detail PO
- `PUT /api/v1/purchase-orders/{id}` - Memperbarui PO
- `DELETE /api/v1/purchase-orders/{id}` - Menghapus PO
- `PUT /api/v1/purchase-orders/items/{id}/status` - Memperbarui status item PO

## Hak Akses
- **Admin**: Akses penuh ke semua fitur PO
- **Manajer Pembelian**: Membuat, mengedit, dan menyetujui PO
- **Staff Pembelian**: Membuat dan mengedit draft PO
- **Staff Gudang**: Melihat PO dan mencatat penerimaan barang

## Pengembangan Mendatang
- Fitur persetujuan bertingkat untuk PO dengan nilai besar
- Integrasi dengan email untuk notifikasi otomatis ke supplier
- Pelacakan riwayat perubahan PO
- Fitur impor/ekspor PO dalam format Excel
- Fitur cetak PO dengan template yang dapat dikustomisasi