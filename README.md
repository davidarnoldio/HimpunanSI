# 🚀 HIMSI UG — Official Website & Full CMS Portal

Selamat datang di repository resmi **Website Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma (HIMSI UG)**! 

Website ini dibangun menggunakan **Next.js 16 (App Router)** dengan arsitektur **Pure Server Components (RSC)** dan **Client Components** yang terpisah secara ketat, terintegrasi 100% dengan **Supabase Database (PostgreSQL / Prisma ORM)**, serta dilindungi oleh sistem keamanan **Cloudflare Turnstile Anti-Spam** dan **Auth Guard Middleware**.

---

## 🌟 Arsitektur & Fitur Utama

### 1. ⚡ Murni Server Components (RSC) & Direct Supabase Fetch
- **Zero LocalStorage Dependency:** Halaman publik membaca data utama secara langsung dari database Supabase di Server Side ([src/lib/supabaseData.ts](file:///c:/Users/lenovo/Projects/WebHimpunan/himsi-web/src/lib/supabaseData.ts)), menjamin konsistensi data yang sama di seluruh browser & perangkat (HP/Laptop).
- **Arsitektur Halaman `page.tsx`:** Seluruh file `page.tsx` di halaman publik dan panel admin murni berstatus Server Component tanpa `"use client"`. Data di-fetch secara paralel via `Promise.all` dan dialirkan sebagai props ke Client Component yang interaktif.
- **Default Light Theme:** Menyesuaikan standar tampilan UI awal yang segar dan profesional saat pengguna pertama kali membuka website.

### 2. 🛡️ Keamanan Cloudflare Turnstile & Anti-Spam
- **Frontend Protection:** Mengintegrasikan widget `@marsidev/react-turnstile` di atas tombol submit formulir aspirasi. Tombol submit secara otomatis terkunci (`disabled`) hingga verifikasi manusia selesai.
- **Backend Verification:** Validasi server-side wajib via API Cloudflare `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Jika verifikasi gagal (success: false), request akan ditolak dan query ke Supabase tidak akan dieksekusi.

### 3. 💬 Portal Aspirasi Mahasiswa (`/aspirasi`)
- **Validasi Identitas:** Pengguna dapat memilih untuk **Kirim secara Anonim** atau mencantumkan identitas. Jika tidak memilih anonim, pengguna **WAJIB** mengisikan **Nama Lengkap** dan **NPM**.
- **Realtime DB Sync:** Aspirasi yang dikirimkan publik tidak ditampilkan secara terbuka di halaman utama publik, melainkan langsung masuk dan hanya dapat dipantau & dikelola oleh pengurus di Admin Panel CMS.

### 4. 🌐 Branding & Navbar Modern (`/`)
- **Branding Logo Terbaru:** Menggunakan `himsigundar.png` pada brand logo kiri dan logo Universitas Gunadarma (`logogundar.png`) pada bagian kanan navbar.
- **Dynamic Hero Section:** Teks running animasi (*typewriter*), subheadline, badge, dan 4 kartu statistik pencapaian di kelola 100% dari Admin Panel CMS.
- **Struktur Pimpinan Kabinet & Divisi:** Menampilkan jajaran BPH dan divisi secara dinamis langsung dari database.

### 5. 🛍️ Katalog Merchandise Official (`/merchandise`)
- Kartu 3D interaktif (*hover tilt & glow effect*).
- Filter kategori produk (Apparel, Accessories, dll) & status stok.
- Ordering via Direct WhatsApp link terformat otomatis.

---

## 🔐 Keamanan Admin Panel CMS (`/admin/*`)

Seluruh rute panel admin dilindungi oleh **Next.js Auth Guard Middleware** ([src/middleware.ts](file:///c:/Users/lenovo/Projects/WebHimpunan/himsi-web/src/middleware.ts)).

- **Auth Middleware:** Setiap request ke `/admin/*` (selain `/admin/login`) dicegat oleh middleware. Pengguna tanpa cookie valid `himsi_admin_session` akan di-redirect secara otomatis ke `/admin/login`.
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

# Database Connection Strings (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@host:5432/postgres"

# Cloudflare Turnstile Anti-Spam Keys
NEXT_PUBLIC_TURNSTILE_SITE_KEY="your-turnstile-site-key"
TURNSTILE_SECRET_KEY="your-turnstile-secret-key"

# Admin Credentials Fallback (Optional)
NEXT_PUBLIC_ADMIN_EMAIL="admin@himsiug.ac.id"
NEXT_PUBLIC_ADMIN_PASSWORD="your-admin-password"
```

---

## 💻 Panduan Development Lokal

```bash
# 1. Clone repository
git clone https://github.com/your-org/himsi-web.git
cd himsi-web

# 2. Install dependencies
npm install

# 3. Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🚀 Build Production & Deployment

Untuk menguji kompilasi produksi dan tipe TypeScript:

```bash
# Executing Next.js Production Build
npm run build

# Start Production Server
npm run start
```

---

## ⚡ Stack Teknologi

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Logic:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Database & ORM:** [Supabase (PostgreSQL)](https://supabase.com/) & [Prisma ORM](https://www.prisma.io/)
- **Anti-Spam Security:** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (`@marsidev/react-turnstile`)
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Theme Manager:** [next-themes](https://github.com/pacocoursey/next-themes) (Light & Dark Mode)

---
© 2026 HIMSI UG — Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma
