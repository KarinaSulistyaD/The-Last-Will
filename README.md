# THE LAST WILL

## 1. Gambaran Proyek

**The Last Will** adalah aplikasi web untuk membantu pengguna menyiapkan, mengamankan, dan mewariskan pesan serta dokumen digital kepada ahli waris yang telah ditentukan.

Aplikasi dirancang dengan dua peran utama:

- **Pewaris:** membuat dan mengelola wasiat digital, menambahkan pesan dan dokumen, serta menyiapkan mekanisme akses.
- **Ahli Waris:** melakukan proses verifikasi yang diwajibkan sebelum memperoleh akses ke pesan dan dokumen yang diwariskan.

Aplikasi dikembangkan sebagai proyek web. Pengembangan dilakukan secara lokal terlebih dahulu, kemudian dipersiapkan untuk deployment online.

## 2. Fitur Utama

### Fitur yang dirancang

1. **Landing Page** — menyampaikan informasi, tujuan, cara kerja, dan fitur keamanan The Last Will.
2. **Login** — menyediakan akses menggunakan username/email dan kata sandi, dengan opsi autentikasi biometrik jika didukung.
3. **Dashboard** — menampilkan informasi akun dan ringkasan pengelolaan wasiat.
4. **Create Will** — menginput informasi wasiat, pesan pribadi, informasi ahli waris, dan dokumen pendukung.
5. **Access Key** — mengunggah gambar dan menyiapkan gambar pembawa token akses menggunakan steganografi.
6. **My Wills** — menampilkan daftar wasiat yang pernah dibuat beserta informasi dan statusnya.

### Mekanisme keamanan yang direncanakan

- USB dongle sebagai faktor kepemilikan untuk membatasi akses aplikasi.
- AES-GCM untuk enkripsi dokumen.
- ChaCha20-Poly1305 untuk enkripsi pesan.
- Steganografi citra untuk menyisipkan dan mengekstrak payload token terlindungi.
- Autentikasi tambahan, termasuk biometrik melalui mekanisme yang didukung perangkat.
- SHA-256 untuk pemeriksaan integritas.
- Pencatatan hash berantai sebagai blockchain sederhana.

**Catatan status:** daftar di atas merupakan ruang lingkup dan rancangan fitur. Suatu fitur hanya boleh dinyatakan telah diterapkan setelah kode selesai dibuat dan pengujiannya berhasil.

## 3. Alur Pengguna

### 3.1 Alur Pewaris

1. Membuka website dan masuk ke akun.
2. Melihat dashboard dan informasi akun.
3. Membuat surat wasiat.
4. Mengisi pesan dan menambahkan dokumen pendukung.
5. Menentukan informasi ahli waris.
6. Menyiapkan USB dongle dan gambar Access Key sesuai mekanisme yang diimplementasikan.
7. Menyimpan dan memeriksa status wasiat pada halaman My Wills.

### 3.2 Alur Ahli Waris

1. Menghubungkan atau menggunakan USB dongle sesuai mekanisme yang dipilih.
2. Melakukan validasi dongle.
3. Login menggunakan kredensial akun.
4. Mengunggah gambar Access Key untuk ekstraksi dan validasi payload.
5. Menyelesaikan autentikasi tambahan yang diaktifkan.
6. Melakukan pemeriksaan integritas aset.
7. Mengakses pesan dan dokumen setelah seluruh pemeriksaan berhasil.

Urutan final dan metode dongle harus mengikuti hasil keputusan arsitektur serta kemampuan perangkat dan browser. Flashdisk biasa yang menyimpan file token tidak dengan sendirinya membuktikan keaslian perangkat fisik karena file dapat disalin.

## 4. Teknologi yang Dipilih

| Bagian | Teknologi |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python dengan FastAPI |
| Database | MySQL |
| Enkripsi dan autentikasi data | Python `cryptography` |
| Pengolahan citra | Pillow |
| Pemrosesan wajah | OpenCV dan model yang dipilih setelah evaluasi |
| Autentikasi perangkat/biometrik | WebAuthn jika didukung |
| Hash | SHA-256 |
| Pengujian backend | Pytest |

Library dan versi final ditetapkan saat persiapan project. Jangan menganggap seluruh library atau fitur sudah terpasang hanya karena tercantum di dokumen ini.

## 5. Design System

Desain antarmuka mengikuti file [`DESIGN.md`](./DESIGN.md) yang diekspor dari Google Stitch.

Panduan visual utama:

- Nuansa: warm editorial classicism, natural, elegan, tenang, dan terpercaya.
- Font headline: Newsreader.
- Font body dan kontrol: Outfit.
- Warna utama: deep teal `#163B3D`.
- Warna sekunder: terracotta `#A9573E`.
- Aksen natural: meadow green `#78965E`.
- Latar utama: warm ivory `#F5F2E9`.
- Aksen atmosfer: sky blue `#9BCBE8`.
- Warna teks: charcoal `#263238`.

**Aturan:** file desain hasil Google Stitch merupakan acuan visual. Jangan mengganti warna, font, layout, aset, atau komponen tanpa persetujuan.

## 6. Struktur Project yang Direncanakan

Struktur berikut adalah target pengembangan dan dapat disesuaikan setelah pemeriksaan file ekspor Stitch.

```text
THE-LAST-WILL/
│
├── stitch-export/
│   ├── the_last_will_home/
│   │   ├── code.html
│   │   └── screen.png
│   ├── the_last_will_sign_in/
│   │   ├── code.html
│   │   └── screen.png
│   ├── the_last_will_dashboard/
│   │   ├── code.html
│   │   └── screen.png
│   ├── create_will/
│   │   ├── code.html
│   │   └── screen.png
│   ├── generate_access_key/
│   │   ├── code.html
│   │   └── screen.png
│   ├── the_last_will_my_wills/
│   │   ├── code.html
│   │   └── screen.png
│   └── kinship_horizon/
│       └── DESIGN.md
│
├── frontend/
├── backend/
├── tests/
├── docs/
├── .env.example
├── .gitignore
└── README.md
```

Nama folder di atas mengikuti nama yang ditemukan pada ekspor Stitch saat dokumen ini dibuat. Struktur `frontend/` dan `backend/` merupakan folder pengembangan yang akan dibuat kemudian.

## 7. Prinsip Keamanan dan Implementasi

1. Jangan menyimpan password, jawaban keamanan, token rahasia, atau kunci enkripsi dalam bentuk plaintext.
2. Password harus disimpan menggunakan password hashing yang sesuai, bukan enkripsi yang dapat dibalik.
3. Gunakan skema enkripsi terautentikasi, seperti AES-GCM dan ChaCha20-Poly1305.
4. Jangan menyisipkan kunci enkripsi utama dalam bentuk plaintext ke gambar Access Key.
5. Validasi USB harus membedakan file token biasa dari autentikasi perangkat kriptografis.
6. Jangan menganggap browser dapat membaca data sidik jari mentah. Gunakan WebAuthn untuk autentikasi perangkat yang didukung.
7. Batasi akses aset di backend. Menyembunyikan tombol atau halaman pada frontend bukan kontrol akses yang memadai.
8. Gunakan HTTPS saat aplikasi diakses online dan saat fitur browser yang mensyaratkannya digunakan.
9. Simpan file rahasia di penyimpanan yang tidak dapat diakses langsung secara publik.
10. Uji proses enkripsi/dekripsi, validasi token, autentikasi, dan integritas sebelum menyatakan fitur berhasil.

## 8. Tahapan Pengembangan

1. Ekspor dan inventarisasi seluruh hasil desain Google Stitch.
2. Persiapan project di Antigravity.
3. Implementasi frontend berdasarkan desain Stitch.
4. Perancangan database MySQL dan backend FastAPI.
5. Implementasi autentikasi akun dan mekanisme USB dongle.
6. Implementasi pengelolaan wasiat dan dokumen.
7. Implementasi enkripsi, dekripsi, dan pengelolaan kunci.
8. Implementasi steganografi dan Access Key.
9. Implementasi autentikasi ahli waris dan biometrik yang didukung.
10. Implementasi pemeriksaan integritas dan pencatatan hash.
11. Integrasi menyeluruh dan pengujian.
12. Deployment online.

Setiap tahap harus diuji sebelum melanjutkan ke tahap berikutnya.

## 9. Cara Menjalankan

Petunjuk menjalankan aplikasi akan dilengkapi setelah struktur frontend, backend, dan konfigurasi database dibuat.

Untuk sementara, jangan menjalankan file ekspor Stitch sebagai aplikasi final sebelum dependensi, aset, dan navigasinya diperiksa.

## 10. Status Pengembangan

| Tahap | Status |
|---|---|
| Konsep aplikasi | Dirancang |
| UI/UX Google Stitch | Diekspor |
| Design system | Tersedia di `DESIGN.md` |
| Persiapan Antigravity | Belum dimulai |
| Frontend terintegrasi | Belum dimulai |
| Backend FastAPI | Belum dimulai |
| Database MySQL | Belum dimulai |
| Integrasi USB dongle | Belum dimulai |
| Kriptografi dan steganografi | Belum dimulai |
| Pengujian menyeluruh | Belum dimulai |
| Deployment online | Belum dimulai |

---

Dokumen ini menjadi konteks awal untuk AI coding assistant. Perbarui bagian status dan teknologi setelah keputusan implementasi berubah atau fitur berhasil diuji.
