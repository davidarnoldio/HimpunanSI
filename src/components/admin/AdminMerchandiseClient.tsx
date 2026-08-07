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
  Tag,
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
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormData((prev) => ({ ...prev, image: base64 }));
      } catch (err) {
        console.error("Gagal mengunggah gambar:", err);
      }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShoppingBag size={24} className="text-red-600 dark:text-red-500" />
            Kelola Official Merchandise HIMSI
          </h1>
          <p className="text-xs text-slate-500">
            Atur katalog produk, harga, stok, dan nomor WA pemesanan (Tersinkronisasi 100% dengan Supabase DB & Katalog Publik).
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer"
        >
          <Plus size={16} /> Tambah Produk Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau deskripsi produk..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {["Semua", "Apparel", "Aksesoris", "Bundling", "Lainnya"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Products */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
          <ShoppingBag size={40} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada produk merchandise</p>
          <p className="text-xs text-slate-500">Klik &quot;Tambah Produk Baru&quot; untuk menambahkan katalog pertama.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isReady = item.status === "READY";
            const isPreorder = item.status === "PRE-ORDER";

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Preview */}
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={getValidImageUrl(item.image, item.title)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-extrabold">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                          isReady
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 backdrop-blur-md"
                            : isPreorder
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40 backdrop-blur-md"
                            : "bg-red-500/20 text-red-400 border-red-500/40 backdrop-blur-md"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                      {item.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-sm font-black text-red-600 dark:text-red-400 font-mono">
                        {item.price}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        WA: +{item.whatsappNumber || "6281234567890"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 size={13} /> Hapus
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {editingItem ? "Edit Produk Merchandise" : "Tambah Merchandise Baru"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Produk Merchandise *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Kaos Polo Official HIMSI UG 2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori Produk
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                    >
                      <option value="Apparel">Apparel (Baju/Jaket)</option>
                      <option value="Aksesoris">Aksesoris (Lanyard/Stiker)</option>
                      <option value="Bundling">Bundling Package</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      Status Stok / PO
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as MerchandiseAdminItem["status"],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                    >
                      <option value="READY">READY STOK</option>
                      <option value="PRE-ORDER">PRE-ORDER (PO)</option>
                      <option value="HABIS">HABIS (SOLD OUT)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      Harga Produk (Format Rp) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. Rp 185.000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      Badge Promo / Label
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. 🔥 Wajib Maba / Free Stiker"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp Admin Pemesanan
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="Format 628xxx (tanpa tanda + / 0)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                  />
                </div>

                {/* Upload Foto Galeri / URL */}
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    Foto Produk (Galeri HP/PC atau URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Upload size={14} /> Galeri
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
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    Deskripsi Singkat & Detail Produk
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Informasi bahan, ukuran ready, varian warna, bonus stiker..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-medium leading-relaxed resize-none"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.title.trim() || !formData.price.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> Simpan Produk
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
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
