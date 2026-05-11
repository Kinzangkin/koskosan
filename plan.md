Kamu adalah senior fullstack developer yang berpengalaman dengan Next.js.
Bantu saya membangun website manajemen kos-kosan dengan spesifikasi berikut.

=== TECH STACK ===
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Auth: NextAuth.js (credentials provider)
- Database ORM: Prisma
- Database: PostgreSQL via Docker (development), siap migrasi ke Supabase (production)
- File upload: supabase
- UI Component: shadcn/ui
- Containerization: Docker + Docker Compose

=== DOCKER SETUP ===
Buat file docker-compose.yml dengan service berikut:
- Service "db": PostgreSQL 15, port 5432, dengan environment
  POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- Service "app": Next.js app, port 3000, depends_on db
- Gunakan .env untuk semua credential, jangan hardcode
- Buat juga Dockerfile untuk Next.js app (multi-stage build)

=== STORAGE STRATEGY ===
Development (Docker): simpan foto di local filesystem
(/public/uploads) yang di-mount sebagai Docker volume.

Production (Supabase): ganti handler upload ke
Supabase Storage SDK, hanya ubah fungsi upload-nya
saja, tidak ada perubahan lain.

Buat abstraksi layer untuk upload (StorageService)
supaya mudah swap antara local dan Supabase Storage
cukup dengan ganti environment variable:
STORAGE_PROVIDER=local atau STORAGE_PROVIDER=supabase

File .env.example harus berisi:
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kos_db"
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

=== CATATAN MIGRASI SUPABASE ===
Setup Prisma harus siap untuk migrasi ke Supabase tanpa ubah schema.
Saat migrasi nanti, cukup ganti DATABASE_URL di .env ke connection
string dari Supabase. Tidak ada perubahan kode atau schema yang diperlukan.
Gunakan connection pooling URL dari Supabase untuk production
(format: postgresql://...@pooler.supabase.com:6543/postgres?pgbouncer=true)

=== PERAN PENGGUNA ===
Ada 3 role: ADMIN, TENANT, dan GUEST (belum login).
Gunakan middleware Next.js untuk proteksi route berdasarkan role.

=== STRUKTUR HALAMAN ===

[PUBLIK - bisa diakses tanpa login]
- / → Landing page (foto kos, fasilitas, lokasi Google Maps, harga mulai dari)
- /rooms → Daftar semua kamar + filter (harga, fasilitas, status)
- /rooms/[id] → Detail kamar (galeri foto, spesifikasi, tombol ajukan sewa)
- /login → Form login
- /register → Form daftar akun baru

[TENANT - harus login sebagai TENANT]
- /tenant/dashboard → Info kamar aktif, tagihan bulan ini, pengumuman terbaru
- /tenant/bills → Daftar tagihan bulanan + riwayat pembayaran
- /tenant/complaints → Form lapor keluhan + daftar status keluhan
- /tenant/profile → Edit data diri, upload foto KTP, kontak darurat

[ADMIN - harus login sebagai ADMIN]
- /admin/dashboard → Statistik: total kamar, terisi, kosong, pemasukan bulan ini, keluhan pending
- /admin/rooms → CRUD kamar (nama, foto, harga, fasilitas, status)
- /admin/tenants → Daftar penyewa aktif & riwayat, detail kontrak per tenant
- /admin/payments → Catat pembayaran, lihat siapa belum bayar, kirim reminder
- /admin/complaints → Update status keluhan dari tenant (Baru → Diproses → Selesai)
- /admin/announcements → Buat & kelola pengumuman untuk semua tenant
- /admin/reports → Laporan pemasukan per bulan/tahun dalam bentuk chart

=== DATABASE SCHEMA (Prisma) ===
Buat model berikut:
- User (id, name, email, password, role, phone, ktpNumber, ktpPhoto, emergencyContact, createdAt)
- Room (id, name, description, price, size, floor, photos[], facilities[], status[AVAILABLE/OCCUPIED], createdAt)
- RoomBooking (id, userId, roomId, startDate, endDate, status[PENDING/ACTIVE/ENDED])
- Payment (id, bookingId, amount, month, year, status[PAID/UNPAID], paidAt, note)
- Complaint (id, userId, roomId, title, description, status[NEW/IN_PROGRESS/DONE], createdAt)
- Announcement (id, title, content, createdAt, adminId)

=== FITUR DETAIL ===

1. Autentikasi
   - Login dengan email + password
   - Session menggunakan NextAuth JWT
   - Redirect otomatis sesuai role setelah login

2. Manajemen Kamar (Admin)
   - Upload maksimal 5 foto per kamar ke Cloudinary
   - Checklist fasilitas: AC, WiFi, kamar mandi dalam, lemari, meja belajar, parkir
   - Status kamar otomatis berubah saat booking disetujui

3. Pengajuan Sewa (Tenant/Guest)
   - Calon penyewa bisa klik "Ajukan Sewa" di halaman detail kamar
   - Jika belum login, redirect ke /login
   - Setelah submit, admin mendapat notifikasi di dashboard

4. Pembayaran (Admin)
   - Admin catat manual pembayaran per tenant per bulan
   - Tampilkan daftar tenant yang belum bayar bulan berjalan
   - Riwayat pembayaran bisa difilter per tenant atau per bulan

5. Keluhan (Tenant → Admin)
   - Tenant submit keluhan dengan judul + deskripsi
   - Admin update status dan bisa tambahkan catatan balasan
   - Tenant bisa lihat perkembangan status

6. Laporan Keuangan (Admin)
   - Chart pemasukan per bulan menggunakan recharts
   - Tampilkan total pemasukan, rata-rata per bulan, dan bulan terbaik

=== GAYA UI ===
- Clean dan profesional, cocok untuk bisnis properti
- Warna utama: biru tua atau hijau tua (pilih yang elegan)
- Responsive untuk mobile dan desktop
- Gunakan komponen dari shadcn/ui (Card, Table, Badge, Dialog, Form)

=== INSTRUKSI PENGERJAAN ===
Mulai dari:
1. Setup project Next.js + Tailwind + shadcn/ui
2. Setup Prisma + schema database
3. Setup NextAuth
4. Buat layout dan middleware proteksi route
5. Kerjakan halaman satu per satu dimulai dari yang publik

Setiap halaman yang dibuat harus:
- Sudah terhubung ke database (bukan dummy data)
- Menggunakan Server Components dan Server Actions Next.js
- Ada validasi form menggunakan zod
- Responsive di mobile

Tanya saya jika ada yang perlu dikonfirmasi sebelum mulai.