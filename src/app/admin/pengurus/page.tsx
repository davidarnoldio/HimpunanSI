"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { useSharedStore, getValidImageUrl, convertFileToBase64 } from "@/lib/sharedStore";
import { type PengurusItem } from "@/data/adminMockData";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function CRUDPengurusPage() {
  const { pengurus, setPengurus } = useSharedStore();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PengurusItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State (FORCE DIVISI TO BPH EXCLUSIVELY)
  const [formData, setFormData] = useState<Omit<PengurusItem, "id">>({
    nama: "",
    jabatan: "",
    divisi: "BPH",
    periode: "2025/2026",
    fotoUrl: "",
    visiMotto: "",
    linkedin: "",
    instagram: "",
  });

  // Filtered List EXCLUSIVELY FOR BPH
  const bphPengurus = pengurus.filter((item) => item.divisi === "BPH");

  const filteredItems = bphPengurus.filter((item) => {
    return (
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Handle Local Image File Upload from Gallery
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormData((prev) => ({ ...prev, fotoUrl: base64 }));
      } catch (err) {
        console.error("Gagal mengunggah foto dari galeri:", err);
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nama: "",
      jabatan: "",
      divisi: "BPH",
      periode: "2025/2026",
      fotoUrl: "",
      visiMotto: "",
      linkedin: "",
      instagram: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PengurusItem) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      jabatan: item.jabatan,
      divisi: "BPH",
      periode: item.periode || "2025/2026",
      fotoUrl: item.fotoUrl,
      visiMotto: item.visiMotto || "",
      linkedin: item.linkedin || "",
      instagram: item.instagram || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      // Update
      const updatedList = pengurus.map((item) =>
        item.id === editingItem.id ? { ...formData, id: editingItem.id, divisi: "BPH" } : item
      );
      setPengurus(updatedList);
    } else {
      // Create new
      const newItem: PengurusItem = {
        ...formData,
        divisi: "BPH",
        id: "bph_" + Date.now(),
      };
      setPengurus([...pengurus, newItem]);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    const updatedList = pengurus.filter((item) => item.id !== deleteTargetId);
    setPengurus(updatedList);
    setDeleteTargetId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="text-red-600 dark:text-red-500" size={24} />
            Kelola Pengurus BPH (Pimpinan Himpunan)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Halaman khusus untuk mengelola data Badan Pengurus Harian (Kahim, Wakahim, Sekum, Bendum).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Tambah Pengurus BPH
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau jabatan BPH..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Cards Grid BPH Only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4 hover:border-red-500/40 transition-all"
          >
            <div className="space-y-3 text-center">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] border border-slate-200 dark:border-slate-700 inline-block">
                {item.jabatan}
              </span>

              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                {item.fotoUrl && !item.fotoUrl.includes("placehold.co") ? (
                  <img src={getValidImageUrl(item.fotoUrl)} alt={item.nama} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 space-y-1">
                    <User size={40} />
                    <span className="text-[10px] font-semibold">Foto Belum Ada</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate">
                  {item.nama}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Periode {item.periode || "2025/2026"}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                title="Edit Pengurus"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => setDeleteTargetId(item.id)}
                className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                title="Hapus Pengurus"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit BPH */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 z-10 max-h-[90vh] overflow-y-auto text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {editingItem ? "Edit Pengurus BPH" : "Tambah Pengurus BPH Baru"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="David Arnoldio Pratama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jabatan BPH</label>
                  <input
                    type="text"
                    required
                    placeholder="Ketua Himpunan (Kahim) / Sekretaris Umum"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Visi & Motto / Quotes</label>
                  <textarea
                    rows={3}
                    placeholder="Mewujudkan HIMSI UG yang solid, inovatif, dan berdaya saing..."
                    value={formData.visiMotto}
                    onChange={(e) => setFormData({ ...formData, visiMotto: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Upload Foto */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Foto Profil</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {formData.fotoUrl && !formData.fotoUrl.includes("placehold.co") ? (
                        <img src={getValidImageUrl(formData.fotoUrl)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-slate-500" />
                      )}
                    </div>
                    <label className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                      <Upload size={18} className="text-slate-400 mb-1" />
                      <span className="text-slate-600 dark:text-slate-300 font-semibold">Upload Foto Pengurus</span>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Instagram</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/username"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg"
                  >
                    Simpan Data BPH
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTargetId)}
        title="Hapus Pengurus BPH"
        description="Apakah Anda yakin ingin menghapus data pengurus BPH ini dari sistem?"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
