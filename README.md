# SIRKULA INTELLIGENCE — Frontend Monorepo Ecosystem

> **UNS Innovation Hackathon 2026 — Universitas Sebelas Maret**  
> *Material Intelligence Berbasis AIoT untuk Pemulihan dan Keterlacakan Kemasan Minuman dalam Ekosistem Ekonomi Sirkular*

---

## 🏗️ Struktur Monorepo

```text
sirkula/
├── apps/
│   ├── landing/       # Public Landing Page (Port 3000)
│   ├── admin/         # Admin Management Dashboard (Port 3001)
│   └── user/          # Mobile-First User PWA (Port 3002)
│
├── packages/
│   ├── api-client/    # Structured mock data & future REST API client
│   ├── shared-types/  # TypeScript interfaces (PET, ALU, RVM, Transaction, Batch, etc.)
│   ├── shared-utils/  # id-ID formatters (Rupiah, kg, date, etc.)
│   ├── shared-ui/     # Shared UI primitives
│   └── config/        # Brand tokens, colors & Tailwind presets
│
├── package.json       # Monorepo root scripts
├── pnpm-workspace.yaml
├── turbo.json         # Turborepo task pipeline
└── tsconfig.base.json # Shared TypeScript configuration
```

---

## 🚀 Menjalankan Aplikasi

### 1. Instalasi Dependensi
```bash
cd sirkula
pnpm install
```

### 2. Menjalankan Semua Aplikasi Bersamaan (Turborepo)
```bash
pnpm dev
```

### 3. Menjalankan Secara Parsial / Mandiri
* **Landing Page (Port 3000):**
  ```bash
  pnpm dev:landing
  # Buka http://localhost:3000
  ```
* **Admin Dashboard (Port 3001):**
  ```bash
  pnpm dev:admin
  # Buka http://localhost:3001
  ```
* **User App Mobile-First (Port 3002):**
  ```bash
  pnpm dev:user
  # Buka http://localhost:3002
  ```

---

## 📱 Daftar Rute Aplikasi

### A. User App (`apps/user`)
* `/login` & `/register` — Autentikasi Demo
* `/app` — Beranda Utama & Saldo Poin
* `/app/setor` — Panduan & Langkah Setor Kemasan
* `/app/scan` — Pindai QR Mesin RVM (Kamera + Input Manual)
* `/app/session/:id` — Sesi Penyetoran Interaktif (State Machine & Validasi Multi-modal)
* `/app/transaction/:id` — Bukti Transaksi & Audit 5 Tahap
* `/app/lokasi` — Peta & Sebaran Mesin Kampus UNS Kentingan
* `/app/reward` — Katalog & Penukaran Hadiah (Pengurangan Poin Atomik)
* `/app/reward/history` — Riwayat Penukaran Hadiah
* `/app/riwayat` — Riwayat Transaksi Penyetoran
* `/app/impact` — Dampak Pemulihan Kemasan Bersih
* `/app/profil` — Profil Pengguna Mahasiswa UNS
* `/app/bantuan` — Pusat Bantuan & FAQ

### B. Admin Dashboard (`apps/admin`) — Menggunakan Utuh Antarmuka Sirkula Intelligence
* Mengadopsi **100% tampilan, style, layout, dan UI/UX** dari prototipe dengan identitas merek **Sirkula Intelligence**:
  * `/` (`index.html`) — Halaman Masuk Operator dengan Showcase 4 Pilar *Material Intelligence*
  * `/dashboard.html` — Ringkasan Operasional, KPI utama, tren 14 hari, split material PET vs Aluminium, dan transaksi terbaru
  * `/mesin.html` — Monitoring Mesin RVM (Switching Tab Kartu Unit & Peta Sebaran Leaflet)
  * `/transaksi.html` — Audit Transaksi (ID Unik, *Idempotency Key*, Skor CV, Berat Sensor, dan *Slide-Over Sheet* 5 Tahap Verifikasi)
  * `/analitik.html` — Analitik Material & Rincian Penolakan Multi-Modal
  * `/reward.html` — Manajemen Aturan Poin & Kalkulator Simulasi Margin Operasional
  * `/pengumpulan.html` — Prioritas Pengangkutan & Batch Keterlacakan Mitra
  * `/anomali.html` — Log Pencegahan Kecurangan (*Anti-Fraud*)
  * Mode Terang & Gelap (*Light / Dark Theme*) adaptif via tombol di header
  * Tombol **Reset** dan **Simulasi Transaksi** interaktif langsung di halaman dashboard

### C. Landing Page (`apps/landing`)
* Halaman publik lengkap: Hero, Masalah, Solusi, 5 Langkah Cara Kerja, Arsitektur Teknologi, Kategori Material, Keterlacakan, Mitra Kampus UNS, dan FAQ.

---

## 🔒 Prinsip Integritas Klaim & Data Mock
Seluruh aplikasi berjalan dalam mode demonstrasi terisolasi dengan data deterministik yang konsisten antar entitas (*user*, *machine*, *transaction*, *reward*, *batch*, dan *anomaly*). Siap dihubungkan langsung dengan API backend saat tahap integrasi berikutnya.
