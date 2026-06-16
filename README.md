# LaundryKu — Sistem Manajemen Laundry
Proyek Akhir Pemrograman Web Lanjut — Sistem Informasi D-III UPN Veteran Jakarta

---

## CARA MENJALANKAN

### 1. Persiapan
- XAMPP aktif (Apache + MySQL)
- Node.js terinstall
- VSCode

---

### 2. Setup Database
1. Buka browser → http://localhost/phpmyadmin
2. Klik tab **SQL**
3. Copy-paste isi file `backend/database.sql` → klik **Go**
4. Database `laundry_db` otomatis terbuat beserta tabel & data awal

---

### 3. Jalankan Backend
Buka terminal VSCode, masuk ke folder backend:
```bash
cd laundry-backend
npm install
npm run dev
```
✅ Harusnya muncul:
```
✅ Database terhubung
✅ Server jalan di port 5000
```

---

### 4. Jalankan Frontend
Buka terminal **baru** di VSCode (jangan tutup terminal backend):
```bash
cd laundry-frontend
npm install
npm start
```
✅ Browser otomatis buka http://localhost:3000

---

## AKUN DEFAULT

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@laundry.com      | admin123  |

Untuk akun pelanggan, daftar sendiri lewat halaman Register.

---

## STRUKTUR HALAMAN

### Public (tanpa login)
- `/` → Landing page
- `/login` → Halaman login
- `/register` → Daftar akun pelanggan

### Admin (login sebagai admin)
- `/admin` → Dashboard statistik
- `/admin/orders` → Kelola order laundry
- `/admin/services` → Kelola layanan
- `/admin/customers` → Daftar pelanggan
- `/admin/employees` → Kelola karyawan
- `/admin/payments` → Riwayat pembayaran
- `/admin/expenses` → Catat pengeluaran

### Member/Pelanggan (login sebagai customer)
- `/member` → Beranda pelanggan
- `/member/orders` → Riwayat & status order
- `/member/notifications` → Notifikasi update status
- `/member/profile` → Edit profil

---

## TECH STACK
- **Frontend**: ReactJS + React Router + Axios + Context API
- **Backend**: Node.js + Express + Sequelize ORM
- **Database**: MySQL (via XAMPP)
- **Auth**: JWT (JSON Web Token)
- **Caching**: localStorage (browser cache)

---

## FITUR UTAMA
- Login multi-role (Admin & Pelanggan)
- CRUD Order Laundry dengan kalkulasi otomatis
- Update status order real-time (7 tahap)
- Notifikasi otomatis ke pelanggan saat status berubah
- Kelola layanan, karyawan, pelanggan
- Proses pembayaran (Cash/Transfer/QRIS)
- Catat pengeluaran operasional
- Dashboard statistik pendapatan & pengeluaran
- Caching data dengan localStorage
