// ============================================================
// Data Statis Landing Page HIMSI UG
// Update semua konten di sini tanpa menyentuh komponen UI
// ============================================================

import {
  Calendar,
  Megaphone,
  Users,
  Globe,
  BarChart3,
  Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─────────────────────────────
// NAVBAR
// ─────────────────────────────
export const NAV_LINKS = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Kabinet", href: "/#kabinet" },
  { label: "Divisi", href: "/#divisi" },
  { label: "Event & Proker", href: "/#event" },
  { label: "Merchandise", href: "/merchandise" },
  { label: "Aspirasi", href: "/aspirasi" },
] as const;

// ─────────────────────────────
// HERO STATS
// ─────────────────────────────
export const HERO_STATS = [
  { value: "1.200+", label: "Mahasiswa SI Aktif" },
  { value: "4", label: "Divisi Operasional" },
  { value: "20+", label: "Proker / Tahun" },
  { value: "3", label: "Kampus Gunadarma" },
] as const;

// ─────────────────────────────
// KABINET BPH (PIMPINAN HIMPUNAN)
// ─────────────────────────────
export interface PimpinanKabinetItem {
  id: string;
  jabatanBadge: string;
  nama: string;
  npm?: string;
  fotoUrl: string;
  visiMotto: string;
  linkedin?: string;
  instagram?: string;
}

export const KABINET_PIMPINAN: PimpinanKabinetItem[] = [
  {
    id: "kahim",
    jabatanBadge: "Ketua Himpunan",
    nama: "David Arnoldio Pratama",
    npm: "14121890",
    fotoUrl: "https://placehold.co/600x800/0f172a/dc2626?text=Ketua+Himpunan",
    visiMotto:
      "Mewujudkan Himpunan Mahasiswa Sistem Informasi yang solid, inovatif, dan berdaya saing, serta menjadi wadah pengembangan diri bagi mahasiswa dalam aspek akademik maupun non-akademik secara berkelanjutan.",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
  },
  {
    id: "wakahim",
    jabatanBadge: "Wakil Ketua Himpunan",
    nama: "Anisa Rahmawati",
    npm: "14121901",
    fotoUrl: "https://placehold.co/600x800/0f172a/f43f5e?text=Wakil+Ketua",
    visiMotto:
      "Mendorong kolaborasi aktif lintas divisi dan memperkuat sinergi organisasi yang inklusif serta responsif terhadap kebutuhan seluruh mahasiswa Sistem Informasi Gunadarma.",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
  },
  {
    id: "sekretaris",
    jabatanBadge: "Sekretaris Umum",
    nama: "Clarissa Putri",
    npm: "14121755",
    fotoUrl: "https://placehold.co/600x800/0f172a/3b82f6?text=Sekretaris",
    visiMotto:
      "Mengoptimalkan tata kelola administrasi dan kearsipan organisasi berbasis digital yang transparan, akurat, dan terintegrasi untuk mendukung efektivitas himpunan.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "bendahara",
    jabatanBadge: "Bendahara Umum",
    nama: "Rizka Aulia",
    npm: "14121810",
    fotoUrl: "https://placehold.co/600x800/0f172a/10b981?text=Bendahara",
    visiMotto:
      "Mengelola keuangan organisasi secara akuntabel, efisien, dan berkelanjutan untuk menunjang seluruh program kerja HIMSI UG secara maksimal.",
    instagram: "https://instagram.com",
  },
];

// ─────────────────────────────
// DIVISI
// ─────────────────────────────
export interface DivisiItem {
  id: string;
  singkatan: string;
  nama: string;
  deskripsi: string;
  icon: LucideIcon;
  colorTheme: string;
  accentColor: string;
  tugas: string[];
  anggotaCount: number;
}

export const DIVISI_LIST: DivisiItem[] = [
  {
    id: "akademik",
    singkatan: "Akademik",
    nama: "Divisi Akademik & Keilmuan",
    deskripsi:
      "Mendukung prestasi akademik mahasiswa SI melalui tutoring, bimbingan belajar, dan fasilitas pengembangan potensi keilmuan serta kompetensi lomba.",
    icon: Users,
    colorTheme: "blue",
    accentColor: "text-blue-600 dark:text-blue-400 border-blue-500/40 hover:border-blue-400",
    tugas: [
      "Tutoring & Bimbingan Belajar",
      "Sharing Session Matkul SI",
      "Kompetisi & Lomba Akademik",
    ],
    anggotaCount: 15,
  },
  {
    id: "medinfo",
    singkatan: "Medinfo",
    nama: "Divisi Media, Informasi & Komunikasi",
    deskripsi:
      "Mengelola identitas digital HIMSI UG: pengolahan media sosial, desain grafis, dokumentasi kegiatan, serta penyebaran informasi kampus.",
    icon: Megaphone,
    colorTheme: "violet",
    accentColor: "text-violet-600 dark:text-violet-400 border-violet-500/40 hover:border-violet-400",
    tugas: [
      "Pengelolaan Instagram & TikTok",
      "Desain Grafis & Visual Branding",
      "Dokumentasi & Video Event",
    ],
    anggotaCount: 18,
  },
  {
    id: "psdm",
    singkatan: "PSDM",
    nama: "Divisi Pengembangan Sumber Daya Manusia",
    deskripsi:
      "Membentuk karakter, kepemimpinan, dan solidaritas internal himpunan melalui pelatihan soft-skills, pengkaderan, serta bonding kepengurusan.",
    icon: Users,
    colorTheme: "emerald",
    accentColor: "text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:border-emerald-400",
    tugas: [
      "Pengkaderan & Orientasi Maba",
      "Pelatihan Leadership & Soft-Skills",
      "Internal Bonding Kepengurusan",
    ],
    anggotaCount: 20,
  },
  {
    id: "humas",
    singkatan: "Humas",
    nama: "Divisi Hubungan Masyarakat",
    deskripsi:
      "Membangun dan memelihara hubungan baik dengan pihak eksternal, alumni, birokrasi kampus, serta organisasi mahasiswa lainnya di Universitas Gunadarma.",
    icon: Globe,
    colorTheme: "amber",
    accentColor: "text-amber-600 dark:text-amber-400 border-amber-500/40 hover:border-amber-400",
    tugas: [
      "Humas & Network Eksternal",
      "Kemitraan & Sponsorship",
      "Media Partner & Outreach",
    ],
    anggotaCount: 14,
  },
];

// ─────────────────────────────
// EVENT & PROKER
// ─────────────────────────────
export type EventKategori = "Workshop" | "Lomba" | "Event Himpunan" | "Webinar";
export type EventStatus = "Pendaftaran Dibuka" | "Segera Hadir" | "Berlangsung" | "Selesai";

export interface EventItem {
  id: string;
  title: string;
  kategori: EventKategori;
  tanggal: string;
  waktu: string;
  lokasi: string;
  isOnline: boolean;
  status: EventStatus;
  deskripsi: string;
  link: string;
}

export const EVENT_LIST: EventItem[] = [
  {
    id: "workshop-uiux-2025",
    title: "UI/UX Masterclass: From Zero to Prototype",
    kategori: "Workshop",
    tanggal: "02 Agustus 2025",
    waktu: "09.00 – 16.00 WIB",
    lokasi: "Zoom Meeting",
    isOnline: true,
    status: "Pendaftaran Dibuka",
    deskripsi: "Workshop intensif belajar proses Design Thinking, Figma prototyping, dan user research bersama praktisi UX dari industri.",
    link: "#daftar",
  },
  {
    id: "lomba-essay-si",
    title: "Lomba Essay Nasional Sistem Informasi",
    kategori: "Lomba",
    tanggal: "10 Agustus 2025",
    waktu: "Deadline: 23.59 WIB",
    lokasi: "Online Submission",
    isOnline: true,
    status: "Pendaftaran Dibuka",
    deskripsi: "Kompetisi essay tingkat nasional bertema 'Peran SI dalam Transformasi Digital Indonesia'. Hadiah total Rp 5 Juta.",
    link: "#daftar",
  },
  {
    id: "inaugurasi-himsi-2025",
    title: "Inaugurasi Kabinet HIMSI UG 2025",
    kategori: "Event Himpunan",
    tanggal: "20 Agustus 2025",
    waktu: "13.00 WIB",
    lokasi: "Auditorium Kampus E Gunadarma",
    isOnline: false,
    status: "Segera Hadir",
    deskripsi: "Pelantikan resmi pengurus kabinet HIMSI UG periode 2025/2026. Disertai rangkaian acara budaya dan networking.",
    link: "#detail",
  },
  {
    id: "webinar-karir-it",
    title: "Webinar: Career Path di Industri IT",
    kategori: "Webinar",
    tanggal: "30 Agustus 2025",
    waktu: "19.00 – 21.00 WIB",
    lokasi: "Google Meet",
    isOnline: true,
    status: "Segera Hadir",
    deskripsi: "Ngobrol bareng alumni SI Gunadarma yang kini berkarir di perusahaan tech unicorn. Sesi Q&A terbuka untuk semua mahasiswa.",
    link: "#detail",
  },
];

export const EVENT_STATUS_STYLE: Record<EventStatus, string> = {
  "Pendaftaran Dibuka": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "Segera Hadir": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  "Berlangsung": "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  "Selesai": "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
};

// ─────────────────────────────
// LAYANAN / QUICK ACCESS
// ─────────────────────────────
export interface LayananItem {
  id: string;
  title: string;
  deskripsi: string;
  icon: LucideIcon;
  color: string;
  accentColor: string;
  badgeText?: string;
  href: string;
  ctaLabel: string;
  isExternal?: boolean;
}

export const LAYANAN_ITEMS: LayananItem[] = [
  {
    id: "event-proker",
    title: "Event & Program Kerja",
    deskripsi:
      "Ikuti berbagai kegiatan seru, workshop teknologi, seminar karir, dan kompetisi tingkat nasional persembahan HIMSI UG.",
    icon: Calendar,
    color: "from-blue-900/30 to-blue-950/50",
    accentColor: "text-blue-600 dark:text-blue-400 border-blue-500/40 group-hover:border-blue-400",
    href: "/#event",
    ctaLabel: "Lihat Event Proker",
  },
  {
    id: "merchandise-jahim",
    title: "Merchandise Resmi JAHIM",
    deskripsi:
      "Hoodie, kaos, totebag, lanyard, dan stiker eksklusif HIMSI UG. Tampil bangga dengan identitas SI Gunadarma!",
    icon: Award,
    color: "from-red-900/30 to-red-950/50",
    accentColor: "text-red-600 dark:text-red-400 border-red-500/40 group-hover:border-red-400",
    badgeText: "Pre-Order Open",
    href: "/merchandise",
    ctaLabel: "Lihat Katalog",
  },
  {
    id: "aspirasi",
    title: "Layanan Aspirasi Mahasiswa",
    deskripsi:
      "Sampaikan aspirasi, kritik, dan saranmu ke pengurus HIMSI. Tersedia mode anonim untuk keamanan privasi kamu.",
    icon: Megaphone,
    color: "from-violet-900/30 to-violet-950/50",
    accentColor: "text-violet-600 dark:text-violet-400 border-violet-500/40 group-hover:border-violet-400",
    href: "/aspirasi",
    ctaLabel: "Sampaikan Aspirasi",
  },
  {
    id: "medpar",
    title: "Media Partner & Sponsorship",
    deskripsi:
      "Jalin kerjasama event, media partner, atau sponsorship dengan HIMSI UG. Tim Humas siap merespons dalam 24 jam.",
    icon: BarChart3,
    color: "from-emerald-900/30 to-emerald-950/50",
    accentColor: "text-emerald-600 dark:text-emerald-400 border-emerald-500/40 group-hover:border-emerald-400",
    href: "/#divisi",
    ctaLabel: "Hubungi Humas",
  },
];

// ─────────────────────────────
// FOOTER
// ─────────────────────────────
export const FOOTER_SOCIAL = [
  { platform: "instagram", icon: "instagram", label: "@himsi.ug", href: "https://instagram.com/himasi_gunadarma" },
  { platform: "linkedin", icon: "linkedin", label: "HIMSI UG", href: "https://linkedin.com" },
  { platform: "youtube", icon: "youtube", label: "HIMSI Channel", href: "https://youtube.com" },
  { platform: "tiktok", icon: "tiktok", label: "@himsi.ug", href: "https://tiktok.com" },
];

export const FOOTER_INFO = {
  sekretariat: "Sekretariat HIMSI UG, Kampus E Universitas Gunadarma, Jl. Akses UI No.9, Kelapa Dua, Depok, Jawa Barat 16951",
  email: "himsiug.official@gmail.com",
  jamKerja: "Senin - Jumat (09:00 - 17:00 WIB)",
};

export const FOOTER_LINKS = [
  {
    title: "Navigasi",
    links: [
      { label: "Beranda", href: "/#beranda" },
      { label: "Tentang Kami", href: "/#kabinet" },
      { label: "Divisi Himpunan", href: "/#divisi" },
      { label: "Event & Proker", href: "/#event" },
      { label: "Official Merchandise", href: "/merchandise" },
      { label: "Aspirasi Mahasiswa", href: "/aspirasi" },
    ],
  },
] as const;
