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
  Check,
} from "lucide-react";
import { useSharedStore, getValidImageUrl, convertFileToBase64 } from "@/lib/sharedStore";
import { type PengurusItem } from "@/data/adminMockData";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { savePengurusAction } from "@/app/actions/adminActions";

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

interface AdminPengurusClientProps {
  initialPengurus: PengurusItem[];
}

export function AdminPengurusClient({ initialPengurus }: AdminPengurusClientProps) {
  const { pengurus, setPengurus } = useSharedStore();
  const activePengurus = pengurus.length > 0 ? pengurus : initialPengurus;

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PengurusItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const bphPengurus = activePengurus.filter((item) => item.divisi === "BPH");

  const filteredItems = bphPengurus.filter((item) => {
    return (
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormData((prev) => ({ ...prev, fotoUrl: base64 }));
      } catch (err) {
        console.error("Gagal mengunggah foto:", err);
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
      fotoUrl: item.fotoUrl || "",
      visiMotto: item.visiMotto || "",
      linkedin: item.linkedin || "",
      instagram: item.instagram || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.jabatan.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const finalFotoUrl = getValidImageUrl(formData.fotoUrl, formData.nama);

      let updated: PengurusItem[];
      if (editingItem) {
        updated = activePengurus.map((i) =>
          i.id === editingItem.id ? { ...i, ...formData, divisi: "BPH", fotoUrl: finalFotoUrl } : i
        );
      } else {
        const newItem: PengurusItem = {
          id: `bph_${Date.now()}`,
          ...formData,
          divisi: "BPH",
          fotoUrl: finalFotoUrl,
        };
        updated = [...activePengurus, newItem];
      }

      setPengurus(updated);
      await savePengurusAction(updated);
      setIsModalOpen(false);
    } catch (err) {
      console.error("[AdminPengurus] Save error:", err);
      alert("Gagal menyimpan data BPH ke database. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId || isLoading) return;
    setIsLoading(true);

    try {
      const updated = activePengurus.filter((i) => i.id !== deleteTargetId);
      setPengurus(updated);
      setDeleteTargetId(null);
      await savePengurusAction(updated);
    } catch (err) {
      console.error("[AdminPengurus] Delete error:", err);
      alert("Gagal menghapus pengurus dari database.");
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
            <Shield size={24} className="text-red-600 dark:text-red-500" />
            Kelola Pimpinan BPH (Badan Pengurus Harian)
          </h1>
          <p className="text-xs text-slate-500">
            Khusus mengelola Ketua, Wakil, Sekretaris, dan Bendahara Umum HIMSI UG (Tersinkronisasi 100% dengan Supabase DB & Beranda Utama).
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer"
        >
          <Plus size={16} /> Tambah BPH Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau jabatan pimpinan BPH..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Pengurus Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
          <User size={40} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada data Pimpinan BPH</p>
          <p className="text-xs text-slate-500">Klik &quot;Tambah BPH Baru&quot; untuk memasukkan pimpinan kabinet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4 text-center">
                {/* Avatar / Foto */}
                <div className="relative w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-red-500/20 group-hover:border-red-500/60 transition-colors">
                  <img
                    src={getValidImageUrl(item.fotoUrl, item.nama)}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                    {item.nama}
                  </h3>
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    {item.jabatan}
                  </p>
                  <span className="inline-block text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    BPH • Periode {item.periode}
                  </span>
                </div>

                {/* Social Media Links */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  {item.instagram && (
                    <a
                      href={item.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 hover:scale-110 transition-transform"
                      title="Instagram"
                    >
                      <InstagramIcon size={14} />
                    </a>
                  )}
                  {item.linkedin && (
                    <a
                      href={item.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                      title="LinkedIn"
                    >
                      <LinkedinIcon size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
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
          ))}
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
                  {editingItem ? "Edit Data BPH" : "Tambah Pimpinan BPH"}
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
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="e.g. Muhammad Fathir, S.Kom"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    Jabatan Pimpinan BPH *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    placeholder="e.g. Ketua Himpunan / Wakil / Sekretaris Umum"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                  />
                </div>

                {/* Upload Foto Galeri / URL */}
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    Foto Profil (Galeri HP/PC atau URL)
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={formData.fotoUrl}
                        onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Upload size={14} /> Upload Galeri
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      Link LinkedIn (Opsional)
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      Link Instagram (Opsional)
                    </label>
                    <input
                      type="url"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 text-xs"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
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
                    disabled={isLoading || !formData.nama.trim() || !formData.jabatan.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> Simpan BPH
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
        title="Hapus Data BPH"
        description="Apakah Anda yakin ingin menghapus data Pimpinan BPH ini secara permanen dari Supabase Database?"
      />
    </div>
  );
}
