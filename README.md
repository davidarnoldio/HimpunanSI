# 🚀 HIMASI UG — Official Website & Full CMS Portal

Selamat datang di repository resmi **Website Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma (HIMASI UG)**!

Website ini dibangun menggunakan **Next.js 16 (App Router)** dengan arsitektur **Pure Server Components (RSC)** dan **Client Components** yang terpisah secara ketat, terintegrasi 100% dengan **Supabase Database (PostgreSQL)** via REST API, serta dilindungi oleh sistem keamanan berlapis **Upstash Redis Rate Limiting**, **Cloudflare Turnstile Anti-Spam**, dan **Auth Guard Middleware**.

---

##  Arsitektur & Fitur Utama

### 1.  Murni Server Components (RSC) & Direct Supabase Fetch
- **Zero LocalStorage Dependency:** Halaman publik membaca data utama secara langsung dari database Supabase di Server Side ([src/lib/supabaseData.ts](src/lib/supabaseData.ts)), menjamin konsistensi data yang sama di seluruh browser & perangkat.
- **Arsitektur Halaman `page.tsx`:** Seluruh file `page.tsx` di halaman publik dan panel admin murni berstatus Server Component tanpa `"use client"`. Data di-fetch secara paralel via `Promise.all` dan dialirkan sebagai props ke Client Component yang interaktif.
- **Default Light Theme:** Menyesuaikan standar tampilan UI awal yang segar dan profesional saat pengguna pertama kali membuka website.

### 2.  Rate Limiting (Upstash Redis)
- **IP-Based Protection:** Menggunakan `@upstash/redis` dan `@upstash/ratelimit` untuk membatasi pengiriman formulir aspirasi maksimal **3 request per 1 menit** per IP address.
- **Performa Server Optimal:** Pengecekan rate limit dievaluasi di paling awal pada Server Action (`submitAspirasiAction`), mencegah kelebihan beban server sebelum mengeksekusi verifikasi Turnstile atau query database.

### 3.  Keamanan Cloudflare Turnstile & Anti-Spam
- **Frontend Protection:** Widget `@marsidev/react-turnstile` diletakkan tepat di atas tombol submit formulir aspirasi. Tombol submit secara otomatis terkunci (`disabled`) hingga verifikasi manusia selesai.
- **Backend Verification:** Validasi server-side wajib via API Cloudflare `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Request bot/spam akan ditolak secara otomatis.

### 4.  Portal Aspirasi Mahasiswa (`/aspirasi`)
- **Validasi Identitas:** Pengguna dapat memilih untuk **Kirim secara Anonim** atau mencantumkan identitas lengkap. Jika tidak memilih anonim, **Nama Lengkap** dan **NPM** bersifat wajib.
- **Field Email Tersimpan Penuh:** Field `email` (opsional) dari form aspirasi kini disimpan secara eksplisit ke tabel Supabase dan dapat dilihat di Admin Panel.
- **Realtime DB Sync:** Aspirasi yang dikirimkan publik disimpan secara aman di database Supabase dan hanya dapat dipantau & dikelola oleh pengurus di Admin Panel CMS.

### 5.  Branding & Navbar Modern (`/`)
- **Branding Logo Terbaru:** Menggunakan `HIMASIgundar.png` pada brand logo kiri dan logo Universitas Gunadarma (`logogundar.png`) pada bagian kanan navbar.
- **Dynamic Hero Section:** Teks running animasi (*FlipWords*), subheadline, badge, dan 4 kartu statistik pencapaian dikelola 100% dari Admin Panel CMS.
- **Background Matrix:** Latar visual teks kode/binary samar (`HackerMatrixBackground`) berjalan via animasi CSS standar HTML5 — kompatibel penuh dengan Next.js App Router (tanpa `<style jsx>`).
- **Struktur Pimpinan Kabinet & Divisi:** Menampilkan jajaran BPH dan divisi secara dinamis langsung dari database.

### 6.  Navigasi Smooth Scroll (Lenis)
- **Smooth Scrolling:** Menggunakan library Lenis untuk pengalaman scrolling yang halus di seluruh halaman.
- **Anchor Kabinet Akurat:** Anchor `id="kabinet"` diletakkan tepat di atas judul *"Pimpinan Himpunan"* (bukan di atas konten Visi & Misi), sehingga klik menu "Kabinet" di navbar mendarat tepat pada heading yang benar dengan offset navbar yang pas via `scroll-mt-24`.

### 7.  Katalog Merchandise Official (`/merchandise`)
- Kartu 3D interaktif (*hover tilt & glow effect*).
- Filter kategori produk (Apparel, Accessories, dll) & status stok.
- Ordering via Direct WhatsApp link terformat otomatis.

### 8.  Splash Screen
- Muncul **hanya sekali per sesi browser** menggunakan `sessionStorage`.
- Menggunakan `useSyncExternalStore` untuk deteksi client-mount yang aman dari SSR hydration mismatch — mencegah splash kedap-kedip (*race condition*) saat refresh.

---

## 🔐 Keamanan Admin Panel CMS (`/admin/*`)

Seluruh rute panel admin dilindungi oleh **Next.js Auth Guard Middleware** ([src/middleware.ts](src/middleware.ts)).

- **Auth Middleware:** Setiap request ke `/admin/*` (selain `/admin/login`) dicegat oleh middleware. Pengguna tanpa cookie valid akan di-redirect secara otomatis ke `/admin/login`.
- **UX Anti-Lag & Double-Submission Guard:** Semua tombol aksi/submit di panel admin dilengkapi dengan state `isLoading`, visual spinner, dan pelindung `disabled={isLoading}` untuk mencegah klik ganda & lag.

### 🛠️ Fitur Admin Control Panel CMS:
1. **Overview Dashboard (`/admin/dashboard`):** Ringkasan statistik realtime (Pengurus BPH, Event, Merchandise, dan Aspirasi Masuk).
2. **Kelola Beranda CMS (`/admin/beranda`):** Kelola teks Hero Section, kata animasi live text tags, dan statistik pencapaian.
3. **Kelola Visi & Misi (`/admin/visimisi`):** Kelola poin Visi dan Misi Himpunan.
4. **Kelola Pengurus BPH (`/admin/pengurus`):** Tambah, edit, dan hapus pengurus BPH dengan dukungan unggah foto galeri/URL.
5. **Kelola Divisi & Staff (`/admin/divisi` & `/admin/anggota-divisi`):** Kelola master divisi dan jajaran anggota staff per divisi.
6. **Kelola Event & Proker (`/admin/event`):** Tambah, edit, dan hapus event/proker.
7. **Kelola Merchandise (`/admin/merchandise`):** Manajemen katalog produk, stok, dan harga merchandise.
8. **Kelola Aspirasi (`/admin/aspirasi`):** Monitoring & update status aspirasi mahasiswa (`Baru` ➔ `Diproses` ➔ `Selesai`).

---

## ⚙️ Environment Variables (`.env`)

Pastikan file `.env` di root project memiliki variabel berikut:

```env
# Supabase Public API Credentials
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Cloudflare Turnstile Anti-Spam Keys
NEXT_PUBLIC_TURNSTILE_SITE_KEY="your-turnstile-site-key"
TURNSTILE_SECRET_KEY="your-turnstile-secret-key"

# Upstash Redis Rate Limiting Keys
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Admin Credentials Fallback (Optional)
NEXT_PUBLIC_ADMIN_EMAIL="admin@HIMASIug.ac.id"
NEXT_PUBLIC_ADMIN_PASSWORD="your-admin-password"
```

> **Catatan:** `DATABASE_URL` dan `DIRECT_URL` (Prisma) sudah **tidak digunakan** karena project ini telah migrasi penuh ke Supabase REST API. Pastikan tidak ada dependency Prisma yang tersisa di `package.json`.

---

## 💻 Panduan Development Lokal

```bash
# 1. Clone repository
git clone https://github.com/your-org/HIMASI-web.git
cd HIMASI-web

# 2. Install dependencies
npm install

# 3. Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🏗️ Build Production & Deployment

Untuk menguji kompilasi produksi dan tipe TypeScript:

```bash
# Executing Next.js Production Build
npm run build

# Start Production Server
npm run start
```

---

## 🐛 Riwayat Bug Fix & Patch

### Patch 1 — Audit & Bugfix Codebase (Agustus 2026)

| ID | File | Masalah | Solusi |
|----|------|---------|--------|
| **B1** | `HackerMatrixBackground.tsx` | `<style jsx>` tidak valid di App Router — animasi matrix tidak berjalan | Ganti ke `<style dangerouslySetInnerHTML>` dengan CSS keyframes string standar HTML5 |
| **B2** | `LayananSection.tsx` | Link `href="#quick-links"` broken (tidak ada anchor tujuan) | Diubah ke `href="/aspirasi"` yang valid |
| **B3** | `aspirasiActions.ts` | Field `email` dari form tidak ter-insert ke Supabase | Hapus fallback hardcoded `"Mahasiswa SI"` dan pastikan email diteruskan eksplisit |
| **B4** | `SplashScreen.tsx` | Race condition: `hasSeenSplash` dibaca saat render SSR, bukan client mount | Baca `sessionStorage` hanya setelah `isMounted === true` dengan guard di render-time |
| **B5** | `sharedStore.ts` | Komentar index `Promise.all` tidak terdokumentasi — rawan tukar variabel | Tambahkan komentar index eksplisit `// [0] → pengurus` dst. untuk setiap entry |
| **K1** | `KabinetSection.tsx` | `id="kabinet"` ada di `<section>` di atas Visi & Misi — scroll landing salah | Pindahkan anchor ke `<div aria-hidden>` tepat di atas judul "Pimpinan Himpunan" |
| **K2** | `aspirasiActions.ts` | Fallback hardcoded `"Mahasiswa SI"` saat nama dikosongkan walau sudah divalidasi | Hapus fallback, biarkan `undefined` agar konsisten dengan validasi sebelumnya |

### Dead Code yang Diidentifikasi (Belum Dihapus — Menunggu Konfirmasi)
- `LineWaves.tsx` — komponen UI tidak pernah diimpor
- `MaintenanceToggle.tsx` — stub kosong `return null`
- `LayananSection.tsx` — tidak diimpor di `page.tsx` (tidak tampil di website)
- Dependency `prisma` & `@prisma/client` — tidak digunakan (project sudah migrasi ke Supabase REST)

---

## 📦 Stack Teknologi

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **UI & Logic** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) |
| **Database** | [Supabase (PostgreSQL)](https://supabase.com/) via REST API |
| **Rate Limiting** | [Upstash Redis](https://upstash.com/) (`@upstash/redis` & `@upstash/ratelimit`) |
| **Anti-Spam** | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| **Iconography** | [Lucide React](https://lucide.dev/) |
| **Theme Manager** | [next-themes](https://github.com/pacocoursey/next-themes) (Light & Dark Mode) |
| **Typography** | Space Grotesk, Plus Jakarta Sans, JetBrains Mono (Google Fonts) |

---

© 2026 HIMASI UG — Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma
