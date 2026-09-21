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
  pilar?: string;
}

export interface AnggotaDivisiItem {
  id: string;
  nama: string;
  npm?: string;
  divisiId: string;
  role: "Ketua Divisi" | "Wakil Ketua Divisi" | "Anggota Divisi";
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

export const INITIAL_DIVISI_FULL: DivisiAdminItem[] = [
  {
    id: "akademik",
    singkatan: "AKADEMIK",
    nama: "Divisi Akademik & Keilmuan",
    deskripsi:
      "Meningkatkan kualitas akademik dan keilmuan mahasiswa Sistem Informasi melalui program bimbingan belajar, tutoring, dan pelatihan kompetensi keahlian.",
    iconName: "BookOpen",
    colorTheme: "blue",
    tugas: [
      "Tutoring & Bimbingan Belajar Mata Kuliah SI",
      "Sharing Session Akademik & Latihan Ujian",
      "Pengembangan Competency & Pembinaan Lomba",
    ],
    anggotaCount: 5,
  },
  {
    id: "seni-olahraga",
    singkatan: "SENIOR",
    nama: "Divisi Seni dan Olahraga",
    deskripsi:
      "Wadah penyaluran bakat, minat, serta pengembangan kreativitas mahasiswa Sistem Informasi di bidang seni, budaya, dan keolahragaan.",
    iconName: "Trophy",
    colorTheme: "amber",
    tugas: [
      "Turnamen & Kompetisi Olahraga Himpunan",
      "Pengembangan Minat & Bakat Seni Mahasiswa",
      "Internal Fun Match & Bonding Olahraga",
    ],
    anggotaCount: 6,
  },
  {
    id: "psdm",
    singkatan: "PSDM",
    nama: "Divisi Pengembangan Sumber Daya Manusia",
    deskripsi:
      "Berfokus pada pengkaderan, pembentukan karakter, kepemimpinan, serta peningkatan kualitas sumber daya manusia organisasi HIMASI UG.",
    iconName: "Users",
    colorTheme: "emerald",
    tugas: [
      "Pengkaderan & Orientasi Mahasiswa Baru",
      "Pelatihan Leadership & Leadership Soft Skills",
      "Bonding, Dynamic Teamwork & Evaluasi Internal",
    ],
    anggotaCount: 5,
  },
  {
    id: "wirausaha",
    singkatan: "KWU",
    nama: "Divisi Wirausaha",
    deskripsi:
      "Mengembangkan jiwa kewirausahaan mahasiswa, mengelola unit usaha himpunan, serta penyediaan merchandise resmi HIMASI UG.",
    iconName: "ShoppingBag",
    colorTheme: "purple",
    tugas: [
      "Penjualan Official Merchandise HIMASI UG",
      "Pelatihan & Workshop Entrepreneurship",
      "Pengelolaan Unit Usaha & Fund Raising",
    ],
    anggotaCount: 4,
  },
  {
    id: "it",
    singkatan: "IT",
    nama: "Divisi Teknologi Informasi",
    deskripsi:
      "Mengembangkan dan memelihara infrastruktur teknologi, website resmi, serta aplikasi pendukung operasional digital HIMASI UG.",
    iconName: "Code",
    colorTheme: "cyan",
    tugas: [
      "Pengembangan & Maintenance Web HIMASI UG",
      "Tech Exploration & Workshop Pemrograman",
      "Dukungan Infrastruktur Sistem Informasi",
    ],
    anggotaCount: 4,
  },
  {
    id: "multimedia",
    singkatan: "MULTIMEDIA",
    nama: "Divisi Multimedia",
    deskripsi:
      "Mengelola konten visual, desain grafis, videografi, fotografi, serta branding media publikasi kreatif HIMASI UG.",
    iconName: "Camera",
    colorTheme: "rose",
    tugas: [
      "Visual Branding & Desain Grafis Feeds Social Media",
      "Dokumentasi Foto & Video Setiap Event Himpunan",
      "Produksi Konten Media Kreatif & Short Video",
    ],
    anggotaCount: 5,
  },
  {
    id: "kerohanian",
    singkatan: "KEROHANIAN",
    nama: "Divisi Kerohanian",
    deskripsi:
      "Menggalang kegiatan keagamaan, pembinaan mental spiritual, dan mempererat tali silaturahmi keagamaan antar mahasiswa HIMASI UG.",
    iconName: "Heart",
    colorTheme: "indigo",
    tugas: [
      "Kajian & Kegiatan Keagamaan Rutin",
      "Peringatan Hari Besar Keagamaan",
      "Pembinaan Spiritual & Silaturahmi Mahasiswa",
    ],
    anggotaCount: 4,
  },
];

export const INITIAL_VISI_MISI: VisiMisiData = {
  visi: "Mewujudkan Himpunan Mahasiswa Sistem Informasi (HIMASI UG) yang solid, inovatif, adaptif, dan berdaya saing global serta menjadi pusat keunggulan pengembangan potensi mahasiswa Sistem Informasi Universitas Gunadarma.",
  misi: [
    "Mengembangkan iklim akademik & non-akademik yang komunikatif, inklusif, dan berlandaskan kekeluargaan.",
    "Menyelenggarakan program pelatihan keterampilan digital, leadership, dan teknologi terkini secara berkelanjutan.",
    "Membangun jejaring kolaborasi strategis dengan dunia industri, alumni, dan organisasi eksternal kampus.",
    "Mengoptimalkan tata kelola himpunan berbasis teknologi digital yang transparan dan akuntabel.",
  ],
  pilar: "Setiap gerakan HIMASI berpusat pada 3 pilar: Inovasi Digital, Kolaborasi Strategis, dan Integritas Akademik.",
};

export const INITIAL_ANGGOTA_DIVISI: AnggotaDivisiItem[] = [
  // ── DIVISI AKADEMIK ──
  { id: "ak_1", nama: "Ariyo Seno", divisiId: "akademik", role: "Ketua Divisi", jabatanBadge: "Kadiv Akademik", fotoUrl: "", periode: "2026/2027" },
  { id: "ak_2", nama: "Muhammad Mulki Razak", divisiId: "akademik", role: "Wakil Ketua Divisi", jabatanBadge: "Wakadiv Akademik", fotoUrl: "", periode: "2026/2027" },
  { id: "ak_3", nama: "Ghanny Apriansyah Syarif", divisiId: "akademik", role: "Anggota Divisi", jabatanBadge: "Staff Akademik", fotoUrl: "", periode: "2026/2027" },
  { id: "ak_4", nama: "Donny Setiawan", divisiId: "akademik", role: "Anggota Divisi", jabatanBadge: "Staff Akademik", fotoUrl: "", periode: "2026/2027" },
  { id: "ak_5", nama: "Sindbad Bali Mahatma", divisiId: "akademik", role: "Anggota Divisi", jabatanBadge: "Staff Akademik", fotoUrl: "", periode: "2026/2027" },

  // ── DIVISI SENI DAN OLAHRAGA ──
  { id: "so_1", nama: "Muhammad Wildan Al-Zakky", divisiId: "seni-olahraga", role: "Ketua Divisi", jabatanBadge: "Kadiv Seni & Olahraga", fotoUrl: "", periode: "2026/2027" },
  { id: "so_2", nama: "Yosia Siahaan", divisiId: "seni-olahraga", role: "Wakil Ketua Divisi", jabatanBadge: "Wakadiv Seni & Olahraga", fotoUrl: "", periode: "2026/2027" },
  { id: "so_3", nama: "Alya Asyifa", divisiId: "seni-olahraga", role: "Anggota Divisi", jabatanBadge: "Staff Seni & Olahraga", fotoUrl: "", periode: "2026/2027" },
  { id: "so_4", nama: "Muhammad Rafi", divisiId: "seni-olahraga", role: "Anggota Divisi", jabatanBadge: "Staff Seni & Olahraga", fotoUrl: "", periode: "2026/2027" },
  { id: "so_5", nama: "Muhammad Afrifal Malik", divisiId: "seni-olahraga", role: "Anggota Divisi", jabatanBadge: "Staff Seni & Olahraga", fotoUrl: "", periode: "2026/2027" },
  { id: "so_6", nama: "Andi Aidan Afzaal Albahy", divisiId: "seni-olahraga", role: "Anggota Divisi", jabatanBadge: "Staff Seni & Olahraga", fotoUrl: "", periode: "2026/2027" },

  // ── DIVISI PSDM ──
  { id: "ps_1", nama: "Alya Firdayani", divisiId: "psdm", role: "Ketua Divisi", jabatanBadge: "Kadiv PSDM", fotoUrl: "", periode: "2026/2027" },
  { id: "ps_2", nama: "Arya Alif Pratama", divisiId: "psdm", role: "Wakil Ketua Divisi", jabatanBadge: "Wakadiv PSDM", fotoUrl: "", periode: "2026/2027" },
  { id: "ps_3", nama: "Muhammad Fauzan Putra", divisiId: "psdm", role: "Anggota Divisi", jabatanBadge: "Staff PSDM", fotoUrl: "", periode: "2026/2027" },
  { id: "ps_4", nama: "Alloysius Theodorus Yeremiasa", divisiId: "psdm", role: "Anggota Divisi", jabatanBadge: "Staff PSDM", fotoUrl: "", periode: "2026/2027" },
  { id: "ps_5", nama: "Raditya Bima", divisiId: "psdm", role: "Anggota Divisi", jabatanBadge: "Staff PSDM", fotoUrl: "", periode: "2026/2027" },

  // ── DIVISI WIRAUSAHA ──
  { id: "wu_1", nama: "Muhammad Rifki Aditya", divisiId: "wirausaha", role: "Ketua Divisi", jabatanBadge: "Kadiv Wirausaha", fotoUrl: "", periode: "2026/2027" },
  { id: "wu_2", nama: "Moreno Nabiel Putratama", divisiId: "wirausaha", role: "Wakil Ketua Divisi", jabatanBadge: "Wakadiv Wirausaha", fotoUrl: "", periode: "2026/2027" },
  { id: "wu_3", nama: "Handanta Venusi Hermawan", divisiId: "wirausaha", role: "Anggota Divisi", jabatanBadge: "Staff Wirausaha", fotoUrl: "", periode: "2026/2027" },
  { id: "wu_4", nama: "Rafif Syauqi Novriyanto", divisiId: "wirausaha", role: "Anggota Divisi", jabatanBadge: "Staff Wirausaha", fotoUrl: "", periode: "2026/2027" },

  // ── DIVISI IT ──
  { id: "it_1", nama: "David Arnoldio Pratama", divisiId: "it", role: "Ketua Divisi", jabatanBadge: "Kadiv IT", fotoUrl: "", periode: "2026/2027" },
  { id: "it_2", nama: "Muhammad Tegar Ramadhan", divisiId: "it", role: "Wakil Ketua Divisi", jabatanBadge: "Wakadiv IT", fotoUrl: "", periode: "2026/2027" },
  { id: "it_3", nama: "Muhammad Prayoga Prastyo Nugroho", divisiId: "it", role: "Anggota Divisi", jabatanBadge: "Staff IT", fotoUrl: "", periode: "2026/2027" },
  { id: "it_4", nama: "Idan Fitrah", divisiId: "it", role: "Anggota Divisi", jabatanBadge: "Staff IT", fotoUrl: "", periode: "2026/2027" },

  // ── DIVISI MULTIMEDIA ──
  { id: "mm_1", nama: "Gelzy Khanaya Velmalia", divisiId: "multimedia", role: "Ketua Divisi", jabatanBadge: "Kadiv Multimedia", fotoUrl: "", periode: "2026/2027" },
  { id: "mm_2", nama: "Muhammad Faturrahman Syaki", divisiId: "multimedia", role: "Wakil Ketua Divisi", jabatanBadge: "Wakadiv Multimedia", fotoUrl: "", periode: "2026/2027" },
  { id: "mm_3", nama: "Dzulfiqar Ramadhan", divisiId: "multimedia", role: "Anggota Divisi", jabatanBadge: "Staff Multimedia", fotoUrl: "", periode: "2026/2027" },
  { id: "mm_4", nama: "Ilham Fikriya Syahdan", divisiId: "multimedia", role: "Anggota Divisi", jabatanBadge: "Staff Multimedia", fotoUrl: "", periode: "2026/2027" },
  { id: "mm_5", nama: "Muhammad Ramdani", divisiId: "multimedia", role: "Anggota Divisi", jabatanBadge: "Staff Multimedia", fotoUrl: "", periode: "2026/2027" },

  // ── DIVISI KEROHANIAN ──
  { id: "kr_1", nama: "Muhammad Cahyadi Pamungkas", divisiId: "kerohanian", role: "Ketua Divisi", jabatanBadge: "Kadiv Kerohanian", fotoUrl: "", periode: "2026/2027" },
  { id: "kr_2", nama: "MUHAMMAD RAIHAN FATHIN", divisiId: "kerohanian", role: "Wakil Ketua Divisi", jabatanBadge: "Wakadiv Kerohanian", fotoUrl: "", periode: "2026/2027" },
  { id: "kr_3", nama: "Aryaseta Amri Rabbani", divisiId: "kerohanian", role: "Anggota Divisi", jabatanBadge: "Staff Kerohanian", fotoUrl: "", periode: "2026/2027" },
  { id: "kr_4", nama: "Muhammad Ali Fikri", divisiId: "kerohanian", role: "Anggota Divisi", jabatanBadge: "Staff Kerohanian", fotoUrl: "", periode: "2026/2027" },
];

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
  heroImageUrl?: string;
}

export const INITIAL_HERO_CONTENT: HeroContentData = {
  badgePrefix: "Himpunan Mahasiswa ",
  badgeDynamicWords: ["Sistem Informasi", "Universitas Gunadarma", "Fakultas FIKTI"],
  headlinePrefix: "Wadah ",
  headlineDynamicWords: ["Kolaborasi", "Aspirasi", "Kreativitas", "Kepemimpinan"],
  headlineSuffix: " Mahasiswa Sistem Informasi",
  descriptionBefore: "HIMASI UG adalah gerakan mahasiswa yang ",
  descriptionDynamicWords: ["Proaktif", "Inklusif", "Solutif", "Berdampak", "Visioner"],
  descriptionAfter:
    " dalam menggerakkan potensi mahasiswa Sistem Informasi Universitas Gunadarma melalui program kerja unggulan & inovasi digital.",
  stats: [
    { value: "1.200+", label: "Mahasiswa SI Aktif" },
    { value: "4", label: "Divisi Operasional" },
    { value: "20+", label: "Proker / Tahun" },
    { value: "3", label: "Kampus Gunadarma" },
  ],
  heroImageUrl: "/hero-editorial.webp",
};

export const INITIAL_HEADLINE_WORDS: string[] = INITIAL_HERO_CONTENT.headlineDynamicWords;
export const INITIAL_BADGE_WORDS: string[] = INITIAL_HERO_CONTENT.badgeDynamicWords;
export const INITIAL_SUBHEADLINE_WORDS: string[] = INITIAL_HERO_CONTENT.descriptionDynamicWords;


