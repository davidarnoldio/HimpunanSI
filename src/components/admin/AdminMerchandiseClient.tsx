"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  ShoppingBag,
  Check,
} from "lucide-react";
import { useSharedStore, getValidImageUrl, convertFileToBase64 } from "@/lib/sharedStore";
import { type MerchandiseAdminItem } from "@/data/adminMockData";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { saveMerchandiseAction } from "@/app/actions/adminActions";

interface AdminMerchandiseClientProps {
  initialMerchandise: MerchandiseAdminItem[];
}

export function AdminMerchandiseClient({ initialMerchandise }: AdminMerchandiseClientProps) {
  const { merchandise, setMerchandise, mounted } = useSharedStore();
  const activeMerchandise = mounted ? merchandise : initialMerchandise;

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MerchandiseAdminItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<Omit<MerchandiseAdminItem, "id">>({
    title: "",
    category: "Apparel",
    price: "Rp 185.000",
    image: "",
    status: "PRE-ORDER",
    badge: "🔥 Wajib Maba",
    description: "",
    whatsappNumber: "6281234567890",
  });

  const filteredItems = activeMerchandise.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "Semua" || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      alert(`Ukuran foto terlalu besar (${sizeMB} MB). Ukuran maksimal foto adalah 2 MB.`);
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      setFormData((prev) => ({ ...prev, image: base64 }));
    } catch (err) {
      console.error("Gagal mengunggah gambar:", err);
      alert("Gagal membaca foto produk dari perangkat.");
    }
  };

  const handleOpenModal = (item?: MerchandiseAdminItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        price: item.price,
        image: item.image || "",
        status: item.status,
        badge: item.badge || "",
        description: item.description,
        whatsappNumber: item.whatsappNumber || "6281234567890",
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        category: "Apparel",
        price: "Rp 100.000",
        image: "https://placehold.co/600x600/0f172a/dc2626?text=New+Merchandise",
        status: "READY",
        badge: "New Drop",
        description: "",
        whatsappNumber: "6281234567890",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const finalImage = getValidImageUrl(formData.image, formData.title);

      let updated: MerchandiseAdminItem[];
      if (editingItem) {
        updated = activeMerchandise.map((i) =>
          i.id === editingItem.id ? { ...i, ...formData, image: finalImage } : i
        );
      } else {
        const newItem: MerchandiseAdminItem = {
          id: `m_${Date.now()}`,
          ...formData,
          image: finalImage,
        };
        updated = [newItem, ...activeMerchandise];
      }

      setMerchandise(updated);
      await saveMerchandiseAction(updated);
      setIsModalOpen(false);
    } catch (err) {
      console.error("[AdminMerchandise] Save error:", err);
      alert("Gagal menyimpan data merchandise ke database. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId || isLoading) return;
    setIsLoading(true);

    try {
      const updated = activeMerchandise.filter((i) => i.id !== deleteTargetId);
      setMerchandise(updated);
      setDeleteTargetId(null);
      await saveMerchandiseAction(updated);
    } catch (err) {
      console.error("[AdminMerchandise] Delete error:", err);
      alert("Gagal menghapus produk merchandise dari database.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-slate-950 dark:border-white/20 pb-4">
        <div>
          <h1 className="text-2xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            <ShoppingBag size={24} className="text-[#C8102E] dark:text-[#E31B3B]" />
            KELOLA OFFICIAL MERCHANDISE HIMASI
          </h1>
          <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mt-0.5">
            Atur katalog produk, harga, stok, dan nomor WA pemesanan (Tersinkronisasi 100% dengan Supabase DB & Katalog Publik).
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 hover:bg-slate-950 transition-colors cursor-pointer shrink-0"
        >
          <Plus size={16} /> TAMBAH PRODUK BARU
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-950 dark:text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau deskripsi produk..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold focus:outline-none focus:border-[#C8102E] text-slate-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {["Semua", "Apparel", "Aksesoris", "Bundling", "Lainnya"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-black font-mono uppercase border-2 border-slate-950 cursor-pointer transition-colors ${filterCategory === cat
                  ? "bg-[#C8102E] text-white"
                  : "bg-white dark:bg-slate-950 text-slate-950 dark:text-white hover:bg-slate-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Products */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20">
          <ShoppingBag size={40} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-black font-heading uppercase text-slate-950 dark:text-white">Belum ada produk merchandise</p>
          <p className="text-xs font-mono font-bold text-slate-500">Klik &quot;Tambah Produk Baru&quot; untuk menambahkan katalog pertama.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Preview */}
                  <div className="relative h-48 bg-slate-950 border-b-2 border-slate-950 dark:border-white/20 overflow-hidden">
                    <img
                      src={getValidImageUrl(item.image, item.title)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-300"
                    />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-slate-950 text-white text-[10px] font-black font-mono border border-slate-950 uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="px-2.5 py-1 bg-[#C8102E] text-white text-[10px] font-black font-mono border border-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-[#C8102E] text-white text-[10px] font-black font-mono border border-slate-950 uppercase tracking-wider">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-black font-heading text-base uppercase text-slate-950 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 font-medium">
                      {item.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-sm font-black text-[#C8102E] dark:text-[#E31B3B] font-mono">
                        {item.price}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-bold">
                        WA: +{item.whatsappNumber || "6281234567890"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-950 border-t-2 border-slate-950 dark:border-white/20 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer font-black font-mono text-xs uppercase hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Edit2 size={13} /> EDIT
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-2 bg-[#C8102E] text-white border border-slate-950 cursor-pointer font-black font-mono text-xs uppercase hover:bg-slate-950 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={13} /> HAPUS
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] p-6 sm:p-8 space-y-6 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-950 dark:border-white/20">
                <h2 className="text-lg font-black font-heading uppercase text-slate-950 dark:text-white">
                  {editingItem ? "EDIT PRODUK MERCHANDISE" : "TAMBAH MERCHANDISE BARU"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                    NAMA PRODUK MERCHANDISE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Kaos Polo Official HIMASI UG 2025"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      KATEGORI PRODUK
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                    >
                      <option value="Apparel">Apparel (Baju/Jaket)</option>
                      <option value="Aksesoris">Aksesoris (Lanyard/Stiker)</option>
                      <option value="Bundling">Bundling Package</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      STATUS STOK / PO
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as MerchandiseAdminItem["status"],
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                    >
                      <option value="READY">READY STOK</option>
                      <option value="PRE-ORDER">PRE-ORDER (PO)</option>
                      <option value="HABIS">HABIS (SOLD OUT)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      HARGA PRODUK (FORMAT RP) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. Rp 185.000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      BADGE PROMO / LABEL
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. 🔥 Wajib Maba / Free Stiker"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                    NOMOR WHATSAPP ADMIN PEMESANAN
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="Format 628xxx (tanpa tanda + / 0)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                    FOTO PRODUK (GALERI OR URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase border border-slate-950 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Upload size={14} /> GALERI
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                    DESKRIPSI SINGKAT & DETAIL PRODUK
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Informasi bahan, ukuran ready, varian warna..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-medium leading-relaxed resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-slate-950 dark:border-white/20">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.title.trim() || !formData.price.trim()}
                    className="px-6 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] hover:bg-slate-950 text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin" />
                        <span>MENYIMPAN...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> SIMPAN PRODUK
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Hapus Produk Merchandise"
        description="Apakah Anda yakin ingin menghapus produk merchandise ini secara permanen dari Supabase Database?"
      />
    </div>
  );
}
