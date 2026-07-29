// ============================================================
// Data Statis Katalog Merchandise JAHIM & HIMSI UG
// Update data produk di sini tanpa menyentuh komponen UI
// ============================================================

export type MerchandiseCategory = "all" | "apparel" | "accessories" | "stationery" | "bundle";
export type MerchandiseStatus = "available" | "pre-order" | "sold-out" | "coming-soon";

export interface MerchandiseSize {
  label: string;
  available: boolean;
}

export interface MerchandiseItem {
  id: string;
  name: string;
  tagline: string;
  category: MerchandiseCategory;
  status: MerchandiseStatus;
  price: number;
  originalPrice?: number;
  images: string[]; // placeholder URLs, replace with actual product images
  description: string;
  details: string[];
  sizes?: MerchandiseSize[];
  colors?: string[];
  badge?: string;
  whatsappNumber: string;
  orderFormUrl?: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  stock?: number;
}

export const MERCHANDISE_ITEMS: MerchandiseItem[] = [
  {
    id: "jahim-hoodie-2025",
    name: "Hoodie JAHIM 2025",
    tagline: "Kebanggaan HIMSI dalam setiap jahitan",
    category: "apparel",
    status: "pre-order",
    price: 185000,
    originalPrice: 210000,
    images: [
      "https://placehold.co/600x600/0f172a/dc2626?text=Hoodie+JAHIM",
      "https://placehold.co/600x600/1e293b/f43f5e?text=Detail+Hoodie",
    ],
    description:
      "Hoodie premium JAHIM 2025 berbahan fleece 300gsm super lembut, cocok untuk menemani aktivitas kuliah maupun nongkrong. Desain eksklusif logo HIMSI UG di dada kiri.",
    details: [
      "Bahan: Fleece 300gsm Anti-Pil",
      "Teknik sablon: DTF (Direct to Film) full color",
      "Jahitan reinforced di sisi & siku",
      "Kantong depan kangguru",
      "Tersedia warna: Slate Black & Charcoal Red",
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "XXL", available: false },
    ],
    colors: ["#1e293b", "#7f1d1d"],
    badge: "Pre-Order Open",
    whatsappNumber: "6281234567890",
    orderFormUrl: "https://forms.gle/exampleJahimHoodie",
    tags: ["hoodie", "jahim", "apparel", "2025"],
    isNew: true,
    isBestSeller: false,
    stock: 50,
  },
  {
    id: "tshirt-himsi-edition",
    name: "T-Shirt HIMSI Edition",
    tagline: "Kasual, keren, dan penuh identitas",
    category: "apparel",
    status: "available",
    price: 95000,
    images: [
      "https://placehold.co/600x600/0f172a/dc2626?text=T-Shirt+HIMSI",
      "https://placehold.co/600x600/1e293b/f43f5e?text=Detail+T-Shirt",
    ],
    description:
      "Kaos premium combed 30s dengan desain logo HIMSI UG modern. Nyaman dipakai sepanjang hari, cocok untuk acara formal maupun santai.",
    details: [
      "Bahan: Cotton Combed 30s",
      "Teknik sablon: Rubber Discharge",
      "Preshrunk (tidak menyusut)",
      "Label jahit custom HIMSI",
      "Tersedia warna: White, Black, Navy",
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "XXL", available: true },
    ],
    colors: ["#ffffff", "#0f172a", "#1e3a5f"],
    whatsappNumber: "6281234567890",
    tags: ["tshirt", "himsi", "apparel"],
    isBestSeller: true,
    stock: 120,
  },
  {
    id: "totebag-jahim",
    name: "Totebag Kanvas JAHIM",
    tagline: "Bawa semangatmu ke mana saja",
    category: "accessories",
    status: "available",
    price: 65000,
    images: [
      "https://placehold.co/600x600/0f172a/dc2626?text=Totebag+JAHIM",
    ],
    description:
      "Totebag kanvas premium JAHIM dengan kapasitas besar, cocok membawa buku kuliah, laptop 13 inci, dan perlengkapan sehari-hari.",
    details: [
      "Bahan: Canvas 12oz",
      "Ukuran: 38cm × 42cm × 10cm",
      "Jahitan ganda di tali",
      "Kantong dalam zipper",
      "Sablon water-based ramah lingkungan",
    ],
    whatsappNumber: "6281234567890",
    tags: ["totebag", "accessories", "jahim"],
    isBestSeller: true,
    stock: 80,
  },
  {
    id: "lanyard-himsi",
    name: "Lanyard Premium HIMSI",
    tagline: "Identitas bangga di setiap langkah",
    category: "accessories",
    status: "available",
    price: 35000,
    images: [
      "https://placehold.co/600x600/0f172a/dc2626?text=Lanyard+HIMSI",
    ],
    description:
      "Lanyard sublimasi full-color dengan pengait stainless steel dan ring card holder. Wajib punya untuk mahasiswa HIMSI!",
    details: [
      "Bahan: Polyester sublimasi",
      "Lebar: 2cm",
      "Panjang: 45cm",
      "Pengait: Stainless steel + safety clip",
      "Termasuk card holder transparan",
    ],
    whatsappNumber: "6281234567890",
    tags: ["lanyard", "accessories", "himsi"],
    stock: 200,
  },
  {
    id: "notebook-jahim",
    name: "Notebook JAHIM A5",
    tagline: "Tulis ide-ide besarmu di sini",
    category: "stationery",
    status: "pre-order",
    price: 45000,
    images: [
      "https://placehold.co/600x600/0f172a/dc2626?text=Notebook+JAHIM",
    ],
    description:
      "Notebook hardcover A5 eksklusif JAHIM dengan 200 halaman dotted, cocok untuk catatan kuliah, bullet journal, hingga brainstorming proyek.",
    details: [
      "Cover: Hardcover linen texture",
      "Ukuran: A5 (14.8cm × 21cm)",
      "Kertas: 100gsm dotted, 200 halaman",
      "Jilid: Lay-flat sewn binding",
      "Bonus: Sticker pack HIMSI",
    ],
    badge: "Pre-Order Q3 2025",
    whatsappNumber: "6281234567890",
    orderFormUrl: "https://forms.gle/exampleNotebookJahim",
    tags: ["notebook", "stationery", "jahim"],
    isNew: true,
    stock: 30,
  },
  {
    id: "sticker-pack-himsi",
    name: "Sticker Pack HIMSI Vol.2",
    tagline: "Ekspresikan dirimu dengan stiker keren",
    category: "stationery",
    status: "available",
    price: 20000,
    images: [
      "https://placehold.co/600x600/0f172a/dc2626?text=Sticker+Pack",
    ],
    description:
      "Pack berisi 12 stiker vinyl premium dengan desain karakter HIMSI, meme, dan logo. Tahan air, tahan UV, cocok untuk laptop, tumbler, dan helm.",
    details: [
      "Isi: 12 stiker per pack",
      "Bahan: Vinyl waterproof + UV resist",
      "Ukuran bervariasi: 5–10cm",
      "Finishing: Glossy & Matte mix",
      "Desain: Karakter, Quote, Logo HIMSI",
    ],
    whatsappNumber: "6281234567890",
    tags: ["sticker", "stationery", "himsi"],
    isBestSeller: true,
    stock: 300,
  },
  {
    id: "bundle-starter-pack",
    name: "Starter Pack HIMSI Bundle",
    tagline: "Paket lengkap untuk mahasiswa HIMSI baru",
    category: "bundle",
    status: "pre-order",
    price: 280000,
    originalPrice: 360000,
    images: [
      "https://placehold.co/600x600/0f172a/dc2626?text=Bundle+Starter",
    ],
    description:
      "Bundle eksklusif berisi T-Shirt, Totebag, Lanyard, Notebook, dan Sticker Pack HIMSI. Hemat 22% dibanding beli satuan. Pilihan terbaik untuk maba HIMSI!",
    details: [
      "Isi: T-Shirt (pilih ukuran & warna)",
      "Isi: Totebag Kanvas JAHIM",
      "Isi: Lanyard Premium HIMSI",
      "Isi: Notebook JAHIM A5",
      "Isi: Sticker Pack Vol.2",
      "Gratis: Goodie bag eksklusif HIMSI",
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "XXL", available: false },
    ],
    badge: "Hemat 22%",
    whatsappNumber: "6281234567890",
    orderFormUrl: "https://forms.gle/exampleBundleStarter",
    tags: ["bundle", "starter", "himsi", "maba"],
    isNew: true,
    stock: 25,
  },
  {
    id: "jacket-himsi-varsity",
    name: "Jacket Varsity HIMSI",
    tagline: "Campus style yang tidak pernah lekang oleh waktu",
    category: "apparel",
    status: "coming-soon",
    price: 350000,
    images: [
      "https://placehold.co/600x600/0f172a/dc2626?text=Jacket+Varsity",
    ],
    description:
      "Jacket varsity premium dengan material wol di badan dan kulit PU di lengan. Desain eksklusif kolaborasi HIMSI × desainer lokal Gunadarma.",
    details: [
      "Bahan badan: Wool 80% + Polyester 20%",
      "Bahan lengan: PU Leather premium",
      "Bordir: Logo HIMSI 3D embroidery",
      "Kancing: Custom snap button",
      "Tersedia: M, L, XL",
    ],
    badge: "Coming Soon",
    whatsappNumber: "6281234567890",
    tags: ["jacket", "varsity", "apparel", "himsi"],
    isNew: true,
  },
];

export const CATEGORY_LABELS: Record<MerchandiseCategory, string> = {
  all: "Semua Produk",
  apparel: "Apparel",
  accessories: "Accessories",
  stationery: "Stationery",
  bundle: "Bundle Deal",
};

export const STATUS_LABELS: Record<MerchandiseStatus, string> = {
  available: "Tersedia",
  "pre-order": "Pre-Order",
  "sold-out": "Habis Terjual",
  "coming-soon": "Segera Hadir",
};

export const STATUS_COLORS: Record<MerchandiseStatus, string> = {
  available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "pre-order": "bg-red-500/20 text-red-400 border-red-500/30",
  "sold-out": "bg-slate-500/20 text-slate-400 border-slate-500/30",
  "coming-soon": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};
