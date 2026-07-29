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

export default function CRUDMerchandisePage() {
  const { merchandise, setMerchandise } = useSharedStore();

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");

  // Modal State for Edit/Create
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MerchandiseAdminItem | null>(null);

  // Custom Delete Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
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

  // Filtered Items
  const filteredItems = merchandise.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "Semua" || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  // Handle Photo File Upload from Gallery
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormData((prev) => ({ ...prev, image: base64 }));
      } catch (err) {
        console.error("Gagal mengunggah gambar merchandise:", err);
      }
    }
  };

  // Open Modal
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

  // Save Item
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    const finalImage = getValidImageUrl(formData.image, formData.title);

    if (editingItem) {
      const updated = merchandise.map((i) =>
        i.id === editingItem.id ? { ...i, ...formData, image: finalImage } : i
      );
      setMerchandise(updated);
    } else {
      const newItem: MerchandiseAdminItem = {
        id: `merch_${Date.now()}`,
        ...formData,
        image: finalImage,
      };
      setMerchandise([newItem, ...merchandise]);
    }
    setIsModalOpen(false);
  };

  // Confirm Permanent Delete Action
  const confirmDelete = () => {
    if (deleteTargetId) {
      const updated = merchandise.filter((i) => i.id !== deleteTargetId);
      setMerchandise(updated);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Kelola Merchandise & Danus
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tambah, edit produk JAHIM/Merch, atur stok & status (Tersinkron langsung dengan Katalog Merchandise /merchandise).
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-900/20 transition-all cursor-pointer"
        >
          <Plus size={16} /> Tambah Produk Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Apparel", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari merchandise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Grid Items Merchandise */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-red-500/40 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-950">
                <img
                  src={getValidImageUrl(item.image, item.title)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                    item.status === "PRE-ORDER"
                      ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                      : item.status === "READY"
                      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      : "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                  }`}>
                    {item.status}
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate mt-1">
                  {item.title}
                </h3>
                <p className="text-xs font-black text-red-600 dark:text-red-400 mt-0.5">{item.price}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">{item.category}</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit produk"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setDeleteTargetId(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Hapus produk"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Form Merchandise (With Gallery Upload) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {editingItem ? "Edit Produk Merchandise" : "Tambah Merchandise Baru"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                {/* Photo Upload Section */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Foto Produk (Pilih dari Galeri / File) *
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 shrink-0 relative">
                      <img
                        src={getValidImageUrl(formData.image, formData.title || "Merch")}
                        alt="Preview Merch"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2 flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-md shadow-red-900/20 transition-all cursor-pointer text-xs"
                      >
                        <Upload size={14} /> Pilih Foto dari Perangkat
                      </button>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Pilih foto produk dari galeri. Tersinkron langsung ke /merchandise.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                    placeholder="JAHIM HIMSI UG 2026 / Lanyard Eksklusif"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Harga *</label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                      placeholder="Rp 185.000"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="Apparel">Apparel</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status Drop *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="PRE-ORDER">PRE-ORDER</option>
                      <option value="READY">READY</option>
                      <option value="SOLD OUT">SOLD OUT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Highlight</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                      placeholder="🔥 Wajib Maba / Limited"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Link WhatsApp / Nomor Order (e.g. https://wa.me/62812... atau 62812...)
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                    placeholder="https://wa.me/6281234567890 atau 6281234567890"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Deskripsi Produk</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                    placeholder="Penjelasan bahan, keunggulan, dan rincian produk..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-md shadow-red-900/20"
                  >
                    <Check size={14} /> Simpan & Sinkronkan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTargetId)}
        title="Hapus Produk Merchandise"
        description="Apakah Anda yakin ingin menghapus produk ini? Perubahan akan langsung tersimpan permanen dan ter-update di katalog website."
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
