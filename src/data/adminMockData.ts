// Mock Data and Interfaces for Admin Dashboard CMS

export type DivisiType = string;

export interface PengurusItem {
  id: string;
  nama: string;
  jabatan: string;
  divisi: DivisiType;
  periode: string;
  fotoUrl: string;
  visiMotto?: string;
  linkedin?: string;
  instagram?: string;
}

export interface EventAdminItem {
  id: string;
  title: string;
  kategori: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  isOnline: boolean;
  status: "Pendaftaran Dibuka" | "Segera Hadir" | "Berlangsung" | "Selesai";
  deskripsi: string;
  bannerUrl: string;
  linkPendaftaran: string;
}


export interface AspirasiAdminItem {
  id: string;
  pesan: string;
  isAnonim: boolean;
  nama?: string;
  npm?: string;
  email?: string;
  tanggal: string;
  status: "Baru" | "Diproses" | "Selesai";
}

export interface MerchandiseAdminItem {
  id: string;
  title: string;
  category: "Apparel" | "Accessories" | string;
  price: string;
  image: string;
  status: "PRE-ORDER" | "READY" | "SOLD OUT" | string;
  badge?: string;
  description: string;
  whatsappNumber?: string;
}

export interface DivisiAdminItem {
  id: string;
  singkatan: string;
  nama: string;
  deskripsi: string;
  iconName: string;
  colorTheme: string;
  tugas: string[];
  anggotaCount?: number;
}

export interface VisiMisiData {
  visi: string;
  misi: string[];
}

export interface AnggotaDivisiItem {
  id: string;
  nama: string;
  npm?: string;
  divisiId: string;
  role: "Ketua Divisi" | "Anggota Divisi";
  jabatanBadge?: string;
  fotoUrl: string;
  periode: string;
  instagram?: string;
  linkedin?: string;
}

// ─── INITIAL DATA (semua dikosongkan — isi via Admin Panel) ─────────────────
export const INITIAL_PENGURUS: PengurusItem[] = [];

export const INITIAL_EVENTS: EventAdminItem[] = [];


export const INITIAL_ASPIRASI: AspirasiAdminItem[] = [];

export const INITIAL_MERCHANDISE: MerchandiseAdminItem[] = [];

export const INITIAL_DIVISI_FULL: DivisiAdminItem[] = [];

export const INITIAL_VISI_MISI: VisiMisiData = {
  visi: "Mewujudkan Himpunan Mahasiswa Sistem Informasi (HIMSI UG) yang solid, inovatif, adaptif, dan berdaya saing global serta menjadi pusat keunggulan pengembangan potensi mahasiswa Sistem Informasi Universitas Gunadarma.",
  misi: [
    "Mengembangkan iklim akademik & non-akademik yang komunikatif, inklusif, dan berlandaskan kekeluargaan.",
    "Menyelenggarakan program pelatihan keterampilan digital, leadership, dan teknologi terkini secara berkelanjutan.",
    "Membangun jejaring kolaborasi strategis dengan dunia industri, alumni, dan organisasi eksternal kampus.",
    "Mengoptimalkan tata kelola himpunan berbasis teknologi digital yang transparan dan akuntabel.",
  ],
};

export const INITIAL_ANGGOTA_DIVISI: AnggotaDivisiItem[] = [];

export interface HeroStatItem {
  value: string;
  label: string;
}

export interface HeroContentData {
  badgePrefix: string;
  badgeDynamicWords: string[];
  headlinePrefix: string;
  headlineDynamicWords: string[];
  headlineSuffix: string;
  descriptionBefore: string;
  descriptionDynamicWords: string[];
  descriptionAfter: string;
  stats: HeroStatItem[];
}

export const INITIAL_HERO_CONTENT: HeroContentData = {
  badgePrefix: "Himpunan Mahasiswa ",
  badgeDynamicWords: ["Sistem Informasi", "Universitas Gunadarma", "Fakultas FIKTI"],
  headlinePrefix: "Wadah ",
  headlineDynamicWords: ["Kolaborasi", "Aspirasi", "Kreativitas", "Kepemimpinan"],
  headlineSuffix: " Mahasiswa Sistem Informasi",
  descriptionBefore: "HIMSI UG adalah gerakan mahasiswa yang ",
  descriptionDynamicWords: ["Proaktif", "Inklusif", "Solutif", "Berdampak", "Visioner"],
  descriptionAfter:
    " dalam menggerakkan potensi mahasiswa Sistem Informasi Universitas Gunadarma melalui program kerja unggulan & inovasi digital.",
  stats: [
    { value: "1.200+", label: "Mahasiswa SI Aktif" },
    { value: "4", label: "Divisi Operasional" },
    { value: "20+", label: "Proker / Tahun" },
    { value: "3", label: "Kampus Gunadarma" },
  ],
};

export const INITIAL_HEADLINE_WORDS: string[] = INITIAL_HERO_CONTENT.headlineDynamicWords;
export const INITIAL_BADGE_WORDS: string[] = INITIAL_HERO_CONTENT.badgeDynamicWords;
export const INITIAL_SUBHEADLINE_WORDS: string[] = INITIAL_HERO_CONTENT.descriptionDynamicWords;


