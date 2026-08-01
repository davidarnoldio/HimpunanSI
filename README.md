# 🚀 HIMSI UG — Official Website & Full CMS Portal

Selamat datang di repository resmi **Website Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma (HIMSI UG)**! Website ini dibangun menggunakan Next.js App Router dengan teknologi modern untuk memberikan pengalaman visual yang eksklusif, interaktif, responsif, serta kontrol manajemen data penuh melalui Admin Panel CMS.

---

## 🌟 Fitur Utama Website

### 1. 🌐 Portal Publik (`/`)
- **Font System:** Menggunakan Google Font **Poppins** secara menyeluruh untuk estetika typography modern.
- **Hero & Full CMS Control:** 
  - Dynamic rotating live text (*FlipWords*) untuk badge, headline, dan deskripsi.
  - Teks static, live text tags, dan 4 kartu statistik di bawah Hero Section dapat dikelola 100% oleh Admin tanpa *hardcode*.
  - Layout statistik seragam dan simetris (centered auto-fit).
- **Struktur Pimpinan Kabinet (`/#kabinet`):** 
  - Tampilan pengurus BPH dengan role colors (Kahim & Wakahim: Merah, Sekretaris: Biru, Bendahara: Hijau Emerald).
  - Floating position badge di bagian atas kartu.
  - Image fallback otomatis (`Foto Belum Tersedia` + ikon `User`) jika foto belum diunggah.
  - *Empty State UI* otomatis (`Kabinet Sedang Dalam Masa Formatur`) jika data kepengurusan kosong.
- **Divisi & Departemen (`/#divisi`):** 
  - Layout responsive flex wrap auto-centering untuk jumlah divisi ganjil (seperti 5 divisi).
  - **Strict Empty State:** Jika data divisi belum ada, menampilkan notifikasi bersih bertuliskan *"Belum ada divisi yang ditambahkan."*
- **Event & Program Kerja (`/#event`):** Header centered dengan *Casual Campus Vibe Empty State* (`Wah, belum ada event terdekat nih! 🎯`) jika proker kosong.
- **Footer Ringkas:** Layout grid 2 kolom modern (Branding/Medsos & Sekretariat/Kontak) tanpa whitespace kosong.

### 2. 🛍️ Katalog Merchandise Hypebeast (`/merchandise`)
- Interaksi kartu 3D (*hover tilt & glow effect*).
- Filter kategori produk (T-Shirt, Hoodie, Lanyard, Accessory) & status stok.
- Dynamic Detail Modal dengan selector ukuran (S, M, L, XL, XXL) & jumlah order.
- **Direct WhatsApp Order:** Tombol order langsung mengarah ke WhatsApp admin merchandise dengan format pesan otomatis.

### 3. 💬 Portal Aspirasi Mahasiswa (`/aspirasi`)
- Form aspirasi mahasiswa publik dengan opsi **Anonim / Nama Terang**.
- **Realtime Sync ke Admin:** Setiap aspirasi yang dikirimkan pengguna publik langsung masuk dan dapat dikelola di Admin Control Panel.

---

## 🔐 Keamanan & Access Guard Admin Panel

Seluruh rute di dalam folder `/admin/*` dilindungi secara ketat menggunakan **Next.js Auth Guard Middleware** ([src/middleware.ts](file:///c:/Users/lenovo/Projects/WebHimpunan/himsi-web/src/middleware.ts)).

### 🛡️ Fitur Protection:
- Setiap request yang ber-url `/admin/*` (selain `/admin/login`) dicegat oleh middleware.
- Jika pengguna belum login (cookie `himsi_admin_session` tidak aktif), aplikasi akan **otomatis di-redirect ke `/admin/login`**.
- Tombol **Logout Admin** secara otomatis menghapus cookie sesi dan melakukan redirect aman ke halaman login.

### 📍 Akses Admin CMS:
- **URL Login Admin:** `http://localhost:3000/admin/login` *(atau `https://DOMAIN_ANDA.vercel.app/admin/login`)*

---

## 🛠️ Fitur Control Panel Admin

1. **Overview Dashboard (`/admin/dashboard`):** Ringkasan statistik terverifikasi (Pengurus BPH, Event, Merchandise, dan Aspirasi Masuk).
2. **Kelola Beranda CMS (`/admin/beranda`):** Kelola teks Hero Section, kata animasi live text tags, dan 4 kartu statistik secara realtime.
3. **Kelola Visi & Misi (`/admin/visimisi`):** Kelola poin Visi dan Misi Himpunan.
4. **Kelola Pengurus BPH (`/admin/pengurus`):** Tambah, edit, dan hapus pengurus BPH dengan unggah foto dari galeri lokal.
5. **Kelola Divisi & Anggota (`/admin/divisi`):** Kelola master divisi dan anggota tim divisi.
6. **Kelola Event & Proker (`/admin/event`):** Tambah, edit, dan hapus event/proker secara realtime.
7. **Kelola Merchandise (`/admin/merchandise`):** Tambah produk baru, ubah stok, dan update harga merchandise.
8. **Kelola Aspirasi (`/admin/aspirasi`):** Pantau dan update status aspirasi mahasiswa (`Baru` ➔ `Diproses` ➔ `Selesai`).

---

## ⚙️ Environment Variables (Supabase)

Buat file `.env.local` berdasarkan file `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🌐 Panduan Deploy ke Vercel

### 🚀 Deploy via Vercel Dashboard:
1. Push repository ke GitHub:
   ```bash
   git add .
   git commit -m "Feat: Finalize HIMSI UG Web for Vercel Deployment"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) ➔ Import Repository.
3. Masukkan Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`) di menu Settings -> Environment Variables.
4. Klik **Deploy**.

---

## 💻 Panduan Development Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## ⚡ Stack Teknologi

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Framework & Logic:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Theme Provider:** [next-themes](https://github.com/pacocoursey/next-themes) (Dark & Light Mode)
- **Database Helper:** [@supabase/supabase-js](https://supabase.com/docs)

---


