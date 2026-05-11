# 📋 Product Requirements Document (PRD)
# Sistem Manajemen Kos-Kosan

> **Versi:** 1.0  
> **Tanggal:** 26 April 2026  
> **Status:** In Development  
> **Project Name:** management-kos-kosan

---

## 1. Ringkasan Produk

### 1.1 Deskripsi
Sistem Manajemen Kos-Kosan adalah aplikasi web fullstack yang dirancang untuk membantu pemilik kos dalam mengelola properti kos-kosan secara digital. Aplikasi ini mencakup manajemen kamar, penyewa, pembayaran, keluhan, pengumuman, dan laporan keuangan dalam satu platform terintegrasi.

### 1.2 Tujuan
- Mempermudah pemilik kos dalam mengelola operasional harian
- Memberikan transparansi informasi antara pemilik kos dan penyewa
- Mendigitalisasi proses pencatatan pembayaran dan pelaporan keuangan
- Menyediakan kanal komunikasi yang terstruktur antara penyewa dan pengelola

### 1.3 Target Pengguna
| Pengguna | Deskripsi |
|----------|-----------|
| **Admin (Pemilik Kos)** | Mengelola seluruh operasional kos termasuk kamar, penyewa, pembayaran, dan laporan |
| **Tenant (Penyewa)** | Melihat informasi kamar, tagihan, mengajukan keluhan, dan menerima pengumuman |
| **Guest (Pengunjung)** | Melihat daftar kamar yang tersedia dan mengajukan sewa |

---

## 2. Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (Radix UI) |
| Authentication | NextAuth.js v4 (Credentials Provider, JWT) |
| Database | PostgreSQL 15 (via Docker) |
| ORM | Prisma 7 |
| Form Validation | Zod + React Hook Form |
| Charts | Recharts |
| Icons | Lucide React |
| Containerization | Docker + Docker Compose |
| File Storage | Local (dev) / Supabase Storage (prod) |

---

## 3. Arsitektur Sistem

### 3.1 Diagram Arsitektur

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Layer"]
        Browser["Browser / Mobile"]
    end

    subgraph NextJS["⚡ Next.js App Router"]
        direction TB
        subgraph Presentation["Presentation"]
            Pages["Pages / Layouts"]
            Components["Components (shadcn/ui)"]
        end
        subgraph Logic["Business Logic"]
            ServerActions["Server Actions"]
            APIRoutes["API Routes (NextAuth)"]
            Middleware["Middleware (Auth Guard)"]
        end
    end

    subgraph DataLayer["💾 Data Layer"]
        Prisma["Prisma ORM"]
    end

    subgraph Database["🐘 PostgreSQL 15 (Docker)"]
        direction LR
        Users[("Users")]
        Rooms[("Rooms")]
        Bookings[("Bookings")]
        Payments[("Payments")]
        Complaints[("Complaints")]
        Announcements[("Announcements")]
    end

    Browser --> Pages
    Browser --> APIRoutes
    Pages --> ServerActions
    ServerActions --> Prisma
    APIRoutes --> Prisma
    Middleware -.->|"Protect Routes"| Pages
    Prisma --> Users & Rooms & Bookings & Payments & Complaints & Announcements
```

### 3.2 Diagram Deployment

```mermaid
flowchart LR
    subgraph DEV["🔧 Development"]
        direction TB
        DockerCompose["Docker Compose"]
        NextDev["Next.js Dev Server\n:3000"]
        PGLocal["PostgreSQL 15\n:5433"]
        LocalStorage["Local File Storage\n/public/uploads"]
        DockerCompose --> NextDev
        DockerCompose --> PGLocal
        NextDev --> PGLocal
        NextDev --> LocalStorage
    end

    subgraph PROD["🚀 Production"]
        direction TB
        Vercel["Vercel / VPS"]
        SupabaseDB["Supabase PostgreSQL"]
        SupabaseStorage["Supabase Storage"]
        Vercel --> SupabaseDB
        Vercel --> SupabaseStorage
    end

    DEV -- "Migrate\n(ubah DATABASE_URL +\nSTORAGE_PROVIDER)" --> PROD
```

### 3.3 Strategi Deployment

- **Development:** Docker Compose (PostgreSQL + Next.js) di local machine
- **Production:** Migrasi ke Supabase (hanya ubah `DATABASE_URL`)
- **Storage:** Abstraksi layer `StorageService` — swap via env `STORAGE_PROVIDER`

---

## 4. Peran & Hak Akses

### 4.1 Role-Based Access Control (RBAC)

| Fitur | Guest | Tenant | Admin |
|-------|:-----:|:------:|:-----:|
| Lihat daftar kamar | ✅ | ✅ | ✅ |
| Lihat detail kamar | ✅ | ✅ | ✅ |
| Register / Login | ✅ | — | — |
| Ajukan sewa kamar | ✅* | ✅ | — |
| Dashboard tenant | — | ✅ | — |
| Lihat tagihan | — | ✅ | — |
| Kirim keluhan | — | ✅ | — |
| Edit profil | — | ✅ | — |
| Dashboard admin | — | — | ✅ |
| CRUD kamar | — | — | ✅ |
| Kelola penyewa | — | — | ✅ |
| Catat pembayaran | — | — | ✅ |
| Kelola keluhan | — | — | ✅ |
| Buat pengumuman | — | — | ✅ |
| Laporan keuangan | — | — | ✅ |

> *Guest akan di-redirect ke halaman login terlebih dahulu

### 4.2 Middleware Protection

Route protection menggunakan Next.js Middleware + NextAuth JWT:
- `/admin/*` → Hanya role `ADMIN`
- `/tenant/*` → Hanya role `TENANT` atau `GUEST`
- `/login`, `/register` → Redirect jika sudah login

### 4.3 Diagram Alur Autentikasi

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Middleware
    participant NextAuth as NextAuth API
    participant DB as PostgreSQL

    Note over User, DB: 🔐 Flow Login
    User->>Browser: Buka /login
    Browser->>NextAuth: POST /api/auth/callback/credentials
    NextAuth->>DB: Cari user by email
    DB-->>NextAuth: User data + hashed password
    NextAuth->>NextAuth: Verifikasi bcrypt
    alt Password Valid
        NextAuth-->>Browser: Set JWT Cookie (role, userId)
        Browser-->>User: Redirect ke dashboard sesuai role
    else Password Invalid
        NextAuth-->>Browser: Error: Invalid credentials
        Browser-->>User: Tampilkan pesan error
    end

    Note over User, DB: 🛡️ Flow Route Protection
    User->>Browser: Akses /admin/dashboard
    Browser->>Middleware: Request + JWT Cookie
    Middleware->>Middleware: Decode JWT, cek role
    alt Role = ADMIN
        Middleware-->>Browser: Allow access
    else Role ≠ ADMIN
        Middleware-->>Browser: Redirect ke /login
    end
```

---

## 5. Database Schema

### 5.1 Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ ROOM_BOOKING : "membuat"
    USER ||--o{ COMPLAINT : "mengajukan"
    USER ||--o{ ANNOUNCEMENT : "membuat (admin)"
    ROOM ||--o{ ROOM_BOOKING : "dipesan"
    ROOM ||--o{ COMPLAINT : "terkait"
    ROOM_BOOKING ||--o{ PAYMENT : "memiliki"

    USER {
        UUID id PK
        String name
        String email UK
        String password
        Enum role "ADMIN | TENANT | GUEST"
        String phone
        String ktpNumber
        String ktpPhoto
        String emergencyContact
        DateTime createdAt
    }

    ROOM {
        UUID id PK
        String name
        String description
        Float price
        String size
        String floor
        StringArray photos
        StringArray facilities
        Enum status "AVAILABLE | OCCUPIED"
        DateTime createdAt
    }

    ROOM_BOOKING {
        UUID id PK
        UUID userId FK
        UUID roomId FK
        DateTime startDate
        DateTime endDate
        Enum status "PENDING | ACTIVE | ENDED"
        DateTime createdAt
    }

    PAYMENT {
        UUID id PK
        UUID bookingId FK
        Float amount
        Int month
        Int year
        Enum status "PAID | UNPAID"
        DateTime paidAt
        String note
        DateTime createdAt
    }

    COMPLAINT {
        UUID id PK
        UUID userId FK
        UUID roomId FK
        String title
        String description
        Enum status "NEW | IN_PROGRESS | DONE"
        DateTime createdAt
    }

    ANNOUNCEMENT {
        UUID id PK
        String title
        String content
        UUID adminId FK
        DateTime createdAt
    }
```

### 5.2 Model Data

#### User
| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK, auto-generate |
| name | String | required |
| email | String | unique, required |
| password | String | hashed (bcrypt) |
| role | Enum | ADMIN / TENANT / GUEST |
| phone | String | optional |
| ktpNumber | String | optional |
| ktpPhoto | String | optional (URL) |
| emergencyContact | String | optional |
| createdAt | DateTime | auto |

#### Room
| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| name | String | required |
| description | String | required |
| price | Float | required |
| size | String | optional |
| floor | String | optional |
| photos | String[] | array of URLs |
| facilities | String[] | array (AC, WiFi, dll) |
| status | Enum | AVAILABLE / OCCUPIED |
| createdAt | DateTime | auto |

#### RoomBooking
| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| userId | UUID | FK → User |
| roomId | UUID | FK → Room |
| startDate | DateTime | required |
| endDate | DateTime | required |
| status | Enum | PENDING / ACTIVE / ENDED |
| createdAt | DateTime | auto |

#### Payment
| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| bookingId | UUID | FK → RoomBooking |
| amount | Float | required |
| month | Int | 1-12 |
| year | Int | required |
| status | Enum | PAID / UNPAID |
| paidAt | DateTime | nullable |
| note | String | optional |
| createdAt | DateTime | auto |

#### Complaint
| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| userId | UUID | FK → User |
| roomId | UUID | FK → Room |
| title | String | required |
| description | String | required |
| status | Enum | NEW / IN_PROGRESS / DONE |
| createdAt | DateTime | auto |

#### Announcement
| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| title | String | required |
| content | String | required |
| adminId | UUID | FK → User |
| createdAt | DateTime | auto |

---

## 6. Struktur Halaman & Fitur

### 6.1 Halaman Publik

#### `/` — Landing Page
- Redirect ke `/rooms`

#### `/rooms` — Daftar Kamar
- Menampilkan semua kamar dengan foto, harga, dan status
- Filter berdasarkan: harga, fasilitas, status ketersediaan
- Responsive grid layout

#### `/rooms/[id]` — Detail Kamar
- Galeri foto kamar
- Spesifikasi lengkap (ukuran, lantai, fasilitas)
- Harga sewa per bulan
- Tombol "Ajukan Sewa" (redirect ke login jika belum login)

#### `/login` — Halaman Login
- Form login dengan email + password
- Validasi menggunakan Zod
- Redirect otomatis sesuai role setelah login

#### `/register` — Halaman Registrasi
- Form daftar akun baru (nama, email, password)
- Default role: GUEST
- Validasi menggunakan Zod

---

### 6.2 Halaman Tenant

#### `/tenant/dashboard` — Dashboard Penyewa
- Informasi kamar aktif yang sedang disewa
- Tagihan bulan berjalan
- Pengumuman terbaru dari admin

#### `/tenant/bills` — Tagihan & Riwayat Pembayaran
- Daftar tagihan bulanan
- Status pembayaran (PAID / UNPAID)
- Riwayat pembayaran lengkap

#### `/tenant/complaints` — Keluhan
- Form submit keluhan baru (judul + deskripsi)
- Daftar keluhan yang pernah diajukan
- Status tracking: NEW → IN_PROGRESS → DONE

#### `/tenant/profile` — Profil Penyewa
- Edit data diri (nama, telepon)
- Upload foto KTP
- Input kontak darurat

---

### 6.3 Halaman Admin

#### `/admin/dashboard` — Dashboard Admin
Statistik overview:
- Total kamar
- Kamar terisi vs kosong
- Pemasukan bulan ini
- Keluhan pending
- Booking terbaru

#### `/admin/rooms` — Manajemen Kamar (CRUD)
- Tambah, edit, hapus kamar
- Upload maksimal 5 foto per kamar
- Checklist fasilitas: AC, WiFi, Kamar Mandi Dalam, Lemari, Meja Belajar, Parkir
- Status kamar otomatis berubah saat booking disetujui

#### `/admin/tenants` — Manajemen Penyewa
- Daftar semua penyewa aktif
- Riwayat penyewa sebelumnya
- Detail kontrak per tenant

#### `/admin/payments` — Manajemen Pembayaran
- Catat pembayaran manual per tenant per bulan
- Daftar tenant yang belum bayar bulan berjalan
- Filter riwayat pembayaran per tenant atau per bulan

#### `/admin/complaints` — Manajemen Keluhan
- Daftar semua keluhan dari tenant
- Update status: NEW → IN_PROGRESS → DONE
- Tambah catatan balasan

#### `/admin/announcements` — Pengumuman
- Buat pengumuman baru
- Kelola (edit/hapus) pengumuman yang sudah ada
- Pengumuman ditampilkan di dashboard semua tenant

#### `/admin/reports` — Laporan Keuangan
- Chart pemasukan per bulan (Recharts)
- Total pemasukan
- Rata-rata pemasukan per bulan
- Bulan dengan pemasukan tertinggi
- Filter per tahun

---

## 7. Server Actions

Seluruh operasi data menggunakan Next.js Server Actions:

| File | Fungsi |
|------|--------|
| `auth-actions.ts` | Register user baru |
| `room-actions.ts` | CRUD kamar |
| `booking-actions.ts` | Pengajuan & pengelolaan booking |
| `tenant-actions.ts` | Kelola data penyewa |
| `payment-actions.ts` | Catat & kelola pembayaran |
| `complaint-actions.ts` | Submit & update keluhan |
| `announcement-actions.ts` | CRUD pengumuman |

---

## 8. Alur Pengguna (User Flows)

### 8.1 Flow Pengajuan Sewa

```mermaid
flowchart TD
    A["🏠 Guest/Tenant membuka /rooms"] --> B["Pilih kamar → /rooms/id"]
    B --> C["Klik 'Ajukan Sewa'"]
    C --> D{"Sudah Login?"}
    D -- "Belum" --> E["Redirect ke /login"]
    D -- "Sudah" --> F["Submit Booking\nstatus: PENDING"]
    E --> G["Login / Register"]
    G --> H["Redirect kembali\nke detail kamar"]
    H --> F
    F --> I["📩 Admin mendapat notifikasi"]
    I --> J{"Admin Review"}
    J -- "Approve" --> K["✅ Booking → ACTIVE\nRoom → OCCUPIED"]
    J -- "Reject" --> L["❌ Booking → REJECTED\nRoom tetap AVAILABLE"]

    style K fill:#059669,color:#fff
    style L fill:#dc2626,color:#fff
```

### 8.2 Flow Pembayaran

```mermaid
flowchart TD
    A["💰 Admin buka /admin/payments"] --> B["Lihat daftar tenant\nyang belum bayar"]
    B --> C["Pilih tenant"]
    C --> D["Catat pembayaran:\njumlah, bulan, tahun, catatan"]
    D --> E["Server Action:\ncreatePayment()"]
    E --> F["Status → PAID\npaidAt → timestamp"]
    F --> G["✅ Tenant bisa lihat\ndi /tenant/bills"]

    style G fill:#059669,color:#fff
```

### 8.3 Flow Keluhan

```mermaid
flowchart TD
    A["📝 Tenant buka /tenant/complaints"] --> B["Klik 'Buat Keluhan Baru'"]
    B --> C["Isi: judul + deskripsi"]
    C --> D["Submit keluhan"]
    D --> E["Status: NEW 🔴"]
    E --> F["Admin lihat di\n/admin/complaints"]
    F --> G["Admin update status"]
    G --> H["Status: IN_PROGRESS 🟡"]
    H --> I["Admin selesaikan"]
    I --> J["Status: DONE 🟢"]
    J --> K["✅ Tenant lihat progress\ndi dashboard"]

    style E fill:#dc2626,color:#fff
    style H fill:#d97706,color:#fff
    style J fill:#059669,color:#fff
```

### 8.4 Sitemap Diagram

```mermaid
flowchart TD
    Root["/"] --> Rooms["/rooms"]
    Root --> Login["/login"]
    Root --> Register["/register"]
    Rooms --> RoomDetail["/rooms/id"]
    RoomDetail --> Book["/book/id"]

    Root --> AdminDash["/admin/dashboard"]
    AdminDash --> AdminRooms["/admin/rooms"]
    AdminDash --> AdminTenants["/admin/tenants"]
    AdminDash --> AdminPayments["/admin/payments"]
    AdminDash --> AdminComplaints["/admin/complaints"]
    AdminDash --> AdminAnnouncements["/admin/announcements"]
    AdminDash --> AdminReports["/admin/reports"]

    Root --> TenantDash["/tenant/dashboard"]
    TenantDash --> TenantBills["/tenant/bills"]
    TenantDash --> TenantComplaints["/tenant/complaints"]
    TenantDash --> TenantProfile["/tenant/profile"]

    style Root fill:#1e293b,color:#fff
    style AdminDash fill:#059669,color:#fff
    style TenantDash fill:#2563eb,color:#fff
    style Login fill:#7c3aed,color:#fff
    style Register fill:#7c3aed,color:#fff
```

---

## 9. Desain UI/UX

### 9.1 Prinsip Desain
- **Clean & Profesional** — Cocok untuk bisnis properti
- **Responsive** — Optimal di desktop dan mobile
- **Premium Feel** — Glassmorphism, gradient, micro-animations

### 9.2 Spesifikasi Visual
| Elemen | Spesifikasi |
|--------|-------------|
| Warna Primer | Emerald / Hijau Tua (`emerald-600` — `emerald-800`) |
| Warna Aksen | Blue (`blue-100/40` untuk dekoratif) |
| Background | Light Gray (`#F7F9FA`) |
| Font | System default (bisa di-upgrade ke Inter/Outfit) |
| Komponen UI | shadcn/ui (Card, Table, Badge, Dialog, Form, Select, dll) |
| Icons | Lucide React |
| Charts | Recharts (BarChart, LineChart) |

### 9.3 Layout
- **Dashboard Layout:** Sidebar (navigasi) + Topbar + Main Content Area
- **Public Layout:** Header/Navbar + Content + Footer
- **Decorative Elements:** Blur gradient circles di background untuk kesan premium

---

## 10. Keamanan

| Aspek | Implementasi |
|-------|-------------|
| Password Hashing | bcryptjs |
| Session Management | NextAuth JWT |
| Route Protection | Next.js Middleware + role-based checks |
| Form Validation | Zod schema validation (client + server) |
| CSRF Protection | Built-in via NextAuth |
| Environment Variables | Semua credentials di `.env`, tidak di-hardcode |

---

## 11. Environment & Deployment

### 11.1 Environment Variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kos_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
STORAGE_PROVIDER="local"            # atau "supabase"
SUPABASE_URL=""                     # untuk production
SUPABASE_ANON_KEY=""                # untuk production
SUPABASE_SERVICE_ROLE_KEY=""        # untuk production
```

### 11.2 Docker Services

| Service | Image | Port |
|---------|-------|------|
| `db` | postgres:15-alpine | 5433:5432 |
| `app` | Custom (Dockerfile) | 3000:3000 |

### 11.3 Strategi Migrasi ke Production
1. Buat project Supabase
2. Ganti `DATABASE_URL` ke Supabase connection string (pooler)
3. Ganti `STORAGE_PROVIDER` ke `supabase`
4. Isi Supabase credentials
5. Jalankan `prisma migrate deploy`
6. Deploy Next.js ke Vercel / VPS

---

## 12. Struktur Project

```
management-kos-kosan/
├── app/
│   ├── (dashboard)/           # Layout group untuk halaman authenticated
│   │   ├── admin/
│   │   │   ├── dashboard/     # Dashboard admin
│   │   │   ├── rooms/         # CRUD kamar
│   │   │   ├── tenants/       # Kelola penyewa
│   │   │   ├── payments/      # Kelola pembayaran
│   │   │   ├── complaints/    # Kelola keluhan
│   │   │   ├── announcements/ # Kelola pengumuman
│   │   │   └── reports/       # Laporan keuangan
│   │   ├── tenant/
│   │   │   ├── dashboard/     # Dashboard tenant
│   │   │   ├── bills/         # Tagihan
│   │   │   ├── complaints/    # Keluhan
│   │   │   └── profile/       # Profil
│   │   └── layout.tsx         # Shared dashboard layout (Sidebar + Topbar)
│   ├── (public)/              # Layout group untuk halaman publik
│   │   └── rooms/             # Daftar & detail kamar
│   ├── actions/               # Next.js Server Actions
│   ├── api/                   # API routes (NextAuth)
│   ├── book/                  # Booking flow
│   ├── login/                 # Halaman login
│   ├── register/              # Halaman register
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing (redirect ke /rooms)
├── components/
│   ├── auth/                  # Komponen auth (LoginForm, RegisterForm)
│   ├── booking/               # Komponen booking
│   ├── complaints/            # Komponen keluhan
│   ├── announcements/         # Komponen pengumuman
│   ├── dashboard/             # Komponen dashboard (stats, charts)
│   ├── layout/                # Sidebar, Topbar
│   ├── rooms/                 # Komponen kamar
│   ├── tenants/               # Komponen penyewa
│   ├── providers/             # Context providers (SessionProvider)
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── prisma.ts              # Prisma client instance
│   ├── utils.ts               # Utility functions (cn)
│   └── generated/prisma/      # Prisma generated client
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data (TypeScript)
│   └── seed.mjs               # Seed data (ESM)
├── types/                     # TypeScript type definitions
├── middleware.ts              # Route protection middleware
├── docker-compose.yml         # Docker services
├── Dockerfile                 # Next.js container
└── package.json
```

### 12.2 Component Dependency Diagram

```mermaid
flowchart TD
    subgraph App["app/"]
        RootLayout["layout.tsx"]
        DashLayout["(dashboard)/layout.tsx"]
        PublicLayout["(public)/layout.tsx"]
    end

    subgraph AdminPages["Admin Pages"]
        ADash["admin/dashboard"]
        ARooms["admin/rooms"]
        ATenants["admin/tenants"]
        APayments["admin/payments"]
        AComplaints["admin/complaints"]
        AAnnounce["admin/announcements"]
        AReports["admin/reports"]
    end

    subgraph TenantPages["Tenant Pages"]
        TDash["tenant/dashboard"]
        TBills["tenant/bills"]
        TComplaints["tenant/complaints"]
        TProfile["tenant/profile"]
    end

    subgraph Components["components/"]
        LayoutComp["layout/ (Sidebar, Topbar)"]
        UIComp["ui/ (shadcn)"]
        DashComp["dashboard/ (Stats, Charts)"]
        AuthComp["auth/ (Forms)"]
    end

    subgraph Actions["actions/"]
        RoomAct["room-actions"]
        BookAct["booking-actions"]
        PayAct["payment-actions"]
        CompAct["complaint-actions"]
        AnnAct["announcement-actions"]
    end

    subgraph Lib["lib/"]
        PrismaLib["prisma.ts"]
        AuthLib["auth.ts"]
    end

    RootLayout --> DashLayout
    RootLayout --> PublicLayout
    DashLayout --> LayoutComp
    DashLayout --> AdminPages
    DashLayout --> TenantPages

    AdminPages --> Actions
    TenantPages --> Actions
    AdminPages --> Components
    TenantPages --> Components
    Actions --> PrismaLib
    AuthLib --> PrismaLib
```

---

## 13. Milestone & Status

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Setup project (Next.js, Tailwind, shadcn/ui) | ✅ Done |
| 2 | Setup Prisma + PostgreSQL (Docker) | ✅ Done |
| 3 | Setup NextAuth (Credentials, JWT) | ✅ Done |
| 4 | Middleware route protection | ✅ Done |
| 5 | Dashboard layout (Sidebar + Topbar) | ✅ Done |
| 6 | Halaman Login & Register | ✅ Done |
| 7 | Halaman publik (Rooms) | ✅ Done |
| 8 | Admin Dashboard | ✅ Done |
| 9 | Admin CRUD Kamar | ✅ Done |
| 10 | Admin Manajemen Penyewa | ✅ Done |
| 11 | Admin Pembayaran | ✅ Done |
| 12 | Admin Keluhan | ✅ Done |
| 13 | Admin Pengumuman | ✅ Done |
| 14 | Admin Laporan Keuangan | ✅ Done |
| 15 | Tenant Dashboard | ✅ Done |
| 16 | Tenant Tagihan | ✅ Done |
| 17 | Tenant Keluhan | ✅ Done |
| 18 | Tenant Profil | ✅ Done |
| 19 | Booking Flow | ✅ Done |
| 20 | Seed Data | ✅ Done |
| 21 | Supabase Storage Integration | 🔲 Planned |
| 22 | Production Deployment | 🔲 Planned |

---

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Data loss saat migrasi DB | Tinggi | Backup sebelum migrasi, test di staging |
| Upload foto gagal di production | Sedang | Abstraksi StorageService, fallback handling |
| JWT token expired tanpa refresh | Sedang | Konfigurasi session maxAge yang sesuai |
| Concurrent payment recording | Rendah | Database transaction + unique constraint |

---

## 15. Pengembangan Selanjutnya (Future)

- [ ] Notifikasi real-time (WebSocket / Supabase Realtime)
- [ ] Email reminder pembayaran otomatis
- [ ] Export laporan ke PDF / Excel
- [ ] Landing page lengkap (foto kos, fasilitas, lokasi Google Maps)
- [ ] Multi-kos support (kelola beberapa properti)
- [ ] Payment gateway integration (Midtrans / Xendit)
- [ ] Sistem kontrak digital
- [ ] Mobile app (React Native / PWA)

---

> **Dokumen ini adalah living document dan akan diperbarui seiring perkembangan project.**
